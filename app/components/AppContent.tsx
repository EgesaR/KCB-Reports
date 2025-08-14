// app/components/AppContent.tsx
import { useMatches } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "~/components/SideBar";
import ReportHeader from "~/components/ReportHeader";
import SideSheet from "~/components/SideSheet";
import AppBar from "~/components/AppBar";
import SidebarModal from "~/components/SidebarModal";
import { memo, useMemo, useState, type ReactNode, useCallback } from "react";

/**
 * Determines if the current route is a report detail route (/reports/:id)
 */
const isReportDetailRoute = (
  matches: ReturnType<typeof useMatches>
): boolean => {
  return matches.some(
    (match) =>
      match.id === "routes/reports.$id" ||
      (match.id?.startsWith("routes/reports.") && !!match.params?.id)
  );
};

interface AppContentProps {
  children: ReactNode;
}

const AppContent = memo(({ children }: AppContentProps) => {
  const matches = useMatches();
  const [openSideSheet, setOpenSideSheet] = useState<string | null>(null);

  // Memoize the route type so we don't recalc on every render unless matches change
  const reportDetail = useMemo(() => isReportDetailRoute(matches), [matches]);

  // Memoized function to toggle the side sheet
  const toggleSideSheet = useCallback((id: string) => {
    setOpenSideSheet((prev) => (prev === id ? null : id));
  }, []);

  // Memoized function to close the side sheet
  const closeSideSheet = useCallback(() => {
    setOpenSideSheet(null);
  }, []);

  // Header animation variants
  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:flex">
        <SideBar toggleSideSheet={toggleSideSheet} />
      </div>

      {/* Sidebar Modal (mobile) */}
      <SidebarModal />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {reportDetail ? (
            <motion.div
              key="report-header"
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex-shrink-0"
            >
              <ReportHeader />
            </motion.div>
          ) : (
            <motion.div
              key="app-bar"
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex-shrink-0"
            >
              <AppBar setSidesheet={toggleSideSheet} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <motion.main
          className="flex-1 overflow-y-auto p-4 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>

      {/* Right Panel (SideSheet) */}
      <SideSheet
        id={openSideSheet || ""}
        isOpen={!!openSideSheet}
        setIsOpen={closeSideSheet}
      >
        <div className="font-comfortaa text-gray-900 dark:text-neutral-200">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            Content for {openSideSheet} panel
          </motion.div>
        </div>
      </SideSheet>
    </div>
  );
});

AppContent.displayName = "AppContent";

export default AppContent;
