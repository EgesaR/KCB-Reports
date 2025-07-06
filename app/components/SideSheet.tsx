import { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import Card from "./Card";
import { useAnimate, usePresence } from "framer-motion";

interface SideSheetProps {
  id: string;
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
  setIsOpen: (id: string) => void;
}

const SideSheet: React.FC<SideSheetProps> = ({
  id,
  children,
  isOpen,
  setIsOpen,
  className,
}) => {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handle window resize for mobile detection (client-side only)
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (isOpen && isPresent) {
      // Entry animation
      animate(
        scope.current,
        { opacity: 1, width: isMobile ? "100vw" : 500, display: "flex" },
        { duration: 0.3, ease: "easeOut" }
      );
    } else {
      // Exit animation
      const exitAnimation = async () => {
        await animate(
          scope.current,
          { opacity: 0, width: 0 },
          { duration: 0.3, ease: "easeOut" }
        );
        if (!isPresent) {
          safeToRemove();
        }
      };
      exitAnimation();
    }
  }, [isOpen, isPresent, animate, scope, safeToRemove, isMobile]);

  if (!isOpen && isPresent) {
    // Allow rendering during exit animation
    return (
      <Card
        ref={scope}
        initial={{ opacity: 0, width: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", staggerChildren: -0.3 }}
        className={`h-full ${className}`}
      >
        <div className="h-full w-full flex">
          <div className="w-full h-full px-[18px] py-[9px]">
            <section className="flex items-center justify-between">
              <h1 className="text-xl">
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </h1>
              <button onClick={() => setIsOpen(id)}>
                <HiX />
              </button>
            </section>
            <div className="mt-4">{children}</div>
          </div>
        </div>
      </Card>
    );
  }

  if (!isOpen && !isPresent) {
    return null;
  }

  return (
    <Card
      ref={scope}
      initial={{ opacity: 0, width: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`h-full relative ${className}`}
    >
        <div className="w-full h-full px-[12px] py-[9px]">
          <section className="flex items-center justify-between">
            <h1 className="text-xl">
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </h1>
            <button onClick={() => setIsOpen(id)}>
              <HiX />
            </button>
          </section>
          <div className="mt-4">{children}</div>
        </div>
    </Card>
  );
};

export default SideSheet;
