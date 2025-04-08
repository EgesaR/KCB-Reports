// app/types/blog.ts
import type {
  PostStatus as PrismaPostStatus,
  NotificationType as PrismaNotificationType,
  ThemePreference,
  User as PrismaUser,
  Post as PrismaPost,
  Blog as PrismaBlog,
  Category,
  UserRole,
  Notification as PrismaNotification,
} from "@prisma/client";
import type { JsonValue } from "@prisma/client/runtime/library";

export const RoleEnum = {
  ADMIN: "ADMIN",
  PARENT: "PARENT",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  USER: "USER", // Note: Not in your Prisma schema, consider removing if not needed
} as const;
export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];

export type PostStatus = PrismaPostStatus;
export type NotificationType = PrismaNotificationType;

export interface Blog extends Omit<PrismaBlog, "publishedAt" | "updatedAt"> {
  publishedAt: Date | string;
  updatedAt: Date | string;
  posts?: Post[];
  pages?: Page[];
}

export interface Post
  extends Omit<PrismaPost, "publishedAt" | "updatedAt" | "blog"> {
  publishedAt: Date | string;
  updatedAt: Date | string;
  categories: { name: string; id?: string }[];
  blog?: Blog;
  relatedPosts?: Post[];
}

export interface Page {
  id: string;
  title: string;
  content: string;
  blogId: string;
  publishedAt: Date | string;
  updatedAt: Date | string;
  blog?: Blog;
}

export interface CategoryWithPosts extends Category {
  posts?: Post[];
}

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  from?: string;
}

export interface User
  extends Omit<
    PrismaUser,
    | "createdAt"
    | "updatedAt"
    | "dob"
    | "resetTokenExpiry"
    | "googleTokenExpiry"
    | "roles"
  > {
  roles: RoleEnum[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  dob?: Date | string | null;
  resetTokenExpiry?: Date | string | null;
  googleTokenExpiry?: Date | string | null;
  teacherProfile?: TeacherProfile | null;
  students?: Student[];
  notifications?: Notification[];
}

export interface TeacherProfile {
  id: string;
  userId: string;
  subjects: string;
  classes: string;
  streams: string;
  departmentGroup?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
  departments?: Department[];
}

export interface Department {
  id: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  teacherProfiles?: TeacherProfile[];
}

export interface Student {
  id: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  marks?: Mark[];
  users?: User[];
}

export interface Mark {
  id: string;
  subject: string;
  examinationName: string;
  mark: number;
  createdAt: Date | string;
  studentId: string;
  teacherId?: string | null;
  adminId?: string | null;
  parentId?: string | null;
  updatedAt: Date | string;
  student?: Student;
  teacher?: User | null;
  admin?: User | null;
  parent?: User | null;
}

export interface Notification
  extends Omit<PrismaNotification, "createdAt" | "updatedAt" | "date"> {
  createdAt: Date | string;
  updatedAt: Date | string;
  date: Date | string;
  user?: User;
}

export interface UserRoleWithUser extends UserRole {
  user?: User;
}

export interface ReportTask {
  id: string;
  title: string;
  description?: string | null;
  createdAt: Date | string;
  createdById: string;
  teacherId?: string | null;
  updatedAt: Date | string;
  createdBy?: User;
  teacher?: User | null;
}

export type Jsonify<T> = {
  [P in keyof T]: T[P] extends Date
    ? string
    : T[P] extends Date | null
    ? string | null
    : T[P] extends Date | undefined
    ? string | undefined
    : T[P] extends Date | null | undefined
    ? string | null | undefined
    : T[P];
};

// Utility types for API responses
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
};
