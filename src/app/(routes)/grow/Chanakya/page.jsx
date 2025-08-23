"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, User, Sparkles, BookOpen, Target, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useUser } from "@clerk/nextjs";

const api = process.env.NEXT_PUBLIC_API_URL;

const Chatbot = () => {
    const { user, isLoaded } = useUser();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!isLoaded || !user?.id) return;
        fetchUserData(user.id);
    }, [isLoaded, user?.id]);

    const fetchUserData = async (userId) => {
        try {
            if (!api) {
                console.error("API URL is undefined!");
                return;
            }

            console.log("Fetching user data for UID:", userId);
            const response = await fetch(`${api}/userData`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: userId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server Error:", errorText);
                return;
            }

            const data = await response.json();
            console.log("Full API Response:", data.message);

            if (!data.message || !Array.isArray(data.message)) {
                console.error("Unexpected API response:", data);
                return;
            }

            const financialData = data.message.filter(item => item.annual_revenue !== undefined);
            if (financialData.length === 0) return;

            const latestFinancialData = financialData[financialData.length - 1];
            setUserData(latestFinancialData);

            setMessages([
                {
                    role: "system",
                    content: `
You are an expert Business Cost Planning and Financial Advisory Assistant.
If the user just greets you, just greet them also.
The user is seeking insights based on their financial data. Respond strictly as a professional business consultant, focusing only on cost planning, budgeting, financial strategy, and optimization. Avoid general or unrelated discussions.

Here is the user's financial data:
${JSON.stringify(latestFinancialData, null, 2)}

Analyze this data and provide actionable business advice on cost management, revenue optimization, and financial efficiency. Keep responses strictly relevant to business cost planning and strategy.
If the user's text is a simple greeting, just provide a small introduction.
If it's just a greeting in the next prompt, then just greet them, nothing else.
`
                }
            ]);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { content: input, role: "user" };
        const currMessage=[...messages, userMessage]
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            if (!api) {
                console.error("API URL is undefined!");
                return;
            }

            const response = await fetch(`${api}/chatBot`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_history: currMessage }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server Error:", errorText);
                return;
            }

            const data = await response.json();

            if (!data.message) {
                console.error("Invalid chatbot response:", data);
                return;
            }

            setMessages((prev) => [...prev, { content: data.message, role: "assistant" }]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Suggested prompts for the user
    const suggestedPrompts = [
        "How can I reduce my recurring expenses?",
        "What's the best way to allocate my monthly budget?",
        "How can I increase my savings effectively?",
        "What cost optimization strategies do you recommend?"
    ];

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-primary-1500 to-primary-1400">
            {/* Header */}

 
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-primary-1500/30 to-primary-1400/20">
                <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
                    {messages.length > 1 ? (
                        <>
                            {messages.map((msg, index) =>
                                msg.role !== "system" && (
                                    <div
                                        key={index}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-start max-w-2xl gap-3`}>
                                            {/* Avatar */}
                                            <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-1 overflow-hidden ${
                                                msg.role === "assistant" 
                                                    ? "bg-gradient-to-r from-primary-500 to-brand-500" 
                                                    : "bg-primary-1200 border border-primary-1100/30"
                                            }`}>
                                                {msg.role === "assistant" ? (
                                                    <img 
                                                        src="/chanakya.jpeg" 
                                                        alt="Chanakya" 
                                                        className="w-7 h-7 object-contain rounded-full"
                                                    />
                                                ) : (
                                                    <User className="w-5 h-5 text-primary-300" />
                                                )}
                                            </div>
                                            
                                            {/* Message Bubble */}
                                            <div
                                                className={`rounded-2xl px-4 py-3 max-w-md ${
                                                    msg.role === "user"
                                                        ? "bg-gradient-to-r from-primary-500 to-brand-500 text-white ml-2"
                                                        : "bg-primary-1300/50 backdrop-blur-sm border border-primary-1100/30 text-gray-100"
                                                }`}
                                            >
                                                <div className="text-sm leading-relaxed markdown-content">
                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                            
                            {/* Loading Animation */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex items-start gap-3 max-w-2xl">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-500 to-brand-500 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                                            <img 
                                                src="/chanakya.jpeg"  
                                                alt="Chanakya" 
                                                className="w-7 h-7 object-contain"
                                            />
                                        </div>
                                        <div className="bg-primary-1300/50 backdrop-blur-sm border border-primary-1100/30 text-gray-300 rounded-2xl px-4 py-3">
                                            <div className="flex items-center text-sm">
                                                <div className="animate-pulse flex space-x-2">
                                                    <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                                                    <div className="w-2 h-2 bg-primary-400 rounded-full animation-delay-200"></div>
                                                    <div className="w-2 h-2 bg-primary-400 rounded-full animation-delay-400"></div>
                                                </div>
                                                <span className="ml-2">Analyzing your query...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Invisible element to scroll to */}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12">
                            <div className="bg-primary-1300/30 backdrop-blur-sm border border-primary-1100/30 rounded-3xl p-8 max-w-lg w-full">
                                <div className="text-center ">
                                    <div className="bg-gradient-to-r from-primary-500 to-brand-500 rounded-2xl inline-flex overflow-hidden">
                                        <img 
                                            src="/chanakya.jpeg" 
                                            alt="Chanakya" 
                                            className="w-12 h-12 object-contain"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Welcome to Chanakya AI</h2>
                                    <p className="text-primary-300">Your professional business advisory assistant for cost planning and financial strategy.</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="text-primary-200 font-medium flex items-center">
                                        <Sparkles className="w-4 h-4 mr-2 text-brand-400" />
                                        Try asking about:
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 gap-3">
                                        {suggestedPrompts.map((prompt, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setInput(prompt);
                                                    setTimeout(() => {
                                                        document.querySelector("input").focus();
                                                    }, 100);
                                                }}
                                                className="text-left p-3 bg-primary-1200/30 hover:bg-primary-1200/50 border border-primary-1100/30 rounded-xl transition-all duration-200 group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-primary-200 text-sm">{prompt}</span>
                                                    <ArrowRight className="w-4 h-4 text-primary-400 group-hover:text-brand-400 transition-colors" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex items-center text-xs text-primary-400">
                                <Target className="w-3 h-3 mr-1" />
                                <span>Powered by advanced financial AI • Professional consultation</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-primary-1100/30 bg-primary-1300/50 backdrop-blur-sm px-6 py-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                placeholder="Ask about cost optimization, budgeting, or financial strategy..."
                                className="w-full px-4 py-3 bg-primary-1200/30 border border-primary-1100/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/30 text-white placeholder-primary-400 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="p-3 bg-gradient-to-r from-primary-500 to-brand-500 text-white rounded-xl hover:from-primary-600 hover:to-brand-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Send size={18} />
                            )}
                        </button>
                    </div>
                    <div className="mt-3 text-xs text-primary-400 text-center flex items-center justify-center">
                        <BookOpen className="w-3 h-3 mr-1" />
                        <span>Professional business consultation • Powered by AI</span>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
                .markdown-content ul, .markdown-content ol {
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                    padding-left: 1.5rem;
                }
                .markdown-content li {
                    margin-bottom: 0.25rem;
                }
                .markdown-content p {
                    margin-bottom: 0.75rem;
                }
                .markdown-content p:last-child {
                    margin-bottom: 0;
                }
            `}</style>
        </div>
    );
};

export default Chatbot;