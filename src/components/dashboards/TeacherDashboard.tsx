import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Save,
  Send,
  Sparkles,
  Calendar,
  Clock,
  Award,
  Users,
  Search,
  Check,
  X,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Video,
  MessageSquare,
  Radio
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AssessmentType, ScoreItem, AttendanceStatus } from '../../types';
import { calculateEczGrade } from '../../mockData';
import { TeacherExcelStudio } from '../tools/TeacherExcelStudio';
import { TeacherWordStudio } from '../tools/TeacherWordStudio';
import { ZoomClassroomHub } from '../zoom/ZoomClassroomHub';
import { StudentTeacherChatModal } from '../communication/StudentTeacherChatModal';
import { TeacherDutyRegister } from './TeacherDutyRegister';
import { TeacherTeachingTrendChart } from './TeacherTeachingTrendChart';
import { SmartStudyNotesMaker } from '../tools/SmartStudyNotesMaker';
import { CampusStoriesTray } from '../social/CampusStoriesTray';
import { SchoolGroupsHub } from '../groups/SchoolGroupsHub';
import { FinancePublishingStudio } from '../finance/FinancePublishingStudio';
import { ZambianCalendarBanner } from '../common/ZambianCalendarBanner';
import { GeminiChatbotStudio } from '../tools/GeminiChatbotStudio';
import { TrendingUp, DollarSign, Layers } from 'lucide-react';

interface TeacherDashboardProps {
  onViewReportCard: (reportCardId: string) => void;
  onOpenProfile?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onViewReportCard,
  onOpenProfile,
}) => {
  const {
    currentSchool,
    currentUser,
    allUsers,
    assessments,
    saveAssessment,
    submitAssessment,
    recordAttendance,
    announcements,
    startInstantZoomClass
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'duty_register' | 'weekly_trend' | 'notes' | 'ai_chatbot' | 'groups' | 'finance' | 'gradebook' | 'zoom' | 'excel' | 'word' | 'attendance' | 'homework' | 'ai_remarks'>('duty_register');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Teacher assigned classes & subjects
  const teacherClasses = currentSchool.classes;
  const teacherSubjects = currentSchool.subjects;

  const [selectedClassId, setSelectedClassId] = useState<string>(teacherClasses[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(teacherSubjects[0]?.id || '');
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<AssessmentType>('test_1');
  const [maxScore, setMaxScore] = useState<number>(20);

  // Active students in selected class
  const classStudents = allUsers.filter(
    (u) => u.schoolId === currentSchool.id && u.role === 'student' && u.studentProfile?.classId === selectedClassId
  );

  // Score editing state: Map studentId -> { rawScore, remarks }
  const [scoresState, setScoresState] = useState<Record<string, { raw: number; remarks: string }>>({
    usr_stu_1: { raw: 18, remarks: 'Demonstrates exceptional grasp of algebraic expressions.' },
    usr_stu_2: { raw: 19, remarks: 'Outstanding problem solving and immaculate working.' },
    usr_stu_3: { raw: 17, remarks: 'Very good analytical skills and consistent diligence.' },
  });

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({
    usr_stu_1: 'present',
    usr_stu_2: 'present',
    usr_stu_3: 'present',
  });

  // AI Remarks State
  const [aiStudentName, setAiStudentName] = useState('Mubita Mweemba');
  const [aiScore, setAiScore] = useState(88);
  const [aiSubject, setAiSubject] = useState('Mathematics');
  const [aiRemarksOutput, setAiRemarksOutput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Current selected class and subject objects
  const selectedClass = currentSchool.classes.find((c) => c.id === selectedClassId) || currentSchool.classes[0];
  const selectedSubject = currentSchool.subjects.find((s) => s.id === selectedSubjectId) || currentSchool.subjects[0];

  const handleScoreChange = (studentId: string, value: number) => {
    setScoresState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        raw: value,
        remarks: prev[studentId]?.remarks || '',
      },
    }));
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setScoresState((prev) => ({
      ...prev,
      [studentId]: {
        raw: prev[studentId]?.raw || 0,
        remarks,
      },
    }));
  };

  const handleSaveDraft = () => {
    const scores: ScoreItem[] = classStudents.map((st) => {
      const raw = scoresState[st.id]?.raw ?? 18;
      const pct = Math.round((raw / maxScore) * 100);
      return {
        studentId: st.id,
        studentName: st.fullName,
        studentNumber: st.studentProfile?.studentNumber || '',
        rawScore: raw,
        maxScore,
        percentage: pct,
        remarks: scoresState[st.id]?.remarks || 'Good progress shown this term.',
      };
    });

    const assId = `ass_${selectedClassId}_${selectedSubjectId}_${selectedAssessmentType}`;

    saveAssessment({
      id: assId,
      schoolId: currentSchool.id,
      academicYear: currentSchool.academicYear,
      termId: currentSchool.activeTerm,
      classId: selectedClassId,
      className: selectedClass?.name || 'Class',
      subjectId: selectedSubjectId,
      subjectName: selectedSubject?.name || 'Subject',
      teacherId: currentUser.id,
      teacherName: currentUser.fullName,
      type: selectedAssessmentType,
      title: `${selectedSubject?.name} - ${selectedAssessmentType.replace('_', ' ').toUpperCase()} (Week ${
        selectedAssessmentType === 'test_1' ? 4 : selectedAssessmentType === 'test_2' ? 8 : 12
      })`,
      maxScore,
      date: new Date().toISOString().split('T')[0],
      weekNumber: selectedAssessmentType === 'test_1' ? 4 : selectedAssessmentType === 'test_2' ? 8 : 12,
      scores,
      status: 'draft',
      isLocked: false,
    });

    alert('Assessment scores draft saved successfully!');
  };

  const handleSubmitToHeadTeacher = () => {
    handleSaveDraft();
    const assId = `ass_${selectedClassId}_${selectedSubjectId}_${selectedAssessmentType}`;
    submitAssessment(assId);
    alert('Assessment submitted to the Head Teacher for official approval and locking!');
  };

  const handleSaveAttendance = () => {
    const entries = Object.entries(attendanceState).map(([studentId, status]) => {
      const st = classStudents.find((s) => s.id === studentId);
      return {
        studentId,
        studentName: st?.fullName || 'Student',
        studentNumber: st?.studentProfile?.studentNumber || '',
        status: status as AttendanceStatus,
      };
    });

    recordAttendance({
      id: `att_${Date.now()}_${selectedClassId}`,
      schoolId: currentSchool.id,
      classId: selectedClassId,
      className: selectedClass?.name || 'Class',
      date: attendanceDate,
      termId: currentSchool.activeTerm,
      academicYear: currentSchool.academicYear,
      recordedByTeacherId: currentUser.id,
      recordedByTeacherName: currentUser.fullName,
      entries,
    });

    alert(`Attendance for ${selectedClass?.name} on ${attendanceDate} saved. Absent alerts sent to parents.`);
  };

  const handleGenerateAiRemark = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate-remarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: aiStudentName,
          subject: aiSubject,
          score: aiScore,
          strengths: 'Analytical reasoning, consistent homework completion',
          growthAreas: 'Speed during timed tests, complex geometry diagrams',
        }),
      });
      const data = await res.json();
      setAiRemarksOutput(data.remarks || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Zambian Ministry of Education Calendar Engine */}
      <ZambianCalendarBanner />

      {/* Teacher Profile Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 text-white shadow-lg border border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xl shadow-inner">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Teacher Faculty Portal
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentUser.teacherProfile?.employeeNumber || 'FACULTY-01'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-0.5 text-white">{currentUser.fullName}</h1>
              <p className="text-xs text-slate-300 mt-1">
                {currentUser.teacherProfile?.qualification || 'BSc. Education'} &bull; {currentSchool.name}
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
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Edit Teacher Profile</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('notes')}
              className="px-3.5 py-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Notes Maker</span>
            </button>
            <button
              onClick={() => setActiveTab('duty_register')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-emerald-200" />
              <span>Duty & Knock-Off Register</span>
            </button>
            <button
              onClick={() => setActiveTab('zoom')}
              className="px-3.5 py-2 bg-[#2D8CFF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Video className="w-4 h-4 text-white" />
              <span>Zoom Classroom</span>
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-600 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Student Inquiries</span>
            </button>
            <button
              onClick={() => setActiveTab('excel')}
              className="px-3.5 py-2 bg-[#107C41] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-900/20 transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Excel Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('word')}
              className="px-3.5 py-2 bg-[#2B579A] hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-900/20 transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-blue-200" />
              <span>Word Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('gradebook')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-600"
            >
              <Award className="w-4 h-4" />
              <span>C.A. Gradebook</span>
            </button>
          </div>
        </div>
      </div>

      {/* CAMPUS SOCIAL STORIES TRAY (FACEBOOK-STYLE) */}
      <CampusStoriesTray />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 pb-1 overflow-x-auto">
        {[
          { id: 'duty_register', label: 'Daily Duty & Classes Taught Register', icon: <Calendar className="w-4 h-4 text-emerald-600" />, badge: 'Check-In / Knock-Off' },
          { id: 'weekly_trend', label: 'Teaching Trends & Register Analytics', icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, badge: 'Recharts' },
          { id: 'ai_chatbot', label: 'Gemini AI Assistant', icon: <Sparkles className="w-4 h-4 text-teal-600" />, badge: 'Search & Maps' },
          { id: 'notes', label: 'Smart Study Notes Maker', icon: <Sparkles className="w-4 h-4 text-indigo-600" />, badge: 'Claude-Level' },
          { id: 'groups', label: 'Class & Grade Groups & PTA', icon: <Layers className="w-4 h-4 text-purple-600" />, badge: 'Communities' },
          { id: 'finance', label: 'Finance Publications', icon: <DollarSign className="w-4 h-4 text-amber-600" />, badge: currentUser.isFinanceTeam ? 'Finance Team' : 'Notices' },
          { id: 'gradebook', label: 'Continuous Assessment Gradebook', icon: <Award className="w-4 h-4" /> },
          { id: 'zoom', label: 'Zoom Virtual Classroom', icon: <Video className="w-4 h-4 text-[#2D8CFF]" />, badge: 'Live Video' },
          { id: 'excel', label: 'Microsoft Excel (Marksheet & Analytics)', icon: <FileSpreadsheet className="w-4 h-4 text-[#107C41]" />, badge: 'Excel Studio' },
          { id: 'word', label: 'Microsoft Word (Lesson Plans & Exams)', icon: <FileText className="w-4 h-4 text-[#2B579A]" />, badge: 'Word Studio' },
          { id: 'attendance', label: 'Student Class Register', icon: <Users className="w-4 h-4" /> },
          { id: 'ai_remarks', label: 'AI Remarks Assistant', icon: <Sparkles className="w-4 h-4 text-emerald-600" /> },
          { id: 'homework', label: 'Assignments & Syllabus Tasks', icon: <BookOpen className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
              activeTab === tab.id
                ? tab.id === 'ai_chatbot'
                  ? 'bg-teal-600 text-white shadow-md font-extrabold'
                  : tab.id === 'notes'
                  ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs font-extrabold'
                  : tab.id === 'groups'
                  ? 'bg-purple-50 text-purple-800 border border-purple-300 shadow-2xs font-extrabold'
                  : tab.id === 'finance'
                  ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs font-extrabold'
                  : tab.id === 'duty_register'
                  ? 'bg-emerald-600 text-white shadow-md font-extrabold'
                  : tab.id === 'weekly_trend'
                  ? 'bg-emerald-600 text-white shadow-md font-extrabold'
                  : tab.id === 'zoom'
                  ? 'bg-blue-50 text-[#2D8CFF] border border-blue-300 shadow-2xs font-extrabold'
                  : tab.id === 'excel'
                  ? 'bg-emerald-50 text-[#107C41] border border-emerald-300 shadow-2xs font-extrabold'
                  : tab.id === 'word'
                  ? 'bg-blue-50 text-[#2B579A] border border-blue-300 shadow-2xs font-extrabold'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                tab.id === 'ai_chatbot' ? 'bg-white/20 text-white' : tab.id === 'notes' ? 'bg-indigo-600 text-white' : tab.id === 'groups' ? 'bg-purple-600 text-white' : tab.id === 'finance' ? 'bg-amber-600 text-white' : tab.id === 'duty_register' || tab.id === 'weekly_trend' ? 'bg-white/20 text-white' : tab.id === 'zoom' ? 'bg-[#2D8CFF] text-white' : tab.id === 'excel' ? 'bg-[#107C41] text-white' : 'bg-[#2B579A] text-white'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB: GEMINI AI CHATBOT STUDIO */}
      {activeTab === 'ai_chatbot' && (
        <div className="h-[750px] rounded-2xl overflow-hidden shadow-sm">
          <GeminiChatbotStudio initialRole="moe_ecz_curriculum" />
        </div>
      )}

      {/* TAB: GROUPS & PTA COMMUNITIES */}
      {activeTab === 'groups' && (
        <SchoolGroupsHub />
      )}

      {/* TAB: FINANCE PUBLISHING STUDIO */}
      {activeTab === 'finance' && (
        <FinancePublishingStudio />
      )}

      {/* TAB: SMART STUDY NOTES MAKER */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <SmartStudyNotesMaker />
        </div>
      )}

      {/* TAB: DAILY DUTY & CLASSES TAUGHT REGISTER */}
      {activeTab === 'duty_register' && (
        <TeacherDutyRegister />
      )}

      {/* TAB: TEACHING TRENDS & REGISTER ANALYTICS (RECHARTS) */}
      {activeTab === 'weekly_trend' && (
        <TeacherTeachingTrendChart />
      )}

      {/* TAB: ZOOM VIRTUAL CLASSROOM */}
      {activeTab === 'zoom' && (
        <ZoomClassroomHub
          onOpenDirectMessageWithTeacher={(teacherId) => {
            setIsChatOpen(true);
          }}
        />
      )}

      {/* TAB: MICROSOFT EXCEL STUDIO */}
      {activeTab === 'excel' && (
        <div className="space-y-4">
          <TeacherExcelStudio />
        </div>
      )}

      {/* TAB: MICROSOFT WORD STUDIO */}
      {activeTab === 'word' && (
        <div className="space-y-4">
          <TeacherWordStudio />
        </div>
      )}

      {/* TAB 1: CONTINUOUS ASSESSMENT GRADEBOOK */}
      {activeTab === 'gradebook' && (
        <div className="space-y-4">
          {/* Class, Subject & Test Selection Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500"
              >
                {teacherClasses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500"
              >
                {teacherSubjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Assessment Milestone</label>
              <select
                value={selectedAssessmentType}
                onChange={(e) => {
                  const val = e.target.value as AssessmentType;
                  setSelectedAssessmentType(val);
                  setMaxScore(val === 'examination' ? 100 : 20);
                }}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="test_1">Test 1 (Week 4 - C.A.)</option>
                <option value="test_2">Test 2 (Week 8 - C.A.)</option>
                <option value="test_3">Test 3 (Week 12 - C.A.)</option>
                <option value="assignment">Assignment / Project</option>
                <option value="examination">Final Term Examination</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Max Score</label>
              <input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Student Scores Entry Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedClass?.name} &bull; {selectedSubject?.name} Score Entry
                </h3>
                <p className="text-xs text-slate-500">
                  Enter raw score out of {maxScore}. System automatically calculates ECZ grade and points.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmitToHeadTeacher}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Head Teacher</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Student No.</th>
                    <th className="p-3 text-center">Raw Score (/{maxScore})</th>
                    <th className="p-3 text-center">Calculated %</th>
                    <th className="p-3 text-center">ECZ Grade</th>
                    <th className="p-3 text-center">Points</th>
                    <th className="p-3">Constructive Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {classStudents.map((st) => {
                    const raw = scoresState[st.id]?.raw ?? 18;
                    const pct = Math.min(100, Math.round((raw / maxScore) * 100));
                    const ecz = calculateEczGrade(pct);
                    const remarks = scoresState[st.id]?.remarks || 'Consistent performance and active class participation.';

                    return (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-950 flex items-center gap-2">
                          <img src={st.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                          <span>{st.fullName}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{st.studentProfile?.studentNumber}</td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={maxScore}
                            value={raw}
                            onChange={(e) => handleScoreChange(st.id, Number(e.target.value))}
                            className="w-16 px-2 py-1 border border-slate-300 rounded font-bold font-mono text-center text-xs focus:ring-2 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="p-3 text-center font-bold font-mono text-emerald-900 bg-emerald-50/50">
                          {pct}%
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded font-black text-xs bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Grade {ecz.eczGrade}
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono font-black text-slate-900">{ecz.points}</td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={remarks}
                            onChange={(e) => handleRemarkChange(st.id, e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-emerald-500"
                            placeholder="Enter teacher remark..."
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAILY ATTENDANCE REGISTER */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Class Attendance Roll Call</h3>
              <p className="text-xs text-slate-500">
                Mark daily attendance. Parents receive automatic SMS/In-app alerts when a student is marked Absent.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium"
              />
              <button
                onClick={handleSaveAttendance}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Submit Attendance & Notify</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {classStudents.map((st) => {
              const currentStatus = attendanceState[st.id] || 'present';

              return (
                <div key={st.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img src={st.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{st.fullName}</h4>
                      <p className="text-[11px] font-mono text-slate-500">{st.studentProfile?.studentNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 pt-1">
                    {[
                      { s: 'present', label: 'Present', color: 'bg-emerald-600 text-white' },
                      { s: 'absent', label: 'Absent', color: 'bg-red-600 text-white' },
                      { s: 'late', label: 'Late', color: 'bg-amber-500 text-white' },
                      { s: 'excused', label: 'Excused', color: 'bg-blue-600 text-white' },
                    ].map((btn) => (
                      <button
                        key={btn.s}
                        type="button"
                        onClick={() =>
                          setAttendanceState((prev) => ({
                            ...prev,
                            [st.id]: btn.s as any,
                          }))
                        }
                        className={`py-1 rounded text-[10px] font-bold transition border ${
                          currentStatus === btn.s
                            ? btn.color + ' border-transparent'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: AI REMARKS ASSISTANT */}
      {activeTab === 'ai_remarks' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">AI Teacher Remarks Assistant</h3>
            </div>
            <p className="text-xs text-slate-500">
              Generate constructive, encouraging, and pedagogically sound ECZ report card remarks in seconds.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={aiStudentName}
                  onChange={(e) => setAiStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Percentage Score (%)</label>
                  <input
                    type="number"
                    value={aiScore}
                    onChange={(e) => setAiScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateAiRemark}
                disabled={isAiLoading}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAiLoading ? 'Generating Remark...' : 'Generate ECZ Remark'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Generated Report Card Remark
              </h4>
              <textarea
                rows={8}
                value={aiRemarksOutput || 'Generated constructive remark will appear here...'}
                onChange={(e) => setAiRemarksOutput(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl text-xs text-slate-800 leading-relaxed font-sans"
              />
            </div>

            <button
              onClick={() => {
                alert('Copied to gradebook remarks clipboard!');
              }}
              disabled={!aiRemarksOutput}
              className="py-2 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold transition"
            >
              Use in Active Gradebook
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: ASSIGNMENTS & HOMEWORK */}
      {activeTab === 'homework' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Term 1 Assignments & Syllabus Tasks</h3>
            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
              3 Active Tasks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Algebraic Quadratic Equations Assignment', subject: 'Mathematics', class: 'Grade 9A', due: 'Week 5 Friday', points: '20 Marks' },
              { title: 'Newtonian Dynamics & Friction Lab Report', subject: 'Physics (Pure)', class: 'Grade 11 Science', due: 'Week 9 Monday', points: '25 Marks' },
              { title: 'Zambian Constitution & Governance Essay', subject: 'Civic Education', class: 'Grade 10A', due: 'Week 11 Wednesday', points: '20 Marks' },
            ].map((hw, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-[10px] font-bold uppercase text-emerald-700">{hw.subject} &bull; {hw.class}</span>
                <h4 className="text-xs font-bold text-slate-900">{hw.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>Due: {hw.due}</span>
                  <span className="font-bold text-slate-800">{hw.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDENT-TEACHER INQUIRIES & CHAT MODAL */}
      <StudentTeacherChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onLaunchInstantZoomWithTeacher={(studentName) => {
          setActiveTab('zoom');
          setIsChatOpen(false);
        }}
      />
    </div>
  );
};
