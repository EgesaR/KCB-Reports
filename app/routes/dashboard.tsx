// app/routes/dashboard.tsx
import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useMatches } from "@remix-run/react";
import NavigationRail from "~/components/NavigationRail";
import BottomNavigation from "~/components/BottomNavigation";
import { useEffect, useState } from "react";
import { getUserSession } from "~/utils/session.server";
import AppBar from "~/components/ui/AppBar";

export let loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);
  if (!session.has("userId")) {
    return redirect("/auth/signin");
  }
  return null;
};

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the breakpoint for mobile
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-screen flex overflow-hidden isolate relative text-black dark:text-white bg-white dark:bg-gray-950">
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
        <div className="h-[7.5%] w-full bg-slate-900/40 absolute top-0 left-0 z-10">
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
