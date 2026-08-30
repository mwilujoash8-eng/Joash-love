import React, { useState } from 'react';
import {
  Shield,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Award,
  Users,
  Search,
  Eye,
  Check,
  X
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { TeacherExcelStudio } from '../tools/TeacherExcelStudio';
import { CampusStoriesTray } from '../social/CampusStoriesTray';
import { SchoolGroupsHub } from '../groups/SchoolGroupsHub';
import { FinancePublishingStudio } from '../finance/FinancePublishingStudio';
import { Layers, DollarSign } from 'lucide-react';

interface DeputyHeadDashboardProps {
  onViewReportCard: (reportCardId: string) => void;
  onOpenProfile?: () => void;
}

export const DeputyHeadDashboard: React.FC<DeputyHeadDashboardProps> = ({
  onViewReportCard,
  onOpenProfile,
}) => {
  const { currentSchool, currentUser, allUsers, assessments, approveAssessment } = useSchool();
  const [activeTab, setActiveTab] = useState<'submissions' | 'finance' | 'groups' | 'excel' | 'attendance' | 'timetable' | 'conduct'>('submissions');

  const schoolAssessments = assessments.filter((a) => a.schoolId === currentSchool.id);
  const pendingSubmissions = schoolAssessments.filter((a) => a.status === 'submitted');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 text-white shadow-lg border border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xl shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Office of the Deputy Head Teacher
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  ACADEMIC SUPERVISION & OPERATIONS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-0.5 text-white">{currentUser.fullName}</h1>
              <p className="text-xs text-slate-300 mt-1">
                {currentSchool.name} &bull; Term 1 Academic Operations (13 Weeks)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Edit Profile</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('submissions')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Review Marks Submissions ({pendingSubmissions.length})</span>
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/80">
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Assessment Compliance</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              98.2% <span className="text-xs text-slate-400 font-normal">On Schedule</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Marks Awaiting Review</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {pendingSubmissions.length} Batches
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">School-Wide Attendance</span>
            <div className="text-xl font-bold text-white mt-0.5">
              96.8% <span className="text-xs text-slate-400 font-normal">Today</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Current Milestone</span>
            <div className="text-xl font-bold text-sky-400 mt-0.5">
              Week 13 Final Exams
            </div>
          </div>
        </div>
      </div>

      {/* CAMPUS SOCIAL STORIES TRAY */}
      <CampusStoriesTray />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 pb-1 overflow-x-auto">
        {[
          { id: 'submissions', label: `Teacher Score Submissions (${pendingSubmissions.length})`, icon: <FileSpreadsheet className="w-4 h-4" /> },
          { id: 'finance', label: 'Finance Publications', icon: <DollarSign className="w-4 h-4 text-amber-600" />, badge: 'Admin Access' },
          { id: 'groups', label: 'School Groups & PTA', icon: <Layers className="w-4 h-4 text-purple-600" />, badge: 'Communities' },
          { id: 'excel', label: 'Excel Spreadsheet Studio', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> },
          { id: 'attendance', label: 'School-Wide Attendance Supervision', icon: <Calendar className="w-4 h-4" /> },
          { id: 'timetable', label: 'Examinations Timetable & Invigilation', icon: <Clock className="w-4 h-4" /> },
          { id: 'conduct', label: 'Student Conduct & Disciplinary Logs', icon: <Shield className="w-4 h-4" /> },
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
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                tab.id === 'finance' ? 'bg-amber-600 text-white' : 'bg-purple-600 text-white'
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

      {/* TAB: GROUPS & PTA */}
      {activeTab === 'groups' && (
        <SchoolGroupsHub />
      )}

      {/* TAB 1: TEACHER SCORE SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Continuous Assessment Marks Submission Progress</h3>
              <p className="text-xs text-slate-500">
                Track whether subject teachers have submitted Test 1 (Wk 4), Test 2 (Wk 8), Test 3 (Wk 12), and Final Exam marks.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded">
              {schoolAssessments.length} Total Assessment Datasets
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Class & Subject</th>
                  <th className="p-3">Assessment Title</th>
                  <th className="p-3">Assigned Teacher</th>
                  <th className="p-3">Max Marks</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Academic Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {schoolAssessments.map((ass) => (
                  <tr key={ass.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-950">{ass.className} &bull; {ass.subjectName}</td>
                    <td className="p-3">{ass.title}</td>
                    <td className="p-3 text-slate-600">{ass.teacherName}</td>
                    <td className="p-3 font-mono">{ass.maxScore}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ass.status === 'approved' || ass.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ass.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {ass.status === 'submitted' ? (
                        <button
                          onClick={() => approveAssessment(ass.id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition"
                        >
                          Verify & Recommend to HT
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[11px]">✓ Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EXCEL STUDIO TAB */}
      {activeTab === 'excel' && (
        <div className="space-y-4">
          <TeacherExcelStudio />
        </div>
      )}

      {/* TAB 2: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Daily Attendance Rate by Grade Stream</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentSchool.classes.map((cls) => (
              <div key={cls.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{cls.name}</h4>
                  <p className="text-[11px] text-slate-500">Teacher: {cls.classTeacherName}</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                  97.4% Present
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TIMETABLE & INVIGILATION */}
      {activeTab === 'timetable' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Term 1 Examination Invigilation Roster (Week 13)</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Date & Session</th>
                  <th className="p-3">Paper / Subject</th>
                  <th className="p-3">Grade Level</th>
                  <th className="p-3">Exam Hall</th>
                  <th className="p-3">Chief Invigilator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {[
                  { date: 'Mon 6 Apr (08:00 - 10:30)', paper: 'Mathematics Paper 1 (Non-Calculator)', grade: 'Grade 9 & 12', hall: 'Main Assembly Hall', invig: 'Mr. Peter Tembo' },
                  { date: 'Tue 7 Apr (08:00 - 10:00)', paper: 'English Language Paper 1 (Composition)', grade: 'Grade 8 - 12', hall: 'Main Assembly Hall', invig: 'Mrs. Chanda Mwila' },
                  { date: 'Wed 8 Apr (08:00 - 10:15)', paper: 'Physics (Pure) Paper 2 (Theory)', grade: 'Grade 11 & 12', hall: 'Science Complex', invig: 'Mr. Emmanuel Musonda' },
                  { date: 'Thu 9 Apr (08:00 - 10:00)', paper: 'Integrated Science Paper 1', grade: 'Grade 8 & 9', hall: 'Block B Classrooms', invig: 'Mrs. Grace Phiri' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-semibold text-slate-700">{row.date}</td>
                    <td className="p-3 font-bold text-slate-950">{row.paper}</td>
                    <td className="p-3">{row.grade}</td>
                    <td className="p-3 text-slate-600">{row.hall}</td>
                    <td className="p-3 font-medium text-blue-900">{row.invig}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CONDUCT */}
      {activeTab === 'conduct' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Student Pastoral & Conduct Registry</h3>
          <p className="text-xs text-slate-500">Document student commendations and disciplinary interventions.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { type: 'Commendation', student: 'Mubita Mweemba (Grade 9A)', note: 'Outstanding leadership as Junior Class Prefect and Mathematics Olympiad final qualifier.', date: 'Week 10' },
              { type: 'Commendation', student: 'Natasha Mulenga (Grade 9A)', note: 'Awarded 1st place in Inter-School Science Fair (Water Purification Innovation).', date: 'Week 9' },
            ].map((c, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {c.type} &bull; {c.date}
                </span>
                <h4 className="text-xs font-bold text-slate-950 mt-1">{c.student}</h4>
                <p className="text-xs text-slate-700 leading-relaxed italic">&ldquo;{c.note}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
