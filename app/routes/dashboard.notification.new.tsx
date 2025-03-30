// app/routes/dashboard.notifications.create.tsx
import { prisma } from "~/utils/prisma.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { getUserId } from "~/utils/session.server";

// Define notification types as a const enum to match Prisma schema
const NOTIFICATION_TYPES = {
  INFO: { value: "INFO", label: "Information" },
  WARNING: { value: "WARNING", label: "Warning" },
  ERROR: { value: "ERROR", label: "Error" },
  TEST: { value: "TEST", label: "Test" },
  GENERAL: { value: "GENERAL", label: "General" },
  ALERT: { value: "ALERT", label: "Alert" },
  SUCCESS: { value: "SUCCESS", label: "Success" },
} as const;

type NotificationType = keyof typeof NOTIFICATION_TYPES;

interface FormFields {
  title: string;
  message: string;
  type: NotificationType;
}

interface ActionData {
  error?: string;
  fields?: Partial<FormFields>;
}

// Type guard to validate notification types
function isNotificationType(value: string): value is NotificationType {
  return value in NOTIFICATION_TYPES;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) throw new Response("Unauthorized", { status: 401 });

  return json({
    defaultType: "GENERAL" as NotificationType,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) return json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const title = formData.get("title")?.toString()?.trim() || "";
  const message = formData.get("message")?.toString()?.trim() || "";
  let type = formData.get("type")?.toString();

  // Validate and set default type if invalid
  if (!type || !isNotificationType(type)) {
    type = "GENERAL";
  }

  // Validation
  const errors: string[] = [];
  if (!title) errors.push("Title is required");
  if (!message) errors.push("Message is required");
  if (title.length > 100) errors.push("Title must be ≤ 100 characters");

  if (errors.length > 0) {
    return json(
      { 
        error: errors.join(". "), 
        fields: { title, message, type: type as NotificationType } 
      },
      { status: 400 }
    );
  }

  try {
    // Verify notifications table exists
    await prisma.$queryRaw`SELECT 1 FROM notifications LIMIT 1`;

    const newNotification = await prisma.notification.create({
      data: {
        title,
        message,
        type: NOTIFICATION_TYPES[type as NotificationType].value,
        userId,
        date: new Date(),
        read: false,
        archived: false,
      },
    });

    return redirect(`/dashboard/notifications/${newNotification.id}`);
  } catch (error: any) {
    console.error("Notification creation failed:", error);
    
    const errorMessage = error.code === "P2021" 
      ? "Notifications system unavailable. Try again later."
      : "Failed to create notification";

    return json(
      { 
        error: errorMessage,
        fields: { title, message, type: type as NotificationType }
      },
      { status: error.code === "P2021" ? 503 : 500 }
    );
  }
};

export default function CreateNotificationPage() {
  const { defaultType } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Notification</h1>

      {actionData?.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {actionData.error}
        </div>
      )}

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            maxLength={100}
            defaultValue={actionData?.fields?.title || ""}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            aria-invalid={Boolean(actionData?.error && !actionData.fields?.title)}
          />
        </div>

        <div>
          <label htmlFor="message" className="block mb-1 font-medium">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            defaultValue={actionData?.fields?.message || ""}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            aria-invalid={Boolean(actionData?.error && !actionData.fields?.message)}
          />
        </div>

        <div>
          <label htmlFor="type" className="block mb-1 font-medium">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={actionData?.fields?.type || defaultType}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(NOTIFICATION_TYPES).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create Notification"}
        </button>
      </Form>
    </div>
  );
}