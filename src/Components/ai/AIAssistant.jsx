import React, { useState, useEffect, useRef, useCallback } from "react";
import bot from "../../assets/bot.png";
import ReactMarkdown from "react-markdown";

import { isGreeting, greetingReply, isFarewell, farewellReply } from "./greetings";
import { suggestedQuestions } from "./intents";
import { queryRAG, preloadModel } from "./ragEngine";

const AIAssistant = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [usedQuestions, setUsedQuestions] = useState([]);
    const [ragStatus, setRagStatus] = useState(null); // 'loading-model' | 'retrieving' | 'generating' | 'done'
    const [streamingText, setStreamingText] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);

    const messagesEndRef = useRef(null);
    const modelPreloaded = useRef(false);

    // Pre-warm the embedding model when chat opens
    useEffect(() => {
        if (isOpen && !modelPreloaded.current) {
            modelPreloaded.current = true;
            preloadModel();
        }
    }, [isOpen]);

    const handleToggle = () => {
        if (isOpen) {
            setIsOpen(false);
            setChatMessages([]);
            setUsedQuestions([]);
            setStreamingText("");
            setIsStreaming(false);
            setRagStatus(null);
        } else {
            setIsOpen(true);
            setChatMessages([
                {
                    role: "assistant",
                    content:
                        "Hi 👋 I'm Vijay's AI assistant powered by RAG. Ask me anything about his work, skills, or projects!"
                }
            ]);
        }
    };

    // Status message mapping
    const statusMessages = {
        'loading-model': 'Thinking...',
        'retrieving': 'Thinking...',
        'generating': 'Generating response...',
        'done': 'Presenting response...',
    };

    const handleSend = useCallback(async (customText = null) => {
        if (isLoading || isStreaming) return;

        const messageToSend = customText || inputValue;
        if (!messageToSend.trim()) return;

        // Add user message
        setChatMessages(prev => [
            ...prev,
            { role: "user", content: messageToSend }
        ]);
        setInputValue("");

        // Handle greetings & farewells locally (no API call needed)
        if (isGreeting(messageToSend)) {
            setIsLoading(true);
            setTimeout(() => {
                setChatMessages(prev => [
                    ...prev,
                    { role: "assistant", content: greetingReply }
                ]);
                setIsLoading(false);
            }, 300);
            return;
        }

        if (isFarewell(messageToSend)) {
            setIsLoading(true);
            setTimeout(() => {
                setChatMessages(prev => [
                    ...prev,
                    { role: "assistant", content: farewellReply }
                ]);
                setIsLoading(false);
            }, 300);
            return;
        }

        // --- RAG Pipeline ---
        setIsLoading(true);
        setIsStreaming(true);
        setStreamingText("");

        let accumulatedText = "";

        await queryRAG(
            messageToSend,
            // onChunk — called with each streamed text chunk
            (chunk) => {
                accumulatedText += chunk;
                setStreamingText(accumulatedText);
            },
            // onStatus — called with pipeline stage updates
            (status) => {
                setRagStatus(status);
                if (status === 'done') {
                    // Finalize: move streaming text into chat messages
                    setChatMessages(prev => [
                        ...prev,
                        { role: "assistant", content: accumulatedText || "I couldn't generate a response. Please try again." }
                    ]);
                    setStreamingText("");
                    setIsStreaming(false);
                    setIsLoading(false);
                    setRagStatus(null);
                }
            }
        );

        // Track used suggested questions
        if (suggestedQuestions.includes(messageToSend)) {
            setUsedQuestions(prev => [...prev, messageToSend]);
        }
    }, [isLoading, isStreaming, inputValue]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isLoading, streamingText]);

    const lastMessage = chatMessages[chatMessages.length - 1];
    const showSuggestions = !isStreaming && !isLoading && lastMessage?.role === "assistant";

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
                <div className="fixed inset-3 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[350px] sm:h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden surface z-50">

                    <div className="p-4 border-b hairline">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full accent-dot inline-block" />
                            Vijay's AI Assistant
                            <span className="ml-auto text-[10px] text-dim font-normal px-2 py-0.5 rounded-full surface-2">RAG</span>
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
                                <div className={`inline-block px-4 py-2 rounded-2xl surface prose prose-sm dark:prose-invert max-w-none ${
                                    msg.role === "user" ? "bg-accent text-btn" : ""
                                }`}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {/* Streaming response — word by word */}
                        {isStreaming && streamingText && (
                            <div className="mb-3 max-w-[80%] mr-auto text-left">
                                <div className="inline-block px-4 py-2 rounded-2xl surface prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown>{streamingText}</ReactMarkdown>
                                    <span className="streaming-cursor" />
                                </div>
                            </div>
                        )}

                        {/* Status indicator — minimal, no box */}
                        {isLoading && !streamingText && (
                            <div className="mr-auto mb-3 flex items-center gap-2 px-1 py-2">
                                <span className="rag-dots">
                                    <span /><span /><span />
                                </span>
                                <span className="text-xs text-dim">
                                    {statusMessages[ragStatus] || 'Thinking...'}
                                </span>
                            </div>
                        )}

                        {/* Suggested questions */}
                        {showSuggestions && (
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

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t hairline">
                        <div className="flex items-center gap-2 surface-2 rounded-xl px-3 py-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder={isStreaming ? "Generating..." : "Ask something..."}
                                disabled={isStreaming}
                                className="flex-1 bg-transparent outline-none text-sm"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!inputValue.trim() || isStreaming}
                                className="text-sm font-semibold text-accent disabled:opacity-40"
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