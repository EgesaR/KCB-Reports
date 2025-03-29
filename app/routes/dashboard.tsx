import { LoaderFunction, redirect, json } from "@remix-run/node";
import { Outlet, useLoaderData, useFetcher } from "@remix-run/react";
import {
  DashboardProvider,
  useDashboardContext,
} from "~/context/DashboardContext";
import { getUserSession } from "~/utils/session.server";
import { prisma } from "~/db.server";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { setEncryptedUserData } from "~/stores/user.store";
import { motion } from "framer-motion";
import { AppBar } from "~/components/ui/AppBar";
import NavigationRail from "~/components/NavigationRail";
import BottomNavigation from "~/components/BottomNavigation";
import { NotificationDrawer } from "~/components/NotificationDrawer";
import type { Notification } from "~/routes/notifications";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId) return redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, profileUrl: true },
  });

  if (!user) return redirect("/auth/signin");

  const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
  if (!ENCRYPTION_SECRET) throw new Error("ENCRYPTION_SECRET not defined");

  const encryptedUserData = CryptoJS.AES.encrypt(
    JSON.stringify(user),
    ENCRYPTION_SECRET
  ).toString();

  return json({ encryptedUserData });
};

export default function Dashboard() {
  const { encryptedUserData } = useLoaderData<{ encryptedUserData: string }>();

  useEffect(() => {
    if (encryptedUserData) {
      setEncryptedUserData(encryptedUserData);
    }
  }, [encryptedUserData]);

  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

function DashboardContent() {
  const { isMobile } = useDashboardContext();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationFetcher = useFetcher<{
    notifications: Notification[];
    unreadCount: number;
  }>();

  // Load initial notifications
  useEffect(() => {
    notificationFetcher.load("/notifications");
  }, []);

  // Update unread count
  useEffect(() => {
    if (notificationFetcher.data?.unreadCount !== undefined) {
      setUnreadCount(notificationFetcher.data.unreadCount);
    }
  }, [notificationFetcher.data]);

  const handleMarkAsRead = (id: string) => {
    // API call to mark as read would go here
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleArchive = (ids: string[]) => {
    // API call to archive would go here
    setUnreadCount((prev) => Math.max(0, prev - ids.length));
  };

  return (
    <div className="w-full h-screen flex overflow-hidden isolate relative bg-[#FEF7FF] dark:bg-[#141218]">
      {!isMobile && <NavigationRail />}

      <div className="h-full w-full pl-8 pr-4 pt-1 pb-4 bg-transparent relative">
        <motion.div
          className="h-[9%] w-full absolute top-0 left-0 z-10 border-b border-gray-900/20 dark:border-gray-100/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AppBar
            unreadCount={unreadCount}
            onNotificationClick={() => setIsNotificationOpen(true)}
          />
        </motion.div>

        <div
          className="h-full w-full sm:pt-[7%] pr-1 mt-2.5 overflow-y-auto pt-[16%]"
          style={{ scrollbarWidth: "none" }}
        >
          <Outlet />
        </div>

        <NotificationDrawer
          isOpen={isNotificationOpen}
          setIsOpen={setIsNotificationOpen}
          onMarkAsRead={handleMarkAsRead}
          onArchive={handleArchive}
        />
      </div>

      {isMobile && <BottomNavigation />}
    </div>
  );
}
