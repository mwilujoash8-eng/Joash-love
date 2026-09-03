import React, { useState } from 'react';
import {
  Shield,
  Lock,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  Building,
  Globe,
  HelpCircle
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

interface AdminAccessGatekeeperProps {
  onUnlockSuccess?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  onViewWebsite?: () => void;
  targetRole?: 'head_teacher' | 'platform_admin';
}

export const AdminAccessGatekeeper: React.FC<AdminAccessGatekeeperProps> = ({
  onUnlockSuccess,
  onSwitchRole,
  onViewWebsite,
  targetRole = 'head_teacher',
}) => {
  const { currentSchool, currentUser, unlockAdminWithCode, allUsers, switchUser } = useSchool();
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const roleTitle =
    targetRole === 'platform_admin'
      ? 'Platform National Directorate Admin'
      : `${currentSchool.name} Head Teacher Administration`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsVerifying(true);

    setTimeout(() => {
      const result = unlockAdminWithCode(code);
      setIsVerifying(false);
      if (result.success) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          if (onUnlockSuccess) onUnlockSuccess();
        }, 500);
      } else {
        setErrorMsg(result.message);
      }
    }, 300);
  };

  const handleQuickSwitch = (role: UserRole) => {
    const targetUser = allUsers.find(
      (u) => u.role === role && (role === 'platform_admin' ? true : u.schoolId === currentSchool.id)
    );
    if (targetUser) {
      switchUser(targetUser.id);
    }
    if (onSwitchRole) onSwitchRole(role);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 antialiased">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-slate-900 transition-all">
        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-400/30">
                  Demo Security Gatekeeper
                </span>
                <span className="text-[10px] text-slate-400 font-mono">RBAC Policy</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">
                Admin Dashboard Restricted
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Enter authorized passkey or master admin code to unlock {roleTitle}.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Security Access Code</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Enter passkey (e.g., 5 April 2013 or ADMIN-2026)"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl px-4 py-3.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-hidden transition"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Access Denied</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Access Granted</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">{successMsg}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !code.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Helper Credentials Hint Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 text-xs font-bold">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Demo Security Passkeys</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              In demo mode, administrator controls are safeguarded against unauthorized role switching. Use any of the following authorized passkeys:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCode('5 April 2013')}
                className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 px-2.5 py-1 rounded-lg border border-slate-300 hover:border-emerald-500 font-mono text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                title="Click to autofill Master Passkey"
              >
                <KeyRound className="w-3 h-3 text-amber-500" />
                <span>5 April 2013</span>
                <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-sans">Master</span>
              </button>
              <button
                type="button"
                onClick={() => setCode('ADMIN-2026')}
                className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 px-2.5 py-1 rounded-lg border border-slate-300 hover:border-emerald-500 font-mono text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                title="Click to autofill Admin Code"
              >
                <span>ADMIN-2026</span>
              </button>
              <button
                type="button"
                onClick={() => setCode(currentSchool.staffPassword || 'STAFF-2026')}
                className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 px-2.5 py-1 rounded-lg border border-slate-300 hover:border-emerald-500 font-mono text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                title="Click to autofill Staff Passcode"
              >
                <span>{currentSchool.staffPassword || 'STAFF-2026'}</span>
              </button>
            </div>
          </div>

          {/* Quick Fallback Role Portals */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Or switch to an open persona:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickSwitch('teacher')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/60 text-slate-700 hover:text-emerald-900 transition flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSwitch('student')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/60 text-slate-700 hover:text-sky-900 transition flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <Users className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSwitch('parent')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/60 text-slate-700 hover:text-amber-900 transition flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <Users className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Parent</span>
              </button>
            </div>

            {onViewWebsite && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onViewWebsite}
                  className="text-xs font-semibold text-slate-500 hover:text-emerald-600 inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Return to Public School Website</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
