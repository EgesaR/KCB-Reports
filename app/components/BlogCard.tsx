import { Suspense } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

// ✅ Error Fallback Component
const ErrorFallback = () => (
  <div className="p-4 border rounded-lg bg-red-100 text-red-500">
    Failed to load blog. 😕
  </div>
);

const BlogCard = ({ blog }: { blog: any }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<BlogCardSkeleton />}>
        <div className="p-4 border rounded-lg bg-white dark:bg-gray-900 shadow-md">
          <h2 className="text-lg font-semibold">{blog.title}</h2>
          <p className="text-sm text-gray-500">
            {blog.author || "Unknown Author"}
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {blog.description}
          </p>
        </div>
      </Suspense>
    </ReactErrorBoundary>
  );
};

// ✅ Skeleton Loader for a better UI experience
const BlogCardSkeleton = () => (
  <div className="p-4 border rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse">
    <div className="h-5 bg-gray-300 dark:bg-gray-700 w-3/4 rounded"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 w-1/2 mt-2 rounded"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-700 w-full mt-4 rounded"></div>
  </div>
);

export default BlogCard;
