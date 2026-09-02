import React, { useState } from 'react';
import {
  Users,
  Award,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  CreditCard,
  Building,
  MessageSquare,
  FileText,
  PlusCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Layers,
  DollarSign,
  Bus,
  ShieldAlert,
  Video,
  HeartPulse,
  Utensils,
  Smartphone
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { CampusStoriesTray } from '../social/CampusStoriesTray';
import { SchoolGroupsHub } from '../groups/SchoolGroupsHub';
import { FinancePublishingStudio } from '../finance/FinancePublishingStudio';
import { ZambianCalendarBanner } from '../common/ZambianCalendarBanner';
import { ParentFeePaymentPortal } from '../parent/ParentFeePaymentPortal';
import { ParentTransportSafetyTracker } from '../parent/ParentTransportSafetyTracker';
import { ParentBehaviorConductTracker } from '../parent/ParentBehaviorConductTracker';
import { ParentTeacherConferenceBooker } from '../parent/ParentTeacherConferenceBooker';
import { ParentPermissionSlipsHub } from '../parent/ParentPermissionSlipsHub';
import { ParentClinicHealthTracker } from '../parent/ParentClinicHealthTracker';
import { ParentCanteenWallet } from '../parent/ParentCanteenWallet';
import { SubscriptionModal } from '../modals/SubscriptionModal';
import { Sparkles } from 'lucide-react';

interface ParentDashboardProps {
  onViewReportCard: (reportCardId: string) => void;
  onOpenRegisterUser: () => void;
  onOpenProfile?: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onViewReportCard,
  onOpenRegisterUser,
  onOpenProfile,
}) => {
  const { currentSchool, currentUser, allUsers, reportCards, announcements } = useSchool();
  const [activeTab, setActiveTab] = useState<
    | 'child_performance'
    | 'fees_portal'
    | 'transport_safety'
    | 'conduct_merits'
    | 'conferences'
    | 'permission_slips'
    | 'clinic_visits'
    | 'canteen_wallet'
    | 'groups'
    | 'finance'
    | 'attendance'
    | 'pta'
    | 'messages'
    | 'notices'
  >('child_performance');

  // Connected children student numbers
  const connectedNumbers = currentUser.parentProfile?.connectedStudentNumbers || ['STU-2026-0012'];
  const [selectedStudentNumber, setSelectedStudentNumber] = useState<string>(connectedNumbers[0] || 'STU-2026-0012');

  // Find student entity
  const connectedStudents = allUsers.filter(
    (u) => u.schoolId === currentSchool.id && u.role === 'student' && connectedNumbers.includes(u.studentProfile?.studentNumber || '')
  );

  const activeStudent = connectedStudents.find((s) => s.studentProfile?.studentNumber === selectedStudentNumber) || connectedStudents[0];
  const activeReportCard = reportCards.find((rc) => rc.studentNumber === selectedStudentNumber) || reportCards[0];
  const activeStudentName = activeStudent?.fullName || activeReportCard?.studentName || 'Chileshe Mwila';
  const activeStudentClass = activeStudent?.studentProfile?.className || 'Grade 9A';

  // PTA State
  const [ptaPaid, setPtaPaid] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [newChildNumber, setNewChildNumber] = useState('');

  // Inquiry message
  const [inquirySubject, setInquirySubject] = useState('Academic inquiry regarding Mathematics performance');
  const [inquiryBody, setInquiryBody] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. ZAMBIAN OFFICIAL MOE ACADEMIC CALENDAR BANNER */}
      <ZambianCalendarBanner />

      {/* Parent Portal Header */}
      <div className="bg-[#1E293B] rounded-2xl p-6 text-white shadow-lg border border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Parent & Guardian Portal
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                VERIFIED GUARDIAN
              </span>
              <button
                type="button"
                onClick={() => setShowSubModal(true)}
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition flex items-center gap-1 ${
                  currentUser.parentSubscription?.tier === 'premium'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>
                  {currentUser.parentSubscription?.tier === 'premium' ? 'Premium (K200/mo)' : 'Medium (K150/mo)'}
                </span>
                <span className="underline ml-0.5">Manage</span>
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-0.5 text-white">{currentUser.fullName}</h1>
            <p className="text-xs text-slate-300 mt-1">
              Connected to <strong>{connectedNumbers.length} Learner(s)</strong> at {currentSchool.name}
            </p>
          </div>

          {/* Child Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {connectedStudents.map((child) => {
              const isSelected = child.studentProfile?.studentNumber === selectedStudentNumber;
              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedStudentNumber(child.studentProfile?.studentNumber || '')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs shadow-emerald-500/30 ring-2 ring-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <img src={child.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span>{child.fullName} ({child.studentProfile?.className})</span>
                </button>
              );
            })}

            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit Profile</span>
              </button>
            )}

            <button
              onClick={() => setShowConnectModal(true)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700 transition cursor-pointer"
              title="Connect another child with student ID"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Connect Child</span>
            </button>
          </div>
        </div>

        {/* Child Fast Facts */}
        {activeReportCard && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/80">
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Selected Learner</span>
              <div className="text-sm font-bold text-white mt-0.5 truncate">
                {activeStudentName}
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">{selectedStudentNumber}</span>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">{currentSchool.activeTerm.replace('_', ' ').toUpperCase()} Standing</span>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">
                {activeReportCard.positionInClass} <span className="text-xs text-slate-400 font-normal">of 38</span>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">ECZ Best 6 Aggregate</span>
              <div className="text-lg font-bold text-amber-400 mt-0.5">
                {activeReportCard.aggregatePoints} Points <span className="text-xs text-amber-300 font-normal">(Distinction)</span>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Term Attendance</span>
              <div className="text-lg font-bold text-sky-400 mt-0.5">
                96.9% <span className="text-xs text-slate-400 font-normal">Present</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CAMPUS SOCIAL STORIES TRAY */}
      <CampusStoriesTray />

      {/* MULTI-MODULE PARENT NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 pb-1 overflow-x-auto">
        {[
          { id: 'child_performance', label: 'Academic Results & Report Card', icon: <Award className="w-4 h-4 text-emerald-600" /> },
          { id: 'fees_portal', label: 'Fees & Mobile Money', icon: <Smartphone className="w-4 h-4 text-emerald-600" />, badge: 'MoMo / Zanaco' },
          { id: 'transport_safety', label: 'Live Bus & Gate Pass', icon: <Bus className="w-4 h-4 text-amber-600" />, badge: 'GPS & PIN' },
          { id: 'conduct_merits', label: 'Conduct & Merits', icon: <ShieldAlert className="w-4 h-4 text-purple-600" />, badge: 'Merits' },
          { id: 'conferences', label: 'Teacher Conferences', icon: <Video className="w-4 h-4 text-blue-600" />, badge: '1-on-1' },
          { id: 'permission_slips', label: 'Field Trips & Consent', icon: <FileText className="w-4 h-4 text-rose-600" />, badge: 'Sign' },
          { id: 'clinic_visits', label: 'Sick Bay & Health', icon: <HeartPulse className="w-4 h-4 text-rose-500" /> },
          { id: 'canteen_wallet', label: 'Dining Meal Card', icon: <Utensils className="w-4 h-4 text-amber-500" /> },
          { id: 'groups', label: 'PTA & Class Groups', icon: <Layers className="w-4 h-4 text-purple-600" />, badge: 'Auto-Member' },
          { id: 'finance', label: 'Finance Bulletins', icon: <DollarSign className="w-4 h-4 text-amber-600" /> },
          { id: 'attendance', label: 'Daily Attendance', icon: <Calendar className="w-4 h-4" /> },
          { id: 'messages', label: 'Inquiry to Teacher', icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'notices', label: 'Head Circulars', icon: <FileText className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: CHILD PERFORMANCE & REPORT CARD */}
      {activeTab === 'child_performance' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeStudentName}'s {currentSchool.activeTerm.replace('_', ' ').toUpperCase()} Academic Records
                </h3>
                <p className="text-xs text-slate-500">
                  Approved continuous assessment scores and locked term examination report.
                </p>
              </div>

              {activeReportCard && (
                <button
                  onClick={() => onViewReportCard(activeReportCard.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Official Printable Report Card</span>
                </button>
              )}
            </div>

            {/* Continuous Assessment Subjects Table */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Subject</th>
                    <th className="p-3 text-center">Test 1 (CA-1)</th>
                    <th className="p-3 text-center">Test 2 (CA-2)</th>
                    <th className="p-3 text-center">Test 3 (CA-3)</th>
                    <th className="p-3 text-center">Exam Mark</th>
                    <th className="p-3 text-center">Overall %</th>
                    <th className="p-3 text-center">ECZ Grade</th>
                    <th className="p-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {activeReportCard?.subjectResults.map((sub) => (
                    <tr key={sub.subjectId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {sub.subjectName}
                      </td>
                      <td className="p-3 text-center font-mono">{sub.test1Score?.raw ?? '-'}</td>
                      <td className="p-3 text-center font-mono">{sub.test2Score?.raw ?? '-'}</td>
                      <td className="p-3 text-center font-mono">{sub.test3Score?.raw ?? '-'}</td>
                      <td className="p-3 text-center font-mono">{sub.examScore?.raw ?? '-'}</td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {sub.finalOverallPercentage}%
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {sub.eczGrade} ({sub.gradeLabel})
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 italic max-w-xs truncate">
                        "{sub.teacherRemarks}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FEES & MOBILE MONEY SETTLEMENT */}
      {activeTab === 'fees_portal' && (
        <ParentFeePaymentPortal
          studentNumber={selectedStudentNumber}
          studentName={activeStudentName}
          className={activeStudentClass}
        />
      )}

      {/* TAB 3: TRANSPORT & GATE PASS */}
      {activeTab === 'transport_safety' && (
        <ParentTransportSafetyTracker
          studentNumber={selectedStudentNumber}
          studentName={activeStudentName}
        />
      )}

      {/* TAB 4: CONDUCT & MERITS */}
      {activeTab === 'conduct_merits' && (
        <ParentBehaviorConductTracker
          studentNumber={selectedStudentNumber}
          studentName={activeStudentName}
        />
      )}

      {/* TAB 5: TEACHER CONFERENCES */}
      {activeTab === 'conferences' && (
        <ParentTeacherConferenceBooker
          studentNumber={selectedStudentNumber}
          studentName={activeStudentName}
        />
      )}

      {/* TAB 6: PERMISSION SLIPS */}
      {activeTab === 'permission_slips' && (
        <ParentPermissionSlipsHub
          studentNumber={selectedStudentNumber}
          studentName={activeStudentName}
        />
      )}

      {/* TAB 7: CLINIC VISITS */}
      {activeTab === 'clinic_visits' && (
        <ParentClinicHealthTracker
          studentNumber={selectedStudentNumber}
          studentName={activeStudentName}
        />
      )}

      {/* TAB 8: CANTEEN DINING WALLET */}
      {activeTab === 'canteen_wallet' && (
        <ParentCanteenWallet
          studentNumber={selectedStudentNumber}
          studentName={activeStudentName}
        />
      )}

      {/* TAB 9: GROUPS & PTA COMMUNITIES */}
      {activeTab === 'groups' && (
        <SchoolGroupsHub />
      )}

      {/* TAB 10: FINANCE BULLETINS */}
      {activeTab === 'finance' && (
        <FinancePublishingStudio />
      )}

      {/* TAB 11: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Daily Punctuality & Period Attendance Records
          </h3>
          <p className="text-xs text-slate-500">
            Automated morning register and period attendance check-in.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Overall Attendance Rate</div>
              <div className="text-[11px] text-slate-500">62 Days Recorded in Active Term</div>
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              96.9% Present
            </div>
          </div>
        </div>
      )}

      {/* TAB 12: PTA PROJECTS */}
      {activeTab === 'pta' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Parent Teacher Association Dues & Projects</h3>
          <p className="text-xs text-slate-500">
            PTA approved capital infrastructure and student welfare funds.
          </p>
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">PTA Solar Project & Borehole Levy</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400">Term 1 Dues: ZMW 450</div>
            </div>
            <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1 rounded-lg">
              Paid & Cleared
            </span>
          </div>
        </div>
      )}

      {/* TAB 13: INQUIRY TO TEACHER */}
      {activeTab === 'messages' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Direct Message to Class Teacher or Head Teacher</h3>
          <p className="text-xs text-slate-500">
            Submit a query or request a physical / virtual consultation meeting regarding your child's academic or pastoral welfare.
          </p>

          <div className="space-y-3 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject *</label>
              <input
                type="text"
                value={inquirySubject}
                onChange={(e) => setInquirySubject(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message Details *</label>
              <textarea
                rows={4}
                value={inquiryBody}
                onChange={(e) => setInquiryBody(e.target.value)}
                placeholder="Type your message to the class teacher..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {inquirySent && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Inquiry dispatched directly to the Class Teacher and Head Teacher desk!</span>
              </div>
            )}

            <button
              onClick={() => {
                if (!inquiryBody.trim()) return;
                setInquirySent(true);
                setInquiryBody('');
                setTimeout(() => setInquirySent(false), 5000);
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Send Official Inquiry
            </button>
          </div>
        </div>
      )}

      {/* TAB 14: NOTICES */}
      {activeTab === 'notices' && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Head Teacher Circulars & Official School Notices</h3>
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</span>
                <span className="text-[10px] text-slate-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{ann.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Modal for Connecting Another Child */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Connect Another Learner</h3>
            <p className="text-xs text-slate-500">
              Enter your child's official student registration number issued by {currentSchool.name}.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Number *</label>
              <input
                type="text"
                value={newChildNumber}
                onChange={(e) => setNewChildNumber(e.target.value)}
                placeholder="e.g. STU-2026-0024"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono uppercase bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newChildNumber.trim()) {
                    setSelectedStudentNumber(newChildNumber.trim().toUpperCase());
                    setShowConnectModal(false);
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Link Learner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parent Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
      />
    </div>
  );
};
