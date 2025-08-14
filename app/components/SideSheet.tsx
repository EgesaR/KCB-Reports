// app/components/SideSheet.tsx
import { memo, useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import Card from "./Card";
import { motion, AnimatePresence } from "framer-motion";

interface SideSheetProps {
  id?: string;
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
  setIsOpen: (id?: string) => void;
}

const SideSheet: React.FC<SideSheetProps> = ({
  id = "",
  children,
  isOpen,
  setIsOpen,
  className = "",
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Keep resize listener minimal
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Safe capitalization
  const safeTitle =
    typeof id === "string" && id.length > 0
      ? id.charAt(0).toUpperCase() + id.slice(1)
      : "";

  // Animation variants for cleaner code
  const sideSheetVariants = {
    hidden: {
      opacity: 0,
      width: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        width: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.2, delay: 0.1 },
      },
    },
    visible: {
      opacity: 1,
      width: isMobile ? "100vw" : 600,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        width: { duration: 0.3, ease: "easeOut" },
        opacity: { duration: 0.2 },
      },
    },
  };

  const overlayVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      x: isMobile ? 0 : 20,
      y: isMobile ? 20 : 0,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.3, delay: 0.1 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Mobile overlay */}
          {isMobile && (
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setIsOpen()}
            />
          )}

          {/* Side sheet */}
          <motion.div
            key="sidesheet"
            className={`${
              isMobile ? "fixed top-0 right-0 bottom-0 z-50" : "relative"
            } ${className}`}
            variants={sideSheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              height: isMobile ? "100vh" : "auto",
              overflow: "hidden",
            }}
          >
            <Card className="h-full w-full text-black dark:text-white border-l border-gray-200 dark:border-gray-700">
              <motion.div
                className="w-full h-full px-[12px] py-[9px] flex flex-col"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.section
                  className="flex items-center justify-between flex-shrink-0"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  <h1 className="text-xl font-medium">{safeTitle}</h1>
                  <motion.button
                    onClick={() => setIsOpen()}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HiX className="w-5 h-5" />
                  </motion.button>
                </motion.section>

                <motion.div
                  className="mt-4 flex-1 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  {children}
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(SideSheet);
