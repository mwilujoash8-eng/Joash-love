import React, { useState } from 'react';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  Play,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Search,
  BookOpen,
  Radio,
  FileVideo,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ZoomMeeting } from '../../types';
import { ZoomMeetingRoomModal } from './ZoomMeetingRoomModal';

interface ZoomClassroomHubProps {
  onOpenDirectMessageWithTeacher?: (teacherId: string, teacherName: string, subjectName: string) => void;
}

export const ZoomClassroomHub: React.FC<ZoomClassroomHubProps> = ({ onOpenDirectMessageWithTeacher }) => {
  const {
    currentSchool,
    currentUser,
    zoomMeetings,
    scheduleZoomMeeting,
    startInstantZoomClass,
    joinZoomMeeting,
    activeLiveMeeting,
    leaveZoomMeeting
  } = useSchool();

  const isTeacherOrAdmin = currentUser.role === 'teacher' || currentUser.role === 'head_teacher' || currentUser.role === 'deputy_head_teacher';

  const [activeModalMeeting, setActiveModalMeeting] = useState<ZoomMeeting | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isInstantLaunchOpen, setIsInstantLaunchOpen] = useState(false);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickMeetingId, setQuickMeetingId] = useState('');

  // Instant Launch Form State
  const [instantGrade, setInstantGrade] = useState('Grade 9');
  const [instantClass, setInstantClass] = useState(currentSchool.classes[0]?.name || 'Grade 9A');
  const [instantSubject, setInstantSubject] = useState(currentSchool.subjects[0]?.name || 'Mathematics');
  const [instantTopic, setInstantTopic] = useState('Solving Simultaneous Linear Equations & Problem Solving');
  const [instantAiModel, setInstantAiModel] = useState('gemini-3.7-flash');
  const [instantEducationMode, setInstantEducationMode] = useState('interactive_tutor');
  const [instantObjective, setInstantObjective] = useState('Master step-by-step elimination method and verification with Dr. Mwape AI Co-Teacher.');

  // Schedule Form State
  const [scheduleGrade, setScheduleGrade] = useState('Grade 9');
  const [scheduleTopic, setScheduleTopic] = useState('');
  const [scheduleSubject, setScheduleSubject] = useState(currentSchool.subjects[0]?.name || 'Mathematics');
  const [scheduleClass, setScheduleClass] = useState(currentSchool.classes[0]?.name || 'Grade 9A');
  const [scheduleDate, setScheduleDate] = useState('2026-08-28T09:00');
  const [scheduleDuration, setScheduleDuration] = useState(45);
  const [scheduleObjective, setScheduleObjective] = useState('');
  const [scheduleAiModel, setScheduleAiModel] = useState('gemini-3.7-flash');
  const [scheduleEducationMode, setScheduleEducationMode] = useState('interactive_tutor');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Topic presets generator
  const getTopicPresets = (subject: string, grade: string) => {
    if (subject.toLowerCase().includes('math')) {
      return [
        'Solving Simultaneous Equations & Elimination Method',
        'Quadratic Functions: Turning Points & Vertex Coordinates',
        'Matrices: Inverse of 2x2 and Solving Matrix Equations',
        'Circle Theorems: Angles at Center & Cyclic Quadrilaterals',
        'Calculus: Differentiation from First Principles'
      ];
    } else if (subject.toLowerCase().includes('sci') || subject.toLowerCase().includes('phys') || subject.toLowerCase().includes('chem') || subject.toLowerCase().includes('bio')) {
      return [
        'Cell Division: Mitosis vs Meiosis Stages',
        'Chemical Bonding: Ionic, Covalent & Metallic Lattice',
        'Newton\'s Laws of Motion & Momentum Calculations',
        'Photosynthesis: Light-Dependent and Calvin Reactions',
        'Acids, Bases, and Salts: Titration Calculations'
      ];
    } else if (subject.toLowerCase().includes('eng')) {
      return [
        'Summary Writing & Note-Taking for ECZ Paper 2',
        'Report Writing: Structure, Formal Register and Sign-Off',
        'Direct & Indirect Speech Transformations',
        'Comprehension Analysis & Contextual Clues'
      ];
    } else {
      return [
        'Civic Responsibility & Democratic Governance',
        'Agricultural Crop Management & Soil Fertility',
        'Computer Studies: Algorithms & Flowcharts',
        'Commerce: International Trade and Balance of Payments'
      ];
    }
  };

  const filteredMeetings = zoomMeetings.filter(m => {
    const matchesClass = filterClass === 'all' || m.className.toLowerCase().includes(filterClass.toLowerCase());
    const matchesSearch = m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.hostTeacherName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const liveMeetings = filteredMeetings.filter(m => m.status === 'live');
  const upcomingMeetings = filteredMeetings.filter(m => m.status === 'upcoming');
  const recordedMeetings = filteredMeetings.filter(m => m.status === 'ended');

  const handleOpenInstantSetup = () => {
    setIsInstantLaunchOpen(true);
  };

  const handleConfirmInstantClass = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = instantTopic.trim() || `${instantGrade} ${instantSubject} - Live Interactive Session`;
    const newLive = startInstantZoomClass(
      finalTopic,
      instantSubject,
      instantClass,
      instantGrade,
      instantAiModel,
      instantEducationMode,
      instantObjective
    );
    setIsInstantLaunchOpen(false);
    setActiveModalMeeting(newLive);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTopic.trim()) return;

    const newMeeting = scheduleZoomMeeting({
      schoolId: currentSchool.id,
      topic: scheduleTopic.trim(),
      grade: scheduleGrade,
      subjectId: 'sub_dyn',
      subjectName: scheduleSubject,
      classId: 'cls_dyn',
      className: scheduleClass,
      aiModel: scheduleAiModel,
      educationMode: scheduleEducationMode,
      hostTeacherId: currentUser.id,
      hostTeacherName: currentUser.fullName,
      hostAvatar: currentUser.avatarUrl,
      meetingId: '',
      passcode: 'ECZ' + Math.floor(1000 + Math.random() * 9000),
      startTime: new Date(scheduleDate).toISOString(),
      durationMinutes: scheduleDuration,
      status: 'upcoming',
      joinUrl: '',
      lessonObjective: scheduleObjective || 'Continuous assessment revision and interactive curriculum delivery.',
      curriculumCode: `ECZ-${scheduleSubject.slice(0, 3).toUpperCase()}-2026`,
      attendeesCount: 30,
    });

    setIsScheduleOpen(false);
    setScheduleTopic('');
    setScheduleObjective('');
  };

  const handleCopyMeetingInfo = (meeting: ZoomMeeting) => {
    navigator.clipboard.writeText(`Zoom Meeting: ${meeting.topic}\nMeeting ID: ${meeting.meetingId}\nPasscode: ${meeting.passcode}\nJoin URL: ${meeting.joinUrl}`);
    setCopiedId(meeting.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleJoinByInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMeetingId.trim()) return;
    const clean = quickMeetingId.replace(/\s+/g, '');
    const found = zoomMeetings.find(m => m.meetingId.replace(/\s+/g, '') === clean);
    if (found) {
      setActiveModalMeeting(found);
    } else {
      // Create temporary viewer session
      const tempMeeting: ZoomMeeting = {
        id: 'zm_join_' + Date.now(),
        schoolId: currentSchool.id,
        topic: `Live Classroom (ID: ${quickMeetingId})`,
        subjectId: 'sub_live',
        subjectName: 'Live Subject Stream',
        classId: 'cls_live',
        className: 'General Session',
        hostTeacherId: 'host_teacher',
        hostTeacherName: 'Instructor Host',
        meetingId: quickMeetingId,
        passcode: 'JOIN2026',
        startTime: new Date().toISOString(),
        durationMinutes: 45,
        status: 'live',
        joinUrl: `https://zoom.us/j/${clean}`,
        lessonObjective: 'Direct student video connection.',
        attendeesCount: 24,
      };
      setActiveModalMeeting(tempMeeting);
    }
  };

  return (
    <div className="space-y-6">
      {/* ZOOM HEADER HERO */}
      <div className="bg-gradient-to-r from-[#1A1E29] to-[#0F172A] rounded-2xl p-6 text-white border border-slate-700/80 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-[#2D8CFF] text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                <Video className="w-3.5 h-3.5" />
                Zoom for Education
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                Official MoE & ECZ Hybrid Learning Node
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Virtual Classroom & Video Office Hours
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Connect students and teachers through HD virtual lessons, interactive math & science whiteboards, and private academic consultation sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isTeacherOrAdmin && (
              <>
                <button
                  onClick={handleOpenInstantSetup}
                  className="px-4 py-2.5 bg-[#2D8CFF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/30 transition flex items-center gap-2 cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-white animate-pulse" />
                  <span>Start Instant Zoom Class</span>
                </button>

                <button
                  onClick={() => setIsScheduleOpen(true)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Schedule Class</span>
                </button>
              </>
            )}

            {!isTeacherOrAdmin && (
              <form onSubmit={handleJoinByInput} className="flex items-center gap-2">
                <input
                  type="text"
                  value={quickMeetingId}
                  onChange={(e) => setQuickMeetingId(e.target.value)}
                  placeholder="Enter Meeting ID..."
                  className="bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2D8CFF] w-36 sm:w-44"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#2D8CFF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                >
                  <span>Join</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic, teacher, subject..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Classes</option>
            {currentSchool.classes.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {liveMeetings.length} Live Now
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            {upcomingMeetings.length} Upcoming
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5 font-medium">
            <FileVideo className="w-3.5 h-3.5 text-blue-600" />
            {recordedMeetings.length} Recorded
          </span>
        </div>
      </div>

      {/* SECTION 1: LIVE MEETINGS NOW */}
      {liveMeetings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Happening Right Now (Join In Progress)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white rounded-2xl border-2 border-red-500/30 p-5 shadow-md flex flex-col justify-between hover:border-red-500 transition relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> LIVE CLASSROOM
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        {meeting.className}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-slate-500">
                      ID: {meeting.meetingId}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {meeting.topic}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {meeting.lessonObjective}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <img
                        src={meeting.hostAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80'}
                        alt={meeting.hostTeacherName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-medium text-slate-800">{meeting.hostTeacherName}</span>
                    </div>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {meeting.attendeesCount} Students Connected
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalMeeting(meeting)}
                    className="flex-1 py-2.5 bg-[#2D8CFF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Enter Live Classroom</span>
                  </button>

                  <button
                    onClick={() => handleCopyMeetingInfo(meeting)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition border border-slate-200"
                    title="Copy Meeting Link & Passcode"
                  >
                    {copiedId === meeting.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: SCHEDULED & UPCOMING CLASSES */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          Scheduled Virtual Classes & Office Hours
        </h2>

        {upcomingMeetings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
            No upcoming Zoom sessions matching your current filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-mono">
                      {meeting.subjectName}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {meeting.className}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                    {meeting.topic}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {meeting.lessonObjective}
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(meeting.startTime).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} ({meeting.durationMinutes} mins)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        src={meeting.hostAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80'}
                        alt={meeting.hostTeacherName}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="truncate">{meeting.hostTeacherName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalMeeting(meeting)}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Launch / Join</span>
                  </button>

                  <button
                    onClick={() => handleCopyMeetingInfo(meeting)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition border border-slate-200"
                    title="Copy Meeting Details"
                  >
                    {copiedId === meeting.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: RECORDED LESSON ARCHIVE */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileVideo className="w-4 h-4 text-blue-600" />
          ECZ Digital Lesson Library & Past Class Recordings
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="divide-y divide-slate-100">
            {recordedMeetings.map((rec) => (
              <div key={rec.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Play className="w-5 h-5 fill-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                        {rec.subjectName}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {rec.className} &bull; Recorded on {new Date(rec.startTime).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{rec.topic}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{rec.lessonObjective}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveModalMeeting(rec)}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-200"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Watch Recording</span>
                  </button>

                  <a
                    href={rec.recordingUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition border border-slate-200"
                    title="Open in Zoom Cloud"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INSTANT ZOOM CLASS SETUP MODAL */}
      {isInstantLaunchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#2D8CFF] rounded-xl shadow-md">
                  <Radio className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Start Instant Zoom Classroom</h3>
                    <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-400/40 px-2 py-0.5 rounded-full font-bold">
                      AI Co-Teacher Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">Configure Grade, Class, Subject & Pedagogical AI Model</p>
                </div>
              </div>
              <button
                onClick={() => setIsInstantLaunchOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmInstantClass} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* 1. GRADE & CLASS SELECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grade Level</label>
                  <select
                    value={instantGrade}
                    onChange={(e) => setInstantGrade(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2D8CFF] bg-slate-50 font-medium"
                  >
                    {['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'GCE / Form 6'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Class Stream</label>
                  <select
                    value={instantClass}
                    onChange={(e) => setInstantClass(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2D8CFF] bg-slate-50 font-medium"
                  >
                    {currentSchool.classes.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. SUBJECT SELECTION */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Subject</label>
                <select
                  value={instantSubject}
                  onChange={(e) => {
                    const newSub = e.target.value;
                    setInstantSubject(newSub);
                    const presets = getTopicPresets(newSub, instantGrade);
                    if (presets.length > 0) {
                      setInstantTopic(presets[0]);
                    }
                  }}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2D8CFF] bg-slate-50 font-medium"
                >
                  {currentSchool.subjects.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.code || 'ECZ'})</option>
                  ))}
                </select>
              </div>

              {/* 3. LESSON TOPIC & QUICK PRESETS */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Lesson Topic & Module</label>
                  <span className="text-[10px] text-slate-400">Click preset or enter custom</span>
                </div>
                <input
                  type="text"
                  required
                  value={instantTopic}
                  onChange={(e) => setInstantTopic(e.target.value)}
                  placeholder="e.g. Solving Simultaneous Equations & Verification"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2D8CFF] font-medium"
                />

                {/* Quick Topic Preset Pills */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {getTopicPresets(instantSubject, instantGrade).map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setInstantTopic(preset)}
                      className={`text-[10.5px] px-2.5 py-1 rounded-lg border transition text-left cursor-pointer ${
                        instantTopic === preset
                          ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. AI SUB-TEACHER MODEL SELECTION */}
              <div className="bg-purple-50/60 rounded-xl p-3.5 border border-purple-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-purple-950">AI Sub-Teacher (Dr. Mwape) Engine & Models</span>
                  </div>
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    5 Models Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">AI Engine Model</label>
                    <select
                      value={instantAiModel}
                      onChange={(e) => setInstantAiModel(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 rounded-lg border border-purple-200 bg-white font-medium focus:outline-none"
                    >
                      <option value="gemini-3.7-flash">⚡ Gemini 3.7 Flash (High Speed Live Audio)</option>
                      <option value="gemini-3.1-pro-preview">🔬 Gemini 3.1 Pro (Deep STEM & Proofs)</option>
                      <option value="ecz-curriculum-specialist">📋 ECZ Syllabus Specialist</option>
                      <option value="socratic-tutor">💡 Socratic Inquiry Tutor</option>
                      <option value="differentiated-learning">🌱 Differentiated & Remedial Scaffolding</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Pedagogical Mode</label>
                    <select
                      value={instantEducationMode}
                      onChange={(e) => setInstantEducationMode(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 rounded-lg border border-purple-200 bg-white font-medium focus:outline-none"
                    >
                      <option value="interactive_tutor">🤝 Interactive Co-Teacher & Assistant</option>
                      <option value="socratic_dialogic">❓ Socratic Questioning & Inquirer</option>
                      <option value="deep_stem_proofs">📐 Deep Mathematical Proofs & Formulas</option>
                      <option value="ecz_examiner">🎯 Senior ECZ Examiner & Marking Guide</option>
                      <option value="differentiated_remedial">🌟 Remedial Mastery & Visual Scaffolding</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-purple-900 leading-snug">
                  Dr. Mwape will join the Zoom room as an interactive assistant with two-way voice communication, live whiteboard syncing, and instant student answer grading.
                </p>
              </div>

              {/* 5. LESSON OBJECTIVE */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Objective & Syllabus Focus</label>
                <textarea
                  rows={2}
                  value={instantObjective}
                  onChange={(e) => setInstantObjective(e.target.value)}
                  placeholder="Key specific learning outcomes to achieve..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2D8CFF]"
                />
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInstantLaunchOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2D8CFF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition flex items-center gap-2 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Launch Live Classroom Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE CLASS MODAL */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#2D8CFF] rounded-lg">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Schedule Virtual Zoom Classroom</h3>
                  <p className="text-xs text-slate-400">Generate auto Zoom meeting credentials & notify students</p>
                </div>
              </div>
              <button onClick={() => setIsScheduleOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Topic & Subject Module</label>
                <input
                  type="text"
                  required
                  value={scheduleTopic}
                  onChange={(e) => setScheduleTopic(e.target.value)}
                  placeholder="e.g. Grade 9 Mathematics: Solving Simultaneous Equations"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#2D8CFF]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grade</label>
                  <select
                    value={scheduleGrade}
                    onChange={(e) => setScheduleGrade(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none font-medium"
                  >
                    {['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'GCE / Form 6'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={scheduleSubject}
                    onChange={(e) => setScheduleSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none font-medium"
                  >
                    {currentSchool.subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={scheduleClass}
                    onChange={(e) => setScheduleClass(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none font-medium"
                  >
                    {currentSchool.classes.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">AI Model Engine</label>
                  <select
                    value={scheduleAiModel}
                    onChange={(e) => setScheduleAiModel(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                  >
                    <option value="gemini-3.7-flash">Gemini 3.7 Flash</option>
                    <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (STEM)</option>
                    <option value="ecz-curriculum-specialist">ECZ Specialist</option>
                    <option value="socratic-tutor">Socratic Tutor</option>
                    <option value="differentiated-learning">Remedial Scaffolding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pedagogical Mode</label>
                  <select
                    value={scheduleEducationMode}
                    onChange={(e) => setScheduleEducationMode(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                  >
                    <option value="interactive_tutor">Interactive Tutor</option>
                    <option value="socratic_dialogic">Socratic Inquiry</option>
                    <option value="deep_stem_proofs">Deep STEM Proofs</option>
                    <option value="ecz_examiner">ECZ Examiner</option>
                    <option value="differentiated_remedial">Remedial Support</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    step="15"
                    value={scheduleDuration}
                    onChange={(e) => setScheduleDuration(parseInt(e.target.value, 10))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ECZ Syllabus Objective & Notes</label>
                <textarea
                  rows={2}
                  value={scheduleObjective}
                  onChange={(e) => setScheduleObjective(e.target.value)}
                  placeholder="Key concepts to cover, expected homework preparation..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2D8CFF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Create Zoom Meeting</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVE ZOOM LIVE MEETING ROOM MODAL */}
      {activeModalMeeting && (
        <ZoomMeetingRoomModal
          meeting={activeModalMeeting}
          onClose={() => {
            setActiveModalMeeting(null);
            leaveZoomMeeting();
          }}
        />
      )}
    </div>
  );
};
