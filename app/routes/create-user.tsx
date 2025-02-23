import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import { prisma } from "~/db.server";

// Define your enum roles as a string union to match your Prisma enum
const validRoles = ["ADMIN", "PARENT", "TEACHER"] as const;
type Role = (typeof validRoles)[number];

interface ActionData {
  error?: string;
}

// Loader can be used to pre-load any data if needed (here we just pass an empty json)
export let loader: LoaderFunction = async () => {
  return json({});
};

// The action handles the POST request to create the user
export let action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const roles = formData.getAll("roles");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name ||
    !email ||
    !password ||
    roles.length === 0
  ) {
    return json<ActionData>(
      { error: "Invalid form submission." },
      { status: 400 }
    );
  }

  // Validate roles – only allow valid role values
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
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In production, please hash your password before storing
        roles: {
          create: selectedRoles.map((role) => ({ role })),
        },
      },
    });
    // After creating the user, redirect to a success page or back to the form.
    return redirect(`/users/${user.id}`);
  } catch (error) {
    console.error(error);
    return json<ActionData>({ error: "Error creating user." }, { status: 500 });
  }
};

export default function CreateUserPage() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="bg-white mt-20">
      <h1>Create User</h1>
      {actionData?.error ? (
        <p style={{ color: "red" }}>{actionData.error}</p>
      ) : null}
      <Form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" required />
          </label>
        </div>
        <div>
          <label>
            Email: <input type="email" name="email" required />
          </label>
        </div>
        <div>
          <label>
            Password: <input type="password" name="password" required />
          </label>
        </div>
        <fieldset>
          <legend>Select Roles:</legend>
          <label>
            <input type="checkbox" name="roles" value="ADMIN" />
            Admin
          </label>
          <label>
            <input type="checkbox" name="roles" value="PARENT" />
            Parent
          </label>
          <label>
            <input type="checkbox" name="roles" value="TEACHER" />
            Teacher
          </label>
        </fieldset>
        <div>
          <button type="submit">Create User</button>
        </div>
      </Form>
    </div>
  );
}
