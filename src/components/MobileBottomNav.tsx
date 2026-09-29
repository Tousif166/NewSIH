import React from 'react';
import { useApp } from '../services/store';
import { 
  LayoutDashboard, 
  Mic, 
  CheckCircle2, 
  BarChart3, 
  Menu,
  Sparkles
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    matches, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    offlineQueue 
  } = useApp();

  const pendingCount = matches.filter(m => m.status === 'PENDING_REVIEW').length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1 shadow-2xl flex items-center justify-around safe-area-pb">
      {/* 1. Dashboard */}
      <button
        onClick={() => {
          setActiveTab('DASHBOARD');
          setIsMobileMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] rounded-lg transition-colors ${
          activeTab === 'DASHBOARD' && !isMobileMenuOpen ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Overview</span>
      </button>

      {/* 2. Review Center */}
      <button
        onClick={() => {
          setActiveTab('REVIEW_CENTER');
          setIsMobileMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] rounded-lg relative transition-colors ${
          activeTab === 'REVIEW_CENTER' && !isMobileMenuOpen ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <CheckCircle2 className="w-5 h-5 mb-0.5" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-emerald-500 text-slate-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow">
              {pendingCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Review</span>
      </button>

      {/* 3. Center Elevated Voice / Field Button */}
      <button
        onClick={() => {
          setActiveTab('FIELD_INPUT');
          setIsMobileMenuOpen(false);
        }}
        className="flex flex-col items-center -mt-6 relative group focus:outline-none"
        title="Tap to report field execution event"
        aria-label="Field Voice Input"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 ring-4 ring-slate-950 active:scale-95 transition-all">
          <Mic className="w-7 h-7 stroke-[2.5]" />
          {offlineQueue.length > 0 && (
            <span className="absolute top-0 right-0 bg-rose-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-slate-950 shadow">
              {offlineQueue.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-amber-400 mt-0.5">Field Mic</span>
      </button>

      {/* 4. 4D Gantt */}
      <button
        onClick={() => {
          setActiveTab('GANTT_4D');
          setIsMobileMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] rounded-lg transition-colors ${
          activeTab === 'GANTT_4D' && !isMobileMenuOpen ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BarChart3 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">4D Gantt</span>
      </button>

      {/* 5. More Modules Drawer Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] rounded-lg transition-colors ${
          isMobileMenuOpen ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">More</span>
      </button>
    </nav>
  );
};
