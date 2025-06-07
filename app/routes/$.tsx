// app/routes/$.tsx
import { json } from "@remix-run/node";
import { useRouteError, isRouteErrorResponse } from "@remix-run/react";

export function loader() {
  throw json({ message: "Not Found" }, { status: 404 });
}

export default function NotFound() {
  return (
    <div className="p-4 h-full w-full flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold">Whoops! Page Not Found</h1>
      <p>The page you're looking for doesn't exist :(</p>
      <a href="/" className="text-blue-500 underline">
        Go back to Home
      </a>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="p-4 h-full w-full flex items-center justify-center flex-col gap-2">
        <h1 className="text-3xl font-bold">Whoops! Page Not Found</h1>
        <p>The page you're looking for doesn't exist :(</p>
        <a href="/" className="text-blue-100 font-semibold rounded-lg px-4 py-1.5 mt-6 grid place-content-center bg-blue-500">
          Go back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Something Went Wrong</h1>
      <p>An unexpected error occurred. Please try again later.</p>
      <pre>{error instanceof Error ? error.message : "Unknown error"}</pre>
    </div>
  );
}
