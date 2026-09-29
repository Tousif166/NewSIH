import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  CornerDownRight, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { queryProjectCopilot } from '../../services/aiEngine';

interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  relatedActivityCodes?: string[];
  actionButton?: { label: string; action: string };
}

export const CopilotDrawer: React.FC = () => {
  const { 
    isCopilotOpen, 
    setIsCopilotOpen, 
    activities, 
    conflicts, 
    riskScore, 
    terminologyMappings,
    setActiveTab 
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Hello, I am the **SiteSync AI Project Copilot**. I am connected directly to the North-East Process Facility Expansion project database.\n\nAsk me about schedule delays, conflicting field reports, contractor performance, or what changed since yesterday.',
      timestamp: 'Just now'
    }
  ]);

  const handleSend = (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now().toString(36)}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const copilotResult = queryProjectCopilot(q, activities, conflicts, riskScore, terminologyMappings);

    const botMsg: CopilotMessage = {
      id: `bot-${Date.now().toString(36)}`,
      sender: 'assistant',
      text: copilotResult.answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relatedActivityCodes: copilotResult.relatedActivityCodes,
      actionButton: copilotResult.actionButton
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInputQuery('');
  };

  const handleActionButton = (action: string) => {
    if (action === 'VIEW_CRITICAL_PATH') {
      setActiveTab('GANTT_4D');
    } else if (action === 'VIEW_CONFLICTS') {
      setActiveTab('CONFLICT_CENTER');
    }
  };

  if (!isCopilotOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-sans">
              AI Project Copilot
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-bold uppercase font-mono">
                Live Data
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">Ground Truth Project Intelligence</p>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-2.5 sm:p-3 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex gap-2 shrink-0">
        <button
          onClick={() => handleSend('Which activities are delayed?')}
          className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 whitespace-nowrap transition-colors"
        >
          🔍 Which activities are delayed?
        </button>
        <button
          onClick={() => handleSend('Show conflicting progress reports')}
          className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 whitespace-nowrap transition-colors"
        >
          ⚠️ Show conflicts
        </button>
        <button
          onClick={() => handleSend('What changed since yesterday?')}
          className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 whitespace-nowrap transition-colors"
        >
          📅 What changed yesterday?
        </button>
        <button
          onClick={() => handleSend('Which contractor has the largest schedule variance?')}
          className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 whitespace-nowrap transition-colors"
        >
          👷 Contractor variance
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3.5 space-y-2 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium ml-8'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {/* Related Activity Links */}
              {m.relatedActivityCodes && m.relatedActivityCodes.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-500 font-mono">Linked Nodes:</span>
                  {m.relatedActivityCodes.map((code) => (
                    <span
                      key={code}
                      onClick={() => setActiveTab('GANTT_4D')}
                      className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 cursor-pointer"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Button */}
              {m.actionButton && (
                <div className="pt-1">
                  <button
                    onClick={() => handleActionButton(m.actionButton!.action)}
                    className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <span>{m.actionButton.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="text-[9px] text-slate-500 text-right font-mono">{m.timestamp}</div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 safe-area-pb">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about Oil India project status..."
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
