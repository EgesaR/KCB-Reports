import { json } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { requireUserId } from "~/utils/session.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const student = await prisma.student.findUnique({
      where: { id },
      select: { id: true, name: true, studentId: true, createdAt: true },
    });
    return student
      ? json(student)
      : json({ error: "Student not found" }, { status: 404 });
  }

  const students = await prisma.student.findMany({
    select: { id: true, name: true, studentId: true, createdAt: true },
  });
  return json(students);
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create":
      const student = await prisma.student.create({
        data: {
          name: formData.get("name") as string,
          studentId: formData.get("studentId") as string,
          classId: formData.get("classId") as string, // Optional: Add if required
        },
      });
      return json(student, { status: 201 });
    case "update":
      const updatedStudent = await prisma.student.update({
        where: { id: formData.get("id") as string },
        data: {
          name: formData.get("name") as string,
          studentId: formData.get("studentId") as string,
          classId: formData.get("classId") as string, // Optional: Add if required
        },
      });
      return json(updatedStudent);
    case "delete":
      await prisma.student.delete({
        where: { id: formData.get("id") as string },
      });
      return json({ success: true });
    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}
