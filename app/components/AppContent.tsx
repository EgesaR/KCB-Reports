// app/components/AppContent.tsx
import { useMatches } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "~/components/SideBar";
import ReportHeader from "~/components/ReportHeader";
import SideSheet from "~/components/SideSheet";
import AppBar from "~/components/AppBar";
import SidebarModal from "~/components/SidebarModal";
import { memo, useMemo, useState, type ReactNode } from "react";

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

  // Function to toggle the side sheet
  const toggleSideSheet = (id: string) => {
    setOpenSideSheet((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ReportHeader />
            </motion.div>
          ) : (
            <motion.div
              key="app-bar"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AppBar setSidesheet={toggleSideSheet} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>

      {/* Right Panel (optional) */}
      {openSideSheet && (
        <SideSheet
          id={openSideSheet}
          isOpen={!!openSideSheet}
          setIsOpen={() => setOpenSideSheet(null)}
        >
          <div className="font-comfortaa text-gray-900 dark:text-neutral-200">
            Content for {openSideSheet} panel
          </div>
        </SideSheet>
      )}
    </div>
  );
});

AppContent.displayName = "AppContent";

export default AppContent;
