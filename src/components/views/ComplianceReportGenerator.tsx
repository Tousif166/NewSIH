import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  SAMPLE_COMPLIANCE_REPORTS, 
  ComplianceReport, 
  compileRawLogToComplianceReport 
} from '../../services/complianceEngine';

export const ComplianceReportGenerator: React.FC = () => {
  const { showToast, currentUser } = useApp();
  const [reports, setReports] = useState<ComplianceReport[]>(SAMPLE_COMPLIANCE_REPORTS);
  const [selectedReportId, setSelectedReportId] = useState<string>(SAMPLE_COMPLIANCE_REPORTS[0].id);
  const [rawInputText, setRawInputText] = useState<string>(
    'Today completed 840m trenching near Margherita sector. Subcontractor deployed 2 CAT excavators. Heavy monsoon rain halted stringing for 2.5 hours. Ultrasonic inspection passed 14 joints, 1 holiday repair sleeve applied on pipe #DJ-142.'
  );
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  const handleSynthesizeReport = () => {
    if (!rawInputText.trim()) {
      showToast('Please enter field notes or speak to generate report.', 'warning');
      return;
    }

    setIsCompiling(true);
    setTimeout(() => {
      const newReport = compileRawLogToComplianceReport(rawInputText, currentUser?.name || 'Er. SiteSync Lead');
      setReports(prev => [newReport, ...prev]);
      setSelectedReportId(newReport.id);
      setIsCompiling(false);
      showToast('Official CVC & MoP&NG Daily Progress Report synthesized with SHA-256 blockchain proof!', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-yellow-950 to-slate-900 border border-yellow-800/40 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 font-mono text-[10px] font-bold border border-yellow-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                CENTRAL VIGILANCE COMMISSION (CVC) OM 005/VGL/4
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                MoP&NG STATUTORY IPMD FORMAT
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              AI Statutory Compliance Report Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Converts rough field voice dictation into legally fortified Daily Progress Reports (DPR). Cross-examines contractor claims against Primavera P6 baselines, categorizes Force Majeure delays, and stamps immutable cryptographic audit hashes.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              Print / Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Synthesizer & Official Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 1 Col: Raw Input Ingestion & Recent Dossiers */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-yellow-600">record_voice_over</span>
              <h3 className="font-bold text-sm text-slate-900">Field Voice / Text Raw Notes</h3>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Dictate or type raw operational logs. AI will format into CVC-compliant government prose.
            </p>

            <textarea
              rows={5}
              value={rawInputText}
              onChange={(e) => setRawInputText(e.target.value)}
              placeholder="Enter site notes here..."
              className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 focus:ring-2 focus:ring-yellow-500 focus:outline-hidden"
            />

            <button
              disabled={isCompiling}
              onClick={handleSynthesizeReport}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isCompiling ? 'autorenew' : 'auto_fix_high'}
              </span>
              {isCompiling ? 'SYNTHESIZING MoP&NG DOSSIER...' : 'SYNTHESIZE STATUTORY REPORT'}
            </button>
          </div>

          {/* Dossier Archive List */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Generated Reports Archive:</h4>
            <div className="space-y-2">
              {reports.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedReportId(r.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    selectedReportId === r.id 
                      ? 'bg-yellow-50/80 border-yellow-400 text-yellow-950 font-bold shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span>{r.id}</span>
                    <span className="text-[10px] text-slate-500">{r.reportDate}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 line-clamp-1">{r.executiveSummary}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Official Document Letterhead Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-900 space-y-6">
            {/* Government Letterhead Header */}
            <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
              <div className="text-[11px] font-mono font-bold tracking-widest text-slate-600 uppercase">
                GOVERNMENT OF INDIA • MINISTRY OF PETROLEUM & NATURAL GAS
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 tracking-tight">
                OIL INDIA LIMITED (PIPELINE HEADQUARTERS, DULIAJAN)
              </h2>
              <div className="text-xs font-mono text-slate-600">
                Project Monitoring Division (IPMD) • Reference: {activeReport.mopngRefNumber}
              </div>
            </div>

            {/* Document Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs border-b border-slate-200 pb-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Report ID</span>
                <span className="font-bold">{activeReport.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Date of Record</span>
                <span className="font-bold">{activeReport.reportDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Officer in Charge</span>
                <span className="font-bold truncate block">{activeReport.preparedBy}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">CVC Guideline</span>
                <span className="font-bold text-amber-700">005/VGL/4</span>
              </div>
            </div>

            {/* Executive Summary Section */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
                1. Executive Progress & Operations Summary:
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                {activeReport.executiveSummary}
              </p>
            </div>

            {/* WBS Physical Progress Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
                2. WBS Milestone Progress & CVC Quantity Verification:
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden font-mono text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">WBS Code</th>
                      <th className="p-2.5">Activity Description</th>
                      <th className="p-2.5">Planned</th>
                      <th className="p-2.5">Actual</th>
                      <th className="p-2.5">CVC Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeReport.wbsActivities.map((wbs, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-indigo-700">{wbs.wbsCode}</td>
                        <td className="p-2.5">{wbs.description}</td>
                        <td className="p-2.5">{wbs.plannedQty}</td>
                        <td className="p-2.5 font-bold">{wbs.actualQty}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            wbs.cvcAuditStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {wbs.cvcAuditStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delay Causation & Force Majeure Analysis */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
                3. Delay Causation & Liquidated Damages (LD) Admissibility:
              </h4>
              <div className="space-y-1.5 font-mono text-xs">
                {activeReport.delayCausationAnalysis.map((delay, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-amber-950">{delay.delayType} ({delay.hoursLost} Hours Lost)</div>
                      <div className="text-[10px] text-amber-800 mt-0.5">{delay.contractualClause}</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                      {delay.liquidatedDamagesApplies ? 'LD APPLIES' : 'FORCE MAJEURE (NO LD)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockchain SHA-256 Tamper Proof Footer */}
            <div className="pt-4 border-t-2 border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] font-mono text-slate-500">
              <div>
                <span className="font-bold text-slate-800 block">SHA-256 CRYPTOGRAPHIC INTEGRITY PROOF:</span>
                <span className="text-[9px] break-all">{activeReport.blockchainProof.sha256Hash}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-emerald-700">IMMUTABLE BLOCK #{activeReport.blockchainProof.ledgerBlockIndex}</span>
                <span className="block text-slate-400">STAMPED AT {activeReport.blockchainProof.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
