import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  INITIAL_BLOCKCHAIN_BLOCKS, 
  BlockchainBlock, 
  verifyBlockchainIntegrity, 
  calculateBlockHash,
  ValidationReport 
} from '../../services/blockchainEngine';

export const BlockchainAuditLedger: React.FC = () => {
  const { showToast } = useApp();
  const [blocks, setBlocks] = useState<BlockchainBlock[]>(INITIAL_BLOCKCHAIN_BLOCKS);
  const [selectedBlock, setSelectedBlock] = useState<BlockchainBlock>(INITIAL_BLOCKCHAIN_BLOCKS[INITIAL_BLOCKCHAIN_BLOCKS.length - 1]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [validationReport, setValidationReport] = useState<ValidationReport>({
    isValid: true,
    brokenBlockIndex: null,
    totalBlocksVerified: INITIAL_BLOCKCHAIN_BLOCKS.length
  });
  const [tamperInjected, setTamperInjected] = useState(false);

  // Run live verification
  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const report = verifyBlockchainIntegrity(blocks);
      setValidationReport(report);
      setIsVerifying(false);
      if (report.isValid) {
        showToast('All SHA-256 cryptographic hashes & Merkle roots 100% verified.', 'success');
      } else {
        showToast(`CRITICAL: Tamper detected at Block #${report.brokenBlockIndex}!`, 'error');
      }
    }, 600);
  };

  // Simulate malicious injection into database (Judge-Killer Demo)
  const handleSimulateTamper = () => {
    const updated = blocks.map(b => {
      if (b.index === 1841) {
        // Illegally modify transaction payload without cryptographic re-signing
        const tamperedTx = { ...b.transactions[0] };
        tamperedTx.approvedValue = '98% Approved (FRAUDULENT OVERRIDE: Withholding Removed)';
        return {
          ...b,
          transactions: [tamperedTx],
          isTampered: true
        };
      }
      return b;
    });

    setBlocks(updated);
    setTamperInjected(true);

    // Verify to trigger cryptographic alarm
    const report = verifyBlockchainIntegrity(updated);
    setValidationReport(report);
    setSelectedBlock(updated.find(b => b.index === 1841)!);
    showToast('ALERT: Malicious database tamper injected into Block #1841!', 'error');
  };

  // Restore immutable ledger from distributed consensus / seed
  const handleRestoreLedger = () => {
    setBlocks(INITIAL_BLOCKCHAIN_BLOCKS);
    setTamperInjected(false);
    const report = verifyBlockchainIntegrity(INITIAL_BLOCKCHAIN_BLOCKS);
    setValidationReport(report);
    setSelectedBlock(INITIAL_BLOCKCHAIN_BLOCKS[INITIAL_BLOCKCHAIN_BLOCKS.length - 1]);
    showToast('Immutable Ledger restored. Consensus synchronized with OIL Root Certificate.', 'success');
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast(`Copied ${label} to clipboard`, 'info');
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* HEADER & COMPLIANCE BAR */}
      <div className="bg-white rounded-xl p-5 border border-slate-300 shadow-xs flex flex-col gap-4 hover-elevate">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-blue-700 uppercase tracking-widest font-semibold">
                SIH26122 INNOVATION #3
              </span>
              <span className="font-mono text-[10px] text-slate-300">/</span>
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                Cryptographic Governance
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[24px]">enhanced_encryption</span>
                Immutable Blockchain Audit Ledger (SHA-256 Hash Chain)
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                CVC CIRCULAR 02/01/2022 COMPLIANT
              </span>
              <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px] font-bold">
                CAG SECTION 14-C READY
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className="px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[16px] ${isVerifying ? 'animate-spin' : ''}`}>
                {isVerifying ? 'sync' : 'verified'}
              </span>
              <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Cryptographic Chain'}</span>
            </button>

            {!tamperInjected ? (
              <button
                onClick={handleSimulateTamper}
                className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-mono text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                title="Simulate malicious tampering of approved records to demonstrate detection"
              >
                <span className="material-symbols-outlined text-[16px] text-rose-600">bug_report</span>
                <span>Simulate DB Tamper (Hackathon Demo)</span>
              </button>
            ) : (
              <button
                onClick={handleRestoreLedger}
                className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer animate-bounce"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Restore Immutable Consensus</span>
              </button>
            )}
          </div>
        </div>

        {/* INTEGRITY STATUS ALERT BANNER */}
        {validationReport.isValid ? (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">verified_user</span>
              <span><strong>CHAIN INTEGRITY 100% VALID:</strong> Zero unauthorized modifications detected across all blocks. All SHA-256 parent links &amp; Merkle roots match.</span>
            </div>
            <span className="font-bold text-emerald-800 hidden sm:inline">PROVENANCE ANCHOR: OIL-HQ-DULIAJAN</span>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-950 flex flex-col gap-2 text-xs font-mono animate-pulse">
            <div className="flex items-center gap-2 text-sm font-bold text-rose-800">
              <span className="material-symbols-outlined text-rose-700 text-[24px]">gpr</span>
              <span>CRITICAL CVC STATUTORY ALERT: CRYPTOGRAPHIC HASH CHAIN TAMPER DETECTED!</span>
            </div>
            <p className="text-slate-800 leading-relaxed">
              {validationReport.failureReason}
            </p>
            <div className="flex items-center gap-4 text-[11px] text-rose-900 mt-1">
              <span>Tampered Block: <strong>#{validationReport.brokenBlockIndex}</strong></span>
              <span>•</span>
              <span>Rule Violated: <strong>CVC Circular 02/01/2022 (Unauthorized actuals alteration)</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* HORIZONTAL BLOCKCHAIN EXPLORER */}
      <div className="bg-white rounded-xl p-5 border border-slate-300 shadow-xs flex flex-col gap-3 hover-elevate">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 font-mono flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-700 text-[18px]">account_tree</span>
            LIVE HASH CHAIN VISUAL EXPLORER (BLOCK #1838 TO #1842)
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Click any block to inspect cryptographic payload
          </span>
        </div>

        {/* Scrollable Blocks Chain */}
        <div className="overflow-x-auto pb-3 pt-2">
          <div className="flex items-center gap-3 min-w-[980px]">
            {blocks.map((b, idx) => {
              const isSelected = selectedBlock.index === b.index;
              const hasTamper = b.isTampered;

              return (
                <React.Fragment key={b.index}>
                  <div
                    onClick={() => setSelectedBlock(b)}
                    className={`flex-1 p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs flex flex-col gap-2 ${
                      hasTamper 
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400' 
                        : isSelected
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-400 shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-blue-700">token</span>
                        Block #{b.index}
                      </span>
                      {hasTamper ? (
                        <span className="px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 font-mono text-[9px] font-bold">
                          TAMPERED
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold">
                          VERIFIED
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 text-[10px] font-mono">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Transactions:</span>
                        <strong className="text-slate-800">{b.transactions.length} Tx</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Nonce:</span>
                        <strong className="text-slate-800">{b.nonce}</strong>
                      </div>
                      <div className="mt-1 flex flex-col gap-0.5">
                        <span className="text-[9px] text-slate-400">Block Hash:</span>
                        <span className={`text-[9px] truncate font-bold ${hasTamper ? 'text-rose-700' : 'text-blue-700'}`}>
                          {b.hash.substring(0, 18)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hash Link Connector Arrow */}
                  {idx < blocks.length - 1 && (
                    <div className="flex flex-col items-center justify-center shrink-0 px-1 text-slate-400">
                      <span className="material-symbols-outlined text-[20px] text-blue-600">link</span>
                      <span className="font-mono text-[8px] text-slate-400">SHA-256</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* SELECTED BLOCK DEEP PAYLOAD INSPECTOR */}
      {selectedBlock && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Column 1 & 2: Transaction & Header Details */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-300 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-sans flex items-center gap-2">
                    Cryptographic Payload: Block #{selectedBlock.index}
                    {selectedBlock.isTampered && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px] font-bold">
                        INVALIDATED SIGNATURE
                      </span>
                    )}
                  </h3>
                  <span className="font-mono text-[11px] text-slate-500">
                    Timestamp: {selectedBlock.timestamp}
                  </span>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(JSON.stringify(selectedBlock, null, 2), `Block #${selectedBlock.index} JSON`)}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>Copy JSON</span>
              </button>
            </div>

            {/* Block Cryptographic Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 uppercase">Block Hash (SHA-256)</span>
                <span className="text-[11px] text-blue-700 font-bold break-all select-all">
                  {selectedBlock.hash}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 uppercase">Previous Block Hash</span>
                <span className="text-[11px] text-slate-800 font-bold break-all select-all">
                  {selectedBlock.previousHash}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 uppercase">Merkle Root</span>
                <span className="text-[11px] text-emerald-700 font-bold break-all select-all">
                  {selectedBlock.merkleRoot}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 uppercase">Digital Signer Token</span>
                <span className="text-[11px] text-slate-900 font-bold">
                  {selectedBlock.validatorSignature}
                </span>
                <span className="text-[9px] text-slate-500">{selectedBlock.validatorTitle}</span>
              </div>
            </div>

            {/* Embedded Ledger Transactions */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wide">
                Transactions Enclosed in Block ({selectedBlock.transactions.length})
              </span>

              {selectedBlock.transactions.map((tx) => (
                <div key={tx.txId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-[10px] font-bold">
                        {tx.type}
                      </span>
                      <strong className="text-sm text-slate-900 font-mono">{tx.activityCode}</strong>
                      <span className="text-xs text-slate-600 font-sans">• {tx.activityName}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 font-bold">
                      {tx.cagComplianceCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded bg-white border border-slate-200 flex flex-col gap-0.5">
                      <span className="text-[9px] text-slate-500 uppercase">Field Reported Value</span>
                      <span className="text-slate-800 font-semibold">{tx.reportedValue}</span>
                      <span className="text-[10px] text-slate-500">By: {tx.reportedBy}</span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-slate-200 flex flex-col gap-0.5">
                      <span className="text-[9px] text-slate-500 uppercase">Approved In Ledger</span>
                      <span className={`font-semibold ${selectedBlock.isTampered ? 'text-rose-700 font-bold' : 'text-emerald-700'}`}>
                        {tx.approvedValue}
                      </span>
                      <span className="text-[10px] text-slate-500">Approved by: {tx.approvedBy}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono border-t border-slate-200/80 pt-2">
                    <span>Chainage: <strong>{tx.chainage}</strong></span>
                    <span>Tx Hash: <strong>TX-{tx.txId.substring(0, 10)}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Legal & Statutory Dossier Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-300 shadow-xs flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700 text-[22px]">gavel</span>
                <h4 className="font-bold text-slate-900 text-sm">
                  CVC Statutory Dossier Summary
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Under Central Vigilance Commission guidelines for Public Sector Undertakings (PSUs), all schedule changes, quantity variances, and progress actuals must be permanently cryptographically bound.
              </p>

              <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs font-mono flex flex-col gap-1.5 text-amber-950">
                <div className="flex items-center justify-between">
                  <span>Audit Trail Level:</span>
                  <strong>Tier-1 Forensic</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Hash Algorithm:</span>
                  <strong>SHA-256 (NIST FIPS 180-4)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Signer Authority:</span>
                  <strong>OIL PKI CA-Assam</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Court Admissibility:</span>
                  <strong className="text-emerald-800">IT Act 2000 § 65B</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => showToast('Exporting official CVC Cryptographic Certificate...', 'info')}
                className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Export CVC Audit Certificate (PDF/XER)</span>
              </button>
              <span className="text-[10px] text-center text-slate-500 font-mono">
                Cryptographically bound to Oracle EPPM P6.24
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
