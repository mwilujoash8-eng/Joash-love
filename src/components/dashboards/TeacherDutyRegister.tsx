import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Calendar,
  AlertCircle,
  Building2,
  FileCheck,
  Award,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Printer,
  History,
  Sparkles,
  BookOpen,
  Check,
  X,
  Radio,
  BarChart3,
  TrendingUp,
  LineChart
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { TeacherDailyDutyLog, TeacherLessonPeriod } from '../../types';
import { TeacherTeachingTrendChart } from './TeacherTeachingTrendChart';

export const TeacherDutyRegister: React.FC = () => {
  const {
    currentSchool,
    currentUser,
    teacherDutyLogs,
    checkInTeacher,
    togglePeriodStatus,
    checkOutAndSendToManager
  } = useSchool();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Get current teacher's duty log for today
  const todayLog = teacherDutyLogs.find(
    (log) => log.teacherId === currentUser.id && log.date === todayStr
  ) || teacherDutyLogs[0]; // fallback for demo if none

  const [registerViewMode, setRegisterViewMode] = useState<'register' | 'weekly_trends'>('register');
  const [handoverRemarks, setHandoverRemarks] = useState(todayLog?.dutyHandoverRemarks || '');
  const [showConfirmCheckoutModal, setShowConfirmCheckoutModal] = useState(false);
  const [notTaughtReasonModal, setNotTaughtReasonModal] = useState<{ isOpen: boolean; periodId: string; currentReason: string }>({
    isOpen: false,
    periodId: '',
    currentReason: ''
  });
  const [reasonInput, setReasonInput] = useState('');
  const [viewHistory, setViewHistory] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(todayStr);

  const currentTimeStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Calculate statistics
  const periods = todayLog?.periods || [];
  const taughtCount = periods.filter((p) => p.status === 'taught').length;
  const notTaughtCount = periods.filter((p) => p.status === 'not_taught').length;
  const totalScheduled = periods.length;
  const completionRate = totalScheduled > 0 ? Math.round((taughtCount / totalScheduled) * 100) : 0;

  const handleCheckInClick = () => {
    checkInTeacher(currentUser.id);
  };

  const handlePeriodToggle = (periodId: string, targetStatus: 'taught' | 'not_taught') => {
    if (!todayLog) return;
    if (targetStatus === 'not_taught') {
      const currentPeriod = periods.find(p => p.id === periodId);
      setReasonInput(currentPeriod?.reasonIfNotTaught || 'Relief duty / Assembly / School activity');
      setNotTaughtReasonModal({
        isOpen: true,
        periodId,
        currentReason: currentPeriod?.reasonIfNotTaught || ''
      });
    } else {
      togglePeriodStatus(todayLog.id, periodId, 'taught');
    }
  };

  const handleConfirmNotTaughtReason = () => {
    if (!todayLog) return;
    togglePeriodStatus(todayLog.id, notTaughtReasonModal.periodId, 'not_taught', reasonInput.trim());
    setNotTaughtReasonModal({ isOpen: false, periodId: '', currentReason: '' });
  };

  const handleConfirmCheckout = () => {
    if (!todayLog) return;
    checkOutAndSendToManager(todayLog.id, handoverRemarks.trim());
    setShowConfirmCheckoutModal(false);
  };

  const activeDisplayLog = viewHistory
    ? (teacherDutyLogs.find(l => l.teacherId === currentUser.id && l.date === selectedHistoryDate) || todayLog)
    : todayLog;

  return (
    <div className="space-y-6" id="teacher-duty-register-root">
      {/* TOP BANNER & CHECK-IN / CHECK-OUT CONTROLLER */}
      <div className="bg-linear-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-2xl p-6 text-white border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>OFFICIAL TSC DAILY TEACHING REGISTER</span>
              </span>
              <span className="text-slate-400 text-xs font-mono">{todayFormatted}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Teacher Duty & Classes Taught Register
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Record your daily campus arrival, track every lesson period taught with two-circle verification (Green for Taught, Red for Not Taught), and automatically knock off with direct submission to the School Manager.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 shrink-0">
            <div className="text-center p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Classes Taught</span>
              <span className="text-xl font-black text-emerald-400">{taughtCount} / {totalScheduled}</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Completion</span>
              <span className="text-xl font-black text-blue-400">{completionRate}%</span>
            </div>
            <div className="col-span-2 sm:col-span-1 text-center p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Manager Status</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-1 ${
                todayLog?.sentToSchoolManager
                  ? todayLog?.schoolManagerStatus === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {todayLog?.sentToSchoolManager
                  ? todayLog?.schoolManagerStatus === 'approved'
                    ? 'Verified & Approved'
                    : 'Submitted to Manager'
                  : 'Draft / On Duty'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW SUB-NAVIGATOR: DAILY DUTY LOG VS WEEKLY RECHARTS TREND */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRegisterViewMode('register')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              registerViewMode === 'register'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Today's Duty Sheet & Register</span>
          </button>

          <button
            onClick={() => setRegisterViewMode('weekly_trends')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              registerViewMode === 'weekly_trends'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Weekly Trend Analytics (Recharts)</span>
            <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-mono">
              New
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Attendance Register Auto-Synchronized</span>
        </div>
      </div>

      {/* VIEW: WEEKLY RECHARTS TREND ANALYTICS */}
      {registerViewMode === 'weekly_trends' && (
        <TeacherTeachingTrendChart />
      )}

      {/* VIEW: DAILY DUTY REGISTER SHEET */}
      {registerViewMode === 'register' && (
        <>
          {/* STEP 1: ARRIVAL CHECK-IN SECTION */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm" id="duty-check-in-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
              todayLog?.checkInConfirmed
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-amber-100 text-amber-700 border border-amber-300 animate-pulse'
            }`}>
              {todayLog?.checkInConfirmed ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 1: Campus Arrival</span>
                {todayLog?.checkInConfirmed && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Confirmed
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {todayLog?.checkInConfirmed
                  ? `Arrival Recorded at ${todayLog.checkInTime}`
                  : 'Did you report for duty on campus today?'}
              </h3>
              <p className="text-xs text-slate-600">
                {todayLog?.checkInConfirmed
                  ? `Teacher ${currentUser.fullName} checked in on ${todayLog.date}. Attendance automatically linked to school daily roster.`
                  : 'Click "Yes" to instantly log your arrival time automatically.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!todayLog?.checkInConfirmed ? (
              <button
                id="btn-teacher-checkin-yes"
                onClick={handleCheckInClick}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Yes, Check In Now ({currentTimeStr})</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-medium">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Checked In: <strong>{todayLog.checkInTime}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STEP 2: CLASSES & PERIODS TAUGHT REGISTER (TWO-CIRCLE TOGGLES: GREEN = TAUGHT, RED = NOT TAUGHT) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="duty-periods-register-table">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 2: Timetable & Classes Taught</span>
            <h3 className="text-base font-bold text-slate-900">Daily Teaching Period Register</h3>
            <p className="text-xs text-slate-600">
              Select the circle for each class: <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Green for Taught</span> and <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded"><span className="w-2 h-2 rounded-full bg-red-600"></span> Red for Not Taught</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewHistory(!viewHistory)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-300 flex items-center gap-1.5 transition"
            >
              <History className="w-3.5 h-3.5" />
              <span>{viewHistory ? 'View Today' : 'View Duty History'}</span>
            </button>
          </div>
        </div>

        {/* History Date Selector if History mode */}
        {viewHistory && (
          <div className="p-3 bg-blue-50/70 border-b border-blue-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-blue-900">Select Past Duty Log Date:</span>
            </div>
            <select
              value={selectedHistoryDate}
              onChange={(e) => setSelectedHistoryDate(e.target.value)}
              className="px-3 py-1 bg-white border border-blue-300 rounded-lg text-xs font-medium text-slate-800"
            >
              {teacherDutyLogs
                .filter(l => l.teacherId === currentUser.id)
                .map(log => (
                  <option key={log.id} value={log.date}>
                    {log.date} — {log.totalPeriodsTaught}/{log.totalPeriodsScheduled} Taught ({log.sentToSchoolManager ? 'Dispatched' : 'Pending'})
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Periods List */}
        <div className="divide-y divide-slate-100">
          {(activeDisplayLog?.periods || []).map((period, idx) => {
            const isTaught = period.status === 'taught';
            const isNotTaught = period.status === 'not_taught';

            return (
              <div
                key={period.id}
                id={`period-row-${period.id}`}
                className={`p-4 sm:p-5 transition hover:bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isNotTaught ? 'bg-red-50/30' : ''
                }`}
              >
                {/* Left: Period Details */}
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                    isTaught
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isNotTaught
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    P{period.periodNumber}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{period.className}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {period.subjectName}
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {period.timeRange}
                      </span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {period.room}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">
                      Topic: <span className="text-slate-900">{period.topic}</span>
                    </p>

                    {period.curriculumReference && (
                      <span className="inline-block text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        ECZ Ref: {period.curriculumReference}
                      </span>
                    )}

                    {isNotTaught && period.reasonIfNotTaught && (
                      <p className="text-xs text-red-700 bg-red-100/70 p-1.5 rounded border border-red-200 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Reason Not Taught: <strong>{period.reasonIfNotTaught}</strong></span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: TWO CIRCLE SELECTION (GREEN FOR TAUGHT, RED FOR NOT TAUGHT) */}
                <div className="flex items-center gap-4 self-end md:self-center shrink-0 bg-slate-100/80 p-2 rounded-2xl border border-slate-200">
                  <div className="text-right hidden sm:block pr-1">
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Status</span>
                    <span className={`text-xs font-extrabold ${isTaught ? 'text-emerald-700' : 'text-red-700'}`}>
                      {isTaught ? 'Taught' : 'Not Taught'}
                    </span>
                  </div>

                  {/* GREEN CIRCLE (TAUGHT) */}
                  <button
                    type="button"
                    id={`btn-toggle-taught-${period.id}`}
                    onClick={() => handlePeriodToggle(period.id, 'taught')}
                    title="Mark as TAUGHT (Green Circle)"
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isTaught
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 ring-4 ring-emerald-200 scale-105'
                        : 'bg-white hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 border-2 border-slate-300 hover:border-emerald-400'
                    }`}
                  >
                    <Check className={`w-5 h-5 stroke-[2.5] ${isTaught ? 'text-white' : ''}`} />
                  </button>

                  {/* RED CIRCLE (NOT TAUGHT) */}
                  <button
                    type="button"
                    id={`btn-toggle-nottaught-${period.id}`}
                    onClick={() => handlePeriodToggle(period.id, 'not_taught')}
                    title="Mark as NOT TAUGHT (Red Circle)"
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isNotTaught
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-4 ring-red-200 scale-105'
                        : 'bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border-2 border-slate-300 hover:border-red-400'
                    }`}
                  >
                    <X className={`w-5 h-5 stroke-[2.5] ${isNotTaught ? 'text-white' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Register Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <strong>{taughtCount}</strong> Classes Taught
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <strong>{notTaughtCount}</strong> Classes Not Taught
            </span>
          </div>

          <div className="text-slate-500 font-medium">
            Register for Teacher: <strong>{currentUser.fullName} ({currentUser.teacherProfile?.tscNumber || 'TS-2026-049'})</strong>
          </div>
        </div>
      </div>

      {/* STEP 3: KNOCK-OFF / CHECKOUT & AUTOMATIC SEND TO SCHOOL MANAGER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm" id="duty-checkout-manager-card">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 3: Daily Knock-Off & Dispatch</span>
              <h3 className="text-base font-bold text-slate-900">Check-Out & Transmit to School Manager</h3>
              <p className="text-xs text-slate-600">
                When knocking off, your checkout timestamp is added automatically and your duty register is transmitted directly to the Head Teacher / School Manager for formal record-keeping.
              </p>
            </div>

            {todayLog?.checkOutConfirmed ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Knocked Off at {todayLog.checkOutTime}</span>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Current Time: {currentTimeStr}</span>
              </div>
            )}
          </div>

          {/* Daily Handover / Remarks Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Daily Duty Remarks & Handover Notes (Optional):
            </label>
            <textarea
              rows={3}
              value={handoverRemarks}
              onChange={(e) => setHandoverRemarks(e.target.value)}
              placeholder="e.g. Completed all Grade 9A & 9B algebra exercises; homework questions 1-10 assigned; science lab secured."
              disabled={todayLog?.checkOutConfirmed}
              className="w-full p-3 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-50"
            />
          </div>

          {/* Submission and Confirmation action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Recipient: <strong>Office of the Head Teacher / School Manager</strong></span>
            </div>

            {!todayLog?.checkOutConfirmed ? (
              <button
                id="btn-knock-off-confirm"
                onClick={() => setShowConfirmCheckoutModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Knock Off & Send Register to School Manager</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Register Dispatched to School Manager at {todayLog.sentToManagerTime || todayLog.checkOutTime}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
        </>
      )}

      {/* MODAL: CONFIRM KNOCK OFF */}
      {showConfirmCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Confirm Knock-Off</h4>
                <p className="text-xs text-slate-500">School Manager Submission</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Teacher:</span>
                <span className="font-bold text-slate-800">{currentUser.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Knock-Off Time:</span>
                <span className="font-bold text-emerald-600 font-mono">{currentTimeStr} (Automatic)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Classes Taught:</span>
                <span className="font-bold text-slate-800">{taughtCount} of {totalScheduled} scheduled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-blue-700">Head Teacher Dashboard</span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Upon clicking confirm, your knock-off time will be permanently stamped and dispatched to the school administration for daily verification.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirmCheckoutModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                id="btn-modal-confirm-checkout"
                onClick={handleConfirmCheckout}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REASON FOR NOT TAUGHT */}
      {notTaughtReasonModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Mark Class as Not Taught</h4>
                <p className="text-xs text-slate-500">Reason for School Manager Record</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Not Teaching this Period:
              </label>
              <select
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 mb-2 focus:ring-2 focus:ring-red-500"
              >
                <option value="Relief duty covering other class">Relief duty covering other class</option>
                <option value="Laboratory / Workshop equipment setup">Laboratory / Workshop equipment setup</option>
                <option value="School Assembly / Special Examination duty">School Assembly / Special Examination duty</option>
                <option value="Staff Development Workshop / Ministry meeting">Staff Development Workshop / Ministry meeting</option>
                <option value="Inter-school Sports & Extracurricular activity">Inter-school Sports & Extracurricular activity</option>
                <option value="Approved Medical / Official Leave">Approved Medical / Official Leave</option>
                <option value="Other administrative assignment">Other administrative assignment</option>
              </select>

              <input
                type="text"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Or type custom explanation..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setNotTaughtReasonModal({ isOpen: false, periodId: '', currentReason: '' })}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmNotTaughtReason}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save (Mark Red)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
