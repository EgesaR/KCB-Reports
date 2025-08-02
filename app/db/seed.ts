import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
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
import * as schema from "./schema";

// Initialize database
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Generate long password
const generatePassword = (base = "flower123", length = 64): string =>
  base.repeat(Math.ceil(length / base.length)).slice(0, length);

const main = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Delete in correct FK order
    await db.delete(marks);
    await db.delete(markRules);
    await db.delete(teacherSubjects);
    await db.delete(studentProfiles);
    await db.delete(userSchools);
    await db.delete(userRoles);
    await db.delete(subjects);
    await db.delete(departments);
    await db.delete(schools);
    await db.delete(users);

    // Seed schools
    const [greenwood, blueSky] = await db
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
    const [physicsDept, mathDept, historyDept] = await db
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

    // Seed subjects
    const insertedSubjects = await db
      .insert(subjects)
      .values([
        {
          name: "Physics",
          departmentId: physicsDept.id,
          category: "compulsory",
        },
        { name: "Math", departmentId: mathDept.id, category: "compulsory" },
        {
          name: "History",
          departmentId: historyDept.id,
          category: "compulsory",
        },
        { name: "ICT", departmentId: physicsDept.id, category: "vocational" },
        { name: "Art", departmentId: physicsDept.id, category: "other" },
      ])
      .returning();

    const [physics, math] = insertedSubjects;

    // Seed users
    const [alice, bob, charlie, david] = await db
      .insert(users)
      .values([
        {
          name: "Alice Johnson",
          email: "alice.johnson@example.com",
          password: await hashPassword("flower123"),
        },
        {
          name: "Bob Smith",
          email: "bob.smith@example.com",
          password: await hashPassword("flower123"),
        },
        {
          name: "Charlie Green",
          email: "charlie.green@example.com",
          password: await hashPassword("flower123"),
        },
        {
          name: "David Brown",
          email: "david.brown@example.com",
          password: await hashPassword("flower123"),
        },
      ])
      .returning();

    // Assign roles
    await db.insert(userRoles).values([
      { userId: alice.id, role: "admin" },
      { userId: bob.id, role: "teacher" },
      { userId: charlie.id, role: "student" },
      { userId: david.id, role: "parent" },
    ]);

    // Link users to schools
    await db.insert(userSchools).values([
      { userId: alice.id, schoolId: greenwood.id },
      { userId: bob.id, schoolId: greenwood.id },
      { userId: david.id, schoolId: greenwood.id },
      { userId: david.id, schoolId: blueSky.id },
    ]);

    // Seed student profile
    const [charlieProfile] = await db
      .insert(studentProfiles)
      .values([
        {
          userId: charlie.id,
          lin: "S12345",
          sex: "M",
          dob: "2005-02-20",
          age: 19,
          studentNumber: "12345",
          class: "Class 1",
          stream: "Science",
          schoolId: greenwood.id,
        },
      ])
      .returning();

    // Assign teacher subjects
    await db.insert(teacherSubjects).values([
      { teacherId: bob.id, subjectId: physics.id },
      { teacherId: bob.id, subjectId: math.id },
    ]);

    // Seed mark rules
    const [physicsRule, mathRule] = await db
      .insert(markRules)
      .values([
        { subjectId: physics.id, rule: "100" },
        { subjectId: math.id, rule: "80" },
      ])
      .returning();

    // Seed marks
    await db.insert(marks).values([
      {
        studentId: charlieProfile.id, // ✅ Correct FK ID
        subjectId: physics.id,
        markTitle: "End Of Term",
        markValue: 85,
        teacherId: bob.id,
        markRuleId: physicsRule.id,
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
