import React, { useState, useEffect } from 'react';
import { useApp } from '../../services/store';
import { 
  Mic, 
  Square, 
  UploadCloud, 
  Camera, 
  Send, 
  FileText, 
  Sparkles, 
  Check, 
  Clock, 
  AlertCircle,
  WifiOff,
  Layers,
  RefreshCw,
  Eye
} from 'lucide-react';

export const FieldInputCenter: React.FC = () => {
  const { submitFieldInput, isOnline, offlineQueue, syncOfflineQueue, setActiveTab } = useApp();

  const [activeMode, setActiveMode] = useState<'VOICE' | 'TEXT' | 'DPR' | 'PHOTO'>('VOICE');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<any>(null);
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);

  // Timer for voice recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartVoice = () => {
    setIsRecording(true);
    setTextInput('');
    setExtractedPreview(null);
  };

  const handleStopVoice = (presetText?: string) => {
    setIsRecording(false);
    const transcript = presetText || textInput || '12 inch spool erected near compressor section today. Around 18 meters completed between 9:00 AM and 4:30 PM.';
    setTextInput(transcript);
  };

  const handleSubmit = async () => {
    if (!textInput.trim()) return;
    setIsProcessing(true);

    try {
      await submitFieldInput(
        textInput, 
        activeMode === 'VOICE' ? 'VOICE' : activeMode === 'DPR' ? 'DPR' : activeMode === 'PHOTO' ? 'PHOTO' : 'TEXT',
        attachedPhoto || undefined
      );
      setTextInput('');
      setAttachedPhoto(null);
      setExtractedPreview(null);
      // Direct user to Review Center to see the candidate match
      setTimeout(() => {
        setActiveTab('REVIEW_CENTER');
      }, 1200);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Mic className="w-5 h-5 text-amber-400" />
            Field Input Center & Voice Time Agent
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero-friction site reporting for supervisors: Speak, type, or upload DPRs to automatically link physical execution to schedule nodes.
          </p>
        </div>

        {/* Offline Queue Badge */}
        {!isOnline && (
          <div className="flex items-center gap-2 bg-rose-950/70 border border-rose-600/50 px-3 py-1.5 rounded-lg text-rose-300 text-xs font-semibold">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>Offline Mode Active ({offlineQueue.length} queued)</span>
          </div>
        )}
      </div>

      {/* Input Channel Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveMode('VOICE')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
            activeMode === 'VOICE'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Voice Time Agent</span>
        </button>

        <button
          onClick={() => setActiveMode('TEXT')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
            activeMode === 'TEXT'
              ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Quick Text Report</span>
        </button>

        <button
          onClick={() => setActiveMode('DPR')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
            activeMode === 'DPR'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>DPR / File Ingestion</span>
        </button>

        <button
          onClick={() => setActiveMode('PHOTO')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
            activeMode === 'PHOTO'
              ? 'bg-slate-900 text-purple-400 border-t-2 border-purple-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Photo Evidence</span>
        </button>
      </div>

      {/* Main Mode Workspace */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm space-y-6">
        {/* VOICE MODE */}
        {activeMode === 'VOICE' && (
          <div className="space-y-6">
            <div className="text-center py-6 bg-slate-950 rounded-xl border border-slate-800/80 relative overflow-hidden">
              {/* Simulated Audio Waveform when recording */}
              {isRecording ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-1.5 h-16">
                    {[35, 60, 90, 45, 80, 100, 70, 50, 85, 95, 40, 65, 80, 55, 30].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
                      />
                    ))}
                  </div>
                  <div className="text-rose-400 font-mono text-sm font-semibold flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    Recording in progress... 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                  </div>
                  <button
                    onClick={() => handleStopVoice()}
                    className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Recording & Transcribe</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                    <Mic className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Tap to Speak Site Progress</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      "Line 24 spool erection completed at compressor area. 18 meters completed today."
                    </p>
                  </div>
                  <button
                    onClick={handleStartVoice}
                    className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Voice Recording</span>
                  </button>
                </div>
              )}

              {/* Quick Preset Samples for Hackathon Demo */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 px-4">
                <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2 font-semibold">
                  Or Test Preset Supervisor Field Voice Samples:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleStopVoice('12 inch spool erected near compressor section today. Around 18 meters completed between 9:00 AM and 4:30 PM.')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 transition-colors text-left"
                  >
                    🎙️ Piping: "12 inch spool erected near compressor..."
                  </button>
                  <button
                    onClick={() => handleStopVoice('Electrical cable tray installation in unit two started this morning. 30 meters fixed before rain stoppage.')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 transition-colors text-left"
                  >
                    🎙️ Electrical: "Unit 2 cable tray installation started..."
                  </button>
                  <button
                    onClick={() => handleStopVoice('Concrete pouring for foundation F-102 completed at 17:00. Batching plant delivered 75 m3 grade M35 concrete.')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 transition-colors text-left"
                  >
                    🎙️ Civil: "Foundation F-102 poured 75 m3..."
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DPR / FILE MODE */}
        {activeMode === 'DPR' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-8 text-center bg-slate-950/60 transition-colors cursor-pointer">
              <UploadCloud className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">Upload Daily Progress Report (DPR) or Site Diary</div>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT, Scanned TIFF, and Excel (.xlsx, .csv)</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setTextInput('DPR Ref OIL-DPR-2026-09-28:\n1. Area 04 GCU: Foundation F-102 concreting finished at 17:00 hrs. 75 m3 poured.\n2. Piping Area 04: 12-inch suction line spool erection ongoing. 18m erected today.\n3. Electrical: Trench cable tray mounting held due to afternoon monsoon precipitation.')}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono border border-slate-700"
                >
                  Load Sample DPR (OIL-DPR-28Sep.pdf)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHOTO MODE */}
        {activeMode === 'PHOTO' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-xl p-6 text-center bg-slate-950/60 transition-colors">
              <Camera className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">Attach Site Construction Photograph</div>
              <p className="text-xs text-slate-400 mt-1">Supporting visual provenance for civil foundations, spools, and electrical trays.</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAttachedPhoto('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80');
                    setTextInput('12 inch spool erected near compressor section. Flange bolts tightened and aligned to plinth.');
                  }}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-mono border border-slate-700"
                >
                  Attach Sample Photo (Area 04 Spool Erection)
                </button>
              </div>
            </div>

            {attachedPhoto && (
              <div className="p-3 bg-slate-950 rounded-lg border border-purple-500/30 flex items-center gap-4">
                <img src={attachedPhoto} alt="Site" className="w-20 h-20 object-cover rounded-lg border border-slate-800" />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    AI Computer Vision Hint (Advisory Only)
                  </div>
                  <p className="text-slate-300">
                    Detected: Process piping assembly, high-pressure flange, industrial scaffolding.
                  </p>
                  <p className="text-[10px] text-amber-400">
                    Human verification required before schedule commitment.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Text Transcript / Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase font-semibold">Report Content / Transcript</span>
            <span className="text-[11px]">{textInput.length} characters</span>
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Describe site execution event in natural words, e.g.: 'Line 24 12-inch spool erection completed at compressor area. 18 meters completed today.'"
            rows={3}
            className="w-full bg-slate-950 text-slate-100 p-3 rounded-lg border border-slate-700 focus:border-amber-400 focus:outline-none text-xs font-sans leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI will extract structured event and propose Top-3 L5/L6 matches</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!textInput.trim() || isProcessing}
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extracting & Matching...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit & Run AI Matching</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Offline Queue Inspector if any items */}
      {offlineQueue.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-rose-400" />
              Offline Supervisor Queue ({offlineQueue.length} items)
            </h3>
            {isOnline && (
              <button
                onClick={syncOfflineQueue}
                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Sync All Now
              </button>
            )}
          </div>
          <div className="space-y-2">
            {offlineQueue.map(item => (
              <div key={item.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-medium text-slate-200">{item.rawText}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Source: {item.sourceType} • {item.reportedDate}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
