// intents.js

export const suggestedQuestions = [
    "What projects have you built?",
    "What skills do you have?",
    "Do you build full stack applications?",
    "Is he capable of handling production applications?",
    "How can I contact you?"
];

export const generateReply = (message) => {
    const text = message.toLowerCase().trim();

    // Projects
    if (
        text === "what projects have you built?" ||
        text.includes("projects")
    ) {
        return `
### Projects
- **Be Your Own Coach (BYOC)** – Live paid client platform · React, Node.js, Razorpay, AWS S3
- **AI Desktop Assistant** – Agentic system automation · Python, LLM Agents, Tool-Calling, Memory
- **Resume RAG** – AI resume Q&A · React, OpenRouter, Retrieval-Augmented Generation
- **AI Learning Hub** – 27-module interactive platform · React, RAG, OpenRouter
- **YouTube Clone** – React, Redux, Tailwind CSS
- **Swiggy Clone** – API Integration, Cart, Redux
- **Netflix GPT** – Firebase Auth, GPT-based Search
- And all projects are fully responsive and optimized for mobile screens and for Desktop screen.
`;
    }

    // Skills
    if (
        text === "what skills do you have?" ||
        text.includes("skills") ||
        text.includes("tech stack")
    ) {
        return `
### Skills & Tech Stack
**Languages:** Python, JavaScript (ES6+), SQL
**Frontend:** React, Redux, Tailwind CSS, Responsive UI/UX
**Backend:** Node.js, Express, Django, MongoDB, REST APIs, Razorpay Payments
**AI / LLM:** RAG, Multimodal RAG, AI Agents, NLP, Prompt Engineering, OpenRouter API, Vector Search
**Cloud & Tools:** AWS S3, Git & GitHub, Vercel, VS Code
`;
    }

    // Responsive
    if (
        text === "responsive?" ||
        text.includes("responsive")
    ) {
        return `
Yes ✅ All projects are fully responsive and optimized for mobile-first design.
`;
    }

    // Full Stack
    if (
        text === "do you build full stack applications?" ||
        text.includes("full stack") ||
        text.includes("backend")
    ) {
        return `
Yes. Vijay builds full-stack applications using React, Node.js, Django, and MongoDB, with authentication, secure payment integration (Razorpay), and REST APIs — plus AI/LLM features like RAG pipelines and autonomous agents.
`;
    }

    // Capability
    if (
        text === "is he capable of handling production level applications?" ||
        text.includes("capable") ||
        text.includes("experience") ||
        text.includes("production")
    ) {
        return `
### Capability
Yes. Vijay has shipped a production platform for a live paying client — **Be Your Own Coach** — with Razorpay pay-to-unlock access and premium video streaming from AWS S3 after verified payment.

He has implemented:
- A live, payment-integrated production application
- RAG pipelines and autonomous AI agents
- Authentication and access control
- Advanced state management
- Fully responsive, scalable architecture

### Projects
- Be Your Own Coach (live client)
- AI Desktop Assistant
- Resume RAG
- AI Learning Hub
- YouTube Clone
- Swiggy Clone
- Netflix GPT
`;
    }

    // Contact
    if (
        text === "how can i contact you?" ||
        text.includes("contact") ||
        text.includes("hire")
    ) {
        return `
You can scroll down in portfolio and click the **"Let's Work Together"** section.

You can send an email or WhatsApp message directly.
`;
    }

    // Fallback
    return `
Sorry, I can only answer predefined portfolio-related questions.

### You can ask me about:

- Projects
- Skills
- Experience
- Services
- Contact

Please select one of the suggested questions below.
`;
};