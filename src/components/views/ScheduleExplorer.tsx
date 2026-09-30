import React, { useState } from 'react';
import { useApp } from '../../services/store';

interface WbsNodeData {
  code: string;
  title: string;
  obs: string;
  costCode: string;
  contractor: string;
  activitiesCount: string;
  evRatio: string;
  spi: string;
  status: 'OPTIMAL' | 'WATCH' | 'CRITICAL' | 'COMPLETE' | 'PENDING';
  tier: number;
  isCritical: boolean;
  span: string;
  progress: string;
  bcws: string;
  bcwp: string;
  acwp: string;
  cpi: string;
}

export const ScheduleExplorer: React.FC = () => {
  const { setActiveTab } = useApp();

  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({
    'trunk-all': true,
    'trunk-04': true,
    'spread-02': true
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tier2Only, setTier2Only] = useState<boolean>(false);
  const [criticalOnly, setCriticalOnly] = useState<boolean>(false);

  // Inspector selected node state
  const [selectedNode, setSelectedNode] = useState<WbsNodeData>({
    code: 'OIL.TRUNK.04.B',
    title: 'Spread 2 (Km 30+000 to Km 65+000)',
    obs: 'Pranjal Saikia / Shift A',
    costCode: 'CC-7710-CIVIL',
    contractor: 'L&T Hydrocarbon Eng.',
    activitiesCount: '28 Activities',
    evRatio: '₹68.5 Cr / ₹84.2 Cr',
    spi: '0.81',
    status: 'CRITICAL',
    tier: 3,
    isCritical: true,
    span: '05/24 - 03/25',
    progress: '48.2% / 59.4%',
    bcws: '₹84.2 Cr',
    bcwp: '₹68.5 Cr',
    acwp: '₹71.2 Cr',
    cpi: '0.96'
  });

  // Donut chart hover center state
  const [donutCenter, setDonutCenter] = useState({
    percent: '24%',
    label: 'SP-02',
    color: '#8f000b'
  });

  const toggleBranch = (key: string) => {
    setExpandedBranches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExpandAll = () => {
    const allExpanded = Object.values(expandedBranches).every(Boolean);
    setExpandedBranches({
      'trunk-all': !allExpanded,
      'trunk-04': !allExpanded,
      'spread-02': !allExpanded
    });
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Top Banner & Quick Controls */}
      <section className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center text-white shadow-2xs">
              <span className="material-symbols-outlined text-[19px]">account_tree</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-sm text-slate-900 font-bold uppercase tracking-wide">
                  WBS DICTIONARY &amp; SCHEDULE BREAKDOWN
                </h1>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-semibold border border-blue-200">
                  P6 EPPM R23.12
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                  LOCK: 0x8b32...9ff1
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                PROJECT WORK BREAKDOWN STRUCTURE // DETERMINISTIC CRITICAL PATH ALIGNED
              </span>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center flex-wrap gap-1.5">
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">unfold_more</span>
              <span>Expand All</span>
            </button>
            <button
              type="button"
              onClick={() => setTier2Only(!tier2Only)}
              className={`px-2.5 py-1.5 rounded font-mono text-xs flex items-center gap-1 transition-all cursor-pointer ${
                tier2Only
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">filter_alt</span>
              <span>Tier 2 Only</span>
            </button>
            <button
              type="button"
              onClick={() => setCriticalOnly(!criticalOnly)}
              className={`px-2.5 py-1.5 rounded font-mono text-xs flex items-center gap-1 transition-all cursor-pointer ${
                criticalOnly
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">crisis_alert</span>
              <span>Filter Critical Path</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const csvData =
                  'data:text/csv;charset=utf-8,' +
                  'WBS_Code,Description,Contractor,Span,Progress\n' +
                  'OIL.TRUNK.132,Digboi-Duliajan 132km,OIL Exec,01/24 - 11/25,61.4%\n' +
                  'OIL.TRUNK.04.B,Spread 2 Km 30-65,L&T,05/24 - 03/25,48.2%';
                const encodedUri = encodeURI(csvData);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', 'wbs_schedule_breakdown.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-2.5 py-1.5 rounded bg-blue-700 text-white hover:bg-blue-800 font-mono text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[14px]">file_download</span>
              <span>Export XER/CSV</span>
            </button>
          </div>
        </div>

        {/* 4 High-Density Metric Strip Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Total WBS Elements */}
          <div className="bg-white p-3 rounded-lg shadow-xs flex flex-col justify-between border border-slate-200 hover:border-blue-300 transition-all cursor-default">
            <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span className="uppercase">Total WBS Elements</span>
              <span className="material-symbols-outlined text-[16px] text-blue-700">lan</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl text-slate-900 font-bold font-mono">142</span>
              <span className="font-mono text-[10px] text-slate-500">4 Tiers Deep</span>
            </div>
            <div className="mt-2 pt-1.5 bg-slate-50 px-2 py-1 rounded flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span>Terminal Leaf Nodes</span>
              <span className="font-bold text-slate-800">118 Work Pkgs</span>
            </div>
          </div>

          {/* Scope Lock */}
          <div className="bg-white p-3 rounded-lg shadow-xs flex flex-col justify-between border border-slate-200 hover:border-blue-300 transition-all cursor-default">
            <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span className="uppercase">Baseline Scope Lock</span>
              <span className="material-symbols-outlined text-[16px] text-blue-700">verified</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl text-blue-700 font-bold font-mono">REV 4.8</span>
              <span className="font-mono text-[10px] text-slate-500">12 Oct 2024</span>
            </div>
            <div className="mt-2 pt-1.5 bg-slate-50 px-2 py-1 rounded flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-500">Variance Slippage</span>
              <span className="text-blue-700 font-bold">0 Uncontrolled</span>
            </div>
          </div>

          {/* Critical Path Load */}
          <div className="bg-white p-3 rounded-lg shadow-xs flex flex-col justify-between border border-rose-200 hover:border-rose-300 transition-all cursor-default">
            <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span className="uppercase">Critical Path Load</span>
              <span className="material-symbols-outlined text-[16px] text-rose-600">warning</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl text-rose-600 font-bold font-mono">18</span>
              <span className="font-mono text-[10px] text-slate-800">Nodes (12.7%)</span>
            </div>
            <div className="mt-2 pt-1.5 bg-rose-50 px-2 py-1 rounded flex items-center justify-between text-rose-700 font-mono text-[10px]">
              <span>Active Roadblocks</span>
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                2 Spread 2 Latencies
              </span>
            </div>
          </div>

          {/* BAC / Earned Value */}
          <div className="bg-white p-3 rounded-lg shadow-xs flex flex-col justify-between border border-slate-200 hover:border-blue-300 transition-all cursor-default">
            <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span className="uppercase">BAC / Earned Value</span>
              <span className="material-symbols-outlined text-[16px] text-blue-700">price_check</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5 truncate">
              <span className="text-2xl text-slate-900 font-bold font-mono">₹296.25</span>
              <span className="font-mono text-xs text-slate-500">/ ₹482.50 Cr</span>
            </div>
            <div className="mt-2 pt-1.5 bg-slate-50 px-2 py-1 rounded flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-500">Earned BCWP: 61.4%</span>
              <span className="text-rose-700 font-bold">SV: -₹14.2 Cr</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN DUAL-COLUMN WORKSPACE */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start">
        {/* LEFT COLUMN: HIERARCHICAL WBS TREE (8 cols) */}
        <div className="xl:col-span-8 flex flex-col bg-white rounded-lg shadow-xs overflow-hidden border border-slate-200">
          {/* Table Filter Bar */}
          <div className="p-3 bg-slate-50 flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-200">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <div className="relative w-full max-w-sm">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search WBS code, milestone, or task..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white text-slate-800 font-mono text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>
              <span className="font-mono text-[10px] text-slate-500 px-2 py-1 bg-slate-200 rounded">142 ITEMS</span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Optimal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Watch
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span> Critical
              </span>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 bg-slate-100 px-3 py-2 text-slate-600 font-mono text-[10px] uppercase tracking-wider select-none border-b border-slate-200">
            <div className="col-span-6 flex items-center gap-1.5">WBS Code &amp; Scope Hierarchy</div>
            <div className="col-span-2 text-left">OBS Resp</div>
            <div className="col-span-2 text-left">Schedule Span</div>
            <div className="col-span-2 text-right">Actual / Plan</div>
          </div>

          {/* Tree Rows Container */}
          <div className="flex flex-col text-slate-800 divide-y divide-slate-100 text-xs">
            {/* ROOT NODE: OIL.TRUNK.132 */}
            {!tier2Only && (
              <div
                onClick={() =>
                  setSelectedNode({
                    code: 'OIL.TRUNK.132',
                    title: 'Digboi–Duliajan 132km Crude Trunkline',
                    obs: 'OIL Exec Board',
                    costCode: 'OIL-PRJ-ROOT',
                    contractor: 'Consortium Master',
                    activitiesCount: '142 Activities',
                    evRatio: '₹296.25 Cr / ₹482.50 Cr',
                    spi: '0.95',
                    status: 'OPTIMAL',
                    tier: 1,
                    isCritical: false,
                    span: '01/24 - 11/25',
                    progress: '61.4% / 64.3%',
                    bcws: '₹310.2 Cr',
                    bcwp: '₹296.25 Cr',
                    acwp: '₹302.8 Cr',
                    cpi: '0.98'
                  })
                }
                className="grid grid-cols-12 px-3 py-2 bg-slate-50/70 hover:bg-slate-100 transition-all items-center cursor-pointer"
              >
                <div className="col-span-6 flex items-center gap-2 truncate">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBranch('trunk-all');
                    }}
                    className="w-4 h-4 flex items-center justify-center text-blue-700 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {expandedBranches['trunk-all'] ? 'expand_more' : 'chevron_right'}
                    </span>
                  </button>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span className="font-bold text-blue-700 font-mono">OIL.TRUNK.132</span>
                  <span className="font-semibold truncate text-slate-900">
                    Digboi–Duliajan 132km Crude Trunkline
                  </span>
                </div>
                <div className="col-span-2 truncate text-slate-500 font-mono text-[11px]">OIL Exec Board</div>
                <div className="col-span-2 font-mono text-slate-500 text-[11px]">01/24 - 11/25</div>
                <div className="col-span-2 text-right font-mono font-bold text-blue-700 text-[11px]">
                  61.4% <span className="text-slate-400 font-normal">/ 64.3%</span>
                </div>
              </div>
            )}

            {/* TIER 2: 01 Project Management */}
            {(!tier2Only || true) && (
              <div
                onClick={() =>
                  setSelectedNode({
                    code: 'OIL.TRUNK.01',
                    title: 'Project Mgmt & Statutory Approvals',
                    obs: 'P. Saikia',
                    costCode: 'CC-7701-MGMT',
                    contractor: 'OIL Upstream',
                    activitiesCount: '12 Activities',
                    evRatio: '₹18.4 Cr / ₹18.4 Cr',
                    spi: '1.00',
                    status: 'COMPLETE',
                    tier: 2,
                    isCritical: false,
                    span: '01/24 - 04/24',
                    progress: '100.0% / 100%',
                    bcws: '₹18.4 Cr',
                    bcwp: '₹18.4 Cr',
                    acwp: '₹18.4 Cr',
                    cpi: '1.00'
                  })
                }
                className="grid grid-cols-12 px-3 py-2 hover:bg-slate-50 transition-all items-center cursor-pointer"
              >
                <div className="col-span-6 flex items-center gap-2 pl-4 truncate">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">chevron_right</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span className="font-mono text-slate-600">OIL.TRUNK.01</span>
                  <span className="truncate">Project Mgmt &amp; Statutory Approvals</span>
                </div>
                <div className="col-span-2 truncate text-slate-500 font-mono text-[11px]">P. Saikia</div>
                <div className="col-span-2 font-mono text-slate-500 text-[11px]">01/24 - 04/24</div>
                <div className="col-span-2 text-right font-mono text-emerald-700 font-bold text-[11px]">
                  100.0% <span className="text-slate-400 font-normal">/ 100%</span>
                </div>
              </div>
            )}

            {/* TIER 2: 02 Right-of-Way */}
            <div
              onClick={() =>
                setSelectedNode({
                  code: 'OIL.TRUNK.02',
                  title: 'Right-of-Way (RoW) & Cadastral Acquisition',
                  obs: 'Assam Rev Auth',
                  costCode: 'CC-7702-LAND',
                  contractor: 'Assam Revenue Dept',
                  activitiesCount: '14 Activities',
                  evRatio: '₹34.8 Cr / ₹35.0 Cr',
                  spi: '0.98',
                  status: 'OPTIMAL',
                  tier: 2,
                  isCritical: false,
                  span: '02/24 - 07/24',
                  progress: '98.5% / 100%',
                  bcws: '₹35.0 Cr',
                  bcwp: '₹34.8 Cr',
                  acwp: '₹34.5 Cr',
                  cpi: '1.01'
                })
              }
              className="grid grid-cols-12 px-3 py-2 hover:bg-slate-50 transition-all items-center cursor-pointer"
            >
              <div className="col-span-6 flex items-center gap-2 pl-4 truncate">
                <span className="material-symbols-outlined text-[15px] text-slate-400">chevron_right</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span className="font-mono text-slate-600">OIL.TRUNK.02</span>
                <span className="truncate">Right-of-Way (RoW) &amp; Cadastral Acquisition</span>
              </div>
              <div className="col-span-2 truncate text-slate-500 font-mono text-[11px]">Assam Rev Auth</div>
              <div className="col-span-2 font-mono text-slate-500 text-[11px]">02/24 - 07/24</div>
              <div className="col-span-2 text-right font-mono text-emerald-700 font-bold text-[11px]">
                98.5% <span className="text-slate-400 font-normal">/ 100%</span>
              </div>
            </div>

            {/* TIER 2: 03 Procurement */}
            <div
              onClick={() =>
                setSelectedNode({
                  code: 'OIL.TRUNK.03',
                  title: 'Procurement & API 5L X70 Pipe Logistics',
                  obs: 'Jindal / L&T',
                  costCode: 'CC-7703-PROC',
                  contractor: 'Jindal Saw / Welspun',
                  activitiesCount: '22 Activities',
                  evRatio: '₹142.1 Cr / ₹145.0 Cr',
                  spi: '0.97',
                  status: 'OPTIMAL',
                  tier: 2,
                  isCritical: false,
                  span: '03/24 - 10/24',
                  progress: '92.0% / 94.0%',
                  bcws: '₹145.0 Cr',
                  bcwp: '₹142.1 Cr',
                  acwp: '₹144.2 Cr',
                  cpi: '0.98'
                })
              }
              className="grid grid-cols-12 px-3 py-2 hover:bg-slate-50 transition-all items-center cursor-pointer"
            >
              <div className="col-span-6 flex items-center gap-2 pl-4 truncate">
                <span className="material-symbols-outlined text-[15px] text-slate-400">chevron_right</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span className="font-mono text-slate-600">OIL.TRUNK.03</span>
                <span className="truncate">Procurement &amp; API 5L X70 Pipe Logistics</span>
              </div>
              <div className="col-span-2 truncate text-slate-500 font-mono text-[11px]">Jindal / L&amp;T</div>
              <div className="col-span-2 font-mono text-slate-500 text-[11px]">03/24 - 10/24</div>
              <div className="col-span-2 text-right font-mono text-emerald-700 font-bold text-[11px]">
                92.0% <span className="text-slate-400 font-normal">/ 94.0%</span>
              </div>
            </div>

            {/* TIER 2: 04 Pipeline Construction (EXPANDED CONTAINER) */}
            <div
              onClick={() => {
                setSelectedNode({
                  code: 'OIL.TRUNK.04',
                  title: 'Pipeline Construction & Field Spreads',
                  obs: 'Consortium PM',
                  costCode: 'CC-7704-PIPE',
                  contractor: 'Multi-Contractor Spreads',
                  activitiesCount: '68 Activities',
                  evRatio: '₹188.5 Cr / ₹210.0 Cr',
                  spi: '0.91',
                  status: 'WATCH',
                  tier: 2,
                  isCritical: false,
                  span: '04/24 - 08/25',
                  progress: '54.8% / 60.1%',
                  bcws: '₹210.0 Cr',
                  bcwp: '₹188.5 Cr',
                  acwp: '₹195.2 Cr',
                  cpi: '0.96'
                });
                toggleBranch('trunk-04');
              }}
              className="grid grid-cols-12 px-3 py-2 bg-slate-50/60 hover:bg-slate-100 transition-all items-center cursor-pointer font-semibold"
            >
              <div className="col-span-6 flex items-center gap-2 pl-4 truncate">
                <button type="button" className="w-4 h-4 flex items-center justify-center text-blue-700">
                  <span className="material-symbols-outlined text-[15px]">
                    {expandedBranches['trunk-04'] ? 'expand_more' : 'chevron_right'}
                  </span>
                </button>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="font-mono text-blue-700">OIL.TRUNK.04</span>
                <span className="font-bold truncate text-slate-900">
                  Pipeline Construction &amp; Field Spreads
                </span>
              </div>
              <div className="col-span-2 truncate text-slate-500 font-mono text-[11px]">Consortium PM</div>
              <div className="col-span-2 font-mono text-slate-500 text-[11px]">04/24 - 08/25</div>
              <div className="col-span-2 text-right font-mono font-bold text-rose-700 text-[11px]">
                54.8% <span className="text-slate-400 font-normal">/ 60.1%</span>
              </div>
            </div>

            {/* SPREAD SUB-CONTAINER */}
            {expandedBranches['trunk-04'] && !tier2Only && (
              <>
                {/* Spread 1 */}
                {!criticalOnly && (
                  <div
                    onClick={() =>
                      setSelectedNode({
                        code: 'OIL.TRUNK.04.A',
                        title: 'Spread 1 (Km 0+000 to Km 30+000)',
                        obs: 'Punj Lloyd',
                        costCode: 'CC-7710-SP1',
                        contractor: 'Punj Lloyd Ltd.',
                        activitiesCount: '14 Activities',
                        evRatio: '₹85.0 Cr / ₹86.8 Cr',
                        spi: '1.03',
                        status: 'OPTIMAL',
                        tier: 3,
                        isCritical: false,
                        span: '04/24 - 12/24',
                        progress: '98.0% / 95.0%',
                        bcws: '₹86.8 Cr',
                        bcwp: '₹85.0 Cr',
                        acwp: '₹84.1 Cr',
                        cpi: '1.01'
                      })
                    }
                    className="grid grid-cols-12 px-3 py-2 hover:bg-slate-50 transition-all items-center cursor-pointer"
                  >
                    <div className="col-span-6 flex items-center gap-2 pl-8 truncate">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">chevron_right</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span className="font-mono text-slate-600">OIL.TRUNK.04.A</span>
                      <span className="truncate">Spread 1 (Km 0+000 to Km 30+000)</span>
                    </div>
                    <div className="col-span-2 truncate text-slate-500 font-mono text-[11px]">Punj Lloyd</div>
                    <div className="col-span-2 font-mono text-slate-500 text-[11px]">04/24 - 12/24</div>
                    <div className="col-span-2 text-right font-mono text-emerald-700 font-bold text-[11px]">
                      98.0% <span className="text-slate-400 font-normal">/ 95.0%</span>
                    </div>
                  </div>
                )}

                {/* Spread 2 (Selected Active Node) */}
                <div
                  onClick={() => {
                    setSelectedNode({
                      code: 'OIL.TRUNK.04.B',
                      title: 'Spread 2 (Km 30+000 to Km 65+000)',
                      obs: 'Pranjal Saikia / Shift A',
                      costCode: 'CC-7710-CIVIL',
                      contractor: 'L&T Hydrocarbon Eng.',
                      activitiesCount: '28 Activities',
                      evRatio: '₹68.5 Cr / ₹84.2 Cr',
                      spi: '0.81',
                      status: 'CRITICAL',
                      tier: 3,
                      isCritical: true,
                      span: '05/24 - 03/25',
                      progress: '48.2% / 59.4%',
                      bcws: '₹84.2 Cr',
                      bcwp: '₹68.5 Cr',
                      acwp: '₹71.2 Cr',
                      cpi: '0.96'
                    });
                    toggleBranch('spread-02');
                  }}
                  className={`grid grid-cols-12 px-3 py-2.5 transition-all items-center cursor-pointer shadow-2xs ${
                    selectedNode.code === 'OIL.TRUNK.04.B'
                      ? 'bg-blue-50 border-l-4 border-blue-700'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="col-span-6 flex items-center gap-2 pl-8 truncate">
                    <button type="button" className="w-4 h-4 flex items-center justify-center text-blue-700">
                      <span className="material-symbols-outlined text-[15px]">
                        {expandedBranches['spread-02'] ? 'expand_more' : 'chevron_right'}
                      </span>
                    </button>
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                    <span className="font-mono font-bold text-blue-700">OIL.TRUNK.04.B</span>
                    <span className="font-bold text-slate-900 truncate">Spread 2 (Km 30+000 to Km 65+000)</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[9px] uppercase font-bold">
                      CRIT PATH
                    </span>
                  </div>
                  <div className="col-span-2 truncate font-bold text-blue-700 font-mono text-[11px]">
                    L&amp;T Hydrocarbon
                  </div>
                  <div className="col-span-2 font-mono font-semibold text-rose-700 text-[11px]">05/24 - 03/25</div>
                  <div className="col-span-2 text-right font-mono font-bold text-rose-700 text-[11px]">
                    48.2% <span className="text-slate-400 font-normal">/ 59.4%</span>
                  </div>
                </div>

                {/* Sub-activities of Spread 2 */}
                {expandedBranches['spread-02'] && (
                  <>
                    <div
                      onClick={() =>
                        setSelectedNode({
                          code: 'ACT-TR-4290',
                          title: 'Trenching & Lowering (Hard Rock Km 42+650)',
                          obs: 'Gang 04-B1',
                          costCode: 'CC-7710-ACT1',
                          contractor: 'L&T Hydrocarbon',
                          activitiesCount: 'Terminal Task',
                          evRatio: '₹12.4 Cr / ₹18.0 Cr',
                          spi: '0.68',
                          status: 'CRITICAL',
                          tier: 4,
                          isCritical: true,
                          span: '18d Delay (Hard Rock)',
                          progress: '34.0% / 58.0%',
                          bcws: '₹18.0 Cr',
                          bcwp: '₹12.4 Cr',
                          acwp: '₹14.8 Cr',
                          cpi: '0.84'
                        })
                      }
                      className="grid grid-cols-12 px-3 py-1.5 bg-rose-50/50 hover:bg-rose-50 transition-all items-center cursor-pointer"
                    >
                      <div className="col-span-6 flex items-center gap-2 pl-12 truncate">
                        <span className="material-symbols-outlined text-[14px] text-rose-600">
                          subdirectory_arrow_right
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                        <span className="font-mono text-rose-700 font-bold">ACT-TR-4290</span>
                        <span className="truncate text-slate-800">Trenching &amp; Lowering (Hard Rock Km 42+650)</span>
                      </div>
                      <div className="col-span-2 truncate text-slate-500 font-mono text-[10px]">Gang 04-B1</div>
                      <div className="col-span-2 font-mono text-rose-700 font-semibold text-[10px]">18d Delay</div>
                      <div className="col-span-2 text-right font-mono text-rose-700 font-bold text-[10px]">
                        34.0% <span className="text-slate-400 font-normal">/ 58.0%</span>
                      </div>
                    </div>

                    {!criticalOnly && (
                      <div
                        onClick={() =>
                          setSelectedNode({
                            code: 'ACT-WD-3105',
                            title: 'Automatic Orbital Welding & Ultrasonic NDT',
                            obs: 'Caterpillar / Serimax',
                            costCode: 'CC-7710-ACT2',
                            contractor: 'Serimax Welding',
                            activitiesCount: 'Terminal Task',
                            evRatio: '₹26.2 Cr / ₹28.0 Cr',
                            spi: '0.93',
                            status: 'WATCH',
                            tier: 4,
                            isCritical: false,
                            span: '06/24 - 01/25',
                            progress: '52.4% / 56.0%',
                            bcws: '₹28.0 Cr',
                            bcwp: '₹26.2 Cr',
                            acwp: '₹26.5 Cr',
                            cpi: '0.99'
                          })
                        }
                        className="grid grid-cols-12 px-3 py-1.5 hover:bg-slate-50 transition-all items-center cursor-pointer"
                      >
                        <div className="col-span-6 flex items-center gap-2 pl-12 truncate">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">
                            subdirectory_arrow_right
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span className="font-mono text-slate-600">ACT-WD-3105</span>
                          <span className="truncate text-slate-800">Automatic Orbital Welding &amp; Ultrasonic NDT</span>
                        </div>
                        <div className="col-span-2 truncate text-slate-500 font-mono text-[10px]">Caterpillar / Serimax</div>
                        <div className="col-span-2 font-mono text-slate-500 text-[10px]">06/24 - 01/25</div>
                        <div className="col-span-2 text-right font-mono text-slate-600 font-bold text-[10px]">
                          52.4% <span className="text-slate-400 font-normal">/ 56.0%</span>
                        </div>
                      </div>
                    )}

                    {!criticalOnly && (
                      <div
                        onClick={() =>
                          setSelectedNode({
                            code: 'ACT-HD-1024',
                            title: 'Burhi Dihing River HDD Crossing (1,480m)',
                            obs: 'DrillTech Asia',
                            costCode: 'CC-7710-ACT3',
                            contractor: 'DrillTech Asia',
                            activitiesCount: 'Terminal Task',
                            evRatio: '₹30.0 Cr / ₹29.2 Cr',
                            spi: '1.04',
                            status: 'OPTIMAL',
                            tier: 4,
                            isCritical: false,
                            span: '07/24 - 12/24',
                            progress: '68.0% / 65.0%',
                            bcws: '₹29.2 Cr',
                            bcwp: '₹30.0 Cr',
                            acwp: '₹29.5 Cr',
                            cpi: '1.02'
                          })
                        }
                        className="grid grid-cols-12 px-3 py-1.5 hover:bg-slate-50 transition-all items-center cursor-pointer"
                      >
                        <div className="col-span-6 flex items-center gap-2 pl-12 truncate">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">
                            subdirectory_arrow_right
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          <span className="font-mono text-slate-600">ACT-HD-1024</span>
                          <span className="truncate text-slate-800">Burhi Dihing River HDD Crossing (1,480m)</span>
                        </div>
                        <div className="col-span-2 truncate text-slate-500 font-mono text-[10px]">DrillTech Asia</div>
                        <div className="col-span-2 font-mono text-slate-500 text-[10px]">07/24 - 12/24</div>
                        <div className="col-span-2 text-right font-mono text-emerald-700 font-bold text-[10px]">
                          68.0% <span className="text-slate-400 font-normal">/ 65.0%</span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Spread 3 */}
                {!criticalOnly && (
                  <div className="grid grid-cols-12 px-3 py-2 hover:bg-slate-50 transition-all items-center cursor-pointer">
                    <div className="col-span-6 flex items-center gap-2 pl-8 truncate">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">chevron_right</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span className="font-mono text-slate-600">OIL.TRUNK.04.C</span>
                      <span className="truncate">Spread 3 (Km 65+000 to Km 100+000)</span>
                    </div>
                    <div className="col-span-2 truncate text-slate-500 font-mono text-[11px]">Kalpataru Power</div>
                    <div className="col-span-2 font-mono text-slate-500 text-[11px]">06/24 - 05/25</div>
                    <div className="col-span-2 text-right font-mono text-slate-600 font-bold text-[11px]">
                      65.0% <span className="text-slate-400 font-normal">/ 68.0%</span>
                    </div>
                  </div>
                )}

                {/* Spread 4 */}
                {!criticalOnly && (
                  <div className="grid grid-cols-12 px-3 py-2 hover:bg-slate-50 transition-all items-center cursor-pointer">
                    <div className="col-span-6 flex items-center gap-2 pl-8 truncate">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">chevron_right</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span className="font-mono text-slate-600">OIL.TRUNK.04.D</span>
                      <span className="truncate">Spread 4 (Km 100+000 to Km 132+000)</span>
                    </div>
                    <div className="col-span-2 truncate text-slate-500 font-mono text-[11px]">L&amp;T Hydrocarbon</div>
                    <div className="col-span-2 font-mono text-slate-500 text-[11px]">07/24 - 06/25</div>
                    <div className="col-span-2 text-right font-mono text-emerald-700 font-bold text-[11px]">
                      79.0% <span className="text-slate-400 font-normal">/ 74.5%</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footnote */}
          <div className="p-2.5 bg-slate-50 flex items-center justify-between text-slate-500 font-mono text-[10px] border-t border-slate-200">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-blue-700">info</span>
              Nodes tagged with Critical Path propagate earned value variances to master milestone gate MS-09 (Hydrotest Ready).
            </span>
            <span>LAST RUN: 14m AGO // ENGINE: ORACLE CPM-64</span>
          </div>
        </div>

        {/* RIGHT COLUMN: WBS DICTIONARY INSPECTOR & DONUT (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          {/* Primary Node Inspector */}
          <div className="bg-white rounded-lg shadow-xs overflow-hidden flex flex-col border border-slate-200">
            {/* Title Bar */}
            <div className="p-3 bg-slate-50 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-blue-700">developer_board</span>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                    WBS Dictionary Inspector
                  </span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{selectedNode.code}</span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                  selectedNode.status === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800'
                    : selectedNode.status === 'WATCH'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {selectedNode.status === 'CRITICAL' ? 'SLIP WARN' : selectedNode.status}
              </span>
            </div>

            <div className="p-3.5 flex flex-col gap-3.5">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">{selectedNode.title}</span>
                <span className="text-xs text-slate-500">
                  Digboi Foothills Segment, Upper Dihing Basin Crossing
                </span>
              </div>

              {/* Technical Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded font-mono text-[11px]">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px]">OBS RESPONSIBLE</span>
                  <span className="font-bold text-slate-900 truncate">{selectedNode.obs}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px]">CONTRACTOR</span>
                  <span className="font-bold text-blue-700 truncate">{selectedNode.contractor}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px]">COST CODE</span>
                  <span className="text-slate-900">{selectedNode.costCode}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px]">P6 ACTIVITIES</span>
                  <span className="font-bold text-slate-900">{selectedNode.activitiesCount}</span>
                </div>
              </div>

              {/* Earned Value Specs Box */}
              <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded border border-blue-100">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-slate-900 uppercase">Earned Value Metrics</span>
                  <span className="text-blue-700 font-bold">
                    {selectedNode.isCritical ? 'CRITICAL NODE' : 'STANDARD'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                  <div className="p-1.5 bg-white rounded flex flex-col border border-slate-200">
                    <span className="text-[10px] text-slate-500">BCWS (Plan)</span>
                    <span className="text-xs font-bold text-slate-900">{selectedNode.bcws}</span>
                  </div>
                  <div className="p-1.5 bg-white rounded flex flex-col border border-slate-200">
                    <span className="text-[10px] text-slate-500">BCWP (Earned)</span>
                    <span className="text-xs font-bold text-rose-700">{selectedNode.bcwp}</span>
                  </div>
                  <div className="p-1.5 bg-white rounded flex flex-col border border-slate-200">
                    <span className="text-[10px] text-slate-500">ACWP (Actual)</span>
                    <span className="text-xs font-bold text-slate-900">{selectedNode.acwp}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] pt-1">
                  <span className="text-slate-500">
                    SPI: <strong className="text-rose-700">{selectedNode.spi}</strong>
                  </span>
                  <span className="text-slate-500">
                    CPI: <strong className="text-slate-900">{selectedNode.cpi}</strong>
                  </span>
                </div>
              </div>

              {/* Field Ground Truth Telemetry with Photo */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&q=80&w=200"
                    alt="Spread 2 Corridor Orthomosaic Scan"
                    className="w-12 h-10 rounded object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                  <div className="flex flex-col text-xs">
                    <span className="font-bold text-slate-900">AI Field Confidence</span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      42 UAV LiDAR ortho-scans &amp; 128 field DPRs
                    </span>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-blue-700 shrink-0">97.4%</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('WHAT_IF')}
                  className="w-full py-2 px-3 rounded bg-blue-700 text-white hover:bg-blue-800 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">timeline</span>
                  Simulate Float Impact on Completion Date
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => alert(`Node ${selectedNode.code} re-baselined with current EPPM data.`)}
                    className="py-1.5 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs flex items-center justify-center gap-1 cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-[14px]">tune</span>
                    Re-baseline Node
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('AUDIT_TRAIL')}
                    className="py-1.5 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs flex items-center justify-center gap-1 cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-[14px]">history_edu</span>
                    Audit Ledger Proof
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scope Capex Distribution Donut */}
          <div className="bg-white p-3.5 rounded-lg shadow-xs flex flex-col gap-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-700">pie_chart</span>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-900">
                  Capex BAC Scope Weight
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">TOTAL: ₹482.5 Cr</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Donut Chart */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 -rotate-90 overflow-visible" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.5"
                  ></path>
                  {/* Spread 1: 18% */}
                  <path
                    className="text-slate-500 hover:opacity-80 cursor-pointer transition-all"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="18, 100"
                    strokeDashoffset="0"
                    strokeWidth="4.5"
                    onMouseEnter={() => setDonutCenter({ percent: '18%', label: 'SP-01', color: '#565e74' })}
                  ></path>
                  {/* Spread 2: 24% (Critical) */}
                  <path
                    className="text-rose-600 hover:opacity-80 cursor-pointer transition-all"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="24, 100"
                    strokeDashoffset="-18"
                    strokeWidth="4.5"
                    onMouseEnter={() => setDonutCenter({ percent: '24%', label: 'SP-02', color: '#8f000b' })}
                  ></path>
                  {/* Spread 3: 20% */}
                  <path
                    className="text-blue-700 hover:opacity-80 cursor-pointer transition-all"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-42"
                    strokeWidth="4.5"
                    onMouseEnter={() => setDonutCenter({ percent: '20%', label: 'SP-03', color: '#0037b0' })}
                  ></path>
                  {/* Spread 4: 18% */}
                  <path
                    className="text-blue-500 hover:opacity-80 cursor-pointer transition-all"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="18, 100"
                    strokeDashoffset="-62"
                    strokeWidth="4.5"
                    onMouseEnter={() => setDonutCenter({ percent: '18%', label: 'SP-04', color: '#2151da' })}
                  ></path>
                  {/* PM & Hydrotest: 20% */}
                  <path
                    className="text-slate-400 hover:opacity-80 cursor-pointer transition-all"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-80"
                    strokeWidth="4.5"
                    onMouseEnter={() => setDonutCenter({ percent: '20%', label: 'PM/HT', color: '#747686' })}
                  ></path>
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-xs font-bold text-slate-900 font-mono">{donutCenter.percent}</span>
                  <span className="font-mono text-[9px] uppercase leading-none font-bold" style={{ color: donutCenter.color }}>
                    {donutCenter.label}
                  </span>
                </div>
              </div>

              {/* Legend details */}
              <div className="flex flex-col gap-1 w-full font-mono text-[10px]">
                <div className="flex items-center justify-between p-0.5 rounded hover:bg-slate-50 cursor-pointer">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded bg-rose-600"></span> Spread 2 (Critical)
                  </span>
                  <span className="font-bold text-rose-700">₹115.8 Cr</span>
                </div>
                <div className="flex items-center justify-between p-0.5 rounded hover:bg-slate-50 cursor-pointer">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded bg-blue-700"></span> Spread 3
                  </span>
                  <span className="text-slate-900">₹96.5 Cr</span>
                </div>
                <div className="flex items-center justify-between p-0.5 rounded hover:bg-slate-50 cursor-pointer">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded bg-slate-500"></span> Spread 1
                  </span>
                  <span className="text-slate-900">₹86.8 Cr</span>
                </div>
                <div className="flex items-center justify-between p-0.5 rounded hover:bg-slate-50 cursor-pointer">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded bg-blue-500"></span> Spread 4
                  </span>
                  <span className="text-slate-900">₹86.8 Cr</span>
                </div>
                <div className="flex items-center justify-between p-0.5 rounded hover:bg-slate-50 cursor-pointer">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded bg-slate-400"></span> PM &amp; Hydrotest
                  </span>
                  <span className="text-slate-900">₹96.6 Cr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM BAR: SPREAD LINEAR PROGRESSION PROFILE */}
      <section className="bg-white p-3.5 rounded-lg shadow-xs flex flex-col gap-3 border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-blue-700">linear_scale</span>
            <span className="font-mono text-[10px] font-bold uppercase text-slate-900 tracking-wider">
              Spread Linear Progression Profile (Km 0+000 to Km 132+000)
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] text-slate-500">
            <span>CURRENT PIPELINE WELD LENGTH: 86.4 KM</span>
            <span>•</span>
            <span className="text-rose-700 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
              1 ACTIVE IMPEDIMENT IN SPREAD 2
            </span>
          </div>
        </div>

        {/* Segmented Linear Bar Representation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Spread 1 */}
          <div className="flex flex-col gap-1 p-2 bg-slate-50 rounded border border-slate-200 hover:bg-blue-50/50 cursor-pointer">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="font-bold text-slate-900">SP1 (Km 0 - 30)</span>
              <span className="text-emerald-700 font-bold">98% COMPLETED</span>
            </div>
            <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded" style={{ width: '98%' }}></div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Digboi Terminal to Margherita</span>
          </div>

          {/* Spread 2 */}
          <div className="flex flex-col gap-1 p-2 bg-rose-50/60 rounded border border-rose-200 cursor-pointer">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="font-bold text-rose-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                SP2 (Km 30 - 65)
              </span>
              <span className="text-rose-700 font-bold">48% [WARNING]</span>
            </div>
            <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
              <div className="h-full bg-rose-600 rounded" style={{ width: '48%' }}></div>
            </div>
            <span className="text-[10px] text-rose-700 font-mono font-semibold">Trench Blasting Km 42.6</span>
          </div>

          {/* Spread 3 */}
          <div className="flex flex-col gap-1 p-2 bg-slate-50 rounded border border-slate-200 hover:bg-blue-50/50 cursor-pointer">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="font-bold text-slate-900">SP3 (Km 65 - 100)</span>
              <span className="text-blue-700 font-bold">65% ACTIVE</span>
            </div>
            <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
              <div className="h-full bg-blue-700 rounded" style={{ width: '65%' }}></div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Tinkhong Crossing Spreads</span>
          </div>

          {/* Spread 4 */}
          <div className="flex flex-col gap-1 p-2 bg-slate-50 rounded border border-slate-200 hover:bg-blue-50/50 cursor-pointer">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="font-bold text-slate-900">SP4 (Km 100 - 132)</span>
              <span className="text-blue-700 font-bold">79% ACTIVE</span>
            </div>
            <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
              <div className="h-full bg-blue-700 rounded" style={{ width: '79%' }}></div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Refinery Terminal Tie-In</span>
          </div>
        </div>
      </section>
    </div>
  );
};
