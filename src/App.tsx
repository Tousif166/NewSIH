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
import { LoginPage } from './components/views/LoginPage';
import { CopilotDrawer } from './components/views/CopilotDrawer';
import { StatutoryAuditDossierModal } from './components/views/StatutoryAuditDossierModal';
import { DroneProgressAuditorModal } from './components/views/DroneProgressAuditorModal';
import { WhatsAppGatewayModal } from './components/views/WhatsAppGatewayModal';
import { BrahmaputraFloodPredictorModal } from './components/views/BrahmaputraFloodPredictorModal';
import { P6XerExportModal } from './components/views/P6XerExportModal';
import { Pipeline3DCorridor } from './components/views/Pipeline3DCorridor';
import { BlockchainAuditLedger } from './components/views/BlockchainAuditLedger';
import { DelayCascadeSimulator } from './components/views/DelayCascadeSimulator';
import { VoiceFieldCommander } from './components/views/VoiceFieldCommander';
import { IoTPredictiveMaintenance } from './components/views/IoTPredictiveMaintenance';
import { ARInspectionView } from './components/views/ARInspectionView';
import { DroneFleetView } from './components/views/DroneFleetView';
import { SafetyTrainingHub } from './components/views/SafetyTrainingHub';
import { CorridorGeofenceGIS } from './components/views/CorridorGeofenceGIS';
import { ComplianceReportGenerator } from './components/views/ComplianceReportGenerator';
import { FlowEnergySimulator } from './components/views/FlowEnergySimulator';

const MainLayout: React.FC = () => {
  const { activeTab, toastMessage, isAuthenticated, openVoiceCommander } = useApp();

  // Global hotkey: Pressing 'v' outside inputs or Ctrl+Space opens Voice Commander
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'v' || e.key === 'V') && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        openVoiceCommander();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openVoiceCommander]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-600/15 selection:text-blue-900">
        <LoginPage />
        {toastMessage && (
          <div className="fixed top-14 sm:top-16 right-4 sm:right-6 z-50 bg-white border border-blue-600/40 text-slate-800 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs animate-bounce max-w-[90vw]">
            <span className="material-symbols-outlined text-[18px] text-blue-600">notifications</span>
            <span className="font-semibold line-clamp-2">{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

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
      case 'PIPELINE_3D':
        return <Pipeline3DCorridor />;
      case 'BLOCKCHAIN_LEDGER':
        return <BlockchainAuditLedger />;
      case 'DELAY_CASCADE':
        return <DelayCascadeSimulator />;
      case 'IOT_TELEMETRY':
        return <IoTPredictiveMaintenance />;
      case 'AR_INSPECTION':
        return <ARInspectionView />;
      case 'DRONE_FLEET':
        return <DroneFleetView />;
      case 'SAFETY_TRAINING':
        return <SafetyTrainingHub />;
      case 'GEOFENCE_GIS':
        return <CorridorGeofenceGIS />;
      case 'COMPLIANCE_REPORT':
        return <ComplianceReportGenerator />;
      case 'FLOW_ENERGY':
        return <FlowEnergySimulator />;
      default:
        return <ProjectDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans selection:bg-blue-600/15 selection:text-blue-900">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Wrapper (Left offset for 72-unit sidebar on desktop) */}
      <div className="flex-1 flex flex-col min-h-screen pl-0 md:pl-72 w-full min-w-0 overflow-x-hidden">
        {/* Fixed Top Bar */}
        <Header />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-4 sm:right-6 z-50 bg-white border border-blue-600/50 text-slate-900 px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 text-xs font-mono animate-bounce max-w-[90vw]">
            <span className="material-symbols-outlined text-[18px] text-blue-600">info</span>
            <span className="font-semibold line-clamp-2">{toastMessage}</span>
          </div>
        )}

        {/* Dynamic View Canvas */}
        <main className="flex-1 pt-16 pb-24 md:pb-12 w-full overflow-y-auto min-w-0">
          <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5 min-w-0">
            {renderActiveView()}
          </div>

          {/* Institutional Compliance Footer */}
          <footer className="mt-8 px-4 sm:px-6 py-4 border-t border-slate-200/80 bg-white/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
              <span className="truncate max-w-[320px] sm:max-w-none">OIL INDIA LIMITED // PIPELINE AUTOMATION COHORT • SIH26122</span>
            </div>
            <div className="flex items-center gap-3">
              <span>ORACLE EPPM P6.24 CERTIFIED</span>
              <span>•</span>
              <strong className="text-slate-700">SYNTHETIC OILFIELD TEST DATASET</strong>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <MobileBottomNav />

      <CopilotDrawer />
      <StatutoryAuditDossierModal />
      <DroneProgressAuditorModal />
      <WhatsAppGatewayModal />
      <BrahmaputraFloodPredictorModal />
      <P6XerExportModal />
      <VoiceFieldCommander />
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
