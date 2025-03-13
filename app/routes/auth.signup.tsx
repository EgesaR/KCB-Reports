// app/routes/users/new.tsx
import { useActionData, Form } from "@remix-run/react";
import Stepper from "~/components/Stepper";
//import "~/styles/styles.css";

interface ActionData {
  error?: string;
}

export default function CreateUserPage() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="w-full h-screen text-black dark:text-white overflow-hidden relative isolate bg-white dark:bg-gray-950">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.7%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="w-full h-screen grid place-content-center">
        <Stepper />
      </div>
    </div>
  );
}

/*
<div className="bg-gradient-to-bl from-blue-300 via-sky-300 to-purple-400 w-full h-full flex justify-center items-center relative dark:from-blue-600 dark:via-sky-600 dark:to-purple-700">
        <div
          className="h-full w-full opacity-5 absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%2318181b'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
          }}
        />
        <div className="h-[80%] w-[75%] flex flex-col justify-center z-10 bg-white/30 px-8 rounded-md backdrop-blur-md gap-6">
          <h1 className="text-7xl sm:text-6xl">Let's make a difference</h1>
          <p className="text-neutral-200 text-lg">
            Let's build the next big thing for our eduction.
          </p>
        </div>
      </div>
      <div className="w-full flex justify-center py-16">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-4xl font-medium mb-2">Hey, there</h1>
            <p className="text-neutral-200">
              Welcome to KCB Reports. It is a previlage to meet you.
            </p>
          </div>
          {actionData?.error && (
            <p style={{ color: "red" }}>{actionData.error}</p>
          )}
          <Form method="post" action="/api/users">
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
      </div>
*/