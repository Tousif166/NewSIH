import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../services/store';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Search, 
  AlertTriangle, 
  Calendar, 
  Users,
  Mic,
  MicOff,
  Volume2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { executeNaturalLanguageQuery, StructuredQueryResult } from '../../services/copilotQueryEngine';
import { speakSpokenFeedback } from '../../services/voiceCommandEngine';

interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  queryResult?: StructuredQueryResult;
}

export const CopilotDrawer: React.FC = () => {
  const { 
    isCopilotOpen, 
    setIsCopilotOpen, 
    activities, 
    conflicts, 
    riskScore, 
    terminologyMappings,
    setActiveTab,
    showToast,
    openFloodPredictor
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Namaste! I am **Ask SiteSync**, your Natural Language P6 Query Copilot connected directly to the 132km Digboi–Duliajan Crude Oil Trunkline schedule repository.\n\nAsk me anything in **English or Hindi / Hinglish** regarding critical path bottlenecks, delayed activities, contractor variance, CVC audit compliance, or weather impacts.',
      timestamp: 'Just now'
    }
  ]);

  // Speech Recognition setup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN';

      rec.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setInputQuery(spoken);
        handleSend(spoken);
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
    }
  }, [activities]);

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          showToast('Listening... Speak your P6 schedule query', 'info');
        } catch (e) {
          setIsListening(false);
        }
      } else {
        showToast('Speech recognition not available in this browser', 'info');
      }
    }
  };

  const handleSend = (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now().toString(36)}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const structuredResult = executeNaturalLanguageQuery(
      q, 
      activities, 
      conflicts, 
      riskScore, 
      terminologyMappings
    );

    const botMsg: CopilotMessage = {
      id: `bot-${Date.now().toString(36)}`,
      sender: 'assistant',
      text: structuredResult.answerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      queryResult: structuredResult
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInputQuery('');
  };

  const handleActionClick = (recommendation: StructuredQueryResult['actionRecommendation']) => {
    if (!recommendation) return;

    if (recommendation.actionType === 'MODAL_FLOOD') {
      openFloodPredictor();
    } else {
      setActiveTab(recommendation.targetTab as any);
      showToast(`Navigated to ${recommendation.label}`, 'info');
    }
    setIsCopilotOpen(false);
  };

  if (!isCopilotOpen) return null;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 animate-in fade-in duration-150 cursor-pointer"
        onClick={() => setIsCopilotOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] max-w-full bg-white dark:bg-[#070b14] border-l border-slate-300 dark:border-amber-500/20 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 safe-area-pb">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-amber-500/20 bg-slate-50 dark:bg-[#0c1220] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 dark:bg-amber-500 text-white dark:text-slate-950 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5 font-sans">
                Ask SiteSync: Natural Language P6 Copilot
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-bold uppercase font-mono border border-emerald-300 dark:border-emerald-700/50">
                  EN + HINDI
                </span>
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Direct Neural Query Interface into Oracle EPPM P6.24
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCopilotOpen(false)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-amber-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close Copilot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      {/* Suggested Quick Prompt Chips (Bilingual) */}
      <div className="p-2.5 bg-slate-50/80 border-b border-slate-200 overflow-x-auto no-scrollbar flex gap-2 shrink-0">
        <button
          onClick={() => handleSend('Which activities are delayed?')}
          className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-900 whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs cursor-pointer font-mono"
        >
          <Search className="w-3 h-3 text-blue-600" />
          <span>Delayed activities?</span>
        </button>
        <button
          onClick={() => handleSend('Kaunsa activity critical path pe hai?')}
          className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 border border-slate-200 text-slate-700 hover:text-amber-900 whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs cursor-pointer font-mono"
        >
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>🇮🇳 Critical path (Hindi)</span>
        </button>
        <button
          onClick={() => handleSend('Which contractor has the largest schedule variance?')}
          className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-purple-50 border border-slate-200 text-slate-700 hover:text-purple-900 whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs cursor-pointer font-mono"
        >
          <Users className="w-3 h-3 text-purple-600" />
          <span>Contractor variance</span>
        </button>
        <button
          onClick={() => handleSend('Is the project compliant with CVC circular 02/01/2022?')}
          className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-900 whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs cursor-pointer font-mono"
        >
          <Calendar className="w-3 h-3 text-emerald-600" />
          <span>CVC audit check</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-[#f8fafc]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[88%] rounded-xl p-3.5 space-y-3 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-700 text-white font-medium ml-8 shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-800 shadow-2xs'
              }`}
            >
              {/* Message Text */}
              <div className="whitespace-pre-line text-xs font-sans">
                {m.text}
              </div>

              {/* Hindi Summary pill if available */}
              {m.queryResult?.hindiSummary && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 font-sans text-[11px] flex items-start justify-between gap-2">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold shrink-0">🇮🇳 हिन्दी:</span>
                    <span>{m.queryResult.hindiSummary}</span>
                  </div>
                  <button
                    onClick={() => speakSpokenFeedback(m.queryResult!.hindiSummary!, 'hi-IN')}
                    className="text-amber-800 hover:text-amber-950 p-1 rounded hover:bg-amber-100 shrink-0 cursor-pointer"
                    title="Speak in Hindi"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Structured KPIs Cards */}
              {m.queryResult?.kpis && m.queryResult.kpis.length > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {m.queryResult.kpis.map((kpi, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-center flex flex-col gap-0.5 ${kpi.color}`}
                    >
                      <span className="text-[9px] uppercase font-mono font-bold opacity-80">{kpi.label}</span>
                      <strong className="text-xs font-mono font-bold">{kpi.value}</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Matched Activities Table Preview */}
              {m.queryResult?.matchedActivities && m.queryResult.matchedActivities.length > 0 && (
                <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-200">
                  <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">
                    P6 Schedule Items Identified ({m.queryResult.matchedActivities.length}):
                  </span>
                  <div className="space-y-1.5">
                    {m.queryResult.matchedActivities.map((act) => {
                      const planned = act.plannedProgress ?? 0;
                      const actual = act.actualProgress ?? 0;
                      const variance = planned - actual;

                      return (
                        <div
                          key={act.id}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 font-mono text-[10px]"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-900 truncate">{act.activityCode}</span>
                            <span className="text-slate-600 truncate font-sans text-[11px]">{act.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-slate-600">Act: {actual}%</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${
                              variance > 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {variance > 0 ? `-${variance}%` : `+${Math.abs(variance)}%`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic Action Recommendation Button */}
              {m.queryResult?.actionRecommendation && (
                <div className="pt-2">
                  <button
                    onClick={() => handleActionClick(m.queryResult!.actionRecommendation)}
                    className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 font-mono text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{m.queryResult.actionRecommendation.label}</span>
                    <ChevronRight className="w-4 h-4 text-blue-700" />
                  </button>
                </div>
              )}

              <div className="text-[10px] text-slate-400 font-mono text-right">
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 shrink-0 mt-0.5 shadow-2xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-200 dark:border-amber-500/20 bg-white dark:bg-[#0c1220]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything in English or Hindi (e.g. 'Kaunsa activity delayed hai?')..."
              className="w-full pl-3 pr-9 py-2 rounded-lg border border-slate-300 dark:border-amber-500/30 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-amber-500 bg-slate-50 dark:bg-[#060a12]"
            />
            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors cursor-pointer ${
                isListening ? 'text-rose-600 animate-pulse' : 'text-slate-400 hover:text-slate-700 dark:hover:text-amber-400'
              }`}
              title="Voice Query Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2 bg-blue-700 dark:bg-amber-500 hover:bg-blue-800 dark:hover:bg-amber-400 disabled:opacity-40 text-white dark:text-slate-950 rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <span className="text-[10px] text-slate-400 dark:text-slate-400 font-mono mt-1 block text-center">
          Powered by SiteSync Neural P6 Semantic Matcher v4.8
        </span>
      </div>
    </div>
    </>
  );
};
