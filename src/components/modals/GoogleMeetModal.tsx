import React, { useState, useEffect } from 'react';
import {
  X,
  Video,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Users,
  Calendar,
  Sparkles,
  Clock,
  BookOpen,
  LogOut,
  ShieldCheck,
  Radio,
  ArrowRight,
  Share2,
} from 'lucide-react';
import {
  createGoogleMeetSpace,
  generateInstantMeetLink,
  AppMeetSession,
} from '../../services/googleMeet';
import {
  googleSignIn,
  googleSignOut,
  initAuth,
} from '../../services/googleAuth';
import { User as FirebaseUser } from 'firebase/auth';
import { useSchool } from '../../context/SchoolContext';

interface GoogleMeetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleMeetModal: React.FC<GoogleMeetModalProps> = ({ isOpen, onClose }) => {
  const { currentSchool, currentUser } = useSchool();
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [activeTab, setActiveTab] = useState<'instant' | 'schedule' | 'sessions'>('instant');

  // Instant Meeting State
  const [instantTopic, setInstantTopic] = useState('Grade 10 ECZ Mathematics Live Video Tutorial');
  const [instantCategory, setInstantCategory] = useState<AppMeetSession['category']>('class_tutorial');
  const [instantGrade, setInstantGrade] = useState('Grade 10');
  const [generatedMeetUri, setGeneratedMeetUri] = useState<string | null>(null);
  const [generatedMeetCode, setGeneratedMeetCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Scheduled Sessions State
  const [sessions, setSessions] = useState<AppMeetSession[]>([
    {
      id: 'meet_1',
      title: 'Grade 12 ECZ Science & Biology Revision Clinic',
      category: 'ecz_prep',
      meetUri: 'https://meet.google.com/zamb-sci-prep',
      meetingCode: 'zamb-sci-prep',
      hostName: 'Mr. B. Phiri (Head of Sciences)',
      hostEmail: 'b.phiri@kabwe-tech.edu.zm',
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      targetGrade: 'Grade 12',
      subjectName: 'Biology & Physics',
      scheduledTime: 'Today, 16:30 CAT',
      createdAt: new Date().toISOString(),
      isLive: true,
      participantsCount: 28,
    },
    {
      id: 'meet_2',
      title: 'Term 2 PTA Executive Committee & Fee Review',
      category: 'pta_meeting',
      meetUri: 'https://meet.google.com/pta-exec-revw',
      meetingCode: 'pta-exec-revw',
      hostName: 'Mrs. Chanda (PTA Chair & Head Teacher)',
      hostEmail: 'head@kabwe-tech.edu.zm',
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      scheduledTime: 'Tomorrow, 14:00 CAT',
      createdAt: new Date().toISOString(),
      isLive: false,
      participantsCount: 45,
    },
    {
      id: 'meet_3',
      title: 'Weekly All-Faculty Academic & Lesson Duty Briefing',
      category: 'staff_briefing',
      meetUri: 'https://meet.google.com/stf-kabwe-sync',
      meetingCode: 'stf-kabwe-sync',
      hostName: 'Head Teacher Dr. M. Mwansa',
      hostEmail: 'head@kabwe-tech.edu.zm',
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      scheduledTime: 'Friday, 07:30 CAT',
      createdAt: new Date().toISOString(),
      isLive: false,
      participantsCount: 18,
    },
  ]);

  // Schedule Form State
  const [schedTitle, setSchedTitle] = useState('');
  const [schedCategory, setSchedCategory] = useState<AppMeetSession['category']>('class_tutorial');
  const [schedGrade, setSchedGrade] = useState('Grade 9');
  const [schedSubject, setSchedSubject] = useState('Mathematics');
  const [schedTime, setSchedTime] = useState('');

  // Manual Join input
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAuthToken(token);
      },
      () => {
        setGoogleUser(null);
        setAuthToken(null);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    setIsLoadingAuth(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setAuthToken(res.accessToken);
      }
    } catch (err: any) {
      console.warn('Google Meet sign in notice:', err.message);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await googleSignOut();
    setGoogleUser(null);
    setAuthToken(null);
  };

  const handleCreateInstantMeet = async () => {
    setIsCreatingSpace(true);
    try {
      let space;
      if (authToken) {
        space = await createGoogleMeetSpace('OPEN');
      } else {
        const uri = generateInstantMeetLink();
        space = {
          name: 'spaces/instant',
          meetingUri: uri,
          meetingCode: uri.split('/').pop() || 'live-meet',
        };
      }

      setGeneratedMeetUri(space.meetingUri);
      setGeneratedMeetCode(space.meetingCode);

      // Add to sessions list
      const newSession: AppMeetSession = {
        id: 'meet_' + Date.now(),
        title: instantTopic || 'Instant Live Video Class',
        category: instantCategory,
        meetUri: space.meetingUri,
        meetingCode: space.meetingCode,
        hostName: currentUser.fullName,
        hostEmail: googleUser?.email || currentUser.email,
        schoolId: currentSchool.id,
        schoolName: currentSchool.name,
        targetGrade: instantGrade,
        subjectName: instantCategory === 'class_tutorial' ? 'ECZ Curriculum Subject' : undefined,
        scheduledTime: 'Live Right Now',
        createdAt: new Date().toISOString(),
        isLive: true,
        participantsCount: 1,
      };

      setSessions((prev) => [newSession, ...prev]);
    } catch (err: any) {
      const fallbackUri = generateInstantMeetLink();
      setGeneratedMeetUri(fallbackUri);
      setGeneratedMeetCode(fallbackUri.split('/').pop() || 'meet-session');
    } finally {
      setIsCreatingSpace(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedMeetUri) return;
    navigator.clipboard.writeText(generatedMeetUri);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitle.trim()) return;

    const uri = generateInstantMeetLink();
    const code = uri.split('/').pop() || 'meet-session';

    const newSession: AppMeetSession = {
      id: 'meet_' + Date.now(),
      title: schedTitle.trim(),
      category: schedCategory,
      meetUri: uri,
      meetingCode: code,
      hostName: currentUser.fullName,
      hostEmail: googleUser?.email || currentUser.email,
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      targetGrade: schedGrade,
      subjectName: schedSubject,
      scheduledTime: schedTime || 'Upcoming Session',
      createdAt: new Date().toISOString(),
      isLive: false,
      participantsCount: 0,
    };

    setSessions((prev) => [newSession, ...prev]);
    setSchedTitle('');
    setSchedTime('');
    setActiveTab('sessions');
  };

  const handleJoinManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const targetUrl = manualCode.startsWith('http')
      ? manualCode
      : `https://meet.google.com/${manualCode.trim()}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-2xl border border-emerald-400/30">
              <Video className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">Google Meet Video Conferencing</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Host live classes, PTA conferences, ECZ exam revisions & faculty meetings via Google Meet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Workspace Account Header */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            {googleUser ? (
              <>
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.displayName || 'Google User'}
                    className="w-7 h-7 rounded-full border border-slate-300 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {(googleUser.displayName || googleUser.email || 'G')[0].toUpperCase()}
                  </div>
                )}
                <div className="text-slate-800 font-semibold">
                  <span>Connected as </span>
                  <span className="font-bold text-slate-900">{googleUser.displayName || googleUser.email}</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  OAuth Verified
                </span>
              </>
            ) : (
              <div className="text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Sign in with Google to create official Google Meet rooms automatically</span>
              </div>
            )}
          </div>

          <div>
            {googleUser ? (
              <button
                onClick={handleGoogleSignOut}
                className="text-rose-700 hover:text-rose-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect Google</span>
              </button>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoadingAuth}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-2xs text-xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>{isLoadingAuth ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('instant')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'instant'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Launch Instant Meeting</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Session</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'sessions'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>School Live & Upcoming ({sessions.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'instant' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Quick join bar */}
              <form onSubmit={handleJoinManual} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter a Google Meet code or link (e.g. abc-defg-hij)..."
                  className="flex-1 bg-white border border-slate-300 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!manualCode.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Instant Meeting Creator */}
              <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50 border border-emerald-200/80 rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">Start Instant Google Meet</h4>
                    <p className="text-xs text-slate-600">
                      Create an instant video space with direct links for learners, parents, or teachers
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Meeting Topic / Title
                    </label>
                    <input
                      type="text"
                      value={instantTopic}
                      onChange={(e) => setInstantTopic(e.target.value)}
                      placeholder="e.g. Grade 10 Mathematics Live Video Tutorial"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Session Category
                      </label>
                      <select
                        value={instantCategory}
                        onChange={(e) => setInstantCategory(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-hidden focus:border-emerald-500"
                      >
                        <option value="class_tutorial">Live Class Tutorial</option>
                        <option value="ecz_prep">ECZ Exam Revision Clinic</option>
                        <option value="pta_meeting">PTA Meeting / Conference</option>
                        <option value="staff_briefing">Staff & Faculty Briefing</option>
                        <option value="consultation">Parent-Teacher Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Target Grade / Audience
                      </label>
                      <input
                        type="text"
                        value={instantGrade}
                        onChange={(e) => setInstantGrade(e.target.value)}
                        placeholder="e.g. Grade 10 or All Parents"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleCreateInstantMeet}
                      disabled={isCreatingSpace}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <Radio className={`w-4 h-4 ${isCreatingSpace ? 'animate-spin' : ''}`} />
                      <span>{isCreatingSpace ? 'Creating Google Meet Space...' : 'Create & Launch Google Meet'}</span>
                    </button>
                  </div>
                </div>

                {/* Generated Link Display */}
                {generatedMeetUri && (
                  <div className="mt-4 p-4 bg-white rounded-2xl border border-emerald-300 shadow-sm space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Google Meet Room Ready!</span>
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        Code: {generatedMeetCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        readOnly
                        value={generatedMeetUri}
                        className="flex-1 bg-transparent text-xs font-mono text-slate-800 outline-hidden"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
                      </button>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <a
                        href={generatedMeetUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
                      >
                        <span>Join Video Room Now</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <form onSubmit={handleScheduleSubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Schedule Upcoming Google Meet Conference</h4>
                <p className="text-xs text-slate-500">
                  Plan ahead for ECZ examination workshops, termly parent conferences, or subject masterclasses
                </p>
              </div>

              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Meeting Title / Topic
                  </label>
                  <input
                    type="text"
                    value={schedTitle}
                    onChange={(e) => setSchedTitle(e.target.value)}
                    placeholder="e.g. Grade 12 ECZ Chemistry Practical Revision"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-hidden focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Category
                    </label>
                    <select
                      value={schedCategory}
                      onChange={(e) => setSchedCategory(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-hidden focus:border-emerald-500"
                    >
                      <option value="ecz_prep">ECZ Exam Revision</option>
                      <option value="class_tutorial">Classroom Tutorial</option>
                      <option value="pta_meeting">PTA Meeting</option>
                      <option value="staff_briefing">Staff Meeting</option>
                      <option value="consultation">Parent Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Target Grade
                    </label>
                    <input
                      type="text"
                      value={schedGrade}
                      onChange={(e) => setSchedGrade(e.target.value)}
                      placeholder="e.g. Grade 12"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={schedSubject}
                      onChange={(e) => setSchedSubject(e.target.value)}
                      placeholder="e.g. Chemistry & Science"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Scheduled Date & Time
                    </label>
                    <input
                      type="text"
                      value={schedTime}
                      onChange={(e) => setSchedTime(e.target.value)}
                      placeholder="e.g. Saturday, 10:00 AM CAT"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-hidden focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('instant')}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save & Generate Google Meet Link</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-900">Active & Upcoming Google Meet Sessions</h4>
                  <p className="text-xs text-slate-500">Live conferences and tutorials scheduled for {currentSchool.name}</p>
                </div>

                <button
                  onClick={() => setActiveTab('instant')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start New Room</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`rounded-2xl p-5 border transition flex flex-col justify-between gap-4 ${
                      session.isLive
                        ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-400 shadow-sm ring-2 ring-emerald-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            session.category === 'ecz_prep'
                              ? 'bg-amber-100 text-amber-800'
                              : session.category === 'pta_meeting'
                              ? 'bg-purple-100 text-purple-800'
                              : session.category === 'staff_briefing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {session.category.replace('_', ' ')}
                        </span>

                        {session.isLive ? (
                          <span className="flex items-center gap-1 text-[11px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full animate-pulse border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                            LIVE NOW
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.scheduledTime}
                          </span>
                        )}
                      </div>

                      <h5 className="font-black text-sm text-slate-900 leading-snug">{session.title}</h5>

                      <div className="text-xs text-slate-600 space-y-0.5">
                        <p>
                          <span className="font-semibold text-slate-700">Host:</span> {session.hostName}
                        </p>
                        {session.targetGrade && (
                          <p>
                            <span className="font-semibold text-slate-700">Audience:</span> {session.targetGrade}{' '}
                            {session.subjectName && `(${session.subjectName})`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="font-mono text-[11px] text-slate-400">
                        {session.meetingCode}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(session.meetUri);
                            alert(`Google Meet link copied: ${session.meetUri}`);
                          }}
                          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                          title="Copy Link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={session.meetUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                            session.isLive
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <span>Join Meet</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Google Meet API v2 Integration Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
