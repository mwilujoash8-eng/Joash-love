import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  CheckCircle,
  AlertCircle,
  Building,
  Users,
  CreditCard,
  Sparkles,
  ArrowRight,
  X,
  Lock,
  Calendar,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface DailyMasterCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubscriptionModal?: () => void;
}

export const DailyMasterCodeModal: React.FC<DailyMasterCodeModalProps> = ({
  isOpen,
  onClose,
  onOpenSubscriptionModal,
}) => {
  const {
    currentSchool,
    currentUser,
    allUsers,
    authenticateWithMasterPasskey,
  } = useSchool();

  const [enteredCode, setEnteredCode] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Format today's date nicely in Zambian English format
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!enteredCode.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please enter a passkey or activation code before verifying.',
      });
      return;
    }

    setIsProcessing(true);
    setFeedback({ type: null, message: '' });

    setTimeout(() => {
      const result = authenticateWithMasterPasskey(enteredCode);
      setIsProcessing(false);

      if (result.success) {
        setFeedback({
          type: 'success',
          message: result.message,
        });

        // Store dismissal for today so it doesn't pop up again automatically today
        try {
          const todayStr = new Date().toISOString().split('T')[0];
          localStorage.setItem('schoollink_daily_popup_date', todayStr);
        } catch {
          // Ignore
        }

        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setFeedback({
          type: 'error',
          message: result.message,
        });
      }
    }, 400);
  };

  const handleDismiss = () => {
    // Record today's date in localStorage
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('schoollink_daily_popup_date', todayStr);
    } catch {
      // Ignore
    }
    onClose();
  };

  // Subscription details
  const staffSub = currentSchool.staffSubscription || {
    tier: 'premium',
    pricePerMonthZMW: 450,
    status: 'active',
    billingCycle: 'monthly',
    nextBillingDate: '2026-09-01',
    coveredStaffCount: 14,
  };

  const parentSub = currentUser.parentSubscription || {
    tier: 'premium',
    pricePerMonthZMW: 200,
    status: 'active',
    billingCycle: 'monthly',
    nextBillingDate: '2026-09-10',
  };

  return (
    <div
      id="daily-master-code-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        id="daily-master-code-modal-card"
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl text-white shadow-2xl overflow-hidden relative my-auto animate-in fade-in duration-150"
      >
        {/* Decorative Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition z-10"
          title="Dismiss for today"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  Daily Security Gateway
                </span>
                <span className="text-slate-400 text-xs font-medium">
                  {todayFormatted}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Daily Access & Master Code Gateway
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Verify active school and parent subscriptions, or enter the Master Passkey to access the Platform Administrator Central Database.
              </p>
            </div>
          </div>

          {/* Subscriptions Overview Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                  Current Subscriptions Status
                </h3>
              </div>
              {onOpenSubscriptionModal && (
                <button
                  type="button"
                  onClick={() => {
                    handleDismiss();
                    onOpenSubscriptionModal();
                  }}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 flex items-center gap-1 transition"
                >
                  <span>Manage Plans / Airtel Money</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* School Staff Plan */}
              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-indigo-400" />
                      School Staff Plan
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                      {staffSub.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-white">
                    {staffSub.tier?.toUpperCase() || 'PREMIUM'} TIER (K{staffSub.pricePerMonthZMW}/mo)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Covering all faculty & staff for {currentSchool.name}.
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Renewal: {staffSub.nextBillingDate || '2026-09-01'}</span>
                  <span className="text-emerald-400 font-medium">1 Payment / School</span>
                </div>
              </div>

              {/* Parent Individual Plan */}
              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-teal-400" />
                      Parent Guardian Plan
                    </span>
                    <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-teal-400" />
                      {parentSub.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-white">
                    {parentSub.tier?.toUpperCase() || 'PREMIUM'} TIER (K{parentSub.pricePerMonthZMW}/mo)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direct access to CA-1 to CA-3 grades & AI Learning Insights.
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Renewal: {parentSub.nextBillingDate || '2026-09-10'}</span>
                  <span className="text-teal-400 font-medium">Individual Parent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Master Code & Activation Code Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="master-code-input"
                  className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  Enter Secret Passkey or Single-Use Activation Code:
                </label>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Restricted Access
                </span>
              </div>

              <div className="relative">
                <input
                  id="master-code-input"
                  type="password"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value);
                    if (feedback.type) setFeedback({ type: null, message: '' });
                  }}
                  placeholder="Enter secret passkey or single-use activation code..."
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 font-medium text-sm sm:text-base outline-hidden transition tracking-wide"
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                    Secure Verification
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>
                  Authorized Administrator passkey grants Master Database access. Single-use activation codes issued by the Platform Administrator will instantly activate the associated subscription.
                </span>
              </p>
            </div>

            {/* Feedback Message Banner */}
            {feedback.type && (
              <div
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-in fade-in duration-150 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-600/60 text-emerald-200'
                    : 'bg-red-950/80 border-red-600/60 text-red-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">{feedback.type === 'success' ? 'Access Granted' : 'Verification Failed'}</p>
                  <p className="text-xs mt-0.5 leading-relaxed">{feedback.message}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Passkey...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Verify & Enter Admin Database</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition text-center"
              >
                Continue to School Portal
              </button>
            </div>
          </form>

          {/* Daily Notice Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              Automated Daily Check (Pops up once per day)
            </span>
            <span className="font-mono">Republic of Zambia ECZ Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
};
