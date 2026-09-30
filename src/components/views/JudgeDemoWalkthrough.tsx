import React, { useState, useEffect } from 'react';
import { useApp } from '../../services/store';

export const JudgeDemoWalkthrough: React.FC = () => {
  const { setActiveTab, commitP6Update } = useApp();

  const [activeGate, setActiveGate] = useState<number>(4);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSeconds, setAudioSeconds] = useState<number>(14);
  const [isCommitting, setIsCommitting] = useState<boolean>(false);
  const [committed, setCommitted] = useState<boolean>(false);
  const [tourRunning, setTourRunning] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(1);

  // Audio waveform playback simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioSeconds((sec) => (sec >= 38 ? 1 : sec + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const handleTogglePlay = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleStartTour = () => {
    setTourRunning(true);
    let step = 1;
    setActiveGate(1);
    const tourInterval = setInterval(() => {
      step++;
      setTourStep(step);
      if (step <= 5) {
        setActiveGate(step);
      } else {
        clearInterval(tourInterval);
        setTourRunning(false);
        setActiveGate(4);
      }
    }, 1500);
  };

  const handleResetSandbox = () => {
    setIsPlayingAudio(false);
    setAudioSeconds(14);
    setIsCommitting(false);
    setCommitted(false);
    setTourRunning(false);
    setActiveGate(4);
  };

  const handleCommitP6 = () => {
    if (isCommitting || committed) return;
    setIsCommitting(true);
    setTimeout(() => {
      setIsCommitting(false);
      setCommitted(true);
      commitP6Update();
    }, 1200);
  };

  const formatAudioTime = (sec: number) => {
    const s = sec < 10 ? `0${sec}` : `${sec}`;
    return `00:${s} / 00:38`;
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Top Header Banner & Actions */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-xs border border-slate-300 hover-elevate">
        <div className="flex flex-col gap-1.5 max-w-4xl">
          {/* Compliance Badges Ribbon */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-700 text-white font-mono text-[10px] uppercase font-bold">
              <span className="material-symbols-outlined text-[13px]">military_tech</span>
              Hackathon Jury Showcase
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] tracking-wider font-semibold">
              OIL-EXEC-DEMO-V4.8
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-[10px] font-medium border border-blue-200">
              <span className="material-symbols-outlined text-[13px] text-blue-700">verified</span>
              Ministry of Petroleum &amp; Natural Gas Compliant
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-semibold">
              STRICT AUDIT CVC-SEC-8.4
            </span>
          </div>

          {/* Main Title & Technical Subtitle */}
          <h1 className="text-xl text-slate-900 font-bold tracking-tight mt-1">
            SiteSync AI — 5-Minute Executive Jury &amp; Hackathon Demonstration Console
          </h1>
          <p className="text-xs text-slate-600">
            End-to-End Upstream Construction Intelligence: From Assamese Field Voice Memo to Oracle Primavera P6 Epistemic Ground Truth
          </p>
        </div>

        {/* Top Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto justify-end">
          <button
            type="button"
            onClick={handleResetSandbox}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-mono text-xs shadow-xs transition-all cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">restart_alt</span>
            Reset Live Sandbox
          </button>
          <button
            type="button"
            onClick={() => {
              alert('CVC Integrity Verification Package downloaded: SHA-256 Merkle Tree + Sentinel SAR Coherence Matrix.');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-mono text-xs shadow-xs transition-all cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">folder_zip</span>
            CVC Integrity Proof (.ZIP)
          </button>
          <button
            type="button"
            onClick={handleStartTour}
            className="flex items-center gap-2 px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-mono text-xs shadow-xs transition-all cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[17px]">
              {tourRunning ? 'record_voice_over' : 'play_circle'}
            </span>
            {tourRunning ? `Tour in Progress (${tourStep}/5)` : 'Start Guided 5-Min Tour'}
          </button>
        </div>
      </div>

      {/* 5-Gate Guided Progression Pipeline Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-white p-3.5 rounded-xl shadow-xs border border-slate-300 hover-elevate">
        {/* Gate 01 */}
        <div
          onClick={() => setActiveGate(1)}
          className={`flex flex-col gap-1 p-2.5 rounded cursor-pointer transition-all border ${
            activeGate === 1
              ? 'border-blue-700 bg-blue-50/80 shadow-xs'
              : 'bg-slate-50 border-transparent hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Gate 01</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[12px]">check</span> DONE
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900">Field Voice Ingestion</div>
          <div className="font-mono text-[10px] text-slate-500 truncate">Audio DPR #8820-03 Assamese/Hindi</div>
        </div>

        {/* Gate 02 */}
        <div
          onClick={() => setActiveGate(2)}
          className={`flex flex-col gap-1 p-2.5 rounded cursor-pointer transition-all border ${
            activeGate === 2
              ? 'border-blue-700 bg-blue-50/80 shadow-xs'
              : 'bg-slate-50 border-transparent hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Gate 02</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[12px]">check</span> DONE
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900">Entity Disambiguation</div>
          <div className="font-mono text-[10px] text-slate-500 truncate">420m laid, 2x PC300 → ACT-TR-4290</div>
        </div>

        {/* Gate 03 */}
        <div
          onClick={() => setActiveGate(3)}
          className={`flex flex-col gap-1 p-2.5 rounded cursor-pointer transition-all border ${
            activeGate === 3
              ? 'border-blue-700 bg-blue-50/80 shadow-xs'
              : 'bg-slate-50 border-transparent hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Gate 03</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[12px]">check</span> DONE
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900">Multi-Sensor Corroboration</div>
          <div className="font-mono text-[10px] text-slate-500 truncate">Sentinel-1 SAR + GNSS hard rock</div>
        </div>

        {/* Gate 04: Active Arbitration */}
        <div
          onClick={() => setActiveGate(4)}
          className={`flex flex-col gap-1 p-2.5 rounded cursor-pointer transition-all border ${
            activeGate === 4
              ? 'border-rose-400 bg-rose-50 text-rose-950 shadow-xs'
              : 'bg-slate-50 border-transparent hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-semibold text-rose-800">Gate 04</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              ARBITRATION
            </span>
          </div>
          <div className="text-xs font-bold text-rose-900">Dispute &amp; Claim Rejection</div>
          <div className="font-mono text-[10px] text-rose-700 truncate">11 dry days disproven: ₹2.10 Cr LD</div>
        </div>

        {/* Gate 05 */}
        <div
          onClick={() => setActiveGate(5)}
          className={`flex flex-col gap-1 p-2.5 rounded cursor-pointer transition-all border ${
            activeGate === 5
              ? 'border-blue-700 bg-blue-50/80 shadow-xs'
              : 'bg-slate-50 border-transparent hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Gate 05</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[12px]">schedule</span> READY
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900">Ledger Sync Oracle P6</div>
          <div className="font-mono text-[10px] text-slate-500 truncate">Merkle Root committed to EPPM</div>
        </div>
      </div>

      {/* 3-Column Demonstration Interactive Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* COLUMN 1: Stage 01 // Edge Ingestion */}
        <div className="flex flex-col gap-4 bg-white p-5 rounded-xl shadow-xs border border-slate-300 hover-elevate">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 rounded bg-blue-700"></div>
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-wider font-bold">
                STAGE 01 // EDGE INGESTION
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-[10px] font-semibold border border-blue-200">
              Assamese-Hindi ASR v3.2
            </span>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 -mt-1">
            <span>FIELD TELEMETRY DPR #8820-03</span>
            <span className="text-blue-700 font-mono">MIC LATENCY: 220ms</span>
          </div>

          {/* Audio Player Card */}
          <div className="flex flex-col gap-2.5 p-3 rounded bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-8 h-8 rounded bg-blue-700 text-white flex items-center justify-center shadow-xs hover:bg-blue-800 transition-all cursor-pointer"
                  title="Play telemetry recording"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPlayingAudio ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">DPR_8820_03_AssamSec4.wav</span>
                  <span className="font-mono text-[10px] text-slate-500">16kHz 24-bit PCM • Recorded 07:42 IST</span>
                </div>
              </div>
              <span className="font-mono text-xs text-blue-700 font-bold">
                {formatAudioTime(audioSeconds)}
              </span>
            </div>

            {/* Dynamic Waveform Visualizer */}
            <div className="h-10 w-full bg-slate-200 rounded p-1.5 flex items-center gap-1 overflow-hidden">
              {[35, 60, 85, 45, 95, 70, 30, 80, 100, 65, 90, 50, 75, 85, 40, 60, 25, 70, 50, 80, 35, 25, 50, 30, 15].map(
                (h, idx) => (
                  <span
                    key={idx}
                    className={`w-1 rounded ${idx < 14 ? 'bg-blue-700' : 'bg-slate-400'} ${
                      isPlayingAudio ? 'waveform-bar active-anim' : ''
                    }`}
                    style={{
                      height: `${h}%`,
                      animationDelay: `${(idx * 0.05).toFixed(2)}s`
                    }}
                  ></span>
                )
              )}
            </div>
          </div>

          {/* Auto-Transcript Card */}
          <div className="flex flex-col gap-2 p-3 rounded bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
                ASR Transcript (Dialect Disambiguated)
              </span>
              <span className="font-mono text-[10px] text-blue-700 font-bold">98.4% Confidence</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed">
              “Encountered subterranean hard rock strata at chainage{' '}
              <span className="bg-amber-100 text-amber-900 font-bold px-1 rounded font-mono">42+650</span>. Deployed two auxiliary{' '}
              <span className="bg-blue-100 text-blue-900 font-bold px-1 rounded font-mono">Komatsu PC300</span> excavators. Completed{' '}
              <span className="bg-emerald-100 text-emerald-900 font-bold px-1 rounded font-mono">420m</span> laid today without safety incident.”
            </p>
          </div>

          {/* Real-Time NLP Entity Tags */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
              Parsed Entity Extraction
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="font-mono text-[10px] text-slate-500">Action / Phase</span>
                <span className="text-xs text-slate-900 font-bold">Trenching &amp; Stringing</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="font-mono text-[10px] text-slate-500">Linear Progress</span>
                <span className="text-xs text-blue-700 font-bold font-mono">420 Meters</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="font-mono text-[10px] text-slate-500">Asset Assignment</span>
                <span className="text-xs text-slate-900 font-bold">2x Komatsu PC300</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="font-mono text-[10px] text-slate-500">WBS Mapping Code</span>
                <span className="text-xs text-blue-700 font-bold font-mono">ACT-TR-4290</span>
              </div>
            </div>
          </div>

          {/* Drone Recon Orthophoto Snippet with Live Radar Sweep */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span>DRONE RECON ORTHOPHOTO (KM 42+650)</span>
              <span className="text-blue-700 font-mono">GSD: 1.8cm/px</span>
            </div>
            <div className="relative w-full h-36 rounded overflow-hidden shadow-2xs border border-slate-200 group">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Aerial orthophoto survey of heavy industrial pipeline excavation trench through dense subtropical terrain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Ezr_RrncvQtbWZI71c9ilTXb4RnPlTEHWZWmLMXEV8ls10HxMGL_HKSuspDRhX26LfmstJoFpDhRnAyiDbdzGRqkZAq7AdgEIp-xHAWGqnxCtGsyjGaUwYsZi-RIMVn-PcN-ViE2Pz8lIHpXRVGRlrrrFb4OzkIqmseGxAvRIqvHmEAIsOE7qruubCfsiHOTWu-NrG7pJaqUu-myaqKj-gXlNQ3cPVs4oEzKUwMHr_QYKkAl4xc"
              />
              <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-blue-400/25 to-blue-500/40 pointer-events-none radar-line"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-transparent to-transparent flex flex-col justify-end p-2.5">
                <div className="flex items-center justify-between text-white font-mono text-[10px]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    PINCH POINT ANNOTATED: KM 42+650
                  </span>
                  <span className="text-blue-200">BEARING: 042° NNE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Stage 02 // Satellite Arbitration */}
        <div className="flex flex-col gap-4 bg-white p-5 rounded-xl shadow-xs border border-slate-300 hover-elevate">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 rounded bg-rose-600"></div>
              <span className="font-mono text-[10px] text-rose-700 uppercase tracking-wider font-bold">
                STAGE 02 // SATELLITE ARBITRATION
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-mono text-[10px] font-semibold border border-rose-200">
              Sentinel-1 SAR C-Band
            </span>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 -mt-1">
            <span>MULTI-SENSOR DISCREPANCY MATRIX</span>
            <span className="text-rose-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
              DISPUTE IDENTIFIED
            </span>
          </div>

          {/* Contractor Claim Card */}
          <div className="p-3 rounded bg-slate-50 flex flex-col gap-1.5 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
                Contractor Force Majeure Claim
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold">
                CLAIM CONTESTED
              </span>
            </div>
            <p className="text-xs text-slate-800">
              “14 Days Unworkable Soil Due To Severe Monsoon Flooding &amp; Submersion across Chainage 41+000 to 44+200.”
            </p>
          </div>

          {/* Sentinel-1 SAR Soil Moisture Index Visualization */}
          <div className="flex flex-col gap-2 p-3 rounded bg-slate-50 border border-slate-200 relative overflow-hidden">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-800 font-semibold">Sentinel-1 SAR Soil Moisture Backscatter</span>
              <span className="text-rose-700 font-bold">11 OF 14 DAYS DRY GROUND</span>
            </div>

            <div className="w-full h-28 bg-white rounded p-2 flex flex-col justify-between border border-slate-200 relative overflow-hidden">
              <div className="flex justify-between text-slate-500 font-mono text-[10px]">
                <span>-5 dB (Dry Soil)</span>
                <span className="text-rose-700 font-bold">FLOOD THRESHOLD: -8.0 dB</span>
              </div>

              {/* Bar Graph */}
              <div className="flex items-end justify-between gap-1 h-14 w-full pt-1">
                <div className="w-full h-12 bg-rose-600 rounded-xs" title="Day 1: -9.1 dB [Flooded]"></div>
                <div className="w-full h-11 bg-rose-600 rounded-xs" title="Day 2: -8.8 dB [Flooded]"></div>
                <div className="w-full h-10 bg-rose-600 rounded-xs" title="Day 3: -8.2 dB [Flooded]"></div>
                <div className="w-full h-4 bg-blue-700 rounded-xs" title="Day 4: -5.4 dB [Dry Ground]"></div>
                <div className="w-full h-3 bg-blue-700 rounded-xs" title="Day 5: -5.1 dB [Dry Ground]"></div>
                <div className="w-full h-4 bg-blue-700 rounded-xs" title="Day 6: -5.2 dB [Dry Ground]"></div>
                <div className="w-full h-3 bg-blue-700 rounded-xs" title="Day 7: -4.9 dB [Dry Ground]"></div>
                <div className="w-full h-5 bg-blue-700 rounded-xs" title="Day 8: -5.6 dB [Dry Ground]"></div>
                <div className="w-full h-4 bg-blue-700 rounded-xs" title="Day 9: -5.0 dB [Dry Ground]"></div>
                <div className="w-full h-3 bg-blue-700 rounded-xs" title="Day 10: -4.8 dB [Dry Ground]"></div>
                <div className="w-full h-3 bg-blue-700 rounded-xs" title="Day 11: -4.7 dB [Dry Ground]"></div>
                <div className="w-full h-4 bg-blue-700 rounded-xs" title="Day 12: -5.3 dB [Dry Ground]"></div>
                <div className="w-full h-4 bg-blue-700 rounded-xs" title="Day 13: -5.1 dB [Dry Ground]"></div>
                <div className="w-full h-3 bg-blue-700 rounded-xs" title="Day 14: -4.9 dB [Dry Ground]"></div>
              </div>

              <div className="flex justify-between font-mono text-[9px] text-slate-500 pt-1">
                <span>Day 01 (Flooded)</span>
                <span>Day 07 (Dry)</span>
                <span>Day 14 (Dry)</span>
              </div>
            </div>
          </div>

          {/* AI Arbitration Verdict Card */}
          <div className="p-3 rounded bg-rose-50 text-rose-950 flex flex-col gap-1.5 border border-rose-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-rose-800">
                Autonomous Arbitration Verdict
              </span>
              <span className="font-mono text-[10px] text-rose-700 font-bold bg-white px-1.5 py-0.5 rounded border border-rose-200">
                STATUTORY REJECTION
              </span>
            </div>
            <p className="text-xs font-bold text-rose-900">
              11 Calendar Days Extension Disallowed
            </p>
            <p className="text-[11px] text-rose-800 leading-snug">
              Adhering to Central Vigilance Commission (CVC) Engineering Manual Sec 8.4 Liquidated Damages enforcement.
            </p>
          </div>

          {/* Financial Metric Callout */}
          <div className="p-3 rounded bg-blue-50 flex items-center justify-between border border-blue-200 shadow-2xs">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-600 uppercase font-semibold">
                Liquidated Damages Protected
              </span>
              <span className="text-xl text-blue-800 font-bold font-mono tracking-tight">
                ₹2,10,00,000
              </span>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-700 text-white font-mono text-xs font-bold shadow-2xs">
              ₹2.10 Cr SAVED
            </span>
          </div>

          {/* 4D Spatial Corridor Preview Map */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span>4D SPATIAL CORRIDOR (CH 41+000 TO 44+200)</span>
              <span className="text-blue-700 font-mono">RTK 1.4cm RMS</span>
            </div>
            <div className="w-full h-32 bg-slate-100 rounded relative overflow-hidden shadow-2xs border border-slate-200">
              <div className="absolute inset-0 bg-[radial-gradient(#1d4ed8_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              <div className="absolute inset-0 bg-blue-700/10 flex items-center justify-center">
                <span className="px-3 py-1 rounded bg-white text-slate-900 font-mono text-[10px] font-bold shadow-sm border border-slate-200">
                  GIS DIGITAL TWIN LIVE CORRIDOR
                </span>
              </div>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-mono text-slate-600 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                GNSS FIX: ACTIVE
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Stage 03 // Enterprise P6 Sync */}
        <div className="flex flex-col gap-4 bg-white p-5 rounded-xl shadow-xs border border-slate-300 hover-elevate">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 rounded bg-blue-700"></div>
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-wider font-bold">
                STAGE 03 // ENTERPRISE P6 SYNC
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-[10px] font-semibold border border-blue-200">
              Oracle EPPM Gateway
            </span>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 -mt-1">
            <span>SCHEDULE RECOVERY &amp; MERKLE SEALING</span>
            <span className="text-blue-700 font-mono font-bold">BUFFER RECOVERED</span>
          </div>

          {/* What-If Monte Carlo Analysis */}
          <div className="p-3 rounded bg-slate-50 flex flex-col gap-2 border border-slate-200">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
              Schedule Delta Simulation
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-600">Contractor Baseline Slip:</span>
                <span className="text-rose-600 font-bold">-4.2 Days Projected</span>
              </div>
              <div className="w-full h-2 rounded bg-rose-100 overflow-hidden">
                <div className="w-2/3 h-full bg-rose-600"></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-800 font-semibold">SiteSync AI Re-sequencing:</span>
                <span className="text-blue-700 font-bold">+1.8 Days Buffer Secured</span>
              </div>
              <div className="w-full h-2 rounded bg-blue-100 overflow-hidden">
                <div className="w-4/5 h-full bg-blue-700"></div>
              </div>
            </div>

            <div className="mt-1 p-2 rounded bg-white flex items-center justify-between text-slate-900 border border-slate-200">
              <span className="font-mono text-[10px] text-slate-500 font-semibold">NET CRITICAL PATH DELTA</span>
              <span className="font-mono text-xs text-blue-700 font-bold">+6.0 CALENDAR DAYS</span>
            </div>
          </div>

          {/* Action Taken Box */}
          <div className="p-3 rounded bg-slate-50 flex flex-col gap-1 border border-slate-200">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
              Dynamic Resource Auto-Allocation
            </span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              Auto-dispatched 2x CAT 336D hydraulic rock breakers from Duliajan Depot to bypass granitic pinch point at KM 42+650.
            </p>
          </div>

          {/* Cryptographic Proof Anchor */}
          <div className="p-3 rounded bg-blue-50/70 flex flex-col gap-1.5 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-600 uppercase font-semibold">
                Cryptographic Ground Truth Anchor
              </span>
              <span className="font-mono text-[10px] text-blue-700 font-bold">SHA-256 + RSA-4096</span>
            </div>
            <div className="font-mono text-[10px] text-slate-900 break-all bg-white p-2 rounded border border-slate-200">
              MERKLE ROOT: 0x9AF572B104...ED312C889104
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
              <span className="material-symbols-outlined text-[13px] text-blue-700">verified_user</span>
              Permanent immutable proof recorded for statutory vigilance audits.
            </div>
          </div>

          {/* 1-Click Commit CTA */}
          <button
            type="button"
            disabled={isCommitting}
            onClick={handleCommitP6}
            className={`w-full py-3 px-4 rounded font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
              committed
                ? 'bg-emerald-600 text-white'
                : isCommitting
                ? 'bg-blue-800 text-white cursor-wait'
                : 'bg-blue-700 hover:bg-blue-800 active:scale-95 text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${isCommitting ? 'animate-spin' : ''}`}>
              {isCommitting ? 'sync' : committed ? 'verified' : 'send_time_extension'}
            </span>
            <span>
              {isCommitting
                ? 'Committing SHA-256 Merkle Block to Oracle P6...'
                : committed
                ? 'Synchronized to Oracle EPPM #TR-4290'
                : 'Simulate 1-Click Commit to Oracle P6'}
            </span>
          </button>

          {/* Value Impact Scorecard */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="shimmer-badge p-2.5 rounded bg-slate-50 flex flex-col border border-slate-200">
              <span className="font-mono text-[10px] text-slate-500">Schedule Saved</span>
              <span className="text-sm text-blue-700 font-bold font-mono">4.2 Days</span>
            </div>
            <div className="shimmer-badge p-2.5 rounded bg-slate-50 flex flex-col border border-slate-200">
              <span className="font-mono text-[10px] text-slate-500">Funds Protected</span>
              <span className="text-sm text-blue-700 font-bold font-mono">₹2.10 Cr</span>
            </div>
            <div className="shimmer-badge p-2.5 rounded bg-slate-50 flex flex-col border border-slate-200">
              <span className="font-mono text-[10px] text-slate-500">Latency to Audit</span>
              <span className="text-sm text-slate-900 font-bold font-mono">
                14s <span className="font-mono text-[10px] text-slate-500 font-normal">(was 48h)</span>
              </span>
            </div>
            <div className="shimmer-badge p-2.5 rounded bg-slate-50 flex flex-col border border-slate-200">
              <span className="font-mono text-[10px] text-slate-500">Throughput Gain</span>
              <span className="text-sm text-slate-900 font-bold font-mono">12,342x Faster</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
