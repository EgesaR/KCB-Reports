// app/routes/dashboard.tsx
import { LoaderFunction, redirect } from "@remix-run/node";
import { getUserSession } from "~/utils/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);
  if (!session.has("userId")) {
    return redirect("/auth/signin");
  }
  return null;
};

export default function Dashboard() {
  return <h1>Welcome to your Dashboard!</h1>;
}
