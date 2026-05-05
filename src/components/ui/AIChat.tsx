"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Bot, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автоматичний скрол до нового повідомлення
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Помилка сервера");
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Помилка: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Кнопка ШІ: Чітко справа на висоті 100px над кнопкою збережених */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[100px] right-6 z-50 p-4 bg-red-600 text-white rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:scale-110 transition-all duration-300 ${isOpen ? "hidden" : "flex"}`}
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] h-[500px] max-h-[80vh] bg-[#141414] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Шапка чату */}
            <div className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-white font-bold">
                <Bot className="w-5 h-5 text-red-500" />
                AI Кіно-асистент
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Повідомлення */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <Sparkles className="w-10 h-10 mx-auto mb-3 text-red-900/50" />
                  <p className="text-sm px-4">Привіт! Я штучний інтелект. Опишіть свій настрій або побажання, і я підберу ідеальний фільм.</p>
                </div>
              )}
              
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role !== "user" && (
                    <div className="w-8 h-8 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                  
                  <div className={`px-4 py-2 max-w-[80%] rounded-2xl text-sm leading-relaxed ${
                    m.role === "user" 
                      ? "bg-red-600 text-white rounded-tr-sm" 
                      : "bg-zinc-800 text-gray-200 rounded-tl-sm"
                  }`}>
                    {m.content}
                  </div>
                  
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}

              {/* Анімація завантаження */}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="px-4 py-4 bg-zinc-800 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле вводу */}
            <form onSubmit={handleSubmit} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Порадь щось про космос..."
                className="flex-1 bg-zinc-800 text-white text-sm px-4 py-3 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500 border border-zinc-700"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}