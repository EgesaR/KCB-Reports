import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
 FaX,
 FaPlay,
 FaHouse,
 FaDollarSign,
 FaBlog,
 FaWandMagicSparkles
} from "react-icons/fa6";
import {
 IoApps,
 IoInformationCircleOutline,
 IoMegaphone,
 IoDocument
} from "react-icons/io5";
import Button from "./Button";

const sidebarVariants = {
 hidden: { x: "-100%" },
 visible: { x: 0 },
 exit: { x: "-100%" }
};

const MobileSideBar = ({ open, setOpen }) => {
 const links = [
  {
   icon: <FaHouse />,
   text: "Home",
   to: "/"
  },
  {
   icon: <IoApps />,
   text: "Features",
   to: "/features"
  },
  {
   icon: <FaDollarSign />,
   text: "Pricing",
   to: "/pricing"
  },
  {
   icon: <FaBlog />,
   text: "Blog",
   to: "/blogs"
  },
  {
   icon: <IoInformationCircleOutline />,
   text: "About",
   to: "/about"
  },
  {
   icon: <IoMegaphone />,
   text: "Contact",
   to: "/contact"
  },
  {
   icon: <IoDocument />,
   text: "Learn & Docs",
   to: "/docs/get-started"
  }
 ];
 return (
  <motion.aside
   variants={sidebarVariants}
   initial="hidden"
   animate={open ? "visible" : "hidden"}
   exit="exit"
   transition={{ type: "spring", stiffness: 100, damping: 20 }}
   className="h-screen fixed top-0 z-50 w-[70%] backdrop-blur bg-green-100/60 dark:bg-gray-900 shadow-md border-r dark:border-green-200/50"
  >
   <nav className="h-full flex flex-col">
    {/* Header Section */}
    <div className="p-4 pb-2 flex justify-between items-center">
     <div>
      <FaWandMagicSparkles className="text-green-500 text-2xl" />
     </div>
     <Button
      className="h-10 w-10 rounded-full grid place-items-center text-white dark:text-white"
      onClick={() => setOpen(false)}
     >
      <FaX />
     </Button>
    </div>

    {/* Sidebar Message */}
    <motion.div
     className="flex justify-center items-center"
     initial={{ opacity: 0, scale: 0.8 }}
     animate={{ opacity: 1, scale: 1 }}
     transition={{ delay: 0.2, duration: 0.4 }}
    >
     <div className="pl-4 pr-2 py-1 border border-green-400 rounded-2xl flex items-center gap-3 text-lg font-light w-[85%]">
      <FaWandMagicSparkles />
      <p className="text-[11px] w-full dark:text-gray-200">
       KCB Report 1.0 Update is here
      </p>
     </div>
    </motion.div>

    {/* Sidebar Items */}
    <ul className="flex-1 gap-3 text-lg mt-4">
     {links.map((link, idx) => (
      <MobileSideBarItem
       icon={link.icon}
       text={link.text}
       to={link.to}
       delay={(idx + 1) / 10}
       setOpen={setOpen}
      />
     ))}
    </ul>

    {/* Footer Buttons */}
    <motion.div
     className="flex p-3 flex-col justify-center items-center gap-4 mb-3"
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ delay: 0.8, duration: 0.4 }}
    >
     <Button className="flex items-center justify-center gap-2 py-2.5 rounded-lg w-full dark:bg-gray-800 dark:text-gray-200">
      <FaPlay />
      <label>Launch Demo</label>
     </Button>
     <div className="w-full grid grid-cols-2 gap-6">
      <Button className="py-2 rounded-lg w-full dark:bg-gray-800 dark:text-gray-200">
       <Link to="/auth/login" className="w-full">
        Log in
       </Link>
      </Button>
      <Button className="py-2 rounded-lg w-full dark:bg-gray-800 dark:text-gray-200">
       <Link to="/auth/signup" className="w-full">
        Sign up
       </Link>
      </Button>
     </div>
    </motion.div>
   </nav>
  </motion.aside>
 );
};

const MobileSideBarItem = ({ icon, text, to, delay, setOpen }) => {
 const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
 };

 return (
  <motion.li
   variants={itemVariants}
   initial="hidden"
   animate="visible"
   transition={{ delay, duration: 0.3 }}
   className="flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer hover:bg-green-50 dark:hover:bg-gray-700 dark:text-gray-200"
   onClick={() => setOpen(false)}
  >
   <Link to={to} className="w-full flex items-center gap-4">
    <div className="text-xl">{icon}</div>
    <span>{text}</span>
   </Link>
  </motion.li>
 );
};

export default MobileSideBar;
