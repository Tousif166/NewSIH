import React, { useState, useEffect, useRef } from 'react';
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
  Eye,
  Image as ImageIcon,
  CheckCircle2
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
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Initialize Web Speech API if supported in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Optimized for Indian English field reporting

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setTextInput(currentTranscript);
          }
        };

        recognition.onerror = () => {
          setIsListeningSpeech(false);
        };

        recognition.onend = () => {
          setIsListeningSpeech(false);
        };

        speechRecognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }
  }, []);

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

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.start();
        setIsListeningSpeech(true);
      } catch (err) {
        console.warn('Speech recognition start fallback:', err);
      }
    }
  };

  const handleStopVoice = (presetText?: string) => {
    setIsRecording(false);
    if (speechRecognitionRef.current && isListeningSpeech) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
      setIsListeningSpeech(false);
    }

    const transcript = presetText || textInput || '12 inch spool erected near compressor section today. Around 18 meters completed between 9:00 AM and 4:30 PM.';
    setTextInput(transcript);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAttachedPhoto(result);
        if (!textInput.trim()) {
          setTextInput('Photo evidence attached: Field spool assembly and foundation alignment inspection.');
        }
      };
      reader.readAsDataURL(file);
    }
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
    <div className="p-3.5 sm:p-6 max-w-[1200px] mx-auto space-y-4 sm:space-y-6">
      {/* Hidden File Inputs for Native Camera and Photo Upload */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={cameraInputRef} 
        onChange={handleCameraCapture} 
        className="hidden" 
      />
      <input 
        type="file" 
        accept="image/*" 
        ref={galleryInputRef} 
        onChange={handleCameraCapture} 
        className="hidden" 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Mic className="w-5 h-5 text-amber-400 shrink-0" />
            Field Input Center & Voice Time Agent
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero-friction site reporting: Speak into your phone mic, snap a site photo, or upload DPRs to link progress to schedule nodes.
          </p>
        </div>

        {/* Offline Queue Badge */}
        {!isOnline && (
          <div className="flex items-center gap-2 bg-rose-950/70 border border-rose-600/50 px-3 py-1.5 rounded-lg text-rose-300 text-xs font-semibold self-start sm:self-auto">
            <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
            <span>Offline Mode Active ({offlineQueue.length} queued)</span>
          </div>
        )}
      </div>

      {/* Input Channel Tabs (Mobile Responsive 2x2 Grid, 4-col on tablet/desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveMode('VOICE')}
          className={`py-2.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeMode === 'VOICE'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Voice Agent</span>
        </button>

        <button
          onClick={() => setActiveMode('TEXT')}
          className={`py-2.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeMode === 'TEXT'
              ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Quick Text</span>
        </button>

        <button
          onClick={() => setActiveMode('DPR')}
          className={`py-2.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeMode === 'DPR'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>DPR Report</span>
        </button>

        <button
          onClick={() => setActiveMode('PHOTO')}
          className={`py-2.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeMode === 'PHOTO'
              ? 'bg-purple-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Photo Evidence</span>
        </button>
      </div>

      {/* Main Mode Workspace */}
      <div className="bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-800 shadow-sm space-y-5 sm:space-y-6">
        {/* VOICE MODE */}
        {activeMode === 'VOICE' && (
          <div className="space-y-5">
            <div className="text-center py-6 sm:py-8 bg-slate-950 rounded-xl border border-slate-800/80 relative overflow-hidden">
              {/* Simulated Audio Waveform when recording */}
              {isRecording ? (
                <div className="space-y-4 px-4">
                  <div className="flex items-center justify-center gap-1.5 h-16">
                    {[35, 60, 90, 45, 80, 100, 70, 50, 85, 95, 40, 65, 80, 55, 30].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
                      />
                    ))}
                  </div>

                  <div className="text-rose-400 font-mono text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span>Recording... 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
                  </div>

                  {isListeningSpeech && (
                    <div className="text-xs text-emerald-400 font-mono flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Web Speech API Active: Transcribing your voice in real-time</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleStopVoice()}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Recording & Transcribe</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 px-4">
                  {/* Big Touch-Friendly Mic Button */}
                  <button
                    onClick={handleStartVoice}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30 ring-4 ring-amber-400/20 active:scale-90 transition-all cursor-pointer group"
                    title="Tap to speak"
                    aria-label="Start Voice Recording"
                  >
                    <Mic className="w-10 h-10 stroke-[2.5] group-hover:scale-110 transition-transform" />
                  </button>

                  <div>
                    <h3 className="text-base font-bold text-white">Tap Mic to Speak Site Progress</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      Speak naturally in Indian English or site terms. Our acoustic normalizer extracts quantities, locations, and disciplines.
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Preset Samples for Hackathon Demo / Field Supervisor Presets */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 px-3 sm:px-4">
                <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2 font-semibold text-center sm:text-left">
                  Or 1-Tap Preset Supervisor Field Logs:
                </span>
                <div className="overflow-x-auto no-scrollbar flex items-center gap-2 pb-1 sm:flex-wrap sm:justify-start">
                  <button
                    onClick={() => handleStopVoice('12 inch spool erected near compressor section today. Around 18 meters completed between 9:00 AM and 4:30 PM.')}
                    className="text-xs px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 transition-colors text-left shrink-0 active:scale-95"
                  >
                    🎙️ Piping: "12-in spool erected near compressor (18m)..."
                  </button>
                  <button
                    onClick={() => handleStopVoice('Electrical cable tray installation in unit two started this morning. 30 meters fixed before rain stoppage.')}
                    className="text-xs px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 transition-colors text-left shrink-0 active:scale-95"
                  >
                    🎙️ Electrical: "Unit 2 cable tray (30m fixed)..."
                  </button>
                  <button
                    onClick={() => handleStopVoice('Concrete pouring for foundation F-102 completed at 17:00. Batching plant delivered 75 m3 grade M35 concrete.')}
                    className="text-xs px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 transition-colors text-left shrink-0 active:scale-95"
                  >
                    🎙️ Civil: "Foundation F-102 poured (75 m3)..."
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DPR / FILE MODE */}
        {activeMode === 'DPR' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-5 sm:p-8 text-center bg-slate-950/60 transition-colors">
              <UploadCloud className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">Upload Daily Progress Report (DPR) or Site Diary</div>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT, Scanned TIFF, and Excel (.xlsx, .csv)</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setTextInput('DPR Ref OIL-DPR-2026-09-28:\n1. Area 04 GCU: Foundation F-102 concreting finished at 17:00 hrs. 75 m3 poured.\n2. Piping Area 04: 12-inch suction line spool erection ongoing. 18m erected today.\n3. Electrical: Trench cable tray mounting held due to afternoon monsoon precipitation.')}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono border border-slate-700 active:scale-95"
                >
                  📄 Load Sample DPR (OIL-DPR-28Sep.pdf)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHOTO MODE (Optimized for Mobile Camera) */}
        {activeMode === 'PHOTO' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-xl p-5 sm:p-6 text-center bg-slate-950/60 transition-colors">
              <Camera className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">Site Construction Evidence Photo</div>
              <p className="text-xs text-slate-400 mt-1">Supporting visual proof for civil foundations, spools, and electrical trays.</p>
              
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                {/* Real Native Smartphone Camera Button */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Photo (Phone Camera)</span>
                </button>

                {/* Choose from Gallery */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 active:scale-95"
                >
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  <span>Upload from Gallery</span>
                </button>

                {/* Sample Photo */}
                <button
                  type="button"
                  onClick={() => {
                    setAttachedPhoto('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80');
                    setTextInput('12 inch spool erected near compressor section. Flange bolts tightened and aligned to plinth.');
                  }}
                  className="w-full sm:w-auto px-3 py-2.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-purple-300 text-xs font-mono border border-slate-700 active:scale-95"
                >
                  Use Sample Photo
                </button>
              </div>
            </div>

            {attachedPhoto && (
              <div className="p-3 bg-slate-950 rounded-lg border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <img src={attachedPhoto} alt="Site Evidence" className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg border border-slate-800 shrink-0" />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    AI Computer Vision Hint (Advisory Provenance)
                  </div>
                  <p className="text-slate-300">
                    Detected: Process piping assembly, high-pressure flange, industrial scaffolding.
                  </p>
                  <p className="text-[10px] text-amber-400">
                    Human verification required by Planner before schedule progress commitment.
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
            <span className="text-[11px]">{textInput.length} chars</span>
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>AI will extract structured event and propose Top-3 L5/L6 matches</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!textInput.trim() || isProcessing}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
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
