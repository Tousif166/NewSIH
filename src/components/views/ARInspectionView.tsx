import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../services/store';
import { 
  INITIAL_AR_NODES, 
  SAMPLE_DEFECT_TEMPLATES, 
  ARAnchorNode, 
  ARDefectTag 
} from '../../services/arEngine';

export const ARInspectionView: React.FC = () => {
  const { showToast, setActiveTab } = useApp();
  const [nodes, setNodes] = useState<ARAnchorNode[]>(INITIAL_AR_NODES);
  const [selectedNode, setSelectedNode] = useState<ARAnchorNode | null>(INITIAL_AR_NODES[0]);
  const [userDefectTags, setUserDefectTags] = useState<ARDefectTag[]>([]);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [isTaggingMode, setIsTaggingMode] = useState<boolean>(false);
  const [selectedDefectType, setSelectedDefectType] = useState<typeof SAMPLE_DEFECT_TEMPLATES[0]>(SAMPLE_DEFECT_TEMPLATES[0]);
  const [arVisionFilter, setArVisionFilter] = useState<'STANDARD' | 'THERMAL' | 'EDGE_XRAY'>('STANDARD');
  const [compassHeading, setCompassHeading] = useState<number>(42);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Toggle true camera feed if user grants permission
  const handleToggleWebcam = async () => {
    if (isWebcamActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsWebcamActive(false);
      showToast('Switched to Synthetic High-Fidelity Pipeline Feed', 'info');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsWebcamActive(true);
        showToast('Live Camera Feed Attached to WebXR Pipeline Overlay', 'success');
      } catch {
        showToast('Camera permission denied or unavailable. Using synthetic pipeline field feed.', 'warning');
        setIsWebcamActive(false);
      }
    }
  };

  // Compass gentle drift simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCompassHeading(prev => (prev + (Math.random() - 0.5) * 2 + 360) % 360);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle click on AR canvas to drop tag if in tagging mode
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTaggingMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newTag: ARDefectTag = {
      id: `TAG-AR-${Date.now().toString().slice(-4)}`,
      type: selectedDefectType.type,
      xPct,
      yPct,
      timestamp: new Date().toLocaleTimeString(),
      notes: `${selectedDefectType.label} tagged at Ch. 42+380 (AR Reticle)`,
      severity: selectedDefectType.severity,
      remedialSop: selectedDefectType.remedialSop
    };

    setUserDefectTags(prev => [...prev, newTag]);
    setIsTaggingMode(false);
    showToast(`AR Geo-Anchor Dropped: ${selectedDefectType.label} at (${xPct}%, ${yPct}%)`, 'success');
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-800/40 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold border border-sky-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                WEBXR FIELD SPATIAL INSPECTION // 132 KM CORRIDOR
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                ASME B31.4 SUBTERRANEAN HUD
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              AR-Enabled Site Inspection (Spatial Digital Overlay)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Augmented Reality holographic projection showing subterranean 24" crude trunkline at depth -1.85m. Point phone or mobile tablet at trench to inspect joint welds, block valves, cathodic potentials and anchor geo-tagged defect notices.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleToggleWebcam}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all border ${
                isWebcamActive 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-xs' 
                  : 'bg-sky-600 hover:bg-sky-500 text-white border-sky-500 shadow-md'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isWebcamActive ? 'videocam_off' : 'videocam'}
              </span>
              {isWebcamActive ? 'STOP LIVE CAMERA' : 'ATTACH DEVICE CAMERA'}
            </button>

            <button
              onClick={() => setActiveTab('PIPELINE_3D')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono font-bold transition-all border border-white/10 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
              Open 3D Twin
            </button>
          </div>
        </div>
      </div>

      {/* AR Viewport Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">AR Vision Filter:</span>
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setArVisionFilter('STANDARD')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                arVisionFilter === 'STANDARD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              RGB Optical
            </button>
            <button
              onClick={() => setArVisionFilter('THERMAL')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                arVisionFilter === 'THERMAL' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FLIR Thermal
            </button>
            <button
              onClick={() => setArVisionFilter('EDGE_XRAY')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                arVisionFilter === 'EDGE_XRAY' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Subsurface X-Ray
            </button>
          </div>
        </div>

        {/* Defect Anchor Tagging Toggle */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDefectType.type}
            onChange={(e) => {
              const found = SAMPLE_DEFECT_TEMPLATES.find(t => t.type === e.target.value);
              if (found) setSelectedDefectType(found);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white text-slate-800"
          >
            {SAMPLE_DEFECT_TEMPLATES.map(t => (
              <option key={t.type} value={t.type}>{t.label}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setIsTaggingMode(!isTaggingMode);
              if (!isTaggingMode) {
                showToast('Click anywhere on the AR camera viewport to place this geo-tag', 'info');
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isTaggingMode 
                ? 'bg-rose-600 text-white animate-pulse shadow-md' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
            {isTaggingMode ? 'CLICK ON VIEWPORT TO PLACE' : 'PLACE AR DEFECT TAG'}
          </button>
        </div>
      </div>

      {/* Main AR Display & Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Interactive AR Viewport */}
        <div className="lg:col-span-2 space-y-4">
          <div 
            onClick={handleCanvasClick}
            className={`relative w-full h-[520px] rounded-2xl overflow-hidden border-2 shadow-2xl select-none transition-all ${
              isTaggingMode ? 'cursor-crosshair border-rose-500' : 'cursor-default border-slate-900'
            }`}
          >
            {/* Background Stream: Live Camera or Synthetic Field Feed */}
            {isWebcamActive ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full relative transition-all duration-300 ${
                arVisionFilter === 'THERMAL' ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-amber-700' :
                arVisionFilter === 'EDGE_XRAY' ? 'bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900' :
                'bg-gradient-to-b from-sky-900 via-emerald-950 to-amber-950'
              }`}>
                {/* Synthetic Assam Landscape & Pipeline Trench Backdrop */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

                {/* Simulated Pipeline Trench Ground Plane */}
                <div className="absolute bottom-0 inset-x-0 h-3/5 bg-gradient-to-t from-stone-900 via-stone-800/80 to-transparent">
                  {/* Excavation Trench Pit */}
                  <div className="absolute bottom-6 left-1/4 right-1/4 h-48 bg-stone-950/90 rounded-2xl border-x-4 border-b-4 border-amber-900/60 shadow-inner flex items-center justify-center">
                    <span className="font-mono text-[10px] text-amber-500/60 uppercase tracking-widest">
                      24" CRUDE OIL TRUNKLINE TRENCH // DEPTH -1.85M
                    </span>
                  </div>
                </div>

                {/* Subterranean Holographic Cylinder Pipeline Wireframe */}
                <div className="absolute bottom-20 left-12 right-12 h-16 border-y-2 border-cyan-400/80 bg-cyan-500/10 backdrop-blur-xs flex items-center justify-between px-6 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                  <div className="font-mono text-[9px] text-cyan-300 font-bold tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    OIL 24" API 5L X65 SUBTERRANEAN RUN
                  </div>
                  <div className="font-mono text-[9px] text-cyan-400">
                    MAOP 74 BAR • FLOW 1420 M³/H • DIGBOI → DULIAJAN
                  </div>
                </div>
              </div>
            )}

            {/* AR HUD OVERLAYS */}
            {/* Top HUD Telemetry Bar */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between font-mono text-[11px] text-white/90 bg-slate-950/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 z-20">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <span className="material-symbols-outlined text-[16px]">my_location</span>
                  CH. 42+380
                </span>
                <span className="text-slate-400">|</span>
                <span>27°23'28.3"N 95°37'42.2"E</span>
                <span className="text-slate-400">|</span>
                <span>ALT: 142m MSL</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-amber-300 font-bold">HDG: {Math.round(compassHeading)}° NE</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                  RTK FIX (±1.5cm)
                </span>
              </div>
            </div>

            {/* Central Targeting Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border border-cyan-400/40 border-dashed flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
              </div>
              <span className="font-mono text-[8px] text-cyan-300/80 mt-1 uppercase tracking-wider">
                LASER RANGEFINDER: 2.45m
              </span>
            </div>

            {/* AR Anchor Pins on Screen */}
            {nodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  className="absolute cursor-pointer transition-transform hover:scale-110 z-20"
                  style={{ top: `${node.screenPosition.yPct}%`, left: `${node.screenPosition.xPct}%` }}
                >
                  <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    {/* Glowing Pin Beacon */}
                    <div className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold shadow-lg flex items-center gap-1 border whitespace-nowrap ${
                      node.status === 'CRITICAL' ? 'bg-rose-600 text-white border-rose-300' :
                      node.status === 'WARNING' ? 'bg-amber-500 text-white border-amber-300' :
                      'bg-cyan-600 text-white border-cyan-300'
                    } ${isSelected ? 'ring-2 ring-white scale-105' : ''}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {node.type === 'WELD_JOINT' ? 'adjust' : node.type === 'BLOCK_VALVE' ? 'valve' : node.type === 'CP_POST' ? 'bolt' : 'warning'}
                      </span>
                      <span>{node.label}</span>
                    </div>

                    {/* Stalk line pointing to point on ground */}
                    <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-transparent"></div>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-cyan-400 shadow-md"></div>
                  </div>
                </div>
              );
            })}

            {/* Placed User Defect Tags */}
            {userDefectTags.map(tag => (
              <div
                key={tag.id}
                className="absolute z-20"
                style={{ top: `${tag.yPct}%`, left: `${tag.xPct}%` }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="px-2 py-1 rounded bg-rose-600 text-white text-[9px] font-mono font-bold shadow-lg border border-rose-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">flag</span>
                    {tag.notes.split(' ')[0]} ({tag.severity})
                  </div>
                  <div className="w-0.5 h-4 bg-rose-500"></div>
                </div>
              </div>
            ))}

            {/* Bottom HUD Instruction Banner */}
            <div className="absolute bottom-3 inset-x-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-slate-300 flex items-center justify-between z-20">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-cyan-400">touch_app</span>
                Click any floating holographic pin to view ASNT Level III weld certifications & live telemetry
              </span>
              <span className="text-cyan-400 font-bold">
                {nodes.length} ANCHORS ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Floating AR Inspector Dossier */}
        <div className="space-y-4">
          {selectedNode ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                    selectedNode.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                    selectedNode.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedNode.type} • {selectedNode.status}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">{selectedNode.label}</h3>
                  <div className="text-xs text-slate-500 font-mono">
                    Chainage KM {selectedNode.chainageKm.toFixed(3)} • Depth: {selectedNode.depthMeters > 0 ? `-${selectedNode.depthMeters}m (Underground)` : 'Above Grade'}
                  </div>
                </div>
              </div>

              {/* Title & Technical Spec */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs font-mono">
                <div className="font-bold text-slate-800 mb-1">{selectedNode.details.title}</div>
                <div className="text-[11px] text-slate-500">{selectedNode.details.spec}</div>
                <div className="text-[10px] text-indigo-700 font-bold mt-2">
                  Linked P6 Activity: {selectedNode.details.p6ActivityId}
                </div>
              </div>

              {/* Metrics Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Field QA/QC & Non-Destructive Testing (NDT):
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  {Object.entries(selectedNode.details.metrics).map(([key, val]) => (
                    <div key={key} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">{key}</span>
                      <span className="font-bold text-slate-800 text-[11px] text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign-off metadata */}
              <div className="text-[11px] font-mono text-slate-500 border-t border-slate-100 pt-3 flex justify-between">
                <span>Inspected by: {selectedNode.details.inspector}</span>
                <span>{selectedNode.details.inspectionDate}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => showToast(`Verified NDT Inspection Record for ${selectedNode.label} stamped into Blockchain Ledger.`, 'success')}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Verify & Stamp
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500 font-mono text-xs">
              Select an AR pin on the camera viewport to view technical certifications.
            </div>
          )}

          {/* User Placed Defect Tags List */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-rose-600">flag</span>
                Pinned Defect Notices ({userDefectTags.length})
              </h4>
            </div>

            {userDefectTags.length === 0 ? (
              <div className="text-xs text-slate-400 font-mono text-center py-4 bg-slate-50 rounded-xl">
                No AR defect tags placed. Enable "Place AR Defect Tag" and tap viewport to drop a tag.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {userDefectTags.map(tag => (
                  <div key={tag.id} className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/60 font-mono text-xs">
                    <div className="flex justify-between items-center font-bold text-rose-900">
                      <span>{tag.id}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-200 text-rose-800">{tag.severity}</span>
                    </div>
                    <div className="text-[11px] text-slate-700 mt-1">{tag.notes}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">SOP: {tag.remedialSop}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
