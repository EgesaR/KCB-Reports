import { json, type ActionFunctionArgs } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { requireUserId } from "~/utils/session.server";
import type { Prisma } from "@prisma/client";

// Define strict types for action responses
interface SuccessResponse {
  success: true;
  count: number;
  firstReport: {
    id: string;
    title: string;
    // Include other necessary fields from ReportTask
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
}

type ActionResponse = SuccessResponse | ErrorResponse;

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<ActionResponse | Response> => {
  const userId = await requireUserId(request);

  try {
    // Verify admin privileges
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        adminRoles: {
          include: { adminRole: true },
        },
      },
    });

    if (
      !user?.adminRoles.some(
        (role) => role.adminRole.roleName === "REPORT_ADMIN"
      )
    ) {
      return json<ErrorResponse>({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch students with marks
    const students = await prisma.student.findMany({
      take: 120,
      orderBy: { createdAt: "asc" },
      include: {
        marks: {
          include: { student: true, teacher: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (students.length === 0) {
      return json<ErrorResponse>(
        { error: "No students found" },
        { status: 404 }
      );
    }

    // Batch processing
    const BATCH_SIZE = 20;
    const reports = [];

    for (let i = 0; i < students.length; i += BATCH_SIZE) {
      const batch = students.slice(i, i + BATCH_SIZE);
      const batchReports = await Promise.all(
        batch.map(async (student) => {
          // Calculate stats
          const averageScore =
            student.marks.length > 0
              ? student.marks.reduce((sum, mark) => sum + mark.mark, 0) /
                student.marks.length
              : 0;

          const highestSubject =
            student.marks.length > 0
              ? student.marks.reduce((prev, current) =>
                  prev.mark > current.mark ? prev : current
                ).subject
              : "N/A";

          const lowestSubject =
            student.marks.length > 0
              ? student.marks.reduce((prev, current) =>
                  prev.mark < current.mark ? prev : current
                ).subject
              : "N/A";

          // Create metadata
          const metadata = {
            averageScore: averageScore.toFixed(2),
            performance: getPerformanceCategory(averageScore),
            highestSubject,
            lowestSubject,
            totalExams: student.marks.length,
            lastUpdated: new Date().toISOString(),
            grade: getGrade(averageScore),
            scoreDistribution: {
              "0-30": student.marks.filter((m) => m.mark <= 30).length,
              "31-50": student.marks.filter((m) => m.mark > 30 && m.mark <= 50)
                .length,
              "51-75": student.marks.filter((m) => m.mark > 50 && m.mark <= 75)
                .length,
              "76-90": student.marks.filter((m) => m.mark > 75 && m.mark <= 90)
                .length,
              "91-100": student.marks.filter((m) => m.mark > 90).length,
            },
          };

          // Create report
          return prisma.reportTask.create({
            data: {
              title: `Term Report - ${student.name}`,
              description: `Comprehensive performance report for ${student.name}`,
              createdById: userId,
              metadata: metadata as Prisma.InputJsonValue,
              marks: {
                connect: student.marks.map((mark) => ({ id: mark.id })),
              },
            },
            include: {
              marks: true,
              createdBy: {
                select: { id: true, name: true, profilePicture: true },
              },
            },
          });
        })
      );

      reports.push(...batchReports);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Throttle
    }

    return json<SuccessResponse>({
      success: true,
      count: reports.length,
      firstReport: reports[0],
    });
  } catch (error) {
    console.error("Report generation failed:", error);
    return json<ErrorResponse>(
      {
        error: "Failed to generate reports",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};

// Performance grading helpers
function getPerformanceCategory(averageScore: number): string {
  if (averageScore >= 90) return "Excellent";
  if (averageScore >= 75) return "Very Good";
  if (averageScore >= 60) return "Good";
  if (averageScore >= 50) return "Average";
  if (averageScore >= 30) return "Below Average";
  return "Poor";
}

function getGrade(averageScore: number): string {
  if (averageScore >= 90) return "A";
  if (averageScore >= 75) return "B";
  if (averageScore >= 60) return "C";
  if (averageScore >= 50) return "D";
  if (averageScore >= 30) return "E";
  return "F";
}
