import React, { useState, useEffect, useRef } from 'react'
import bot from "../../assets/bot.png"


const AIAssistant = () => {

    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const [inputValue, setInputValue] = useState("");

    const [chatmessages, setChatMessages] = useState([]);

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        if (isOpen) {
            setIsOpen(false);
            setChatMessages([])
        } else {
            setIsOpen(true);
            setChatMessages([
                {
                    role: "assistant",
                    content: "Hi 👋 I'm Vijay’s AI assistant. Ask me about projects, skills or services!"
                }
            ]);
        };
    };

    // const API_URL =
    //     import.meta.env.DEV
    // ? "http://localhost:5000/api/chat"
    //         : "/api/chat";

    const API_URL = "/api/chat";

    const handleSend = async () => {
        if (isLoading) return;
        if (!inputValue.trim()) return;

        const messageToSend = inputValue;

        setChatMessages((prev) => [
            ...prev,
            { role: "user", content: messageToSend },
        ]);

        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: messageToSend }),
            });

            if (!response.ok) {
                throw new Error("API error");
            }

            const data = await response.json();

            setChatMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.reply },
            ]);
        } catch (error) {
            console.log(error)
            setChatMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Something went wrong. Please try again.",
                },
            ]);
        }

        setIsLoading(false);
    };
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatmessages, isLoading]);

    return (
        <>
            <button
                onClick={handleToggle}
                className="fixed bottom-6 right-6  text-white w-14 h-14 rounded-full shadow-lg">
                <img src={bot} alt="AI Bot"
                    className=" w-20 drop-shadow-[0_20px_40px_rgba(255,140,0,0.6)]
                     animate-float pointer-events-none"
                />
            </button>
            {isOpen && (
                <div className=" fixed bottom-24 right-6 w-[350px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden
                                 border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                            Vijay's AI Assistant
                        </h2>
                    </div>

                    <div className=" flex-1 overflow-y-auto p-4 text-sm text-gray-600 dark:text-gray-300">
                        {chatmessages.map((msg, index) => (

                            <div
                                key={index}
                                className={`mb-3 max-w-[80%] ${msg.role === "user" ? "ml-auto text-right" : "mr-auto text-left"
                                    }`}
                            >
                                <div
                                    className=" inline-block px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800
                                                 text-gray-800 dark:text-white"
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="mr-auto mb-3">
                                <div className="inline-block px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 animate-pulse">
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
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask something..."
                                className="flex-1 bg-transparent outline-none text-sm dark:text-white"
                            />

                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="xt-sm font-semibold text-gray-800 dark:text-white"
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