import { MetaFunction } from "@remix-run/node";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { FaArrowRight } from "react-icons/fa";
import Button from "~/components/Button";

export const meta: MetaFunction = () => {
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

const benefitCards = [
  {
    icon: "N",
    title: "Save lot's of effort",
    subtitle:
      "KCB Reports takes care of the heavy lifting behind the scenes, so you can stay focused and ahead of the game.",
  },
  {
    icon: "K",
    title: "Collaborate with teachers in your department",
    subtitle:
      "Collaborate seamlessly and elevate your subject with teamwork, innovation, and shared insights",
  },
  {
    icon: "K",
    title: "",
    subtitle: "",
  },
  {
    icon: "K",
    title: "",
    subtitle: "",
  }
];

export default function Index() {
  return (
    <div className="w-full">
      <div className="w-full h-screen flex flex-col justify-center items-center pt-10 px-4 md:px-16 lg:px-24 relative">
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

        <div className="flex items-center justify-center mt-16 gap-6 pr-6">
          <motion.div
            variants={fadeInByOpacity}
            initial="hidden"
            animate="show"
            transition={{ duration: 1.2, ease: "easeIn", delay: 0.8 }}
            className="flex justify-center items-center w-full h-full"
          >
            <button
              type="button"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Link to="">Get Started</Link>
            </button>
          </motion.div>
          <motion.div
            variants={fadeInByOpacity}
            initial="hidden"
            animate="show"
            transition={{ duration: 1.2, ease: "easeIn", delay: 0.8 }}
            className="flex justify-center items-center w-full"
          >
            <button
              type="button"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 focus:outline-none focus:bg-blue-100 focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:bg-blue-800/10 dark:text-blue-400 dark:focus:bg-blue-800/30 dark:focus:text-blue-400"
            >
              <Link to="" className="flex items-center whitespace-nowrap gap-2">
                Learn more
                <FaArrowRight />
              </Link>
            </button>
          </motion.div>
        </div>
      </div>
      {/* Removed h-screen so it stacks correctly */}
      <section className="mt-16 min-h-screen flex flex-col items-center pt-[12rem] py-20 gap-10">
        <h1 className="text-white text-5xl font-[400]">
          KCB Reports is built for you
        </h1>
        <div className="grid grid-cols-3 gap-8 mt-4 px-8">
          {benefitCards.map((benefitCard, idx) => (
            <div key={idx} className="flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-8 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
              <div className="text-3xl font-medium text-black dark:text-white">
                {benefitCard.icon}
              </div>
              <h3 className="text-lg font-bold mt-10 text-gray-800 dark:text-white">
                {benefitCard.title}
              </h3>
              <p className="mt-4 text-gray-500 dark:text-neutral-400">
                {benefitCard.subtitle}
              </p>
              <a
                className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 decoration-2 hover:text-blue-700 hover:underline focus:underline focus:outline-none focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600"
                href="#"
              >
                Card link
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
