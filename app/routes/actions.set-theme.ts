import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const newTheme = form.get("theme");
  if (newTheme !== "dark" && newTheme !== "light") {
    return redirect("/");
  }

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  session.set("theme", newTheme);

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};
