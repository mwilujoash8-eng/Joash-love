import React from 'react';
import {
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  Users,
  ArrowRight,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface PendingVerificationScreenProps {
  onOpenRoleSwitcher: () => void;
}

export const PendingVerificationScreen: React.FC<PendingVerificationScreenProps> = ({
  onOpenRoleSwitcher,
}) => {
  const { currentSchool, currentUser, approveUser } = useSchool();

  const handleBypassApprove = () => {
    approveUser(currentUser.id);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-[#1E293B] text-white p-8 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  Verification Pending
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                  {currentSchool.code}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Account Awaiting Head Teacher Approval
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Submitted to <strong>{currentSchool.name}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <p className="font-bold">Strict Role & School Data Protection Enforced</p>
              <p className="mt-0.5 text-amber-800">
                To safeguard student records, marks, and school data, all new Teacher, Student, Parent, and Board accounts must be verified and approved by the School Administration before receiving dashboard access.
              </p>
            </div>
          </div>

          {/* Registration Details Summary */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Your Submitted Registration Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Full Name</span>
                <strong className="text-slate-900 text-sm">{currentUser.fullName}</strong>
              </div>

              <div>
                <span className="text-slate-500 block">Requested Role</span>
                <strong className="text-slate-900 capitalize">
                  {currentUser.role.replace('_', ' ')}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 block">Target School</span>
                <strong className="text-slate-900">{currentUser.schoolName}</strong>
              </div>

              <div>
                <span className="text-slate-500 block">Contact Phone / Email</span>
                <strong className="text-slate-900 font-mono">
                  {currentUser.phone || currentUser.email}
                </strong>
              </div>

              {currentUser.studentProfile && (
                <>
                  <div>
                    <span className="text-slate-500 block">Assigned Class</span>
                    <strong className="text-emerald-700 font-bold">
                      {currentUser.studentProfile.className} (Grade {currentUser.studentProfile.grade})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Student Number</span>
                    <strong className="text-emerald-700 font-mono font-bold">
                      {currentUser.studentProfile.studentNumber}
                    </strong>
                  </div>
                </>
              )}

              {currentUser.parentProfile && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Connected Learner(s)</span>
                  <strong className="text-emerald-700 font-mono">
                    {currentUser.parentProfile.connectedStudentNumbers.join(', ')}
                  </strong>
                </div>
              )}

              {currentUser.teacherProfile && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Faculty Qualification</span>
                  <strong className="text-slate-900">{currentUser.teacherProfile.qualification}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Verification Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Verification Progress
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-xs block">1. Form Submitted</strong>
                  <span className="text-[10px] text-emerald-700">Credentials saved</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-spin" />
                <div>
                  <strong className="text-xs block">2. Admin Review</strong>
                  <span className="text-[10px] text-amber-700">In Head Teacher queue</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <strong className="text-xs block">3. Dashboard Access</strong>
                  <span className="text-[10px] text-slate-500">Unlocks on approval</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions & Bypass */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onOpenRoleSwitcher}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Switch User / Choose Another Role</span>
            </button>

            <button
              onClick={handleBypassApprove}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>Approve & Enter Dashboard (Demo Verification)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
