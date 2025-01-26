import { NavLink, Link } from "react-router"
import { FaX, FaPlay, FaHouse, FaDollarSign, FaBlog, FaWandMagicSparkles } from "react-icons/fa6"
import { IoApps, IoInformationCircleOutline, IoMegaphone, IoDocument } from "react-icons/io5"
import Button from "./Button"

const CustomLink = ({children, to, className}) => {
  return(
    <NavLink to={to} className={
    ({ isActive, isPending, isTransitioning }) =>
    [
      "flex items-center justify-center h-full",
      className,
      isPending ? "pending" : "",
      isActive ? "text-green-400" : "text-black/70",
      isTransitioning ? "transitioning" : "",
    ].join(" ")
  }>
      {children}
    </NavLink>
  );
}

const MobileSideBar = ({open, setOpen}) => {
  return (
   <aside className={`h-screen transition-all duration-800 fixed top-0 z-50 backdrop-blur ${open ? "left-0 w-[70%]" : "left-[-110%]"}`}>
     <nav className="h-full flex flex-col bg-green-100/60 shadow-md border-r">
       <div className="p-4 pb-2 flex justify-between items-center">
         <div>
         </div>
         <Button className="h-10 w-10 rounded-full grid place-items-center" onClick={() => setOpen(false)}>
           <FaX />
         </Button>
       </div>
       <div className={`flex justify-center items-center transition-all duration-800  ${open ? "w-[100%]" : "w-0 overflow-hidden"}`}>
         <div className="pl-4 pr-2 py-1 border border-green-400 rounded-2xl flex items-center gap-3 text-lg font-light w-[85%]">
           <FaWandMagicSparkles />
           <p className="text-[11px] w-full">KCB Report 1.0 Update is here</p>
         </div>
       </div>
               <ul className="flex-1 gap-3 text-lg mt-4">
          <MobileSideBarItem 
            icon={<FaHouse />} 
            text="Home" 
            to="/" 
            open={open}
          />
          <MobileSideBarItem 
            icon={<IoApps />} 
            text="Features" 
            to="/features"
            open={open}
          />
          <MobileSideBarItem 
            icon={<FaDollarSign />} 
            text="Pricing" 
            to="/pricing" 
            open={open}
          />
          <MobileSideBarItem 
            icon={<FaBlog />} 
            text="Updates" 
            to="/blog" 
            open={open}
          />
          <MobileSideBarItem
            icon={<IoInformationCircleOutline />} 
            text="About" 
            to="/about" 
            open={open}
          />
          <MobileSideBarItem 
            icon={<IoMegaphone />} 
            text="Contact" 
            to="/contact"
            open={open}
          />
          <MobileSideBarItem 
            icon={<IoDocument />} 
            text="Learn & Docs" 
            to="/docs/get-started" 
            open={open}
          />
         </ul>
       <div className="flex p-3 border-t flex-col justify-center items-center gap-4 mb-3">
         <Button className={`flex items-center justify-center gap-2 py-2.5 rounded-lg overflow-hidden transition-all duration-300 ${open ? "w-full": "w-0" }`}>
           <FaPlay />
           <label>
            Launch Demo
           </label>
         </Button>
         <div className="w-full grid grid-cols-2 gap-6">
           <Button className={`overflow-hidden py-2 rounded-lg transition-all duration-300 ${open ? "w-full": "w-0" }`}>
             <Link to="/auth/login" className="w-full">
               Log in
             </Link>
           </Button>
           <Button className={`overflow-hidden py-2 rounded-lg transition-all duration-300 ${open ? "w-full": "w-0" }`}>
             <Link to="/auth/signup" className="w-full">
               Sign up
             </Link>
           </Button>
         </div>
       </div>
     </nav>
   </aside>
  )
}

const MobileSideBarItem = ({icon, text, to, open}) => {
  return(
    <li className="flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer hover:bg-green-50 text-gray-600">
      <CustomLink to={to} className="w-full transition duration-300">
        <div className={`overflow-hidden transition-all duration-300 ${open ? "w-10 ml-3": "w-0" }`}>
          {icon}
        </div>
        <span className={`overflow-hidden transition-all duration-300 ${open ? "w-full ml-4": "w-0" }`}>
          {text}
        </span>
      </CustomLink>
    </li>
  )
}

export default MobileSideBar