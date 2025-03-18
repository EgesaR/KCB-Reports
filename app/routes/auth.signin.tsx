import { Form } from "@remix-run/react";
import { useState } from "react"

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = { email: "", password: "" };

    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
      hasErrors = true;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      console.log("Form submitted successfully", formData);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded p-8 w-[90%] sm:w-[400px]">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
        <Form method="post" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded p-2 focus:outline-0 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border rounded p-2 focus:outline-0 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password}</span>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
