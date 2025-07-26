import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(import.meta.env.VITE_DATABASE_URL!);
console.log(import.meta.env.VITE_DATABASE_URL);
const db = drizzle({ client: sql });

const TryPart = async () => {
  await db.insert(horses).values({
    name: "Man-o-war",
    breed: "Thoroughbred",
  });
  const myHorses = await db.query.horses.findMany({
    where: eq(horses.breed, "Thoroughbred"),
  });
  return <div></div>;
};

export default TryPart;
