export interface User {
  id: string;
  name: string;
  email: string;
  profileUrl?: string;
  roles: string[];
  contact?: string;
  department?: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  classId: string;
  streamId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Class {
  id: number;
  name: string;
}

export interface Subject {
  id: number;
  name: string;
  description?: string;
}

export interface Stream {
  id: string;
  name: string;
  classId: number;
}

export interface ReportTask {
  id: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  createdById: string;
  teacherId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  userId: string;
  type: "TEACHER" | "PARENT";
  name: string;
  email: string;
  phone?: string;
}
