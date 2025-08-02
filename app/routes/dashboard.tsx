// app/routes/dashboard.tsx
import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserFromSession } from "~/utlis/auth";

interface LoaderData {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);

  if (!user) {
    return redirect("/auth/login");
  }

  return json<LoaderData>({ user });
};

export default function Dashboard() {
  const { user } = useLoaderData<LoaderData>();

  return <div className="p-6 text-xl font-semibold">Welcome, {user.name}!</div>;
}
