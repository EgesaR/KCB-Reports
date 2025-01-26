import { useState } from "react";
import Dialog from "./Dialog";
import Avatar from "./Avatar"
import { 
  RiSunFill, RiCircleLine, 
  RiMoonLine, RiMoonClearFill, 
  RiTv2Fill, RiTv2Line, 
  RiSettingsFill, RiFeedbackFill,
  RiQuestionFill } from "react-icons/ri"
import { MdSwitchAccount, MdOutlineLogout } from "react-icons/md"
import { HiBookOpen } from "react-icons/hi"
import { motion } from "framer-motion"
import Settings from "../../pages/app/screens/Settings"

const ProfileDialog = ({ open, onClose }) => {
  const [openSettings, setOpenSettings] = useState(false)
  
  return (
    <Dialog open={open} onClose={onClose}>
      <AccountSlot />
      <ThemeSlot />
      {/* Other Link Buttons*/}
      <div className="flex flex-col gap-1.5 pt-6 mt-2 border-t border-neutral-100">
        <IconLinkButton 
          icon={<MdSwitchAccount />} 
          text="Other Accounts" 
        />
        <IconLinkButton 
          icon={<HiBookOpen />} 
          text="Documentation" 
        />
        <IconLinkButton 
          icon={<RiSettingsFill />} 
          text="Settings" 
        />
        <IconLinkButton 
          icon={<RiFeedbackFill />} 
          text="Feedback" 
        />
        <IconLinkButton icon={<RiQuestionFill />} text="Help" />
      </div>
      {/* Log out section */}
      <div className="pt-6 mt-2 border-t border-neutral-100 w-full flex">
        <IconLinkButton 
          className="ml-auto"
          icon={<MdOutlineLogout />} 
          text="Log out" 
        />
      </div>
    </Dialog>
  );
};

const AccountSlot = () => (
    <motion.div
      whileTap={{
        scale: 0.95
      }}
      className="flex py-2 px-1 rounded-lg hover:bg-neutral-100"
    >
      <Avatar />
      <div className="ml-4 overflow-scroll">
        <p className="text-sm font-medium text-slate-900">
          John Doe
        </p>
        <p className="text-sm text-slate-500 truncate">
          johndoe@gmail.com
        </p>
      </div>
    </motion.div>
)

const ThemeSlot = () => {
  const [active, setActive] = useState("light")
  return(
    <div className="flex mt-2 pt-6 border-t border-neutral-100 justify-between">
      <button 
        className={`px-8 py-1 rounded-lg flex justify-center items-center relative transition-colors duration-300 ${
            active === "light" ? 
            "bg-neutral-100" : 
            "" 
          }
        `}
        onClick={() => setActive("light")}
      >
        {
          active === "light" ? (
            <RiSunFill size={18} />
          ) : (
            <RiCircleLine 
              size={18} 
              className="absolute translate-y-0 translate-x-0"
            />
          )}
      </button>
      <button 
        className={`px-8 py-1 rounded-lg flex justify-center items-center relative transition-colors duration-300 ${
            active === "dark" ? 
            "bg-neutral-100" : 
            "" 
          }
        `}
        onClick={() => setActive("dark")}
      >
        {
          active === "dark" ? (
            <RiMoonClearFill size={18} />
          ) : (
            <RiMoonLine 
              size={18} 
              className="absolute translate-y-0 translate-x-0"
            />
        )}
      </button>
      <button 
        className={`px-8 py-1 rounded-lg flex justify-center items-center relative transition-colors duration-300 ${
            active === "system" ? 
            "bg-neutral-100" : 
            "" 
          }
        `}
        onClick={() => setActive("system")}
      >
        {
          active === "system" ? (
            <RiTv2Fill size={18} />
          ) : (
            <RiTv2Line 
              size={18} 
              className="absolute translate-y-0 translate-x-0"
            />
        )}
      </button>
    </div>
  )
}

const IconLinkButton = ({ icon, text, className }) => {
  return(
    <motion.button 
      whileTap={{
        scale: 0.98
      }}
      className={`flex gap-4 px-2 py-1.5 rounded-lg text-neutral-500 hover:bg-gradient-to-br from-neutral-100 to-neutral-200 font-medium items-center transition-colors ${className}`}
    >
      {icon}
      <p className="text-sm">
        {text}
      </p>
    </motion.button>
  )
}

export default ProfileDialog;
