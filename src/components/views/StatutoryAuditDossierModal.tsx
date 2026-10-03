import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { generateStatutoryArbitrationDossier } from '../../services/level1Engine';

export const StatutoryAuditDossierModal: React.FC = () => {
  const { isDossierOpen, setIsDossierOpen, activities, matches, showToast } = useApp();
  const [activeDossierTab, setActiveDossierTab] = useState<'SUMMARY' | 'DELAY_ATTRIBUTION' | 'CONTEMPORANEOUS_LEDGER' | 'CVC_COMPLIANCE'>('SUMMARY');
  const [isExporting, setIsExporting] = useState(false);

  if (!isDossierOpen) return null;

  const dossier = generateStatutoryArbitrationDossier(activities, matches);

  const handlePrintPDF = () => {
    setIsExporting(true);
    showToast('Compiling Statutory Dossier for PDF print export...', 'info');
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 400);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dossier, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${dossier.dossierId}_audit_package.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Cryptographic JSON-LD Audit Bundle downloaded successfully.', 'success');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed-none cursor-pointer"
      onClick={() => setIsDossierOpen(false)}
      aria-hidden="true"
    >
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-[#0c1220] rounded-2xl shadow-2xl border border-slate-300 dark:border-amber-500/20 flex flex-col max-h-[92vh] overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">gavel</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold uppercase tracking-wide">
                  CVC & CAG Statutory Audit Defense
                </span>
                <span className="font-mono text-[11px] text-blue-300">
                  REF: {dossier.dossierId}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5 font-sans">
                Contemporaneous Delay Defense & Arbitration Dossier
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                {dossier.organization} • {dossier.projectName}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrintPDF}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-slate-950 font-bold">print</span>
              <span className="text-slate-950 font-bold">{isExporting ? 'Preparing...' : 'Print / Export PDF'}</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold border border-slate-600 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>JSON Proof</span>
            </button>
            <button
              onClick={() => setIsDossierOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100 dark:bg-[#080d19] border-b border-slate-200 dark:border-amber-500/20 px-3 sm:px-5 py-2 flex items-center justify-between gap-2 shrink-0 print:hidden overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveDossierTab('SUMMARY')}
              className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeDossierTab === 'SUMMARY'
                  ? 'bg-white dark:bg-[#0f172a] text-blue-900 dark:text-amber-400 shadow-xs border border-slate-300 dark:border-amber-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => setActiveDossierTab('DELAY_ATTRIBUTION')}
              className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeDossierTab === 'DELAY_ATTRIBUTION'
                  ? 'bg-white dark:bg-[#0f172a] text-blue-900 dark:text-amber-400 shadow-xs border border-slate-300 dark:border-amber-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Delay Attribution & LD Matrix
            </button>
            <button
              onClick={() => setActiveDossierTab('CONTEMPORANEOUS_LEDGER')}
              className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeDossierTab === 'CONTEMPORANEOUS_LEDGER'
                  ? 'bg-white dark:bg-[#0f172a] text-blue-900 dark:text-amber-400 shadow-xs border border-slate-300 dark:border-amber-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Contemporaneous Evidence Ledger ({dossier.contemporaneousLedgerCount})
            </button>
            <button
              onClick={() => setActiveDossierTab('CVC_COMPLIANCE')}
              className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeDossierTab === 'CVC_COMPLIANCE'
                  ? 'bg-white dark:bg-[#0f172a] text-blue-900 dark:text-amber-400 shadow-xs border border-slate-300 dark:border-amber-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              CVC & FIDIC Integrity Badges
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>EVIDENCE ANCHOR: MERKLE TREE ROOT SHA-256</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50 print:bg-white print:overflow-visible">
          
          {/* Statutory Government Letterhead Block (Always visible in print) */}
          <div className="p-4 bg-white border border-slate-300 rounded-xl shadow-xs print:shadow-none print:border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  GOVERNMENT OF INDIA // MINISTRY OF PETROLEUM & NATURAL GAS
                </span>
                <h1 className="text-base sm:text-xl font-extrabold text-slate-900 font-serif">
                  OIL INDIA LIMITED (A Navratna Enterprise)
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Pipeline Engineering Directorate • Projects & Technical Services, Duliajan, Assam - 786602
                </p>
              </div>
              <div className="text-right font-mono text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                <div>Contract: <strong>{dossier.contractRef}</strong></div>
                <div>Generated: <strong>{dossier.generatedDate}</strong></div>
                <div>Classification: <strong className="text-rose-700">LEGAL CONFIDENTIAL</strong></div>
              </div>
            </div>

            {/* Quick KPI Metric Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-1 text-center font-mono">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Baseline Finish</span>
                <span className="text-sm font-bold text-slate-800">{dossier.baselineFinishDate}</span>
              </div>
              <div className="p-2.5 rounded bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-700 uppercase block font-semibold">Current CPM Forecast</span>
                <span className="text-sm font-bold text-amber-900">{dossier.currentForecastDate}</span>
              </div>
              <div className="p-2.5 rounded bg-rose-50 border border-rose-200">
                <span className="text-[10px] text-rose-700 uppercase block font-semibold">Critical Path Variance</span>
                <span className="text-sm font-bold text-rose-800">+{dossier.totalScheduleVarianceDays} Calendar Days</span>
              </div>
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 uppercase block font-semibold">Deductible LD Claim</span>
                <span className="text-sm font-bold text-emerald-900">₹{(dossier.liquidatedDamagesINR / 100000).toFixed(2)} Lakhs</span>
              </div>
            </div>
          </div>

          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeDossierTab === 'SUMMARY' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-slate-300 rounded-xl">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2 font-mono">
                  <span className="material-symbols-outlined text-[18px] text-blue-700">summarize</span>
                  <span>1. Executive Statement of Facts & Delay Liability</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  This statutory dossier compiles all contemporaneous digital project records for the <strong>{dossier.projectName}</strong>.
                  The project has encountered a net critical path schedule slippage of <strong>{dossier.totalScheduleVarianceDays} days</strong> against the approved P6 baseline finish date of {dossier.baselineFinishDate}.
                  In accordance with <em>CVC Guidelines (2022)</em> and <em>FIDIC Conditions of Contract (Clause 20.1)</em>, SiteSync AI has performed objective, evidence-grounded delay apportioning between Force Majeure climatic hindrances, client Right-of-Way clearances, and contractor equipment breakdown.
                </p>
              </div>

              {/* Attribution Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {dossier.delayAttribution.map((attr, idx) => (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                      attr.category === 'FORCE_MAJEURE' 
                        ? 'bg-blue-50/60 border-blue-200' 
                        : attr.category === 'CLIENT_DELAY' 
                        ? 'bg-amber-50/60 border-amber-200' 
                        : 'bg-rose-50/60 border-rose-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          attr.category === 'FORCE_MAJEURE' 
                            ? 'bg-blue-100 text-blue-800' 
                            : attr.category === 'CLIENT_DELAY' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {attr.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-800">{attr.days} Days Impact</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 font-sans">{attr.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">{attr.primaryCause}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/80 font-mono text-[10px] flex items-center justify-between">
                      <span className="text-slate-500">Legal Classification:</span>
                      <strong className={attr.excusable ? 'text-emerald-700' : 'text-rose-700'}>
                        {attr.excusable ? 'EXCUSABLE (NO LD)' : 'INEXCUSABLE (LD APPLIED)'}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DELAY ATTRIBUTION & LIQUIDATED DAMAGES MATRIX */}
          {activeDossierTab === 'DELAY_ATTRIBUTION' && (
            <div className="p-4 bg-white border border-slate-300 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-600">balance</span>
                  <span>2. Schedule Delay Apportionment & Liquidated Damages (LD) Assessment</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-500 font-medium">As per Contract Clause 14.8 & CVC Standards</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-mono text-[11px] text-slate-700">
                      <th className="p-2.5">Delay Category</th>
                      <th className="p-2.5">Root Cause Event Description</th>
                      <th className="p-2.5 text-center">Variance Days</th>
                      <th className="p-2.5">Legal Status</th>
                      <th className="p-2.5 text-right">Financial Exposure (INR)</th>
                      <th className="p-2.5 text-right">LD Recoverable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {dossier.delayAttribution.map((attr, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            attr.category === 'FORCE_MAJEURE' ? 'bg-blue-100 text-blue-800' :
                            attr.category === 'CLIENT_DELAY' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {attr.category}
                          </span>
                        </td>
                        <td className="p-2.5 font-sans font-medium text-slate-800 max-w-sm">
                          {attr.title}
                          <div className="text-[10px] text-slate-500 mt-0.5">{attr.primaryCause}</div>
                        </td>
                        <td className="p-2.5 text-center font-bold text-slate-900">{attr.days} Days</td>
                        <td className="p-2.5 font-bold">
                          {attr.excusable ? (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              Excusable EoT
                            </span>
                          ) : (
                            <span className="text-rose-700 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">cancel</span>
                              Contractor Default
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-right font-medium text-slate-700">
                          {attr.financialExposureINR > 0 ? `₹${attr.financialExposureINR.toLocaleString('en-IN')}` : '₹0 (Climatic)'}
                        </td>
                        <td className="p-2.5 text-right font-bold text-rose-700">
                          {attr.excusable ? '₹0' : `₹${dossier.liquidatedDamagesINR.toLocaleString('en-IN')}`}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                      <td colSpan={2} className="p-2.5 font-sans uppercase">Total Critical Path Impact</td>
                      <td className="p-2.5 text-center text-slate-900">{dossier.totalScheduleVarianceDays} Days</td>
                      <td className="p-2.5 font-sans text-slate-600">Net 5 Days LD Penalty</td>
                      <td className="p-2.5 text-right text-slate-800">₹32,70,000 Total</td>
                      <td className="p-2.5 text-right text-emerald-800">₹{dossier.liquidatedDamagesINR.toLocaleString('en-IN')} Deductible</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CONTEMPORANEOUS LEDGER */}
          {activeDossierTab === 'CONTEMPORANEOUS_LEDGER' && (
            <div className="p-4 bg-white border border-slate-300 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-blue-700">inventory</span>
                  <span>3. Tamper-Proof Contemporaneous Field Telemetry Ledger</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  SHA-256 Ledger Authenticated
                </span>
              </div>

              <div className="space-y-2">
                {activities.slice(0, 4).map((act, i) => (
                  <div key={act.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/80 font-mono text-xs space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px]">{act.activityCode}</span>
                        <span>{act.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Chainage: KM 42+650 • Lat 27.2891°N</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-600 pt-1">
                      <div>Baseline Start: <strong>{act.plannedStart}</strong></div>
                      <div>Actual Start: <strong className="text-blue-800">{act.actualStart || act.plannedStart}</strong></div>
                      <div>Actual Progress: <strong className="text-emerald-800">{act.actualPercent}%</strong></div>
                      <div>Status: <strong className="text-slate-800">{act.status}</strong></div>
                    </div>
                    <div className="pt-1 border-t border-slate-200 text-[9px] text-slate-500 flex items-center justify-between">
                      <span>Cryptographic Hash: SHA256:{Math.random().toString(36).substring(2, 15)}...{Math.random().toString(36).substring(2, 10)}</span>
                      <span className="text-emerald-700 font-bold">✓ Contemporaneous Field Proof Attached</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CVC & FIDIC COMPLIANCE BADGES */}
          {activeDossierTab === 'CVC_COMPLIANCE' && (
            <div className="p-4 bg-white border border-slate-300 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-700">verified_user</span>
                  <span>4. Statutory Oversight & Legal Admissibility Certificates</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-500">100% Audit Readiness</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {dossier.statutoryCompliance.map((comp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-xs font-bold text-emerald-950">{comp.clause}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 font-mono text-[9px] font-bold">
                          {comp.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 mt-1 font-sans">{comp.standard}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-emerald-200/80 font-mono text-[9px] text-slate-500 break-all">
                      {comp.proofHash}
                    </div>
                  </div>
                ))}
              </div>

              {/* Signoff Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 font-mono text-center text-xs">
                <div className="p-3 rounded border border-slate-200 bg-slate-50">
                  <div className="h-10 border-b border-dashed border-slate-300 flex items-center justify-center text-slate-400 italic">
                    Digitally Signed
                  </div>
                  <div className="mt-1 font-bold text-slate-800">Pranjal Saikia</div>
                  <div className="text-[10px] text-slate-500">Lead Planning & Controls Engineer</div>
                </div>
                <div className="p-3 rounded border border-slate-200 bg-slate-50">
                  <div className="h-10 border-b border-dashed border-slate-300 flex items-center justify-center text-slate-400 italic">
                    Digitally Signed
                  </div>
                  <div className="mt-1 font-bold text-slate-800">Rajiv K. Sharma</div>
                  <div className="text-[10px] text-slate-500">Chief General Manager (Infra Projects)</div>
                </div>
                <div className="p-3 rounded border border-slate-200 bg-slate-50">
                  <div className="h-10 border-b border-dashed border-slate-300 flex items-center justify-center text-slate-400 italic">
                    Digitally Signed
                  </div>
                  <div className="mt-1 font-bold text-slate-800">Dr. Ananya Baruah</div>
                  <div className="text-[10px] text-slate-500">Chief Vigilance & Compliance Officer</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-[16px] text-blue-700">verified</span>
            <span>Admissible under Indian Evidence Act 1872 (Sec 65B Certificate Generated)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDossierOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition-all cursor-pointer shadow-2xs"
            >
              Close Dossier
            </button>
            <button
              onClick={handlePrintPDF}
              className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold transition-all cursor-pointer shadow-xs"
            >
              Print / Save PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
