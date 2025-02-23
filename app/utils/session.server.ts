// app/session.server.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secrets: ["s3cr3t"],
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}

export async function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}
