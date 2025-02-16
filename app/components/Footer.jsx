import { Link } from "@remix-run/react"

const Footer = () => (
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
);

export default Footer