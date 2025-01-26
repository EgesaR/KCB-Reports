import React, { useState } from "react";
import {
  RiHome5Line, RiHome5Fill,
  RiStore2Line, RiStore2Fill,
  RiHeartsLine, RiHeartsFill,
  RiShoppingCartLine, RiShoppingCartFill
} from "react-icons/ri";
import { BsFileSpreadsheet, BsFileSpreadsheetFill } from "react-icons/bs";
import "./styles/index.css";
import HomeTab from "./tabs/HomeTab"
import ReportTab from "./tabs/ReportTab"
import NotificationSidebar from "../../components/app/NotificationSidebar"
import SettingScreen from "./screens/Settings"

const Dashboard = () => {
  const [active, setActive] = useState("home");
  const [screen, setScreen] = useState(null)
  
  const handleNavClick = (section) => {
    setActive(section);
    document.getElementById(section).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-emerald-700 h-screen w-full relative">
      <NotificationSidebar />
      <SettingScreen />
      <div className="max-w-[100%] mx-auto">
        {/* Bottom Navigation Bar */}
        <nav
          className="fixed bottom-[0%] w-full bg-green-200 rounded-t-[5px] shadow-2xl overflow-hidden z-20 grid place-content-center shadow-2xl"
          id="bottomNavBar"
        >
          <ul className="flex items-center justify-between">
            {/* Navigation Items */}
            {[
              { 
                id: "home", 
                label: "Home", 
                icon: <RiHome5Line />,
                activeIcon: <RiHome5Fill />,
                activeIconColor: "text-sky-500"
              },
              { 
                id: "report", 
                label: "Report", 
                icon: <BsFileSpreadsheet />,
                activeIcon: <BsFileSpreadsheetFill />,
                activeIconColor: "text-orange-500"
              },
              { 
                id: "store", 
                label: "Store", 
                icon: <RiStore2Line />,
                activeIcon: <RiStore2Fill />,
                activeIconColor: "text-teal-500",
                badge: "sale", 
                badgeStyle: "text-pink-500 bg-pink-600/20 right-[-9.5px]" 
              },
              { 
                id: "wishlist", 
                label: "Wishlist", 
                icon: <RiHeartsLine />,
                activeIcon: <RiHeartsFill />,
                activeIconColor: "text-rose-500"
              },
              { 
                id: "cart", 
                label: "Cart", 
                icon: <RiShoppingCartLine />, 
                activeIcon: <RiShoppingCartFill />,
                activeIconColor: "text-indigo-500",
                badge: 88, 
                badgeStyle: "bg-yellow-600/20 text-yellow-500 right-[-0.5px]" 
              },
            ].map(({ id, label, icon, activeIcon,activeIconColor, badge, badgeStyle }) => (
              <li
                key={id}
                className={`${active === id ? "active" : ""}`}
                onClick={() => handleNavClick(id)}
              >
                <a
                  href={`#${id}`}
                  className="flex items-center justify-center flex-col-reverse text-[1.4em] w-[65px] h-[65px] transition-all duration-300 ease-out"
                >
                  {badge !== undefined && (
                    <span
                      className={`${badgeStyle} badge`}
                    >
                      {badge}
                    </span>
                  )}
                  <span className={`text-[10px] transition-all duration-300 ease-in-out absolute ${active === id ? "translate-y-3.5" : "translate-y-12"}`}>{label}</span>
                  <i className={active === id ? activeIconColor : ""}>{active === id ? activeIcon : icon}</i>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Page Sections */}
        <section className="overflow-hidden h-screen relative">
          {[
            { id: "home", bgColor: "bg-sky-100", title: <HomeTab /> },
            { id: "report", bgColor: "bg-orange-100", title: <ReportTab /> },
            { id: "store", bgColor: "bg-teal-100", title: "Store" },
            { id: "wishlist", bgColor: "bg-rose-100", title: "Wishlist" },
            { id: "cart", bgColor: "bg-indigo-100", title: "Cart" },
          ].map(({ id, bgColor, title }) => (
            <div
              id={id}
              key={id}
              className={`${bgColor} h-screen ${active === id ? "grid" : "hidden"} place-content-center text-2xl`}
            >
              {title}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
