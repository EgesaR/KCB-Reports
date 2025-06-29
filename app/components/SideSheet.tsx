import { useState } from "react";
import { HiX } from "react-icons/hi";
import Card from "./Card";

interface SideSheetProps {
  id: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: () => void;
}

const SideSheet: React.FC<SideSheetProps> = ({
  id,
  children,
  isOpen,
  setIsOpen,
}) => {
  const variants = {
    open: { width: 300 },
    closed: { width: 10 },
  };

  return (
    <Card
      variants={variants}
      animate={isOpen ? "open" : "closed"}
      className="h-full"
    >
      <div className="h-full w-full bg-red-800 flex">
        <hr className="border border-white h-full" />
        <div className="w-full h-full px-[18px] py-[9px]">
          <section className="flex items-center justify-between">
            <h1 className="border text-xl">
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </h1>
            <button onClick={setIsOpen}>
              <HiX />
            </button>
          </section>
          {isOpen && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </Card>
  );
};

export default SideSheet;
