import ThemeToggle from "./ThemeToggle";

const NaviBar = ({isDark, setIsDark}) => {
  return (
    <nav className="w-full h-16 border-b transition-colors bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="h-full px-6 flex items-center">
        <div
          className="border border-gray-300  hover:bg-gray-200 active:scale-95  px-4 py-2 rounded-md transition-all  cursor-pointer font-semibold text-gray-800">
           <ThemeToggle isDark = {isDark} setIsDark = {setIsDark}/>
        </div>
      </div>
    </nav>
  );
};

export default NaviBar;
