import React, { useState, useEffect, useRef } from "react";
import bot from "../../assets/bot.png";
import ReactMarkdown from "react-markdown";

const AIAssistant = () => {

    /* =========================
       SUGGESTED QUESTIONS
    ========================== */
    const suggestedQuestions = [
        "What projects have you built?",
        "What skills do you have?",
        "Are your projects responsive?",
        "Do you build full stack applications?",
        "Is he capable of handling production projects?",
        "How can I contact you?"
    ];

    /* =========================
       STATE
    ========================== */
    const [isOpen, setIsOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [usedQuestions, setUsedQuestions] = useState([]);

    const messagesEndRef = useRef(null);

    /* =========================
       GREETING CHECK
    ========================== */
    const isGreeting = (text) => {
        const greetings = ["hi", "hello", "hey", "good morning", "good evening"];
        return greetings.some(g => text === g || text.startsWith(g));
    };

    /* =========================
       INTENT MATCHING
    ========================== */
    const generateReply = (message) => {
        const text = message.toLowerCase().trim();

        // Greeting
        if (isGreeting(text)) {
            return `
Hello 👋  
I'm Vijay’s AI Assistant.

You can ask me about:
- Projects
- Skills
- Experience
- Services
- Contact
`;
        }

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

        // Full stack
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
You can scroll down and click the **"Let's Work Together"** section.

You can send an email or WhatsApp message directly.
`;
        }

        // Default fallback
        return `
I'm here to help 😊

You can ask me about:
- Projects
- Skills
- Experience
- Services
- Contact
`;
    };

    /* =========================
       TOGGLE BOT
    ========================== */
    const handleToggle = () => {
        if (isOpen) {
            setIsOpen(false);
            setChatMessages([]);
            setUsedQuestions([]);
        } else {
            setIsOpen(true);
            setChatMessages([
                {
                    role: "assistant",
                    content:
                        "Hi 👋 I'm Vijay’s AI assistant. Ask me anything about my work!"
                }
            ]);
        }
    };

    /* =========================
       SEND MESSAGE
    ========================== */
    const handleSend = (customText = null) => {
        if (isLoading) return;

        const messageToSend = customText || inputValue;
        if (!messageToSend.trim()) return;

        setChatMessages(prev => [
            ...prev,
            { role: "user", content: messageToSend }
        ]);

        setInputValue("");
        setIsLoading(true);

        setTimeout(() => {
            const reply = generateReply(messageToSend);

            setChatMessages(prev => [
                ...prev,
                { role: "assistant", content: reply }
            ]);

            if (suggestedQuestions.includes(messageToSend)) {
                setUsedQuestions(prev => [...prev, messageToSend]);
            }

            setIsLoading(false);
        }, 500);
    };

    /* =========================
       AUTO SCROLL
    ========================== */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isLoading]);

    const lastMessage = chatMessages[chatMessages.length - 1];

    /* =========================
       UI
    ========================== */
    return (
        <>
            <button
                onClick={handleToggle}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50"
            >
                <img
                    src={bot}
                    alt="AI Bot"
                    className="w-16 drop-shadow-[0_20px_40px_rgba(255,140,0,0.6)] animate-float"
                />
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[350px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 z-50">

                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                            Vijay's AI Assistant
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-600 dark:text-gray-300">

                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-3 max-w-[80%] ${msg.role === "user"
                                    ? "ml-auto text-right"
                                    : "mr-auto text-left"
                                    }`}
                            >
                                <div className="inline-block px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {lastMessage?.role === "assistant" && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {suggestedQuestions
                                    .filter(q => !usedQuestions.includes(q))
                                    .map((q, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSend(q)}
                                            className="text-xs bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                                        >
                                            {q}
                                        </button>
                                    ))}
                            </div>
                        )}

                        {isLoading && (
                            <div className="mr-auto mb-3">
                                <div className="inline-block px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse">
                                    AI is typing...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask something..."
                                className="flex-1 bg-transparent outline-none text-sm dark:text-white"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!inputValue.trim()}
                                className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
};

export default AIAssistant;