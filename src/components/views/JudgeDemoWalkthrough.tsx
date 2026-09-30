import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  PlayCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Mic, 
  Check, 
  AlertTriangle, 
  AlertCircle, 
  TrendingUp, 
  GitCommit, 
  Sliders, 
  Dna, 
  History, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface DemoStep {
  stepNumber: number;
  title: string;
  tagline: string;
  description: string;
  actionLabel: string;
  targetTab: any;
  explanation: string[];
}

export const JudgeDemoWalkthrough: React.FC = () => {
  const { 
    setActiveTab, 
    submitFieldInput, 
    approveMatch, 
    matches, 
    setCurrentRole, 
    resetToDefaultDemo 
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: DemoStep[] = [
    {
      stepNumber: 1,
      title: 'Executive Project Control Dashboard',
      tagline: '4-Dimension Health: Baseline vs Actual vs Forecast vs Variance',
      description: 'Observe the overall project health index for Oil India Limited (North-East Process Facility Expansion, Duliajan). The project is currently AT RISK due to critical-path piping slippage.',
      actionLabel: 'Go to Dashboard View',
      targetTab: 'DASHBOARD',
      explanation: [
        'Contractual baseline targeted for 30-Nov; current unmitigated forecast has slipped to 18-Dec (+18 days).',
        'Transparent 0-100 Risk Engine shows additive breakdown (+27 schedule variance, +18 critical path).',
        'Today\'s Attention Queue surfaces critical path bottlenecks before the daily schedule freeze.'
      ]
    },
    {
      stepNumber: 2,
      title: 'Supervisor Submits Field Voice Dispatch',
      tagline: 'Zero-Friction Audio Capture with Ambient Noise Tolerance',
      description: 'Site piping supervisor Bikash Gogoi speaks into his mobile app: "12 inch spool erected near compressor section today. Around 18 meters completed between 9:00 AM and 4:30 PM."',
      actionLabel: 'Open Voice Time Agent',
      targetTab: 'FIELD_INPUT',
      explanation: [
        'Supervisor does not need to search through 10,000 schedule IDs or fill complicated forms.',
        'Speech-to-text transcript is normalized into a structured JSON execution event with quantity (18m) and discipline (Piping).',
        'Supports offline queueing for poor remote site network conditions in Assam.'
      ]
    },
    {
      stepNumber: 3,
      title: 'AI Proposes L5/L6 Activity Mapping with Explainability',
      tagline: 'Multi-Stage Calibrated Reranking with Grounded Evidence',
      description: 'The AI matching engine analyzes lexical tokens, fuzzy match, discipline filter, physical plant location, and predecessor status to propose PIPE-ERECT-L6-0142 with 94% calibrated confidence.',
      actionLabel: 'Inspect in AI Review Center',
      targetTab: 'REVIEW_CENTER',
      explanation: [
        '12-inch dimension exactly matches schedule specification.',
        'Spool / erection technical terminology matches L6 scope.',
        'Compressor area matches plant physical location (Area 04).',
        'Predecessor foundation F-102 verified complete in previous shift.',
        'High confidence (>=90%) generates strong auto-recommendation for planner sign-off.'
      ]
    },
    {
      stepNumber: 4,
      title: 'Planner Approves & Schedule Actuals Update in Real-Time',
      tagline: 'Human-in-the-Loop Verification with Live CPM Recalculation',
      description: 'Lead Project Planner Pranjal Saikia reviews the evidence checklist and clicks APPROVE. The schedule actual progress updates immediately from 58% to 78% without altering the baseline.',
      actionLabel: 'Simulate Approval & Schedule Update',
      targetTab: 'REVIEW_CENTER',
      explanation: [
        'Baseline plan remains immutable and tamper-proof.',
        'Actual progress increases to 78%, recording start and execution duration.',
        'Downstream forecast dates dynamically update across the Critical Path Method (CPM) graph.'
      ]
    },
    {
      stepNumber: 5,
      title: 'Cross-Channel Progress Conflict Detection',
      tagline: 'Preventing Inadvertent Schedule Overwrites Across Disparate Sources',
      description: 'An evening Excel tracking spreadsheet uploaded by the piping subcontractor reports 70% completion, contradicting the supervisor\'s 78% verified claim. SiteSync prevents silent overwrite.',
      actionLabel: 'Examine Data Conflict Center',
      targetTab: 'CONFLICT_CENTER',
      explanation: [
        'Flags PROGRESS CONFLICT (8% discrepancy between voice log and spreadsheet).',
        'Presents side-by-side evidence with submitter names and timestamps.',
        'Requires planner adjudication before any schedule alteration.'
      ]
    },
    {
      stepNumber: 6,
      title: 'Temporal Consistency & Chronology Validation',
      tagline: 'Blocking Impossible Chronology in Field Reporting',
      description: 'A night shift field log indicated hydrostatic pressure testing preparation on Line 12 while its upstream fit-up predecessor (PIPE-FITUP-L6-0143) is only 40% complete.',
      actionLabel: 'Inspect Temporal Violations',
      targetTab: 'CONFLICT_CENTER',
      explanation: [
        'Dependency validation catches Finish-to-Start (FS) logic violations.',
        'Chronological guardrails prevent false progress claims from advancing downstream testing.'
      ]
    },
    {
      stepNumber: 7,
      title: 'Delay Intelligence & Historical Benchmarking',
      tagline: 'Comparing Live Execution Against 54 Regional Historical Projects',
      description: 'Live actual duration for 12" spool erection has reached 9 days, exceeding the regional empirical median of 6.0 days (+1.4d variance delta).',
      actionLabel: 'View Activity DNA Benchmarks',
      targetTab: 'ACTIVITY_DNA',
      explanation: [
        'Historical Activity DNA reveals primary delay drivers: Material availability (42%) and crane rigging constraint (26%).',
        'Benchmark profiles for Assam Industrial Engineering Services (AIES) show typical +1.6d schedule variance in monsoons.'
      ]
    },
    {
      stepNumber: 8,
      title: 'Downstream Change Impact Domino Graph',
      tagline: 'Visualizing Downstream Domino Effects on Milestones',
      description: 'The 7-day delay on PIPE-ERECT-L6-0142 cascades directly into fit-up inspection, hydrostatic testing, and compressor shaft alignment.',
      actionLabel: 'View Impact on 4D Gantt',
      targetTab: 'GANTT_4D',
      explanation: [
        'Traces dependency path: Erection → Fit-up → Hydrotest → Solo Run → Milestone.',
        'Projects total facility commissioning slippage from 30-Nov to 18-Dec.'
      ]
    },
    {
      stepNumber: 9,
      title: 'What-If Schedule Recovery Simulator',
      tagline: 'Simulating Mitigation Levers to Recover Slipped Milestones',
      description: 'Project manager simulates deploying 15 additional riggers + 2 hours daily overtime + expedited spool airfreight.',
      actionLabel: 'Open What-If Simulator',
      targetTab: 'WHAT_IF',
      explanation: [
        'Simulated finish date recovers 13 calendar days (moving forecast from 18-Dec back to 05-Dec).',
        'Reduces project risk score by 24 points.',
        'Cost impact of ₹7.39 Lakhs prevents ₹23.4 Lakhs in liquidated damages.'
      ]
    },
    {
      stepNumber: 10,
      title: 'Institutional Memory & Project Terminology Memory',
      tagline: 'Machine Learning from Human Corrections and Site Vocabularies',
      description: 'Colloquial site phrases ("spool install", "compressor piping", "line fit-up") are permanently retained in project memory, raising subsequent AI match confidence to 98%.',
      actionLabel: 'Inspect Learned Vocabularies',
      targetTab: 'REVIEW_CENTER',
      explanation: [
        'System builds enterprise dictionary specific to Oil India installations and local sub-contractors.',
        'Eliminates repetitive manual corrections across multi-year infrastructure capital works.'
      ]
    },
    {
      stepNumber: 11,
      title: 'End-to-End Report-to-Schedule Traceability',
      tagline: 'Auditable Provenance from Project Forecast to Exact Audio Transcript',
      description: 'Click any activity forecast to inspect complete forensic provenance: Exact audio file, supervisor timestamp, AI model version, planner approval note, and delta history.',
      actionLabel: 'Inspect Immutable Audit Trail',
      targetTab: 'AUDIT_TRAIL',
      explanation: [
        'Answers the ultimate project controls question: "Why does the schedule show this activity progressed on 28-Sep?"',
        'Cryptographic audit log satisfies government and enterprise vigilance compliance standards.'
      ]
    }
  ];

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const executeStepAction = () => {
    // Perform specialized action per step if helpful
    if (currentStep.stepNumber === 4) {
      const target = matches.find(m => m.status === 'PENDING_REVIEW');
      if (target) {
        approveMatch(target.matchId, target.selectedActivityId, 'Live demo approved by judge');
      }
    }
    setActiveTab(currentStep.targetTab);
  };

  return (
    <div className="p-3.5 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 p-4 sm:p-5 rounded-xl border border-amber-500/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
              5-MINUTE JUDGE DEMO MODE
            </span>
            <span className="text-xs text-amber-300 font-mono">SIH26122 • Smart Automation Narrative</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            SiteSync AI: Intelligent Planning-to-Execution Bridge
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Follow this 11-step interactive narrative script designed specifically for hackathon judging evaluations.
          </p>
        </div>

        <button
          onClick={resetToDefaultDemo}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Step Stepper Progress Bar (Horizontal Touch Scroll with no scrollbars) */}
      <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {steps.map((st, i) => {
          const isDone = i < currentStepIndex;
          const isCurrent = i === currentStepIndex;
          return (
            <button
              key={st.stepNumber}
              onClick={() => setCurrentStepIndex(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all shrink-0 active:scale-95 ${
                isCurrent 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md ring-1 ring-amber-400' 
                  : isDone
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                  : 'bg-slate-950 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>{st.stepNumber}.</span>
              <span>{st.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Card */}
      <div className="bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-800 space-y-4 sm:space-y-6 shadow-sm">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span className="text-amber-400 font-bold">NARRATIVE STEP {currentStep.stepNumber} OF {steps.length}</span>
            <span>Est. Demo: ~25 sec</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {currentStep.title}
          </h2>
          <div className="text-sm font-semibold text-amber-300 mt-1">
            "{currentStep.tagline}"
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-slate-800">
          {currentStep.description}
        </p>

        {/* Key Takeaways for Judges */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Key Technical Innovations to Highlight to Judges:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {currentStep.explanation.map((exp, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{exp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Navigation Controls (Thumb-friendly mobile stacking) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between gap-2 order-2 sm:order-1">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 flex-1 sm:flex-initial active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 flex-1 sm:flex-initial active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={executeStepAction}
            className="order-1 sm:order-2 w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ring-1 ring-amber-300/40 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>{currentStep.actionLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
