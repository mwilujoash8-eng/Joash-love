import React, { useState } from 'react';
import {
  Shield,
  Building,
  Users,
  GraduationCap,
  Sparkles,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Eye,
  KeyRound,
  Download,
  Activity,
  Award,
  BookOpen,
  Phone,
  FileSpreadsheet,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Zap,
  Lock,
  Video,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import {
  School,
  User,
  UserCategory,
  SchoolStaffSubscriptionTier,
  ParentSubscriptionTier,
  AuditLog,
  SubscriptionActivationKey,
  PendingSubscriptionRequest
} from '../../types';
import { SubscriptionModal } from '../modals/SubscriptionModal';

interface PlatformAdminDashboardProps {
  onOpenCreateSchool: () => void;
  onOpenProfile: () => void;
  onOpenGoogleMeet?: () => void;
}

export const PlatformAdminDashboard: React.FC<PlatformAdminDashboardProps> = ({
  onOpenCreateSchool,
  onOpenProfile,
  onOpenGoogleMeet,
}) => {
  const {
    schools,
    allUsers,
    auditLogs,
    activationKeys,
    pendingSubRequests,
    generateActivationKey,
    approveSubscriptionRequest,
    rejectSubscriptionRequest,
    revokeActivationKey,
    updateSchoolSubscription,
    updateParentSubscription,
    approveUser,
    rejectUser,
    switchSchool,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'search_people' | 'keys' | 'schools' | 'parents' | 'users' | 'meet' | 'security'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedSchoolForDetails, setSelectedSchoolForDetails] = useState<School | null>(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalMode, setSubModalMode] = useState<'school' | 'parent'>('school');

  // Approval desk search & filter state
  const [approvalSearch, setApprovalSearch] = useState('');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<'all' | 'pending_review' | 'approved' | 'rejected'>('all');

  // Dedicated People search state
  const [peopleSearch, setPeopleSearch] = useState('');
  const [peopleRoleFilter, setPeopleRoleFilter] = useState<string>('all');
  const [peopleVerificationFilter, setPeopleVerificationFilter] = useState<string>('all');

  // Key generation form state
  const [keyTargetType, setKeyTargetType] = useState<'school' | 'parent'>('school');
  const [keyTargetId, setKeyTargetId] = useState<string>(schools[0]?.id || '');
  const [keyTier, setKeyTier] = useState<'medium' | 'premium'>('premium');
  const [keyNotes, setKeyNotes] = useState('');
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<SubscriptionActivationKey | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [keyFilterStatus, setKeyFilterStatus] = useState<'all' | 'active_unused' | 'redeemed' | 'revoked'>('all');

  // Metrics calculation
  const totalSchools = schools.length;
  const staffUsers = allUsers.filter(
    (u) => u.role === 'head_teacher' || u.role === 'deputy_head_teacher' || u.role === 'teacher' || u.userCategory === 'school_staff'
  );
  const parentUsers = allUsers.filter((u) => u.role === 'parent' || u.userCategory === 'parent');
  const studentUsers = allUsers.filter((u) => u.role === 'student' || u.userCategory === 'student');

  // Revenue calculation in Kwacha (ZMW)
  const schoolRevenue = schools.reduce((acc, s) => {
    const tier = s.staffSubscription?.tier || 'medium';
    return acc + (tier === 'premium' ? 450 : 400);
  }, 0);

  const parentRevenue = parentUsers.reduce((acc, p) => {
    const tier = p.parentSubscription?.tier || 'medium';
    return acc + (tier === 'premium' ? 200 : 150);
  }, 0);

  const totalMonthlyRevenue = schoolRevenue + parentRevenue;

  // Filtered users with robust Zambian phone number & multi-field normalization
  const cleanDigits = (str?: string) => (str ? str.replace(/[^0-9]/g, '') : '');
  const searchDigits = cleanDigits(searchQuery);

  const filteredUsers = allUsers.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      const matchesCategory =
        categoryFilter === 'all' ||
        u.userCategory === categoryFilter ||
        (categoryFilter === 'school_staff' && (u.role === 'head_teacher' || u.role === 'deputy_head_teacher' || u.role === 'teacher')) ||
        (categoryFilter === 'parent' && u.role === 'parent') ||
        (categoryFilter === 'student' && u.role === 'student') ||
        (categoryFilter === 'platform_admin' && u.role === 'platform_admin');
      return matchesCategory;
    }

    const uPhoneDigits = cleanDigits(u.phone);
    const uWhatsAppDigits = cleanDigits(u.whatsAppNumber);

    const matchesPhoneDigits =
      searchDigits.length >= 3 &&
      ((uPhoneDigits && (uPhoneDigits.includes(searchDigits) || searchDigits.includes(uPhoneDigits))) ||
        (uWhatsAppDigits && (uWhatsAppDigits.includes(searchDigits) || searchDigits.includes(uWhatsAppDigits))));

    const matchesSearch =
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      (u.schoolId && u.schoolId.toLowerCase().includes(q)) ||
      (u.schoolName && u.schoolName.toLowerCase().includes(q)) ||
      (u.studentProfile?.studentNumber && u.studentProfile.studentNumber.toLowerCase().includes(q)) ||
      (u.parentProfile?.connectedStudentNumbers?.some((num) => num.toLowerCase().includes(q))) ||
      matchesPhoneDigits;

    const matchesCategory =
      categoryFilter === 'all' ||
      u.userCategory === categoryFilter ||
      (categoryFilter === 'school_staff' && (u.role === 'head_teacher' || u.role === 'deputy_head_teacher' || u.role === 'teacher')) ||
      (categoryFilter === 'parent' && u.role === 'parent') ||
      (categoryFilter === 'student' && u.role === 'student') ||
      (categoryFilter === 'platform_admin' && u.role === 'platform_admin');

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Super Admin National Directorate Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                Platform Administrator Directorate
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                Level 5 Clearance
              </span>
              <span className="text-slate-400 text-xs font-mono">National SchoolLink Mesh</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Central Management & Licensing Console
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Overseeing institutional subscriptions, four-tier access controls, multi-tenant school databases, and verified parent connections across the Republic of Zambia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('approvals')}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-600/30 hover:scale-105 active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Approvals Queue</span>
              {pendingSubRequests.filter((r) => r.status === 'pending_review').length > 0 && (
                <span className="bg-white text-amber-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {pendingSubRequests.filter((r) => r.status === 'pending_review').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('search_people')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-slate-700 hover:scale-105 active:scale-95"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Search People</span>
            </button>

            {onOpenGoogleMeet && (
              <button
                onClick={onOpenGoogleMeet}
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-teal-600/30 hover:scale-105 active:scale-95"
              >
                <Video className="w-4 h-4" />
                <span>Google Meet</span>
              </button>
            )}

            <button
              onClick={onOpenCreateSchool}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New School</span>
            </button>
          </div>
        </div>

        {/* 4 Core User Categories Quick Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Building className="w-4 h-4" />
                1. School Staff
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                School-Paid
              </span>
            </div>
            <p className="text-xl font-bold text-white">{staffUsers.length} Staff</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{totalSchools} Institutions (K400-K450/mo)</p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-teal-400">
                <Users className="w-4 h-4" />
                2. Parents
              </span>
              <span className="text-[10px] bg-teal-950 text-teal-300 px-1.5 py-0.5 rounded border border-teal-800">
                Individual
              </span>
            </div>
            <p className="text-xl font-bold text-white">{parentUsers.length} Parents</p>
            <p className="text-[11px] text-slate-400 mt-0.5">K150 - K200/mo Subscriptions</p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-sky-400">
                <BookOpen className="w-4 h-4" />
                3. Students
              </span>
              <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800">
                Enrolled
              </span>
            </div>
            <p className="text-xl font-bold text-white">{studentUsers.length} Pupils</p>
            <p className="text-[11px] text-slate-400 mt-0.5">ECZ Grades 8 - 12</p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Shield className="w-4 h-4" />
                4. Platform Admins
              </span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800">
                Central
              </span>
            </div>
            <p className="text-xl font-bold text-white">{allUsers.filter((u) => u.role === 'platform_admin').length || 1} Admins</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Full System Authority</p>
          </div>
        </div>
      </div>

      {/* Revenue & Platform Health KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Platform MRR</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">K{totalMonthlyRevenue.toLocaleString()} ZMW</p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>K{schoolRevenue} Schools + K{parentRevenue} Parents</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Licensed Schools</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalSchools} Institutions</p>
          <p className="text-[11px] text-slate-500 mt-2">
            {schools.filter((s) => s.staffSubscription?.tier === 'premium').length} Premium &bull;{' '}
            {schools.filter((s) => (s.staffSubscription?.tier || 'medium') === 'medium').length} Medium
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Staff Covered</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{staffUsers.length} Faculty</p>
          <p className="text-[11px] text-slate-500 mt-2">
            100% covered under School ID Subscriptions
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">National Audit Logs</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{auditLogs.length} Events</p>
          <p className="text-[11px] text-purple-700 font-semibold mt-2">
            Cryptographic Tamper-Evident Ledger
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'overview', label: 'Platform Summary', icon: <Activity className="w-4 h-4" /> },
          { id: 'approvals', label: 'Subscription Approvals Desk', icon: <CreditCard className="w-4 h-4" />, badge: pendingSubRequests.filter((r) => r.status === 'pending_review').length },
          { id: 'search_people', label: 'Search People & Database', icon: <Search className="w-4 h-4" /> },
          { id: 'meet', label: 'Google Meet Video Calls', icon: <Video className="w-4 h-4" /> },
          { id: 'schools', label: 'School Licenses & Subscriptions', icon: <Building className="w-4 h-4" /> },
          { id: 'parents', label: 'Parent Accounts & Subscriptions', icon: <Users className="w-4 h-4" /> },
          { id: 'keys', label: 'Single-Use Keys & Vouchers', icon: <KeyRound className="w-4 h-4" /> },
          { id: 'users', label: 'All Users (4 Categories)', icon: <Users className="w-4 h-4" /> },
          { id: 'security', label: 'National Audit Ledger', icon: <Shield className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition relative ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: DEDICATED SUBSCRIPTION APPROVALS & DATABASE QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-amber-50/70 via-white to-emerald-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-500/20 text-amber-900 rounded-xl">
                    <CreditCard className="w-5 h-5 text-amber-700" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      National Subscription Payment Approval Desk
                    </h3>
                    <p className="text-xs text-slate-500">
                      Live queue of incoming Airtel Money, MTN MoMo, Zamtel, and Bank transfer verification requests submitted by School Heads and Parents.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Counters */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  {pendingSubRequests.filter((r) => r.status === 'pending_review').length} Pending
                </span>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-300">
                  {pendingSubRequests.filter((r) => r.status === 'approved').length} Confirmed
                </span>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reference, applicant, phone..."
                  value={approvalSearch}
                  onChange={(e) => setApprovalSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold shrink-0">Filter Status:</span>
                <div className="flex items-center bg-white border border-slate-300 rounded-xl p-0.5 text-xs">
                  {(['all', 'pending_review', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setApprovalStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition capitalize ${
                        approvalStatusFilter === st
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st === 'pending_review' ? 'Pending' : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table of requests */}
            {(() => {
              const q = approvalSearch.toLowerCase().trim();
              const requests = pendingSubRequests.filter((r) => {
                const matchesStatus = approvalStatusFilter === 'all' || r.status === approvalStatusFilter;
                const matchesQ =
                  !q ||
                  r.requesterName.toLowerCase().includes(q) ||
                  r.requesterPhone.toLowerCase().includes(q) ||
                  r.requesterEmail.toLowerCase().includes(q) ||
                  r.paymentReference.toLowerCase().includes(q) ||
                  r.targetName.toLowerCase().includes(q) ||
                  r.paymentMethod.toLowerCase().includes(q);
                return matchesStatus && matchesQ;
              });

              if (requests.length === 0) {
                return (
                  <div className="p-12 text-center text-slate-500 space-y-2">
                    <CreditCard className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                    <p className="text-sm font-bold text-slate-700">No subscription requests match your criteria</p>
                    <p className="text-xs text-slate-400">When users submit mobile money transactions, they appear in this approval desk.</p>
                  </div>
                );
              }

              return (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="p-4 font-semibold">Applicant & Contact</th>
                        <th className="p-4 font-semibold">Target Entity</th>
                        <th className="p-4 font-semibold">Requested Plan</th>
                        <th className="p-4 font-semibold">Payment Channel & Ref</th>
                        <th className="p-4 font-semibold">Date Submitted</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-right">Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50 transition">
                          <td className="p-4">
                            <p className="font-bold text-slate-900">{req.requesterName}</p>
                            <p className="text-slate-500 font-mono text-[11px]">{req.requesterEmail}</p>
                            <p className="text-emerald-700 font-mono text-[11px] font-bold">{req.requesterPhone}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              {req.targetType === 'school' ? (
                                <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              ) : (
                                <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              )}
                              <span className="font-bold text-slate-800">{req.targetName}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono capitalize">{req.targetType} Account</span>
                          </td>
                          <td className="p-4">
                            <span className="inline-block font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded uppercase border border-slate-200">
                              {req.requestedTier} &bull; K{req.priceZMW}/mo
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[11px]">
                            <div className="font-bold text-slate-800 uppercase flex items-center gap-1">
                              <span>{req.paymentMethod.replace('_', ' ')}</span>
                            </div>
                            <div className="text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-0.5 select-all">
                              Ref: {req.paymentReference}
                            </div>
                            {req.notes && (
                              <p className="text-[10px] font-sans text-slate-500 mt-1 italic">{req.notes}</p>
                            )}
                          </td>
                          <td className="p-4 text-slate-600 font-mono text-[11px]">
                            {req.requestDate}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                req.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : req.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              }`}
                            >
                              {req.status === 'pending_review' ? 'Pending Approval' : req.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {req.status === 'pending_review' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => approveSubscriptionRequest(req.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                                  title="Confirm payment received and activate subscription"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Confirm & Approve</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => rejectSubscriptionRequest(req.id)}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer"
                                  title="Reject request with audit trail"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] font-medium italic">Decision Recorded</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 2: ADVANCED NATIONAL PEOPLE & DATABASE SEARCH */}
      {activeTab === 'search_people' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Search className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      National Educational Directory & People Search
                    </h3>
                    <p className="text-xs text-slate-500">
                      Instant query lookup across teachers, head teachers, parents, students, board members, and school administrators nationwide.
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Total Users: <strong className="text-slate-900">{allUsers.length}</strong> &bull; Total Schools: <strong className="text-slate-900">{schools.length}</strong>
              </div>
            </div>

            {/* Search Input and Role Filter Chips */}
            <div className="mt-5 space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Name, Zambian Phone (e.g. 097..., +260...), WhatsApp, Student ID, NRC, School Name, or Email..."
                  value={peopleSearch}
                  onChange={(e) => setPeopleSearch(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 text-sm bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-emerald-500 focus:bg-white shadow-2xs font-medium"
                />
                {peopleSearch && (
                  <button
                    onClick={() => setPeopleSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Role filter buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-slate-600 mr-1">Role:</span>
                {[
                  { id: 'all', label: 'All People', count: allUsers.length },
                  { id: 'head_teacher', label: 'Head Teachers', count: allUsers.filter((u) => u.role === 'head_teacher').length },
                  { id: 'deputy_head_teacher', label: 'Deputy Heads', count: allUsers.filter((u) => u.role === 'deputy_head_teacher').length },
                  { id: 'teacher', label: 'Teachers', count: allUsers.filter((u) => u.role === 'teacher').length },
                  { id: 'parent', label: 'Parents', count: allUsers.filter((u) => u.role === 'parent').length },
                  { id: 'student', label: 'Students', count: allUsers.filter((u) => u.role === 'student').length },
                  { id: 'school_board', label: 'Board Members', count: allUsers.filter((u) => u.role === 'school_board').length },
                  { id: 'platform_admin', label: 'Administrators', count: allUsers.filter((u) => u.role === 'platform_admin').length },
                ].map((rf) => (
                  <button
                    key={rf.id}
                    onClick={() => setPeopleRoleFilter(rf.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      peopleRoleFilter === rf.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{rf.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      peopleRoleFilter === rf.id ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {rf.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {(() => {
            const cleanDigits = (str?: string) => (str ? str.replace(/[^0-9]/g, '') : '');
            const q = peopleSearch.toLowerCase().trim();
            const qDigits = cleanDigits(q);

            const filteredPeople = allUsers.filter((u) => {
              const matchesRole = peopleRoleFilter === 'all' || u.role === peopleRoleFilter;
              if (!matchesRole) return false;
              if (!q) return true;

              const uPhoneDigits = cleanDigits(u.phone);
              const uWADigits = cleanDigits(u.whatsAppNumber);
              const matchesPhone =
                qDigits.length >= 3 &&
                ((uPhoneDigits && (uPhoneDigits.includes(qDigits) || qDigits.includes(uPhoneDigits))) ||
                  (uWADigits && (uWADigits.includes(qDigits) || qDigits.includes(uWADigits))));

              return (
                u.fullName.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.id.toLowerCase().includes(q) ||
                (u.schoolId && u.schoolId.toLowerCase().includes(q)) ||
                (u.schoolName && u.schoolName.toLowerCase().includes(q)) ||
                (u.studentProfile?.studentNumber && u.studentProfile.studentNumber.toLowerCase().includes(q)) ||
                (u.studentProfile?.className && u.studentProfile.className.toLowerCase().includes(q)) ||
                (u.parentProfile?.connectedStudentNumbers?.some((num) => num.toLowerCase().includes(q))) ||
                (u.teacherProfile?.specialization && u.teacherProfile.specialization.toLowerCase().includes(q)) ||
                matchesPhone
              );
            });

            if (filteredPeople.length === 0) {
              return (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
                  <Users className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                  <p className="text-base font-bold text-slate-800">No people found matching "{peopleSearch}"</p>
                  <p className="text-xs text-slate-400">Try searching with a partial name, phone number (e.g. 0977...), or student number.</p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPeople.map((person) => {
                  const targetSchool = schools.find((s) => s.id === person.schoolId);
                  const isVerified = person.verificationStatus === 'verified';

                  return (
                    <div
                      key={person.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={person.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                              alt={person.fullName}
                              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/40 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {person.fullName}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-mono truncate">{person.email}</p>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider shrink-0 ${
                              isVerified
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>

                        {/* Role & School */}
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="font-semibold text-slate-400">Role:</span>
                            <span className="font-bold text-slate-800 capitalize bg-slate-100 px-2 py-0.5 rounded">
                              {person.role.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="font-semibold text-slate-400">School:</span>
                            <span className="font-medium text-slate-800 truncate max-w-[170px]">
                              {person.schoolName || targetSchool?.name || 'National Admin Desk'}
                            </span>
                          </div>
                          {person.phone && (
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="font-semibold text-slate-400">Phone:</span>
                              <span className="font-mono font-bold text-emerald-700">{person.phone}</span>
                            </div>
                          )}
                          {person.studentProfile && (
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="font-semibold text-slate-400">Student No:</span>
                              <span className="font-mono font-bold text-slate-800">{person.studentProfile.studentNumber}</span>
                            </div>
                          )}
                          {person.parentProfile && person.parentProfile.connectedStudentNumbers?.length > 0 && (
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="font-semibold text-slate-400">Children:</span>
                              <span className="font-mono text-[11px] text-slate-800">{person.parentProfile.connectedStudentNumbers.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {onOpenGoogleMeet && (
                          <button
                            type="button"
                            onClick={onOpenGoogleMeet}
                            className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                            title="Start Google Meet with this person"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Meet</span>
                          </button>
                        )}
                        {!isVerified && (
                          <button
                            type="button"
                            onClick={() => approveUser(person.id)}
                            className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Verify</span>
                          </button>
                        )}
                        {person.role === 'parent' && (
                          <button
                            type="button"
                            onClick={() => {
                              const isPrem = person.parentSubscription?.tier === 'premium';
                              updateParentSubscription(person.id, isPrem ? 'medium' : 'premium', 'monthly', 'airtel_money');
                            }}
                            className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition"
                            title="Toggle Parent Subscription Tier"
                          >
                            {person.parentSubscription?.tier === 'premium' ? 'Plan: Premium' : 'Plan: Medium'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: GOOGLE MEET VIDEO CONFERENCING & VIRTUAL CLASSROOMS */}
      {activeTab === 'meet' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-200 border border-emerald-400/30">
                <Video className="w-3.5 h-3.5" />
                Official Google Meet Integration
              </div>
              <h3 className="text-2xl font-black">
                Launch Live Video Conferences & Masterclasses
              </h3>
              <p className="text-sm text-emerald-100 leading-relaxed">
                Connect instantly with School Heads across Zambia, host PTA Board meetings, or deliver national ECZ Exam revision seminars using Google Meet.
              </p>
            </div>

            {onOpenGoogleMeet && (
              <button
                type="button"
                onClick={onOpenGoogleMeet}
                className="px-6 py-3.5 bg-white hover:bg-emerald-50 text-emerald-900 rounded-2xl font-extrabold text-sm shadow-xl hover:scale-105 active:scale-95 transition flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Video className="w-5 h-5 text-emerald-700" />
                <span>Open Google Meet Studio</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
              <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl w-fit">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">National Head Teacher Briefing</h4>
              <p className="text-xs text-slate-500">Scheduled monthly synchronization with school principals regarding ECZ curriculum updates.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
              <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl w-fit">
                <GraduationCap className="w-5 h-5 text-teal-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">ECZ Exam Masterclasses</h4>
              <p className="text-xs text-slate-500">Live online tutoring sessions in Mathematics, Sciences, and English Language for Grade 7, 9 & 12.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl w-fit">
                <Building className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">School Board Consultation</h4>
              <p className="text-xs text-slate-500">Encrypted virtual governance meetings with high-definition audio and screen sharing.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: KEYS & AIRTEL MONEY APPROVALS */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          {/* Section 1: Pending Manual Verification Desk */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-amber-50/60 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-500/20 text-amber-800 rounded-lg">
                    <CreditCard className="w-4 h-4 text-amber-700" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Airtel Money & Mobile Payment Verification Desk
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Users who make manual Airtel Money, MTN MoMo, or Zamtel transfers submit their transaction reference number here. Review and approve to activate their subscription instantly in the database.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 shrink-0">
                {pendingSubRequests.filter((r) => r.status === 'pending_review').length} Awaiting Approval
              </span>
            </div>

            {pendingSubRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No pending subscription requests found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="p-4 font-semibold">Applicant & Contact</th>
                      <th className="p-4 font-semibold">Target Entity</th>
                      <th className="p-4 font-semibold">Requested Plan</th>
                      <th className="p-4 font-semibold">Payment Channel & Ref</th>
                      <th className="p-4 font-semibold">Date Submitted</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Admin Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pendingSubRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{req.requesterName}</p>
                          <p className="text-slate-500 font-mono text-[11px]">{req.requesterEmail}</p>
                          <p className="text-emerald-700 font-mono text-[11px]">{req.requesterPhone}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            {req.targetType === 'school' ? (
                              <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            ) : (
                              <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            )}
                            <span className="font-bold text-slate-800">{req.targetName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono capitalize">{req.targetType} Account</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900 uppercase">
                            {req.requestedTier} (K{req.priceZMW}/mo)
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px]">
                          <div className="font-bold text-slate-800 uppercase">{req.paymentMethod.replace('_', ' ')}</div>
                          <div className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                            Ref: {req.paymentReference}
                          </div>
                          {req.notes && (
                            <p className="text-[10px] font-sans text-slate-500 mt-1 italic">{req.notes}</p>
                          )}
                        </td>
                        <td className="p-4 text-slate-600 font-mono text-[11px]">
                          {req.requestDate}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              req.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : req.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {req.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {req.status === 'pending_review' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => approveSubscriptionRequest(req.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve & Activate</span>
                              </button>
                              <button
                                onClick={() => rejectSubscriptionRequest(req.id)}
                                className="px-2.5 py-1.5 bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-lg text-xs font-bold transition"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] font-medium">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 2: Key Generator & Live Database Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: Single-Use Key Generator */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Issue Single-Use Activation Key</h4>
                  <p className="text-[11px] text-slate-500">Generate authorization codes for schools or parents</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Account Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setKeyTargetType('school');
                        setKeyTargetId(schools[0]?.id || '');
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                        keyTargetType === 'school'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>School Staff</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setKeyTargetType('parent');
                        const firstParent = allUsers.find((u) => u.role === 'parent');
                        setKeyTargetId(firstParent?.id || '');
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                        keyTargetType === 'parent'
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Parent Account</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select {keyTargetType === 'school' ? 'Educational Institution' : 'Parent Guardian'}
                  </label>
                  <select
                    value={keyTargetId}
                    onChange={(e) => setKeyTargetId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium outline-hidden"
                  >
                    {keyTargetType === 'school'
                      ? schools.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.code}) - {s.city}
                          </option>
                        ))
                      : allUsers
                          .filter((u) => u.role === 'parent' || u.userCategory === 'parent')
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.fullName} ({p.phone || p.email})
                            </option>
                          ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subscription Plan Tier</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setKeyTier('medium')}
                      className={`p-2.5 rounded-xl text-left border transition ${
                        keyTier === 'medium'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">Medium</div>
                      <div className="text-[11px] font-extrabold text-emerald-700">
                        {keyTargetType === 'school' ? 'K400 / month' : 'K150 / month'}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setKeyTier('premium')}
                      className={`p-2.5 rounded-xl text-left border transition ${
                        keyTier === 'premium'
                          ? 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1">
                        <span>Premium</span>
                        <Sparkles className="w-3 h-3 text-amber-600" />
                      </div>
                      <div className="text-[11px] font-extrabold text-amber-700">
                        {keyTargetType === 'school' ? 'K450 / month' : 'K200 / month'}
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Transaction Reference</label>
                  <input
                    type="text"
                    value={keyNotes}
                    onChange={(e) => setKeyNotes(e.target.value)}
                    placeholder="e.g. Paid via Airtel Money TXN-998242"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const created = generateActivationKey(keyTargetType, keyTargetId, keyTier, 'monthly', keyNotes);
                    setNewlyGeneratedKey(created);
                    setKeyNotes('');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Generate Encrypted Activation Key</span>
                </button>

                {newlyGeneratedKey && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-950 border border-emerald-700 text-white space-y-2 animate-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Key Generated in Database:
                      </span>
                      <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-mono">
                        Active
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-lg border border-emerald-600/60 font-mono text-center text-base font-black tracking-widest text-emerald-300 select-all">
                      {newlyGeneratedKey.code}
                    </div>

                    <p className="text-[11px] text-slate-300">
                      Target: <strong>{newlyGeneratedKey.targetName}</strong> ({newlyGeneratedKey.tier.toUpperCase()} - K{newlyGeneratedKey.priceZMW}/mo)
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(newlyGeneratedKey.code);
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'Code Copied to Clipboard!' : 'Copy Code for SMS / WhatsApp'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right 7 Cols: Issued Keys Database */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Database Single-Use Activation Keys</h4>
                  <p className="text-[11px] text-slate-500">Track key redemption and active licenses</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={keyFilterStatus}
                    onChange={(e) => setKeyFilterStatus(e.target.value as any)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-semibold"
                  >
                    <option value="all">All Statuses ({activationKeys.length})</option>
                    <option value="active_unused">Active / Unused</option>
                    <option value="redeemed">Redeemed</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="p-3 font-semibold">Activation Code</th>
                      <th className="p-3 font-semibold">Beneficiary</th>
                      <th className="p-3 font-semibold">Plan</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activationKeys
                      .filter((k) => keyFilterStatus === 'all' || k.status === keyFilterStatus)
                      .map((k) => (
                        <tr key={k.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-900 select-all">
                            {k.code}
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-slate-800 truncate max-w-[140px]">{k.targetName}</p>
                            <p className="text-[10px] text-slate-400 capitalize">{k.targetType}</p>
                          </td>
                          <td className="p-3 font-bold text-slate-800">
                            <span className="uppercase">{k.tier}</span> (K{k.priceZMW})
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                                k.status === 'active_unused'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : k.status === 'redeemed'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {k.status === 'active_unused' ? 'Active / Unused' : k.status}
                            </span>
                            {k.redeemedAt && (
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                Redeemed: {k.redeemedAt}
                              </p>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(k.code);
                                }}
                                className="p-1.5 text-slate-600 hover:text-emerald-700 rounded hover:bg-slate-100"
                                title="Copy code"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                              {k.status === 'active_unused' && (
                                <button
                                  onClick={() => revokeActivationKey(k.id)}
                                  className="px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-50 rounded"
                                >
                                  Revoke
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: School Subscriptions Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-600" />
                    Institutional School Staff Subscriptions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Paid once per school &bull; Covers all faculty connected to the unique School ID
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubModalMode('school');
                    setIsSubModalOpen(true);
                  }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  Manage Pricing
                </button>
              </div>

              <div className="space-y-3">
                {schools.map((s) => {
                  const tier = s.staffSubscription?.tier || 'medium';
                  const isPrem = tier === 'premium';
                  const sStaffCount = allUsers.filter(
                    (u) => u.schoolId === s.id && (u.role === 'head_teacher' || u.role === 'deputy_head_teacher' || u.role === 'teacher')
                  ).length;

                  return (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={s.logo}
                          alt={s.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-300 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                            <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                              {s.code}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {s.city}, {s.province} &bull; {sStaffCount} Faculty Members Covered
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span
                            className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              isPrem
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            {isPrem ? 'Premium K450/mo' : 'Medium K400/mo'}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Next: {s.staffSubscription?.nextBillingDate || '2026-09-30'}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            const newTier = isPrem ? 'medium' : 'premium';
                            updateSchoolSubscription(s.id, newTier, 'monthly', 'airtel_money');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
                        >
                          Switch to {isPrem ? 'Medium (K400)' : 'Premium (K450)'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Parent Subscriptions Quick Overview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    Parent Individual Subscriptions & Verification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Parents pay individually to access linked children's results and daily records
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  {parentUsers.length} Active Parents
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-2 font-semibold">Parent Name</th>
                      <th className="pb-2 font-semibold">Contact / WhatsApp</th>
                      <th className="pb-2 font-semibold">Linked Children</th>
                      <th className="pb-2 font-semibold">Tier & Fee</th>
                      <th className="pb-2 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parentUsers.slice(0, 5).map((p) => {
                      const tier = p.parentSubscription?.tier || 'medium';
                      const isPrem = tier === 'premium';
                      return (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              <img src={p.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                              <span className="font-bold text-slate-900">{p.fullName}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-slate-600 font-mono text-[11px]">
                            {p.whatsAppNumber || p.phone || '+260 977 123456'}
                          </td>
                          <td className="py-2.5 text-slate-600">
                            {p.parentProfile?.connectedStudentNumbers?.join(', ') || 'STU-2026-0012'}
                          </td>
                          <td className="py-2.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                isPrem ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                              }`}
                            >
                              {isPrem ? 'Premium K200/mo' : 'Medium K150/mo'}
                            </span>
                          </td>
                          <td className="py-2.5 text-right">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Active
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Col: Platform Architecture & Security */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Data Isolation & Multi-Tenancy
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                SchoolLink enforces rigorous multi-tenant data boundaries. Faculty and teachers can strictly only query documents matching their institutional <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-400 font-mono">schoolId</code>.
              </p>

              <div className="my-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>School Staff Isolation:</span>
                  <span className="font-bold text-emerald-400 font-mono">Enforced (School ID)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Parent Child Verification:</span>
                  <span className="font-bold text-emerald-400 font-mono">Student No. Linked</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Staff Passwords:</span>
                  <span className="font-bold text-emerald-400 font-mono">Head Teacher Controlled</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Tamper-Resistant Ledger:</span>
                  <span className="font-bold text-emerald-400 font-mono">SHA-256 Validated</span>
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 text-center">
                <p className="text-[11px] text-slate-300">
                  Directorate Security Clearance: <strong>PADM-ZAM-001</strong>
                </p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Platform Directorate Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={onOpenCreateSchool}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Add New School Institution</p>
                      <p className="text-[10px] text-slate-500">Generates unique School ID & Head Teacher credentials</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setSubModalMode('parent');
                    setIsSubModalOpen(true);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-teal-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">Parent Subscription Manager</p>
                      <p className="text-[10px] text-slate-500">Configure Medium K150 & Premium K200 plans</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">Inspect Security Audit Ledger</p>
                      <p className="text-[10px] text-slate-500">Track all grade approvals and user logins</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHOOL LICENSES & SUBSCRIPTIONS */}
      {activeTab === 'schools' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" />
                Registered Educational Institutions Directory
              </h3>
              <p className="text-xs text-slate-500">
                School Staff subscriptions cover Head Teacher, Deputy Head, and Teachers under a single school payment.
              </p>
            </div>

            <button
              onClick={onOpenCreateSchool}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Register New School</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-4 font-semibold">School Name & Code</th>
                  <th className="p-4 font-semibold">Province / City</th>
                  <th className="p-4 font-semibold">Covered Staff</th>
                  <th className="p-4 font-semibold">Staff Password Code</th>
                  <th className="p-4 font-semibold">Subscription Tier</th>
                  <th className="p-4 font-semibold">Monthly Rate</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {schools.map((s) => {
                  const sStaff = allUsers.filter(
                    (u) => u.schoolId === s.id && (u.role === 'head_teacher' || u.role === 'deputy_head_teacher' || u.role === 'teacher')
                  );
                  const tier = s.staffSubscription?.tier || 'medium';
                  const isPrem = tier === 'premium';

                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={s.logo} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-300" />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                            <p className="font-mono text-slate-500 text-[11px]">{s.code} &bull; Reg: {s.registrationNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-700">
                        {s.city}, {s.province}
                      </td>
                      <td className="p-4 font-semibold text-slate-900">
                        {sStaff.length} Faculty Staff
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-700 bg-emerald-50/50 px-2 py-1 rounded border border-emerald-200 inline-block my-2">
                        {s.staffPassword || 'STAFF-2026'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[11px] border ${
                            isPrem
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {isPrem ? <Sparkles className="w-3.5 h-3.5 text-amber-600" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                          <span>{isPrem ? 'Premium' : 'Medium'}</span>
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        K{isPrem ? 450 : 400} / mo
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              const newTier = isPrem ? 'medium' : 'premium';
                              updateSchoolSubscription(s.id, newTier, 'monthly', 'airtel_money');
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                          >
                            Set {isPrem ? 'Medium (K400)' : 'Premium (K450)'}
                          </button>
                          <button
                            onClick={() => switchSchool(s.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
                          >
                            Inspect School
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PARENTS ACCOUNTS & SUBSCRIPTIONS */}
      {activeTab === 'parents' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                Parent & Guardian Directory & Subscriptions
              </h3>
              <p className="text-xs text-slate-500">
                Individual subscriptions: Medium K150/month (Basic progress, results, attendance) & Premium K200/month (AI insights & advanced reports)
              </p>
            </div>
            <button
              onClick={() => {
                setSubModalMode('parent');
                setIsSubModalOpen(true);
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <CreditCard className="w-4 h-4" />
              <span>Parent Pricing Settings</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-4 font-semibold">Parent Profile</th>
                  <th className="p-4 font-semibold">WhatsApp / Phone</th>
                  <th className="p-4 font-semibold">Associated School</th>
                  <th className="p-4 font-semibold">Linked Children (Student No.)</th>
                  <th className="p-4 font-semibold">Subscription Plan</th>
                  <th className="p-4 font-semibold">Monthly Rate</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {parentUsers.map((p) => {
                  const tier = p.parentSubscription?.tier || 'medium';
                  const isPrem = tier === 'premium';
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                          <div>
                            <p className="font-bold text-slate-900">{p.fullName}</p>
                            <p className="text-slate-500 text-[11px]">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-700 font-mono text-[11px]">
                        {p.whatsAppNumber || p.phone || '+260 977 123456'}
                      </td>
                      <td className="p-4 text-slate-700">
                        {p.schoolName || 'Kabwe Secondary School'}
                      </td>
                      <td className="p-4 font-mono font-semibold text-teal-800">
                        {p.parentProfile?.connectedStudentNumbers?.join(', ') || 'STU-2026-0012'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[11px] border ${
                            isPrem
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-teal-50 text-teal-800 border-teal-300'
                          }`}
                        >
                          {isPrem ? <Sparkles className="w-3.5 h-3.5 text-amber-600" /> : <CheckCircle className="w-3.5 h-3.5 text-teal-600" />}
                          <span>{isPrem ? 'Premium' : 'Medium'}</span>
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        K{isPrem ? 200 : 150} / mo
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            const newTier = isPrem ? 'medium' : 'premium';
                            updateParentSubscription(p.id, newTier, 'monthly', 'airtel_money');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                        >
                          Switch to {isPrem ? 'Medium (K150)' : 'Premium (K200)'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GLOBAL USER DIRECTORY (4 CATEGORIES) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Global Platform User Directory (4 Main Categories)
              </h3>
              <p className="text-xs text-slate-500">
                School Staff (Head Teacher, Deputy, Teacher), Parents, Students, and Platform Administrators
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 w-48 sm:w-64"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-semibold"
              >
                <option value="all">All Categories</option>
                <option value="school_staff">School Staff (Head, Deputy, Teachers)</option>
                <option value="parent">Parents / Guardians</option>
                <option value="student">Students / Pupils</option>
                <option value="platform_admin">Platform Administrators</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Category & Role</th>
                  <th className="p-4 font-semibold">Institution / School</th>
                  <th className="p-4 font-semibold">Phone / WhatsApp</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((u) => {
                  const cat =
                    u.userCategory ||
                    (u.role === 'head_teacher' || u.role === 'deputy_head_teacher' || u.role === 'teacher'
                      ? 'school_staff'
                      : u.role === 'parent'
                      ? 'parent'
                      : u.role === 'student'
                      ? 'student'
                      : 'platform_admin');

                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                          <div>
                            <p className="font-bold text-slate-900">{u.fullName}</p>
                            <p className="text-slate-500 text-[11px]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            cat === 'school_staff'
                              ? 'bg-emerald-100 text-emerald-800'
                              : cat === 'parent'
                              ? 'bg-teal-100 text-teal-800'
                              : cat === 'student'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {cat.replace('_', ' ')}
                        </span>
                        <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                          {u.role.replace('_', ' ').toUpperCase()}
                        </p>
                      </td>
                      <td className="p-4 text-slate-700">
                        {u.schoolName || 'Platform Central'}
                      </td>
                      <td className="p-4 text-slate-700 font-mono text-[11px]">
                        <div>P: {u.phone || 'N/A'}</div>
                        {u.whatsAppNumber && (
                          <div className="text-emerald-700 font-semibold">WA: {u.whatsAppNumber}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                            u.verificationStatus === 'verified'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {u.verificationStatus === 'verified' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          <span>{u.verificationStatus}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.verificationStatus === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveUser(u.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectUser(u.id)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Authorized</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: NATIONAL SECURITY & AUDIT LEDGER */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                Cross-Institutional Cryptographic Security Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Tamper-evident logs of authentications, grade approvals, staff password updates, and subscription renewals.
              </p>
            </div>
            <span className="text-xs font-mono bg-indigo-50 text-indigo-800 font-bold px-3 py-1 rounded-lg border border-indigo-200">
              {auditLogs.length} Total Audit Records
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {log.action}
                    </span>
                    <span className="text-slate-500 text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-800 text-xs">{log.details}</p>
                </div>
                <div className="text-right sm:text-right shrink-0">
                  <p className="text-slate-600 font-bold text-[11px]">{log.userName}</p>
                  <p className="text-[10px] text-slate-400">{log.ipAddress}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription Pricing Modal */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        defaultMode={subModalMode}
      />
    </div>
  );
};
