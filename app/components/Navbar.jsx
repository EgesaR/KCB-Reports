import { Link, NavLink } from "@remix-run/react";
import { useState } from "react";
import Button from "./Button";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: "Pricing", link: "/pricing" },
    { name: "Features", link: "/features" },
    { name: "Blog", link: "/blogs" },
    { name: "About", link: "/about" },
    { name: "Contact us", link: "/contact" },
    { name: "Docs", link: "/docs" },
  ];

  return (
    <header className="bg-white dark:bg-black/50 text-black fixed top-0 left-0 w-full z-20">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 py-4 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <h1 className="text-2xl font-semibold text-green-600/80 dark:text-green-300/90">
              KCB Reports
            </h1>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex lg:gap-x-12">
          {links.map((link) => (
            <NavLink
              key={link.link}
              to={link.link}
              className={({ isActive }) =>
                isActive
                  ? "text-green-400 text-sm font-semibold"
                  : "text-gray-900 dark:text-gray-200 text-sm font-semibold"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
          <button
            type="button"
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-blue-600 hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:bg-blue-100 focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:bg-blue-800/30 dark:focus:text-blue-400"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </button>
          <Link to="/auth/signup">
            <button
              type="button"
              class="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-10 bg-white dark:bg-gray-900 px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-6">
            {links.map((link) => (
              <NavLink
                key={link.link}
                to={link.link}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
