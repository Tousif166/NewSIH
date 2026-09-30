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
    badgeStyle: string;
    tagBg: string;
    accentColor: string;
    icon: React.ReactNode;
    features: string[];
  }[] = [
    {
      role: 'planner',
      name: DEMO_USERS.planner.name,
      title: DEMO_USERS.planner.designation,
      department: DEMO_USERS.planner.department,
      empId: DEMO_USERS.planner.employeeId,
      badge: 'Controls',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      tagBg: 'bg-emerald-50/60',
      accentColor: 'text-emerald-700',
      icon: <Compass className="w-4 h-4 text-emerald-700" />,
      features: ['AI Review Center', 'Primavera Baseline Approval', 'Teach AI Vocabulary']
    },
    {
      role: 'supervisor',
      name: DEMO_USERS.supervisor.name,
      title: DEMO_USERS.supervisor.designation,
      department: DEMO_USERS.supervisor.department,
      empId: DEMO_USERS.supervisor.employeeId,
      badge: 'Field Ops',
      badgeStyle: 'bg-amber-50 text-amber-900 border-amber-300',
      tagBg: 'bg-amber-50/60',
      accentColor: 'text-amber-800',
      icon: <HardHat className="w-4 h-4 text-amber-700" />,
      features: ['Voice Time Agent', 'Camera Geotag Photos', 'Offline SQLite Queue']
    },
    {
      role: 'project_manager',
      name: DEMO_USERS.project_manager.name,
      title: DEMO_USERS.project_manager.designation,
      department: DEMO_USERS.project_manager.department,
      empId: DEMO_USERS.project_manager.employeeId,
      badge: 'Executive',
      badgeStyle: 'bg-blue-50 text-blue-800 border-blue-300',
      tagBg: 'bg-blue-50/60',
      accentColor: 'text-blue-700',
      icon: <Briefcase className="w-4 h-4 text-blue-700" />,
      features: ['Executive Health S-Curves', 'What-If Monte Carlo', 'Contractor Dispute Adjudication']
    },
    {
      role: 'admin',
      name: DEMO_USERS.admin.name,
      title: DEMO_USERS.admin.designation,
      department: DEMO_USERS.admin.department,
      empId: DEMO_USERS.admin.employeeId,
      badge: 'Vigilance',
      badgeStyle: 'bg-purple-50 text-purple-800 border-purple-300',
      tagBg: 'bg-purple-50/60',
      accentColor: 'text-purple-700',
      icon: <ShieldCheck className="w-4 h-4 text-purple-700" />,
      features: ['Immutable SHA-256 Provenance', 'Anti-Tamper Audit Logs', 'Activity Archetype DNA']
    }
  ];

  const quickSelectLabels: Record<UserRole, { icon: React.ReactNode; name: string; tag: string }> = {
    planner: { icon: <Compass className="w-3.5 h-3.5 text-emerald-700" />, name: 'Pranjal', tag: 'Controls & Baseline' },
    supervisor: { icon: <HardHat className="w-3.5 h-3.5 text-amber-700" />, name: 'Debashis', tag: 'Field Execution' },
    project_manager: { icon: <Briefcase className="w-3.5 h-3.5 text-blue-700" />, name: 'Rajiv', tag: 'Executive Oversight' },
    admin: { icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />, name: 'Dr. Ananya', tag: 'Vigilance & Audit' },
  };

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    const user = DEMO_USERS[r];
    setEmailInput(user.email);
    setPasswordInput(user.password || 'password123');
    setErrorMessage(null);
  };

  const handleInstantSignIn = (r: UserRole) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      login(r);
      setIsAuthenticating(false);
    }, 350);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailInput.trim()) {
      setErrorMessage('Please enter your Oil India enterprise email or Employee ID.');
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      const matched = (Object.values(DEMO_USERS) as typeof DEMO_USERS[UserRole][]).find(
        u => u.email.toLowerCase() === emailInput.toLowerCase() || u.employeeId.toLowerCase() === emailInput.toLowerCase()
      );

      if (matched) {
        login(matched);
      } else {
        login(selectedRole);
      }
      setIsAuthenticating(false);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-blue-600/15 selection:text-blue-900 relative">
      {/* Top Corporate Bar */}
      <header className="px-4 sm:px-8 py-3.5 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900 font-sans">
                  SiteSync <span className="text-blue-700">AI</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono text-slate-700 font-semibold tracking-wider uppercase">
                  OIL INDIA LIMITED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-mono">
                Intelligent Planning-to-Execution Bridge • SIH26122
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PS-ID: 26122 • EPPM READY</span>
            </div>

            <button
              onClick={() => handleInstantSignIn('planner')}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5 text-blue-200" />
              <span>Skip to Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start">
        {/* Title & Tagline Hero */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-semibold mb-1">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse shrink-0" />
            <span>Oil India Enterprise Access & Ground-Truth Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            From Field Information to Trusted Schedule Progress —{' '}
            <span className="text-blue-700">Automatically.</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Select an enterprise role below to test the intelligent execution bridge, or enter credentials for corporate single sign-on access.
          </p>
        </div>

        {/* Dual Layout: Evaluator 1-Click Cards + Enterprise Login Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start max-w-7xl mx-auto w-full">
          
          {/* LEFT: 1-Click Evaluator Personas (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>1-Click Evaluator Personas (Hackathon Fast Access)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any persona below to simulate their role-specific mission and permissions:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {personaList.map((p) => {
                const isSelected = selectedRole === p.role;
                return (
                  <div
                    key={p.role}
                    className={`p-4 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between bg-white ${
                      isSelected 
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' 
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Meta Row */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs shrink-0">
                            {p.icon}
                          </div>
                          <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${p.badgeStyle}`}>
                            {p.badge}
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                          {p.empId}
                        </span>
                      </div>

                      {/* Identity */}
                      <div className="mb-3 space-y-0.5">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                          {p.name}
                        </div>
                        <div className="text-xs text-slate-600 font-medium leading-snug line-clamp-1" title={p.title}>
                          {p.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate" title={p.department}>
                          {p.department}
                        </div>
                      </div>

                      {/* Capabilities Checklist */}
                      <div className="space-y-1.5 mb-4 pt-2.5 border-t border-slate-100">
                        {p.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle2 className={`w-3.5 h-3.5 ${p.accentColor} shrink-0`} />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instant Access Button */}
                    <button
                      onClick={() => handleInstantSignIn(p.role)}
                      disabled={isAuthenticating}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-700 hover:bg-blue-800 text-white'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-900'
                      }`}
                    >
                      <span>Sign In as {p.role === 'project_manager' ? 'PM' : p.role.charAt(0).toUpperCase() + p.role.slice(1)}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Hackathon Evaluator Note */}
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 flex items-start gap-2.5 text-xs text-slate-600">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="text-slate-900 font-semibold">Judge Evaluator Note:</span> Switching roles dynamically changes the application’s view, navigation desk, and approval authorities (e.g. Site Supervisors submit field DPRs; Project Planners verify candidate linkages and commit actuals to Primavera P6).
              </div>
            </div>
          </div>

          {/* RIGHT: Enterprise Credential & SSO Sign In (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-blue-700" />
                  <span>Enterprise Credential Login</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Oil India Active Directory Single Sign-On
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
                SECURE SSL
              </span>
            </div>

            {/* Quick Fill Pills */}
            <div className="mb-4">
              <label className="text-[10px] uppercase font-mono text-slate-500 font-semibold block mb-1.5">
                Quick Select Enterprise Persona:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {personaList.map((p) => {
                  const info = quickSelectLabels[p.role];
                  const isCurrent = selectedRole === p.role;
                  return (
                    <button
                      key={p.role}
                      type="button"
                      onClick={() => handleSelectRole(p.role)}
                      className={`py-1.5 px-2.5 rounded-lg text-xs border transition-all text-left flex items-center gap-2 min-w-0 cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold ring-1 ring-blue-300'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm shrink-0">{info.icon}</span>
                      <div className="min-w-0 flex-1 leading-tight">
                        <div className="font-semibold truncate text-[11px] text-slate-900">{info.name}</div>
                        <div className="text-[10px] text-slate-500 truncate font-mono">{info.tag}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email / Emp ID */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1 font-mono uppercase">
                  Enterprise Email or Employee ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. pranjal.saikia@oilindia.in or OIL-PLN-4421"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all font-sans"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700 font-mono uppercase">
                    Security Passcode / PIN
                  </label>
                  <span className="text-[10px] text-blue-700 font-mono font-medium">Default: demo password</span>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter enterprise passcode"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember session</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">256-bit AES Auth</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer mt-2 disabled:opacity-70"
              >
                {isAuthenticating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
            <div className="mt-4 pt-3.5 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => handleInstantSignIn(selectedRole)}
                className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In via Oil India SAP NetWeaver SSO</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-slate-200 bg-white/70 text-center text-xs text-slate-500 font-mono mt-8">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SIH26122 • Smart Automation • Oil India Limited Prototype</span>
          <span className="text-[11px] text-slate-600">Enterprise Role-Based Access Control (RBAC) & Immutable Provenance</span>
        </div>
      </footer>
    </div>
  );
};
