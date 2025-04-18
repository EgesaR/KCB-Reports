import type { LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Outlet, useLoaderData, useFetcher } from "@remix-run/react";
import {
  DashboardProvider,
  useDashboardContext,
} from "~/context/DashboardContext";
import { getUserSession } from "~/utils/session.server";
import { prisma } from "~/utils/prisma.server";
import { motion } from "framer-motion";
import { AppBar } from "~/components/ui/AppBar";
import NavigationRail from "~/components/NavigationRail";
import BottomNavigation from "~/components/BottomNavigation";
import { NotificationDrawer } from "~/components/NotificationDrawer";
import type { AppNotification } from "~/types/notification";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { ThemeProvider } from "~/context/ThemeContext";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId) return redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      profileUrl: true,
      roles: {
        select: { role: true },
      },
      themePreference: true, // Fetch the user's theme preference
    },
  });

  if (!user) return redirect("/auth/signin");

  const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
  if (!ENCRYPTION_SECRET) throw new Error("ENCRYPTION_SECRET not defined");

  const encryptedUserId = CryptoJS.AES.encrypt(
    JSON.stringify({
      ...user,
      roles: user.roles.map((r) => r.role),
    }),
    ENCRYPTION_SECRET
  ).toString();

  return json({ encryptedUserId, themePreference: user.themePreference });
};

export default function Dashboard() {
  const { encryptedUserId, themePreference } = useLoaderData<{
    encryptedUserId: string;
    themePreference: string;
  }>();

  return (
    <DashboardProvider encryptedUserId={encryptedUserId}>
      <ThemeProvider themeRGB={getThemeFromPreference(themePreference)}>
        <DashboardContent />
      </ThemeProvider>
    </DashboardProvider>
  );
}

function DashboardContent() {
  const { isMobile, user } = useDashboardContext();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationFetcher = useFetcher<{
    notifications: AppNotification[];
    unreadCount: number;
  }>();

  useEffect(() => {
    if (notificationFetcher.state === "idle" && !notificationFetcher.data) {
      notificationFetcher.load("/notifications");
    }
  }, [notificationFetcher]);

  useEffect(() => {
    if (notificationFetcher.data?.unreadCount !== undefined) {
      setUnreadCount(notificationFetcher.data.unreadCount);
    }
  }, [notificationFetcher.data]);

  const handleMarkAsRead = (id: string) => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleArchive = (ids: string[]) => {
    setUnreadCount((prev) => Math.max(0, prev - ids.length));
  };

  if (!user) return null;

  return (
    <div className="w-full h-screen flex overflow-hidden isolate relative bg-[#FEF7FF] dark:bg-[#141218]">
      {!isMobile && <NavigationRail user={user} />}

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
            user={user}
          />
        </motion.div>

        <div className="h-full w-full overflow-y-auto pt-[20%] sm:pt-[2%] mt-0 sm:overflow-y-hidden">
          <Outlet />
        </div>

        <NotificationDrawer
          isOpen={isNotificationOpen}
          setIsOpen={setIsNotificationOpen}
          unreadCount={unreadCount}
          onMarkAsRead={handleMarkAsRead}
          onArchive={handleArchive}
        />
      </div>

      {isMobile && <BottomNavigation user={user} />}
    </div>
  );
}

// Helper function to map theme preferences to RGB values
function getThemeFromPreference(
  themePreference: string
): Record<string, string> {
  switch (themePreference) {
    case "dark":
      return {
        "rgb-accent-1": "255, 65, 54", // Example dark theme accent color
        "rgb-primary": "139, 92, 246", // Example dark theme primary color
      };
    case "light":
    default:
      return {
        "rgb-accent-1": "252, 66, 201", // Example light theme accent color
        "rgb-primary": "213, 96, 18", // Example light theme primary color
      };
  }
}
