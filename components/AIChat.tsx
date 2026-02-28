
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, MessageCircle, RotateCcw } from 'lucide-react';
import { SheetRow, ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';

interface AIChatProps {
  data: SheetRow[];
}

const AIChat: React.FC<AIChatProps> = ({ data }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your SheetEngine Assistant. I have analyzed your spreadsheet data. Ask me anything about trends, specific rows, or request a summary!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await geminiService.chatWithData(userMessage, data || [], history);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm not sure how to answer that." }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'model', text: "Chat history cleared. How can I help you with your data now?" }]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col animate-in zoom-in-95 duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Gemini Intelligence</h3>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                ACTIVE ANALYST
              </p>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all"
            title="Clear History"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-white border border-slate-200 text-slate-600' : 'bg-indigo-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tr-none' 
                  : 'bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-tl-none'
              }`}>
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Bot size={16} />
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl rounded-tl-none border border-indigo-100">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Ask me to 'summarize revenue' or 'show all Active items'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full pl-12 pr-12 py-4 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
            />
            <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={20} />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-md shadow-indigo-100"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">
            Gemini Flash Intelligence • {(data || []).length} records in context
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
