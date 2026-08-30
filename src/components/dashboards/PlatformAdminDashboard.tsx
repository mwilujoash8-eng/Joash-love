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
  Lock
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import {
  School,
  User,
  UserCategory,
  SchoolStaffSubscriptionTier,
  ParentSubscriptionTier,
  AuditLog
} from '../../types';
import { SubscriptionModal } from '../modals/SubscriptionModal';

interface PlatformAdminDashboardProps {
  onOpenCreateSchool: () => void;
  onOpenProfile: () => void;
}

export const PlatformAdminDashboard: React.FC<PlatformAdminDashboardProps> = ({
  onOpenCreateSchool,
  onOpenProfile,
}) => {
  const {
    schools,
    allUsers,
    auditLogs,
    updateSchoolSubscription,
    updateParentSubscription,
    approveUser,
    rejectUser,
    switchSchool,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'overview' | 'schools' | 'parents' | 'users' | 'security'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedSchoolForDetails, setSelectedSchoolForDetails] = useState<School | null>(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalMode, setSubModalMode] = useState<'school' | 'parent'>('school');

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

  // Filtered users
  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.whatsAppNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.schoolName?.toLowerCase().includes(searchQuery.toLowerCase());

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

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateSchool}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Register & License New School</span>
            </button>

            <button
              onClick={() => {
                setSubModalMode('school');
                setIsSubModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Subscription Pricing Desk</span>
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
          { id: 'schools', label: 'School Licenses & Subscriptions', icon: <Building className="w-4 h-4" /> },
          { id: 'parents', label: 'Parent Accounts & Subscriptions', icon: <Users className="w-4 h-4" /> },
          { id: 'users', label: 'Global User Directory (4 Categories)', icon: <Users className="w-4 h-4" /> },
          { id: 'security', label: 'National Audit & Security Ledger', icon: <Shield className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
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
