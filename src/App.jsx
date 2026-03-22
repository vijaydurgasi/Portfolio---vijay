import "./index.css";
import NaviBar from "./Components/NaviBar";
import { useState, useEffect } from "react";
import tomImg from "./assets/tom.jpg";
import Body from "./Components/Body";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ContactPage from "./Components/ContactPage";
import AIAssistant from "./Components/ai/AIAssistant";

const AppLayout = ({ isDark, setIsDark }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <NaviBar isDark={isDark} setIsDark={setIsDark} />
      <main className="pt-16">
        <Outlet />
        <AIAssistant />
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
    role: "Full Stack Developer",
    intro: "I build scalable full stack web applications using the MERN stack.",
    image: tomImg,
  };

  // frontend skills 
  const skillsData = [
    "⚛️ React.js",
    "🟨 JavaScript (ES6+)",
    "🌐 HTML5 & CSS3",
    "🧩 Component Architecture",
    "🔄 State Management (Redux Toolkit)",
    "🧠 Problem Solving",
  ];

  // backend skills
  const backendData = [
    "🟢 Node.js",
    "🚂 Express.js",
    "🍃 MongoDB",
    "🔗 REST API Development",
    "🔐 Authentication (JWT / Firebase)",
  ];

  //tools
  const toolsData = [
    "🎨 Tailwind CSS",
    "🔧 Git & GitHub",
    "🛠️ VS Code",
    "📦 Postman",
    "☁️ Vercel / Netlify",
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
        "View Code on GitHub"
      ],
      liveLink: "https://namaste-youtube-psi.vercel.app",
    },
    {
      id: "swiggy",
      title: "Swiggy Clone 🍔",
      description: "Food ordering UI with real-world flow and state handling.",
      tech: ["Global state management for video data",
        "Improved performance through efficient API usage",
        "Created responsive layouts using Tailwind CSS"
      ],
      liveLink: "https://namaste-react-wheat-xi.vercel.app",
    },
    {
      id: "netflix",
      title: "Netflix GPT 🔴",
      description: "Netflix-inspired app with AI-based movie suggestions and secure authentication.",
      tech: [
        "Firebase authentication with protected routes",
        "Redux Toolkit for global state management",
        "TMDB API integration for dynamic movie data",
        "Responsive UI built with React and Tailwind CSS"
      ],
      liveLink: "https://netflixgpt2026.vercel.app",
    },
  ];

  //About
  const aboutData = {
    heading: "About Me",
    intro:
      "I am a Full Stack Developer specializing in the MERN stack, building scalable and high-performance web applications from frontend to backend.",
    points: [
      "I design and develop responsive user interfaces using React and Tailwind CSS.",
      "I build secure and scalable backend systems using Node.js, Express, and MongoDB.",
      "I have developed real-world projects like YouTube Clone, Swiggy Clone, and Netflix GPT.",
      "I focus on clean code, performance optimization, and maintainable architecture.",
      "I take ownership of problems and deliver complete end-to-end solutions.",
    ],
  };

  //service
  const servicesData = [
    {
      id: "fullstack-dev",
      icon: "🚀",
      title: "Full Stack Development",
      description:
        "I build complete web applications using the MERN stack, handling both frontend and backend with clean architecture and scalable solutions.",
      for: "Startups, businesses, and personal projects",
    },
    {
      id: "frontend-dev",
      icon: "💻",
      title: "Frontend Development",
      description:
        "I create modern, responsive, and high-performance user interfaces using React and Tailwind CSS with a focus on user experience.",
      for: "Products that need clean and engaging UI",
    },
    {
      id: "backend-dev",
      icon: "🛠️",
      title: "Backend Development",
      description:
        "I develop secure and efficient backend systems, REST APIs, and authentication using Node.js, Express, and MongoDB.",
      for: "Applications requiring scalable backend systems",
    },
    {
      id: "api-integration",
      icon: "🔗",
      title: "API Integration",
      description:
        "I integrate third-party APIs and build custom APIs to connect frontend with backend systems seamlessly.",
      for: "Apps needing external services or dynamic data",
    },
  ];

  //contact
  const contactData = {
    heading: "Check out",
    message:
      "I’m open to freelance work, collaborations, and full stack development opportunities. If you have an idea or project in mind, let’s build something impactful together.",
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
              backendData={backendData}
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