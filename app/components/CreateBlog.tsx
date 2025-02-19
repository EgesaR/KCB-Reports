// app/components/CreateBlog.tsx
import { useState } from "react";
import { Form } from "@remix-run/react";

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    selfLink: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Form
      method="post"
      action="/api/blogs"
      className="space-y-4 p-6 bg-white rounded-lg shadow"
    >
      <input
        type="text"
        name="name"
        placeholder="Blog Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        placeholder="Blog Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="imageUrl"
        placeholder="Image URL"
        value={formData.imageUrl}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="selfLink"
        placeholder="Self Link"
        value={formData.selfLink}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="hidden"
        name="publishedAt"
        value={new Date().toISOString()} // Ensure publishedAt is always sent
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Blog
      </button>
    </Form>
  );
};

export default CreateBlog;
