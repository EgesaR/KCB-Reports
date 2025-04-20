import { json } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import type { ActionFunction } from "@remix-run/node";

const userSchema = z.object({
  name: z.string().regex(/^[A-Za-z\s]+$/, "Name must contain only letters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dob: z
    .string()
    .refine((val) => new Date(val) < new Date(), "DOB must be in the past"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
});

const teacherProfileSchema = z.object({
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  classes: z.array(z.string()).min(1, "Select at least one class"),
  streams: z.string().optional(),
  departmentGroup: z.string().optional(),
});

const adminProfileSchema = z.object({
  adminRole: z.string().min(1, "Select an admin role"),
});

const parentProfileSchema = z.object({
  studentIds: z.array(z.string()).min(1, "Select at least one student"),
});

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.json();
    const { role, ...data } = formData;

    const userData = userSchema.parse({
      name: data.name,
      email: data.email,
      password: data.password,
      dob: data.dob,
      phone: data.phone,
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    const password = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password,
        dob: new Date(userData.dob),
        contact: userData.phone,
        schools: data.schools ? JSON.stringify(data.schools) : null,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        role,
      },
    });

    if (role === "Teacher") {
      const profileData = teacherProfileSchema.parse(data.teacherProfile);
      await prisma.teacherProfile.create({
        data: {
          userId: user.id,
          subjects: JSON.stringify(profileData.subjects),
          classes: JSON.stringify(profileData.classes),
          streams: profileData.streams || "",
          departmentGroup: profileData.departmentGroup || "",
        },
      });
    } else if (role === "Admin") {
      const adminData = adminProfileSchema.parse(data.adminProfile);
      const adminRole = await prisma.adminRole.findFirst({
        where: { roleName: adminData.adminRole },
      });
      if (adminRole) {
        await prisma.userAdminRole.create({
          data: {
            userId: user.id,
            adminRoleId: adminRole.id,
          },
        });
      }
    } else if (role === "Parent") {
      const parentData = parentProfileSchema.parse(data.parentProfile);
      for (const studentId of parentData.studentIds) {
        await prisma.userStudent.create({
          data: {
            userId: user.id,
            studentId,
          },
        });
      }
    }

    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json(
      { success: false, message: "Invalid JSON or registration failed" },
      { status: 400 }
    );
  }
};

// New endpoint to check email existence
export const checkEmail: ActionFunction = async ({ request }) => {
  const { email } = await request.json();
  const user = await prisma.user.findUnique({ where: { email } });
  return json({ exists: !!user });
};

// New endpoint to search students by name and school
export const searchStudents: ActionFunction = async ({ request }) => {
  const { name, schoolId } = await request.json();
  const students = await prisma.student.findMany({
    where: {
      name: { contains: name, mode: "insensitive" },
      class: { schoolId },
    },
    select: {
      id: true,
      name: true,
      studentId: true,
      class: { select: { name: true } },
    },
  });
  return json(
    students.map((s) => ({
      id: s.id,
      name: s.name,
      studentId: s.studentId,
      class: s.class.name,
      image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${s.studentId}`, // Placeholder image
    }))
  );
};

// New endpoint to get subjects by school
export const getSubjects: ActionFunction = async ({ request }) => {
  const { schoolId } = await request.json();
  const subjects = await prisma.subject.findMany({
    where: {
      userSubjects: { some: { user: { schools: { contains: schoolId } } } },
    },
    select: { name: true },
  });
  return json(subjects.map((s) => s.name));
};
