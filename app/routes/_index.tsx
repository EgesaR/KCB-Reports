import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { FaArrowRight } from "react-icons/fa";

export const meta = () => {
  return [
    { title: "KCB Reports - Home" },
    { name: "description", content: "Welcome to KCB Reports!" },
  ];
};

const fadeInFromBottomVariant = {
  hidden: { opacity: 0, y: 100 },
  show: { opacity: 1, y: 0 },
};

const fadeInByOpacity = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export default function Index() {
  return (
    <div className="w-full h-screen">
      <div className="w-full h-screen flex flex-col justify-center items-center pt-[-10rem] px-4 md:px-16 lg:px-24 relative">
        {/* Hero Section */}
        <motion.div
          variants={fadeInFromBottomVariant}
          initial="hidden"
          animate="show"
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl text-green-800 dark:text-green-300 font-medium flex items-center mt-12"
        >
          Build reports that scale and save time
        </motion.div>

        <motion.div
          variants={fadeInFromBottomVariant}
          initial="hidden"
          animate="show"
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          className="text-black/70 dark:text-gray-300 flex justify-center mt-4 text-sm md:text-base lg:text-lg"
        >
          Automate tasks, make easy and relatable reports based on user
          preference and agility.
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 justify-center mt-16 gap-6 pr-6">
          <motion.div
            variants={fadeInByOpacity}
            initial="hidden"
            animate="show"
            transition={{ duration: 1.2, ease: "easeIn", delay: 0.8 }}
            className="flex justify-center items-center w-full"
          >
            <button className="bg-transparent rounded-lg px-4 py-2 border border-gray-600 dark:border-gray-400 flex items-center">
              <Link to="" className="flex items-center gap-2">
                Learn more
                <FaArrowRight />
              </Link>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
