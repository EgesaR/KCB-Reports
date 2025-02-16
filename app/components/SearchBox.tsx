import { useState, useRef, ChangeEvent, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  usePresence,
  useAnimate,
} from "framer-motion";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import ResultBox from "./ResultBox";

const SearchBox = ({ blogs }: { blogs: any[] }) => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredBlogs = (blogs ?? []).filter((blog) =>
    blog.title.toLowerCase().includes(query.toLowerCase())
  );


  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 200); // Ensure input focuses
  };

  const handleBlur = () => {
    setIsExpanded(false);
    setTimeout(() => setQuery(""), 300); // Clear input after exit animation
  };

  useEffect(() => {
    if (!isPresent) {
      const exitAnimation = async () => {
        await animate(
          "h3",
          {
            color: "yellow",
          },
          {
            delay: 2.75,
          }
        );
        await animate(
          "#inputBox",
          {
            opacity: 0,
            width: 50,
          },
          {
            delay: 0.75,
          }
        );

        safeToRemove();
      };

      exitAnimation();
    }
  }, [isPresent]);

  return (
    <motion.div ref={scope} layout className="relative flex items-center">
      <motion.div
        initial={{ width: 50 }}
        animate={{ width: isExpanded ? 400 : 50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative flex items-center"
        id="inputBox"
      >
        <motion.input
          ref={inputRef}
          type="text"
          placeholder="Search blogs..."
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          onBlur={handleBlur}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none"
          style={{ display: isExpanded ? "block" : "none" }}
        />
        <motion.button
          onClick={handleExpand}
          className="absolute left-3 top-3 text-gray-500 cursor-pointer"
          whileTap={{ scale: 0.9 }}
        >
          <HiOutlineMagnifyingGlass size={20} />
        </motion.button>
      </motion.div>

      {/* Animate Presence for Smooth Entry/Exit */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute w-full mt-2"
          >
            <ResultBox blogs={filteredBlogs} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBox;
