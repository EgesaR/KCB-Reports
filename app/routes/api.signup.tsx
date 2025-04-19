import { json, redirect } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { hashPassword } from "~/utils/auth.server";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  roles: z.array(z.enum(["ADMIN", "PARENT", "TEACHER"])),
  schools: z.array(z.string()).optional(),
  teacherProfile: z
    .object({
      subjects: z.array(z.string()),
      classes: z.array(z.string()),
      schools: z.array(z.string()),
      streams: z.string().optional(), // Keep optional to match form
      departmentGroup: z.string().optional(), // Keep optional to match form
    })
    .optional(),
  adminProfile: z
    .object({
      schools: z.array(z.string()),
      adminRoles: z.array(z.string()),
    })
    .optional(),
  parentProfile: z
    .object({
      schools: z.array(z.string()),
      childrenIds: z.array(z.string()),
    })
    .optional(),
});

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    roles: JSON.parse(formData.get("roles") as string),
    schools: formData.get("schools")
      ? JSON.parse(formData.get("schools") as string)
      : [],
    teacherProfile: formData.get("teacherProfile")
      ? JSON.parse(formData.get("teacherProfile") as string)
      : undefined,
    adminProfile: formData.get("adminProfile")
      ? JSON.parse(formData.get("adminProfile") as string)
      : undefined,
    parentProfile: formData.get("parentProfile")
      ? JSON.parse(formData.get("parentProfile") as string)
      : undefined,
  };

  const result = SignupSchema.safeParse(rawData);
  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 });
  }

  const {
    name,
    email,
    password,
    roles,
    schools,
    teacherProfile,
    adminProfile,
    parentProfile,
  } = result.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return json({ errors: { email: "User already exists" } }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      schools,
      roles: { create: roles.map((role) => ({ role })) },
    },
  });

  if (teacherProfile) {
    await prisma.teacherProfile.create({
      data: {
        userId: user.id,
        subjects: teacherProfile.subjects.join(", "), // Adjust for Text field
        classes: teacherProfile.classes.join(", "),
        streams: teacherProfile.streams || "", // Default to empty string
        departmentGroup: teacherProfile.departmentGroup || "", // Default to empty string
      },
    });
  }
  if (adminProfile) {
    // Fetch adminRole IDs beforehand
    const adminRoleIds = await Promise.all(
      adminProfile.adminRoles.map(async (role) => {
        const adminRole = await prisma.adminRole.findUnique({
          where: { roleName: role },
        });
        return adminRole?.id || 1; // Fallback to ID 1
      })
    );
    await prisma.userAdminRole.createMany({
      data: adminRoleIds.map((adminRoleId, index) => ({
        userId: user.id,
        adminRoleId,
      })),
    });
  }
  if (parentProfile) {
    await prisma.userStudent.createMany({
      data: parentProfile.childrenIds.map((studentId) => ({
        userId: user.id,
        studentId,
      })),
    });
  }

  return redirect("/dashboard");
};
