import "./index.css";
import NaviBar from "./Components/NaviBar";
import { useState, useEffect } from "react";
import tomImg from "./assets/tom.jpg";
import Body from "./Components/Body";

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
    intro: "I build clean and scalable React applications.",
    image: tomImg,
  };

 const skillsData = [
  "⚛️ React",
  "🟨 JavaScript (ES6+)",
  "🧠 Problem Solving",
  "🧩 Component Design",
];

const toolsData = [
  "🎨 Tailwind CSS",
  "🔧 Git & GitHub",
  "🛠️ VS Code",
  "🌐 REST APIs",
];

const projectsData = [
  {
    id: "swiggy",
    title: "YouTube Clone 📺",
    description: "Video streaming app built with React and YouTube API.",
    tech: ["React", "API", "Tailwind"],
    liveLink: "https://your-youtube-clone-link.com",
  },
  {
    id:"youtube",
    title: "Swiggy Clone 🍔",
    description: "Food ordering UI with real-world flow and state handling.",
    tech: ["React", "Redux", "API"],
    liveLink: "https://your-swiggy-clone-link.com",
  },
];


  return (

   <div className="min-h-screen transition-colors bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
    <NaviBar isDark={isDark} setIsDark={setIsDark}/>
    <Body heroData={heroData} skillsData={skillsData} 
    toolsData = {toolsData}projectsData = {projectsData}/>

    </div>

  );
};

export default App;