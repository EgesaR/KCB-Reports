import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Schools table
export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User-Roles table to manage different roles
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role").notNull(), // admin, teacher, parent, student
});

// Link Users to Schools (teachers and parents can belong to multiple schools)
export const userSchools = pgTable("user_schools", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  schoolId: integer("school_id")
    .notNull()
    .references(() => schools.id),
});

// Student Profiles table
export const studentProfiles = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  lin: text("lin").notNull(),
  sex: text("sex"),
  dob: text("dob"), // Date of Birth
  age: integer("age"),
  studentNumber: text("student_number").notNull(),
  class: text("class"),
  stream: text("stream"),
  schoolId: integer("school_id")
    .notNull()
    .references(() => schools.id), // Linking student to a school
});

// Teacher-Subjects table
export const teacherSubjects = pgTable("teacher_subjects", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id")
    .notNull()
    .references(() => users.id),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  departmentId: integer("department_id")
    .notNull()
    .references(() => departments.id),
  category: text("category"), // compulsory, vocational, other
});

// Departments table
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

// Marks table to store student marks
export const marks = pgTable("marks", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => studentProfiles.id),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id),
  markTitle: text("mark_title").notNull(), // "End Of Term", "Beginning Of Term"
  markValue: integer("mark_value").notNull(),
  teacherId: integer("teacher_id")
    .notNull()
    .references(() => users.id),
  markRuleId: integer("mark_rule_id")
    .notNull()
    .references(() => markRules.id),
  status: text("status").notNull(), // submitted, pending
});

// Mark Rules table (standard rules for marks)
export const markRules = pgTable("mark_rules", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id),
  rule: text("rule").notNull(), // E.g., "100", "80", etc.
});
