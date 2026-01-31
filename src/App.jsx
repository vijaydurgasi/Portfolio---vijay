import "./index.css";
import NaviBar from "./Components/NaviBar";
import { useState, useEffect } from "react";
import Hero from "./Components/Hero";

function App() {

   const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
   });

 useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [isDark]);

const heroData = {
   name: "Vijay",
   role: "Frontend Developer",
  intro: "I build clean and scalable React applications."
};

  return (

   <div className="min-h-screen transition-colors bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
    <NaviBar isDark={isDark} setIsDark={setIsDark}/>
    <Hero heroData = {heroData}/>
    </div>

  );
};

export default App;