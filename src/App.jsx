import "./index.css";
import NaviBar from "./Components/NaviBar";
import { useState, useEffect } from "react";
import tomImg from "./assets/tom.jpg";
import Body from "./Components/Body";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ContactPage from "./Components/ContactPage";

const AppLayout = ({ isDark, setIsDark }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <NaviBar isDark={isDark} setIsDark={setIsDark} />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};


function App() {

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  const [highlightProject, setHighlightProject] = useState(false);

  useEffect(() => {
    if (!highlightProject) return;

    const timer = setTimeout(() => {
      setHighlightProject(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [highlightProject])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Hero
  const heroData = {
    name: "Vijay",
    role: "Frontend Developer",
    intro: "I build clean and scalable React applications.",
    image: tomImg,
  };

  // skills 
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

  //projects
  const projectsData = [
    {
      id: "youtube",
      title: "YouTube Clone 📺",
      description: "Video streaming app built with React and YouTube API.",
      tech: ["Implemented Redux for state management",
        "Optimized API calls, reduced load time by 30%",
        "Built responsive UI using Tailwind",
        "View Code on GitHub"],
      liveLink: "https://your-youtube-clone-link.com",
    },
    {
      id: "swiggy",
      title: "Swiggy Clone 🍔",
      description: "Food ordering UI with real-world flow and state handling.",
      tech: ["Global state management for video data",
        "Improved performance through efficient API usage",
        "Created responsive layouts using Tailwind CSS"],
      liveLink: "https://vijaydurgasi.github.io/Namaste-React/#/",
    },
  ];

  //About
  const aboutData = {
    heading: "About Me",
    intro:
      "I am a frontend developer who builds modern, responsive web applications using React.",
    points: [
      "I focus on clean UI and scalable component architecture.",
      "I enjoy turning complex requirements into simple user experiences.",
      "I have built real-world projects like a YouTube clone and Swiggy clone.",
      "I stay focused and take ownership of tasks until the solution is complete.",
    ],
  };

  //service
  const servicesData = [
    {
      id: "frontend-dev",
      icon: "💻",
      title: "Frontend Development",
      description:
        "I build modern, responsive user interfaces using React with a focus on clean code and performance.",
      for: "Startups, small businesses, and individuals",
    },
    {
      id: "react-apps",
      icon: "⚛️",
      title: "React Applications",
      description:
        "I develop scalable React applications with reusable components and predictable data flow.",
      for: "Products that need dynamic and interactive UIs",
    },
    {
      id: "ui-implementation",
      icon: "🎨",
      title: "UI Implementation",
      description:
        "I convert designs into pixel-perfect, accessible, and user-friendly web interfaces.",
      for: "Designers and teams with ready UI designs",
    },
  ];

  //contact
  const contactData = {
    heading: "Check out",
    message:
      "I’m open to freelance work, collaborations, and frontend development opportunities. Feel free to reach out if you have a project in mind.",
    email: "durgasivijay2005@gmail.com",
    linkedin: "https://linkedin.com/in/vijaydurgasi",
    github: "https://github.com/vijaydurgasi",
  };

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout isDark={isDark} setIsDark={setIsDark} />,
      children: [
        {
          index: true,
          element: (
            <Body
              heroData={heroData}
              skillsData={skillsData}
              toolsData={toolsData}
              projectsData={projectsData}
              aboutData={aboutData}
              servicesData={servicesData}
              contactData={contactData}
              highlightProject={highlightProject}
              setHighlightProject={setHighlightProject}
            />
          ),
        },
        {
          path: "contact",
          element: <ContactPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={appRouter} />;
};

export default App;