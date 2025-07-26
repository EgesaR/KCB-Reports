import { useState, useEffect } from "react";
import { useMatches } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "~/components/SideBar";
import ReportHeader from "~/components/ReportHeader";
import Card from "~/components/Card";
import SideSheet from "~/components/SideSheet";
import AppBar from "~/components/AppBar";
import SidebarModal from "~/components/SidebarModal";
import { useReport } from "~/contexts/ReportContext";

const isReportRoute = (matches: ReturnType<typeof useMatches>): boolean => {
  return matches.some((match) => match.id.includes("routes/reports"));
};

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const matches = useMatches();
  const { toggleSideSheet, openSideSheet } = useReport();
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col py-2 px-0 sm:px-2.5 gap-2.5">
      {isReportRoute(matches) ? (
        <ReportHeader />
      ) : (
        <AppBar
          setSidesheet={toggleSideSheet}
        />
      )}
      <div className="flex-1 h-full flex gap-2 relative">
                      {/* Render SideBar always on desktop, only when SideSheet is open on mobile */}
        {(!isMobile || openSideSheet === "settings") && (
          <SideBar toggleSideSheet={toggleSideSheet} />
        )}
        <AnimatePresence mode="wait">
          <section className="flex-1 h-[90%] grow flex flex-col gap-2">
            <motion.main
              className={`h-full relative w-full flex gap-4 p-2 px-1 sm:py-2 transition-all duration-500 ${
                openSideSheet === "settings" && isMobile ? "hidden" : ""
              }`}
              initial={{ opacity: 0, width: "100%" }}
              animate={{
                opacity: 1,
                //width:
                //openSideSheet === "settings" && !isMobile
                //</section>? `calc(100% - ${600 + (isMobile ? 0 : 256)}px)` // 600px SideSheet + 256px SideBar
                //: `calc(100% - ${isMobile ? 0 : 256}px)`, // 256px SideBar on desktop
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Card className="w-full ease-in-out transition-opacity duration-300 text-white">
                {children}
              </Card>
              {openSideSheet && (
                <SideSheet
                  id="settings"
                  isOpen={openSideSheet === "settings"}
                  setIsOpen={toggleSideSheet}
                  className="z-50"
                >
                  <div className="">
                    <p>Settings Panel Content</p>
                    <button className="mt-2 bg-blue-600 px-4 py-2 rounded">
                      Adjust Settings
                    </button>
                  </div>
                </SideSheet>
              )}
              <SidebarModal />
            </motion.main>
          </section>
        </AnimatePresence>
      </div>
    </div>
  );
}
