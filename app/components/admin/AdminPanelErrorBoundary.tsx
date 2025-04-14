// app/components/admin/AdminPanelErrorBoundary.tsx
import { useRouteError } from "@remix-run/react";

export function AdminPanelErrorBoundary() {
  const error = useRouteError();
  return (
    <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
      <h3 className="font-bold">Error in Admin Panel</h3>
      <p>{(error as Error).message}</p>
    </div>
  );
}
