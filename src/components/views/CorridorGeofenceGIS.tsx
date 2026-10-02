import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  GIS_SECTORS, 
  INITIAL_GIS_THREATS, 
  GISCorridorSector, 
  GISThreatAlert 
} from '../../services/geofenceGISEngine';

export const CorridorGeofenceGIS: React.FC = () => {
  const { showToast, setActiveTab } = useApp();
  const [sectors] = useState<GISCorridorSector[]>(GIS_SECTORS);
  const [threats, setThreats] = useState<GISThreatAlert[]>(INITIAL_GIS_THREATS);
  const [selectedThreatId, setSelectedThreatId] = useState<string>('THREAT-01');
  const [activeLayer, setActiveLayer] = useState<'ALL' | 'ROW_BUFFER' | 'ECO_SENSITIVE' | 'THREATS_ONLY'>('ALL');

  const selectedThreat = threats.find(t => t.id === selectedThreatId) || threats[0];

  const handleDispatchQRT = (threatId: string) => {
    setThreats(prev => prev.map(t => t.id === threatId ? { ...t, status: 'DISPATCHED' } : t));
    showToast(`CISF Quick Reaction Team (QRT) Unit #4 dispatched to KM ${selectedThreat.chainageKm}. Sirens active.`, 'success');
  };

  const handleFlagP6 = (threatId: string) => {
    showToast(`Primavera P6 Activity ${selectedThreat.linkedP6Activity} flagged for potential delay impact (Float Absorption: 2 days).`, 'warning');
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-800/40 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold border border-rose-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                SATELLITE & FIBER DTS GEOFENCING // 132 KM
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                30M STATUTORY ROW ENFORCEMENT
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              GIS Geofencing & Corridor Threat Alert System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Continuous spatial monitoring along the entire Digboi-Duliajan 132 KM crude trunkline. Automated geofence alarms for unauthorized heavy machinery inside the 30m legal RoW, riverbed scour at Burhi Dihing, and elephant corridors in Dihing Patkai.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('PIPELINE_3D')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono font-bold transition-all border border-white/10 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
              Open 3D Corridor
            </button>
          </div>
        </div>

        {/* 4 Corridor Sectors Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-white/10">
          {sectors.map(sec => (
            <div key={sec.id} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between font-bold text-white mb-1">
                <span>{sec.id}</span>
                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px]">
                  {sec.activeThreatCount} ALERT
                </span>
              </div>
              <div className="text-[11px] text-slate-300 truncate">{sec.name.split(':')[1]}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                KM {sec.chainageStartKm} - {sec.chainageEndKm} • {sec.rowWidthMeters}m RoW
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GIS Map Layer Selector */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">GIS Buffer Layers:</span>
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setActiveLayer('ALL')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                activeLayer === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Spatial Overlays
            </button>
            <button
              onClick={() => setActiveLayer('ROW_BUFFER')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                activeLayer === 'ROW_BUFFER' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30m Legal RoW
            </button>
            <button
              onClick={() => setActiveLayer('ECO_SENSITIVE')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                activeLayer === 'ECO_SENSITIVE' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              500m Eco-Buffer
            </button>
            <button
              onClick={() => setActiveLayer('THREATS_ONLY')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                activeLayer === 'THREATS_ONLY' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Threat Beacons
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span>4 Active Perimeter Breaches</span>
        </div>
      </div>

      {/* Main Map View & Incident Dispatch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: 132KM Corridor SVG GIS Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
                  DIGBOI (CH. 0.0) TO DULIAJAN (CH. 132.0) CORRIDOR MAP
                </span>
                <h3 className="text-base font-black text-white">Interactive Trunkline GIS Vector Geometry</h3>
              </div>
              <span className="font-mono text-[10px] text-slate-400 bg-white/10 px-2 py-1 rounded">
                CRS: EPSG:4326 (WGS 84)
              </span>
            </div>

            {/* SVG Corridor Canvas */}
            <div className="relative w-full h-[400px] bg-slate-900/90 rounded-xl border border-slate-800 p-4 flex items-center justify-center">
              {/* Background Assam Geographic Grid */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:32px_32px]"></div>

              <svg viewBox="0 0 800 320" className="w-full h-full relative z-10">
                {/* 500m Eco-Sensitive Buffer Zone (Green Translucent Band) */}
                {(activeLayer === 'ALL' || activeLayer === 'ECO_SENSITIVE') && (
                  <path
                    d="M 60 220 Q 220 80, 400 160 T 740 100"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="48"
                    strokeOpacity="0.25"
                    strokeLinecap="round"
                  />
                )}

                {/* 30m Legal Right of Way (RoW) Buffer (Amber Translucent Band) */}
                {(activeLayer === 'ALL' || activeLayer === 'ROW_BUFFER') && (
                  <path
                    d="M 60 220 Q 220 80, 400 160 T 740 100"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="18"
                    strokeOpacity="0.35"
                    strokeLinecap="round"
                  />
                )}

                {/* Pipeline Centerline (Cyan Neon Stroke) */}
                <path
                  d="M 60 220 Q 220 80, 400 160 T 740 100"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                />

                {/* Major Corridor Milestones */}
                {/* Digboi IPS Ch 0 */}
                <circle cx="60" cy="220" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                <text x="60" y="245" fill="#93c5fd" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  Digboi IPS (0.0km)
                </text>

                {/* Margherita Ch 35 */}
                <circle cx="230" cy="125" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                <text x="230" y="105" fill="#93c5fd" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  Margherita (34.8km)
                </text>

                {/* Burhi Dihing River Ch 92 */}
                <circle cx="560" cy="148" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                <text x="560" y="175" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  Burhi Dihing (92.1km)
                </text>

                {/* Duliajan Refinery Ch 132 */}
                <circle cx="740" cy="100" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="740" y="125" fill="#6ee7b7" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  Duliajan Refinery (132km)
                </text>

                {/* Threat Markers on Corridor */}
                {threats.map((threat) => {
                  // Map chainage 0 to 132 onto SVG path coordinate approximation
                  let cx = 60 + (threat.chainageKm / 132) * 680;
                  let cy = 160;

                  if (threat.id === 'THREAT-01') { cx = 360; cy = 145; } // Margherita-Namrup Ch 58
                  if (threat.id === 'THREAT-02') { cx = 175; cy = 150; } // Dihing Patkai Ch 24
                  if (threat.id === 'THREAT-03') { cx = 560; cy = 148; } // Burhi Dihing Ch 92
                  if (threat.id === 'THREAT-04') { cx = 660; cy = 120; } // Namrup-Duliajan Ch 114

                  const isSelected = selectedThreatId === threat.id;

                  return (
                    <g 
                      key={threat.id} 
                      onClick={() => setSelectedThreatId(threat.id)}
                      className="cursor-pointer"
                    >
                      {/* Pulsating ring */}
                      <circle cx={cx} cy={cy} r="16" fill="#f43f5e" opacity="0.3" className="animate-ping" />
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={isSelected ? "9" : "7"} 
                        fill={threat.severity === 'CRITICAL' ? '#e11d48' : '#f59e0b'} 
                        stroke="#ffffff" 
                        strokeWidth={isSelected ? "3" : "1.5"} 
                      />
                      <text x={cx} y={cy - 12} fill="#fca5a5" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {threat.id}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Map Legend */}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-[9px] font-mono text-slate-300 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-cyan-400 inline-block"></span>
                  <span>24" Crude Trunkline</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-amber-500 inline-block"></span>
                  <span>30m Statutory RoW Buffer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-emerald-500 inline-block"></span>
                  <span>500m Eco-Sensitive Zone</span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Click any red threat beacon on the map to inspect GPS telemetry</span>
              <span className="text-cyan-400 font-bold">132.0 KM TOTAL CORRIDOR LENGTH</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Incident Response & CISF Dispatch Card */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                  selectedThreat.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                  selectedThreat.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedThreat.severity} • {selectedThreat.status}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">{selectedThreat.title}</h3>
                <div className="text-xs text-slate-500 font-mono">
                  Chainage: KM {selectedThreat.chainageKm.toFixed(2)} • {selectedThreat.timestamp}
                </div>
              </div>
            </div>

            {/* Spatial Location Details */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>GPS Coordinates:</span>
                <span className="font-bold text-slate-900">
                  {selectedThreat.gpsCoords.lat}°N, {selectedThreat.gpsCoords.lng}°E
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Distance from Centerline:</span>
                <span className="font-bold text-rose-600">{selectedThreat.distanceFromPipeCenterMeters}m (Inside 30m RoW)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Linked P6 Schedule Activity:</span>
                <span className="font-bold text-indigo-700">{selectedThreat.linkedP6Activity}</span>
              </div>
            </div>

            {/* Narrative & SOP Description */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Threat Description:</div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedThreat.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Immediate Action Protocol:</div>
              <p className="text-xs text-amber-900 font-mono leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-200">
                {selectedThreat.immediateAction}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {selectedThreat.status === 'DISPATCHED' ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-mono text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">local_police</span>
                  CISF QRT PATROL UNIT EN ROUTE (ETA: 4 MINS)
                </div>
              ) : (
                <button
                  onClick={() => handleDispatchQRT(selectedThreat.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">local_police</span>
                  Dispatch CISF Quick Reaction Team
                </button>
              )}

              <button
                onClick={() => handleFlagP6(selectedThreat.id)}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs transition-all border border-slate-300 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                Flag Schedule Impact to P6 Planner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
