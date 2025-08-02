// routes/auth/logout.tsx
import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/session.server";

export const action = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
