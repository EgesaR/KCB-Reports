// app/components/SideSheet.tsx
import { memo, useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import Card from "./Card";
import { useAnimate, usePresence } from "framer-motion";

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
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const [isMobile, setIsMobile] = useState(false);

  // Keep resize listener minimal
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animate in/out
  useEffect(() => {
    const run = async () => {
      if (isOpen && isPresent) {
        await animate(
          scope.current,
          {
            opacity: 1,
            width: isMobile ? "100vw" : 600,
            height: isMobile ? "100%" : "auto",
            display: "flex",
          },
          { duration: 0.3, ease: "easeOut" }
        );
      } else {
        await animate(
          scope.current,
          { opacity: 0, width: 0, height: isMobile ? "100%" : "auto" },
          { duration: 0.3, ease: "easeOut" }
        );
        if (!isPresent) safeToRemove();
      }
    };
    run();
  }, [isOpen, isPresent, animate, scope, safeToRemove, isMobile]);

  if (!isOpen && !isPresent) return null;

  // Safe capitalization
  const safeTitle =
    typeof id === "string" && id.length > 0
      ? id.charAt(0).toUpperCase() + id.slice(1)
      : "";

  return (
    <Card
      ref={scope}
      initial={{ opacity: 0, width: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`h-full text-black dark:text-white ${className} ${
        isMobile
          ? "absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 sm:py-1"
          : "relative"
      }`}
    >
      <div className="w-full h-full px-[12px] py-[9px]">
        <section className="flex items-center justify-between">
          <h1 className="text-xl">{safeTitle}</h1>
          <button onClick={() => setIsOpen(id)}>
            <HiX />
          </button>
        </section>
        <div className="mt-4">{children}</div>
      </div>
    </Card>
  );
};

export default memo(SideSheet);
