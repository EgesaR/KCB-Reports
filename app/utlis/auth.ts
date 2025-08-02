// app/utils/auth.ts
import { db } from "~/db/client"; // Your initialized Drizzle db
import { users } from "~/db/schema"; // Your Drizzle schema
import { getSession } from "~/session.server"; // Your session logic
import { eq } from "drizzle-orm"; // ✅ Import eq from drizzle-orm

export const getUserFromSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) return null;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId)) // ✅ Fixed: using eq() here
    .limit(1);

  return user[0] || null;
};
