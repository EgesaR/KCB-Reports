import axios from "axios";
import FormData from "form-data";

// Define the API endpoint
const API_URL = "https://vgznz4-5173.csb.app/api/signup";

// Define the trial JSON sample
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  password: "securePassword123!",
  roles: ["admin"],
  schools: ["School A", "School B"],
};

// Create a FormData object
const formData = new FormData();
formData.append("name", userData.name);
formData.append("email", userData.email);
formData.append("password", userData.password);
formData.append("roles", JSON.stringify(userData.roles)); // Stringify the array
formData.append("schools", JSON.stringify(userData.schools)); // Stringify the array

// Function to test the API
async function testSignup() {
  try {
    console.log("Sending request to:", API_URL);
    console.log("Request payload:", userData);

    // Send the POST request with FormData
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders(), // Include FormData headers
      },
    });

    // Log the response
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
  } catch (error) {
    // Log any errors
    console.error("Error during signup:");

    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error:", error.message);
    }
  }
}

// Run the test
testSignup();

// app/routes/auth/signin.tsx
import { useActionData, Form } from "@remix-run/react";
import AuthPage from "./auth";

interface ActionData {
  error?: string;
}

export default function SigninPage() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="mt-24 bg-white">
      {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
      <Form method="post" action="/api/signin">
        <div>
          <label>
            Email: <input type="email" name="email" required />
          </label>
        </div>
        <div>
          <label>
            Password: <input type="password" name="password" required />
          </label>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Sign In
        </button>
      </Form>
    </div>
  );
}
