import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { SAMPLE_WHATSAPP_CHATS, processIncomingWhatsAppMessage } from '../../services/frontierEngine';
import { WhatsAppMessage } from '../../types/index';

export const WhatsAppGatewayModal: React.FC = () => {
  const { isWhatsAppGatewayOpen, setIsWhatsAppGatewayOpen, showToast } = useApp();
  const [messages, setMessages] = useState<WhatsAppMessage[]>(SAMPLE_WHATSAPP_CHATS);
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage>(SAMPLE_WHATSAPP_CHATS[0]);
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [simulateMediaType, setSimulateMediaType] = useState<'photo' | 'audio' | 'text'>('photo');

  if (!isWhatsAppGatewayOpen) return null;

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;

    const newMsg = processIncomingWhatsAppMessage(
      typedMessage,
      simulateMediaType === 'text' ? 'photo' : simulateMediaType,
      { lat: 27.2891, lon: 95.3214 }
    );

    setMessages(prev => [newMsg, ...prev]);
    setSelectedMessage(newMsg);
    setTypedMessage('');
    showToast(`WhatsApp message received & processed into P6 Activity ${newMsg.matchedActivityCode}!`, 'success');
  };

  const handleSimulateQuickDispatch = (text: string, type: 'photo' | 'audio') => {
    const newMsg = processIncomingWhatsAppMessage(text, type, { lat: 27.2891, lon: 95.3214 });
    setMessages(prev => [newMsg, ...prev]);
    setSelectedMessage(newMsg);
    showToast(`Simulated Field WhatsApp Dispatch Ingested: ${newMsg.matchedActivityCode}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-emerald-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">chat</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  WhatsApp & Telegram Enterprise Field Webhook Gateway
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono font-bold">
                  AUTONOMOUS BOT v2.4
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-400 text-slate-950 font-mono font-bold">
                  SIH26122 INNOVATION
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Enables site riggers & supervisors to report execution updates via everyday messaging apps with automatic EXIF GPS extraction and Indic NLP parsing into Primavera P6.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWhatsAppGatewayOpen(false)}
            className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 transition-all cursor-pointer"
            title="Close Modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Layout: Phone Simulator (Left) + AI Parsing Pipeline Inspector (Right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* LEFT 6 COLS: WhatsApp Smartphone Simulator */}
          <div className="lg:col-span-6 p-4 sm:p-5 flex flex-col gap-4 bg-slate-100/60">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Live WhatsApp Stream Simulator</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">API Endpoint: /api/webhook/whatsapp</span>
            </div>

            {/* Smartphone Frame Container */}
            <div className="w-full rounded-2xl bg-white border-2 border-slate-300 shadow-md overflow-hidden flex flex-col h-[460px]">
              
              {/* WhatsApp App Bar */}
              <div className="bg-emerald-800 px-4 py-3 text-white flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center font-bold text-xs">
                    OIL
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-tight">OIL Digboi-Duliajan 132km Dispatch</span>
                    <span className="text-[10px] text-emerald-200 leading-tight">Pranjal, Bikramjit, Manojit, Bot</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </div>
              </div>

              {/* Chat Messages Feed */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#efeae2]/60">
                {messages.map((msg) => {
                  const isSelected = selectedMessage.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-3 rounded-xl transition-all cursor-pointer max-w-[92%] ${
                        msg.status === 'flagged'
                          ? 'bg-rose-50 border-2 border-rose-300 ml-auto'
                          : 'bg-white border border-slate-200 shadow-2xs mr-auto'
                      } ${isSelected ? 'ring-2 ring-emerald-600 shadow-sm' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-950">{msg.senderName}</span>
                        <span className="text-[10px] font-mono text-slate-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-sans">{msg.text}</p>
                      
                      {/* Media Thumbnail */}
                      {msg.mediaUrl && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 max-h-32">
                          <img src={msg.mediaUrl} alt="Field Attachment" className="w-full h-24 object-cover" />
                        </div>
                      )}

                      {/* Voice Note Audio Pill */}
                      {msg.voiceNoteSeconds && (
                        <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-700 text-[18px]">play_circle</span>
                          <div className="flex-1 h-1.5 bg-emerald-200 rounded-full"></div>
                          <span className="text-[10px] font-mono text-emerald-800 font-bold">0:{msg.voiceNoteSeconds}</span>
                        </div>
                      )}

                      {/* GPS & Status Badges */}
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
                        <span className="text-slate-500 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px] text-slate-400">pin_drop</span>
                          {msg.exifGps ? `LAT ${msg.exifGps.lat.toFixed(3)}°` : 'NO GPS'}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded font-bold ${
                          msg.rowVerificationStatus === 'ON_ROW'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800 font-bold animate-pulse'
                        }`}>
                          {msg.rowVerificationStatus === 'ON_ROW' ? '✓ VERIFIED RoW' : '⚠ OFF-RoW GHOST'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
                <div className="flex items-center gap-1 text-slate-500">
                  <button 
                    onClick={() => setSimulateMediaType('photo')}
                    className={`p-1 rounded cursor-pointer ${simulateMediaType === 'photo' ? 'text-emerald-700 font-bold' : ''}`}
                    title="Simulate Photo attachment"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                  </button>
                  <button 
                    onClick={() => setSimulateMediaType('audio')}
                    className={`p-1 rounded cursor-pointer ${simulateMediaType === 'audio' ? 'text-emerald-700 font-bold' : ''}`}
                    title="Simulate Voice note"
                  >
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Type WhatsApp site message or vernacular text..."
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-white border border-slate-300 rounded-full px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>

            </div>

            {/* Quick 1-Click Simulation Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">1-Click Presets:</span>
              <button
                onClick={() => handleSimulateQuickDispatch('Spool fitup 80% completed at KM 42+650. Radiator leak solved.', 'photo')}
                className="text-[11px] font-mono font-semibold bg-white hover:bg-emerald-50 text-slate-800 px-2 py-1 rounded-md border border-slate-300 cursor-pointer"
              >
                + Spool Fit-Up (Piping)
              </button>
              <button
                onClick={() => handleSimulateQuickDispatch('Pump house dhalai poora complete ho gaya. 100% finished.', 'audio')}
                className="text-[11px] font-mono font-semibold bg-white hover:bg-emerald-50 text-slate-800 px-2 py-1 rounded-md border border-slate-300 cursor-pointer"
              >
                + Foundation Dhalai (Civil)
              </button>
            </div>
          </div>

          {/* RIGHT 6 COLS: Real-Time Webhook AI Parsing Inspector */}
          <div className="lg:col-span-6 p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-mono text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">terminal</span>
                <span>AI Ingestion & P6 Schedule Dispatch Inspector</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
                ACTIVE PIPELINE
              </span>
            </div>

            {/* Pipeline Stage 1: Sender & EXIF GPS Telemetry */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Sender & EXIF Metadata Extraction</span>
                </span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {selectedMessage.senderRole}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Caller ID:</span>
                  <span className="font-bold text-slate-800">{selectedMessage.senderPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Photo EXIF GPS:</span>
                  <span className="font-bold text-slate-800">
                    {selectedMessage.exifGps ? `${selectedMessage.exifGps.lat.toFixed(4)}°N, ${selectedMessage.exifGps.lon.toFixed(4)}°E` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pipeline Stage 2: RoW Geofence & Anti-Ghost Verification */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              selectedMessage.rowVerificationStatus === 'ON_ROW'
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-rose-50 border-rose-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>RoW Geofence Validator</span>
                </span>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                  selectedMessage.rowVerificationStatus === 'ON_ROW'
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-rose-200 text-rose-950 animate-pulse'
                }`}>
                  {selectedMessage.rowVerificationStatus}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-sans">{selectedMessage.aiNotes}</p>
            </div>

            {/* Pipeline Stage 3: Primavera P6 Auto-Mapping Output */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Primavera P6 Reconciliation Payload</span>
              </span>
              
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">P6 ACTIVITY:</span>
                  <span className="font-bold text-blue-700 text-sm">{selectedMessage.matchedActivityCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DISCIPLINE:</span>
                  <span className="font-bold text-slate-800">{selectedMessage.parsedDiscipline}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PERCENT:</span>
                  <span className="font-bold text-emerald-700 text-sm">{selectedMessage.reportedProgress}%</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 bg-slate-100 p-2 rounded border border-slate-200/80">
                JSON Payload: {`{ "source": "WHATSAPP_BOT", "p6_code": "${selectedMessage.matchedActivityCode}", "status": "${selectedMessage.status}" }`}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">encrypted</span>
            <span>End-to-End Enterprise Encryption // Webhook Secret HMAC-SHA256 Authenticated</span>
          </div>

          <button
            onClick={() => setIsWhatsAppGatewayOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold cursor-pointer transition-all"
          >
            Close Gateway
          </button>
        </div>

      </div>
    </div>
  );
};
