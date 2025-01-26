import React from "react";
import { RiPencilFill } from "react-icons/ri";
import { motion } from "framer-motion";
import Avatar from "./Avatar";

const AccountSlot = ({ name, accountType, active }) => {
  return (
    <div className="w-full flex px-1.5 py-2 gap-3 rounded-lg items-center text-sm font-normal justify-between bg-white hover:bg-neutral-200/40">
      <Avatar />
      <div className="flex flex-col gap-0.5">
        <label className="font-medium">{name}</label>
        <label className="text-xs">{accountType}</label>
      </div>
      {active ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-16 h-6 px-2 rounded-3xl ml-auto bg-green-200 flex justify-center items-center gap-1"
        >
          <RiPencilFill />
          Edit
        </motion.button>
      ) : (
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-16 h-6 px-2 rounded-3xl ml-auto bg-neutral-200 flex justify-center items-center gap-1"
        >
          Inactive
        </motion.button>
      )}
    </div>
  );
};

export default AccountSlot;
