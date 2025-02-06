import { useRef, useEffect } from "react";
import { Link } from "react-router-dom"; // Correct import
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineLineChart } from "react-icons/ai";
import { MdOutlineAutoGraph } from "react-icons/md";
import {
 useInView,
 useAnimation,
 useTransform,
 useScroll
} from "framer-motion";

import Button from "../components/Button";

// Animation Variants
const fadeInFromBottomVariant = {
 hidden: { opacity: 0, y: 100 },
 show: { opacity: 1, y: 0 }
};

const fadeInByOpacity = {
 hidden: { opacity: 0 },
 show: { opacity: 1 }
};

// Feature Cards Component
const FeatureCards = ({
 name,
 message,
 icon,
 iconColor,
 iconBgColor,
 borderColor
}) => (
 <div
  className={`pb-3 h-52 w-full flex flex-col justify-between gap-4 rounded-xl shadow border-2 ${borderColor}`}
 >
  <div
   className={`w-full h-1/2 rounded-t-lg flex justify-center items-center ${iconBgColor} ${iconColor} text-2xl`}
  >
   {icon}
  </div>
  <div className="flex flex-col gap-1 h-1/2 px-3">
   <h1 className="text-lg font-medium">{name}</h1>
   <p className="text-slate-700 dark:text-slate-300 font-light text-[13px]">
    {message}
   </p>
  </div>
 </div>
);

// Home Component
const Home = () => {
 const containerRef = useRef(null);
 const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start end", "end end"]
 });
 const paragraphOneValue = useTransform(
  scrollYProgress,
  [0, 1],
  ["-100%", "0%"]
 );
 const introductionWidthValue = useTransform(
  scrollYProgress,
  [0, 1],
  ["0%", "57%"]
 );

 const isInView = useInView(containerRef);
 const mainControls = useAnimation();

 useEffect(() => {
  if (isInView) mainControls.start("visible");
 }, [isInView, mainControls]);

 return (
  <div className="w-full dark:text-white">
   {/* Main Content */}
   <div className="w-full h-screen flex flex-col justify-center pt-[-10rem] px-4 md:px-16 lg:px-24 relative">
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
     className="text-black/70 dark:text-gray-300 flex items-center mt-4 text-sm md:text-base lg:text-lg"
    >
     Automate tasks, make easy and relatable reports based on user preference
     and agility.
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 items-center mt-16 gap-6 pr-6">
     <motion.div
      variants={fadeInByOpacity}
      initial="hidden"
      animate="show"
      transition={{ duration: 1.2, ease: "easeIn", delay: 0.8 }}
      className="flex justify-center items-center w-full"
     >
      <Button className="bg-transparent rounded-lg px-4 py-2 border border-gray-600 dark:border-gray-400 flex items-center">
       <Link className="flex items-center gap-2">
        Learn more
        <FaArrowRight />
       </Link>
      </Button>
     </motion.div>
    </div>
   </div>

   {/* Introduction Section */}
   <div
    className="w-full min-h-screen flex flex-col justify-center px-3 gap-8 bg-teal-400 dark:bg-teal-800 pt-20 pb-20"
    ref={containerRef}
   >
    <div className="w-full">
     <motion.h1
      animate={mainControls}
      initial="hidden"
      variants={{
       hidden: { opacity: 0, y: 75 },
       visible: { opacity: 1, y: 0 }
      }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="text-4xl"
     >
      Introduction
     </motion.h1>
     <motion.div
      style={{ width: introductionWidthValue }}
      className="h-1 bg-green-300 rounded-2xl mt-2"
     />
    </div>
    <motion.p
     style={{ translateX: paragraphOneValue }}
     className="text-slate-700 dark:text-slate-300 font-light text-lg"
    >
     The KCB Reports is an education reporting system that targets easing
     report-making for teachers and providing visual academic performance graphs
     to parents and administrators.
    </motion.p>
   </div>

   {/* Features Section */}
   <div className="w-full min-h-screen flex flex-col px-4 md:px-16 lg:px-24 gap-6 my-12">
    <div className="w-full">
     <h1 className="text-4xl">Features</h1>
     <motion.div className="w-[42%] h-1 bg-green-300 dark:bg-green-600 rounded-2xl mt-1" />
    </div>
    <p className="text-slate-700 dark:text-slate-300 font-light text-base">
     To build a foundation to mark as a milestone.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     <FeatureCards
      name="Score Ruling"
      message="Quickly track individual student progress with an easy-to-interpret scoring system designed for both teachers and parents."
      icon={<AiOutlineLineChart />}
      iconColor="text-amber-700 dark:text-amber-300"
      iconBgColor="bg-amber-200 dark:bg-amber-700/20"
      borderColor="border-amber-200 dark:border-amber-300"
     />
     <FeatureCards
      name="Report Editing & Presentation"
      message="Seamlessly customize and present detailed reports that administrators and parents can rely on for data-driven decisions."
      icon={<FaRegEdit />}
      iconColor="text-sky-700 dark:text-sky-300"
      iconBgColor="bg-sky-200 dark:bg-sky-700/20"
      borderColor="border-sky-200 dark:border-sky-300"
     />
     <FeatureCards
      name="Score & Progress Graphs"
      message="Empower decision-making with visually engaging progress graphs that help parents and teachers see trends at a glance."
      icon={<MdOutlineAutoGraph />}
      iconColor="text-teal-700 dark:text-teal-300"
      iconBgColor="bg-teal-200 dark:bg-teal-700/20"
      borderColor="border-teal-200 dark:border-teal-300"
     />
     {/* Add more FeatureCards as needed */}
    </div>
   </div>
  </div>
 );
};

export default Home;
