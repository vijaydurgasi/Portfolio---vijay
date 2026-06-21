
const ThemeToggle = ({ isDark, setIsDark }) => {

  return (
    <button
      type="button"
      onClick={() => setIsDark(!isDark)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-10 h-10 flex items-center justify-center rounded-full surface card-hover cursor-pointer select-none text-base">
      {isDark ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
