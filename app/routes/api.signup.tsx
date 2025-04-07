import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { hashPassword } from "~/utils/auth.server";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  roles: z.array(z.enum(["ADMIN", "PARENT", "TEACHER", "STUDENT"])),
  schools: z.array(z.string()).optional(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    roles: JSON.parse(formData.get("roles") as string), // Parse as string first
    schools: JSON.parse(formData.get("schools") as string), // Parse as string first
  };

  const result = SignupSchema.safeParse(rawData);

  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 });
  }

  const { name, email, password, roles, schools = [] } = result.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return json({ errors: { email: "User already exists" } }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      roles: {
        create: roles.map((role) => ({ role })),
      },
      schools: schools, // Stored as JSON
    },
  });

  return redirect("/dashboard");
};
