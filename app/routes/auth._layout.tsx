// app/routes/auth/_layout.tsx
import { Outlet, Link } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold mb-4">Welcome</h2>
        <Outlet /> {/* Renders signin or signup inside this layout */}
        <div className="text-center mt-4">
          <Link to="/auth/signin" className="text-blue-600">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
