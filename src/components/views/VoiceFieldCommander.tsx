import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../services/store';
import { 
  parseVoiceFieldTranscript, 
  ParsedVoiceCommand, 
  speakSpokenFeedback 
} from '../../services/voiceCommandEngine';

interface VoiceFieldCommanderProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const VoiceFieldCommander: React.FC<VoiceFieldCommanderProps> = ({ 
  isOpen = false, 
  onClose 
}) => {
  const { 
    setActiveTab, 
    submitFieldInput, 
    showToast,
    isVoiceCommanderOpen,
    setIsVoiceCommanderOpen 
  } = useApp();

  const isVisible = isOpen || isVoiceCommanderOpen;
  const handleClose = onClose || (() => setIsVoiceCommanderOpen(false));

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [activeCommand, setActiveCommand] = useState<ParsedVoiceCommand | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English / Hinglish

      recognition.onstart = () => {
        setIsListening(true);
        setAudioLevel(0.8);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          processTranscript(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setAudioLevel(0);
      };

      recognition.onend = () => {
        setIsListening(false);
        setAudioLevel(0);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Process text into intent
  const processTranscript = (text: string) => {
    const parsed = parseVoiceFieldTranscript(text);
    setActiveCommand(parsed);

    if (speechSynthesisActive) {
      speakSpokenFeedback(parsed.spokenFeedback);
    }
  };

  const startListening = () => {
    setTranscript('');
    setActiveCommand(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition already started or error:', err);
      }
    } else {
      showToast('Web Speech API not supported in this browser. Use preset commands below.', 'info');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }
    setIsListening(false);
  };

  // Execute parsed command
  const executeCommand = async () => {
    if (!activeCommand) return;

    if (activeCommand.intent === 'NAVIGATE' && activeCommand.extractedParams.targetTab) {
      setActiveTab(activeCommand.extractedParams.targetTab as any);
      showToast(activeCommand.spokenFeedback, 'success');
      handleClose();
    } else if (activeCommand.intent === 'LOG_PROGRESS') {
      const textToLog = `[VOICE DISPATCH] ${activeCommand.extractedParams.action} at ${activeCommand.extractedParams.locationOrChainage}: ${activeCommand.extractedParams.progressPercent}% recorded`;
      await submitFieldInput(textToLog, 'VOICE');
      showToast(`Logged: ${activeCommand.extractedParams.action} (${activeCommand.extractedParams.progressPercent}%)`, 'success');
      handleClose();
    } else if (activeCommand.intent === 'APPROVE') {
      setActiveTab('REVIEW_CENTER');
      showToast('Opening Review Desk for pending actuals approval.', 'info');
      handleClose();
    } else {
      showToast(activeCommand.spokenFeedback, 'info');
      handleClose();
    }
  };

  // Demo Presets for judges
  const runPreset = (presetText: string) => {
    setTranscript(presetText);
    processTranscript(presetText);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto cursor-pointer"
      onClick={handleClose}
      aria-hidden="true"
    >
      <div 
        className="bg-white dark:bg-[#0c1220] rounded-2xl border border-slate-300 dark:border-amber-500/20 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-y-auto animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 bg-slate-50 dark:bg-[#080d19] border-b border-slate-200 dark:border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 dark:bg-amber-500 text-white dark:text-slate-950 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[19px]">mic</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm font-sans flex items-center gap-1.5">
                Hands-Free Voice Field Commander
                <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-mono text-[9px] font-bold border border-amber-300 dark:border-amber-600/50">
                  GLOVE / HELMET MODE
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Assam Oilfield Acoustic Noise Filtering • SIH26122
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-amber-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close Voice Commander"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Central Audio Reactive Listening Zone */}
        <div className="p-6 flex flex-col items-center justify-center text-center gap-4 bg-slate-50/50 dark:bg-[#060a12]/60">
          <div className="relative">
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-blue-500/20 dark:bg-amber-500/20 animate-ping"></div>
            )}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl active:scale-95 cursor-pointer ${
                isListening 
                  ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-300 dark:ring-rose-500/40 animate-pulse' 
                  : 'bg-blue-700 dark:bg-gradient-to-r dark:from-amber-500 dark:to-amber-600 hover:bg-blue-800 dark:hover:from-amber-400 dark:hover:to-amber-500 dark:text-slate-950'
              }`}
            >
              <span className="material-symbols-outlined text-[36px]">
                {isListening ? 'graphic_eq' : 'mic'}
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-1 items-center">
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
              {isListening ? 'LISTENING... SPEAK CLEARLY' : 'TAP MIC TO SPEAK'}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Speak a field update, navigation command, or status inquiry.
            </p>
          </div>

          {/* Transcript Display Box */}
          <div className="w-full min-h-[56px] p-3 rounded-xl bg-white dark:bg-[#070b14] border border-slate-300 dark:border-amber-500/30 text-xs font-mono text-slate-800 dark:text-slate-200 flex items-center justify-center text-center shadow-2xs">
            {transcript ? (
              <span className="font-semibold text-slate-900 dark:text-amber-400">"{transcript}"</span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500 italic">"Log 80% progress on welding at KM 45..."</span>
            )}
          </div>
        </div>

        {/* Parsed Parameter Extraction Display */}
        {activeCommand && (
          <div className="p-4 border-t border-slate-200 dark:border-amber-500/20 bg-white dark:bg-[#0c1220] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">check_circle</span>
                Extracted Field Intent: <strong>{activeCommand.intent}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-300 dark:border-emerald-700/50">
                CONFIDENCE: {(activeCommand.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-amber-500/20 flex flex-col">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase">Action</span>
                <strong className="text-slate-900 dark:text-slate-100 truncate">{activeCommand.extractedParams.action || 'Navigation'}</strong>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-amber-500/20 flex flex-col">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase">Location</span>
                <strong className="text-blue-700 dark:text-sky-400 truncate">{activeCommand.extractedParams.locationOrChainage || 'Project Level'}</strong>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-amber-500/20 flex flex-col">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase">Progress</span>
                <strong className="text-emerald-700 dark:text-emerald-400 truncate">{activeCommand.extractedParams.progressPercent !== undefined ? `${activeCommand.extractedParams.progressPercent}%` : 'N/A'}</strong>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-amber-500/20 flex flex-col">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase">Discipline</span>
                <strong className="text-purple-700 dark:text-purple-400 truncate">{activeCommand.extractedParams.discipline || 'General'}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-blue-50/60 dark:bg-sky-950/30 p-2.5 rounded-lg border border-blue-200 dark:border-sky-800/40">
              🗣️ "{activeCommand.spokenFeedback}"
            </p>

            {/* Execute Button */}
            <button
              onClick={executeCommand}
              className="w-full py-2.5 rounded-lg bg-emerald-700 dark:bg-emerald-600 hover:bg-emerald-800 text-white font-mono text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              <span>Confirm &amp; Execute Voice Command</span>
            </button>
          </div>
        )}

        {/* Quick Presets for Judges / No-Mic Demo */}
        <div className="p-4 bg-slate-50 dark:bg-[#080d19] border-t border-slate-200 dark:border-amber-500/20 flex flex-col gap-2">
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            Quick One-Click Test Commands (Judge Demonstration):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => runPreset('Log 80% progress on welding at KM 45')}
              className="p-2 rounded-lg bg-white dark:bg-[#0b1220] hover:bg-blue-50 dark:hover:bg-white/5 border border-slate-200 dark:border-amber-500/20 text-left text-xs font-mono text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-amber-400 transition-colors shadow-2xs cursor-pointer truncate"
            >
              🎙️ "Log 80% progress on welding at KM 45"
            </button>
            <button
              onClick={() => runPreset('Go to 3D corridor')}
              className="p-2 rounded-lg bg-white dark:bg-[#0b1220] hover:bg-blue-50 dark:hover:bg-white/5 border border-slate-200 dark:border-amber-500/20 text-left text-xs font-mono text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-amber-400 transition-colors shadow-2xs cursor-pointer truncate"
            >
              🎙️ "Go to 3D corridor"
            </button>
            <button
              onClick={() => runPreset('Open Blockchain Audit Ledger')}
              className="p-2 rounded-lg bg-white dark:bg-[#0b1220] hover:bg-blue-50 dark:hover:bg-white/5 border border-slate-200 dark:border-amber-500/20 text-left text-xs font-mono text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-amber-400 transition-colors shadow-2xs cursor-pointer truncate"
            >
              🎙️ "Open Blockchain Audit Ledger"
            </button>
            <button
              onClick={() => runPreset('Go to delay cascade simulator')}
              className="p-2 rounded-lg bg-white dark:bg-[#0b1220] hover:bg-blue-50 dark:hover:bg-white/5 border border-slate-200 dark:border-amber-500/20 text-left text-xs font-mono text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-amber-400 transition-colors shadow-2xs cursor-pointer truncate"
            >
              🎙️ "Go to delay cascade simulator"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
