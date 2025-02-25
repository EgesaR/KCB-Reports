import React from "react";
import { useStore } from "@nanostores/react";
import { user } from "./StepProvider";
import styles from "~/styles/styles.module.css"; // Import CSS module

function PersonalInfo() {
  const $user = useStore(user);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    user.setKey(e.target.name, e.target.value);
  }

  return (
    <form className="">
      {/* Full Name Input */}
      <div className="my-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="name"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Full Name
          </label>
          {$user.name === "" && (
            <span className="text-sm text-red-500">This field is required</span>
          )}
        </div>
        <div className="mt-2">
          <input
            id="name"
            name="name"
            type="name"
            required
            value={$user.name ?? ""}
            onChange={handleChange}
            autoComplete="name"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
      {/* Email Input */}
      <div className="my-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Email address
          </label>
          {$user.email === "" && (
            <span className="text-sm text-red-500">This field is required</span>
          )}
        </div>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={$user.email ?? ""}
            onChange={handleChange}
            autoComplete="email"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
      {/* Phone Number Input */}
      <div className="my-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="phone"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Phone Number
          </label>
          {$user.phone === "" && (
            <span className="text-sm text-red-500">This field is required</span>
          )}
        </div>
        <div className="mt-2">
          <input
            id="phone"
            name="phone"
            type="phone"
            required
            value={$user.phone ?? ""}
            onChange={handleChange}
            autoComplete="phone"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
      {/* Password Input */}
      <div className="my-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Password
          </label>
          <div className="text-sm">
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>
        </div>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            required
            value={$user.password ?? ""}
            onChange={handleChange}
            autoComplete="current-password"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
    </form>
  );
}

export default PersonalInfo;
