"use client";

import React, { useReducer, useEffect, useRef, useState } from "react";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { Field, Input, Label } from "@headlessui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import axios from "axios";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

// In-memory store for verification codes (use Prisma in production)
const codeStore: Map<string, { code: string; expires: number }> = new Map();

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const code = formData.get("code") as string;
  const email = formData.get("email") as string;
  const mode = formData.get("mode") as string;
  const password = formData.get("password") as string;

  // Handle forgot password flow
  if (mode === "reset" || mode === "verify") {
    if (mode === "reset") {
      // Generate 6-digit code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const expires = Date.now() + 15 * 60 * 1000; // 15-minute expiration

      // Store code (in-memory; use Prisma in production)
      codeStore.set(email, { code: verificationCode, expires });

      // Send email with Nodemailer
      try {
        const oAuth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI
        );
        oAuth2Client.setCredentials({
          refresh_token: process.env.REFRESH_TOKEN,
        });

        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.EMAIL_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken.token || "",
          },
        });

        const mailOptions = {
          from: `KCB Reports <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "KCB Reports Security Code",
          text: `Hello user, your security code is: ${verificationCode}`,
          html: `Hello <i>user</i>, your security code is: <b>${verificationCode}</b>`,
        };

        await transport.sendMail(mailOptions);

        return json({
          mode: "verify",
          resetSent: true,
          fields: { email },
        });
      } catch (err) {
        console.error("Error sending email:", err);
        return json(
          { error: "Failed to send verification code. Please try again." },
          { status: 500 }
        );
      }
    } else if (mode === "verify") {
      // Validate code
      const stored = codeStore.get(email);
      if (!stored) {
        return json(
          {
            fieldErrors: { code: "No verification code found for this email." },
          },
          { status: 400 }
        );
      }
      if (stored.expires < Date.now()) {
        codeStore.delete(email);
        return json(
          { fieldErrors: { code: "Verification code has expired." } },
          { status: 400 }
        );
      }
      if (stored.code !== code) {
        return json(
          { fieldErrors: { code: "Invalid verification code." } },
          { status: 400 }
        );
      }

      // Placeholder: Update password (requires user database)
      // Example: await prisma.user.update({ where: { email }, data: { password: hash(password) } });
      codeStore.delete(email); // Clear code after use

      return json({
        resetSuccess: true,
        mode: "verify",
      });
    }
  }

  // Handle OAuth token exchange
  try {
    const tokenEndpoint = process.env.OAUTH_TOKEN_URL;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!tokenEndpoint || !clientId || !clientSecret || !redirectUri) {
      console.error(
        "Missing required environment variables for token exchange."
      );
      return json({ error: "Server configuration error" }, { status: 500 });
    }

    const response = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      }
    );

    const tokens = response.data;
    console.log("Tokens:", tokens);
    return redirect("/dashboard");
  } catch (error: any) {
    console.error(
      "Token exchange error:",
      error.response?.data || error.message
    );
    return json(
      {
        error: `Token exchange failed: ${
          error.response?.data?.error_description || error.message
        }`,
      },
      { status: 500 }
    );
  }
};

type ActionData = {
  error?: string;
  resetSent?: boolean;
  resetSuccess?: boolean;
  mode?: "reset" | "verify";
  fields?: {
    email?: string;
    code?: string;
    password?: string;
  };
  fieldErrors?: {
    email?: string;
    code?: string;
    password?: string;
  };
};

type FormState = {
  mode: "reset" | "verify";
  email: string;
  code: string;
  password: string;
  error: string | null;
  resetSent: boolean;
  resetSuccess: boolean;
  status: "idle" | "submitting";
  showPassword: boolean;
};

type FormAction =
  | { type: "SET_MODE"; payload: "reset" | "verify" }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_CODE"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_RESET_SENT"; payload: boolean }
  | { type: "SET_RESET_SUCCESS"; payload: boolean }
  | { type: "SET_STATUS"; payload: "idle" | "submitting" }
  | { type: "TOGGLE_PASSWORD" };

const initialState: FormState = {
  mode: "reset",
  email: "",
  code: "",
  password: "",
  error: null,
  resetSent: false,
  resetSuccess: false,
  status: "idle",
  showPassword: false,
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_CODE":
      return { ...state, code: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_RESET_SENT":
      return { ...state, resetSent: action.payload };
    case "SET_RESET_SUCCESS":
      return { ...state, resetSuccess: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "TOGGLE_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    default:
      return state;
  }
};

export default function ForgotPasswordPage() {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [isAutofilled, setIsAutofilled] = useState(false);

  // Sync actionData with formState
  useEffect(() => {
    if (actionData?.mode) {
      dispatch({ type: "SET_MODE", payload: actionData.mode });
    }
    if (actionData?.error) {
      dispatch({ type: "SET_ERROR", payload: actionData.error });
    }
    if (actionData?.resetSent) {
      dispatch({ type: "SET_RESET_SENT", payload: actionData.resetSent });
    }
    if (actionData?.resetSuccess) {
      dispatch({ type: "SET_RESET_SUCCESS", payload: actionData.resetSuccess });
    }
    if (actionData?.fields?.email) {
      dispatch({ type: "SET_EMAIL", payload: actionData.fields.email });
    }
  }, [actionData]);

  // Auto-clear alerts after 4 seconds
  useEffect(() => {
    if (formState.error || formState.resetSent || formState.resetSuccess) {
      const timeout = setTimeout(() => {
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_RESET_SENT", payload: false });
        dispatch({ type: "SET_RESET_SUCCESS", payload: false });
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [formState.error, formState.resetSent, formState.resetSuccess]);

  // Sync navigation state
  useEffect(() => {
    dispatch({
      type: "SET_STATUS",
      payload: navigation.state === "submitting" ? "submitting" : "idle",
    });
  }, [navigation.state]);

  // Detect autofill
  useEffect(() => {
    const checkAutofill = () => {
      if (passwordInputRef.current) {
        const autofilled =
          !!passwordInputRef.current.matches(":-webkit-autofill");
        setIsAutofilled(autofilled);
      }
    };

    checkAutofill();
    const interval = setInterval(checkAutofill, 100);
    setTimeout(() => clearInterval(interval), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen flex relative overflow-hidden bg-gray-900">
      {/* Aurora Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-64 h-64 bg-blue-300 rounded-full opacity-50 blur-3xl"
          animate={{
            x: ["0%", "20%", "0%"],
            y: ["0%", "10%", "0%"],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "10%", left: "20%" }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-purple-300 rounded-full opacity-50 blur-3xl"
          animate={{
            x: ["0%", "-15%", "0%"],
            y: ["0%", "20%", "0%"],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "40%", right: "15%" }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-pink-300 rounded-full opacity-50 blur-3xl"
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
            {formState.mode === "reset" ? "Reset Password" : "Verify Code"}
          </h1>

          {/* Success Message */}
          <AnimatePresence>
            {formState.resetSuccess && (
              <motion.div
                className="mb-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                Password updated successfully! You can now sign in with your new
                password.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
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

          {/* Reset Sent Confirmation */}
          <AnimatePresence>
            {formState.resetSent && (
              <motion.div
                className="mb-6 p-4 text-sm text-blue-700 bg-blue-100 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                We've sent a verification code to your email. Please check your
                inbox and spam folder.
              </motion.div>
            )}
          </AnimatePresence>

          <Form method="post" className="space-y-6">
            <input type="hidden" name="mode" value={formState.mode} />

            {/* Email Field */}
            <Field>
              <Label className="text-sm font-medium text-white">Email</Label>
              <Input
                type="email"
                name="email"
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
                disabled={formState.mode === "verify"}
              />
              {actionData?.fieldErrors?.email && (
                <p className="mt-2 text-sm text-red-600">
                  {actionData.fieldErrors.email}
                </p>
              )}
            </Field>

            {/* Verification Code Field */}
            {formState.mode === "verify" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Field>
                  <Label className="text-sm font-medium text-white">
                    Verification Code
                  </Label>
                  <Input
                    type="text"
                    name="code"
                    value={formState.code}
                    onChange={(e) =>
                      dispatch({ type: "SET_CODE", payload: e.target.value })
                    }
                    className={clsx(
                      "mt-3 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                      actionData?.fieldErrors?.code && "border-red-500"
                    )}
                    required
                  />
                  {actionData?.fieldErrors?.code && (
                    <p className="mt-2 text-sm text-red-600">
                      {actionData.fieldErrors.code}
                    </p>
                  )}
                </Field>
              </motion.div>
            )}

            {/* Password Field */}
            {formState.mode === "verify" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Field className="relative">
                  <Label className="text-sm font-medium text-white">
                    New Password
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
                    minLength={8}
                    ref={passwordInputRef}
                  />
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "TOGGLE_PASSWORD" })}
                    className={clsx(
                      "absolute right-3 top-9 focus:outline-none",
                      isAutofilled
                        ? "text-black"
                        : "text-white/50 hover:text-white"
                    )}
                    aria-label={
                      formState.showPassword ? "Hide password" : "Show password"
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
              </motion.div>
            )}

            {/* Submit Button */}
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : formState.mode === "reset" ? (
                "Send Reset Code"
              ) : (
                "Update Password"
              )}
            </motion.button>

            {/* Back to Sign In */}
            <div className="text-center mt-4">
              <Link
                to="/auth/signin"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Back to Sign In
              </Link>
            </div>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
