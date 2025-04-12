import type { Prisma } from "@prisma/client";

export interface ReportMetadata {
  averageScore: string;
  performance: string;
  highestSubject: string;
  lowestSubject: string;
  totalExams: number;
  lastUpdated: string;
  grade: string;
  scoreDistribution: Record<string, number>;
}

export interface ReportWithMetadata {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  metadata: Prisma.JsonValue;
  createdBy: {
    id: string;
    name: string;
    profilePicture: string | null;
  };
  marks: Array<{
    id: string;
    subject: string;
    mark: number;
  }>;
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
