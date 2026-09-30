import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../services/store';

export const FieldInputCenter: React.FC = () => {
  const { currentRole, submitFieldInput, isOnline, offlineQueue, syncOfflineQueue, setActiveTab, fieldLogs } = useApp();

  const [textInput, setTextInput] = useState(
    'Encountered subterranean hard rock strata at chainage 42+650. Deployed two auxiliary Komatsu PC300 excavators. Completed 420m laid today without safety incident.'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(42);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [calibrated, setCalibrated] = useState(false);
  const [hudAzimuth, setHudAzimuth] = useState('184° S');
  const [hudChainage, setHudChainage] = useState('KM 42+650');
  const [flushing, setFlushing] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

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
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsListeningSpeech(false);
          setIsRecording(false);
        };

        speechRecognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition error:', e);
      }
    }
  }, []);

  // Timer for voice recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (speechRecognitionRef.current && isListeningSpeech) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {}
        setIsListeningSpeech(false);
      }
    } else {
      setIsRecording(true);
      setRecordingSeconds(0);
      setTextInput('');
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
          setIsListeningSpeech(true);
        } catch (err) {
          console.warn('Speech recognition fallback:', err);
        }
      }
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAttachedPhoto(result);
        setTextInput((prev) => 
          prev.includes('Geotagged optical telemetry attached')
            ? prev
            : `${prev} [Geotagged optical telemetry attached: CAM-EX-04A correlated with KM 42+650]`
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMacroClick = (macro: string) => {
    switch (macro) {
      case 'Rock Encounter':
        setHudChainage('KM 42+650');
        setTextInput('Encountered hard bedrock strata at KM 42+650. RQD 68%. Hydraulic rock breaker engaged. Slashing trenching pace by 25% today.');
        break;
      case 'Pipe Stringing':
        setHudChainage('KM 43+100');
        setTextInput('Stringing 36 joints of 24-inch API 5L X70 pipes along KM 43+100. Unloaded and aligned on skid blocks. Joint inspection completed.');
        break;
      case 'Welding Pass Done':
        setHudChainage('KM 42+900');
        setTextInput('Welding Pass Root + Hot pass completed on joints #J-118 through #J-122. Visual inspection passed, awaiting ultrasonic NDT scanning.');
        break;
      case 'Hydrotest Pressurized':
        setHudChainage('KM 40+000');
        setTextInput('Hydrotest section test pressure raised to 148 bar (2,150 psi). 24h pressure hold gauge initialized. Zero pressure drop detected over initial 60 mins.');
        break;
    }
  };

  const handleSubmit = async () => {
    if (!textInput.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      await submitFieldInput(
        textInput,
        attachedPhoto ? 'PHOTO' : isRecording ? 'VOICE' : 'DPR',
        attachedPhoto || undefined
      );
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsProcessing(false);
        setActiveTab('REVIEW_CENTER');
      }, 1200);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  const handleForceFlush = () => {
    setFlushing(true);
    syncOfflineQueue();
    setTimeout(() => setFlushing(false), 900);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}s`;
  };

  return (
    <div className="flex flex-col w-full pb-12 pt-6">
      {/* Hidden file input for camera/photo attachment */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraCapture}
      />

      {/* Telemetry Sub-Navigation Ribbon */}
      <div className="w-full bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-500 font-medium">LOCAL STORAGE ENGINE</span>
              <span className="font-mono text-xs text-amber-700 font-bold flex items-center gap-1.5">
                {isOnline ? 'Online (SQLite Synced)' : `Offline: ${offlineQueue.length} Pending Sync`}
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#f8faff] border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-[16px] text-blue-700">satellite_alt</span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-500 font-medium">GNSS RTK LOCK</span>
              <span className="font-mono text-xs text-slate-900 font-semibold">±1.2cm CEP [FIXED]</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#f8faff] border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">battery_charging_80</span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-500 font-medium">MIL-SPEC TOUGHBOOK</span>
              <span className="font-mono text-xs text-emerald-700 font-semibold">84% • 6.4h REMAINING</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-[#f8faff] border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-[16px] text-slate-600">alt_route</span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-500 font-medium">ACTIVE CORRIDOR SECTOR</span>
              <span className="font-mono text-xs text-slate-900 font-semibold">Digboi Sector A ({hudChainage})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Supervisor:</span>
          <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 font-mono text-xs text-slate-900 font-medium">
            Debashis Gogoi (OIL-FLD-8820)
          </span>
          <button
            onClick={handleForceFlush}
            className="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 active:scale-95 transition-all font-mono text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[14px] ${flushing ? 'animate-spin' : ''}`}>sync</span>
            FORCE FLUSH
          </button>
        </div>
      </div>

      {/* Main Bento Operational Surface */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Cols: Live AI Speech-to-DPR Voice Agent Console */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* Primary Recording Card */}
          <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-base text-slate-900 font-bold tracking-tight">AI Speech-to-DPR Voice Agent</h2>
                  <span className="font-mono text-[10px] text-slate-500 font-medium">
                    ENERGYNLP v4.2 TELEMETRY RUNTIME // MULTILINGUAL ASSAMESE-HINDI-EN
                  </span>
                </div>
              </div>

              <button
                onClick={toggleRecording}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-50 border border-rose-200 text-rose-700 animate-beacon'
                    : 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-600 animate-ping' : 'bg-blue-600'}`}></span>
                {isRecording ? `RECORDING • ${formatTime(recordingSeconds)}` : 'CLICK TO RECORD VOICE'}
              </button>
            </div>

            {/* Dynamic Audio Waveform Visualizer */}
            <div className="w-full bg-[#f8faff] border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">graphic_eq</span> 48kHz PCM ACOUSTIC STREAM
                </span>
                <span className="text-slate-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> SNR: 34.2 dB (WIND-FILTER ON)
                </span>
              </div>

              {/* Animated Waveform SVG Render */}
              <div className="w-full h-16 flex items-center justify-between gap-1 px-2 py-1 overflow-hidden bg-white rounded-lg border border-slate-200">
                <svg className="w-full h-full text-blue-600" fill="currentColor" id="dynamic-waveform" preserveAspectRatio="none" viewBox="0 0 500 60">
                  <rect className="opacity-40 eq-bar eq-d1" height="12" rx="2" width="4" x="0" y="24"></rect>
                  <rect className="opacity-50 eq-bar eq-d2" height="20" rx="2" width="4" x="8" y="20"></rect>
                  <rect className="opacity-70 eq-bar eq-d3" height="28" rx="2" width="4" x="16" y="16"></rect>
                  <rect className="opacity-50 eq-bar eq-d4" height="16" rx="2" width="4" x="24" y="22"></rect>
                  <rect className="opacity-80 eq-bar eq-d5" height="40" rx="2" width="4" x="32" y="10"></rect>
                  <rect className="eq-bar eq-d6" height="52" rx="2" width="4" x="40" y="4"></rect>
                  <rect className="opacity-70 eq-bar eq-d1" height="32" rx="2" width="4" x="48" y="14"></rect>
                  <rect className="opacity-60 eq-bar eq-d2" height="24" rx="2" width="4" x="56" y="18"></rect>
                  <rect className="opacity-90 eq-bar eq-d3" height="44" rx="2" width="4" x="64" y="8"></rect>
                  <rect className="eq-bar eq-d4" height="56" rx="2" width="4" x="72" y="2"></rect>
                  <rect className="opacity-80 eq-bar eq-d5" height="36" rx="2" width="4" x="80" y="12"></rect>
                  <rect className="opacity-50 eq-bar eq-d6" height="16" rx="2" width="4" x="88" y="22"></rect>
                  <rect className="opacity-95 eq-bar eq-d1" height="48" rx="2" width="4" x="96" y="6"></rect>
                  <rect className="opacity-65 eq-bar eq-d2" height="28" rx="2" width="4" x="104" y="16"></rect>
                  <rect className="opacity-50 eq-bar eq-d3" height="20" rx="2" width="4" x="112" y="20"></rect>
                  <rect className="opacity-70 eq-bar eq-d4" height="32" rx="2" width="4" x="120" y="14"></rect>
                  <rect className="eq-bar eq-d5" height="52" rx="2" width="4" x="128" y="4"></rect>
                  <rect className="opacity-80 eq-bar eq-d6" height="40" rx="2" width="4" x="136" y="10"></rect>
                  <rect className="eq-bar eq-d1" height="56" rx="2" width="4" x="144" y="2"></rect>
                  <rect className="opacity-60 eq-bar eq-d2" height="24" rx="2" width="4" x="152" y="18"></rect>
                  <rect className="opacity-75 eq-bar eq-d3" height="32" rx="2" width="4" x="160" y="14"></rect>
                  <rect className="opacity-90 eq-bar eq-d4" height="44" rx="2" width="4" x="168" y="8"></rect>
                  <rect className="opacity-50 eq-bar eq-d5" height="16" rx="2" width="4" x="176" y="22"></rect>
                  <rect className="opacity-95 eq-bar eq-d6" height="48" rx="2" width="4" x="184" y="6"></rect>
                  <rect className="opacity-80 eq-bar eq-d1" height="36" rx="2" width="4" x="192" y="12"></rect>
                  <rect className="eq-bar eq-d2" height="52" rx="2" width="4" x="200" y="4"></rect>
                  <rect className="opacity-60 eq-bar eq-d3" height="24" rx="2" width="4" x="208" y="18"></rect>
                  <rect className="opacity-75 eq-bar eq-d4" height="32" rx="2" width="4" x="216" y="14"></rect>
                  <rect className="opacity-85 eq-bar eq-d5" height="40" rx="2" width="4" x="224" y="10"></rect>
                  <rect className="eq-bar eq-d6" height="56" rx="2" width="4" x="232" y="2"></rect>
                  <rect className="opacity-70 eq-bar eq-d1" height="28" rx="2" width="4" x="240" y="16"></rect>
                  <rect className="opacity-95 eq-bar eq-d2" height="48" rx="2" width="4" x="248" y="6"></rect>
                  <rect className="opacity-50 eq-bar eq-d3" height="16" rx="2" width="4" x="256" y="22"></rect>
                  <rect className="opacity-90 eq-bar eq-d4" height="44" rx="2" width="4" x="264" y="8"></rect>
                  <rect className="opacity-75 eq-bar eq-d5" height="32" rx="2" width="4" x="272" y="14"></rect>
                  <rect className="eq-bar eq-d6" height="52" rx="2" width="4" x="280" y="4"></rect>
                  <rect className="opacity-80 eq-bar eq-d1" height="36" rx="2" width="4" x="288" y="12"></rect>
                  <rect className="opacity-50 eq-bar eq-d2" height="20" rx="2" width="4" x="296" y="20"></rect>
                  <rect className="opacity-70 eq-bar eq-d3" height="28" rx="2" width="4" x="304" y="16"></rect>
                  <rect className="opacity-90 eq-bar eq-d4" height="44" rx="2" width="4" x="312" y="8"></rect>
                  <rect className="eq-bar eq-d5" height="56" rx="2" width="4" x="320" y="2"></rect>
                  <rect className="opacity-75 eq-bar eq-d6" height="32" rx="2" width="4" x="328" y="14"></rect>
                  <rect className="opacity-95 eq-bar eq-d1" height="48" rx="2" width="4" x="336" y="6"></rect>
                  <rect className="opacity-50 eq-bar eq-d2" height="16" rx="2" width="4" x="344" y="22"></rect>
                  <rect className="opacity-80 eq-bar eq-d3" height="36" rx="2" width="4" x="352" y="12"></rect>
                  <rect className="eq-bar eq-d4" height="52" rx="2" width="4" x="360" y="4"></rect>
                  <rect className="opacity-60 eq-bar eq-d5" height="24" rx="2" width="4" x="368" y="18"></rect>
                  <rect className="opacity-75 eq-bar eq-d6" height="32" rx="2" width="4" x="376" y="14"></rect>
                  <rect className="opacity-85 eq-bar eq-d1" height="40" rx="2" width="4" x="384" y="10"></rect>
                  <rect className="eq-bar eq-d2" height="56" rx="2" width="4" x="392" y="2"></rect>
                  <rect className="opacity-70 eq-bar eq-d3" height="28" rx="2" width="4" x="400" y="16"></rect>
                  <rect className="opacity-95 eq-bar eq-d4" height="48" rx="2" width="4" x="408" y="6"></rect>
                  <rect className="opacity-50 eq-bar eq-d5" height="16" rx="2" width="4" x="416" y="22"></rect>
                  <rect className="opacity-90 eq-bar eq-d6" height="44" rx="2" width="4" x="424" y="8"></rect>
                  <rect className="opacity-75 eq-bar eq-d1" height="32" rx="2" width="4" x="432" y="14"></rect>
                  <rect className="eq-bar eq-d2" height="52" rx="2" width="4" x="440" y="4"></rect>
                  <rect className="opacity-80 eq-bar eq-d3" height="36" rx="2" width="4" x="448" y="12"></rect>
                  <rect className="opacity-50 eq-bar eq-d4" height="20" rx="2" width="4" x="456" y="20"></rect>
                  <rect className="opacity-70 eq-bar eq-d5" height="28" rx="2" width="4" x="464" y="16"></rect>
                  <rect className="opacity-50 eq-bar eq-d6" height="16" rx="2" width="4" x="472" y="22"></rect>
                  <rect className="opacity-40 eq-bar eq-d1" height="8" rx="2" width="4" x="480" y="26"></rect>
                  <rect className="opacity-30 eq-bar eq-d2" height="4" rx="2" width="4" x="488" y="28"></rect>
                </svg>
              </div>

              {/* Realtime Transcription Box */}
              <div className="relative bg-white border border-slate-200 rounded-lg p-3.5 transition-all shadow-2xs hover:border-slate-300">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
                  <span className="font-mono text-[11px] text-blue-700 flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[13px] animate-spin">neurology</span>
                    CONFIDENCE 99.4% • NLP STREAM
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">LATENCY 82ms</span>
                </div>

                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={3}
                  className="w-full text-slate-800 text-sm leading-relaxed border-0 focus:ring-0 p-0 resize-none font-sans"
                  placeholder="Speak into microphone or edit the transcribed text here..."
                />

                <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] text-slate-500 font-mono">Entity Chips:</span>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold">
                    Chainage: 42+650
                  </span>
                  <span className="bg-blue-100 text-blue-900 border border-blue-300 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold">
                    Komatsu PC300
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold">
                    420m laid
                  </span>
                  <span className="bg-slate-100 text-slate-800 border border-slate-300 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold">
                    LTI: Zero
                  </span>
                </div>
              </div>
            </div>

            {/* AI Extracted Entities Panel */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  P6 Primavera Extracted Entities • Auto Mapped
                </span>
                <span className="font-mono text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">verified</span> AUTONOMOUS PARSING MATCH
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="bg-[#f8faff] border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:border-slate-300 hover:bg-white transition-all cursor-default shadow-2xs">
                  <span className="font-mono text-[10px] text-slate-500">ACTION:</span>
                  <span className="font-mono text-xs text-slate-900 font-semibold">Trenching & Lowering</span>
                </div>
                <div className="bg-[#f8faff] border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:border-slate-300 hover:bg-white transition-all cursor-default shadow-2xs">
                  <span className="font-mono text-[10px] text-slate-500">VOLUME:</span>
                  <span className="font-mono text-xs text-slate-900 font-semibold">420m / 375m Target</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold">
                    +12% PACE
                  </span>
                </div>
                <div className="bg-[#f8faff] border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:border-slate-300 hover:bg-white transition-all cursor-default shadow-2xs">
                  <span className="font-mono text-[10px] text-slate-500">EQUIPMENT:</span>
                  <span className="font-mono text-xs text-blue-700 font-semibold">2x Komatsu PC300</span>
                </div>
                <div className="bg-[#f8faff] border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:border-slate-300 hover:bg-white transition-all cursor-default shadow-2xs">
                  <span className="font-mono text-[10px] text-slate-500">SAFETY:</span>
                  <span className="font-mono text-xs text-emerald-700 font-semibold">0 Incidents (LTI Clean)</span>
                </div>
                <div className="bg-[#f8faff] border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:border-slate-300 hover:bg-white transition-all cursor-default shadow-2xs">
                  <span className="font-mono text-[10px] text-slate-500">WBS TARGET:</span>
                  <span className="font-mono text-xs text-blue-700 font-semibold">ACT-TR-4290</span>
                </div>
              </div>
            </div>

            {/* Action Control Buttons */}
            <div className="mt-5 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTextInput('');
                    setRecordingSeconds(0);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-xs font-medium cursor-pointer active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">replay</span> Retake Voice Memo
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-mono text-xs font-medium cursor-pointer active:scale-95 transition-all ${
                    attachedPhoto
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-300 hover:bg-blue-50 hover:border-blue-700 text-blue-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {attachedPhoto ? 'check_circle' : 'add_a_photo'}
                  </span>
                  {attachedPhoto ? 'Geotag Photo Attached' : 'Attach Geotagged Photo'}
                </button>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSubmit}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-mono text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                  submitSuccess
                    ? 'bg-emerald-600 text-white'
                    : isProcessing
                    ? 'bg-blue-800 text-white cursor-wait'
                    : 'bg-blue-700 hover:bg-blue-800 text-white active:scale-95'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isProcessing ? 'animate-spin' : ''}`}>
                  {isProcessing ? 'progress_activity' : submitSuccess ? 'done_all' : 'send'}
                </span>
                <span>
                  {isProcessing
                    ? 'Analyzing & Parsing...'
                    : submitSuccess
                    ? 'Dispatched to AI Review Desk 1'
                    : 'Direct Submit to AI Review Desk'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Field Trigger Rails */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-2">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Fast-Action Macro Telemetry Keys
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleMacroClick('Rock Encounter')}
                className="p-3 rounded-lg bg-[#f8faff] border border-slate-200 hover:border-blue-700 hover:bg-white transition-all flex flex-col items-start gap-1 group text-left cursor-pointer hover:-translate-y-0.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-blue-700 text-[20px] group-hover:scale-110 transition-transform">
                  landslide
                </span>
                <span className="font-mono text-xs text-slate-900 font-semibold">Rock Encounter</span>
                <span className="font-mono text-[10px] text-slate-500">Auto Log Strata Delta</span>
              </button>

              <button
                type="button"
                onClick={() => handleMacroClick('Pipe Stringing')}
                className="p-3 rounded-lg bg-[#f8faff] border border-slate-200 hover:border-teal-700 hover:bg-white transition-all flex flex-col items-start gap-1 group text-left cursor-pointer hover:-translate-y-0.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-teal-700 text-[20px] group-hover:scale-110 transition-transform">
                  linear_scale
                </span>
                <span className="font-mono text-xs text-slate-900 font-semibold">Pipe Stringing</span>
                <span className="font-mono text-[10px] text-slate-500">Increment Joint Count</span>
              </button>

              <button
                type="button"
                onClick={() => handleMacroClick('Welding Pass Done')}
                className="p-3 rounded-lg bg-[#f8faff] border border-slate-200 hover:border-indigo-700 hover:bg-white transition-all flex flex-col items-start gap-1 group text-left cursor-pointer hover:-translate-y-0.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-indigo-700 text-[20px] group-hover:scale-110 transition-transform">
                  join_inner
                </span>
                <span className="font-mono text-xs text-slate-900 font-semibold">Welding Pass Done</span>
                <span className="font-mono text-[10px] text-slate-500">NDT Scan Ready</span>
              </button>

              <button
                type="button"
                onClick={() => handleMacroClick('Hydrotest Pressurized')}
                className="p-3 rounded-lg bg-[#f8faff] border border-slate-200 hover:border-emerald-700 hover:bg-white transition-all flex flex-col items-start gap-1 group text-left cursor-pointer hover:-translate-y-0.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-emerald-700 text-[20px] group-hover:scale-110 transition-transform">
                  speed
                </span>
                <span className="font-mono text-xs text-slate-900 font-semibold">Hydrotest Pressurized</span>
                <span className="font-mono text-[10px] text-slate-500">Hold 24h Gauge Influx</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Geotagged Camera & Drone Telemetry HUD */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Geotagged Camera / Drone HUD Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col hover:shadow-md transition-shadow">
            <div className="p-3.5 flex items-center justify-between bg-[#f8faff] border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[18px]">photo_camera_front</span>
                <span className="font-mono text-xs text-slate-900 font-bold uppercase tracking-wide">
                  Optical Telemetry Feed
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[10px] font-semibold">
                CAM-EX-04A // 4K RAW
              </span>
            </div>

            {/* Camera Media Display with Inset HUD Overlay */}
            <div className="relative w-full h-64 bg-slate-900 overflow-hidden group select-none" id="camera-viewport">
              <img
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                alt="High-resolution industrial aerial drone photo capturing deep pipeline trenching operation across rural rocky terrain in Assam India, featuring Komatsu PC300 yellow excavators digging through exposed hard rock layers"
                src={
                  attachedPhoto ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCxNryDBcaO5IxR1lsS8Tc7clE8FbkycJp3beHMp7uCWRnIqkgu1qiADjhSjNdrBNxCE2YA7pXAev_4mpid5c2cpg8j2tyWXkiv4nd8UVAI06XtJTDvQjn886s4c9uiuuhz12ico16HSpYnYmdaoivIb_-NA86eY41X615nfoNBJ2zGjPgF3VFKPro-HzosFWXQjhucZw_JXfbr7dS-2VvyVTnDUjzkvAgW99udruDRCVib68Yf_1w'
                }
              />
              {/* Subtle scanning line effect */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none animate-scanline"></div>
              {/* Ground-truth Match Badge Top Right */}
              <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded shadow-lg flex items-center gap-1.5 border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-[10px] text-emerald-400 font-medium">
                  UAV Multispectral Pass #012 Correlated
                </span>
              </div>
              {/* Crosshairs & HUD Elements */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between items-start">
                  <div className="font-mono text-[10px] text-white bg-slate-900/85 backdrop-blur-xs px-2 py-0.5 rounded font-medium border border-slate-700 tracking-wider flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    CHAINAGE: <span className="font-bold text-cyan-300">{hudChainage}</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-300 bg-slate-900/85 backdrop-blur-xs px-2 py-0.5 rounded font-medium border border-slate-700 tracking-wider">
                    AZIMUTH: <span className="font-bold text-slate-100">{hudAzimuth}</span>
                  </div>
                </div>
                {/* Center Reticle with subtle breathing pulse */}
                <div className="self-center flex flex-col items-center animate-reticle">
                  <svg className="text-blue-300/85" height="42" viewBox="0 0 40 40" width="42">
                    <circle cx="20" cy="20" fill="none" r="12" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1"></circle>
                    <line stroke="currentColor" strokeWidth="1.5" x1="20" x2="20" y1="4" y2="14"></line>
                    <line stroke="currentColor" strokeWidth="1.5" x1="20" x2="20" y1="26" y2="36"></line>
                    <line stroke="currentColor" strokeWidth="1.5" x1="4" x2="14" y1="20" y2="20"></line>
                    <line stroke="currentColor" strokeWidth="1.5" x1="26" x2="36" y1="20" y2="20"></line>
                  </svg>
                </div>
                {/* Bottom Data Readout Ribbon */}
                <div className="bg-slate-900/90 backdrop-blur-md rounded p-2 flex items-center justify-between text-slate-100 font-mono text-[10px] shadow-md border border-slate-700">
                  <span className="text-blue-300 tracking-tight">LAT: 27.3892° N • LON: 95.6174° E</span>
                  <span className="text-slate-200">ALT: +142.4m AMSL</span>
                  <span className="text-amber-400 font-semibold">11:15 IST</span>
                </div>
              </div>
            </div>

            {/* Ingestion Status Bar */}
            <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                <span className="text-xs text-slate-700 font-medium">Photogrammetry Orthomosaic Synced</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCalibrated(true);
                  setTimeout(() => setCalibrated(false), 2000);
                }}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 active:scale-95 border border-slate-300 font-mono text-[10px] text-slate-900 font-semibold transition-all flex items-center gap-1 group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] group-hover:rotate-90 transition-transform duration-300">
                  tune
                </span>
                <span>{calibrated ? 'CALIBRATED' : 'CALIBRATE HUD'}</span>
              </button>
            </div>
          </div>

          {/* Quick Geological Insight Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-500 uppercase font-semibold">
                Subsurface Profile ({hudChainage})
              </span>
              <span className="font-mono text-[11px] text-blue-700 font-semibold">BOREHOLE REF: BH-DGB-09</span>
            </div>
            <div className="w-full bg-[#f8faff] border border-slate-200 rounded-lg p-3.5 flex flex-col gap-2.5">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-600 font-medium">Strata Density (Granite-Sandstone Blend)</span>
                <span className="text-slate-900 font-bold">2,650 kg/m³</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-700 transition-all duration-1000 ease-out" style={{ width: '78%' }}></div>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-mono text-[11px] pt-1">
                <span className="font-medium text-amber-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">warning</span> Bucket Refusal Risk: High
                </span>
                <span className="font-medium">RQD: 68% (Fair)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Local Field Dispatch Log Queue */}
      <div className="w-full mt-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base text-slate-900 font-bold tracking-tight">Today's Local Field Dispatch Log Queue</h3>
              <span className="font-mono text-[10px] text-slate-500 font-medium">
                LOCAL DISPATCH TELEMETRY BUFFER • SHIFT A RECORD MATRIX
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-500">
              Showing {fieldLogs.length} Cached Logs
            </span>
            <button
              type="button"
              onClick={() => {
                const csvContent =
                  'data:text/csv;charset=utf-8,' +
                  'ID,Timestamp,Activity,Quantity,Unit,Status\n' +
                  fieldLogs.map((l) => `${l.id},${l.timestamp},"${l.activityDescription}",${l.quantityExtracted || 0},${l.unit || 'm'},${l.status}`).join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', 'field_dispatch_logs.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 active:scale-95 transition-all text-slate-700 font-mono text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-slate-500">file_download</span> CSV Export
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#f8faff] text-slate-600 font-mono text-[11px] uppercase border-b border-slate-200">
                <th className="py-2.5 px-4 font-semibold">Dispatch ID</th>
                <th className="py-2.5 px-4 font-semibold">Chainage / Loc</th>
                <th className="py-2.5 px-4 font-semibold">Logged Work Activity</th>
                <th className="py-2.5 px-4 font-semibold">Mapped P6 Activity</th>
                <th className="py-2.5 px-4 font-semibold">Sync State</th>
                <th className="py-2.5 px-4 text-right font-semibold">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {fieldLogs.slice(0, 5).map((log, index) => (
                <tr key={log.id} className="hover:bg-[#f8faff] transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-slate-900">
                    <span className="font-bold text-blue-700">#{log.id.toUpperCase()}</span>
                    <div className="font-mono text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST • {log.inputType}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-700">
                    KM 42+{650 - index * 170}
                    <div className="font-mono text-[10px] text-slate-500">Digboi Sector A</div>
                  </td>
                  <td className="py-3 px-4 text-slate-900 text-xs">
                    {log.rawText || log.activityDescription}
                    <div className="font-mono text-[10px] text-emerald-700 font-semibold">Zero HSE Incidents</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
                      {log.mappedActivityId || 'ACT-TR-4290'}
                    </span>
                    <div className="font-mono text-[10px] text-slate-500 mt-0.5">{log.activityDescription}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {log.status === 'COMMITTED' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        EPPM COMMITTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        OFFLINE BUFFER
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveTab('REVIEW_CENTER')}
                        className="p-1 rounded bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
                      {log.status !== 'COMMITTED' && (
                        <button
                          type="button"
                          onClick={() => syncOfflineQueue()}
                          className="p-1 rounded bg-blue-700 text-white hover:bg-blue-800 active:scale-95 transition-all font-mono text-[10px] font-semibold flex items-center gap-1 px-2.5 shadow-2xs cursor-pointer"
                          title="Synchronize with EPPM"
                        >
                          <span className="material-symbols-outlined text-[14px]">cloud_upload</span> SYNC
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Footer Sync Protocol Indicator */}
        <div className="pt-3 flex flex-wrap items-center justify-between text-slate-500 font-mono text-[10px] border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-blue-700">wifi_off</span>
            SYSTEM OPERATING IN RESILIENT STORE-AND-FORWARD MODE (OIL-ISDN-EDGE-V2)
          </span>
          <span className="font-medium text-slate-600">AUTOMATIC PUSH TRIGGER ON LTE-M / SATELLITE HANDSHAKE</span>
        </div>
      </div>
    </div>
  );
};
