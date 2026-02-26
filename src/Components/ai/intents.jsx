// intents.js

export const suggestedQuestions = [
    "What projects have you built?",
    "What skills do you have?",
    "Are your projects responsive?",
    "Do you build full stack applications?",
    "Is he capable of handling production projects?",
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
- **YouTube Clone** – React, Redux, Tailwind CSS  
- **Swiggy Clone** – API Integration, Cart, Redux  
- **Netflix GPT** – Firebase Auth, GPT-based Search  
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
- React
- Redux
- Tailwind CSS
- JavaScript
- Node.js
- Firebase Authentication
- API Integration
- Responsive Web Design
`;
    }

    // Responsive
    if (
        text === "are your projects responsive?" ||
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
Yes. Vijay builds full-stack applications using Node.js, authentication systems, and REST APIs.
`;
    }

    // Capability
    if (
        text === "is he capable of handling production projects?" ||
        text.includes("capable") ||
        text.includes("experience") ||
        text.includes("production")
    ) {
        return `
### Capability
Vijay has built real-world applications using modern technologies like React, Redux, Firebase, and API integrations.

He has implemented:
- Authentication systems
- Advanced state management
- Fully responsive UI
- Scalable frontend architecture

### Projects
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