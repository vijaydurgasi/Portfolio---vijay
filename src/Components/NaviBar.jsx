import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";
import TechBadge from "./TechBadge";

const NaviBar = ({ isDark, setIsDark }) => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 surface backdrop-blur supports-[backdrop-filter]:bg-opacity-80">
      <div className="h-full px-6 flex items-center justify-between">

        <Link
          to="/"
          className="w-10 h-10 flex items-center justify-center rounded-full surface card-hover text-mut hover:text-accent transition-colors duration-200"
          aria-label="Go to Home"
          title="Home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 transition-transform duration-200 hover:scale-110"
            aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
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
