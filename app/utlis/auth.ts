// utils/auth.ts
import { db } from "~/db/client";
import { users } from "~/db/schema";
import { getSession } from "~/session.server";

export const getUserFromSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) return null;

  const user = await db.select().from(users).where(users.id.eq(userId)).limit(1).execute();
  return user[0] || null;
};
