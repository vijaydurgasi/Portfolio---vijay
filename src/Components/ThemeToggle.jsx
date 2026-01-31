
const ThemeToggle = ({ isDark, setIsDark }) => {
  
  return (
    <div
      onClick={() => setIsDark(!isDark)}
      className="px-4 py-2 rounded-md cursor-pointer select-none transition-all bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white">
      {isDark ? "Dark" : "Light"}
    </div>
  );
};

export default ThemeToggle;
