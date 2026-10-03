import React, { useState, useEffect } from 'react';
import { useApp } from '../../services/store';
import { 
  INITIAL_IOT_STATIONS, 
  IOT_ANOMALY_PRESETS, 
  IoTAssetStation, 
  IoTAnomalyPreset, 
  applyIoTAnomaly 
} from '../../services/iotEngine';

export const IoTPredictiveMaintenance: React.FC = () => {
  const { showToast, setActiveTab } = useApp();
  const [stations, setStations] = useState<IoTAssetStation[]>(INITIAL_IOT_STATIONS);
  const [selectedStationId, setSelectedStationId] = useState<string>('BPS-02');
  const [activeAnomaly, setActiveAnomaly] = useState<IoTAnomalyPreset['id']>('BEARING_CAVITATION');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [workOrderGenerated, setWorkOrderGenerated] = useState<boolean>(false);

  // Initialize with initial anomaly preset
  useEffect(() => {
    setStations(applyIoTAnomaly(INITIAL_IOT_STATIONS, 'BEARING_CAVITATION'));
  }, []);

  // Simulate live telemetry tick when stream is active
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setStations(prev => prev.map(station => {
        const deltaVib = (Math.random() - 0.48) * 0.12;
        const deltaPress = (Math.random() - 0.5) * 0.15;
        const deltaTemp = (Math.random() - 0.5) * 0.08;

        const newVib = Math.max(0.5, +(station.currentTelemetry.vibrationMmS + deltaVib).toFixed(2));
        const newPress = Math.max(10, +(station.currentTelemetry.pressureBar + deltaPress).toFixed(1));
        const newTemp = +(station.currentTelemetry.temperatureC + deltaTemp).toFixed(1);

        return {
          ...station,
          currentTelemetry: {
            ...station.currentTelemetry,
            vibrationMmS: newVib,
            pressureBar: newPress,
            temperatureC: newTemp,
            timestamp: 'Just now'
          }
        };
      }));
      setLastUpdated(new Date().toLocaleTimeString());
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const selectedStation = stations.find(s => s.id === selectedStationId) || stations[0];

  const handleApplyPreset = (presetId: IoTAnomalyPreset['id']) => {
    setActiveAnomaly(presetId);
    setWorkOrderGenerated(false);
    const updated = applyIoTAnomaly(INITIAL_IOT_STATIONS, presetId);
    setStations(updated);
    const preset = IOT_ANOMALY_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedStationId(preset.targetStationId);
      showToast(`Telemetry injected: ${preset.title}`, presetId === 'NORMAL' ? 'success' : 'warning');
    }
  };

  const handleGenerateWorkOrder = () => {
    setWorkOrderGenerated(true);
    showToast(`SAP-PM Notification #WO-OIL-2026-9481 dispatched to Margherita Field Crew. Linked to P6 Activity: ACT-DJ-402`, 'success');
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                SCADA + MQTT PROTOCOL // 132 KM TRUNKLINE
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                ISO 10816-3 COMPLIANT
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              Real-Time IoT Sensor Dashboard & Predictive Maintenance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Continuous multi-axial telemetry from Digboi IPS to Duliajan Refinery. Edge AI predicts remaining useful life (RUL), detects cavitation and paraffin wax deposition 48 hours before statutory alarms.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all border ${
                isLiveStreaming 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs' 
                  : 'bg-white/10 text-slate-400 border-white/10 hover:bg-white/15'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
              {isLiveStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}
            </button>

            <button
              onClick={() => setActiveTab('PIPELINE_3D')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-slate-950 font-bold">view_in_ar</span>
              <span className="text-slate-950 font-bold">View in 3D Twin</span>
            </button>
          </div>
        </div>

        {/* Corridor Chainage Quick Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5 pt-4 border-t border-white/10">
          {stations.map(station => {
            const isSelected = station.id === selectedStationId;
            return (
              <button
                key={station.id}
                onClick={() => setSelectedStationId(station.id)}
                className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-indigo-600/40 border-indigo-400 text-white shadow-md' 
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="font-bold text-white">{station.id}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    station.status === 'CRITICAL' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' :
                    station.status === 'WARNING' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' :
                    'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {station.status}
                  </span>
                </div>
                <div className="text-xs font-bold truncate text-slate-100">{station.name.split('(')[0]}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">KM {station.chainageKm.toFixed(1)} • {station.currentTelemetry.vibrationMmS} mm/s</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Anomaly Simulator Controls Bar */}
      <div className="bg-white dark:bg-[#0c1220] border border-slate-200/80 dark:border-amber-500/20 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-indigo-600 dark:text-indigo-400">science</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Interactive Fault & Anomaly Injection Testbench:
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Simulate real oilfield failure signatures to test automated ML diagnostics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {IOT_ANOMALY_PRESETS.map(preset => {
            const isActive = activeAnomaly === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-400/80 text-indigo-950 dark:text-indigo-100 shadow-sm ring-1 ring-indigo-400 dark:ring-indigo-500/50' 
                    : 'bg-slate-50/60 dark:bg-[#070b14]/70 border-slate-200 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold font-mono ${
                    isActive ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {preset.id === 'NORMAL' ? '🟢 NOMINAL' : preset.id === 'BEARING_CAVITATION' ? '🔴 CAVITATION' : preset.id === 'PARAFFIN_WAXING' ? '🟠 WAX DEPOSITION' : '🌊 RIVER SCOUR'}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping"></span>}
                </div>
                <div className={`text-[11px] font-semibold line-clamp-1 ${
                  isActive ? 'text-indigo-950 dark:text-white font-bold' : 'text-slate-800 dark:text-slate-200'
                }`}>{preset.title}</div>
                <p className={`text-[10px] mt-1 line-clamp-2 leading-tight ${
                  isActive ? 'text-indigo-900/80 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'
                }`}>{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Selected Station Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Live Sensor Gauges */}
        <div className="lg:col-span-2 space-y-5">
          {/* Station Metadata & Key Vitals Card */}
          <div className="bg-white dark:bg-[#0c1220] border border-slate-200/80 dark:border-amber-500/20 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    CHAINAGE KM {selectedStation.chainageKm.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Updated: {lastUpdated}</span>
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">{selectedStation.name}</h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{selectedStation.specifications.equipmentModel}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-xl border text-center ${
                  selectedStation.status === 'CRITICAL' ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300' :
                  selectedStation.status === 'WARNING' ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/40 text-amber-800 dark:text-amber-300' :
                  'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                }`}>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider">Health Status</div>
                  <div className="text-sm font-black font-mono">{selectedStation.status}</div>
                </div>
                <div className="px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 text-center">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider">Remaining Life (RUL)</div>
                  <div className="text-sm font-black font-mono">{selectedStation.rulHours} hrs</div>
                </div>
              </div>
            </div>

            {/* 4 Primary Telemetry Meter Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5">
              {/* Metric 1: Line Pressure */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono mb-1">
                  <span>Line Pressure</span>
                  <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-blue-400">compress</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {selectedStation.currentTelemetry.pressureBar} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">bar</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                  <span>MAOP: {selectedStation.specifications.maopBar} bar</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {Math.round((selectedStation.currentTelemetry.pressureBar / selectedStation.specifications.maopBar) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (selectedStation.currentTelemetry.pressureBar / selectedStation.specifications.maopBar) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Metric 2: Crude Oil Temperature */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono mb-1">
                  <span>Crude Temp</span>
                  <span className="material-symbols-outlined text-[16px] text-amber-600 dark:text-amber-400">device_thermostat</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {selectedStation.currentTelemetry.temperatureC} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">°C</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                  <span>WAT: {selectedStation.specifications.waxAppearanceTempC}°C</span>
                  <span className={selectedStation.currentTelemetry.temperatureC < 30 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400'}>
                    {selectedStation.currentTelemetry.temperatureC < 30 ? 'WAX RISK' : 'SAFE'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${selectedStation.currentTelemetry.temperatureC < 30 ? 'bg-rose-500' : 'bg-amber-500'}`} 
                    style={{ width: `${Math.min(100, (selectedStation.currentTelemetry.temperatureC / 60) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Metric 3: Triaxial Vibration (ISO 10816-3) */}
              <div className={`p-3.5 rounded-xl border ${
                selectedStation.currentTelemetry.vibrationMmS > selectedStation.specifications.isoVibrationLimitMmS 
                  ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/40' 
                  : 'bg-slate-50 dark:bg-[#070b14] border-slate-200/80 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono mb-1">
                  <span>Vibration (RMS)</span>
                  <span className="material-symbols-outlined text-[16px] text-rose-600 dark:text-rose-400">vibration</span>
                </div>
                <div className={`text-2xl font-black font-mono ${
                  selectedStation.currentTelemetry.vibrationMmS > selectedStation.specifications.isoVibrationLimitMmS ? 'text-rose-700 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {selectedStation.currentTelemetry.vibrationMmS} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">mm/s</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                  <span>ISO Limit: {selectedStation.specifications.isoVibrationLimitMmS}</span>
                  <span className={selectedStation.currentTelemetry.vibrationMmS > 4.5 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
                    {selectedStation.currentTelemetry.vibrationMmS > 7.1 ? 'UNACCEPTABLE' : selectedStation.currentTelemetry.vibrationMmS > 4.5 ? 'UNSATISFACTORY' : 'ACCEPTABLE'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${selectedStation.currentTelemetry.vibrationMmS > 4.5 ? 'bg-rose-600' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(100, (selectedStation.currentTelemetry.vibrationMmS / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Metric 4: Crude Viscosity & Flow */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono mb-1">
                  <span>Viscosity / Flow</span>
                  <span className="material-symbols-outlined text-[16px] text-teal-600 dark:text-teal-400">water_drop</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {selectedStation.currentTelemetry.viscosityCSt} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">cSt</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                  <span>Rate: {selectedStation.currentTelemetry.flowM3H} m³/h</span>
                  <span className="text-teal-600 dark:text-teal-400 font-semibold">{selectedStation.currentTelemetry.acousticLeakDb} dB</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div 
                    className="bg-teal-600 dark:bg-teal-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (selectedStation.currentTelemetry.viscosityCSt / 60) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* 48-Hour Predictive Failure Forecast Graph */}
          <div className="bg-white dark:bg-[#0c1220] border border-slate-200/80 dark:border-amber-500/20 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-indigo-600 dark:text-indigo-400">trending_up</span>
                  48-Hour Machine Learning Degradation Forecast
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Long Short-Term Memory (LSTM) Autoencoder predicting vibration drift and pressure collapse
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-0.5 bg-indigo-600 dark:bg-indigo-400 inline-block"></span> Predicted Vibration
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-0.5 bg-rose-500 inline-block border-dashed"></span> ISO Trip Threshold (4.5)
                </span>
              </div>
            </div>

            {/* Custom SVG Responsive Forecast Chart */}
            <div className="relative bg-slate-950 rounded-xl p-4 text-white overflow-hidden">
              <div className="absolute top-2 right-3 font-mono text-[10px] text-slate-400">
                Confidence Interval: 95% // Model: TensorFlow-JS In-Browser Edge
              </div>

              <div className="h-52 w-full flex items-end gap-2 pt-6 pb-4">
                {selectedStation.forecast48h.map((point, idx) => {
                  const maxVibScale = 15; // Max scale in mm/s
                  const barHeightPct = (point.predictedVibration / maxVibScale) * 100;
                  const upperHeightPct = (point.upperConfidence / maxVibScale) * 100;
                  const isExceeded = point.predictedVibration > selectedStation.specifications.isoVibrationLimitMmS;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white font-mono text-[9px] px-2 py-1 rounded shadow-lg pointer-events-none z-20 whitespace-nowrap">
                        +{point.hoursAhead}h: {point.predictedVibration} mm/s (CI: {point.lowerConfidence}-{point.upperConfidence})
                      </div>

                      {/* Upper confidence shadow bar */}
                      <div 
                        className="w-full bg-indigo-900/30 rounded-t-sm absolute bottom-8 transition-all"
                        style={{ height: `${Math.min(90, upperHeightPct)}%` }}
                      ></div>

                      {/* Main Prediction Column */}
                      <div 
                        className={`w-3/5 rounded-t-sm relative z-10 transition-all ${
                          isExceeded 
                            ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-rose-900/50 shadow-md' 
                            : 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                        }`}
                        style={{ height: `${Math.min(90, barHeightPct)}%` }}
                      >
                        {isExceeded && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white absolute top-1 left-1/2 -translate-x-1/2 animate-ping"></span>
                        )}
                      </div>

                      {/* Hour Axis Label */}
                      <span className="font-mono text-[10px] text-slate-400 mt-2">
                        +{point.hoursAhead}h
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Warning Indicator Line */}
              <div className="border-t border-rose-500/80 border-dashed w-full absolute bottom-24 left-0 px-4 flex justify-end">
                <span className="bg-rose-950 text-rose-300 border border-rose-800/80 font-mono text-[9px] px-1.5 py-0.5 rounded -mt-2.5">
                  Trip Limit 4.5 mm/s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Diagnostics & Action Dispatcher */}
        <div className="space-y-5">
          {/* AI Root Cause & Failure Diagnosis */}
          <div className="bg-white dark:bg-[#0c1220] border border-slate-200/80 dark:border-amber-500/20 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[20px] text-indigo-600 dark:text-indigo-400">psychology</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Edge ML Failure Diagnostics</h3>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Failure Probability:</span>
                <span className={`font-bold ${selectedStation.failureRiskPct > 50 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {selectedStation.failureRiskPct}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${selectedStation.failureRiskPct > 50 ? 'bg-rose-600' : 'bg-emerald-600'}`}
                  style={{ width: `${selectedStation.failureRiskPct}%` }}
                ></div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white block font-sans font-bold mb-0.5">Dominant Anomaly Mode:</strong>
                {selectedStation.dominantFailureMode}
              </div>
            </div>

            {/* Prescriptive Recommended Actions */}
            <div className="mt-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Prescriptive Action Protocol:</h4>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4 font-mono">
                {selectedStation.id === 'BPS-02' ? (
                  <>
                    <li>Switch duty train to standby Pump P-202 immediately.</li>
                    <li>Inspect non-drive end ball bearing race for spalling.</li>
                    <li>Throttling suction valve to increase NPSH available.</li>
                  </>
                ) : selectedStation.id === 'RIT-05' ? (
                  <>
                    <li>Launch heated scraper pig from Margherita launcher.</li>
                    <li>Inject Drag Reducing Agent (DRA) + pour point depressant.</li>
                    <li>Increase line heating bath temp by +4.5°C at Digboi.</li>
                  </>
                ) : (
                  <>
                    <li>Continue routine SCADA vibration trend polling every 60s.</li>
                    <li>Verify cathodic protection polarization potential.</li>
                    <li>Log acoustic decibel baseline for pipeline seal health.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Autonomous Work Order Dispatch */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              {workOrderGenerated ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-emerald-950 dark:text-emerald-100 font-mono text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">check_circle</span>
                    SAP-PM WO #9481 DISPATCHED
                  </div>
                  <div className="text-[10px] text-emerald-800 dark:text-emerald-300">
                    Assigned: Margherita Mechanical Crew A • Priority 1 Urgent
                  </div>
                  <div className="text-[10px] text-emerald-800 dark:text-emerald-300">
                    Primavera P6 Milestone linked: ACT-DJ-402 (Pre-Commissioning Inspection)
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGenerateWorkOrder}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-mono font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">build</span>
                  Trigger Preventive SAP-PM Work Order
                </button>
              )}
            </div>
          </div>

          {/* Institutional Compliance Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white text-xs font-mono space-y-2">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Statutory Governance References
            </div>
            <div className="text-slate-300 flex items-center justify-between">
              <span>OISD-STANDARD-141:</span>
              <span className="text-emerald-400">PASSED</span>
            </div>
            <div className="text-slate-300 flex items-center justify-between">
              <span>PNGRB T4S Pipeline Safety:</span>
              <span className="text-emerald-400">COMPLIANT</span>
            </div>
            <div className="text-slate-300 flex items-center justify-between">
              <span>API 1130 Computational Pipeline Monitoring:</span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
