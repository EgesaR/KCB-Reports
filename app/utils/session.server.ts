// app/utils/session.server.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secrets: ["s3cr3t"], // In production, use process.env.SESSION_SECRET!
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
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

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;

  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, roles: true },
    });
  } catch (error) {
    throw logout(request);
  }
}

export async function requireUserId(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/auth/signin");
  }
  return userId;
}

export async function logout(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/auth/signin", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
