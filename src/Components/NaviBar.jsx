import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";
import TechBadge from "./TechBadge";

const NaviBar = ({ isDark, setIsDark }) => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="h-full px-6 flex items-center justify-between">

        <Link
          to="/"
          className="text-2xl cursor-pointer px-3 py-2 rounded-md border border-transparent transition-transform duration-200
           hover:border-gray-300
           active:border-blue-500"
          aria-label="Go to Home">
          🏠
        </Link>

        <div>
          <TechBadge />
        </div>

        <div
          className="border border-gray-300 hover:bg-gray-200 active:scale-95 px-4 py-2 rounded-md transition-all cursor-pointer font-semibold">
          <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
        </div>

      </div>
    </nav>
  );
};

export default NaviBar;
