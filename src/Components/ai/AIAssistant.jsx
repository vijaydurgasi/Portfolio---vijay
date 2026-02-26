import React, { useState, useEffect, useRef } from "react";
import bot from "../../assets/bot.png";
import ReactMarkdown from "react-markdown";

const AIAssistant = () => {

    /* =========================
       RECOMMENDED QUESTIONS
    ========================== */
    const recommendedQuestions = [
        {
            question: "What projects have you built?",
            answer: `
### Projects
- 1.**"YouTube Clone"** (React, Redux, Tailwind)
- 2.**"Swiggy Clone"** (API, Cart, Redux)
- 3.**"Netflix GPT"** (Firebase Auth, GPT Search)
`
        },
        {
            question: "What skills do you have?",
            answer: `
### **"Skills"**
- React
- Redux
- Tailwind CSS
- JavaScript
- Node.js
- Firebase Authentication
- API Integration
`
        },
        {
            question: "How can I contact you?",
            answer: `
In the portfolio scroll down and click the **"Let's Work Together"** button.

You can send an email or WhatsApp message directly.
`
        },
        {
            question: "Is he capable of handling real projects?",
            answer: `
Yes. Vijay has built real-world applications using modern technologies like React, Redux, Firebase, and API integrations.

His projects demonstrate authentication systems, state management, responsive UI, and scalable frontend architecture.
`
        }
    ];

    /* =========================
       STATE
    ========================== */
    const [isOpen, setIsOpen] = useState(false);
    const [chatmessages, setChatMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [usedQuestions, setUsedQuestions] = useState([]);

    const messagesEndRef = useRef(null);

    const API_URL = "/api/chat";

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
                        "Hi 👋 I'm Vijay’s AI assistant. Ask me about projects, skills or services!"
                }
            ]);
        }
    };

    /* =========================
       SEND MESSAGE
    ========================== */
    const handleSend = async (customText = null) => {
        if (isLoading) return;

        const messageToSend = customText || inputValue;
        if (!messageToSend.trim()) return;

        setChatMessages((prev) => [
            ...prev,
            { role: "user", content: messageToSend }
        ]);

        setInputValue("");
        setIsLoading(true);

        /* ========= Exact Match Check ========= */
        const matched = recommendedQuestions.find(
            (q) => q.question === messageToSend
        );

        if (matched) {
            setChatMessages((prev) => [
                ...prev,
                { role: "assistant", content: matched.answer }
            ]);

            setUsedQuestions((prev) => [...prev, matched.question]);
            setIsLoading(false);
            return;
        }

        /* ========= Gemini Call ========= */
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: messageToSend })
            });

            if (!response.ok) throw new Error("API error");

            const data = await response.json();

            setChatMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.reply }
            ]);
        } catch (error) {
            console.log("Frontend error:", error);

            setChatMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "⚠️ Something went wrong. Please try again."
                }
            ]);
        }

        setIsLoading(false);
    };

    /* =========================
       AUTO SCROLL
    ========================== */
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatmessages, isLoading]);

    /* =========================
       OPTIONAL SMART DISPLAY LOGIC
       Show suggestions only if last message is assistant
    ========================== */
    const lastMessage = chatmessages[chatmessages.length - 1];
    const remainingQuestions = recommendedQuestions.filter(
        (q) => !usedQuestions.includes(q.question)
    );
    const shouldShowSuggestions =
        lastMessage?.role === "assistant" && remainingQuestions.length > 0;

    /* =========================
       UI
    ========================== */
    return (
        <>
            {/* Floating Bot Button */}
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

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[350px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 z-50">

                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                            Vijay's AI Assistant
                        </h2>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-600 dark:text-gray-300">

                        {chatmessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-3 max-w-[80%] ${msg.role === "user"
                                    ? "ml-auto text-right"
                                    : "mr-auto text-left"
                                    }`}
                            >
                                <div className="inline-block px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {/* Suggested Questions (Optional Logic Applied) */}
                        {shouldShowSuggestions && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {remainingQuestions.map((q, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSend(q.question)}
                                        className="text-xs bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                                    >
                                        {q.question}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Loading */}
                        {isLoading && (
                            <div className="mr-auto mb-3">
                                <div className="inline-block px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 animate-pulse">
                                    AI is typing...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSend();
                                }}
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