// seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create user
    const user = await prisma.user.create({
      data: {
        name: "Egesa Raymond",
        email: "egesaraymond644@gmail.com",
        password: await bcrypt.hash("3f7jer03", 10),
        roles: {
          create: [{ role: "ADMIN" }],
        },
        // Add other required fields from your schema
        profilePicture: null,
        dob: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        roles: true,
      },
    });

    console.log("Created user:", user);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
