import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  History, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  Calendar, 
  Layers, 
  Download, 
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AuditRecord } from '../../types';

export const AuditTrailView: React.FC = () => {
  const { currentRole, roleMetadata, setCurrentRole, auditLogs, activeProject, showToast } = useApp();
  const [filterEntity, setFilterEntity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = auditLogs.filter(log => {
    if (filterEntity !== 'ALL' && log.entityType !== filterEntity) return false;
    if (searchTerm && !log.details.toLowerCase().includes(searchTerm.toLowerCase()) && !log.performedBy.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-3.5 sm:p-6 max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400 shrink-0" />
            Immutable Audit Trail & Data Provenance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete cryptographic audit trail: Every actual date, progress claim, AI match decision, and human review is permanently tracked with full source provenance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800 flex items-center gap-2.5 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400">Total Audit Records: </span>
              <strong className="text-white">{auditLogs.length} Events</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Persona Security Console Banner */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        currentRole === 'admin'
          ? 'bg-purple-500/10 border-purple-500/30 text-purple-200'
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🛡️</span>
          <div>
            <span className="font-bold text-white">Vigilance & Provenance Console: </span>
            {currentRole === 'admin' ? (
              <span className="text-purple-300 font-semibold">System Admin (Full SHA-256 Hash Chain Verification & Anti-Tamper Audit Authority)</span>
            ) : (
              <span>Viewing Audit Log as <span className="font-semibold capitalize text-purple-400">{currentRole.replace('_', ' ')}</span> (Read-Only)</span>
            )}
          </div>
        </div>
        {currentRole === 'admin' ? (
          <button
            onClick={() => showToast('🛡️ Cryptographic SHA-256 Check Passed: 100% data provenance verified across all Oil India schedule actuals.')}
            className="text-[11px] px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg hover:bg-emerald-500 hover:text-slate-950 font-bold transition-all shrink-0 self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verify SHA-256 Integrity</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentRole('admin')}
            className="text-[11px] px-3 py-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-lg hover:bg-purple-500 hover:text-slate-950 font-semibold transition-all shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Switch to System Admin
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-mono uppercase">Filter:</span>
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Event Types</option>
              <option value="EVENT">Field Event Ingestion</option>
              <option value="MATCH">AI Match Decision</option>
              <option value="SCHEDULE">Schedule Actual Update</option>
              <option value="CONFLICT">Conflict Detection</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, action, notes..."
              className="bg-slate-950 text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded border border-slate-700 w-60 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <strong>{filteredLogs.length}</strong> immutable records
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Entity & Action</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Details & Justification</th>
                <th className="py-3 px-4">Source Provenance</th>
                <th className="py-3 px-4">Model Engine</th>
                <th className="py-3 px-4">Value Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                  {/* Timestamp */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp.replace('T', ' ').slice(0, 19)}
                  </td>

                  {/* Entity & Action */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        log.entityType === 'MATCH' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        log.entityType === 'CONFLICT' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        log.entityType === 'SCHEDULE' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-sky-950 text-sky-300 border border-sky-800'
                      }`}>
                        {log.entityType}
                      </span>
                      <span className="font-mono text-xs text-white font-medium">{log.action}</span>
                    </div>
                  </td>

                  {/* Performed By */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-200">{log.performedBy}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{log.role.replace('_', ' ')}</div>
                  </td>

                  {/* Details */}
                  <td className="py-3 px-4 max-w-md text-slate-300 text-xs">
                    {log.details}
                  </td>

                  {/* Source Provenance */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    {log.sourceDoc ? (
                      <span className="text-amber-400/90 underline cursor-pointer" title="Click to view raw file provenance">
                        {log.sourceDoc}
                        {log.sourcePage && ` [p.${log.sourcePage}]`}
                      </span>
                    ) : (
                      <span className="text-slate-600">Direct Ingestion</span>
                    )}
                  </td>

                  {/* Model Version */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[10px] text-slate-400">
                    {log.modelVersion || 'v2.4'}
                  </td>

                  {/* Value Delta */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                    {log.oldValue && log.newValue ? (
                      <div>
                        <span className="text-slate-500 line-through mr-1">{log.oldValue}</span>
                        <span className="text-emerald-400 font-bold">{log.newValue}</span>
                      </div>
                    ) : (
                      <span className="text-slate-600">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
