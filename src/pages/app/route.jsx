import React, { useState } from "react";
import "./styles/index.css";
import HomeTab from "./tabs/HomeTab";
import ReportTab from "./tabs/ReportTab";

const Dashboard = ({ screens }) => {
 const [screen, setScreen] = useState("home");
 return (
  <>
   Hello {screens}
   {/* Page Sections */}
   <section className="overflow-hidden h-screen relative">
    {[
     { id: "home", bgColor: "bg-sky-100", title: <HomeTab /> },
     {
      id: "report",
      bgColor: "bg-orange-100",
      title: <ReportTab />
     },
     { id: "store", bgColor: "bg-teal-100", title: "Store" },
     {
      id: "wishlist",
      bgColor: "bg-rose-100",
      title: "Wishlist"
     },
     { id: "cart", bgColor: "bg-indigo-100", title: "Cart" }
    ].map(({ id, bgColor, title }) => (
     <div
      id={id}
      key={id}
      className={`${bgColor} h-screen ${
       screen === id ? "grid" : "hidden"
      } place-content-center text-2xl`}
     >
      {title}
     </div>
    ))}
   </section>
  </>
 );
};

export default Dashboard;
