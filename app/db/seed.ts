import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as bcrypt from "bcrypt";
import * as schema from "./schema";
import {
  users,
  userRoles,
  departments,
  subjects,
  studentProfiles,
  userSchools,
  teacherSubjects,
  marks,
  markRules,
  schools,
} from "./schema";
import { hashPassword } from "~/utlis/hashPassword";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Function to generate a password by repeating a base string to 64 characters
const generatePassword = (
  base: string = "flower123",
  length: number = 64
): string => {
  let password = base;
  while (password.length < length) {
    password += base;
  }
  return password.slice(0, length); // Ensure the password is exactly 64 characters
};

const main = async () => {
  try {
    console.log("Seeding database...");

    // Delete all existing data in the correct order (child -> parent)
    await db.delete(marks);
    await db.delete(teacherSubjects);
    await db.delete(studentProfiles);
    await db.delete(userSchools);
    await db.delete(userRoles);
    await db.delete(subjects);
    await db.delete(departments);
    await db.delete(schools);
    await db.delete(users);

    // Seed schools
    const insertedSchools = await db
      .insert(schools)
      .values([
        {
          name: "Greenwood International School",
          address: "123 Main St, City A",
        },
        { name: "Blue Sky Academy", address: "456 Oak St, City B" },
      ])
      .returning();

    // Seed departments
    const insertedDepartments = await db
      .insert(departments)
      .values([
        {
          name: "Physics Department",
          description: "Physics and related subjects",
        },
        { name: "Math Department", description: "Math and related subjects" },
        {
          name: "History Department",
          description: "History and related subjects",
        },
      ])
      .returning();

    // Seed subjects and link them to departments
    const insertedSubjects = await db
      .insert(subjects)
      .values([
        {
          name: "Physics",
          departmentId: insertedDepartments[0].id,
          category: "compulsory",
        },
        {
          name: "Math",
          departmentId: insertedDepartments[1].id,
          category: "compulsory",
        },
        {
          name: "History",
          departmentId: insertedDepartments[2].id,
          category: "compulsory",
        },
        {
          name: "ICT",
          departmentId: insertedDepartments[0].id,
          category: "vocational",
        },
        {
          name: "Art",
          departmentId: insertedDepartments[0].id,
          category: "other",
        },
      ])
      .returning();

    // Seed users with dynamically generated passwords and hashed
    const insertedUsers = await db
      .insert(users)
      .values([
        {
          name: "Alice Johnson",
          email: "alice.johnson@example.com",
          password: await hashPassword(generatePassword("flower123")),
        },
        {
          name: "Bob Smith",
          email: "bob.smith@example.com",
          password: await hashPassword(generatePassword("flower123")),
        },
        {
          name: "Charlie Green",
          email: "charlie.green@example.com",
          password: await hashPassword(generatePassword("flower123")),
        },
        {
          name: "David Brown",
          email: "david.brown@example.com",
          password: await hashPassword(generatePassword("flower123")),
        },
      ])
      .returning();

    const alice = insertedUsers.find((u) => u.name === "Alice Johnson");
    const bob = insertedUsers.find((u) => u.name === "Bob Smith");
    const charlie = insertedUsers.find((u) => u.name === "Charlie Green");
    const david = insertedUsers.find((u) => u.name === "David Brown");

    // Assign roles to users (admin, teacher, student, parent)
    await db.insert(userRoles).values([
      { userId: alice!.id, role: "admin" },
      { userId: bob!.id, role: "teacher" },
      { userId: charlie!.id, role: "student" },
      { userId: david!.id, role: "parent" },
    ]);

    // Link users (teachers, parents) to schools
    await db.insert(userSchools).values([
      { userId: alice!.id, schoolId: insertedSchools[0].id }, // Admin is linked to Greenwood
      { userId: bob!.id, schoolId: insertedSchools[0].id }, // Bob teaches at Greenwood
      { userId: david!.id, schoolId: insertedSchools[0].id }, // Parent is linked to Greenwood
      { userId: david!.id, schoolId: insertedSchools[1].id }, // Parent is also linked to Blue Sky
    ]);

    // Seed student profiles
    const insertedStudentProfiles = await db.insert(studentProfiles).values([
      {
        userId: charlie!.id,
        lin: "S12345",
        sex: "M",
        dob: "2005-02-20",
        age: 19,
        studentNumber: "12345",
        class: "Class 1",
        stream: "Science",
        schoolId: insertedSchools[0].id, // Linked to Greenwood
      },
    ]);

    // Assign teacher subjects
    await db.insert(teacherSubjects).values([
      { teacherId: bob!.id, subjectId: insertedSubjects[0].id }, // Bob teaches Physics
      { teacherId: bob!.id, subjectId: insertedSubjects[1].id }, // Bob teaches Math
    ]);

    // Seed marks rules
    const insertedMarkRules = await db
      .insert(markRules)
      .values([
        { subjectId: insertedSubjects[0].id, rule: "100" }, // Physics uses 100-point rule
        { subjectId: insertedSubjects[1].id, rule: "80" }, // Math uses 80-point rule
      ])
      .returning();

    // Seed marks (teacher-submitted marks for students)
    await db.insert(marks).values([
      {
        studentId: charlie!.id,
        subjectId: insertedSubjects[0].id,
        markTitle: "End Of Term",
        markValue: 85.0,
        teacherId: bob!.id,
        markRuleId: insertedMarkRules[0].id,
        status: "submitted",
      },
    ]);

    console.log("✅ Database seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

main();
