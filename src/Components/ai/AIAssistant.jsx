import React, { useState, useEffect, useRef } from "react";
import bot from "../../assets/bot.png";
import ReactMarkdown from "react-markdown";

import { isGreeting, greetingReply, isFarewell, farewellReply } from "./greetings";
import { suggestedQuestions, generateReply } from "./intents";

const AIAssistant = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [usedQuestions, setUsedQuestions] = useState([]);

    const messagesEndRef = useRef(null);

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
            let reply;

            if (isGreeting(messageToSend)) {
                reply = greetingReply;
            }
            else if (isFarewell(messageToSend)) {
                reply = farewellReply;
            }
            else {
                reply = generateReply(messageToSend);
            }

            setChatMessages(prev => [
                ...prev,
                { role: "assistant", content: reply }
            ]);

            if (suggestedQuestions.includes(messageToSend)) {
                setUsedQuestions(prev => [...prev, messageToSend]);
            }

            setIsLoading(false);
        }, 400);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isLoading]);

    const lastMessage = chatMessages[chatMessages.length - 1];

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
                <div className="fixed bottom-24 right-6 w-[350px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden surface z-50">

                    <div className="p-4 border-b hairline">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full accent-dot inline-block" />
                            Vijay's AI Assistant
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 text-sm text-mut">

                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-3 max-w-[80%] ${msg.role === "user"
                                    ? "ml-auto text-right"
                                    : "mr-auto text-left"
                                    }`}
                            >
                                <div className="inline-block px-4 py-2 rounded-2xl surface prose prose-sm dark:prose-invert max-w-none">
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
                                            className="text-xs chip px-3 py-1 rounded-full"
                                        >
                                            {q}
                                        </button>
                                    ))}
                            </div>
                        )}

                        {isLoading && (
                            <div className="mr-auto mb-3">
                                <div className="inline-block px-4 py-2 rounded-2xl surface animate-pulse">
                                    AI is typing...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t hairline">
                        <div className="flex items-center gap-2 surface-2 rounded-xl px-3 py-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask something..."
                                className="flex-1 bg-transparent outline-none text-sm"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!inputValue.trim()}
                                className="text-sm font-semibold text-accent"
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