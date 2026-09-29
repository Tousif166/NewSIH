import React from 'react';
import { AppProvider, useApp } from './services/store';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ProjectDashboard } from './components/views/ProjectDashboard';
import { FieldInputCenter } from './components/views/FieldInputCenter';
import { ReviewCenter } from './components/views/ReviewCenter';
import { ScheduleExplorer } from './components/views/ScheduleExplorer';
import { GanttDigitalTwin } from './components/views/GanttDigitalTwin';
import { ConflictCenter } from './components/views/ConflictCenter';
import { ActivityDNAView } from './components/views/ActivityDNAView';
import { WhatIfSimulator } from './components/views/WhatIfSimulator';
import { AuditTrailView } from './components/views/AuditTrailView';
import { JudgeDemoWalkthrough } from './components/views/JudgeDemoWalkthrough';
import { CopilotDrawer } from './components/views/CopilotDrawer';
import { Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <ProjectDashboard />;
      case 'FIELD_INPUT':
        return <FieldInputCenter />;
      case 'REVIEW_CENTER':
        return <ReviewCenter />;
      case 'SCHEDULE_EXPLORER':
        return <ScheduleExplorer />;
      case 'GANTT_4D':
        return <GanttDigitalTwin />;
      case 'CONFLICT_CENTER':
        return <ConflictCenter />;
      case 'ACTIVITY_DNA':
        return <ActivityDNAView />;
      case 'WHAT_IF':
        return <WhatIfSimulator />;
      case 'AUDIT_TRAIL':
        return <AuditTrailView />;
      case 'DEMO_WALKTHROUGH':
        return <JudgeDemoWalkthrough />;
      default:
        return <ProjectDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 sm:top-16 right-4 sm:right-6 z-50 bg-slate-900 border border-amber-500/60 text-slate-100 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs animate-bounce max-w-[90vw]">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium line-clamp-2">{toastMessage}</span>
        </div>
      )}

      {/* Layout Body: Sidebar + Main Canvas */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-950 pb-20 md:pb-6">
          {renderActiveView()}
          
          {/* Footer Notice */}
          <footer className="p-4 border-t border-slate-900 bg-slate-950 text-center text-[11px] text-slate-500 font-mono">
            <span>SIH26122 • Smart Automation • Oil India Limited Prototype • </span>
            <strong className="text-slate-400">DEMO / SYNTHETIC DATA ONLY</strong>
          </footer>
        </main>
      </div>

      <MobileBottomNav />
      <CopilotDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
