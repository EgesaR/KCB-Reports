import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import bcrypt from "bcryptjs";
import { createUserSession } from "~/utils/session.server";
import { z } from "zod";

// Define a schema for form validation using zod
const SignupSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  roles: z
    .array(z.enum(["ADMIN", "PARENT", "TEACHER"]))
    .min(1, "At least one role is required."),
  schools: z.array(z.string()).optional(), // Array of school IDs
});

// Loader function (optional, for handling GET requests)
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Handle GET requests if needed
  return json(
    { message: "This endpoint only accepts POST requests." },
    { status: 405 }
  );
};

// Action function for handling POST requests
export const action = async ({ request }: ActionFunctionArgs) => {
  // Parse form data from the request
  const formData = await request.formData();

  // Convert form data to a plain object
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    roles: JSON.parse(formData.get("roles") as string[]), // Parse stringified array
    schools: JSON.parse(formData.get("schools") as string[]), // Parse stringified array
  };

  console.log("Raw form data:", rawData); // Log raw form data

  // Validate form data using zod
  const result = SignupSchema.safeParse(rawData);

  if (!result.success) {
    console.log("Validation errors:", result.error.flatten()); // Log validation errors
    return json({ errors: result.error.flatten() }, { status: 400 });
  }

  const { name, email, password, roles, schools = [] } = result.data;

  console.log("Validated form data:", {
    name,
    email,
    password,
    roles,
    schools,
  }); // Log validated data

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    console.log("Existing user check:", existingUser); // Log existing user check

    if (existingUser) {
      console.log("User already exists with email:", email); // Log duplicate email
      return json(
        { errors: { email: "A user with this email already exists." } },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully"); // Log password hashing

    // Create the user with nested roles and schools
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: {
          create: roles.map((role) => ({ role })), // Create nested roles
        },
        schools: {
          create: schools.map((schoolId) => ({ schoolId })), // Create nested schools
        },
      },
    });

    console.log("User created successfully:", user); // Log created user

    // Log in the user and redirect to the dashboard
    return createUserSession(user.id, "/dashboard");
  } catch (error) {
    console.error("Error during signup:", error); // Log unexpected errors
    return json(
      {
        errors: { general: "An unexpected error occurred. Please try again." },
      },
      { status: 500 }
    );
  }
};
