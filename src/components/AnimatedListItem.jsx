import { motion } from "framer-motion";

let base = 4;
let t = d => d * base;

const AnimatedListItem = ({ children, className }) => {
 return (
  <motion.li
   className={`relative ${className}`}
   initial={{ height: 0, opacity: 1 }}
   animate={{
    height: "auto",
    opacity: 1,
    transition: {
     type: "spring",
     bounce: 0.3,
     opacity: {
      delay: t(0.025)
     }
    }
   }}
   exit={{ height: 0, opacity: 0 }}
   transition={{
    duration: t(0.15),
    type: "spring",
    bounce: 0,
    opacity: {
     duration: t(0.03)
    }
   }}
  >
   {children}
  </motion.li>
 );
};
export default AnimatedListItem;
