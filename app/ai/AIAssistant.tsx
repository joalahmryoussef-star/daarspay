import React, { useState, useRef, useEffect } from 'react';
import { Brain, User, Sparkles, Send } from 'lucide-react';

export const AIAssistant = ({ messages, onSendMessage, loading }: any) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {messages.map((m: any) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-7 rounded-[3rem] shadow-2xl border ${m.role === 'user' ? 'bg-blue-600 border-blue-500 rounded-br-none text-white' : 'bg-slate-800/80 border-slate-700 rounded-bl-none text-slate-100 backdrop-blur-md'}`}>
              <div className="flex items-center gap-2 mb-2 text-[10px] font-black opacity-40 uppercase tracking-widest">
                {m.role === 'model' ? <Brain size={16} /> : <User size={16} />}
                <span>{new Date(m.timestamp).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</span>
              </div>
              <p className="text-sm leading-loose whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-slate-800 p-6 rounded-[2.5rem] border border-slate-700 animate-pulse flex items-center gap-3">
               <Sparkles className="text-blue-400 animate-spin" size={20} />
               <span className="text-xs font-black text-slate-400">جاري التحليل...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="p-8 bg-slate-900 border-t border-slate-800 flex gap-4">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="أصدر أمراً أو اسأل عن إحصائياتك..." className="flex-1 bg-slate-800 p-6 rounded-[2.5rem] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white font-medium" />
        <button onClick={handleSend} disabled={loading} className="p-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] shadow-xl transition-all active:scale-90 disabled:opacity-50"><Send size={32} /></button>
      </div>
    </div>
  );
};