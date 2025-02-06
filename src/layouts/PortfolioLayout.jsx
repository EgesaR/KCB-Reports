import { useState } from "react";
import Navbar from "../components/Navbar";
import MobileSideBar from "../components/MobileSideBar";
import { Link } from "react-router-dom";
const PortfolioLayout = ({ children }) => {
 const [mobileSideBarOpen, setMobileSideBarOpen] = useState(false);
 return (
  <div
   className={`bg-white dark:bg-slate-900 min-h-screen ${mobileSideBarOpen ? "z-0" : ""}`}
  >
   {/* Navbar */}
   <Navbar open={mobileSideBarOpen} setOpen={setMobileSideBarOpen} />
   {/* Sidebar */}
   <MobileSideBar open={mobileSideBarOpen} setOpen={setMobileSideBarOpen} />
   <main>{children}</main>
   <footer className="mx-auto py-12 mt-6 border-t border-slate-600/20 dark:border-slate-200/40 text-zinc-700/80 dark:text-zinc-100/80">
    <div className="flex justify-center flex-wrap gap-y-3 gap-x-6 px-4">
     <Link to="/">Home</Link>
     <Link to="/about">About</Link>
     <Link to="/pricing">Pricing</Link>
     <Link to="/blogs">Blog</Link>
     <Link to="/docs/get-started">Learn & Docs</Link>
     <Link to="/contact">Contact</Link>
     <Link to="/auth/login">Login</Link>
    </div>
    <div className="text-center text-xs mt-6">© 2025 KCB Reports.</div>
   </footer>
  </div>
 );
};

export default PortfolioLayout;
