import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@remix-run/node";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  return { message: url.searchParams.get("message") };
};

export default function AuthError() {
  const { message } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4 text-red-500">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p>{message || "Unknown error occurred"}</p>
      <a href="/auth/login" className="text-blue-500 underline">
        Try again
      </a>
    </div>
  );
}
