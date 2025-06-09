import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiAdjustmentsHorizontal, HiOutlineUser } from "react-icons/hi2";
import { IoChevronDownCircleOutline, IoSearch } from "react-icons/io5";

const AppBar = () => {
  return (
    <nav className="w-full py-1.5 px-3 bg-zinc-100 dark:bg-zinc-900/80 rounded-lg flex justify-between items-center">
      <div>
        <span className="font-semibold text-[17px]">KCB Reports</span>
      </div>

      <div className="flex gap-1.5">
        <button className="h-7.5 w-7.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800/80 grid place-content-center">
          <IoSearch />
        </button>
        <button className="h-7.5 w-7.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800/80 grid place-content-center">
          <HiAdjustmentsHorizontal />
        </button>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="h-7.5 w-7.5 rounded-lg bg-zinc-200/90 dark:bg-zinc-800/90 hover:bg-zinc-100/50 hover:bg-zinc-800/50 hover:text-white dark:hover:text-black grid place-content-center focus-visible:outline-0">
              <HiOutlineUser aria-hidden="true" />
            </MenuButton>
          </div>
          <MenuItems
            transition
            className="absolute right-4 z-10 mt-2 w-56 origin-top-right divide-y divide-zinc-100 rounded-md bg-white  shadow-lg ring-1 ring-black/5 transition focus:outline-hidden dark:divide-zinc-800 dark:bg-zinc-900 dak:ring-white/5 data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:text-zinc-200 data-focus:dark:bg-zinc-800 dark:data-focus:text-zinc-200 data-focus:outline-hidden"
                >
                  Edit
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:text-zinc-200 data-focus:dark:bg-zinc-800 dark:data-focus:text-zinc-200 data-focus:outline-hidden"
                >
                  Duplicate
                </a>
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:text-zinc-200 data-focus:dark:bg-zinc-800 dark:data-focus:text-zinc-200 data-focus:outline-hidden"
                >
                  Archive
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:text-zinc-200 data-focus:dark:bg-zinc-800 dark:data-focus:text-zinc-200 data-focus:outline-hidden"
                >
                  Move
                </a>
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:text-zinc-200 data-focus:dark:bg-zinc-800 dark:data-focus:text-zinc-200 data-focus:outline-hidden"
                >
                  Share
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:text-zinc-200 data-focus:dark:bg-zinc-800 dark:data-focus:text-zinc-200 data-focus:outline-hidden"
                >
                  Add to favorites
                </a>
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm bg-red-300/20 text-red-300 transition-colors data-focus:bg-red-600 data-focus:text-red-200 data-focus:outline-hidden"
                >
                  Delete
                </a>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </nav>
  );
};

export default AppBar;
