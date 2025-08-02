// routes/dashboard.tsx
import { LoaderFunction, json, redirect } from "@remix-run/node";
import { User } from "~/types/user"; // Import your User type if needed
import { getUserFromSession } from "~/utlis/auth";

// Define the structure of data returned by the loader
interface LoaderData {
  user: User;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);
  if (!user) {
    return redirect("/auth/login");
  }
  return json<LoaderData>({ user });
};

// Update the Dashboard component to accept the correct typed data
export default function Dashboard({ data }: { data: LoaderData }) {
  return <div>Welcome {data.user.name}</div>;
}
