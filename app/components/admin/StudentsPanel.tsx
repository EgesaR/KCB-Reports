// app/components/admin/StudentsPanel.tsx
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import type { loader as studentsLoader } from "~/routes/api.admin.students";

export default function StudentsPanel() {
  const { students, total, page, totalPages } =
    useLoaderData<typeof studentsLoader>();
  const fetcher = useFetcher();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Students Management</h3>
        <button className="bg-[#751d91] text-white px-4 py-2 rounded-lg">
          Add Student
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full p-2 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Parents</th>
                <th className="px-6 py-3 text-left">Class</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">
                    {student.users
                      .filter((u) =>
                        u.user.roles.some((r) => r.role === "PARENT")
                      )
                      .map((u) => u.user.name)
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4">-</td>
                  <td className="px-6 py-4 space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            Showing {students.length} of {total} students
          </div>
          <div className="flex space-x-2">
            <button disabled={page <= 1} className="px-3 py-1 border rounded">
              Previous
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
