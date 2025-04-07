import type {
  Prisma,
  RoleEnum,
  PostStatus,
  NotificationType,
} from "@prisma/client";

export interface Blog {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  urlToImage?: string | null;
  selfLink?: string | null;
  publishedAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  imageUrl?: string | null;
  author: string;
  publishedAt: Date;
  readingTime?: number | null;
  content: string;
  blogId: string;
  createdAt: Date;
  updatedAt: Date;
  status: PostStatus;
  categories: {
    name: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: RoleEnum[];
  profileUrl?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  schools?: Prisma.JsonValue;
  googleAccessToken?: string | null;
  googleRefreshToken?: string | null;
  googleTokenExpiry?: Date | null;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  archived: boolean;
  createdAt: Date;
  userId: string;
  metadata?: Prisma.JsonValue;
}

// Utility types
export type JsonValue = Prisma.JsonValue;
export type { PostStatus, NotificationType, RoleEnum };
