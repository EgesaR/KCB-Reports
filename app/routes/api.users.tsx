import { json, redirect } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { createUserSession, requireUserId } from "~/utils/session.server";
import bcrypt from "bcryptjs";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

const validRoles = ["ADMIN", "PARENT", "TEACHER", "STUDENT"] as const;
type Role = (typeof validRoles)[number];

interface ActionData {
  error?: string;
}

// GET /api/users - Get all users (paginated)
// GET /api/users?id=:id - Get single user
export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request); // Ensure user is authenticated

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    // Get single user with roles
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        profileUrl: true,
        profilePicture: true,
        dob: true,
        accentColor: true,
        contact: true,
        department: true,
        highContrast: true,
        institutionalLogo: true,
        reportFont: true,
        studentId: true,
        themePreference: true,
        title: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return json({ error: "User not found" }, { status: 404 });
    }

    return json({
      ...user,
      roles: user.roles.map((r) => r.role),
    });
  }

  // Get paginated users with roles
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        createdAt: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);

  return json({
    users: users.map((user) => ({
      ...user,
      roles: user.roles.map((r) => r.role),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST /api/users - Create new user
// PATCH /api/users - Update user
// DELETE /api/users - Delete user
export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create": {
      // Validate and create new user with roles
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const roles = formData.getAll("roles");

      // Validate input types
      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !name.trim() ||
        !email.trim() ||
        !password.trim() ||
        roles.length === 0
      ) {
        return json<ActionData>(
          { error: "Invalid form submission. All fields are required." },
          { status: 400 }
        );
      }

      // Validate roles
      const selectedRoles = roles.filter((role): role is Role =>
        validRoles.includes(role as Role)
      );
      if (selectedRoles.length === 0) {
        return json<ActionData>(
          { error: "At least one valid role must be selected." },
          { status: 400 }
        );
      }

      try {
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            roles: {
              create: selectedRoles.map((role) => ({ role })),
            },
          },
        });

        // Automatically log in user after creation if needed
        // return createUserSession(user.id, "/dashboard");
        return json(user, { status: 201 });
      } catch (error) {
        console.error("User creation error:", error);
        return json<ActionData>(
          { error: "Error creating user. The email might already be in use." },
          { status: 500 }
        );
      }
    }

    case "update": {
      // Validate and update user
      const id = formData.get("id");
      if (!id || id.toString() !== userId) {
        return json({ error: "Unauthorized" }, { status: 403 });
      }

      const updates: any = {};
      const fields = [
        "name",
        "email",
        "profileUrl",
        "profilePicture",
        "dob",
        "accentColor",
        "contact",
        "department",
        "highContrast",
        "institutionalLogo",
        "reportFont",
        "studentId",
        "themePreference",
        "title",
        "twoFactorEnabled",
      ];

      fields.forEach((field) => {
        const value = formData.get(field);
        if (value !== null) {
          updates[field] = value?.toString();
        }
      });

      // Handle roles update if provided
      const roles = formData.getAll("roles");
      if (roles.length > 0) {
        const selectedRoles = roles.filter((role): role is Role =>
          validRoles.includes(role as Role)
        );

        if (selectedRoles.length > 0) {
          // First remove all existing roles
          await prisma.userRole.deleteMany({
            where: { userId },
          });

          // Then add the new ones
          updates.roles = {
            create: selectedRoles.map((role) => ({ role })),
          };
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updates,
        include: {
          roles: {
            select: {
              role: true,
            },
          },
        },
      });

      return json({
        ...updatedUser,
        roles: updatedUser.roles.map((r) => r.role),
      });
    }

    case "delete": {
      // Delete user
      const id = formData.get("id");
      if (!id || id.toString() !== userId) {
        return json({ error: "Unauthorized" }, { status: 403 });
      }

      await prisma.user.delete({ where: { id: userId } });
      return json({ success: true });
    }

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}
