import React, { useState } from 'react';
import { useApp, DEMO_USERS } from '../../services/store';
import { UserRole } from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  HardHat, 
  Compass, 
  Briefcase, 
  CheckCircle2, 
  PlayCircle,
  HelpCircle,
  Fingerprint,
  Radio
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setActiveTab } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('planner');
  const [emailInput, setEmailInput] = useState<string>(DEMO_USERS.planner.email);
  const [passwordInput, setPasswordInput] = useState<string>(DEMO_USERS.planner.password || 'planner123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const personaList: {
    role: UserRole;
    name: string;
    title: string;
    department: string;
    empId: string;
    badge: string;
    color: string;
    borderColor: string;
    bgColor: string;
    ringColor: string;
    icon: React.ReactNode;
    features: string[];
  }[] = [
    {
      role: 'planner',
      name: DEMO_USERS.planner.name,
      title: DEMO_USERS.planner.designation,
      department: DEMO_USERS.planner.department,
      empId: DEMO_USERS.planner.employeeId,
      badge: 'Controls & Baseline',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-500/10',
      ringColor: 'ring-emerald-400/50',
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      features: ['AI Review Center', 'Primavera Baseline Approval', 'Teach AI Vocabulary']
    },
    {
      role: 'supervisor',
      name: DEMO_USERS.supervisor.name,
      title: DEMO_USERS.supervisor.designation,
      department: DEMO_USERS.supervisor.department,
      empId: DEMO_USERS.supervisor.employeeId,
      badge: 'Field Operations',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-500/10',
      ringColor: 'ring-amber-400/50',
      icon: <HardHat className="w-5 h-5 text-amber-400" />,
      features: ['Voice Time Agent', 'Camera Geotag Photos', 'Offline SQLite Queue']
    },
    {
      role: 'project_manager',
      name: DEMO_USERS.project_manager.name,
      title: DEMO_USERS.project_manager.designation,
      department: DEMO_USERS.project_manager.department,
      empId: DEMO_USERS.project_manager.employeeId,
      badge: 'Executive Oversight',
      color: 'text-sky-400',
      borderColor: 'border-sky-500/40',
      bgColor: 'bg-sky-500/10',
      ringColor: 'ring-sky-400/50',
      icon: <Briefcase className="w-5 h-5 text-sky-400" />,
      features: ['Executive Health S-Curves', 'What-If Monte Carlo', 'Contractor Dispute Adjudication']
    },
    {
      role: 'admin',
      name: DEMO_USERS.admin.name,
      title: DEMO_USERS.admin.designation,
      department: DEMO_USERS.admin.department,
      empId: DEMO_USERS.admin.employeeId,
      badge: 'Vigilance & Audit',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      bgColor: 'bg-purple-500/10',
      ringColor: 'ring-purple-400/50',
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      features: ['Immutable SHA-256 Provenance', 'Anti-Tamper Audit Logs', 'Activity Archetype DNA']
    }
  ];

  // Quick switch role prefill
  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    const user = DEMO_USERS[r];
    setEmailInput(user.email);
    setPasswordInput(user.password || 'password123');
    setErrorMessage(null);
  };

  // 1-Click Fast Evaluator Sign-In
  const handleInstantSignIn = (r: UserRole) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      login(r);
      setIsAuthenticating(false);
    }, 400);
  };

  // Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailInput.trim()) {
      setErrorMessage('Please enter your Oil India enterprise email or Employee ID.');
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      // Find matching demo user by email or role
      const matched = (Object.values(DEMO_USERS) as typeof DEMO_USERS[UserRole][]).find(
        u => u.email.toLowerCase() === emailInput.toLowerCase() || u.employeeId.toLowerCase() === emailInput.toLowerCase()
      );

      if (matched) {
        login(matched);
      } else {
        // Fallback to selected role
        login(selectedRole);
      }
      setIsAuthenticating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full bg-gradient-to-tl from-emerald-500/10 via-emerald-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Top Corporate Bar */}
      <header className="px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-lg shadow-lg ring-1 ring-amber-400/50 shrink-0">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-sans">
                  SiteSync <span className="text-amber-400">AI</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300 font-semibold tracking-wider uppercase">
                  OIL INDIA LIMITED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Intelligent Planning-to-Execution Bridge (SIH26122 • Smart Automation)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>PS-ID: 26122</span>
            </div>

            <button
              onClick={() => handleInstantSignIn('planner')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Skip to Demo</span>
              <span className="sm:hidden">Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center">
        {/* Title & Tagline Hero */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold mb-1">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Oil India Enterprise Access & Ground-Truth Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            From Field Information to Trusted Schedule Progress — <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400">Automatically.</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Select an enterprise role below to test the intelligent execution bridge, or enter credentials for corporate single sign-on access.
          </p>
        </div>

        {/* Dual Layout: Evaluator 1-Click Cards + Enterprise Login Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start max-w-6xl mx-auto w-full">
          
          {/* LEFT: 1-Click Evaluator Personas (7 Cols) */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>1-Click Evaluator Personas (Hackathon Fast Access)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any persona below to simulate their role-specific mission and permissions:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {personaList.map((p) => {
                const isSelected = selectedRole === p.role;
                return (
                  <div
                    key={p.role}
                    className={`p-4 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between ${
                      isSelected 
                        ? `${p.bgColor} ${p.borderColor} ring-1 ${p.ringColor} shadow-xl scale-[1.01]` 
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      {/* Top Role Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg bg-slate-950 border ${p.borderColor} shadow-sm shrink-0`}>
                            {p.icon}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {p.title}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${p.borderColor} ${p.color} bg-slate-950/80 shrink-0`}>
                          {p.badge}
                        </span>
                      </div>

                      {/* Department & Employee ID */}
                      <div className="text-[10px] text-slate-500 font-mono mb-3 line-clamp-1">
                        {p.empId} • {p.department.split(',')[0]}
                      </div>

                      {/* Capabilities Checklist */}
                      <div className="space-y-1 mb-4">
                        {p.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <CheckCircle2 className={`w-3.5 h-3.5 ${p.color} shrink-0`} />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instant Access Button */}
                    <button
                      onClick={() => handleInstantSignIn(p.role)}
                      disabled={isAuthenticating}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:text-white'
                      }`}
                    >
                      <span>Sign In as {p.role === 'project_manager' ? 'PM' : p.role.charAt(0).toUpperCase() + p.role.slice(1)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Hackathon Evaluator Note */}
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-300 font-semibold">Judge Evaluator Note:</span> Switching roles dynamically changes the application’s view, navigation desk, and approval authorities (e.g. Site Supervisors submit field DPRs; Project Planners verify candidate linkages and commit actuals to Primavera P6).
              </div>
            </div>
          </div>

          {/* RIGHT: Enterprise Credential & SSO Sign In (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-emerald-400" />
                  <span>Enterprise Credential Login</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Oil India Active Directory Single Sign-On
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                SECURE SSL
              </span>
            </div>

            {/* Quick Fill Pills */}
            <div className="mb-4">
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1.5">
                Quick Select Enterprise Persona:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {personaList.map((p) => (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleSelectRole(p.role)}
                    className={`py-1 px-2 rounded text-[11px] font-semibold border transition-all text-left truncate flex items-center gap-1.5 ${
                      selectedRole === p.role
                        ? 'bg-slate-800 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{p.role === 'planner' ? '📐' : p.role === 'supervisor' ? '👷' : p.role === 'project_manager' ? '👔' : '🛡️'}</span>
                    <span className="truncate">{p.name.split(' ')[0]} ({p.badge.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email / Emp ID */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1 font-mono uppercase">
                  Enterprise Email or Employee ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. pranjal.saikia@oilindia.in or OIL-PLN-4421"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-300 font-mono uppercase">
                    Security Passcode / PIN
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">Default: demo password</span>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter enterprise passcode"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember session</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">256-bit AES Auth</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer mt-2 disabled:opacity-70"
              >
                {isAuthenticating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating with Oil India Directory...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Access SiteSync AI</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Corporate SSO Alternative */}
            <div className="mt-4 pt-3.5 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => handleInstantSignIn(selectedRole)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Sign In via Oil India SAP NetWeaver SSO</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SIH26122 • Smart Automation • Oil India Limited Prototype</span>
          <span className="text-[11px] text-slate-600">Enterprise Role-Based Access Control (RBAC) & Immutable Provenance</span>
        </div>
      </footer>
    </div>
  );
};
