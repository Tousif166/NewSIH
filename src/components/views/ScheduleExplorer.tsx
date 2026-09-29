import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  FolderTree, 
  Folder, 
  FolderOpen, 
  FileCode, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  Layers, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Check,
  Search
} from 'lucide-react';
import { ActivityLevel, ScheduleActivity } from '../../types';

export const ScheduleExplorer: React.FC = () => {
  const { activities, wbsNodes, dependencies } = useApp();

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'wbs-1': true,
    'wbs-1.1': true,
    'wbs-1.1.2': true,
    'wbs-1.1.2.1': true,
    'wbs-1.1.2.1.1': true,
  });

  const [selectedActivity, setSelectedActivity] = useState<ScheduleActivity>(activities[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importReport, setImportReport] = useState<any>(null);
  const [mobileTab, setMobileTab] = useState<'TREE' | 'DETAILS'>('TREE');

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredActivities = activities.filter(a => 
    a.activityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.discipline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSimulateImport = () => {
    setImportReport({
      totalRows: 252,
      importedCount: 248,
      rejectedCount: 4,
      missingDates: 1,
      duplicateIds: 2,
      invalidDependencies: 1,
      formatDetected: 'Primavera P6 XML / CSV Export (v21.12 Schema)',
      details: [
        { code: 'ACT-ERR-001', error: 'Missing Planned Finish Date in Primavera record' },
        { code: 'PIPE-ERECT-L6-0142', error: 'Duplicate Activity Code detected in sub-project import' },
        { code: 'ACT-ERR-003', error: 'Predecessor Activity ID "ACT-UNKNOWN-99" does not exist in WBS graph' }
      ]
    });
  };

  return (
    <div className="p-3.5 sm:p-6 max-w-[1700px] mx-auto space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-sky-400 shrink-0" />
            Schedule Hierarchy Explorer (L1 to L6 Tree)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse structured WBS nodes, inspect baseline vs actuals for L5/L6 activities, or import Primavera/MS Project schedules.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code, name, discipline..."
              className="bg-slate-950 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-700 w-full focus:outline-none focus:border-sky-400"
            />
          </div>

          <button
            onClick={() => {
              setIsImportModalOpen(true);
              setImportReport(null);
            }}
            className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Import Schedule (P6/MSP)</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden grid grid-cols-2 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setMobileTab('TREE')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'TREE'
              ? 'bg-slate-800 text-white shadow font-bold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>WBS Hierarchy</span>
        </button>

        <button
          onClick={() => setMobileTab('DETAILS')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'DETAILS'
              ? 'bg-sky-600 text-white shadow font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Activity Node Details</span>
        </button>
      </div>

      {/* Main Grid: Tree Browser on Left, Activity Health Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Col: Tree */}
        <div className={`lg:col-span-6 bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-4 ${
          mobileTab === 'DETAILS' ? 'hidden lg:block' : 'block'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400 font-mono">
            <span>WBS Node Hierarchy</span>
            <span>Level L1 - L6</span>
          </div>

          <div className="space-y-1 font-mono text-xs max-h-[650px] overflow-y-auto pr-1">
            {wbsNodes.map(node => {
              const isExpanded = !!expandedNodes[node.id];
              const levelIndent = {
                L1: 'pl-0 font-bold text-white',
                L2: 'pl-2 sm:pl-4 font-semibold text-sky-300',
                L3: 'pl-3 sm:pl-8 font-medium text-slate-300',
                L4: 'pl-4 sm:pl-12 text-slate-300',
                L5: 'pl-5 sm:pl-16 text-amber-300',
                L6: 'pl-6 sm:pl-20 text-slate-400'
              }[node.level];

              return (
                <div key={node.id} className="space-y-1">
                  <div
                    onClick={() => toggleNode(node.id)}
                    className={`flex items-center justify-between p-1.5 rounded hover:bg-slate-800 cursor-pointer transition-colors ${levelIndent}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isExpanded ? (
                        <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="text-slate-400 text-[10px]">{node.code}</span>
                      <span className="truncate">{node.name}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                      {node.level}
                    </span>
                  </div>

                  {/* Render activities under L5/L4 nodes if expanded */}
                  {isExpanded && activities.filter(a => a.wbsId === node.id).map(act => {
                    const isSelected = selectedActivity?.id === act.id;
                    return (
                      <div
                        key={act.id}
                        onClick={() => {
                          setSelectedActivity(act);
                          setMobileTab('DETAILS');
                        }}
                        className={`ml-4 sm:ml-10 md:ml-16 flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                          isSelected 
                            ? 'bg-slate-800 border-sky-400 text-white font-semibold' 
                            : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-mono text-sky-400 text-[11px]">{act.activityCode}</span>
                          <span className="truncate text-xs font-sans">{act.name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {act.isCriticalPath && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                              CP
                            </span>
                          )}
                          <span className={`text-[10px] font-mono font-bold ${
                            act.actualPercent === 100 ? 'text-emerald-400' : act.forecastVarianceDays > 0 ? 'text-rose-400' : 'text-slate-300'
                          }`}>
                            {act.actualPercent}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Activity Health Card & Provenance */}
        <div className={`lg:col-span-6 space-y-4 ${mobileTab === 'TREE' ? 'hidden lg:block' : 'block'}`}>
          {selectedActivity ? (
            <div className="bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-800 space-y-4 sm:space-y-6 shadow-sm">
              {/* Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                      {selectedActivity.activityCode}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                      {selectedActivity.level} • {selectedActivity.discipline}
                    </span>
                    {selectedActivity.isCriticalPath && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold font-mono">
                        Critical Path Node
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded font-bold font-mono ${
                    selectedActivity.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    selectedActivity.status === 'DELAYED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {selectedActivity.status}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white">
                  {selectedActivity.name}
                </h2>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>📍 {selectedActivity.location}</span>
                  <span>👷 {selectedActivity.responsibleContractor}</span>
                </div>
              </div>

              {/* 4-Dimension Metric Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Baseline Planned</span>
                  <span className="text-xs font-semibold text-sky-400">{selectedActivity.plannedStart} → {selectedActivity.plannedFinish}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{selectedActivity.plannedDurationDays} Days</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Actual Execution</span>
                  <span className="text-xs font-semibold text-emerald-400">{selectedActivity.actualStart || 'Not started'} → {selectedActivity.actualFinish || 'Ongoing'}</span>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">{selectedActivity.actualPercent}% Complete</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Current Forecast</span>
                  <span className="text-xs font-semibold text-amber-400">{selectedActivity.forecastFinish}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Estimated</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Schedule Variance</span>
                  <span className={`text-xs font-bold font-mono ${selectedActivity.forecastVarianceDays > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedActivity.forecastVarianceDays > 0 ? `+${selectedActivity.forecastVarianceDays} Days (Late)` : 'On Schedule'}
                  </span>
                </div>
              </div>

              {/* Traceability & Field Evidence Provenance */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Report Traceability & Last Verified Field Evidence
                </h3>
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Source: <strong className="text-slate-200">{selectedActivity.lastSourceId || 'Primary DPR Ingestion'}</strong></span>
                    <span>Last Update: <strong className="text-slate-200">{selectedActivity.lastUpdateDate || 'Initial Baseline'}</strong></span>
                  </div>
                  {selectedActivity.lastReportSentence && (
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 text-slate-300 italic text-[11px]">
                      "{selectedActivity.lastReportSentence}"
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">AI Match Confidence:</span>
                    <span className="font-mono text-emerald-400 font-bold">{selectedActivity.matchConfidence || 95}%</span>
                  </div>
                </div>
              </div>

              {/* Historical Benchmarking (Activity DNA summary) */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                  Historical Oil India Project Benchmark
                </h3>
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Historical Median Duration:</span>
                    <span className="font-mono text-slate-100">{selectedActivity.historicalBenchmarkDays || 7.0} Days</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Historical Regional Variance:</span>
                    <span className="font-mono text-amber-400">+{selectedActivity.historicalVarianceDays || 1.2} Days</span>
                  </div>
                  {selectedActivity.commonDelayCause && (
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                      Primary historical delay cause: <span className="text-slate-300">{selectedActivity.commonDelayCause}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
              Select an activity from the WBS tree.
            </div>
          )}
        </div>
      </div>

      {/* Primavera P6 / MS Project Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full p-6 rounded-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <Upload className="w-4 h-4 text-sky-400" />
                Schedule Import Engine (Primavera P6 / MS Project / CSV)
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Upload enterprise baseline schedules. The system normalizes all activities into L1-L6 WBS hierarchy and performs strict validation checks (duplicate IDs, invalid dependencies, missing planned dates).
            </p>

            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-950/60 space-y-2">
              <FileSpreadsheet className="w-8 h-8 text-sky-400 mx-auto" />
              <div className="text-xs font-semibold text-slate-200">
                Drag & Drop Primavera P6 XML / XER / CSV or MS Project (.mpp / XML)
              </div>
              <p className="text-[11px] text-slate-500">File size up to 50MB (15,000+ activities supported)</p>
              <button
                type="button"
                onClick={handleSimulateImport}
                className="mt-2 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs"
              >
                Run Validation on Sample P6 Schedule
              </button>
            </div>

            {/* Validation Report */}
            {importReport && (
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white font-mono flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Import Validation Report
                  </span>
                  <span className="font-mono text-sky-400 text-[11px]">{importReport.formatDetected}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                  <div className="bg-slate-900 p-2 rounded">
                    <span className="text-slate-400 block">IMPORTED</span>
                    <span className="text-emerald-400 font-bold">{importReport.importedCount}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded">
                    <span className="text-slate-400 block">REJECTED</span>
                    <span className="text-rose-400 font-bold">{importReport.rejectedCount}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded">
                    <span className="text-slate-400 block">TOTAL SCANNED</span>
                    <span className="text-white font-bold">{importReport.totalRows}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <span className="text-slate-400 font-mono block">Validation Warnings & Rejections:</span>
                  {importReport.details.map((d: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-1.5 bg-rose-950/30 border border-rose-800/40 rounded text-rose-300">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>{d.code}</strong>: {d.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
