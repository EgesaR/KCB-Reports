import { Outlet } from "@remix-run/react";

export default function AuthPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Outlet />
    </div>
  );
}
