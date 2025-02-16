 import { motion, AnimatePresence } from "framer-motion";
import AnimatedListItem from "./AnimatedListItem";

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const ResultBox = ({ blogs }: { blogs: any[] }) => {
  return (
    <motion.div layout className="relative mt-10">
      <AnimatePresence>
        {blogs.length > 0 ? (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute w-full min-h-[100px] max-h-[300px] overflow-y-auto border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg rounded-lg px-4 py-2 mt-1
            scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent scrollbar-thumb-rounded-full 
            [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full 
            [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          >
            {blogs.map((blog, idx) => (
              <AnimatedListItem key={idx}>
                <div className="list-none px-4 py-2 hover:bg-green-100 cursor-pointer rounded-md transition-all">
                  <h3 className="text-base font-medium">
                    {truncateText(blog.title, 34)}
                  </h3>
                </div>
              </AnimatedListItem>
            ))}
          </motion.ul>
        ) : (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute w-full min-h-[10px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg rounded-lg px-4 py-2 mt-1 flex items-center justify-center text-gray-500"
          >
            No results found.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultBox;