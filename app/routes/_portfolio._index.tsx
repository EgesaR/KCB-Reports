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
  },
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
              <Link to="/signup">Get Started</Link>
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
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5"
            >
              <div>
                <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  ></svg>
                </span>
              </div>
              <h3 className="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight ">
                {benefitCard.icon}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm ">
                {benefitCard.title}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-16 flex flex-col items-center pt-[12rem] py-16 gap-[100px] px-8 text-white">
        <div className="w-full h-[80vh] grid gap-3 grid-cols-2 odd:flex-row even:flex-row-reverse py-4">
          <div className="flex-1 max-w-[480px] flex flex-col gap-4 items-center justify-center">
            <h1 className="text-[52px] text-neutral-100">Hello Wolrd</h1>
            <p className="text-[17px] text-left text-[#455366] w-[55%] dark:text-neutral-300">
              Hello people
            </p>
          </div>
          <div className="flex-1 flex items-center">
            <img
              src="https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt=""
              className="rounded-[24px] max-w-full w-full h-3/4 sm:h-1/2"
            />
          </div>
        </div>
        <div className="w-full h-[80vh] grid gap-3 grid-cols-2 odd:flex-row even:flex-row-reverse py-4">
          <div className="flex-1 max-w-[480px] flex flex-col gap-4 items-center justify-center">
            <h1 className="text-[52px] text-neutral-100">Hello Wolrd</h1>
            <p className="text-[17px] text-left text-[#455366] w-[55%] dark:text-neutral-300">
              Hello people
            </p>
          </div>
          <div className="flex-1 flex items-center">
            <img
              src="https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt=""
              className="rounded-[24px] max-w-full w-full h-3/4 sm:h-1/2"
            />
          </div>
        </div>
        <div className="w-full h-[80vh] grid gap-3 grid-cols-2 odd:flex-row even:flex-row-reverse py-4">
          <div className="flex-1 max-w-[480px] flex flex-col gap-4 items-center justify-center">
            <h1 className="text-[52px] text-neutral-100">Hello Wolrd</h1>
            <p className="text-[17px] text-left text-[#455366] w-[55%] dark:text-neutral-300">
              Hello people
            </p>
          </div>
          <div className="flex-1 flex items-center">
            <img
              src="https://images.pexels.com/photos/380337/pexels-photo-380337.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt=""
              className="rounded-[24px] max-w-full w-full h-3/4 sm:h-1/2"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
