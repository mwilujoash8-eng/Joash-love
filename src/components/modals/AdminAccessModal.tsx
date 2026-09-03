import React, { useState } from 'react';
import {
  X,
  Shield,
  Lock,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  HelpCircle
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: UserRole;
  targetUserId?: string;
  onUnlocked?: () => void;
}

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  isOpen,
  onClose,
  targetRole = 'head_teacher',
  targetUserId,
  onUnlocked,
}) => {
  const { currentSchool, unlockAdminWithCode, switchUser } = useSchool();
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

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
          if (targetUserId) {
            switchUser(targetUserId);
          }
          if (onUnlocked) onUnlocked();
          onClose();
        }, 400);
      } else {
        setErrorMsg(result.message);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-900 animate-in fade-in duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                  Demo Security Check
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                Admin Code Required
              </h3>
              <p className="text-xs text-slate-300">
                Opening {roleTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            In Demo Mode, administrative dashboards are protected against unauthorized switching. Please enter the administrator passcode to proceed.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Passkey Code</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Enter 5 April 2013 or ADMIN-2026"
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 outline-hidden transition"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying || !code.trim()}
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isVerifying ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5" />
                    <span>Unlock & Enter</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick autofill helper */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-700 text-[11px] font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available Demo Codes:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCode('5 April 2013')}
                className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-2 py-0.5 rounded border border-slate-200 text-[11px] font-mono cursor-pointer"
              >
                5 April 2013
              </button>
              <button
                type="button"
                onClick={() => setCode('ADMIN-2026')}
                className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-2 py-0.5 rounded border border-slate-200 text-[11px] font-mono cursor-pointer"
              >
                ADMIN-2026
              </button>
              <button
                type="button"
                onClick={() => setCode(currentSchool.staffPassword || 'STAFF-2026')}
                className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-2 py-0.5 rounded border border-slate-200 text-[11px] font-mono cursor-pointer"
              >
                {currentSchool.staffPassword || 'STAFF-2026'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
