import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";
import TechBadge from "./TechBadge";

const NaviBar = ({ isDark, setIsDark }) => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 surface backdrop-blur supports-[backdrop-filter]:bg-opacity-80">
      <div className="h-full px-6 flex items-center justify-between">

        <Link
          to="/"
          className="text-xl cursor-pointer px-3 py-2 rounded-md border border-transparent transition-colors duration-200 hover:[border-color:var(--accent)]"
          aria-label="Go to Home">
          🏠
        </Link>

        <div>
          <TechBadge />
        </div>

        <div className="cursor-pointer">
          <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
        </div>

      </div>
    </nav>
  );
};

export default NaviBar;
