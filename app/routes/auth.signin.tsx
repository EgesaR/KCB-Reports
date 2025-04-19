"use client";

import React, { useReducer, useEffect, useMemo, useRef, useState } from "react";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { Field, Input, Label } from "@headlessui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { action } from "./auth.signin.authenticate";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  fields?: {
    email: string;
    password: string;
  }; 
  success?: boolean;
};

type FormState = {
  slide: "email" | "password";
  email: string;
  password: string;
  error: string | null;
  userData: { name: string; profilePicture: string | null } | null;
  status: "idle" | "checkingEmail" | "submitting";
  showPassword: boolean;
};

type FormAction =
  | { type: "SET_SLIDE"; payload: "email" | "password" }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "SET_USER_DATA";
      payload: { name: string; profilePicture: string | null } | null;
    }
  | { type: "SET_STATUS"; payload: "idle" | "checkingEmail" | "submitting" }
  | { type: "TOGGLE_PASSWORD" };

const initialState: FormState = {
  slide: "email",
  email: "",
  password: "",
  error: null,
  userData: null,
  status: "idle",
  showPassword: false,
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_SLIDE":
      return { ...state, slide: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_USER_DATA":
      return { ...state, userData: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "TOGGLE_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    default:
      return state;
  }
};

export const loader = () => {
  return null;
};

export { action };

export default function SignInPage() {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [isAutofilled, setIsAutofilled] = useState(false);

  // Detect autofill
  useEffect(() => {
    const checkAutofill = () => {
      if (passwordInputRef.current) {
        const autofilled =
          !!passwordInputRef.current.matches(":-webkit-autofill");
        setIsAutofilled(autofilled);
      }
    };

    // Initial check
    checkAutofill();

    // Poll for autofill (some browsers don't trigger immediately)
    const interval = setInterval(checkAutofill, 100);
    setTimeout(() => clearInterval(interval), 2000); // Stop polling after 2s

    return () => clearInterval(interval);
  }, []);

  // Sync actionData.formError with formState.error
  useEffect(() => {
    if (actionData?.formError) {
      dispatch({ type: "SET_ERROR", payload: actionData.formError });
    }
  }, [actionData]);

  // Auto-clear error after 4 seconds
  useEffect(() => {
    if (formState.error) {
      const timeout = setTimeout(() => {
        dispatch({ type: "SET_ERROR", payload: null });
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [formState.error]);

  // Sync navigation state
  useEffect(() => {
    if (isSubmitting) {
      dispatch({ type: "SET_STATUS", payload: "submitting" });
    } else if (formState.status === "submitting") {
      dispatch({ type: "SET_STATUS", payload: "idle" });
    }
  }, [isSubmitting, formState.status]);

  // Check email existence
  const checkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_STATUS", payload: "checkingEmail" });
    try {
      const response = await fetch("/api/check-email", {
        method: "POST",
        body: new URLSearchParams({ email: formState.email }),
      });
      const data = await response.json();
      if (data.exists) {
        dispatch({ type: "SET_USER_DATA", payload: data.user });
        dispatch({ type: "SET_SLIDE", payload: "password" });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: data.error || "Email not found",
        });
      }
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to check email" });
    } finally {
      dispatch({ type: "SET_STATUS", payload: "idle" });
    }
  };

  // Memoized initials and color
  const getInitials = useMemo(
    () => (name: string) => {
      const names = name.trim().split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0]?.slice(0, 2).toUpperCase() || "??";
    },
    []
  );

  const generateColor = useMemo(
    () => (email: string) => {
      const hash = email
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hue = hash % 360;
      return `hsl(${hue}, 70%, 50%)`;
    },
    []
  );

  // Right-to-left slide transition
  const slideVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "left" ? -300 : 300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "left" ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full h-screen flex relative overflow-hidden bg-gray-900">
      {/* Aurora Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-64 h-64 bg-blue-300 rounded-full opacity-50 blur-3xl" // Changed to bg-blue-300
          animate={{
            x: ["0%", "20%", "0%"],
            y: ["0%", "10%", "0%"],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "10%", left: "20%" }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-purple-300 rounded-full opacity-50 blur-3xl" // Changed to bg-purple-300
          animate={{
            x: ["0%", "-15%", "0%"],
            y: ["0%", "20%", "0%"],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "40%", right: "15%" }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-pink-300 rounded-full opacity-50 blur-3xl" // Changed to bg-pink-300
          animate={{
            x: ["0%", "10%", "0%"],
            y: ["0%", "-15%", "0%"],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "20%", left: "30%" }}
        />
      </div>

      {/* Glassmorphic Card */}
      <div className="w-full flex items-center justify-center p-8 z-10">
        <motion.div
          className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Welcome Back
          </h1>

          {/* Error Alert */}
          <AnimatePresence>
            {formState.error && (
              <motion.div
                className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {formState.error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slide Container */}
          <AnimatePresence mode="wait" initial={false}>
            {formState.slide === "email" ? (
              <motion.div
                key="email"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom="right"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <form onSubmit={checkEmail}>
                  <Field>
                    <Label className="text-sm font-medium text-white">
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={formState.email}
                      onChange={(e) =>
                        dispatch({ type: "SET_EMAIL", payload: e.target.value })
                      }
                      className={clsx(
                        "mt-3 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                        actionData?.fieldErrors?.email && "border-red-500"
                      )}
                      required
                    />
                    {actionData?.fieldErrors?.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {actionData.fieldErrors.email}
                      </p>
                    )}
                  </Field>
                  <motion.button
                    type="submit"
                    className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formState.status !== "idle"}
                  >
                    {formState.status === "checkingEmail" ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Checking...
                      </span>
                    ) : (
                      "Next"
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="password"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom="left"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Form method="post" className="space-y-6">
                  {/* Chip with Email and Avatar (Centered) */}
                  <div className="mb-4 flex justify-center">
                    <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium border border-gray-800 text-white bg-white/10">
                      {formState.userData?.profilePicture ? (
                        <img
                          className="inline-block size-6 rounded-full"
                          src={formState.userData.profilePicture}
                          alt="Avatar"
                        />
                      ) : (
                        <span
                          className="size-6 rounded-full flex items-center justify-center text-white text-xs font-medium" // Removed inline-block
                          style={{
                            backgroundColor: generateColor(formState.email),
                          }}
                        >
                          {getInitials(
                            formState.userData?.name || formState.email
                          )}
                        </span>
                      )}
                      {formState.email}
                    </span>
                  </div>
                  <input type="hidden" name="email" value={formState.email} />
                  <Field className="relative">
                    <Label className="text-sm font-medium text-white">
                      Password
                    </Label>
                    <Input
                      type={formState.showPassword ? "text" : "password"}
                      name="password"
                      value={formState.password}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_PASSWORD",
                          payload: e.target.value,
                        })
                      }
                      className={clsx(
                        "mt-3 block w-full rounded-lg border-none bg-white/5 py-2 pl-3 pr-10 text-sm text-white",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                        actionData?.fieldErrors?.password && "border-red-500"
                      )}
                      required
                      minLength={6}
                      ref={passwordInputRef}
                    />
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "TOGGLE_PASSWORD" })}
                      className={clsx(
                        "absolute right-3 top-1/2 translate-y-[40%] flex items-center justify-center focus:outline-none",
                        isAutofilled
                          ? "text-black"
                          : "text-white/50 hover:text-white"
                      )}
                      aria-label={
                        formState.showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {formState.showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                    {actionData?.fieldErrors?.password && (
                      <p className="mt-2 text-sm text-red-600">
                        {actionData.fieldErrors.password}
                      </p>
                    )}
                  </Field>
                  <motion.button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formState.status !== "idle"}
                  >
                    {formState.status === "submitting" ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </motion.button>
                  <div className="text-center mt-4">
                    <Link
                      to="/auth/forgot_password"
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </Form>
                <motion.button
                  onClick={() =>
                    dispatch({ type: "SET_SLIDE", payload: "email" })
                  }
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300"
                  whileHover={{ x: 5 }}
                >
                  Back to Email
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
