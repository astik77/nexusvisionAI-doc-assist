import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, FileText } from 'lucide-react';

export default function ChatInterface({ fileName, onSendMessage, isTyping }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: `Document **${fileName}** analyzed successfully. What would you like to know about it?`,
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = { id: Date.now(), role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await onSendMessage(userMessage.text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'ai', text: response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'ai', text: 'Sorry, I encountered an error processing your request.', isError: true },
      ]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 h-[600px] flex flex-col glass-panel overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-slate-100">Document Chat</h2>
            <p className="text-xs text-slate-400 flex items-center">
              <FileText className="w-3 h-3 mr-1" /> {fileName}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex space-x-3 max-w-[80%] ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-primary' : 'bg-accent'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : msg.isError 
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400 rounded-tl-sm'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                }`}
              >
                <div className="prose prose-invert max-w-none text-sm leading-relaxed" 
                     dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about the document..."
            disabled={isTyping}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-12 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 rounded-full bg-primary text-white hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
          >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
