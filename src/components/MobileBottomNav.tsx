import React from 'react';
import { useApp } from '../services/store';
import { 
  LayoutDashboard, 
  Mic, 
  CheckCircle2, 
  BarChart3, 
  Menu
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 backdrop-blur-lg px-2 py-1 shadow-lg flex items-center justify-around safe-area-pb">
      {/* 1. Dashboard */}
      <button
        onClick={() => {
          setActiveTab('DASHBOARD');
          setIsMobileMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] rounded-lg transition-colors ${
          activeTab === 'DASHBOARD' && !isMobileMenuOpen ? 'text-blue-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
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
          activeTab === 'REVIEW_CENTER' && !isMobileMenuOpen ? 'text-blue-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative">
          <CheckCircle2 className="w-5 h-5 mb-0.5" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-blue-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
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
        className="flex flex-col items-center -mt-6 relative group focus:outline-none cursor-pointer"
        title="Tap to report field execution event"
        aria-label="Field Voice Input"
      >
        <div className="w-14 h-14 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-md ring-4 ring-white active:scale-95 transition-all">
          <Mic className="w-7 h-7 stroke-[2.5]" />
          {offlineQueue.length > 0 && (
            <span className="absolute top-0 right-0 bg-amber-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow">
              {offlineQueue.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-blue-700 mt-0.5">Field Mic</span>
      </button>

      {/* 4. Analytics */}
      <button
        onClick={() => {
          setActiveTab('WHAT_IF');
          setIsMobileMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] rounded-lg transition-colors ${
          activeTab === 'WHAT_IF' && !isMobileMenuOpen ? 'text-blue-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <BarChart3 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">What-If</span>
      </button>

      {/* 5. More Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] rounded-lg transition-colors ${
          isMobileMenuOpen ? 'text-blue-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Menu</span>
      </button>
    </nav>
  );
};
