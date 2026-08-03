// Resume data structured as semantic chunks for RAG retrieval
// Each chunk represents a coherent section of Vijay's resume
// Chunk size: ~200-400 tokens each for precise retrieval

const resumeChunks = [
  {
    id: "personal-overview",
    section: "Overview",
    keywords: ["vijay", "durgasi", "developer", "engineer", "full-stack", "AI", "LLM", "introduction", "about", "who"],
    content: `Vijay Durgasi is a Full-Stack Developer and AI/LLM Engineer who turns complex requirements into intelligent, user-centric products. He builds production-grade, end-to-end applications with React, Node.js, and Python — shipping LLM-powered systems like RAG pipelines, autonomous AI agents, and a live, payment-integrated client platform that pairs clean UX with real automation. He is open to full-stack and AI/LLM engineering roles, freelance work, and collaborations.`
  },
  {
    id: "frontend-skills",
    section: "Skills",
    keywords: ["frontend", "react", "javascript", "html", "css", "tailwind", "redux", "responsive", "UI", "UX", "skills", "tech stack"],
    content: `Frontend Skills: React.js, JavaScript (ES6+), HTML5 & CSS3, Tailwind CSS, Responsive UI/UX design, State Management with Redux Toolkit. Vijay builds fully responsive interfaces optimized for both mobile and desktop screens. All his projects are designed with mobile-first principles and feature clean, modern user interfaces.`
  },
  {
    id: "backend-skills",
    section: "Skills",
    keywords: ["backend", "node", "express", "django", "mongodb", "sql", "api", "rest", "razorpay", "authentication", "jwt", "firebase", "server", "database"],
    content: `Backend Skills: Python, Node.js, Express.js, Django, MongoDB, SQL, REST API Development, Razorpay Payment Integration, Authentication (JWT / Firebase). Vijay develops secure and efficient backend systems, REST APIs, and authentication flows. He has production experience integrating payment gateways like Razorpay with verified payment-to-access workflows.`
  },
  {
    id: "ai-llm-skills",
    section: "Skills",
    keywords: ["AI", "LLM", "RAG", "agents", "NLP", "prompt", "engineering", "vector", "search", "multimodal", "openrouter", "machine learning", "artificial intelligence"],
    content: `AI & LLM Skills: RAG (Retrieval-Augmented Generation), Multimodal RAG, AI Agents, NLP (Natural Language Processing), Prompt Engineering, OpenRouter API, Vector Search. Vijay designs RAG pipelines, autonomous AI agents, and LLM-powered features that add real automation to products. He has built intelligent systems with tool-calling workflows, memory layers, and context-aware recall.`
  },
  {
    id: "tools-devops",
    section: "Skills",
    keywords: ["tools", "AWS", "S3", "git", "github", "vercel", "netlify", "postman", "vscode", "devops", "deployment", "cloud"],
    content: `Tools & DevOps: AWS S3, Git & GitHub, VS Code, Postman, Vercel, Netlify. Vijay uses cloud services like AWS S3 for media storage and streaming, deploys applications through Vercel and Netlify, and manages version control with Git and GitHub.`
  },
  {
    id: "project-byoc",
    section: "Projects",
    keywords: ["BYOC", "be your own coach", "fitness", "coaching", "razorpay", "payment", "AWS", "S3", "production", "client", "live", "paid", "streaming", "video"],
    content: `Project: Be Your Own Coach (BYOC) 🏋️ (2025–2026, Live Client)
A production fitness-coaching platform built and shipped for a live paying client. Integrated the Razorpay payment gateway with secure pay-to-unlock access — premium videos stream from AWS S3 only after verified payment — and built access control that protects client revenue and proprietary course material. Tech stack: React, Node.js, Razorpay, AWS S3. This is Vijay's flagship production project, demonstrating his ability to deliver real-world, revenue-generating applications. Live at: beyourowncoach.in`
  },
  {
    id: "project-ai-desktop",
    section: "Projects",
    keywords: ["AI desktop", "assistant", "agentic", "automation", "files", "folders", "news", "calendar", "tool-calling", "memory", "python", "agent"],
    content: `Project: AI Desktop Assistant 🤖 (2026)
An agentic desktop AI that controls the local machine through natural language — creating and reading files/folders, summarizing documents, fetching news, launching localhost projects, opening sites, running web searches, and scheduling calendar events. Engineered a persistent memory layer for context-aware recall and an intent-to-action tool-calling workflow that maps requests to safe system operations. Tech stack: Python, LLM Agents, Tool-Calling, Memory Layer.`
  },
  {
    id: "project-resume-rag",
    section: "Projects",
    keywords: ["resume", "RAG", "Q&A", "recruiter", "retrieval", "openrouter", "chat", "portfolio"],
    content: `Project: Resume RAG — AI Resume Q&A 🧠 (2026)
A RAG application that lets recruiters ask natural-language questions about Vijay's resume and receive instant, source-grounded answers. Built a retrieval pipeline over resume content with LLM responses via OpenRouter to prevent off-context and hallucinated replies, served through a responsive React chat interface. Tech stack: React, OpenRouter API, Retrieval-Augmented Generation.`
  },
  {
    id: "project-ai-learning-hub",
    section: "Projects",
    keywords: ["AI learning hub", "modules", "education", "interactive", "branches", "platform", "learning"],
    content: `Project: AI Learning Hub 🌌 (2026–Present, In Progress)
An animated, explore-as-you-learn platform of 27 modules spanning AI, RAG, AI Agents, and Multimodal RAG, organized into 6 core branches. Designing a branch-wise RAG architecture — 6 dedicated knowledge bases — so users can chat with and query each topic through integrated LLMs. Tech stack: React, RAG, OpenRouter API, Animated UI/UX.`
  },
  {
    id: "project-youtube-clone",
    section: "Projects",
    keywords: ["youtube", "clone", "video", "streaming", "redux", "tailwind"],
    content: `Project: YouTube Clone 📺
A video streaming app built with React and YouTube API. Implemented Redux for state management, optimized API calls reducing load time by 30%, and built responsive UI using Tailwind. Live at: namaste-youtube-psi.vercel.app. Tech stack: React, Redux, Tailwind CSS, YouTube API.`
  },
  {
    id: "project-swiggy-clone",
    section: "Projects",
    keywords: ["swiggy", "clone", "food", "ordering", "cart", "api"],
    content: `Project: Swiggy Clone 🍔
A food ordering UI with real-world flow and state handling. Features global state management for data, improved performance through efficient API usage, and responsive layouts using Tailwind CSS. Live at: namaste-react-wheat-xi.vercel.app. Tech stack: React, Redux, Tailwind CSS, REST API.`
  },
  {
    id: "project-netflix-gpt",
    section: "Projects",
    keywords: ["netflix", "GPT", "firebase", "authentication", "movies", "TMDB", "search"],
    content: `Project: Netflix GPT 🔴
A Netflix-inspired app with AI-based movie suggestions and secure authentication. Features Firebase authentication with protected routes, Redux Toolkit for global state management, TMDB API integration for dynamic movie data, and responsive UI. Live at: netflixgpt2026.vercel.app. Tech stack: React, Firebase Auth, Redux Toolkit, TMDB API, Tailwind CSS.`
  },
  {
    id: "services",
    section: "Services",
    keywords: ["services", "hire", "offer", "freelance", "work", "startup", "business", "what can you do", "capabilities"],
    content: `Services Offered:
1. Full-Stack Development — Complete web applications with React on the front end and Node.js, Django, and MongoDB on the back end, including secure payment integrations. Best for startups and businesses that need a complete, production-ready product.
2. AI & LLM Engineering — RAG pipelines, autonomous AI agents, and LLM-powered features that add real automation to products. Best for teams looking to add intelligent, AI-driven capabilities.
3. Backend & APIs — Secure and efficient backend systems, REST APIs, and authentication using Node.js, Express, Django, and MongoDB. Best for applications requiring scalable backend systems.
4. API Integration — Third-party APIs integration for payments, LLMs, and data services to connect frontend with backend systems seamlessly. Best for apps needing external services or dynamic data.`
  },
  {
    id: "contact",
    section: "Contact",
    keywords: ["contact", "email", "linkedin", "github", "reach", "hire", "work together", "collaborate", "whatsapp"],
    content: `Contact Information:
Email: durgasivijay2005@gmail.com
LinkedIn: linkedin.com/in/vijaydurgasi
GitHub: github.com/vijaydurgasi
Vijay is open to full-stack and AI/LLM engineering roles, freelance work, and collaborations. If you have an idea or project in mind, he'd love to build something impactful together. You can reach out via the "Let's Work Together" section on the portfolio site or send an email or WhatsApp message directly.`
  },
  {
    id: "production-capability",
    section: "Experience",
    keywords: ["production", "capable", "experience", "professional", "real-world", "live", "client", "revenue"],
    content: `Production Capability & Experience:
Vijay has shipped a production platform for a live paying client — Be Your Own Coach — with Razorpay pay-to-unlock access and premium video streaming from AWS S3 after verified payment. He has implemented: a live payment-integrated production application, RAG pipelines and autonomous AI agents, authentication and access control systems, advanced state management patterns, and fully responsive scalable architecture. His projects demonstrate end-to-end ownership from design to deployment to maintenance.`
  }
];

export default resumeChunks;
