import React, { useState, useEffect } from 'react';
import { useApp } from '../../services/store';
import { 
  SAFETY_SCENARIOS, 
  INITIAL_SAFETY_BADGES, 
  INITIAL_LEADERBOARD, 
  SafetyQuestion, 
  SafetyBadge, 
  LeaderboardUser 
} from '../../services/safetyEngine';

export const SafetyTrainingHub: React.FC = () => {
  const { showToast, currentUser } = useApp();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(980);
  const [badges, setBadges] = useState<SafetyBadge[]>(INITIAL_SAFETY_BADGES);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [secondsLeft, setSecondsLeft] = useState<number>(SAFETY_SCENARIOS[0].timeLimitSec);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  const scenario: SafetyQuestion = SAFETY_SCENARIOS[currentScenarioIndex];

  // Countdown timer for crisis drills
  useEffect(() => {
    if (hasAnswered) return;
    if (secondsLeft <= 0) {
      setHasAnswered(true);
      showToast('Time expired! Crisis response timeout logged.', 'warning');
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, hasAnswered]);

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return;
    setSelectedOptionId(optionId);
    setHasAnswered(true);

    const chosen = scenario.options.find(o => o.id === optionId);
    if (!chosen) return;

    const newScore = Math.max(0, userScore + chosen.consequenceScore);
    setUserScore(newScore);

    if (chosen.isCorrect) {
      showToast(`+${chosen.consequenceScore} XP! Protocol executed safely.`, 'success');
      // Unlock badge if high score
      if (newScore >= 1200) {
        setBadges(prev => prev.map(b => b.id === 'BADGE-CVC' ? { ...b, unlocked: true, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' } : b));
      }
    } else {
      showToast(`${chosen.consequenceScore} XP. Regulatory safety violation recorded.`, 'error');
    }

    // Update leaderboard current user
    setLeaderboard(prev => prev.map(u => u.name.includes('You') ? { ...u, score: newScore } : u));
  };

  const handleNextScenario = () => {
    const nextIdx = (currentScenarioIndex + 1) % SAFETY_SCENARIOS.length;
    setCurrentScenarioIndex(nextIdx);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setSecondsLeft(SAFETY_SCENARIOS[nextIdx].timeLimitSec);
  };

  const chosenOption = scenario.options.find(o => o.id === selectedOptionId);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-amber-800/40 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                OISD-118 & OISD-141 GAMIFIED TRAINING // OIL PSU
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                ZERO-HARM STATUTORY CERTIFICATION
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              Gamified Safety & HSE Compliance Training Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Simulated life-or-death crisis drills for crude pipeline engineers. Timed decision trees on H₂S leaks, trench shoring collapses, and permit-to-work hot tapping with real-time peer leaderboard and verified digital credentials.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-center">
              <div className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold">Your HSE Score</div>
              <div className="text-xl font-black font-mono text-amber-200">{userScore} XP</div>
            </div>

            <button
              onClick={() => setIsCertificateOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
              View Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Main Crisis Drill Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Active Crisis Drill Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px] font-bold">
                    CRISIS DRILL #{currentScenarioIndex + 1} OF {SAFETY_SCENARIOS.length}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{scenario.location}</span>
                </div>
                <h2 className="text-lg font-black text-slate-900 mt-1">{scenario.scenarioTitle}</h2>
              </div>

              {/* Countdown Timer Gauge */}
              <div className={`px-3 py-1.5 rounded-xl border text-center font-mono ${
                secondsLeft <= 8 ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div className="text-[9px] uppercase tracking-wider font-bold">Timer Remaining</div>
                <div className="text-base font-black">{secondsLeft}s</div>
              </div>
            </div>

            {/* Scenario Narrative Box */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
              <div className="text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
                SITUATION REPORT (SITREP):
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {scenario.description}
              </p>
            </div>

            {/* Multiple Choice Protocol Options */}
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Immediate Mandatory Action Protocol:
              </div>

              {scenario.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                let btnStyle = 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800';

                if (hasAnswered) {
                  if (option.isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500';
                  } else if (isSelected && !option.isCorrect) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500';
                  } else {
                    btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={option.id}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {option.id}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-normal flex-1">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Answer Debrief & Regulatory Standard */}
            {hasAnswered && chosenOption && (
              <div className={`p-4 rounded-xl border space-y-2 text-xs font-mono animate-fadeIn ${
                chosenOption.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="font-bold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    {chosenOption.isCorrect ? 'check_circle' : 'cancel'}
                  </span>
                  {chosenOption.isCorrect ? 'STATUTORY COMPLIANCE ACHIEVED' : 'LIFE SAFETY VIOLATION'}
                </div>
                <p className="font-sans text-xs leading-relaxed">{chosenOption.explanation}</p>
                <div className="text-[10px] font-bold pt-1 border-t border-current/20">
                  Authority: {chosenOption.regulatoryStandard}
                </div>
              </div>
            )}

            {/* Next Scenario Button */}
            {hasAnswered && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextScenario}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs transition-all shadow-md flex items-center gap-2"
                >
                  Next Crisis Scenario
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Badges & Leaderboard */}
        <div className="space-y-4">
          {/* Unlocked Badges */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-500">military_tech</span>
              HSE Achievement Badges ({badges.filter(b => b.unlocked).length}/{badges.length})
            </h3>

            <div className="space-y-2.5">
              {badges.map(b => (
                <div key={b.id} className={`p-3 rounded-xl border flex items-center gap-3 ${b.color}`}>
                  <span className="material-symbols-outlined text-[24px]">{b.icon}</span>
                  <div>
                    <div className="text-xs font-bold font-mono">{b.title}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional PSU HSE Leaderboard */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-indigo-600">leaderboard</span>
              Corridor Safety Leaderboard
            </h3>

            <div className="space-y-2">
              {leaderboard.map(user => (
                <div 
                  key={user.rank}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    user.name.includes('You') ? 'bg-amber-50/80 border-amber-300 font-bold' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                      {user.rank}
                    </span>
                    <div>
                      <div className="text-slate-900">{user.name}</div>
                      <div className="text-[10px] text-slate-500">{user.station}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-amber-700 font-black">{user.score} XP</div>
                    <div className="text-[9px] text-slate-400">{user.badgeCount} Badges</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Digital Certificate Modal */}
      {isCertificateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-amber-500 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl text-center space-y-4 relative">
            <button
              onClick={() => setIsCertificateOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>

            <div className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
              GOVERNMENT OF INDIA // MINISTRY OF PETROLEUM & NATURAL GAS
            </div>
            <div className="text-sm font-bold text-slate-900 uppercase">
              OIL INDIA LIMITED // 132 KM DIGBOI-DULIAJAN TRUNKLINE
            </div>

            <div className="py-2">
              <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-900">
                CERTIFICATE OF SAFETY EXCELLENCE
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Awarded under PNGRB Technical & OISD-141 Governance Regulations
              </p>
            </div>

            <p className="text-xs text-slate-600 font-mono">
              This certifies that <strong className="text-slate-900 font-sans text-sm">{currentUser?.name || 'Er. SiteSync Lead'}</strong> has successfully mastered advanced crisis management protocols for Crude Oil Pipeline Operations.
            </p>

            <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-t border-b border-slate-200 py-3">
              <div>
                <span className="block font-bold text-slate-800">Serial Hash:</span>
                <span className="text-[10px]">OIL-HSE-2026-9921B</span>
              </div>
              <div>
                <span className="block font-bold text-slate-800">Date Awarded:</span>
                <span className="text-[10px]">02-Oct-2026</span>
              </div>
              <div>
                <span className="block font-bold text-slate-800">Score:</span>
                <span className="text-amber-700 font-black">{userScore} XP</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => {
                  window.print();
                  setIsCertificateOpen(false);
                }}
                className="py-2 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Print Official Credential
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
