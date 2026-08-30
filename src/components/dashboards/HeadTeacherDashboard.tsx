import React, { useState } from 'react';
import {
  Shield,
  Users,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  Lock,
  Unlock,
  Send,
  Sparkles,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  FileText,
  UserCheck,
  Building,
  Clock,
  PlusCircle,
  BarChart3,
  Search,
  Eye,
  Sliders,
  Settings,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole, TermId, AssessmentRecord } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TeacherExcelStudio } from '../tools/TeacherExcelStudio';
import { CampusStoriesTray } from '../social/CampusStoriesTray';
import { SchoolGroupsHub } from '../groups/SchoolGroupsHub';
import { FinancePublishingStudio } from '../finance/FinancePublishingStudio';
import { ZambianCalendarBanner } from '../common/ZambianCalendarBanner';
import { SubscriptionModal } from '../modals/SubscriptionModal';
import { Layers, DollarSign } from 'lucide-react';

interface HeadTeacherDashboardProps {
  onViewReportCard: (reportCardId: string) => void;
  onOpenCreateSchool: () => void;
  onOpenProfile?: () => void;
}

export const HeadTeacherDashboard: React.FC<HeadTeacherDashboardProps> = ({
  onViewReportCard,
  onOpenCreateSchool,
  onOpenProfile,
}) => {
  const {
    currentSchool,
    currentUser,
    allUsers,
    assessments,
    reportCards,
    announcements,
    auditLogs,
    approveUser,
    rejectUser,
    approveAssessment,
    publishTermReportCards,
    postAnnouncement,
    updateSchoolCalendar,
    promoteStudent,
    promoteClass,
    teacherDutyLogs,
    reviewTeacherDutyLog,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'approvals' | 'finance' | 'groups' | 'duty_logs' | 'results' | 'excel' | 'calendar' | 'promotion' | 'ai_assistant' | 'announcements' | 'directory' | 'audit'
  >('overview');
  const [showSubModal, setShowSubModal] = useState(false);

  // Filter school data
  const schoolStudents = allUsers.filter((u) => u.schoolId === currentSchool.id && u.role === 'student');
  const schoolTeachers = allUsers.filter((u) => u.schoolId === currentSchool.id && u.role === 'teacher');
  const schoolParents = allUsers.filter((u) => u.schoolId === currentSchool.id && u.role === 'parent');
  const pendingUsers = allUsers.filter((u) => u.schoolId === currentSchool.id && u.verificationStatus === 'pending');
  const pendingDutyLogs = teacherDutyLogs.filter((l) => l.schoolId === currentSchool.id && l.schoolManagerStatus === 'submitted' && l.sentToSchoolManager);

  // Promotion tab state
  const [promoteClassIdFrom, setPromoteClassIdFrom] = useState<string>(currentSchool.classes[0]?.id || '');
  const [targetGrade, setTargetGrade] = useState<string>('10');
  const [targetClassId, setTargetClassId] = useState<string>(currentSchool.classes[1]?.id || currentSchool.classes[0]?.id || '');
  const [nextAcademicYear, setNextAcademicYear] = useState<string>('2027');
  const [promotionNotice, setPromotionNotice] = useState<string | null>(null);

  const schoolAssessments = assessments.filter((a) => a.schoolId === currentSchool.id);
  const submittedAssessments = schoolAssessments.filter((a) => a.status === 'submitted');
  const approvedAssessments = schoolAssessments.filter((a) => a.status === 'approved' || a.status === 'published');

  // AI Circular generator state
  const [aiTopic, setAiTopic] = useState('End of Term 1 Examinations & Report Card Collection');
  const [aiTarget, setAiTarget] = useState('Parents, Guardians, and Teachers');
  const [aiKeyPoints, setAiKeyPoints] = useState('Report cards published online on SchoolLink; PTA meeting on Friday 10th April; Term 2 fees clearance; Resumption on 11th May 2026.');
  const [aiGeneratedText, setAiGeneratedText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // New Announcement state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'General' | 'Academic' | 'PTA' | 'Emergency'>('Academic');
  const [newPriority, setNewPriority] = useState<'normal' | 'urgent'>('normal');

  // Calendar config state
  const [calendarTerms, setCalendarTerms] = useState(currentSchool.terms);
  const [selectedTermId, setSelectedTermId] = useState<TermId>(currentSchool.activeTerm);

  // Analytics data for Recharts
  const gradePerformanceData = [
    { grade: 'Grade 8', passRate: 91.5, distinctionCount: 14, total: 72 },
    { grade: 'Grade 9', passRate: 96.2, distinctionCount: 22, total: 78 },
    { grade: 'Grade 10', passRate: 88.0, distinctionCount: 12, total: 68 },
    { grade: 'Grade 11', passRate: 94.8, distinctionCount: 19, total: 70 },
    { grade: 'Grade 12', passRate: 98.1, distinctionCount: 28, total: 72 },
  ];

  const subjectPassData = [
    { subject: 'Math', passRate: 92 },
    { subject: 'English', passRate: 98 },
    { subject: 'Science', passRate: 94 },
    { subject: 'Physics', passRate: 89 },
    { subject: 'Biology', passRate: 95 },
    { subject: 'Comp Studies', passRate: 100 },
  ];

  const genderData = [
    { name: 'Male Students', value: 185, color: '#4f46e5' },
    { name: 'Female Students', value: 175, color: '#06b6d4' },
  ];

  // Handle AI Circular drafting
  const handleDraftCircular = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/draft-circular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: currentSchool.name,
          topic: aiTopic,
          targetAudience: aiTarget,
          keyPoints: aiKeyPoints,
        }),
      });
      const data = await response.json();
      setAiGeneratedText(data.circular || '');
      setNewTitle(aiTopic);
      setNewContent(data.circular || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    postAnnouncement({
      id: 'ann_' + Date.now(),
      schoolId: currentSchool.id,
      title: newTitle,
      content: newContent,
      category: newCategory as any,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      targetRoles: ['parent', 'teacher', 'student', 'school_board'],
      isPinned: true,
      priority: newPriority,
      createdAt: new Date().toISOString(),
    });

    setNewTitle('');
    setNewContent('');
    alert('Official announcement broadcasted to all school users!');
  };

  return (
    <div className="space-y-6">
      {/* Official Zambian Ministry of Education Calendar Engine */}
      <ZambianCalendarBanner />

      {/* Top Banner: Head Teacher Executive Summary */}
      <div className="bg-[#1E293B] rounded-2xl p-6 text-white shadow-lg border border-slate-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xl shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Office of the Head Teacher
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  PRIMARY ADMINISTRATOR
                </span>
                <button
                  type="button"
                  onClick={() => setShowSubModal(true)}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition flex items-center gap-1 ${
                    currentSchool.staffSubscription?.tier === 'premium'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>
                    Staff Plan: {currentSchool.staffSubscription?.tier === 'premium' ? 'Premium (K450/mo)' : 'Medium (K400/mo)'}
                  </span>
                  <span className="underline ml-0.5">Manage</span>
                </button>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-0.5 text-white">
                Welcome back, {currentUser.fullName}
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                {currentSchool.name} &bull; Academic Year {currentSchool.academicYear} &bull; Term 1 (13 Weeks)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Edit Principal Profile</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('results')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 transition flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Results & Publishing</span>
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Approvals Queue ({pendingUsers.length})</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-700/80">
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">Total Enrollment</span>
            <div className="text-xl font-bold text-white mt-0.5 flex items-baseline gap-1.5">
              <span>{schoolStudents.length * 35 + 24}</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.2 rounded">+12% yoy</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">Teaching Faculty</span>
            <div className="text-xl font-bold text-white mt-0.5">
              {schoolTeachers.length + 8} Active
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">Term Pass Rate</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              95.4% <span className="text-xs text-slate-300 font-normal">ECZ</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">Pending Approvals</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {pendingUsers.length + submittedAssessments.length}
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 font-medium block">Term Progress</span>
            <div className="text-xl font-bold text-sky-400 mt-0.5">
              Week 13 / 13
            </div>
          </div>
        </div>
      </div>

      {/* CAMPUS SOCIAL STORIES TRAY (FACEBOOK-STYLE) */}
      <CampusStoriesTray />

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-1">
        {[
          { id: 'overview', label: 'Executive Analytics', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'finance', label: 'Finance Publications & Budgets', icon: <DollarSign className="w-4 h-4 text-amber-600" />, badge: 'Finance Team & Head' },
          { id: 'groups', label: 'School Groups & PTA Council', icon: <Layers className="w-4 h-4 text-purple-600" />, badge: 'Communities' },
          { id: 'approvals', label: `User Approvals (${pendingUsers.length})`, icon: <UserCheck className="w-4 h-4" /> },
          { id: 'duty_logs', label: `Teacher Duty & Knock-Off (${pendingDutyLogs.length})`, icon: <Calendar className="w-4 h-4 text-emerald-600" />, badge: pendingDutyLogs.length > 0 ? `${pendingDutyLogs.length} New` : undefined },
          { id: 'results', label: 'Results & Publishing Station', icon: <Award className="w-4 h-4" /> },
          { id: 'excel', label: 'Excel Spreadsheet Studio', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> },
          { id: 'calendar', label: 'Academic Calendar & Milestones', icon: <Calendar className="w-4 h-4" /> },
          { id: 'promotion', label: 'Academic Progression & Promotion', icon: <GraduationCap className="w-4 h-4 text-emerald-600" /> },
          { id: 'ai_assistant', label: 'AI Circular & Remarks Drafter', icon: <Sparkles className="w-4 h-4 text-emerald-600" /> },
          { id: 'announcements', label: 'School Announcements', icon: <Send className="w-4 h-4" /> },
          { id: 'directory', label: 'School Directory & Classes', icon: <Building className="w-4 h-4" /> },
          { id: 'audit', label: 'Security & Audit Logs', icon: <Shield className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
              activeTab === tab.id
                ? tab.id === 'finance'
                  ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs font-extrabold'
                  : tab.id === 'groups'
                  ? 'bg-purple-50 text-purple-800 border border-purple-300 shadow-2xs font-extrabold'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                tab.id === 'finance' ? 'bg-amber-600 text-white' : tab.id === 'groups' ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white animate-pulse'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB: FINANCE PUBLISHING STUDIO */}
      {activeTab === 'finance' && (
        <FinancePublishingStudio />
      )}

      {/* TAB: SCHOOL GROUPS & PTA COUNCIL */}
      {activeTab === 'groups' && (
        <SchoolGroupsHub />
      )}

      {/* TAB 1: EXECUTIVE ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Grade-by-Grade Pass Rate */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Term 1 Pass Rate by Grade Level</h3>
                  <p className="text-xs text-slate-500">ECZ Continuous Assessment and Mock Examination pass rate percentage</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  Target: &gt;90%
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
                    <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="passRate" name="Pass Rate (%)" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gender Parity Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Student Demographics</h3>
              <p className="text-xs text-slate-500 mb-4">Gender distribution parity ratio across all classes</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#1e293b' : '#10b981'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-800"></span>
                  <span>Male (51.4%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Female (48.6%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Scholars in the School */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Term 1 Honor Roll & Top Performers</h3>
                <p className="text-xs text-slate-500">Learners with distinction aggregate scores in ECZ standards</p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                ★ 6-POINTS DISTINCTION
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Natasha Mulenga', grade: 'Grade 9A', aggregate: '6 Points', avg: '89.4%', rank: '1st in Grade 9', color: 'border-amber-300 bg-amber-50/40' },
                { name: 'Mubita Mweemba', grade: 'Grade 9A', aggregate: '6 Points', avg: '87.3%', rank: '2nd in Grade 9', color: 'border-emerald-200 bg-emerald-50/40' },
                { name: 'Dalitso Phiri', grade: 'Grade 11 Science', aggregate: '7 Points', avg: '85.6%', rank: '1st in Grade 11', color: 'border-slate-200 bg-slate-50/60' },
              ].map((scholar, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${scholar.color} flex items-center justify-between`}>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-700 block">{scholar.rank}</span>
                    <h4 className="text-sm font-bold text-slate-950 mt-0.5">{scholar.name}</h4>
                    <p className="text-xs text-slate-600">{scholar.grade} &bull; {scholar.avg}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-800 bg-white px-2 py-1 rounded-lg shadow-2xs border border-amber-200">
                      {scholar.aggregate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPROVALS & VERIFICATIONS QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">User Approvals & Verification Queue</h3>
              <p className="text-xs text-slate-500">
                Authorized management must verify and approve user connections before they access official school records.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
              {pendingUsers.length} Pending Actions
            </span>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">Approvals Queue is Clear</h4>
              <p className="text-xs text-slate-500 mt-1">All student enrollments, teacher assignments, and parent connections are verified.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{user.fullName}</h4>
                        <p className="text-xs text-slate-500">{user.email || user.phone}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded border border-amber-200">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1">
                    {user.studentProfile && (
                      <p><strong className="text-slate-700">Student No:</strong> {user.studentProfile.studentNumber} | Grade {user.studentProfile.grade}</p>
                    )}
                    {user.parentProfile && (
                      <p><strong className="text-slate-700">Connecting to:</strong> Student {user.parentProfile.connectedStudentNumbers.join(', ')}</p>
                    )}
                    {user.teacherProfile && (
                      <p><strong className="text-slate-700">Qualification:</strong> {user.teacherProfile.qualification}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => approveUser(user.id)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve & Activate</span>
                    </button>
                    <button
                      onClick={() => rejectUser(user.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-lg text-xs font-bold transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: TEACHER DUTY, ATTENDANCE & KNOCK-OFF LOGS */}
      {activeTab === 'duty_logs' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Teacher Daily Attendance, Classes Taught & Knock-Off Register</h3>
                <p className="text-xs text-slate-500">
                  Automated time verification submitted directly by teaching staff upon arrival and checkout. Review period completion (🟢 Taught / 🔴 Not Taught) and acknowledge submissions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
                  {pendingDutyLogs.length} Pending Manager Verification
                </span>
              </div>
            </div>

            {teacherDutyLogs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No duty logs recorded yet for today.</p>
                <p className="text-xs text-slate-500">Teachers check in upon arrival and confirm knocked-off periods at the end of their shift.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {teacherDutyLogs.map((log) => {
                  const taughtCount = log.periods.filter(p => p.status === 'taught').length;
                  const totalPeriods = log.periods.length;
                  const completionRate = totalPeriods > 0 ? Math.round((taughtCount / totalPeriods) * 100) : 0;

                  return (
                    <div
                      key={log.id}
                      className={`p-5 rounded-2xl border transition ${
                        log.schoolManagerStatus === 'submitted' && log.sentToSchoolManager
                          ? 'border-emerald-300 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow">
                            {log.teacherName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{log.teacherName}</h4>
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {log.teacherNumber || 'TSC Verified'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Date: <strong>{log.date}</strong> &bull; Secondary Faculty
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-xs bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 text-slate-700">
                            Arrival (Check-In): <strong className="text-emerald-700 font-mono">{log.checkInTime || 'Not checked in'}</strong>
                          </div>
                          <div className="text-xs bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 text-slate-700">
                            Knock-Off (Check-Out): <strong className="text-slate-900 font-mono">{log.checkOutTime || 'On Duty'}</strong>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                            log.schoolManagerStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.sentToSchoolManager
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {log.schoolManagerStatus === 'approved' ? 'Approved by Manager' : log.sentToSchoolManager ? 'Pending Review' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      {/* Periods Taught Row with Green/Red Indicators */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                            Periods Assigned &amp; Delivery Register ({taughtCount}/{totalPeriods} Taught &bull; {completionRate}%)
                          </span>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Green: Taught
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Red: Not Taught
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                          {log.periods.map((p) => (
                            <div
                              key={p.id}
                              className={`p-3 rounded-xl border flex items-center justify-between ${
                                p.status === 'taught'
                                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                                  : 'bg-red-50/60 border-red-300 text-red-950'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs">Period {p.periodNumber}</span>
                                  <span className="text-[10px] text-slate-500">({p.timeRange})</span>
                                </div>
                                <div className="text-xs font-semibold">{p.subjectName} &bull; {p.className}</div>
                                {p.topic && (
                                  <div className="text-[10px] text-slate-600 truncate max-w-[140px]">
                                    Topic: {p.topic}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col items-end gap-1">
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${
                                  p.status === 'taught' ? 'bg-emerald-600' : 'bg-red-600'
                                }`}>
                                  {p.status === 'taught' ? '✓' : '✕'}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-wider">
                                  {p.status === 'taught' ? 'Taught' : 'Not Taught'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes & Approval Bar */}
                      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="text-xs text-slate-500">
                          {log.dutyHandoverRemarks ? (
                            <span>Teacher Remark: <em>&ldquo;{log.dutyHandoverRemarks}&rdquo;</em></span>
                          ) : (
                            <span>Submitted automatically with biometric/system timestamps to the School Manager.</span>
                          )}
                        </div>

                        <div>
                          {log.schoolManagerStatus !== 'approved' ? (
                            <button
                              onClick={() => reviewTeacherDutyLog(log.id, 'approved')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verify &amp; Acknowledge Duty Log</span>
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-3 py-1.5 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Head Teacher
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RESULTS PUBLISHING & LOCKING STATION */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Term 1 Results Consolidation & Official Publishing</h3>
                <p className="text-xs text-slate-500">
                  Review submitted continuous assessments (Test 1, 2, 3) and final exam scores. Once approved and published, report cards are locked and sent to parents.
                </p>
              </div>

              <button
                onClick={() => {
                  currentSchool.classes.forEach((c) => {
                    publishTermReportCards(c.id, currentSchool.activeTerm);
                  });
                  alert('Term 1 Report Cards successfully consolidated and published to all parents and students!');
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Publish & Lock All Term Report Cards</span>
              </button>
            </div>

            {/* Submitted Assessments Review Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Class & Subject</th>
                    <th className="p-3">Assessment Title</th>
                    <th className="p-3">Teacher</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Max Marks</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {schoolAssessments.map((ass) => (
                    <tr key={ass.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold">
                        {ass.className} &bull; {ass.subjectName}
                      </td>
                      <td className="p-3 font-medium text-slate-900">{ass.title}</td>
                      <td className="p-3 text-slate-600">{ass.teacherName}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 uppercase">
                          {ass.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold">{ass.maxScore}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ass.status === 'approved' || ass.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ass.status === 'submitted'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ass.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {ass.status === 'submitted' ? (
                          <button
                            onClick={() => approveAssessment(ass.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                          >
                            Approve & Lock
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold flex items-center justify-end gap-1 text-[11px]">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Published Report Cards Grid */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Generated Term Report Cards ({reportCards.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {reportCards.map((rc) => (
                <div key={rc.id} className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{rc.studentName}</span>
                      <span className="font-mono text-indigo-700 font-bold text-[11px]">{rc.studentNumber}</span>
                    </div>
                    <p className="text-xs text-slate-500">{rc.className} &bull; {rc.termName}</p>
                    <div className="mt-2 flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200">
                      <span>Average: <strong>{rc.averagePercentage}%</strong></span>
                      <span className="text-amber-800 font-bold">ECZ: {rc.aggregatePoints} Pts</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewReportCard(rc.id)}
                    className="mt-3 w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-emerald-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Official Report Card</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EXCEL SPREADSHEET STUDIO */}
      {activeTab === 'excel' && (
        <div className="space-y-4">
          <TeacherExcelStudio />
        </div>
      )}

      {/* TAB 4: ACADEMIC CALENDAR & MILESTONES */}
      {activeTab === 'calendar' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Configurable Academic Calendar & Assessment Weeks</h3>
              <p className="text-xs text-slate-500">
                Customize term opening dates, 13-week milestones (Test 1 at Week 4, Test 2 at Week 8, Test 3 at Week 12), and examinations.
              </p>
            </div>
            <button
              onClick={() => {
                updateSchoolCalendar(
                  calendarTerms,
                  currentSchool.calendarEvents,
                  currentSchool.assessmentWeighting,
                  currentSchool.gradingScale
                );
                alert('Academic calendar settings updated successfully!');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-200 transition"
            >
              Save Calendar Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {calendarTerms.map((term, index) => (
              <div
                key={term.id}
                className={`p-4 rounded-xl border transition ${
                  term.isActive
                    ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-600/10'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">{term.name}</h4>
                  {term.isActive && (
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      ACTIVE TERM
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-semibold">Opening Date:</label>
                    <input
                      type="date"
                      value={term.startDate}
                      onChange={(e) => {
                        const updated = [...calendarTerms];
                        updated[index].startDate = e.target.value;
                        setCalendarTerms(updated);
                      }}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-semibold">Closing Date:</label>
                    <input
                      type="date"
                      value={term.endDate}
                      onChange={(e) => {
                        const updated = [...calendarTerms];
                        updated[index].endDate = e.target.value;
                        setCalendarTerms(updated);
                      }}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>Test 1: <strong>Week {term.test1Week}</strong></div>
                    <div>Test 2: <strong>Week {term.test2Week}</strong></div>
                    <div>Test 3: <strong>Week {term.test3Week}</strong></div>
                    <div>Exams: <strong>Week {term.examWeek}</strong></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 13-Week Term Progression Visualizer */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
              13-Week Term Milestone Roadmap
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs">
              {[
                { wk: 1, label: 'Week 1', event: 'School Opening', color: 'bg-white text-slate-800' },
                { wk: 2, label: 'Week 2', event: 'Syllabus Pacing', color: 'bg-white text-slate-800' },
                { wk: 3, label: 'Week 3', event: 'Lab Practicals', color: 'bg-white text-slate-800' },
                { wk: 4, label: 'Week 4', event: 'Test 1 (CA-1)', color: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' },
                { wk: 5, label: 'Week 5', event: 'Remedial Reviews', color: 'bg-white text-slate-800' },
                { wk: 6, label: 'Week 6', event: 'Mid-term Prep', color: 'bg-white text-slate-800' },
                { wk: 7, label: 'Week 7', event: 'Mid-Term Break', color: 'bg-blue-100 text-blue-900 border border-blue-200' },
                { wk: 8, label: 'Week 8', event: 'Test 2 (CA-2)', color: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' },
                { wk: 9, label: 'Week 9', event: 'JETS Science Fair', color: 'bg-white text-slate-800' },
                { wk: 10, label: 'Week 10', event: 'Sports & Culture', color: 'bg-white text-slate-800' },
                { wk: 11, label: 'Week 11', event: 'Mock Revision', color: 'bg-white text-slate-800' },
                { wk: 12, label: 'Week 12', event: 'Test 3 (CA-3)', color: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' },
                { wk: 13, label: 'Week 13', event: 'Final ECZ Exams', color: 'bg-red-100 text-red-900 border border-red-300 font-bold' },
                { wk: 14, label: 'Vacation', event: 'PTA & Reports', color: 'bg-emerald-100 text-emerald-900 font-bold' },
              ].map((m) => (
                <div key={m.wk} className={`p-2.5 rounded-lg border border-slate-200 text-center ${m.color}`}>
                  <span className="text-[10px] font-bold block">{m.label}</span>
                  <span className="text-xs truncate block">{m.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ACADEMIC PROGRESSION & MULTI-YEAR PROMOTION */}
      {activeTab === 'promotion' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Annual Student Progression & Grade Promotion
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Advance learners to their next grade level at the end of the academic year. Past term report cards, aggregate scores, and assessment marks remain permanently preserved in the student’s historical academic transcript.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-xs">
                <span className="text-emerald-800 font-semibold block">Academic Continuity</span>
                <span className="text-emerald-900 font-bold">Records Locked & Archived to ECZ Transcript</span>
              </div>
            </div>

            {promotionNotice && (
              <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{promotionNotice}</span>
                </div>
                <button
                  onClick={() => setPromotionNotice(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Promotion Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Source Class / Stream
                </label>
                <select
                  value={promoteClassIdFrom}
                  onChange={(e) => setPromoteClassIdFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {currentSchool.classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} (Grade {cls.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Promote To Grade
                </label>
                <select
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {['8', '9', '10', '11', '12'].map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Target Stream / Class
                </label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {currentSchool.classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  New Academic Year
                </label>
                <input
                  type="text"
                  value={nextAcademicYear}
                  onChange={(e) => setNextAcademicYear(e.target.value)}
                  placeholder="2027"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Students list in selected source class */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Learners in Selected Class ({
                    schoolStudents.filter(
                      (s) => s.studentProfile?.classId === promoteClassIdFrom || (!promoteClassIdFrom && s.studentProfile?.grade === '9')
                    ).length
                  })
                </h4>

                <button
                  onClick={() => {
                    promoteClass(promoteClassIdFrom, targetGrade, targetClassId, nextAcademicYear);
                    setPromotionNotice(
                      `Successfully batch promoted all learners to Grade ${targetGrade} (${nextAcademicYear}). Historical records archived.`
                    );
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Batch Promote Entire Class to Grade {targetGrade}</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Learner Name</th>
                      <th className="p-3">Student Number</th>
                      <th className="p-3">Current Grade & Stream</th>
                      <th className="p-3">Term 1 Average</th>
                      <th className="p-3">ECZ Points</th>
                      <th className="p-3">Academic History</th>
                      <th className="p-3 text-right">Individual Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {schoolStudents
                      .filter(
                        (s) => s.studentProfile?.classId === promoteClassIdFrom || (!promoteClassIdFrom && s.studentProfile?.grade === '9')
                      )
                      .map((stu) => {
                        const historyCount = stu.studentProfile?.academicHistory?.length || 0;
                        return (
                          <tr key={stu.id} className="hover:bg-slate-50 transition">
                            <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                              <img
                                src={stu.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                                alt=""
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                              />
                              <span>{stu.fullName}</span>
                            </td>
                            <td className="p-3 font-mono text-emerald-700 font-bold">
                              {stu.studentProfile?.studentNumber}
                            </td>
                            <td className="p-3">
                              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium text-[11px]">
                                {stu.studentProfile?.className || `Grade ${stu.studentProfile?.grade}`}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-slate-900">
                              87.2%
                            </td>
                            <td className="p-3 font-bold text-indigo-700">
                              6 Points (Distinction)
                            </td>
                            <td className="p-3">
                              {historyCount > 0 ? (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {historyCount} Past Year(s) Preserved
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[10px]">Current Year Active</span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  promoteStudent(stu.id, targetGrade, targetClassId, nextAcademicYear);
                                  setPromotionNotice(
                                    `Promoted ${stu.fullName} to Grade ${targetGrade} for Academic Year ${nextAcademicYear}. Past reports preserved.`
                                  );
                                }}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-bold transition"
                              >
                                Promote &rarr; Grade {targetGrade}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AI CIRCULAR & REMARKS DRAFTER */}
      {activeTab === 'ai_assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">Head Teacher AI Circular Drafter</h3>
            </div>
            <p className="text-xs text-slate-500">
              Draft professional, compliant administrative circulars, PTA meeting notices, and holiday announcements with Gemini AI.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Topic *</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
                <input
                  type="text"
                  value={aiTarget}
                  onChange={(e) => setAiTarget(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Key Points & Dates to Include</label>
                <textarea
                  rows={3}
                  value={aiKeyPoints}
                  onChange={(e) => setAiKeyPoints(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={handleDraftCircular}
                disabled={isAiLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAiLoading ? 'Drafting Circular with AI...' : 'Generate Official Notice'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Generated Circular Preview</h4>
                <span className="text-[10px] text-slate-500 font-mono">Office of the Head Teacher</span>
              </div>

              <textarea
                rows={12}
                value={aiGeneratedText || 'Your generated official notice will appear here for review and immediate broadcast.'}
                onChange={(e) => setAiGeneratedText(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl text-xs font-sans text-slate-800 leading-relaxed focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => {
                setNewTitle(aiTopic);
                setNewContent(aiGeneratedText);
                setActiveTab('announcements');
              }}
              disabled={!aiGeneratedText}
              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Send className="w-4 h-4" />
              <span>Transfer to Broadcast Station</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: SCHOOL ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handlePublishAnnouncement} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Broadcast Official Notice</h3>
            <p className="text-xs text-slate-500">Send an instant alert to parents, teachers, and students.</p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                placeholder="e.g. End of Term Circular"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="Academic">Academic</option>
                  <option value="PTA">PTA</option>
                  <option value="Emergency">Emergency</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent Alert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Content *</label>
              <textarea
                rows={5}
                required
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                placeholder="Type circular details..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200 transition"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Announcement</span>
            </button>
          </form>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Active School Circulars & Notices</h3>
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{ann.title}</span>
                    {ann.priority === 'urgent' && (
                      <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        URGENT
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{ann.content}</p>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Author: {ann.authorName} ({ann.authorRole.replace('_', ' ')})</span>
                  <span>Category: {ann.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SCHOOL DIRECTORY & CLASSES */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Classes and Streams ({currentSchool.classes.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {currentSchool.classes.map((cls) => (
                <div key={cls.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{cls.name}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">Grade {cls.grade}</span>
                  </div>
                  <p className="text-xs text-slate-600">Class Teacher: <strong>{cls.classTeacherName}</strong></p>
                  <p className="text-[11px] text-slate-500">{cls.studentCount} Students &bull; {cls.roomNumber || 'Block A'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Academic Subjects ({currentSchool.subjects.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
              {currentSchool.subjects.map((sub) => (
                <div key={sub.id} className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] font-mono text-indigo-600 font-bold block">{sub.code}</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{sub.name}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">{sub.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: SECURITY & AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Immutable Audit Trail</h3>
              <p className="text-xs text-slate-500">Every sensitive change to grading, report cards, or user access is recorded.</p>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
              {auditLogs.length} Events Logged
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-white text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">Timestamp (CAT)</th>
                  <th className="p-2.5">Action Code</th>
                  <th className="p-2.5">User & Role</th>
                  <th className="p-2.5">Audit Event Details</th>
                  <th className="p-2.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-2.5 text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-2.5 font-bold text-indigo-700">{log.action}</td>
                    <td className="p-2.5">{log.userName} ({log.userRole})</td>
                    <td className="p-2.5 font-sans text-slate-700">{log.details}</td>
                    <td className="p-2.5 text-slate-400">{log.ipAddress || '102.140.211.89'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* School Staff Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
      />
    </div>
  );
};
