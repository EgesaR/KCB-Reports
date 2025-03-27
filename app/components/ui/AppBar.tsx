import { IoMenu } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

const AppBar = () => {
  return (
    <div className="w-full z-50 h-full flex items-center justify-between px-2">
      <div className=" flex items-center gap-2.5">
        <button
          className="sm:hidden rounded-full border border-transparent p-1.5 text-center text-[19px] transition-all text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 focus:bg-slate-100 dark:focus:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800/50 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <IoMenu />
        </button>
        <label>KCB Reports</label>
      </div>
      <div className="flex items-center gap-1">
        <button
          className="rounded-full border border-transparent p-1.5 text-center text-[19px] transition-all text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 focus:bg-slate-100 dark:focus:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800/50 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <FaUserCircle />
        </button>
      </div>
    </div>
  );
};

export default AppBar