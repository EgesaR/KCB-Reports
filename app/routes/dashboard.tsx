import { LoaderFunction, redirect, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import NavigationRail from "~/components/NavigationRail";
import BottomNavigation from "~/components/BottomNavigation";
import AppBar from "~/components/ui/AppBar";
import {
  DashboardProvider,
  useDashboardContext,
} from "~/context/DashboardContext";
import { getUserSession } from "~/utils/session.server";
import { prisma } from "~/db.server";
import { useEffect } from "react";
import CryptoJS from "crypto-js";
import { setEncryptedUserData } from "~/stores/user.store";

export let loader: LoaderFunction = async ({ request }) => {
  // Step 1: Validate the user's session
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId) {
    return redirect("/auth/signin");
  }

  // Step 2: Fetch user data from Prisma
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      profilePicture: true, // Add fields as needed
    },
  });

  if (!user) {
    return redirect("/auth/signin");
  }

  // Step 3: Encrypt the user data
  const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET!;
  console.log("ENCRYPTION",ENCRYPTION_SECRET)
  const encryptedUserData = CryptoJS.AES.encrypt(
    JSON.stringify(user),
    ENCRYPTION_SECRET
  ).toString();

  // Step 4: Return the encrypted user data
  return json({ encryptedUserData });
};

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

function DashboardContent() {
  const { isMobile, setIsMobile } = useDashboardContext();

  useEffect(() => {
    // Update screen size state
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile breakpoint
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  useEffect(() => {
    // Fetch encrypted user data from the loader
    (async () => {
      const response = await fetch("/dashboard", { method: "GET" });
      if (response.ok) {
        const { encryptedUserData } = await response.json();
        console.log("Encrypted User Data:", encryptedUserData);
        // Use nanostores or any state manager to decrypt and store data
        setEncryptedUserData(encryptedUserData); // Example of using a nanostore
      } else {
        console.error("Failed to fetch user data.");
      }
    })();
  }, []);

  return (
    <div className="w-full h-screen flex overflow-hidden isolate relative text-black dark:text-white bg-[#FEF7FF] dark:bg-gray-950">
      {/* Background Gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.7%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5]/70 via-[#9089fc]/50 to-[#6495ED]/30 opacity-30"
        />
      </div>

      {/* NavigationRail for Big Screens */}
      {!isMobile && <NavigationRail />}

      {/* Main Content */}
      <div className="h-full w-full pl-8 pr-4 pt-1 pb-4 bg-transparent relative">
        {/* Fixed Navbar */}
        <div className="h-[7.5%] w-full bg-white/60 dark:bg-slate-900/40 absolute top-0 left-0 z-10">
          <AppBar />
        </div>

        {/* Scrollable Content */}
        <div
          className="h-full w-full sm:pt-[7%] pr-1 mt-2.5 overflow-y-scroll pt-[16%]"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // Internet Explorer/Edge
          }}
        >
          <style>
            {`
              /* For Webkit-based browsers like Chrome, Safari */
              ::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          <Outlet />
        </div>
      </div>

      {/* BottomNavigation for Mobile Screens */}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
