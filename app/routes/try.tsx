import { useEffect } from "react";
import { useFetcher } from "~/hooks/useFetcher";
import { Post } from "~/types/post";

const TryPart = () => {
  const { data, isLoading, error } = useFetcher<Post[]>({
    key: ["posts"],
    url: "/api/posts",
  });
  useEffect(() => {
    if (data) {
      console.log("Posts:", data);
    }
  }, [data]);

  const formatDate = (date: Date) =>
    date instanceof Date
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date(date).toLocaleDateString();

  return (
    <div>
      {isLoading && <div className="text-blue-500">Loading...</div>}
      {error instanceof Error && (
        <div className="text-red-500">{error.message}</div>
      )}
      {data && (
        <ul className="space-y-2">
          {data.map((post) => (
            <li key={post.id} className="border-b-2 p-2">
              <h2 className="font-semibold">{post.title}</h2>
              <label>{post.userId}</label>
              <label>{formatDate(post.createdAt)}</label>
              <label>{formatDate(post.updatedAt)}</label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TryPart;
