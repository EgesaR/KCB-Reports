import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import { FaSave, FaSitemap, FaThLarge } from "react-icons/fa"; // Core Icons
import { FaRegEdit } from "react-icons/fa"
import { AiOutlineLineChart } from "react-icons/ai"; // Ant Design Icons
import { MdOutlineAutoGraph } from "react-icons/md"; // Material Design Icons
import { useInView, useAnimation, useTransform, useScroll } from "framer-motion";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import MobileSideBar from "../components/MobileSideBar";

const fadeInFromBottomVariant = {
  hidden: { opacity: 0, y: 100 },
  show: { opacity: 1, y: 0 },
};

const fadeInByOpacity = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const FeatureCards = ({ name, message, icon, iconColor, iconBgColor, borderColor }) => (
  <div className={`pb-3 h-52 w-full flex flex-col justify-center-center gap-4 rounded-xl shadow border-2 ${borderColor}`}>
    <div className={`w-full h-1/2 rounded-t-lg flex justify-center items-center ${iconBgColor} ${iconColor} text-2xl`}>
      {icon}
    </div>
    <div className="flex flex-col gap-1 h-1/2 px-3">
      <h1 className="text-lg font-medium">{name}</h1>
      <p className="text-slate-700 font-light text-[13px]">{message}</p>
    </div>
  </div>
);

const Home = () => {
  const [mobileSideBarOpen, setMobileSideBarOpen] = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end end"] });
  const paragraphOneValue = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
  const introductionWidthValue = useTransform(scrollYProgress, [0, 1], ["0%", "57%"]);

  const isInView = useInView(containerRef);
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) mainControls.start("visible");
  }, [isInView, mainControls]);

  return (
    <div className={`w-full h-screen bg-green-100 ${mobileSideBarOpen ? "z-0" : ""}`}>
      <MobileSideBar open={mobileSideBarOpen} setOpen={setMobileSideBarOpen} />
      <div className="w-full h-screen flex justify-center px-4 flex-col relative">
        <Navbar open={mobileSideBarOpen} setOpen={setMobileSideBarOpen} />

        {/* Hero Section */}
        <motion.div
          variants={fadeInFromBottomVariant}
          initial="hidden"
          animate="show"
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-4xl text-green-800 font-medium flex items-center"
        >
          Build reports that scale and save time
        </motion.div>

        <motion.div
          variants={fadeInFromBottomVariant}
          initial="hidden"
          animate="show"
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          className="text-black/70 flex items-center mt-4"
        >
          Automate tasks, make easy and relatable reports based on user preference and agility.
        </motion.div>

        <div className="w-full grid grid-cols-2 items-center mt-20 gap-6 pr-6">
          <motion.div
            variants={fadeInByOpacity}
            initial="hidden"
            animate="show"
            transition={{ duration: 1.2, ease: "easeIn", delay: 0.8 }}
            className="flex justify-center items-center w-full"
          >
            <Button
              className="bg-green-600 rounded-lg px-8 py-2"
              onClick={() => (window.location.href = "/auth/signup")}
            >
              Start now
            </Button>
          </motion.div>
          <motion.div
            variants={fadeInByOpacity}
            initial="hidden"
            animate="show"
            transition={{ duration: 1.2, ease: "easeIn", delay: 0.8 }}
            className="flex justify-center items-center w-full"
          >
            <Button className="bg-transparent rounded-lg px-4 py-2 border border-gray-600 flex items-center">
              <Link className="flex items-center gap-2">
                Learn more
                <FaArrowRight />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="w-full h-screen flex flex-col justify-center px-3 gap-8 bg-teal-400" ref={containerRef}>
        <div className="w-full">
          <motion.h1
            animate={mainControls}
            initial="hidden"
            variants={{ hidden: { opacity: 0, y: 75 }, visible: { opacity: 1, y: 0 } }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl"
          >
            Introduction
          </motion.h1>
          <motion.div style={{ width: introductionWidthValue }} className="h-1 bg-green-300 rounded-2xl" />
        </div>
        <motion.p style={{ translateX: paragraphOneValue }} className="text-slate-700 font-light text-lg">
          The KCB Reports is an education reporting system that targets easing report-making for teachers and
          providing visual academic performance graphs to parents and administrators.
        </motion.p>
      </div>

      {/* Features Section */}
      <div className="w-full min-h-screen flex flex-col px-4 gap-3 my-4">
        <div className="w-full">
          <h1 className="text-4xl">Features</h1>
          <motion.div className="w-[42%] h-1 bg-green-300 rounded-2xl" />
        </div>
        <p className="text-slate-700 font-light text-base">To build a foundation to mark as a milestone.</p>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCards
            name="Score Ruling"
            message="Quickly track individual student progress with an easy-to-interpret scoring system designed for both teachers and parents."
            icon={<AiOutlineLineChart />}
            iconColor="text-amber-700"
            iconBgColor="bg-amber-200"
            borderColor="border-amber-200"
          />
          <FeatureCards
            name="Report Editing & Presentation"
            message="Seamlessly customize and present detailed reports that administrators and parents can rely on for data-driven decisions."
            icon={<FaRegEdit />}
            iconColor="text-sky-700"
            iconBgColor="bg-sky-200"
            borderColor="border-sky-200"
          />
          <FeatureCards
            name="Score & Progress Graphs"
            message="Empower decision-making with visually engaging progress graphs that help parents and teachers see trends at a glance."
            icon={<MdOutlineAutoGraph />}
            iconColor="text-teal-700"
            iconBgColor="bg-teal-200"
            borderColor="border-teal-200"
          />
          <FeatureCards
            name="Fast Auto Save & Retrieval"
            message="Save time with instant auto-save and retrieval of reports, ensuring you never lose critical data during peak activity."
            icon={<FaSave />}
            iconColor="text-rose-700"
            iconBgColor="bg-rose-200"
            borderColor="border-rose-200"
          />
          <FeatureCards
            name="Departmental Organization"
            message="Easily organize reports and track performance metrics across departments for streamlined school management."
            icon={<FaSitemap />}
            iconColor="text-indigo-700"
            iconBgColor="bg-indigo-200"
            borderColor="border-indigo-200"
          />
          <FeatureCards
            name="Customizable Report Layouts"
            message="Design unique, professional-grade layouts that cater to specific needs, from detailed academic insights to simplified summaries."
            icon={<FaThLarge />}
            iconColor="text-yellow-700"
            iconBgColor="bg-yellow-200"
            borderColor="border-yellow-200"
          />
        </div>
      </div>

      {/* Pricing Section */}
      <div className="w-full h-screen flex flex-col justify-center px-4 bg-gradient-to-tl from-teal-500 to-green-600 my-[25%] gap-4">
        <div className="w-full">
          <h1 className="text-4xl text-white">Pricing</h1>
          <motion.div className="w-[33%] h-1 bg-green-300 rounded-2xl mt-1" />
        </div>
        <p className="text-slate-100 font-light text-base">
          We look up to bringing better maintenance and agility to KCB Reports.
        </p>
        <div className="">
          
        </div>
      </div>

      {/* Footer */}
      <footer className="h-[50vh] w-full bg-slate-800 px-4 py-3"></footer>
    </div>
  );
};

export default Home;
