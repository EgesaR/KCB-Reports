import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import { motion } from "framer-motion";
import { prisma } from "~/utils/prisma.server";
import Stepper from "~/components/Stepper";

interface ActionData {
  error?: string;
}

export const loader = async () => {
  const [subjects, classes, schools] = await Promise.all([
    prisma.subject.findMany({ select: { name: true } }),
    prisma.class.findMany({ select: { name: true } }),
    prisma.school.findMany({ select: { name: true } }),
  ]);
  return json({
    subjects: subjects.map((s) => s.name),
    classes: classes.map((c) => c.name),
    schools: schools.map((s) => s.name),
  });
};

export const action = async ({}: ActionFunctionArgs) => {
  return redirect("/api/signup");
};

export default function CreateUserPage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="w-full h-screen text-black dark:text-white overflow-hidden relative isolate bg-gray-900 dark:bg-gray-900">
      {/* Enhanced Aurora Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full opacity-40 blur-3xl"
          animate={{
            x: ["0%", "25%", "0%"],
            y: ["0%", "15%", "0%"],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "5%", left: "10%" }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full opacity-40 blur-3xl"
          animate={{
            x: ["0%", "-20%", "0%"],
            y: ["0%", "25%", "0%"],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "30%", right: "10%" }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-gradient-to-r from-pink-400 to-red-300 rounded-full opacity-40 blur-3xl"
          animate={{
            x: ["0%", "15%", "0%"],
            y: ["0%", "-20%", "0%"],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "10%", left: "25%" }}
        />
      </div>

      {/* Content */}
      <div className="w-full h-screen flex items-center justify-center z-10 p-4">
        {actionData?.error && (
          <p className="text-red-500 mb-4 text-center">{actionData.error}</p>
        )}
        <div className="bg-gray-800/20 backdrop-blur-xl rounded-xl shadow-2xl p-8 w-full max-w-4xl">
          <Stepper loaderData={loaderData} />
        </div>
      </div>
    </div>
  );
}
