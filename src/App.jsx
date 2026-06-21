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
    <div className="min-h-screen app-bg transition-colors">
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
    role: "Full-Stack Developer | AI & LLM Engineer",
    intro:
      "I build production-grade, end-to-end applications with React, Node.js, and Python — shipping LLM-powered systems like RAG pipelines, autonomous AI agents, and a live, payment-integrated client platform that pair clean UX with real automation.",
    image: tomImg,
  };

  // frontend skills
  const skillsData = [
    "⚛️ React.js",
    "🟨 JavaScript (ES6+)",
    "🌐 HTML5 & CSS3",
    "🎨 Tailwind CSS",
    "📱 Responsive UI/UX",
    "🔄 State Management (Redux Toolkit)",
  ];

  // backend skills
  const backendData = [
    "🐍 Python",
    "🟢 Node.js",
    "🚂 Express.js",
    "🌐 Django",
    "🍃 MongoDB",
    "🗄️ SQL",
    "🔗 REST API Development",
    "💳 Razorpay Payments",
    "🔐 Authentication (JWT / Firebase)",
  ];

  // AI / LLM skills
  const aiData = [
    "🧠 RAG",
    "🖼️ Multimodal RAG",
    "🤖 AI Agents",
    "💬 NLP",
    "✍️ Prompt Engineering",
    "🤝 OpenRouter API",
    "🔎 Vector Search",
  ];

  //tools
  const toolsData = [
    "☁️ AWS S3",
    "🔧 Git & GitHub",
    "🛠️ VS Code",
    "📦 Postman",
    "▲ Vercel / Netlify",
  ];

  //projects
  const projectsData = [
    {
      id: "byoc",
      title: "Be Your Own Coach (BYOC) 🏋️",
      description:
        "Production fitness-coaching platform built and shipped for a live paying client. Integrated the Razorpay payment gateway with secure pay-to-unlock access — premium videos stream from AWS S3 only after verified payment — and built access control that protects client revenue and proprietary course material.",
      tech: ["React", "Node.js", "Razorpay", "AWS S3"],
      status: "Live Client",
      year: "2025 – 2026",
      liveLink: "https://beyourowncoach.in",
    },
    {
      id: "ai-desktop-assistant",
      title: "AI Desktop Assistant 🤖",
      description:
        "Agentic desktop AI that controls the local machine through natural language — creating and reading files/folders, summarizing documents, fetching news, launching localhost projects, opening sites, running web searches, and scheduling calendar events. Engineered a persistent memory layer for context-aware recall and an intent-to-action tool-calling workflow that maps requests to safe system operations.",
      tech: ["Python", "LLM Agents", "Tool-Calling", "Memory Layer"],
      year: "2026",
      liveLink: "https://github.com/vijaydurgasi",
    },
    {
      id: "resume-rag",
      title: "Resume RAG — AI Resume Q&A 🧠",
      description:
        "RAG application that lets recruiters ask natural-language questions about my resume and receive instant, source-grounded answers. Built a retrieval pipeline over resume content with LLM responses via OpenRouter to prevent off-context and hallucinated replies, served through a responsive React chat interface.",
      tech: ["React", "OpenRouter API", "Retrieval-Augmented Generation"],
      year: "2026",
      liveLink: "https://github.com/vijaydurgasi",
    },
    {
      id: "ai-learning-hub",
      title: "AI Learning Hub 🌌",
      description:
        "Animated, explore-as-you-learn platform of 27 modules spanning AI, RAG, AI Agents, and Multimodal RAG, organized into 6 core branches. Designing a branch-wise RAG architecture — 6 dedicated knowledge bases — so users can chat with and query each topic through integrated LLMs.",
      tech: ["React", "RAG", "OpenRouter API", "Animated UI/UX"],
      status: "In Progress",
      year: "2026 – Present",
      liveLink: "https://github.com/vijaydurgasi",
    },
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
      "I'm a Full-Stack Developer and AI/LLM Engineer who turns complex requirements into intelligent, user-centric products.",
    points: [
      "I build production-grade, end-to-end applications with React, Node.js, and Python.",
      "I ship LLM-powered systems — RAG pipelines, autonomous AI agents, and multimodal retrieval.",
      "I delivered a live, payment-integrated coaching platform serving real paying users in production.",
      "I have built real-world projects like a paid coaching platform, an AI desktop agent, YouTube, Swiggy, and Netflix GPT clones.",
      "I pair clean UI/UX with real automation, and I take ownership of tasks until the solution is complete.",
    ],
  };

  //service
  const servicesData = [
    {
      id: "fullstack-dev",
      icon: "🚀",
      title: "Full-Stack Development",
      description:
        "I build complete web applications with React on the front end and Node.js, Django, and MongoDB on the back end, including secure payment integrations.",
      for: "Startups and businesses that need a complete, production-ready product",
    },
    {
      id: "ai-llm",
      icon: "🤖",
      title: "AI & LLM Engineering",
      description:
        "I design RAG pipelines, autonomous AI agents, and LLM-powered features that add real automation to your product.",
      for: "Teams looking to add intelligent, AI-driven capabilities",
    },
    {
      id: "backend-dev",
      icon: "🛠️",
      title: "Backend & APIs",
      description:
        "I develop secure and efficient backend systems, REST APIs, and authentication using Node.js, Express, Django, and MongoDB.",
      for: "Applications requiring scalable backend systems",
    },
    {
      id: "api-integration",
      icon: "🔗",
      title: "API Integration",
      description:
        "I integrate third-party APIs — payments, LLMs, and data services — to connect frontend with backend systems seamlessly.",
      for: "Apps needing external services or dynamic data",
    },
  ];

  //contact
  const contactData = {
    heading: "Check out",
    message:
      "I’m open to full-stack and AI/LLM engineering roles, freelance work, and collaborations. If you have an idea or project in mind, let’s build something impactful together.",
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
              aiData={aiData}
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