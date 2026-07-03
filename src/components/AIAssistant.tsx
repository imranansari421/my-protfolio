import React, { useState, useRef, useEffect } from "react";
import { Message, PortfolioData } from "../types";
import { Brain, Sparkles, Send, RefreshCw, Cpu, MessageSquare } from "lucide-react";

interface AIAssistantProps {
  portfolio: PortfolioData;
}

export default function AIAssistant({ portfolio }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I am Imran's AI double. I specialize in web and app development (HTML, CSS, JS, React, Node.js, and Python learning in progress) as well as advanced office systems automation (Excel & Word). Ask me anything about Imran's background, skills, or how he can build your next custom web app!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    `What are Imran's core web development skills?`,
    `What is Imran's experience with HTML, CSS, JS & React?`,
    `Explain Excel & Word automation integration.`,
    `How can I hire or collaborate with Imran?`,
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          context: `Visitor is asking about Imran's portfolio. Imran's details: ${JSON.stringify(portfolio)}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.text || "I was unable to formulate a response. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Error: Could not reach the AI server. Please verify your GEMINI_API_KEY in Settings > Secrets.\n\nDetails: ${error.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Chat session refreshed. How can I help you explore Imran's competencies in AI and office automation today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[580px] bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#1e204c] rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-[#16173d] border-b border-slate-200 dark:border-[#1e204c]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#15163c] border border-indigo-100 dark:border-[#22245c] flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-semibold text-slate-800 dark:text-white tracking-wide text-sm">Gemini Assistant Double</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-[#102b1c] text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-[#153e28]">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1 animate-ping"></span>
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-indigo-300 font-mono">Powered by gemini-3.5-flash</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="p-2 text-slate-500 dark:text-indigo-200 hover:text-slate-800 dark:hover:text-white bg-white dark:bg-[#18193d] hover:bg-slate-50 dark:hover:bg-[#202256] border border-slate-200 dark:border-[#202256] rounded-lg transition-all duration-200"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-[#0c0d23]/40">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-white dark:bg-[#16173d] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-[#22245c] rounded-tl-none"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1 text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                  <Cpu className="w-3.5 h-3.5" />
                  AI Agent
                </div>
              )}
              {msg.role === "user" && (
                <div className="flex items-center gap-1.5 mb-1 text-[10px] uppercase font-bold tracking-wider text-indigo-100 font-mono">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Visitor
                </div>
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {msg.content}
              </div>
              <div
                className={`text-[9px] mt-1.5 text-right font-mono ${
                  msg.role === "user" ? "text-indigo-200" : "text-slate-400"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#16173d] border border-slate-200 dark:border-[#22245c] rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] shadow-sm">
              <div className="flex items-center gap-1.5 mb-1 text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Thinking...
              </div>
              <div className="flex space-x-1 py-2 px-1">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDuration: "1s", animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDuration: "1s", animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDuration: "1s", animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-6 py-2.5 bg-slate-50 dark:bg-[#131432] border-t border-slate-200 dark:border-[#1e204c] flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
        {presetQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-xs bg-white dark:bg-[#11122a] hover:bg-slate-100 dark:hover:bg-[#1b1c4b] text-slate-700 dark:text-indigo-200 hover:text-indigo-600 dark:hover:text-white border border-slate-200 dark:border-[#202256] hover:border-indigo-200 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 bg-white dark:bg-[#11122a] border-t border-slate-200 dark:border-[#1e204c] flex gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about skills, code optimization, Excel hacks..."
          disabled={loading}
          className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#15163c] border border-slate-200 dark:border-[#22245c] rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-sans transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl transition-all duration-200 flex items-center justify-center font-semibold shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
