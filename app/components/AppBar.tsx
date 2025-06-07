import { HiAdjustmentsHorizontal, HiOutlineUser } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";

const AppBar = () => {
  return (
    <nav className="w-full py-1.5 px-3 bg-zinc-200 dark:bg-zinc-900/80 rounded-lg flex justify-between items-center">
      <div>
        <span className="font-semibold text-[17px]">KCB Reports</span>
      </div>

      <div className="flex gap-1.5">
        <button className="h-7.5 w-7.5 rounded-lg hover:bg-zinc-800/80 grid place-content-center">
          <IoSearch />
        </button>
        <button className="h-7.5 w-7.5 rounded-lg hover:bg-zinc-800/80 grid place-content-center">
          <HiAdjustmentsHorizontal />
        </button>
        <button className="h-7.5 w-7.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-800/50 grid place-content-center">
          <HiOutlineUser />
        </button>
      </div>
    </nav>
  );
};

export default AppBar;
