

const NaviBar = () => {
    return (
     <nav className="w-full h-16 bg-white border-b">
        <div className="h-full px-6 flex items-center">
          <div className="border border-gray-300 bg-gray-100 hover:bg-gray-200 active:scale-95 px-4 py-2 rounded-md transition-all cursor-pointer">
            <button className="font-semibold text-gray-800">
              NaviBar
            </button>
          </div>
        </div>
      </nav>
    );
};
export default NaviBar;
