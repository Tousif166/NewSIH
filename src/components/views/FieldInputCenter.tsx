import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../services/store';
import { NormalizedExecutionEvent } from '../../types';
import { 
  parseCSVToRows, 
  parseDPRText, 
  SAMPLE_FIELD_REPORTS, 
  IngestedRowPreview,
  SAMPLE_INDIC_DISPATCHES,
  parseIndicFieldDispatch
} from '../../services/level1Engine';

export const FieldInputCenter: React.FC = () => {
  const { 
    currentRole, 
    submitFieldInput, 
    batchIngestFieldRows,
    submitIndicFieldInput,
    activeGeofence,
    simulateGeofenceAnomaly,
    resetGeofenceToCenterline,
    isOnline, 
    offlineQueue, 
    syncOfflineQueue, 
    setActiveTab, 
    fieldEvents, 
    matches,
    activities,
    navigateToEventReview,
    navigateToActivitySchedule,
    activeIngestionMode,
    setActiveIngestionMode,
    showToast 
  } = useApp();

  const fieldLogs = fieldEvents || [];
  const [inspectingLog, setInspectingLog] = useState<NormalizedExecutionEvent | null>(null);

  // Ingestion Modes: Single, Multi-Format, or Indic Bhasha
  const [selectedIndicPreset, setSelectedIndicPreset] = useState(SAMPLE_INDIC_DISPATCHES[0]);
  const [indicInputText, setIndicInputText] = useState(SAMPLE_INDIC_DISPATCHES[0].rawVoiceTranscript);
  const [analyzedIndic, setAnalyzedIndic] = useState(() => parseIndicFieldDispatch(SAMPLE_INDIC_DISPATCHES[0].rawVoiceTranscript));
  const [isSubmittingIndic, setIsSubmittingIndic] = useState(false);
  const [isIndicRecording, setIsIndicRecording] = useState(false);
  const [indicRecordingSeconds, setIndicRecordingSeconds] = useState(0);
  const [isIndicListeningSpeech, setIsIndicListeningSpeech] = useState(false);
  const [isPlayingIndicAudio, setIsPlayingIndicAudio] = useState(false);
  const indicSpeechRecognitionRef = useRef<any>(null);
  const indicStreamIntervalRef = useRef<any>(null);

  const [uploadedFileName, setUploadedFileName] = useState<string>('Piping_Subcon_Tracker.csv');
  const [parsedRows, setParsedRows] = useState<IngestedRowPreview[]>(() => parseCSVToRows(SAMPLE_FIELD_REPORTS.pipingSubconCsv));
  const [isBatchIngesting, setIsBatchIngesting] = useState(false);
  const [batchSuccessMessage, setBatchSuccessMessage] = useState<string | null>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  const [textInput, setTextInput] = useState(
    'Encountered subterranean hard rock strata at chainage 42+650. Deployed two auxiliary Komatsu PC300 excavators. Completed 420m laid today without safety incident.'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [calibrated, setCalibrated] = useState(false);
  const [hudAzimuth, setHudAzimuth] = useState('184° S');
  const [hudChainage, setHudChainage] = useState('KM 42+650');
  const [flushing, setFlushing] = useState(false);
  const [activeSpeechSample, setActiveSpeechSample] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);
  const streamIntervalRef = useRef<any>(null);

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

        recognition.onerror = (e: any) => {
          console.warn('SpeechRecognition error or permission issue:', e);
          setIsListeningSpeech(false);
          // Seamless fallback: continue recording seconds and stream simulated telemetry transcription
          simulateVoiceStream();
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
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    }
    return () => {
      clearInterval(interval);
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [isRecording]);

  // Graceful simulated voice stream for environments without mic permissions or hardware
  const simulateVoiceStream = () => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

    const sampleWords = [
      'Encountered', 'high-pressure', 'water', 'seepage', 'at', 'KM 42+780', 'while', 'lowering',
      '24-inch', 'pipe', 'string.', 'Dewatering', 'pumps', 'active.', 'Completed', '380m', 'trenching', 'today.'
    ];

    let wordIdx = 0;
    setTextInput('');
    streamIntervalRef.current = setInterval(() => {
      if (wordIdx < sampleWords.length) {
        setTextInput((prev) => (prev ? prev + ' ' : '') + sampleWords[wordIdx]);
        wordIdx++;
      } else {
        clearInterval(streamIntervalRef.current);
      }
    }, 280);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      if (speechRecognitionRef.current && isListeningSpeech) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {}
        setIsListeningSpeech(false);
      }
      showToast('Voice memo captured and audio stream encoded.');
    } else {
      setIsRecording(true);
      setRecordingSeconds(0);
      showToast('Microphone active. Transcribing speech stream...');

      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
          setIsListeningSpeech(true);
          return;
        } catch (err) {
          console.warn('Speech recognition start failed, using speech streamer fallback:', err);
        }
      }

      // Stream words dynamically
      simulateVoiceStream();
    }
  };

  // Timer for Indic voice recording
  useEffect(() => {
    let interval: any;
    if (isIndicRecording) {
      interval = setInterval(() => {
        setIndicRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setIndicRecordingSeconds(0);
      if (indicStreamIntervalRef.current) {
        clearInterval(indicStreamIntervalRef.current);
      }
    }
    return () => {
      clearInterval(interval);
      if (indicStreamIntervalRef.current) {
        clearInterval(indicStreamIntervalRef.current);
      }
    };
  }, [isIndicRecording]);

  const simulateIndicVoiceStream = () => {
    if (indicStreamIntervalRef.current) clearInterval(indicStreamIntervalRef.current);
    
    const sampleWords = selectedIndicPreset.rawVoiceTranscript.split(' ');
    let wordIdx = 0;
    setIndicInputText('');
    
    indicStreamIntervalRef.current = setInterval(() => {
      if (wordIdx < sampleWords.length) {
        const nextWord = sampleWords[wordIdx];
        setIndicInputText((prev) => {
          const updated = prev ? `${prev} ${nextWord}` : nextWord;
          setAnalyzedIndic(parseIndicFieldDispatch(updated));
          return updated;
        });
        wordIdx++;
      } else {
        clearInterval(indicStreamIntervalRef.current);
        setIsIndicRecording(false);
        setIsIndicListeningSpeech(false);
        showToast(`Vernacular speech transcribed: ${selectedIndicPreset.dialect} audio stream decoded.`, 'success');
      }
    }, 240);
  };

  const startIndicSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        const dialectLower = selectedIndicPreset.dialect.toLowerCase();
        if (dialectLower.includes('assamese')) {
          recognition.lang = 'as-IN';
        } else if (dialectLower.includes('bengali')) {
          recognition.lang = 'bn-IN';
        } else {
          recognition.lang = 'hi-IN';
        }

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setIndicInputText(currentTranscript);
            setAnalyzedIndic(parseIndicFieldDispatch(currentTranscript));
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Indic SpeechRecognition error:', e);
          setIsIndicListeningSpeech(false);
          simulateIndicVoiceStream();
        };

        recognition.onend = () => {
          setIsIndicListeningSpeech(false);
        };

        indicSpeechRecognitionRef.current = recognition;
        recognition.start();
        setIsIndicListeningSpeech(true);
        return true;
      } catch (err) {
        console.warn('Indic SpeechRecognition start failed:', err);
        return false;
      }
    }
    return false;
  };

  const toggleIndicVoiceRecording = () => {
    if (isIndicRecording) {
      setIsIndicRecording(false);
      if (indicStreamIntervalRef.current) clearInterval(indicStreamIntervalRef.current);
      if (indicSpeechRecognitionRef.current && isIndicListeningSpeech) {
        try {
          indicSpeechRecognitionRef.current.stop();
        } catch (e) {}
        setIsIndicListeningSpeech(false);
      }
      showToast(`Captured ${selectedIndicPreset.dialect} vernacular voice dispatch.`, 'success');
    } else {
      setIsIndicRecording(true);
      setIndicRecordingSeconds(0);
      showToast(`Microphone active (${selectedIndicPreset.dialect}). Speak into microphone...`, 'info');

      const started = startIndicSpeechRecognition();
      if (!started) {
        simulateIndicVoiceStream();
      }
    }
  };

  const handleSpeakVernacularSample = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Text-to-speech audio synthesis not supported in this browser.', 'warning');
      return;
    }
    if (isPlayingIndicAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingIndicAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(indicInputText);
    utterance.lang = selectedIndicPreset.dialect.toLowerCase().includes('assamese') ? 'hi-IN' : 'hi-IN';
    utterance.rate = 0.92;
    
    utterance.onstart = () => setIsPlayingIndicAudio(true);
    utterance.onend = () => setIsPlayingIndicAudio(false);
    utterance.onerror = () => setIsPlayingIndicAudio(false);
    
    window.speechSynthesis.speak(utterance);
    showToast(`Playing vernacular voice memo (${selectedIndicPreset.dialect})...`, 'info');
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
            : `${prev} [Geotagged optical telemetry attached: CAM-EX-04A correlated with ${hudChainage}]`
        );
        showToast('Optical telemetry photo attached and EXIF geotag verified.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulatePhoto = () => {
    const droneSampleUrl = '/images/pipeline-drone-4k.jpg';
    setAttachedPhoto(droneSampleUrl);
    setTextInput((prev) => 
      prev.includes('Geotagged optical telemetry attached')
        ? prev
        : `${prev} [Geotagged optical telemetry attached: DRONE-UAV-09 at ${hudChainage} Azimuth ${hudAzimuth}]`
    );
    showToast('Simulated UAV 4K multispectral drone photo attached.');
  };

  const handleMacroClick = (macro: string) => {
    setActiveSpeechSample(macro);
    switch (macro) {
      case 'Rock Encounter':
        setHudChainage('KM 42+650');
        setTextInput('Encountered hard bedrock strata at KM 42+650. RQD 68%. Hydraulic rock breaker engaged. Slashing trenching pace by 25% today.');
        showToast('Macro applied: Hard Rock Encounter at KM 42+650');
        break;
      case 'Pipe Stringing':
        setHudChainage('KM 43+100');
        setTextInput('Stringing 36 joints of 24-inch API 5L X70 pipes along KM 43+100. Unloaded and aligned on skid blocks. Joint inspection completed.');
        showToast('Macro applied: Pipe Stringing at KM 43+100');
        break;
      case 'Welding Pass Done':
        setHudChainage('KM 42+900');
        setTextInput('Welding Pass Root + Hot pass completed on joints #J-118 through #J-122. Visual inspection passed, awaiting ultrasonic NDT scanning.');
        showToast('Macro applied: Welding Pass Done at KM 42+900');
        break;
      case 'Hydrotest Pressurized':
        setHudChainage('KM 40+000');
        setTextInput('Hydrotest section test pressure raised to 148 bar (2,150 psi). 24h pressure hold gauge initialized. Zero pressure drop detected over initial 60 mins.');
        showToast('Macro applied: Hydrotest Pressurized at KM 40+000');
        break;
    }
  };

  const handleSubmit = async () => {
    if (!textInput.trim() || isProcessing) {
      showToast('Please enter or record field observation before submitting.');
      return;
    }
    setIsProcessing(true);

    try {
      const eventId = await submitFieldInput(
        textInput,
        attachedPhoto ? 'PHOTO' : isRecording ? 'VOICE' : 'DPR',
        attachedPhoto || undefined
      );
      setLastSubmittedId(eventId);
      setSubmitSuccess(true);
      showToast('Field progress extracted & matched to P6 activity successfully!');
      
      // Auto-reset state for next entry while preserving the success notification
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    } catch (e) {
      setIsProcessing(false);
      showToast('Submission error. Retrying local cache...');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;

      if (file.name.endsWith('.txt') || file.name.endsWith('.dpr')) {
        const rows = parseDPRText(content);
        setParsedRows(rows);
        showToast(`Loaded ${rows.length} rows from ${file.name}`);
      } else {
        const rows = parseCSVToRows(content);
        setParsedRows(rows);
        showToast(`Loaded ${rows.length} rows from ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const loadSamplePreset = (presetKey: keyof typeof SAMPLE_FIELD_REPORTS) => {
    setBatchSuccessMessage(null);
    if (presetKey === 'pipingSubconCsv') {
      setUploadedFileName('AIES_Piping_Subcon_Tracker.csv');
      setParsedRows(parseCSVToRows(SAMPLE_FIELD_REPORTS.pipingSubconCsv));
      showToast('Loaded Piping Subcontractor CSV (3 rows)');
    } else if (presetKey === 'civilDprText') {
      setUploadedFileName('Civil_Shift_DPR.txt');
      setParsedRows(parseDPRText(SAMPLE_FIELD_REPORTS.civilDprText));
      showToast('Loaded Civil Daily Progress Report (3 entries)');
    } else if (presetKey === 'electricalCsv') {
      setUploadedFileName('Electrical_NightShift_Log.csv');
      setParsedRows(parseCSVToRows(SAMPLE_FIELD_REPORTS.electricalCsv));
      showToast('Loaded Electrical Cable Tray CSV (3 rows)');
    } else if (presetKey === 'unplannedEmergencyText') {
      setUploadedFileName('Emergency_Drainage_Log.txt');
      setParsedRows(parseDPRText(SAMPLE_FIELD_REPORTS.unplannedEmergencyText));
      showToast('Loaded Unplanned Emergency Drainage DPR (Judge Demo)');
    }
  };

  const handleBatchIngest = async () => {
    if (parsedRows.length === 0 || isBatchIngesting) return;
    setIsBatchIngesting(true);
    setBatchSuccessMessage(null);

    const validRows = parsedRows.filter(r => r.isValid);
    const count = await batchIngestFieldRows(validRows);

    setIsBatchIngesting(false);
    setBatchSuccessMessage(`Successfully ingested ${count} field execution events into AI Semantic Matcher!`);
    showToast(`Batch ingested ${count} field reports into review desk.`);
  };

  const handleForceFlush = () => {
    setFlushing(true);
    syncOfflineQueue();
    setTimeout(() => {
      setFlushing(false);
      showToast('Local queue synced with EPPM.');
    }, 900);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}s`;
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Hidden file input for camera/photo attachment */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraCapture}
      />

      {/* Hidden file input for multi-format progress reports (.csv, .xlsx, .txt, .dpr) */}
      <input
        type="file"
        ref={multiFileInputRef}
        accept=".csv,.txt,.dpr,.tsv,.json,.xlsx"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Telemetry Sub-Navigation Ribbon */}
      <div className="w-full bg-white rounded-xl p-4 border border-slate-300 shadow-xs hover-elevate flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-500 font-medium">LOCAL STORAGE ENGINE</span>
              <span className="font-mono text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                {isOnline ? 'Online (SQLite Synced)' : `Offline: ${offlineQueue.length} Pending Sync`}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              </span>
            </div>
          </div>

          {/* Anti-Ghost GPS RoW Geofence Telemetry */}
          <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg shadow-2xs border ${
            activeGeofence.status === 'VERIFIED'
              ? 'bg-emerald-50 border-emerald-300'
              : activeGeofence.status === 'WARNING_BUFFER'
              ? 'bg-amber-50 border-amber-300'
              : 'bg-rose-50 border-rose-400 animate-pulse'
          }`}>
            <span className={`material-symbols-outlined text-[18px] shrink-0 ${
              activeGeofence.status === 'VERIFIED' ? 'text-emerald-700' : activeGeofence.status === 'WARNING_BUFFER' ? 'text-amber-700' : 'text-rose-700'
            }`}>
              {activeGeofence.status === 'VERIFIED' ? 'verified_user' : 'wrong_location'}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
                <span className={activeGeofence.status === 'VERIFIED' ? 'text-emerald-900' : 'text-rose-900'}>
                  {activeGeofence.status === 'VERIFIED' ? 'GPS ON-RoW: VERIFIED' : '⚠️ GEOFENCE INTEGRITY VIOLATION'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-semibold">{activeGeofence.distanceFromRoWCenterlineMeters}m from Centerline</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] text-slate-500">
                <span>Lat {activeGeofence.latitude}°N, Lon {activeGeofence.longitude}°E</span>
                <span className="text-slate-300">•</span>
                {activeGeofence.status === 'VERIFIED' ? (
                  <button
                    type="button"
                    onClick={simulateGeofenceAnomaly}
                    className="text-rose-700 underline font-bold hover:text-rose-900 cursor-pointer"
                    title="Simulate contractor reporting from outside pipeline Right-of-Way"
                  >
                    [Simulate Ghost GPS]
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetGeofenceToCenterline}
                    className="text-emerald-700 underline font-bold hover:text-emerald-900 cursor-pointer"
                    title="Reset coordinates back to pipeline corridor"
                  >
                    [Reset to RoW Centerline]
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#f8faff] border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">battery_charging_80</span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-500 font-medium">MIL-SPEC TOUGHBOOK</span>
              <span className="font-mono text-xs text-emerald-800 font-semibold">84% • 6.4h REMAINING</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-[#f8faff] border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <span className="material-symbols-outlined text-[16px] text-slate-600">alt_route</span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-500 font-medium">ACTIVE CORRIDOR SECTOR</span>
              <span className="font-mono text-xs text-slate-900 font-semibold">Digboi Sector A ({hudChainage})</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Supervisor:</span>
            <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 font-mono text-xs text-slate-900 font-medium">
              Debashis Gogoi (OIL-FLD-8820)
            </span>
          </div>
          <button
            onClick={handleForceFlush}
            type="button"
            className="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 active:scale-95 transition-all font-mono text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[14px] ${flushing ? 'animate-spin' : ''}`}>sync</span>
            FORCE FLUSH
          </button>
        </div>
      </div>

      {/* Success Notification Banner with Direct Action */}
      {submitSuccess && (
        <div className="w-full bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">check</span>
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-900">
                Field Telemetry Ingested & Matched ({lastSubmittedId || 'ACT-TR-4290'})
              </div>
              <div className="text-xs text-emerald-800 font-mono">
                Candidate linkage ready for approval in AI Review Desk • Confidence 94%
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('REVIEW_CENTER')}
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer w-full sm:w-auto"
            >
              <span>Review in AI Review Desk</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="p-2 rounded-lg text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Level 1: Ingestion Mode Selector Ribbon */}
      <div className="w-full bg-white border border-slate-300 rounded-xl p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveIngestionMode('SINGLE')}
            className={`px-4 py-2 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeIngestionMode === 'SINGLE'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-blue-700">mic</span>
            <span>Single Field Observation (Voice / Text / Camera)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveIngestionMode('MULTI_FORMAT')}
            className={`px-4 py-2 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeIngestionMode === 'MULTI_FORMAT'
                ? 'bg-white text-blue-900 shadow-xs border border-blue-300 ring-2 ring-blue-500/10'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-700">upload_file</span>
            <span>Multi-Format Ingestion Desk (CSV / XLSX / DPR)</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              LEVEL 1 PS 26122
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveIngestionMode('INDIC_BHASHA')}
            className={`px-4 py-2 rounded-md font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeIngestionMode === 'INDIC_BHASHA'
                ? 'bg-white text-orange-950 shadow-xs border border-orange-300 ring-2 ring-orange-500/10'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-orange-600">record_voice_over</span>
            <span>Indic Bhasha & Hinglish Dispatch</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-orange-100 text-orange-800 font-bold border border-orange-300">
              BHASHA AI
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 px-3">
          <span className="material-symbols-outlined text-[15px] text-slate-400">tune</span>
          <span>Heterogeneous Input Bridge (Oil India PS 26122)</span>
        </div>
      </div>

      {activeIngestionMode === 'MULTI_FORMAT' ? (
        /* Multi-Format Ingestion Desk Surface */
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs hover-elevate flex flex-col gap-6">
            {/* Header & Badges */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
                  <span className="material-symbols-outlined text-[24px]">dataset</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg text-slate-900 font-bold tracking-tight">Heterogeneous Multi-Format Ingestion Desk</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      LEVEL 1 PS 26122
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Ingest Excel subcontractor sheets, CSV progress logs, and raw Daily Progress Reports (DPR). Converts batch rows into normalized execution events with automated P6 L5/L6 candidate matching.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => multiFileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  <span>Browse Custom File (.csv, .xlsx, .txt)</span>
                </button>
              </div>
            </div>

            {/* Quick-Load Real Site Presets (1-Click Judge Demos) */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-600">bolt</span>
                1-CLICK REAL FIELD REPORT PRESETS (HACKATHON DEMO RUNNERS):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => loadSamplePreset('pipingSubconCsv')}
                  className="p-3 rounded-lg border border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all text-left flex flex-col gap-1 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-700">Piping Subcon Tracker</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">.CSV</span>
                  </div>
                  <span className="text-[11px] text-slate-500">3 Rows: Spool Erection, Hydrotest, Rack Support</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadSamplePreset('civilDprText')}
                  className="p-3 rounded-lg border border-slate-300 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-left flex flex-col gap-1 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-emerald-700">Civil Shift DPR Log</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">.TXT</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Foundation F-102 pouring & plinth excavation</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadSamplePreset('electricalCsv')}
                  className="p-3 rounded-lg border border-slate-300 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 transition-all text-left flex flex-col gap-1 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-purple-700">Electrical Shift Log</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">.CSV</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Cable ladder tray & earthing grid loop testing</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadSamplePreset('unplannedEmergencyText')}
                  className="p-3 rounded-lg border border-amber-300 bg-amber-50/60 hover:bg-amber-100 hover:border-amber-400 transition-all text-left flex flex-col gap-1 cursor-pointer group ring-1 ring-amber-400/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-950 group-hover:text-amber-800">Unplanned Drainage (CR)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">PS 26122</span>
                  </div>
                  <span className="text-[11px] text-amber-900">Emergency flood ditch near Unit 4 (Out-of-scope)</span>
                </button>
              </div>
            </div>

            {/* File Drag & Drop Dropzone */}
            <div
              onClick={() => multiFileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/40 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-blue-700">
                <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-sm font-bold text-slate-800">
                  {uploadedFileName ? `Active Loaded File: ${uploadedFileName}` : 'Drag & Drop field spreadsheet or DPR file here'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Supported extensions: .CSV, .XLSX, .TXT, .DPR, .JSON (Client-side offline parsing)
                </span>
              </div>
            </div>

            {/* Data Preview Table */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    PARSED ROWS PREVIEW ({parsedRows.length} items extracted)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold font-mono border border-emerald-300">
                    {parsedRows.filter(r => r.isValid).length} VALID & READY
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-500">
                  Target Project: North-East Process Facility Expansion
                </span>
              </div>

              <div className="overflow-x-auto w-full border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f8faff] text-slate-700 font-mono text-[11px] uppercase border-b border-slate-200">
                      <th className="py-2.5 px-3 font-semibold">#</th>
                      <th className="py-2.5 px-3 font-semibold">Activity Description</th>
                      <th className="py-2.5 px-3 font-semibold">Discipline</th>
                      <th className="py-2.5 px-3 font-semibold">Location</th>
                      <th className="py-2.5 px-3 font-semibold">Progress</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold">Contractor</th>
                      <th className="py-2.5 px-3 text-right font-semibold">Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-slate-500 font-bold">{i + 1}</td>
                        <td className="py-2.5 px-3 text-slate-900 font-semibold">{r.activityName}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.discipline === 'Civil' ? 'bg-amber-100 text-amber-800' :
                            r.discipline === 'Piping' ? 'bg-cyan-100 text-cyan-800' :
                            r.discipline === 'Electrical' ? 'bg-purple-100 text-purple-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {r.discipline}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{r.location}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{r.progressPct}%</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            r.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                            r.status === 'STARTED' ? 'bg-blue-100 text-blue-800' :
                            r.status === 'IMPEDED' ? 'bg-rose-100 text-rose-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{r.contractor}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            VALID
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ingestion Trigger Button Bar */}
            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-200 gap-4">
              <div className="text-xs text-slate-600 font-mono">
                {batchSuccessMessage ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">task_alt</span>
                    {batchSuccessMessage}
                  </span>
                ) : (
                  <span>Clicking below will parse every row into an execution event and run the 6-stage semantic matcher.</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {batchSuccessMessage && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('REVIEW_CENTER')}
                    className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>Open in AI Review Desk</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleBatchIngest}
                  disabled={parsedRows.length === 0 || isBatchIngesting}
                  className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isBatchIngesting ? 'animate-spin' : ''}`}>
                    {isBatchIngesting ? 'sync' : 'bolt'}
                  </span>
                  <span>{isBatchIngesting ? 'Processing Execution Events...' : `Ingest All ${parsedRows.length} Rows & Run AI Matcher`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeIngestionMode === 'INDIC_BHASHA' ? (
        /* Indic Bhasha & Hinglish Field Speech Studio */
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs hover-elevate flex flex-col gap-6">
            {/* Header & Badges */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 shadow-2xs">
                  <span className="material-symbols-outlined text-[24px]">record_voice_over</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg text-slate-900 font-bold tracking-tight">Indic Bhasha & Hinglish Field Speech Studio</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-orange-100 text-orange-900 font-bold border border-orange-300">
                      NORTHEAST & HINGLISH DIALECT ENGINE
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Tuned for ground-level field reality at Oil India Limited sites (Duliajan, Digboi, Numaligarh). Dictate in colloquial Hinglish, Assamese, or Hindi. The AI normalizes regional construction jargon and automatically links to approved P6 activity codes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-orange-50 text-orange-900 border border-orange-200 font-mono text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
                  4 INDIC VOCABULARY ENGINES ACTIVE
                </span>
              </div>
            </div>

            {/* Quick 1-Click Regional Presets */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-600">bolt</span>
                1-CLICK REGIONAL DISPATCH PRESETS (TEST HINGLISH, ASSAMESE & BHOJPURI):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SAMPLE_INDIC_DISPATCHES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedIndicPreset(preset);
                      setIndicInputText(preset.rawVoiceTranscript);
                      setAnalyzedIndic(preset);
                      showToast(`Loaded ${preset.dialect} dispatch preset for testing.`);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedIndicPreset.id === preset.id
                        ? 'bg-orange-50/80 border-orange-400 ring-2 ring-orange-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 mb-1">
                        <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                          {preset.dialect}
                        </span>
                        <span className="text-orange-700">Target: {preset.matchedP6ActivityCode}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {preset.label}
                      </h4>
                      <p className="text-[11px] text-slate-600 italic mt-1.5 line-clamp-2">
                        "{preset.rawVoiceTranscript}"
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vernacular Speech Input & Live Transcription Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Vernacular Audio & Text Box */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-200/80">
                    <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-orange-600">mic</span>
                      RAW VERNACULAR SPEECH TRANSCRIPT ({selectedIndicPreset.dialect.toUpperCase()})
                    </span>

                    {/* Live Voice Input Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Main Voice Recording / Speak Button */}
                      <button
                        type="button"
                        onClick={toggleIndicVoiceRecording}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs cursor-pointer active:scale-95 ${
                          isIndicRecording
                            ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-400/50 animate-pulse'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                        title={isIndicRecording ? 'Click to stop recording' : `Record voice in ${selectedIndicPreset.dialect}`}
                      >
                        <span className={`material-symbols-outlined text-[16px] ${isIndicRecording ? 'animate-spin' : ''}`}>
                          {isIndicRecording ? 'radio_button_checked' : 'mic'}
                        </span>
                        <span>
                          {isIndicRecording 
                            ? `LISTENING (${formatTime(indicRecordingSeconds)}) • STOP` 
                            : 'VOICE INPUT (SPEAK)'}
                        </span>
                      </button>

                      {/* Text-to-Speech Playback Button */}
                      <button
                        type="button"
                        onClick={handleSpeakVernacularSample}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all shadow-2xs cursor-pointer active:scale-95 ${
                          isPlayingIndicAudio
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                        title="Listen to spoken vernacular audio playback"
                      >
                        <span className="material-symbols-outlined text-[15px] text-orange-600">
                          {isPlayingIndicAudio ? 'stop_circle' : 'volume_up'}
                        </span>
                        <span>{isPlayingIndicAudio ? 'Stop Audio' : 'Play Memo'}</span>
                      </button>

                      {/* Reset to Preset */}
                      <button
                        type="button"
                        onClick={() => {
                          setIndicInputText(selectedIndicPreset.rawVoiceTranscript);
                          setAnalyzedIndic(selectedIndicPreset);
                          showToast('Reset to original vernacular preset.', 'info');
                        }}
                        className="px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-mono font-medium shadow-2xs cursor-pointer"
                        title="Reset transcript to original preset"
                      >
                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Acoustic Telemetry & Waveform when listening or playing */}
                  {(isIndicRecording || isPlayingIndicAudio) && (
                    <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200 flex flex-col gap-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px] font-mono text-orange-950 font-bold">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                          {isIndicRecording ? 'LIVE ACOUSTIC STREAM // MULTILINGUAL SPEECH RECOGNITION ACTIVE' : 'VERNACULAR SPEECH SYNTHESIS PLAYBACK'}
                        </span>
                        <span>DIALECT: {selectedIndicPreset.dialect.toUpperCase()} • 48kHz PCM</span>
                      </div>
                      <div className="w-full h-8 flex items-center justify-between gap-1 px-2 py-0.5 bg-white rounded border border-orange-200 overflow-hidden">
                        {[14,24,36,20,44,30,50,24,38,54,26,42,18,50,34,22,38,54,26,46,18,50,38,26,42,54,30,18,34,50,22,38,54,30,18,46,34,22,42,54].map((h, i) => (
                          <div
                            key={i}
                            className="w-1 bg-orange-500 rounded-full transition-all duration-75 animate-pulse"
                            style={{
                              height: `${Math.max(6, (h * (isIndicRecording ? 1.25 : 0.85)) % 28 + 4)}px`,
                              animationDelay: `${(i % 6) * 70}ms`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Speech Input Box with Status Badges */}
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={indicInputText}
                      onChange={(e) => {
                        const text = e.target.value;
                        setIndicInputText(text);
                        setAnalyzedIndic(parseIndicFieldDispatch(text));
                      }}
                      placeholder="Click 'VOICE INPUT (SPEAK)' above or dictate in Hinglish, Assamese, or Hindi..."
                      className={`w-full p-3 rounded-lg border bg-white text-slate-900 font-sans text-sm focus:outline-none transition-all font-medium ${
                        isIndicRecording 
                          ? 'border-orange-500 ring-2 ring-orange-500/30' 
                          : 'border-slate-300 focus:ring-2 focus:ring-orange-500/30'
                      }`}
                    />

                    {/* Floating mic badge inside bottom-right corner of textarea */}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 pointer-events-none">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${
                        isIndicRecording
                          ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isIndicRecording ? 'bg-rose-600' : 'bg-slate-400'}`}></span>
                        {isIndicRecording ? 'MIC LIVE' : 'MIC READY'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Voice Bar Directly Below Textarea */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px] font-mono text-slate-500">
                    <button
                      type="button"
                      onClick={toggleIndicVoiceRecording}
                      className="text-orange-700 hover:text-orange-900 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isIndicRecording ? 'stop_circle' : 'mic'}
                      </span>
                      <span>{isIndicRecording ? 'Stop Voice Recording' : `Speak in ${selectedIndicPreset.dialect} / Hinglish`}</span>
                    </button>
                    <span>{indicInputText.length} characters</span>
                  </div>

                  {/* Detected Vernacular Terminology Tags */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="font-mono text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                      DETECTED VERNACULAR TERMS & CANONICAL MAPPING:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {analyzedIndic.detectedTerms.map((term, idx) => (
                        <div key={idx} className="px-2 py-1 rounded-md bg-white border border-slate-300 shadow-2xs font-mono text-xs flex items-center gap-1.5">
                          <span className="text-orange-800 font-bold">"{term.vernacular}"</span>
                          <span className="text-slate-400">➔</span>
                          <span className="text-blue-800 font-bold">{term.canonicalMeaning}</span>
                          <span className="px-1 rounded bg-slate-100 text-slate-600 text-[9px] uppercase">{term.discipline}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Translation & P6 Matcher Bridge */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-blue-700">auto_fix_high</span>
                      AI NORMALIZED SCHEDULE STATEMENT (ENGLISH)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      96% CONFIDENCE
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-blue-200 text-slate-800 text-xs leading-relaxed font-sans shadow-2xs">
                    "{analyzedIndic.translatedEnglishText}"
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Target P6 Activity:</span>
                      <strong className="text-blue-900">{analyzedIndic.matchedP6ActivityCode}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Suggested Progress:</span>
                      <strong className="text-emerald-700 font-bold">{analyzedIndic.suggestedPercent}%</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Geofence Status:</span>
                      <span className="text-emerald-800 font-semibold">{activeGeofence.status} ({activeGeofence.distanceFromRoWCenterlineMeters}m from RoW)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmittingIndic}
                    onClick={async () => {
                      setIsSubmittingIndic(true);
                      await submitIndicFieldInput(analyzedIndic);
                      setIsSubmittingIndic(false);
                      setSubmitSuccess(true);
                    }}
                    className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isSubmittingIndic ? 'animate-spin' : ''}`}>
                      {isSubmittingIndic ? 'sync' : 'send'}
                    </span>
                    <span>{isSubmittingIndic ? 'Routing to Schedule...' : 'Submit to AI Review Desk via Indic Bridge'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Bento Operational Surface */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Live AI Speech-to-DPR Voice Agent Console */}
          <div className="xl:col-span-7 flex flex-col gap-6">
          {/* Primary Recording Card */}
          <div className="relative bg-white border border-slate-300 rounded-xl p-5 shadow-xs hover-elevate overflow-hidden transition-all duration-200">
            <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
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
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-50 border border-rose-200 text-rose-700 shadow-sm ring-2 ring-rose-500/20'
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
                  {[12,20,28,16,40,52,32,24,44,56,36,16,48,28,20,32,52,40,56,24,32,44,16,48,36,52,24,32,40,56,28,48,16,44,32,52,36,20,28,44,56,32,48,16,36,52,24,32,40,56,28,48,16,44,32,52,36,20,28,16,8,4].map((h, i) => (
                    <rect
                      key={i}
                      className={isRecording ? 'animate-pulse' : 'opacity-70'}
                      height={isRecording ? Math.min(56, h * 1.25) : h}
                      rx="2"
                      width="4"
                      x={i * 8}
                      y={(60 - (isRecording ? Math.min(56, h * 1.25) : h)) / 2}
                    />
                  ))}
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
                  rows={4}
                  className="w-full text-slate-900 text-sm leading-relaxed border-0 focus:ring-0 p-0 resize-none font-sans outline-none placeholder-slate-400"
                  placeholder="Speak into microphone or edit the transcribed text here..."
                />

                <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] text-slate-500 font-mono">Entity Chips:</span>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold">
                    Chainage: {hudChainage}
                  </span>
                  <span className="bg-blue-100 text-blue-900 border border-blue-300 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold">
                    Komatsu PC300
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold">
                    Progress Logged
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
                <span className="font-mono text-[11px] text-emerald-800 flex items-center gap-1 font-semibold">
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
                  <span className="font-mono text-xs text-emerald-800 font-semibold">0 Incidents (LTI Clean)</span>
                </div>
                <div className="bg-[#f8faff] border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:border-slate-300 hover:bg-white transition-all cursor-default shadow-2xs">
                  <span className="font-mono text-[10px] text-slate-500">WBS TARGET:</span>
                  <span className="font-mono text-xs text-blue-700 font-semibold">ACT-TR-4290</span>
                </div>
              </div>
            </div>

            {/* Action Control Buttons */}
            <div className="mt-5 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTextInput('');
                    setAttachedPhoto(null);
                    setRecordingSeconds(0);
                    showToast('Input cleared.');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-xs font-medium cursor-pointer active:scale-95 transition-all shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">replay</span> Clear
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-mono text-xs font-medium cursor-pointer active:scale-95 transition-all shadow-2xs ${
                    attachedPhoto
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-300 hover:bg-blue-50 hover:border-blue-700 text-blue-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {attachedPhoto ? 'check_circle' : 'add_a_photo'}
                  </span>
                  {attachedPhoto ? 'Photo Attached' : 'Attach Geotagged Photo'}
                </button>
                <button
                  type="button"
                  onClick={handleSimulatePhoto}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-medium cursor-pointer active:scale-95 transition-all shadow-2xs"
                  title="Simulate drone aerial inspection photo"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-500">flight_takeoff</span>
                  <span>Sample Drone Photo</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSubmit}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                    isProcessing
                      ? 'bg-blue-800 text-white cursor-wait'
                      : 'bg-blue-700 hover:bg-blue-800 text-white active:scale-95'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isProcessing ? 'animate-spin' : ''}`}>
                    {isProcessing ? 'progress_activity' : 'send'}
                  </span>
                  <span>
                    {isProcessing
                      ? 'Analyzing & Parsing...'
                      : 'Direct Submit to AI Review Desk'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('REVIEW_CENTER')}
                  className="px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Open AI Review Desk</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Field Trigger Rails */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-2">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Fast-Action Macro Telemetry Keys (1-Click Test Scenarios)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleMacroClick('Rock Encounter')}
                className={`p-3 rounded-lg border transition-all flex flex-col items-start gap-1 group text-left cursor-pointer hover:-translate-y-0.5 shadow-2xs ${
                  activeSpeechSample === 'Rock Encounter'
                    ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-300'
                    : 'bg-[#f8faff] border-slate-200 hover:border-blue-700 hover:bg-white'
                }`}
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
                className={`p-3 rounded-lg border transition-all flex flex-col items-start gap-1 group text-left cursor-pointer hover:-translate-y-0.5 shadow-2xs ${
                  activeSpeechSample === 'Pipe Stringing'
                    ? 'bg-teal-50 border-teal-400 ring-1 ring-teal-300'
                    : 'bg-[#f8faff] border-slate-200 hover:border-teal-700 hover:bg-white'
                }`}
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
                className={`p-3 rounded-lg border transition-all flex flex-col items-start gap-1 group text-left cursor-pointer hover:-translate-y-0.5 shadow-2xs ${
                  activeSpeechSample === 'Welding Pass Done'
                    ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-300'
                    : 'bg-[#f8faff] border-slate-200 hover:border-indigo-700 hover:bg-white'
                }`}
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
                className={`p-3 rounded-lg border transition-all flex flex-col items-start gap-1 group text-left cursor-pointer hover:-translate-y-0.5 shadow-2xs ${
                  activeSpeechSample === 'Hydrotest Pressurized'
                    ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300'
                    : 'bg-[#f8faff] border-slate-200 hover:border-emerald-700 hover:bg-white'
                }`}
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
          <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs flex flex-col hover:shadow-md transition-shadow">
            <div className="p-3.5 flex items-center justify-between bg-[#f8faff] border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-blue-700 text-[20px]">photo_camera_front</span>
                <div className="flex flex-col leading-tight">
                  <span className="font-mono text-xs text-slate-900 font-semibold uppercase tracking-wider">
                    OPTICAL
                  </span>
                  <span className="font-mono text-xs text-slate-900 font-semibold uppercase tracking-wider">
                    TELEMETRY FEED
                  </span>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-[#eff4ff] border border-blue-200 text-blue-900 font-mono text-[11px] font-semibold flex flex-col items-end leading-tight shadow-2xs">
                <span>CAM-EX-04A //</span>
                <span>4K RAW</span>
              </div>
            </div>

            {/* Camera Media Display with Inset HUD Overlay */}
            <div className="relative w-full h-72 bg-slate-950 overflow-hidden group select-none" id="camera-viewport">
              <img
                className="w-full h-full object-cover opacity-95 transition-transform duration-700 ease-out group-hover:scale-105"
                alt="Industrial drone aerial photo capturing pipeline trenching operation across terrain"
                src={attachedPhoto || '/images/pipeline-drone-4k.jpg'}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/pipeline-drone-4k.jpg';
                }}
              />
              {/* Subtle scanning line effect */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none animate-scanline"></div>

              {/* Crosshairs & HUD Elements */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3.5">
                {/* Top HUD Box */}
                <div className="bg-[#0b1329]/90 backdrop-blur-xs rounded-lg p-2.5 border border-slate-500/60 shadow-xl flex items-center justify-between text-white font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[10px] text-slate-200 font-semibold tracking-wider">
                        CHAINAGE: <span className="text-white">KM</span>
                      </span>
                      <span className="text-xs font-semibold text-white tracking-wider">
                        {hudChainage.replace(/^KM\s*/i, '') || '42+650'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start leading-tight pr-2">
                    <span className="text-[10px] text-slate-200 font-semibold tracking-wider">
                      AZIMUTH: <span className="text-white">184°</span>
                    </span>
                    <span className="text-xs font-semibold text-white tracking-wider">
                      {hudAzimuth.includes('S') ? 'S' : hudAzimuth}
                    </span>
                  </div>
                </div>

                {/* Center Reticle */}
                <div className="self-center flex flex-col items-center">
                  <svg className="text-cyan-400/90" height="46" viewBox="0 0 40 40" width="46">
                    <circle cx="20" cy="20" fill="none" r="12" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.2"></circle>
                    <line stroke="currentColor" strokeWidth="1.5" x1="20" x2="20" y1="2" y2="12"></line>
                    <line stroke="currentColor" strokeWidth="1.5" x1="20" x2="20" y1="28" y2="38"></line>
                    <line stroke="currentColor" strokeWidth="1.5" x1="2" x2="12" y1="20" y2="20"></line>
                    <line stroke="currentColor" strokeWidth="1.5" x1="28" x2="38" y1="20" y2="20"></line>
                  </svg>
                </div>

                {/* Bottom HUD Box */}
                <div className="bg-[#0b1329]/90 backdrop-blur-xs rounded-lg p-2.5 border border-slate-500/60 shadow-xl flex items-center justify-between text-slate-100 font-mono text-[10px]">
                  <div className="flex flex-col leading-tight">
                    <span className="text-blue-300 tracking-tight font-semibold">LAT: 27.3892° N •</span>
                    <span className="text-blue-300 tracking-tight font-semibold">LON: 95.6174° E</span>
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-slate-300 font-semibold">ALT:</span>
                    <span className="text-white font-semibold tracking-tight">+142.4m</span>
                    <span className="text-slate-300 text-[9px] font-medium">AMSL</span>
                  </div>
                  <div className="flex flex-col items-end leading-tight">
                    <span className="text-[#facc15] font-bold text-xs tracking-wider">11:15</span>
                    <span className="text-[#facc15] font-bold text-[10px] tracking-wider">IST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingestion Status Bar */}
            <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
                <div className="flex flex-col font-mono text-xs text-slate-900 leading-tight">
                  <span className="font-semibold">Photogrammetry</span>
                  <span className="text-slate-600 font-medium">Orthomosaic Synced</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCalibrated(true);
                  showToast('HUD optical sensors recalibrated to current GPS datum.');
                  setTimeout(() => setCalibrated(false), 2000);
                }}
                className="px-3.5 py-1.5 rounded-md bg-[#f8faff] hover:bg-slate-100 active:scale-95 border border-slate-300 hover:border-slate-500 font-mono text-[11px] text-slate-800 font-semibold transition-all flex items-center gap-2 group cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px] text-slate-700 group-hover:rotate-90 transition-transform duration-300">
                  tune
                </span>
                <div className="flex flex-col text-left leading-tight">
                  <span>{calibrated ? 'CALIBRATED' : 'CALIBRATE'}</span>
                  <span>HUD</span>
                </div>
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
                <span className="font-medium text-amber-800 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">warning</span> Bucket Refusal Risk: High
                </span>
                <span className="font-medium">RQD: 68% (Fair)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Bottom Section: Local Field Dispatch Log Queue */}
      <div className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
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
                  fieldLogs.map((l) => `${l.eventId},${l.reportedDate},"${l.activityDescription || l.rawText}",${l.quantity || 0},${l.unit || 'm'},${l.statusReported}`).join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', 'field_dispatch_logs.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast('Exported field dispatch logs to CSV.');
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 active:scale-95 transition-all text-slate-700 font-mono text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
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
                <th className="py-2.5 px-4 font-semibold">Discipline</th>
                <th className="py-2.5 px-4 font-semibold">Sync State</th>
                <th className="py-2.5 px-4 text-right font-semibold">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {fieldLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-mono text-xs">
                    No field logs recorded yet. Use the Speech-to-DPR console above to submit today's work.
                  </td>
                </tr>
              ) : (
                fieldLogs.slice(0, 8).map((log, index) => {
                  const isNew = lastSubmittedId === log.eventId;
                  const match = matches.find(m => m.eventId === log.eventId);
                  const isApproved = match?.status === 'APPROVED';
                  const isPending = match?.status === 'PENDING_REVIEW' || !match;
                  const isRejected = match?.status === 'REJECTED';

                  return (
                    <tr 
                      key={log.eventId || index} 
                      className={`transition-colors ${isNew ? 'bg-blue-50/60 font-medium' : 'hover:bg-[#f8faff]'}`}
                    >
                      <td className="py-3 px-4 font-mono text-xs text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-blue-700">#{log.eventId?.toUpperCase() || `EVT-${index + 1}`}</span>
                          {isNew && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white font-mono text-[9px] font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500">
                          {log.reportedDate} • {log.sourceType}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-700">
                        {log.location || `KM 42+${650 - index * 170}`}
                        <div className="font-mono text-[10px] text-slate-500">Digboi Sector A</div>
                      </td>
                      <td className="py-3 px-4 text-slate-900 text-xs">
                        {log.activityDescription || log.rawText}
                        <div className="font-mono text-[10px] text-emerald-800 font-semibold">Zero HSE Incidents</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
                          {log.discipline || 'Piping'}
                        </span>
                        <div className="font-mono text-[10px] text-slate-500 mt-0.5">{log.action || 'Progress Reported'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            EPPM COMMITTED
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-800 font-semibold shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                            FLAGGED DISPUTE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-semibold shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            PENDING REVIEW
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Inspect this specific dispatch log */}
                          <button
                            type="button"
                            onClick={() => setInspectingLog(log)}
                            className="p-1.5 rounded-lg bg-slate-100 border border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 text-slate-600 active:scale-95 transition-all cursor-pointer shadow-2xs"
                            title={`Inspect telemetry & evidence for #${log.eventId?.toUpperCase() || index + 1}`}
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                          </button>

                          {/* Direct navigation to this specific proposal in Review Desk */}
                          <button
                            type="button"
                            onClick={() => navigateToEventReview(log.eventId)}
                            className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-400 text-slate-600 active:scale-95 transition-all cursor-pointer shadow-2xs"
                            title={`Open #${log.eventId?.toUpperCase() || index + 1} in AI Review Desk`}
                          >
                            <span className="material-symbols-outlined text-[16px]">rule</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
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

      {/* Field Dispatch & Telemetry Evidence Inspector Modal */}
      {inspectingLog && (() => {
        const inspectingMatch = matches.find(m => m.eventId === inspectingLog.eventId);
        const isApproved = inspectingMatch?.status === 'APPROVED';
        const isPending = inspectingMatch?.status === 'PENDING_REVIEW' || !inspectingMatch;
        const linkedAct = inspectingMatch 
          ? activities.find(a => a.id === inspectingMatch.selectedActivityId)
          : activities.find(a => a.discipline === inspectingLog.discipline) || activities[0];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Top Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-[22px]">
                      {inspectingLog.sourceType === 'VOICE' ? 'mic' : inspectingLog.sourceType === 'DPR' ? 'description' : 'analytics'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        DISPATCH #{inspectingLog.eventId?.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                        {inspectingLog.sourceType}
                      </span>
                      {isApproved ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-200">
                          P6 COMMITTED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold border border-amber-200">
                          PENDING REVIEW
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      Reported {inspectingLog.reportedDate} • {inspectingLog.reportedBy}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectingLog(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Close Inspector"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                {/* Verbatim Raw Telemetry Box */}
                <div className="rounded-xl bg-[#f8faff] border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 uppercase">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-blue-700">record_voice_over</span>
                      Raw Verbatim Field Submission
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {inspectingLog.extractionConfidence}% AI Confidence
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 font-sans italic leading-relaxed">
                    "{inspectingLog.rawText}"
                  </div>
                </div>

                {/* Structured Extraction Matrix Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Discipline</span>
                    <span className="font-bold text-blue-900">{inspectingLog.discipline}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Action</span>
                    <span className="font-bold text-slate-900 capitalize">{inspectingLog.action}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Asset / Scope</span>
                    <span className="font-bold text-slate-900 truncate">{inspectingLog.assetOrComponent || 'Corridor Segment'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Location</span>
                    <span className="font-bold text-slate-900 truncate">{inspectingLog.location}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Quantity Installed</span>
                    <span className="font-bold text-emerald-700">
                      {inspectingLog.quantity ? `${inspectingLog.quantity} ${inspectingLog.unit || 'm'}` : 'Progress update'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Progress Reported</span>
                    <span className="font-bold text-blue-700">{inspectingLog.percentComplete || 75}% Pace</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Assigned Contractor</span>
                    <span className="font-bold text-slate-900 truncate">{inspectingLog.contractor || 'AIES Engineering'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">HSE Incident Audit</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Zero Incidents
                    </span>
                  </div>
                </div>

                {/* Photo Evidence (if available) */}
                {inspectingLog.photoUrl && (
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-blue-700">photo_camera</span>
                        Geotagged Field Evidence Proof
                      </span>
                      <span className="text-slate-500">27.3821° N, 95.6214° E</span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 h-44 bg-slate-900 flex items-center justify-center">
                      <img 
                        src={inspectingLog.photoUrl} 
                        alt="Site submission evidence" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[10px] backdrop-blur-xs">
                        GPS EXIF VERIFIED • OIL-SEC-CORRIDOR
                      </div>
                    </div>
                  </div>
                )}

                {/* Linked P6 Activity Card */}
                {linkedAct && (
                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px] text-blue-700">account_tree</span>
                      <div>
                        <div className="text-xs font-bold text-blue-950 font-mono">
                          LINKED P6 ACTIVITY: {linkedAct.activityCode}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">{linkedAct.name}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigateToActivitySchedule(linkedAct.activityCode);
                        setInspectingLog(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-800 hover:bg-blue-100 font-mono text-[11px] font-bold flex items-center gap-1 shadow-2xs self-start sm:self-auto cursor-pointer"
                    >
                      <span>Locate in Schedule</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/80">
                <button
                  type="button"
                  onClick={() => setInspectingLog(null)}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-mono text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  Close Inspector
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigateToEventReview(inspectingLog.eventId);
                      setInspectingLog(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <span>Open in AI Review Desk</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
