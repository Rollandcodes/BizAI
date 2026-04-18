'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader, Send, X, MessageCircle, Minimize2, Maximize2 } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function DashboardAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hi! 👋 I\'m your CypAI assistant. I can help you navigate the dashboard, explain features, and answer any questions. What would you like help with?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/dashboard-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error('Failed to get response');

      const data = await res.json() as { message?: string };
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Agent error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            'Sorry, I encountered an error. Please try again or contact support.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open dashboard assistant"
          className="fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-110 border-2 border-blue-400 animate-pulse"
        >
          <MessageCircle className="h-8 w-8" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-96 max-h-[600px] flex flex-col rounded-3xl border-2 border-blue-400 bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div className="flex-1">
              <h2 className="font-bold text-white text-lg">CypAI Assistant</h2>
              <p className="text-xs text-blue-100 font-semibold">Your helpful guide 🤖</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? 'Expand' : 'Minimize'}
                className="rounded-full p-2 hover:bg-blue-500 text-white transition"
              >
                {isMinimized ? (
                  <Maximize2 className="h-5 w-5" />
                ) : (
                  <Minimize2 className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
                className="rounded-full p-2 hover:bg-blue-500 text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-2xl px-5 py-3 text-sm font-medium ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                          : 'bg-white border-2 border-slate-200 text-slate-900 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border-2 border-slate-200 rounded-2xl rounded-bl-none px-5 py-3 flex gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-400 animate-bounce" />
                      <span className="w-3 h-3 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-3 h-3 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t-2 border-slate-200 bg-white p-4 flex gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={loading}
                  className="flex-1 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:bg-slate-100"
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="rounded-xl bg-blue-600 p-3 text-white hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
