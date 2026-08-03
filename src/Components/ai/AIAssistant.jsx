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
    const [viewportStyle, setViewportStyle] = useState({});

    const messagesEndRef = useRef(null);
    const modelPreloaded = useRef(false);

    // Pre-warm the embedding model when chat opens
    useEffect(() => {
        if (isOpen && !modelPreloaded.current) {
            modelPreloaded.current = true;
            preloadModel();
        }
    }, [isOpen]);

    const closeChat = useCallback(() => {
        setIsOpen(false);
        setChatMessages([]);
        setUsedQuestions([]);
        setStreamingText("");
        setIsStreaming(false);
        setRagStatus(null);
    }, []);

    const handleToggle = () => {
        if (isOpen) {
            closeChat();
            if (window.history.state && window.history.state.chatOpen) {
                window.history.back();
            }
        } else {
            setIsOpen(true);
            setChatMessages([
                {
                    role: "assistant",
                    content:
                        "Hi 👋 I'm Vijay's AI assistant powered by RAG. Ask me anything about his work, skills, or projects!"
                }
            ]);
            window.history.pushState({ chatOpen: true }, "");
        }
    };

    useEffect(() => {
        const handlePopState = (event) => {
            if (isOpen && (!event.state || !event.state.chatOpen)) {
                closeChat();
            }
        };

        const handleOpenRag = () => {
            if (!isOpen) {
                setIsOpen(true);
                setChatMessages([
                    {
                        role: "assistant",
                        content:
                            "Hi 👋 I'm Vijay's AI assistant powered by RAG. Ask me anything about his work, skills, or projects!"
                    }
                ]);
                window.history.pushState({ chatOpen: true }, "");
            }
        };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener('open-rag', handleOpenRag);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('open-rag', handleOpenRag);
        };
    }, [isOpen, closeChat]);

    // Handle Mobile Virtual Keyboard Panning & Resizing
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateViewport = () => {
            if (window.innerWidth < 640) { // Mobile breakpoint
                if (window.visualViewport) {
                    setViewportStyle({
                        height: `${window.visualViewport.height}px`,
                        top: `${window.visualViewport.offsetTop}px`,
                        left: `${window.visualViewport.offsetLeft}px`,
                        width: '100%',
                        position: 'fixed'
                    });
                } else {
                    setViewportStyle({ height: '100dvh', top: 0, left: 0, width: '100%', position: 'fixed' });
                }
            } else {
                setViewportStyle({}); // Desktop uses Tailwind classes
            }
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", updateViewport);
            window.visualViewport.addEventListener("scroll", updateViewport);
        }
        window.addEventListener("resize", updateViewport);
        
        // Initial setup
        updateViewport();

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", updateViewport);
                window.visualViewport.removeEventListener("scroll", updateViewport);
            }
            window.removeEventListener("resize", updateViewport);
        };
    }, [isOpen]);

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
                <div 
                    className="fixed inset-0 w-full h-[100dvh] z-50 flex flex-col surface rounded-none border-none sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[350px] sm:h-[500px] sm:max-h-[80vh] sm:rounded-2xl sm:border sm:border-zinc-800 sm:shadow-2xl overflow-hidden"
                    style={viewportStyle}
                >

                    <div className="p-3 border-b hairline flex items-center shrink-0">
                        <button onClick={handleToggle} className="mr-3 text-mut hover:text-text transition-colors" aria-label="Close chat">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <h2 className="text-sm font-semibold flex items-center gap-2 flex-1">
                            <span className="w-2 h-2 rounded-full accent-dot inline-block" />
                            Vijay's AI Assistant
                            <span className="ml-auto text-[10px] text-dim font-normal px-2 py-0.5 rounded-full surface-2">RAG</span>
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain p-3 text-sm text-mut space-y-3">
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-[85%] ${msg.role === "user"
                                    ? "ml-auto text-right"
                                    : "mr-auto text-left"
                                    }`}
                            >
                                <div className={`inline-block px-3.5 py-2 rounded-2xl surface prose prose-sm dark:prose-invert max-w-none ${
                                    msg.role === "user" ? "bg-accent text-btn" : ""
                                }`}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {/* Streaming response — word by word */}
                        {isStreaming && streamingText && (
                            <div className="max-w-[85%] mr-auto text-left">
                                <div className="inline-block px-3.5 py-2 rounded-2xl surface prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown>{streamingText}</ReactMarkdown>
                                    <span className="streaming-cursor" />
                                </div>
                            </div>
                        )}

                        {/* Status indicator — minimal, no box */}
                        {isLoading && !streamingText && (
                            <div className="mr-auto flex items-center gap-2 px-1 py-1">
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
                            <div className="pt-1 flex flex-wrap gap-2">
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

                    <div className="p-3 border-t hairline shrink-0">
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