// app/types/reports.d.ts
import type { Prisma } from "@prisma/client";

export type ExamType = "AOI" | "EOT" | "BOT" | "MTE" | "TT";
export type ReportStatus = "pending" | "in-progress" | "completed" | "archived";

export interface ReportMetadata {
  averageScore: string;
  performance: string;
  highestSubject: string;
  lowestSubject: string;
  totalExams: number;
  grade: string;
  scoreDistribution: Record<string, number>;
}

export interface Mark {
  id: string;
  subject: string;
  mark: number;
}

export interface CreatedBy {
  id: string;
  name: string;
  profilePicture: string | null;
}

export interface ReportItem {
  id: string;
  examType: ExamType;
  title: string;
  students: number;
  status: ReportStatus;
  lastUpdated: string;
  metadata: ReportMetadata;
  createdAt: string;
  updatedAt: string;
  createdBy: CreatedBy;
  marks: Mark[];
}

export interface ReportWithMetadata
  extends Omit<ReportItem, "examType" | "students" | "lastUpdated"> {
  description: string | null;
  metadata: Prisma.JsonValue;
}

export type ActionData =
  | {
      success: true;
      count: number;
      firstReport: ReportWithMetadata;
    }
  | {
      error: string;
      details?: string;
    };
