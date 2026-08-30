import React, { useState } from 'react';
import {
  Users,
  Award,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  TrendingUp,
  Download,
  AlertCircle,
  Eye,
  Sparkles,
  Video,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ZoomClassroomHub } from '../zoom/ZoomClassroomHub';
import { StudentTeacherChatModal } from '../communication/StudentTeacherChatModal';
import { SmartStudyNotesMaker } from '../tools/SmartStudyNotesMaker';
import { CampusStoriesTray } from '../social/CampusStoriesTray';
import { SchoolGroupsHub } from '../groups/SchoolGroupsHub';
import { ZambianCalendarBanner } from '../common/ZambianCalendarBanner';
import { GeminiChatbotStudio } from '../tools/GeminiChatbotStudio';
import { Layers } from 'lucide-react';

interface StudentDashboardProps {
  onViewReportCard: (reportCardId: string) => void;
  onOpenProfile?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onViewReportCard,
  onOpenProfile,
}) => {
  const { currentSchool, currentUser, reportCards, announcements, zoomMeetings } = useSchool();
  const [activeTab, setActiveTab] = useState<'results' | 'ai_tutor' | 'notes' | 'groups' | 'zoom' | 'timetable' | 'homework' | 'attendance' | 'notices'>('results');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [preSelectedTeacherId, setPreSelectedTeacherId] = useState<string | undefined>();

  const studentNo = currentUser.studentProfile?.studentNumber || 'STU-2026-0012';
  const myReportCard = reportCards.find((r) => r.studentNumber === studentNo) || reportCards[0];
  const liveClassesCount = zoomMeetings.filter(m => m.status === 'live').length;

  const subjectChartData = myReportCard?.subjectResults.map((sub) => ({
    name: sub.subjectName.split(' ')[0],
    percentage: sub.finalOverallPercentage,
    grade: sub.eczGrade,
  })) || [];

  const timetableData = [
    { period: '07:30 - 08:30', mon: 'Mathematics', tue: 'English Language', wed: 'Integrated Science', thu: 'Mathematics', fri: 'Computer Studies' },
    { period: '08:30 - 09:30', mon: 'English Language', tue: 'Mathematics', wed: 'Geography', thu: 'Civic Education', fri: 'Zambian Language' },
    { period: '09:30 - 10:00', mon: 'Break / Assembly', tue: 'Break', wed: 'Break', thu: 'Break', fri: 'Break / Sports' },
    { period: '10:00 - 11:00', mon: 'Integrated Science', tue: 'Physics (Pure)', wed: 'Mathematics', thu: 'English Language', fri: 'Mathematics' },
    { period: '11:00 - 12:00', mon: 'Computer Studies', tue: 'Chemistry', wed: 'Biology', thu: 'Integrated Science', fri: 'English Language' },
  ];

  return (
    <div className="space-y-6">
      {/* Official Zambian Ministry of Education Calendar Engine */}
      <ZambianCalendarBanner />

      {/* Student Profile Card */}
      <div className="bg-[#1E293B] rounded-2xl p-6 text-white shadow-lg border border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Student Portal
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  {studentNo}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-0.5 text-white">{currentUser.fullName}</h1>
              <p className="text-xs text-slate-300 mt-1">
                {currentUser.studentProfile?.className || 'Grade 9A'} &bull; {currentSchool.name}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('notes')}
              className="px-3.5 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Smart Study Notes Maker</span>
            </button>

            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="px-3.5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Edit Profile</span>
              </button>
            )}

            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-600 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Ask My Teacher</span>
            </button>

            <button
              onClick={() => setActiveTab('zoom')}
              className="px-3.5 py-2.5 bg-[#2D8CFF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4 text-white" />
              <span>Zoom Classes</span>
              {liveClassesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              )}
            </button>

            {myReportCard && (
              <button
                onClick={() => onViewReportCard(myReportCard.id)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>View Report Card</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/80">
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Class Standing</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              {myReportCard?.positionInClass || '2nd'} <span className="text-xs text-slate-400 font-normal">of 38</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Term Average</span>
            <div className="text-xl font-bold text-white mt-0.5">
              {myReportCard?.averagePercentage || 87.3}%
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">ECZ Best 6 Aggregate</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {myReportCard?.aggregatePoints || 6} Points <span className="text-xs text-amber-300 font-normal">Distinction</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Attendance Rate</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              96.9% <span className="text-xs text-slate-300 font-normal">(63/65 days)</span>
            </div>
          </div>
        </div>
      </div>

      {/* CAMPUS SOCIAL STORIES TRAY */}
      <CampusStoriesTray />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 pb-1 overflow-x-auto">
        {[
          { id: 'results', label: 'My Results & C.A. Grades', icon: <Award className="w-4 h-4" /> },
          { id: 'ai_tutor', label: 'Gemini AI STEM Tutor', icon: <Sparkles className="w-4 h-4 text-teal-600" />, badge: 'AI Study Hub' },
          { id: 'notes', label: 'Smart Study Notes Maker', icon: <Sparkles className="w-4 h-4 text-indigo-600" />, badge: 'Claude-Level' },
          { id: 'groups', label: 'Class & Grade Groups & Clubs', icon: <Layers className="w-4 h-4 text-purple-600" />, badge: 'Communities' },
          { id: 'zoom', label: 'Zoom Virtual Classes & Recordings', icon: <Video className="w-4 h-4 text-[#2D8CFF]" />, badge: liveClassesCount > 0 ? `${liveClassesCount} Live` : undefined },
          { id: 'timetable', label: 'Weekly Class Timetable', icon: <Clock className="w-4 h-4" /> },
          { id: 'homework', label: 'Homework & Tasks', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'notices', label: 'School Notices & Events', icon: <FileText className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
              activeTab === tab.id
                ? tab.id === 'ai_tutor'
                  ? 'bg-teal-600 text-white shadow-md font-extrabold'
                  : tab.id === 'notes'
                  ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs font-extrabold'
                  : tab.id === 'groups'
                  ? 'bg-purple-50 text-purple-800 border border-purple-300 shadow-2xs font-extrabold'
                  : tab.id === 'zoom'
                  ? 'bg-blue-50 text-[#2D8CFF] border border-blue-300 shadow-2xs font-extrabold'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${tab.id === 'ai_tutor' ? 'bg-white/20 text-white' : tab.id === 'notes' ? 'bg-indigo-600 text-white' : tab.id === 'groups' ? 'bg-purple-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB: GEMINI AI TUTOR */}
      {activeTab === 'ai_tutor' && (
        <div className="h-[750px] rounded-2xl overflow-hidden shadow-sm">
          <GeminiChatbotStudio initialRole="stem_pro_reasoning" />
        </div>
      )}

      {/* TAB: SMART STUDY NOTES MAKER */}
      {activeTab === 'notes' && (
        <SmartStudyNotesMaker />
      )}

      {/* TAB: GROUPS & CLUBS */}
      {activeTab === 'groups' && (
        <SchoolGroupsHub />
      )}

      {/* TAB: ZOOM VIRTUAL CLASSES */}
      {activeTab === 'zoom' && (
        <ZoomClassroomHub
          onOpenDirectMessageWithTeacher={(teacherId) => {
            setPreSelectedTeacherId(teacherId);
            setIsChatOpen(true);
          }}
        />
      )}

      {/* TAB 1: MY RESULTS & CONTINUOUS ASSESSMENTS */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {/* Performance Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Term 1 Subject Mastery Profile</h3>
                <p className="text-xs text-slate-500">Overall score percentage in each ECZ examination subject</p>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                Distinction Candidate
              </span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="percentage" name="Score (%)" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Continuous Assessment Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Subject Breakdown (Continuous Assessment + Exam)</h3>
              {myReportCard && (
                <button
                  onClick={() => onViewReportCard(myReportCard.id)}
                  className="text-xs text-sky-700 hover:text-sky-800 font-bold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Printable Report Card</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Subject</th>
                    <th className="p-3 text-center">Test 1 (Wk 4)</th>
                    <th className="p-3 text-center">Test 2 (Wk 8)</th>
                    <th className="p-3 text-center">Test 3 (Wk 12)</th>
                    <th className="p-3 text-center">Exam</th>
                    <th className="p-3 text-center">Final %</th>
                    <th className="p-3 text-center">ECZ Grade</th>
                    <th className="p-3 text-center">Points</th>
                    <th className="p-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {myReportCard?.subjectResults.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold">{sub.subjectName}</td>
                      <td className="p-3 text-center font-mono">{sub.test1Score?.raw ?? '-'}/20</td>
                      <td className="p-3 text-center font-mono">{sub.test2Score?.raw ?? '-'}/20</td>
                      <td className="p-3 text-center font-mono">{sub.test3Score?.raw ?? '-'}/20</td>
                      <td className="p-3 text-center font-mono">{sub.examScore?.raw ?? '-'}/100</td>
                      <td className="p-3 text-center font-bold font-mono text-emerald-700">
                        {sub.finalOverallPercentage}%
                      </td>
                      <td className="p-3 text-center font-bold">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                          {sub.eczGrade} ({sub.gradeLabel})
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold">{sub.eczPoints}</td>
                      <td className="p-3 text-slate-500 italic">{sub.teacherRemarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Grade 9A Official Weekly Timetable</h3>
            <span className="text-xs font-mono text-slate-500">Term 1 - 2026 Academic Year</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Time Period</th>
                  <th className="p-3">Monday</th>
                  <th className="p-3">Tuesday</th>
                  <th className="p-3">Wednesday</th>
                  <th className="p-3">Thursday</th>
                  <th className="p-3">Friday</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {timetableData.map((row, idx) => (
                  <tr key={idx} className={idx === 2 ? 'bg-amber-50/50 font-bold' : 'hover:bg-slate-50'}>
                    <td className="p-3 font-mono font-semibold text-slate-600">{row.period}</td>
                    <td className="p-3">{row.mon}</td>
                    <td className="p-3">{row.tue}</td>
                    <td className="p-3">{row.wed}</td>
                    <td className="p-3">{row.thu}</td>
                    <td className="p-3">{row.fri}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: HOMEWORK */}
      {activeTab === 'homework' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Upcoming Assignments & Homework</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { subject: 'Mathematics', title: 'Quadratic Equations Practice 5.2', due: 'Friday Week 5', status: 'Submitted', score: '18/20' },
              { subject: 'Integrated Science', title: 'Plant Reproduction and Photosynthesis Diagram', due: 'Monday Week 6', status: 'Pending', score: '-' },
              { subject: 'Computer Studies', title: 'Spreadsheet Formulas & Boolean Logic Exercise', due: 'Thursday Week 7', status: 'Submitted', score: '20/20' },
            ].map((hw, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-sky-700">{hw.subject}</span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{hw.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Due Date: {hw.due}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded font-bold ${hw.status === 'Submitted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {hw.status}
                  </span>
                  <span className="font-mono font-bold text-slate-700">{hw.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCHOOL NOTICES */}
      {activeTab === 'notices' && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">School Notices & Announcements</h3>
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{ann.title}</span>
                <span className="text-[10px] text-slate-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{ann.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* STUDENT-TEACHER INQUIRIES & CHAT MODAL */}
      <StudentTeacherChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        preSelectedTeacherId={preSelectedTeacherId}
        onLaunchInstantZoomWithTeacher={(teacherName, subjectName) => {
          setActiveTab('zoom');
          setIsChatOpen(false);
        }}
      />
    </div>
  );
};
