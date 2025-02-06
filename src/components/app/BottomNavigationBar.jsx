import { useState } from "react";
import {
 RiHome5Line,
 RiHome5Fill,
 RiStore2Line,
 RiStore2Fill,
 RiHeartsLine,
 RiHeartsFill,
 RiShoppingCartLine,
 RiShoppingCartFill
} from "react-icons/ri";
import { BsFileSpreadsheet, BsFileSpreadsheetFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import "../../styles/BottomNavBar.css";

const BottomNavigationBar = ({ active, setActive }) => {
 const handleNavClick = tab => {
  setActive(`/app/${tab === "home" ? "/" : tab}`);
 };
 return (
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
       id: "reports",
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
      }
     ].map(
      ({ id, label, icon, activeIcon, activeIconColor, badge, badgeStyle }) => (
       <li
        key={id}
        className={`${
         active === `/app/${
          id === "home" 
          ? "/" 
          : id
         }` 
         ? "active" 
         : ""
        }`}
        onClick={
        () => handleNavClick(id)
        }
       >
        <NavLink
         to={`/app/${id === "home" 
            ? "/" 
            : id}
          `}
         className="flex items-center justify-center flex-col-reverse text-[1.4em] w-[65px] h-[65px] transition-all duration-300 ease-out"
        >
         {
          badge !== undefined 
          && (
            <span 
              className={`${badgeStyle} badge`}
            >
              {badge}
            </span>
          )
         }
         <span
          className={`text-[10px] transition-all duration-300 ease-in-out absolute 
          ${
           active === `/app/${
                id === "home" 
                ? "/" 
                : id
              }`
              ? "translate-y-3.5"
              : "translate-y-12"
            }
          `}
         >
          {label}
         </span>
         <i
          className={
            active === `/app/${
              id === "home" 
              ? "/" 
              : id
           }` 
           ? activeIconColor 
           : ""
          }
         >
          {
            active === `/app/${
                id === "home" 
                ? "/" 
                : id
              }` 
             ? activeIcon 
             : icon
          }
         </i>
        </NavLink>
       </li>
      )
     )}
    </ul>
   </nav>
  </div>
 );
};

export default BottomNavigationBar;
