import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { requireUserId } from "~/utils/session.server";
import Button from "~/components/Button";
import type { Prisma } from "@prisma/client";
import Spinner from "~/components/Spinner";
import type { ReactNode } from "react";

// Define all possible action return types
type ActionErrorResponse = {
  ok: false;
  error: string;
  details?: string;
};

type ActionResponse = ActionErrorResponse | ReturnType<typeof redirect>;

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<ActionResponse> => {
  const userId = await requireUserId(request);

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");

    // Validate form inputs
    if (!title || typeof title !== "string") {
      return json<ActionErrorResponse>(
        {
          ok: false,
          error: "Title is required",
          details: "Please provide a title for the report",
        },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return json<ActionErrorResponse>(
        {
          ok: false,
          error: "Title too long",
          details: "Title must be less than 200 characters",
        },
        { status: 400 }
      );
    }

    // Create new report
    const report = await prisma.reportTask.create({
      data: {
        title,
        description: description ? String(description) : null,
        createdById: userId,
        metadata: {
          status: "draft",
          createdAt: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
      select: {
        id: true,
      },
    });

    return redirect(`/dashboard/reports/${report.id}/edit`);
  } catch (error) {
    console.error("Failed to create report:", error);
    return json<ActionErrorResponse>(
      {
        ok: false,
        error: "Failed to create report",
        details:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
};

export default function NewReport() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Safe error details rendering
  const renderErrorDetails = (): ReactNode => {
    if (!actionData || !("ok" in actionData) || actionData.ok) return null;
    return actionData.details ? (
      <p className="text-sm mt-1">{actionData.details}</p>
    ) : null;
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Report</h1>
        <p className="text-gray-600 mt-2">
          Start by providing basic information about your report
        </p>
      </header>

      {/* Error display */}
      {actionData && "ok" in actionData && !actionData.ok && (
        <div
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r"
          role="alert"
        >
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="font-medium">{actionData.error}</h3>
          </div>
          {renderErrorDetails()}
        </div>
      )}

      <Form method="post" className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Report Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            maxLength={200}
            className="block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-blue-500 focus:ring-blue-500 
                      sm:text-sm p-2.5 border"
            placeholder="e.g., Quarterly Performance Report"
            aria-describedby="title-help"
          />
          <p id="title-help" className="text-xs text-gray-500">
            Maximum 200 characters
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-blue-500 focus:ring-blue-500 
                      sm:text-sm p-2.5 border"
            placeholder="Optional description of the report's purpose"
            aria-describedby="description-help"
          />
          <p id="description-help" className="text-xs text-gray-500">
            Provide any additional context about this report
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            as="link"
            to="/dashboard/reports"
            variant="outline"
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="px-4 py-2">
            {isSubmitting ? (
              <span className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                Creating Report...
              </span>
            ) : (
              "Create Report"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r">
      <div className="flex items-center mb-2">
        <svg
          className="h-5 w-5 text-red-500 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <h2 className="font-bold">Report Creation Error</h2>
      </div>
      <p className="mb-4">{error.message}</p>
      <Button
        as="link"
        to="/dashboard/reports"
        variant="primary"
        className="mt-2"
      >
        Return to Reports
      </Button>
    </div>
  );
}
