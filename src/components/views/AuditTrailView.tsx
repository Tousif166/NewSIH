import React, { useState } from 'react';
import { useApp } from '../../services/store';

export const AuditTrailView: React.FC = () => {
  const { showToast } = useApp();
  const [filterTag, setFilterTag] = useState<'all' | 'critical' | 'claims' | 'telemetry' | 'voice'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSandbox, setExpandedSandbox] = useState<string | null>('1842');
  const [activeHighlightBlock, setActiveHighlightBlock] = useState<string | null>(null);
  const [isVerifyingMerkle, setIsVerifyingMerkle] = useState(false);
  const [merkleVerified, setMerkleVerified] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast(`Copied ${label} to clipboard!`, 'success');
  };

  const handleVerifyMerkle = () => {
    setIsVerifyingMerkle(true);
    setTimeout(() => {
      setIsVerifyingMerkle(false);
      setMerkleVerified(true);
      showToast('Cryptographic Merkle Proofs validated across all 1,842 leaves.', 'success');
      setTimeout(() => setMerkleVerified(false), 3500);
    }, 800);
  };

  const handleLeafClick = (blockId: string) => {
    setActiveHighlightBlock(blockId);
    const el = document.getElementById(`block-${blockId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast(`Navigated & verified Merkle Leaf for Block #${blockId}`, 'info');
    setTimeout(() => setActiveHighlightBlock(null), 3000);
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Top Command & Provenance Trust Header */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-lg shadow-xs border border-slate-200">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-blue-700 uppercase tracking-widest font-semibold">
                Governance & Compliance
              </span>
              <span className="font-mono text-[10px] text-slate-300">/</span>
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                Audit & Provenance Ledger
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap mt-0.5">
              <h1 className="font-bold text-slate-900 text-xl tracking-tight">Upstream Cryptographic Audit Engine</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-semibold cursor-default">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                CVC / CAG COMPLIANCE TIER-1
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[10px] font-semibold cursor-default">
                <span className="material-symbols-outlined text-[13px]">shield</span>
                SHIFT AUDIT TRAIL SHA-256
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
            <button
              onClick={handleVerifyMerkle}
              disabled={isVerifyingMerkle}
              type="button"
              className="px-3.5 py-1.5 rounded bg-slate-50 hover:bg-slate-100 text-slate-800 font-mono text-xs font-semibold transition-all active:scale-95 flex items-center gap-2 border border-slate-300 shadow-xs"
            >
              {isVerifyingMerkle ? (
                <>
                  <span className="material-symbols-outlined text-[16px] text-blue-700 animate-spin">sync</span>
                  <span>Verifying 1,842 Blocks...</span>
                </>
              ) : merkleVerified ? (
                <>
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">task_alt</span>
                  <span className="text-emerald-700 font-bold">All Proofs 100% Valid</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px] text-blue-700">account_tree</span>
                  <span>Verify Merkle Proofs</span>
                </>
              )}
            </button>

            <button
              onClick={() => showToast('Filtering by Sector Spread 04-A...', 'info')}
              type="button"
              className="px-3.5 py-1.5 rounded bg-slate-50 hover:bg-slate-100 text-slate-800 font-mono text-xs font-semibold transition-all active:scale-95 flex items-center gap-2 border border-slate-300 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-slate-500">tune</span>
              <span>Filter Sector</span>
            </button>

            <button
              onClick={() => showToast('Exporting SHA-256 sealed CVC Audit Dossier archive (.ZIP)...', 'success')}
              type="button"
              className="px-3.5 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-semibold transition-all active:scale-95 shadow-xs flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">folder_zip</span>
              <span>Export CVC Audit Dossier (.ZIP)</span>
            </button>
          </div>
        </div>

        {/* 4 High-Density Vitals Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {/* Card 1 */}
          <div className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                Immutable Ledger Entries
              </span>
              <span className="material-symbols-outlined text-[18px] text-blue-700">token</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-slate-900 tracking-tight">1,842</span>
              <span className="font-mono text-xs text-blue-700 font-bold">BLOCKS</span>
            </div>
            <div className="mt-2.5 pt-2 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100 flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span>0 REORGANIZATIONS</span>
              <span>GENESIS: 15-JUN-2024</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                Cryptographic Merkle Root
              </span>
              <span className="material-symbols-outlined text-[18px] text-blue-700">hub</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2 truncate">
              <span className="text-sm text-slate-900 truncate font-mono font-bold">0x9AF572B104...ED312</span>
            </div>
            <div className="mt-2.5 pt-2 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100 flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span className="text-blue-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 100% VERIFIED
              </span>
              <span>OIL ISDN EDGE NODE</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                Dispute Defense Savings
              </span>
              <span className="material-symbols-outlined text-[18px] text-blue-700">gavel</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-slate-900 tracking-tight">₹2.10</span>
              <span className="font-mono text-xs text-blue-700 font-bold">CRORE SAFE</span>
            </div>
            <div className="mt-2.5 pt-2 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100 flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span className="text-rose-700 font-semibold">14-DAY DELAY REFUTED</span>
              <span>SAR TELEMETRY</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                CVC / CAG Readiness
              </span>
              <span className="material-symbols-outlined text-[18px] text-blue-700">verified_user</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-slate-900 tracking-tight">99.8%</span>
              <span className="font-mono text-xs text-blue-700 font-bold">PASS RATE</span>
            </div>
            <div className="mt-2.5 pt-2 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100 flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span>FORM 14-B SEALED</span>
              <span className="text-emerald-700 font-semibold">DPR CUSTODY VALID</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split Architecture: 65% Forensic Timeline / 35% Verification & Regulatory Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-3.5 rounded-lg shadow-xs border border-slate-200 flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded border border-slate-200 focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
              <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
              <input
                className="bg-transparent border-0 outline-none w-full font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:ring-0 p-0"
                placeholder="Search block hash (0x...), activity ID, contractor claim, or inspector seal..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                CTRL+K
              </span>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100">
              {/* Filter pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  [
                    { id: 'all', label: 'All Blocks (1,842)' },
                    { id: 'critical', label: 'Critical Path Only' },
                    { id: 'claims', label: 'Contractor Claims' },
                    { id: 'telemetry', label: 'Equipment Telemetry' },
                    { id: 'voice', label: 'Voice Memos' }
                  ] as const
                ).map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setFilterTag(pill.id)}
                    className={`px-2.5 py-1 rounded font-mono text-[10px] font-semibold transition-all ${
                      filterTag === pill.id
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-400 uppercase">Sort:</span>
                <span className="font-mono text-[10px] text-blue-700 font-semibold cursor-pointer hover:underline">
                  Block Sequence (DESC)
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Block Entries List */}
          <div className="flex flex-col gap-3.5">
            {/* BLOCK #1842 */}
            <article
              id="block-1842"
              className={`bg-white rounded-lg p-4 shadow-xs border transition-all flex flex-col gap-3 relative overflow-hidden ${
                activeHighlightBlock === '1842'
                  ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/20'
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-700"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-[10px] font-bold tracking-wider">
                    BLOCK #1842
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 font-medium">24 OCT 2024 • 11:15 IST</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                    KM 42+650
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200 self-start sm:self-auto">
                  <span className="material-symbols-outlined text-[13px]">lock</span>
                  SEALED & COMMITTED TO P6
                </span>
              </div>

              <div className="pl-2 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                    Voice DPR #8820-03 Subsurface Strata Refusal Ingestion
                  </h2>
                  <span className="font-mono text-[10px] text-slate-500 uppercase shrink-0 font-semibold">
                    WBS 04-A-CIVIL
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 px-3 rounded bg-slate-50 border border-slate-100 font-mono text-[10px] text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">HASH:</span>
                    <span className="text-slate-900 font-semibold truncate">0x4e8a329d...c391</span>
                    <button
                      onClick={() => copyToClipboard('0x4e8a329dc391fa091e84711200bafe', 'Block #1842 Hash')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-blue-700 transition-colors inline-flex items-center"
                      title="Copy full hash"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[13px]">content_copy</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">INSPECTOR:</span>
                    <span className="text-slate-900 font-semibold truncate">Debashis Gogoi (OIL-FLD-8820)</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">SYNC DELAY:</span>
                    <span className="text-blue-700 font-semibold truncate">14ms EPPM DUAL-WRITE</span>
                  </div>
                </div>

                {/* Evidence Row with Spectrogram & CAN-Bus Metric */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-700 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-blue-700">speed</span>
                        KOMATSU PC300 CAN-BUS TELEMETRY
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                        34.8 MPa
                      </span>
                    </div>
                    {/* Inline telemetry sparkline */}
                    <div className="flex items-end gap-1 h-8 pt-1">
                      <div className="w-1.5 h-3 bg-slate-300 rounded-xs"></div>
                      <div className="w-1.5 h-3 bg-slate-300 rounded-xs"></div>
                      <div className="w-1.5 h-4 bg-slate-300 rounded-xs"></div>
                      <div className="w-1.5 h-4 bg-slate-300 rounded-xs"></div>
                      <div className="w-1.5 h-5 bg-slate-300 rounded-xs"></div>
                      <div className="w-1.5 h-7 bg-blue-700 rounded-xs"></div>
                      <div className="w-1.5 h-8 bg-rose-600 rounded-xs animate-pulse"></div>
                      <div className="w-1.5 h-8 bg-rose-600 rounded-xs animate-pulse"></div>
                      <div className="w-1.5 h-6 bg-blue-700 rounded-xs"></div>
                      <div className="w-1.5 h-4 bg-slate-300 rounded-xs"></div>
                      <div className="w-1.5 h-4 bg-slate-300 rounded-xs"></div>
                      <div className="w-1.5 h-3 bg-slate-300 rounded-xs"></div>
                    </div>
                    <span className="text-xs text-slate-600">
                      Hydraulic relief spike validates hard strata refusal at 1.82m trench depth.
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-700 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-blue-700">graphic_eq</span>
                        VOICE MEMO SPECTROGRAM
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                        00:42 SEC
                      </span>
                    </div>
                    {/* Spectrogram audio wave */}
                    <div className="flex items-center gap-1 h-8 pt-1">
                      <span className="w-1 h-2 bg-slate-400 rounded-xs"></span>
                      <span className="w-1 h-4 bg-slate-400 rounded-xs"></span>
                      <span className="w-1 h-6 bg-blue-600 rounded-xs"></span>
                      <span className="w-1 h-7 bg-blue-700 rounded-xs"></span>
                      <span className="w-1 h-3 bg-slate-400 rounded-xs"></span>
                      <span className="w-1 h-5 bg-slate-400 rounded-xs"></span>
                      <span className="w-1 h-8 bg-blue-800 rounded-xs"></span>
                      <span className="w-1 h-6 bg-blue-600 rounded-xs"></span>
                      <span className="w-1 h-4 bg-slate-400 rounded-xs"></span>
                      <span className="w-1 h-2 bg-slate-400 rounded-xs"></span>
                      <span className="w-1 h-5 bg-blue-600 rounded-xs"></span>
                      <span className="w-1 h-3 bg-slate-400 rounded-xs"></span>
                    </div>
                    <span className="text-xs text-slate-600">
                      Signed acoustic footprint matches field lead speech profile (Cosine sim: 0.994).
                    </span>
                  </div>
                </div>

                {/* Expandable Forensic Sandbox Panel */}
                {expandedSandbox === '1842' && (
                  <div className="flex flex-col gap-2 p-3 mt-1 rounded bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                      <span className="font-bold text-blue-700 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">analytics</span>
                        FORENSIC DEEP AUDIT TELEMETRY (CAN-BUS #PC300-981)
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">SAMPLING: 50Hz HIGH-PRECISION</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-1 font-mono text-[11px]">
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-400">ENGINE TORQUE:</span>{' '}
                        <span className="font-bold text-slate-900">92.4% PEAK</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-400">BOOM STRESS:</span>{' '}
                        <span className="font-bold text-rose-700">412 MPa</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-400">GEO-LAT:</span>{' '}
                        <span className="font-bold text-slate-900">27.3811° N</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-400">GEO-LONG:</span>{' '}
                        <span className="font-bold text-slate-900">95.3190° E</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-slate-500 text-[10px]">
                      <span>CRYPTOGRAPHIC PROOF: MERKLE LEAF VERIFIED BY DRILLING FORENSICS CORE</span>
                      <span className="text-emerald-700 font-bold">CVC STATUTORY RECORD ACTIVE</span>
                    </div>
                  </div>
                )}

                {/* Merkle Proof Breadcrumb Bar */}
                <div className="mt-1 flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500 font-mono text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-blue-700">format_image_left</span>
                    Leaf #1842: H(VoiceMemo || CANBus || P6_WBS)
                  </span>
                  <button
                    onClick={() => setExpandedSandbox(expandedSandbox === '1842' ? null : '1842')}
                    className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 transition-all"
                  >
                    <span>{expandedSandbox === '1842' ? 'Hide Forensic Sandbox' : 'Inspect In Forensic Sandbox'}</span>
                    <span className={`material-symbols-outlined text-[13px] transition-transform ${expandedSandbox === '1842' ? 'rotate-90' : ''}`}>
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </article>

            {/* BLOCK #1841 */}
            <article
              id="block-1841"
              className={`bg-white rounded-lg p-4 shadow-xs border transition-all flex flex-col gap-3 relative overflow-hidden ${
                activeHighlightBlock === '1841'
                  ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/20'
                  : 'border-slate-200 hover:border-rose-300 hover:shadow-md'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-700"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-mono text-[10px] font-bold tracking-wider">
                    BLOCK #1841
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 font-medium">23 OCT 2024 • 09:00 IST</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                    CONTRACT DISPUTE ADJUDICATION
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 self-start sm:self-auto">
                  <span className="material-symbols-outlined text-[13px]">gavel</span>
                  LD RECOVERY: ₹2.10 CR PROTECTED
                </span>
              </div>

              <div className="pl-2 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                    Disallowance of L&T Monsoon Force Majeure Claim (Days 07-17)
                  </h2>
                  <span className="font-mono text-[10px] text-slate-500 uppercase shrink-0 font-semibold">
                    REF: OIL/TR/2023/C-08
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 px-3 rounded bg-slate-50 border border-slate-100 font-mono text-[10px] text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">HASH:</span>
                    <span className="text-slate-900 font-semibold truncate">0x9f1b77a2...228a</span>
                    <button
                      onClick={() => copyToClipboard('0x9f1b77a2901c801e228a47ba9f', 'Block #1841 Hash')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-blue-700 transition-colors inline-flex items-center"
                      title="Copy full hash"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[13px]">content_copy</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">ADJUDICATOR:</span>
                    <span className="text-slate-900 font-semibold truncate">Pranjal Saikia (Chief Eng)</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">LEGAL WEIGHT:</span>
                    <span className="text-rose-700 font-bold truncate">CVC MANUAL CLAUSE 8.4</span>
                  </div>
                </div>

                {/* Double Evidence Cards: SAR vs Ground IMD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-900 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-blue-700">satellite_alt</span>
                        SENTINEL-1 SAR BACKSCATTER RADAR
                      </span>
                      <span className="font-mono text-[10px] text-blue-700 font-bold">VV/VH POL</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Satellite aperture radar confirms dry subsoil roughness along chainage KM 38–54 during claimed inundation period. Soil volumetric moisture &lt;14.2%.
                    </p>
                    <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] pt-1">
                      <span>COPERNICUS SCENE ID: S1A_IW_GRDH</span>
                      <span className="text-blue-700 font-bold">MATCH: ZERO FLOODING</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-900 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-blue-700">rainy</span>
                        DIGBOI IMD AUTOMATED RAIN GAUGE
                      </span>
                      <span className="font-mono text-[10px] text-emerald-700 font-bold">11 DRY DAYS</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Daily precipitation logged &lt;2.1mm/24hr threshold required to sustain Force Majeure stoppage. Contractor idle claims refuted by official meteorological telematics.
                    </p>
                    <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] pt-1">
                      <span>STATION ID: DGB-IMD-04</span>
                      <span className="text-rose-700 font-bold">11 DAYS DISALLOWED</span>
                    </div>
                  </div>
                </div>

                {/* Expandable Forensic Sandbox Panel */}
                {expandedSandbox === '1841' && (
                  <div className="flex flex-col gap-2 p-3 mt-1 rounded bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                      <span className="font-bold text-rose-700 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">balance</span>
                        LEGAL ARBITRATION CITATION & ADMISSIBILITY METRICS
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">SEC-8.4 CVC ENFORCED</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 py-1 font-mono text-[11px]">
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-400">CLAIM REBUTTAL:</span>{' '}
                        <span className="font-bold text-rose-700">₹2,10,00,000</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-400">INDIAN EVIDENCE ACT:</span>{' '}
                        <span className="font-bold text-slate-900">SEC 65B VALIDATED</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-400">ORACLE EPPM REF:</span>{' '}
                        <span className="font-bold text-slate-900">ACT-FM-DIS-091</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-slate-500 font-mono text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-blue-700">description</span>
                    Signed Adjudication Order sealed with Chief Eng Private Key
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedSandbox(expandedSandbox === '1841' ? null : '1841')}
                      className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
                    >
                      <span>{expandedSandbox === '1841' ? 'Hide Legal Matrix' : 'View Legal Evidence Matrix'}</span>
                      <span className={`material-symbols-outlined text-[13px] transition-transform ${expandedSandbox === '1841' ? 'rotate-90' : ''}`}>
                        arrow_forward
                      </span>
                    </button>
                    <button
                      onClick={() => showToast('Downloading Signed Legal Certificate (PDF)...', 'success')}
                      className="text-blue-700 hover:underline font-bold flex items-center gap-1"
                    >
                      Download Legal Certificate (PDF){' '}
                      <span className="material-symbols-outlined text-[13px]">file_download</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* BLOCK #1840 */}
            <article
              id="block-1840"
              className={`bg-white rounded-lg p-4 shadow-xs border transition-all flex flex-col gap-3 relative overflow-hidden ${
                activeHighlightBlock === '1840'
                  ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/20'
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-400"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] font-bold tracking-wider">
                    BLOCK #1840
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 font-medium">22 OCT 2024 • 14:15 IST</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                    QUALITY CONTROL & NDT
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold self-start sm:self-auto">
                  <span className="material-symbols-outlined text-[13px]">arrows_outward</span>
                  NDT RADIOGRAPHY SEAL
                </span>
              </div>
              <div className="pl-2 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                    CRC-Evans M-300 Welding Joint #J-118 Refusal Calibration
                  </h2>
                  <span className="font-mono text-[10px] text-slate-500 uppercase shrink-0 font-semibold">
                    WELD LOG RT-391
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 px-3 rounded bg-slate-50 border border-slate-100 font-mono text-[10px] text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">HASH:</span>
                    <span className="text-slate-900 font-semibold truncate font-mono">0x11cca088...a744</span>
                    <button
                      onClick={() => copyToClipboard('0x11cca08819028cb9a744ff01', 'Block #1840 Hash')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-blue-700"
                    >
                      <span className="material-symbols-outlined text-[13px]">content_copy</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">OPERATOR:</span>
                    <span className="text-slate-900 font-semibold truncate">Anil Bezbaruah (Level-III QA)</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">CALIBRATION:</span>
                    <span className="text-blue-700 font-bold truncate">0.4mm ROOT PASS DRIFT FLAGGED</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automated orbital welding telemetry logged a micro-hesitation during the root run. Radiography digitized film strip RT-391 securely hashed and coupled to P6 activity <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">ACT-WLD-118</code>. Immediate repair loop initiated before hydrostatic trench lowering.
                </p>

                {/* NDT Film Photographic Proof */}
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 mt-1">
                  <div className="relative w-20 h-14 rounded overflow-hidden bg-slate-900 shrink-0 border border-slate-200 shadow-2xs group">
                    <img
                      src="/images/ndt-film-scan.jpg"
                      alt="NDT Radiography Film RT-391"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-950/40"></div>
                    <span className="absolute bottom-0.5 right-0.5 font-mono text-[7px] bg-red-600 text-white px-1 rounded font-bold">
                      0.4mm
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-xs">
                      Digitized Radiography Gamma-Ray Strip RT-391 (Joint J-118)
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 mt-0.5">
                      Ir-192 isotope exposure. Root-pass weld drift confirmed at 3 o'clock quadrant.
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* BLOCK #1839 */}
            <article
              id="block-1839"
              className={`bg-white rounded-lg p-4 shadow-xs border transition-all flex flex-col gap-3 relative overflow-hidden ${
                activeHighlightBlock === '1839'
                  ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/20'
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-400"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] font-bold tracking-wider">
                    BLOCK #1839
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 font-medium">21 OCT 2024 • 08:30 IST</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                    4D DIGITAL TWIN FLYOVER
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200 self-start sm:self-auto">
                  <span className="material-symbols-outlined text-[13px]">flight</span>
                  RTK PHOTOGRAMMETRY: 1.8CM
                </span>
              </div>
              <div className="pl-2 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                    Spread 1 Trench Advance Verification & Right-of-Way Orthomosaic
                  </h2>
                  <span className="font-mono text-[10px] text-slate-500 uppercase shrink-0 font-semibold">
                    DRONE RUN D300-88
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 px-3 rounded bg-slate-50 border border-slate-100 font-mono text-[10px] text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">HASH:</span>
                    <span className="text-slate-900 font-semibold truncate font-mono">0x88bb31f0...ff01</span>
                    <button
                      onClick={() => copyToClipboard('0x88bb31f009b2ac918801ff01', 'Block #1839 Hash')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-blue-700"
                    >
                      <span className="material-symbols-outlined text-[13px]">content_copy</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">UAV PILOT:</span>
                    <span className="text-slate-900 font-semibold truncate">DGCA-CERT #OIL-UAV-12</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">SURVEY ACCURACY:</span>
                    <span className="text-blue-700 font-bold truncate">1.8cm RTK RESOLUTION</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
                      Measured Trench Linear Progress
                    </span>
                    <span className="font-mono font-bold text-lg text-slate-900">420.5 METERS</span>
                    <span className="text-xs text-slate-600">
                      Validated against contractor daily progress sheet reporting 425m (variance within ±1.0%).
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
                      Geotagged Point Cloud
                    </span>
                    <span className="font-mono font-bold text-lg text-slate-900">1.28 GB LAS POINT DATA</span>
                    <span className="text-xs text-slate-600">
                      Embedded EXIF metadata sealed cryptographically into Merkle Leaf #1839.
                    </span>
                  </div>
                </div>

                {/* UAV Orthomosaic Aerial Photographic Proof */}
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 mt-1">
                  <div className="relative w-20 h-14 rounded overflow-hidden bg-slate-900 shrink-0 border border-slate-200 shadow-2xs group">
                    <img
                      src="/images/uav-corridor-ortho.jpg"
                      alt="UAV Orthomosaic Flyover D300-88"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"></div>
                    <span className="absolute bottom-0.5 right-0.5 font-mono text-[7px] bg-blue-700 text-white px-1 rounded font-bold">
                      1.8cm RTK
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-xs">
                      Orthomosaic Photogrammetry Strip D300-88 (Chainage KM 42+480 to 42+900)
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 mt-0.5">
                      Centimetric accuracy RTK geo-tagged surface model. Verified 420.5m linear trench advance.
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Pagination / Ledger Cursor */}
          <div className="p-3 bg-white rounded-lg shadow-xs border border-slate-200 flex items-center justify-between text-slate-500 font-mono text-[10px]">
            <span>SHOWING 4 OF 1,842 ANCHORED BLOCKS</span>
            <div className="flex items-center gap-1.5">
              <button className="px-2 py-1 rounded bg-slate-100 font-semibold text-slate-400 cursor-not-allowed">
                PREVIOUS
              </button>
              <span className="px-2 py-1 rounded bg-blue-700 text-white font-bold shadow-xs">1</span>
              <button
                onClick={() => showToast('Loading ledger page 2...', 'info')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                2
              </button>
              <button
                onClick={() => showToast('Loading ledger page 3...', 'info')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button
                onClick={() => showToast('Loading ledger page 461...', 'info')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                461
              </button>
              <button
                onClick={() => showToast('Loading next ledger page...', 'info')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Merkle Tree Visual Inspector */}
          <div className="bg-white rounded-lg p-4 shadow-xs border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-blue-700">account_tree</span>
                <h2 className="font-bold text-slate-900 text-sm">Merkle Tree Proof Inspector</h2>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                LIVE TREE
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Cryptographic tree verification showing active leaf hash calculation bubbling up to the immutable OIL root anchor. Click any leaf node to cross-navigate to ledger evidence.
            </p>

            {/* Visual Merkle Diagram Component */}
            <div className="bg-slate-50 p-3.5 rounded-lg flex flex-col gap-3 font-mono text-[10px] border border-slate-200">
              {/* Root Hash */}
              <div
                onClick={() => copyToClipboard('0x9AF572B104A7BED312', 'Root Anchor Hash')}
                className="p-2.5 rounded bg-white shadow-xs flex flex-col gap-1 border-l-2 border-blue-700 hover:border-blue-900 hover:shadow-sm transition-all cursor-pointer"
                title="Click to copy Root Anchor"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold text-blue-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">key</span>
                    MERKLE ROOT ANCHOR
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> VERIFIED
                  </span>
                </div>
                <span className="font-mono text-slate-900 text-[11px] truncate select-all">0x9AF572B104A7B...ED312</span>
              </div>

              {/* Connecting Stem SVG */}
              <div className="flex justify-center">
                <svg className="w-24 h-5 text-slate-300" fill="none" viewBox="0 0 96 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M48 0V8M48 8L16 20M48 8L80 20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"></path>
                </svg>
              </div>

              {/* Intermediate Hash Nodes */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-white shadow-xs flex flex-col gap-0.5 border border-slate-200">
                  <span className="text-slate-500 font-semibold truncate">NODE L1-A</span>
                  <span className="font-mono text-slate-800 truncate">0x7bc2...104b</span>
                </div>
                <div className="p-2 rounded bg-white shadow-xs flex flex-col gap-0.5 border border-slate-200">
                  <span className="text-slate-500 font-semibold truncate">NODE L1-B</span>
                  <span className="font-mono text-slate-800 truncate">0x3de9...912a</span>
                </div>
              </div>

              {/* Connecting Stem SVG 2 */}
              <div className="flex justify-between px-6">
                <svg className="w-12 h-4 text-slate-300" fill="none" viewBox="0 0 48 16">
                  <path d="M24 0V6M24 6L8 16M24 6L40 16" stroke="currentColor" strokeWidth="1.5"></path>
                </svg>
                <svg className="w-12 h-4 text-slate-300" fill="none" viewBox="0 0 48 16">
                  <path d="M24 0V6M24 6L8 16M24 6L40 16" stroke="currentColor" strokeWidth="1.5"></path>
                </svg>
              </div>

              {/* Leaf Nodes */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <button
                  onClick={() => handleLeafClick('1842')}
                  className="p-1.5 rounded bg-white shadow-xs hover:border-blue-700 active:scale-95 flex flex-col items-center border border-slate-200 transition-all group"
                  title="Locate Block #1842 in Audit Ledger"
                  type="button"
                >
                  <span className="text-[9px] text-blue-700 font-bold group-hover:scale-110 transition-transform">#1842</span>
                  <span className="material-symbols-outlined text-[12px] text-blue-700">check_circle</span>
                </button>
                <button
                  onClick={() => handleLeafClick('1841')}
                  className="p-1.5 rounded bg-white shadow-xs hover:border-rose-700 active:scale-95 flex flex-col items-center border border-slate-200 transition-all group"
                  title="Locate Block #1841 in Audit Ledger"
                  type="button"
                >
                  <span className="text-[9px] text-rose-700 font-bold group-hover:scale-110 transition-transform">#1841</span>
                  <span className="material-symbols-outlined text-[12px] text-rose-700">check_circle</span>
                </button>
                <button
                  onClick={() => handleLeafClick('1840')}
                  className="p-1.5 rounded bg-white shadow-xs hover:border-slate-700 active:scale-95 flex flex-col items-center border border-slate-200 transition-all group"
                  title="Locate Block #1840 in Audit Ledger"
                  type="button"
                >
                  <span className="text-[9px] text-slate-700 font-bold group-hover:scale-110 transition-transform">#1840</span>
                  <span className="material-symbols-outlined text-[12px] text-slate-600">check_circle</span>
                </button>
                <button
                  onClick={() => handleLeafClick('1839')}
                  className="p-1.5 rounded bg-white shadow-xs hover:border-slate-700 active:scale-95 flex flex-col items-center border border-slate-200 transition-all group"
                  title="Locate Block #1839 in Audit Ledger"
                  type="button"
                >
                  <span className="text-[9px] text-slate-700 font-bold group-hover:scale-110 transition-transform">#1839</span>
                  <span className="material-symbols-outlined text-[12px] text-slate-600">check_circle</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 font-mono text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">PUBLIC VERIFICATION KEY:</span>
                <span
                  onClick={() => copyToClipboard('0x9AF572B104A7BED312', 'Public Key')}
                  className="font-mono text-slate-900 font-semibold flex items-center gap-1 cursor-pointer hover:text-blue-700"
                >
                  0x9AF...D312
                  <span className="material-symbols-outlined text-[12px]">content_copy</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">P6 EPPM SYNC STATUS:</span>
                <span className="text-blue-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  CONTINUOUS (18ms)
                </span>
              </div>
            </div>

            <button
              onClick={() => showToast('Compiling Statutory CVC & CAG Audit Certificate (PDF)...', 'success')}
              type="button"
              className="w-full py-2.5 rounded bg-blue-700 text-white hover:bg-blue-800 active:scale-[0.99] font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Download Statutory Audit Certificate (PDF)</span>
            </button>
          </div>

          {/* Regulatory & Legal Compliance Frameworks Panel */}
          <div className="bg-white rounded-lg p-4 shadow-xs border border-slate-200 flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-blue-700">balance</span>
                <h2 className="font-bold text-slate-900 text-sm">Regulatory Compliance</h2>
              </div>
              <span className="font-mono text-[10px] text-slate-500 font-semibold">STATUTORY</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Compliance Item 1 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-900 font-bold">CVC GUIDELINES MANUAL</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                    SEC 8.4
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Strict burden-of-proof mandate for liquidated damages mitigation during contractor force majeure declarations.
                </p>
                <div className="flex items-center gap-1 text-blue-700 font-mono text-[10px] font-semibold pt-1">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>Enforced via SAR & Rain Gauge Hashes</span>
                </div>
              </div>

              {/* Compliance Item 2 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-900 font-bold">MoPNG PIPELINE CODE</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                    OISD-141
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ministry of Petroleum & Natural Gas mandatory electronic weld ledger retention and non-destructive examination logs.
                </p>
                <div className="flex items-center gap-1 text-blue-700 font-mono text-[10px] font-semibold pt-1">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>100% Digital RT Film Provenance Verified</span>
                </div>
              </div>

              {/* Compliance Item 3 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-900 font-bold">PUBLIC PROCUREMENT ACT</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                    TIER-1 AUDIT
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Statutory Form 14-B signed cryptographically every shift before Oracle Primavera P6 activity advancement.
                </p>
                <div className="flex items-center gap-1 text-blue-700 font-mono text-[10px] font-semibold pt-1">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>Tamper-evident chain of custody locked</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span>CAG AUDIT EXPIRY: 31-DEC-2025</span>
              <span className="text-blue-700 font-bold">CURRENT STATUS: HEALTHY</span>
            </div>
          </div>

          {/* Quick Action Reference Box with Integrity Seal Fingerprint */}
          <div className="bg-white rounded-lg p-4 shadow-xs border border-slate-200 flex flex-col gap-2 font-mono text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 uppercase tracking-wider font-bold">Integrity Seal Fingerprint</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                SECURE BEACON
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 font-mono text-slate-900 break-all select-all flex items-center justify-between gap-2 border border-slate-200">
              <span>SHA256: 8a42b1029c9efd780210bcda98a4421df898124019a</span>
              <button
                onClick={() => copyToClipboard('SHA256: 8a42b1029c9efd780210bcda98a4421df898124019a', 'Integrity Seal Hash')}
                className="p-1 rounded hover:bg-white text-slate-400 hover:text-blue-700 shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-slate-500 pt-1">
              <span>ISDN EDGE SIGNATURE: VALID</span>
              <span className="text-blue-700 font-semibold">NODE-AS04 SECURE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
