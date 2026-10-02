import React, { useState } from 'react';
import { ScheduleActivity } from '../../../types';
import { parseScheduleCSV, SAMPLE_P6_SCHEDULE_CSV } from '../../../services/level1Engine';

interface P6ScheduleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (activities: ScheduleActivity[]) => void;
}

export const P6ScheduleImportModal: React.FC<P6ScheduleImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [csvContent, setCsvContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedActivities, setParsedActivities] = useState<ScheduleActivity[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcessText = (text: string, name?: string) => {
    setCsvContent(text);
    if (name) setFileName(name);
    try {
      const result = parseScheduleCSV(text);
      if (result.activities.length === 0) {
        setErrorMsg('No valid activities detected. Please check CSV column headers.');
        setParsedActivities([]);
      } else {
        setErrorMsg(null);
        setParsedActivities(result.activities);
      }
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to parse schedule file.');
      setParsedActivities([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleProcessText(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    handleProcessText(SAMPLE_P6_SCHEDULE_CSV, 'SAMPLE_P6_OIL_TRUNK_2026.csv');
  };

  const handleConfirmImport = () => {
    if (parsedActivities.length === 0) return;
    onImport(parsedActivities);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-300 max-w-4xl w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center text-white shadow-2xs">
              <span className="material-symbols-outlined text-[19px]">upload_file</span>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Import Schedule (Primavera P6 / MS Project CSV)</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                  LEVEL 1 • FEATURE 5
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Parse real baseline schedules, activities, dates, durations, and critical path linkages.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Sample Button & File Upload */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase font-bold text-slate-500">
              Upload Schedule Export (.csv, .xer text, .txt)
            </label>
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 p-4 rounded-xl flex items-center justify-center gap-3 cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition-all">
              <span className="material-symbols-outlined text-[24px] text-blue-700">cloud_upload</span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800">
                  {fileName ? `Loaded: ${fileName}` : 'Drop or browse schedule CSV export'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Supports Primavera P6 EPPM &amp; MS Project standard CSV exports
                </span>
              </div>
              <input
                type="file"
                accept=".csv,.txt,.tsv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="md:col-span-4 flex flex-col justify-end gap-2">
            <label className="font-mono text-[10px] uppercase font-bold text-slate-500">
              One-Click Evaluation Preset
            </label>
            <button
              type="button"
              onClick={handleLoadSample}
              className="py-3 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-blue-700">folder_open</span>
              <span>Load Sample P6 Baseline</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-mono text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedActivities.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-slate-900">
                Parsed Schedule Baseline ({parsedActivities.length} Activities)
              </span>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  {parsedActivities.length} Valid Leaf Nodes
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-bold border border-rose-200">
                  {parsedActivities.filter(a => a.isCriticalPath || a.isCritical).length} Critical Path
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 border-b border-slate-200 text-[10px] text-slate-600 uppercase font-bold sticky top-0">
                  <tr>
                    <th className="p-2.5">Activity Code</th>
                    <th className="p-2.5">Activity Name</th>
                    <th className="p-2.5">WBS Code</th>
                    <th className="p-2.5">Start</th>
                    <th className="p-2.5">Finish</th>
                    <th className="p-2.5 text-center">Critical</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 font-bold text-blue-700">{act.activityCode}</td>
                      <td className="p-2.5 text-slate-900 font-sans font-medium">{act.name}</td>
                      <td className="p-2.5 text-slate-500 text-[11px]">{act.wbsCode || act.wbsId}</td>
                      <td className="p-2.5 text-slate-600 text-[11px]">{act.plannedStart}</td>
                      <td className="p-2.5 text-slate-600 text-[11px]">{act.plannedFinish}</td>
                      <td className="p-2.5 text-center">
                        {act.isCriticalPath || act.isCritical ? (
                          <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">
                            YES
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">NO</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={parsedActivities.length === 0}
            onClick={handleConfirmImport}
            className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">file_download_done</span>
            <span>Import &amp; Apply Schedule ({parsedActivities.length} Activities)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
