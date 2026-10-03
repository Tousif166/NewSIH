import React from 'react';
import { useApp, NavigationTab } from '../services/store';
import { 
  LayoutDashboard, 
  Mic, 
  CheckCircle2, 
  BarChart3, 
  Menu,
  ShieldAlert,
  GitBranch,
  View,
  FileCheck2,
  Lock,
  Box,
  Brain
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    matches, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    offlineQueue,
    currentRole,
    openVoiceCommander
  } = useApp();

  const pendingCount = matches.filter(m => m.status === 'PENDING_REVIEW').length;

  // Role-specific bottom navigation tabs (Items 1, 2, 4, with 3 being the elevated center mic)
  interface BottomTabConfig {
    tab: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
  }

  const getRoleTabs = (): { left1: BottomTabConfig; left2: BottomTabConfig; right1: BottomTabConfig } => {
    switch (currentRole) {
      case 'supervisor':
        return {
          left1: {
            tab: 'FIELD_INPUT',
            label: 'Field Log',
            icon: <LayoutDashboard className="w-5 h-5 mb-0.5" />
          },
          left2: {
            tab: 'AR_INSPECTION',
            label: 'AR Site',
            icon: <Box className="w-5 h-5 mb-0.5" />
          },
          right1: {
            tab: 'SAFETY_TRAINING',
            label: 'Safety',
            icon: <ShieldAlert className="w-5 h-5 mb-0.5" />
          }
        };
      case 'planner':
        return {
          left1: {
            tab: 'REVIEW_CENTER',
            label: 'Review',
            icon: <CheckCircle2 className="w-5 h-5 mb-0.5" />,
            badge: pendingCount > 0 ? pendingCount : undefined
          },
          left2: {
            tab: 'GANTT_4D',
            label: '4D Gantt',
            icon: <GitBranch className="w-5 h-5 mb-0.5" />
          },
          right1: {
            tab: 'DELAY_CASCADE',
            label: 'Cascade',
            icon: <BarChart3 className="w-5 h-5 mb-0.5" />
          }
        };
      case 'admin':
        return {
          left1: {
            tab: 'BLOCKCHAIN_LEDGER',
            label: 'Ledger',
            icon: <Lock className="w-5 h-5 mb-0.5" />
          },
          left2: {
            tab: 'COMPLIANCE_REPORT',
            label: 'CVC AI',
            icon: <FileCheck2 className="w-5 h-5 mb-0.5" />
          },
          right1: {
            tab: 'AUDIT_TRAIL',
            label: 'Audit',
            icon: <CheckCircle2 className="w-5 h-5 mb-0.5" />
          }
        };
      case 'project_manager':
      default:
        return {
          left1: {
            tab: 'DASHBOARD',
            label: 'Overview',
            icon: <LayoutDashboard className="w-5 h-5 mb-0.5" />
          },
          left2: {
            tab: 'PIPELINE_3D',
            label: '3D Twin',
            icon: <View className="w-5 h-5 mb-0.5" />
          },
          right1: {
            tab: 'WHAT_IF',
            label: 'What-If',
            icon: <Brain className="w-5 h-5 mb-0.5" />
          }
        };
    }
  };

  const roleTabs = getRoleTabs();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#070b14]/95 border-t border-slate-200 dark:border-amber-500/20 backdrop-blur-lg px-2 py-1 shadow-lg flex items-center justify-around safe-area-pb">
      {/* 1. Left Primary Tab */}
      <button
        onClick={() => {
          setActiveTab(roleTabs.left1.tab);
          setIsMobileMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] rounded-lg transition-colors cursor-pointer ${
          activeTab === roleTabs.left1.tab && !isMobileMenuOpen 
            ? 'text-blue-700 dark:text-amber-400 font-semibold' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <div className="relative">
          {roleTabs.left1.icon}
          {roleTabs.left1.badge && (
            <span className="absolute -top-1 -right-2 bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {roleTabs.left1.badge}
            </span>
          )}
        </div>
        <span className="text-[10px] truncate max-w-[56px]">{roleTabs.left1.label}</span>
      </button>

      {/* 2. Left Secondary Tab */}
      <button
        onClick={() => {
          setActiveTab(roleTabs.left2.tab);
          setIsMobileMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] rounded-lg transition-colors cursor-pointer ${
          activeTab === roleTabs.left2.tab && !isMobileMenuOpen 
            ? 'text-blue-700 dark:text-amber-400 font-semibold' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        {roleTabs.left2.icon}
        <span className="text-[10px] truncate max-w-[56px]">{roleTabs.left2.label}</span>
      </button>

      {/* 3. Center Elevated Hands-Free Voice Button */}
      <button
        onClick={() => {
          openVoiceCommander();
          setIsMobileMenuOpen(false);
        }}
        className="flex flex-col items-center -mt-6 relative group focus:outline-none cursor-pointer"
        title="Tap to trigger Hands-Free Voice Commander"
        aria-label="Field Voice Input"
      >
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-blue-700 dark:bg-gradient-to-r dark:from-amber-500 dark:to-amber-600 text-white dark:text-slate-950 flex items-center justify-center shadow-md dark:shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-4 ring-white dark:ring-[#070b14] active:scale-95 transition-all">
          <Mic className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          {offlineQueue.length > 0 && (
            <span className="absolute top-0 right-0 bg-amber-500 text-white dark:text-slate-950 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white dark:border-[#070b14] shadow">
              {offlineQueue.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-blue-700 dark:text-amber-400 mt-0.5">Voice [V]</span>
      </button>

      {/* 4. Right Secondary Tab */}
      <button
        onClick={() => {
          setActiveTab(roleTabs.right1.tab);
          setIsMobileMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] rounded-lg transition-colors cursor-pointer ${
          activeTab === roleTabs.right1.tab && !isMobileMenuOpen 
            ? 'text-blue-700 dark:text-amber-400 font-semibold' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        {roleTabs.right1.icon}
        <span className="text-[10px] truncate max-w-[56px]">{roleTabs.right1.label}</span>
      </button>

      {/* 5. More Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] rounded-lg transition-colors cursor-pointer ${
          isMobileMenuOpen 
            ? 'text-blue-700 dark:text-amber-400 font-semibold' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label="Toggle Full Navigation Drawer"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Menu</span>
      </button>
    </nav>
  );
};
