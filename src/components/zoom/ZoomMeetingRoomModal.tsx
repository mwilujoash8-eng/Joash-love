import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Share2,
  Users,
  MessageSquare,
  Smile,
  PhoneOff,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Disc,
  LayoutGrid,
  MonitorUp,
  Hand,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Send,
  HelpCircle,
  BookOpen,
  Volume2,
  VolumeX,
  Bot,
  Brain,
  Zap,
  Play,
  RotateCcw,
  GraduationCap,
  Award,
  Layers,
  Presentation,
  Grid
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ZoomMeeting } from '../../types';

interface ZoomMeetingRoomModalProps {
  meeting: ZoomMeeting;
  onClose: () => void;
}

export const ZoomMeetingRoomModal: React.FC<ZoomMeetingRoomModalProps> = ({ meeting, onClose }) => {
  const { currentUser, updateZoomMeeting } = useSchool();

  // Meeting host / user state
  const isHost = currentUser.role === 'teacher' || currentUser.role === 'head_teacher' || currentUser.role === 'deputy_head_teacher';
  const [isMuted, setIsMuted] = useState(meeting.isHostAudioMuted ?? false);
  const [isVideoOn, setIsVideoOn] = useState(meeting.isHostVideoOn ?? true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState<'none' | 'sub_teacher' | 'participants' | 'chat' | 'whiteboard'>('sub_teacher');
  const [viewMode, setViewMode] = useState<'gallery' | 'speaker' | 'board'>('board');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // AI Sub-Teacher States & Model Selection
  const [currentAiModel, setCurrentAiModel] = useState<string>(meeting.aiModel || 'gemini-3.7-flash');
  const [currentEducationMode, setCurrentEducationMode] = useState<string>(meeting.educationMode || 'interactive_tutor');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [voiceRecognitionSupported, setVoiceRecognitionSupported] = useState(true);
  const [recognitionRef, setRecognitionRef] = useState<any>(null);

  const [aiLastSpeech, setAiLastSpeech] = useState(
    `Dr. Mwape is ready for two-way audio interaction. Speak into your microphone or ask questions on ${meeting.topic}.`
  );
  const [aiActionHistory, setAiActionHistory] = useState<Array<{ type: string; title: string; time: string }>>([
    { type: 'init', title: `Joined meeting as AI Sub-Teacher (${meeting.grade || 'Grade 9'})`, time: '08:00 AM' }
  ]);
  const [aiPromptInput, setAiPromptInput] = useState('');

  // Student Oral / Quiz Answer State
  const [studentAnswerInput, setStudentAnswerInput] = useState('');
  const [studentAnswerEvaluation, setStudentAnswerEvaluation] = useState<{
    score: string;
    isCorrect: boolean;
    feedback: string;
    badgeAwarded?: string;
  } | null>(null);
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState(false);

  // Interactive Whiteboard problem / notes state
  const [whiteboardTitle, setWhiteboardTitle] = useState(meeting.topic || 'Quadratic Curves: Turning Point Formula & Roots');
  const [whiteboardNotes, setWhiteboardNotes] = useState(
    `# Dr. Mwape (AI Sub-Teacher) - Live Blackboard\n\n📌 **Grade & Class:** ${meeting.grade || 'Grade 9'} (${meeting.className}) | **Subject:** ${meeting.subjectName}\n📌 **Lesson Topic:** ${meeting.topic}\n\n**Key Syllabus Directives & Formulas (ECZ Curriculum):**\n1. **Standard Algebraic Form:** $y = ax^2 + bx + c$\n2. **Axis of Symmetry:** $x = -\\frac{b}{2a}$\n3. **Turning Point (Vertex):** Substitute $x$ into equation to find $y$.\n4. **Discriminant Check:** $\\Delta = b^2 - 4ac$\n\n**Worked Demonstration:**\n- Let equation be $y = 2x^2 - 8x + 5$\n- Identify coefficients: $a = 2, b = -8, c = 5$\n- $x = -(-8)/(2 \\times 2) = 8/4 = 2$\n- $y = 2(2)^2 - 8(2) + 5 = 8 - 16 + 5 = -3$\n- **Turning Point Vertex Coordinates:** $(2, -3)$ [Minimum Turning Point]`
  );

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    selectedOption: number | null;
  } | null>({
    question: 'For quadratic curve y = 2x² - 8x + 5, what is the x-coordinate of the turning point vertex?',
    options: ['x = 4', 'x = 2', 'x = -2', 'x = 8'],
    correctIndex: 1,
    explanation: 'Using vertex formula x = -b / (2a) = -(-8) / (2 * 2) = 8 / 4 = 2.',
    selectedOption: null,
  });

  // Chat Messages State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: string;
    time: string;
    text: string;
    isTeacher?: boolean;
    isAi?: boolean;
  }>>([
    { sender: 'System', time: '08:00 AM', text: `Welcome to ${meeting.topic}. Dr. Mwape (AI Sub-Teacher) is standing by with two-way voice.` },
    { sender: meeting.hostTeacherName, time: '08:01 AM', text: `Good morning class! Please turn to ECZ Mathematics Paper 2 section on quadratics.`, isTeacher: true },
    { sender: 'Dr. Mwape (AI)', time: '08:02 AM', text: `Good morning everyone! Feel free to ask questions by voice or chat at any time.`, isAi: true }
  ]);

  // Participants Roster
  const [participants, setParticipants] = useState<Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    isMuted: boolean;
    isVideoOn: boolean;
    isHandRaised?: boolean;
    isAi?: boolean;
  }>>([
    {
      id: 'p_teacher',
      name: meeting.hostTeacherName,
      role: 'Host / Teacher',
      avatar: meeting.hostAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      isMuted: false,
      isVideoOn: true,
    },
    {
      id: 'p_ai',
      name: 'Dr. Mwape (AI Sub-Teacher)',
      role: 'AI Co-Pilot & Substitute',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      isMuted: false,
      isVideoOn: true,
      isAi: true,
    },
    {
      id: 'p_stu_1',
      name: 'Mubita Mweemba',
      role: 'Student (Prefect)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80',
      isMuted: true,
      isVideoOn: true,
      isHandRaised: false,
    },
    {
      id: 'p_stu_2',
      name: 'Chileshe Mwamba',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
      isMuted: false,
      isVideoOn: true,
      isHandRaised: true,
    },
    {
      id: 'p_stu_3',
      name: 'Kondwani Banda',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
      isMuted: true,
      isVideoOn: true,
    },
    {
      id: 'p_stu_4',
      name: 'Thandiwe Phiri',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80',
      isMuted: true,
      isVideoOn: false,
    }
  ]);

  // Speech Recognition Initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setSpeechTranscript(transcript);
        setAiPromptInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognitionRef(recognition);
    } else {
      setVoiceRecognitionSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Speech API Voice synthesizer with speed controls
  const speakText = (text: string) => {
    if (!aiVoiceEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#$`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speechRate;
      utterance.pitch = 1.02;
      
      // Try to choose an expressive English voice
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('George')) && v.lang.startsWith('en')) || voices[0];
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef) {
      try {
        setSpeechTranscript('');
        recognitionRef.start();
      } catch (e) {
        console.warn('Speech recognition start failed or already active:', e);
      }
    }
  };

  const stopVoiceInputAndSend = () => {
    if (recognitionRef) {
      recognitionRef.stop();
    }
    if (speechTranscript.trim() || aiPromptInput.trim()) {
      const text = speechTranscript.trim() || aiPromptInput.trim();
      handleAiAction('voice_conversation', text);
    }
  };

  const handleAiAction = async (
    actionType: 'explain_concept' | 'solve_problem' | 'generate_quiz' | 'takeover_lesson' | 'summarize_session' | 'voice_conversation' | 'evaluate_student_answer',
    customQuery?: string,
    extraPayload?: { studentAnswer?: string; currentQuestion?: string; questionContext?: string }
  ) => {
    setIsAiLoading(true);
    const query = customQuery || aiPromptInput || 'Explain current concept clearly with step-by-step guidance.';
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    try {
      const response = await fetch('/api/ai/zoom-sub-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType,
          subject: meeting.subjectName,
          grade: meeting.grade || 'Grade 9',
          topic: meeting.topic,
          userQuery: query,
          aiModel: currentAiModel,
          educationMode: currentEducationMode,
          lessonContext: whiteboardNotes,
          studentAnswer: extraPayload?.studentAnswer,
          currentQuestion: extraPayload?.currentQuestion || activeQuiz?.question,
          questionContext: extraPayload?.questionContext || whiteboardNotes
        })
      });

      const data = await response.json();
      const reply = data.reply || 'Dr. Mwape has updated the blackboard and lesson board.';
      const spoken = data.spokenText || reply.slice(0, 160);
      const notes = data.whiteboardNotes || whiteboardNotes;

      setAiLastSpeech(spoken);
      if (data.whiteboardNotes) {
        setWhiteboardNotes(notes);
      }

      if (data.evaluation) {
        setStudentAnswerEvaluation({
          score: data.evaluation.score || '10/10',
          isCorrect: !!data.evaluation.isCorrect,
          feedback: data.evaluation.feedback || reply,
          badgeAwarded: data.evaluation.badgeAwarded || 'Curriculum Scholar'
        });
      }

      // Add to chat
      setChatMessages(prev => [
        ...prev,
        {
          sender: `Dr. Mwape (${currentEducationMode === 'socratic_dialogic' ? 'Socratic Co-Teacher' : currentEducationMode === 'ecz_examiner' ? 'ECZ Examiner' : 'AI Sub-Teacher'})`,
          time: timeStr,
          text: reply,
          isAi: true
        }
      ]);

      // Add to action history
      const actionLabels: Record<string, string> = {
        explain_concept: `Explained: ${query.slice(0, 24)}...`,
        solve_problem: `Worked Proof: ${query.slice(0, 24)}...`,
        generate_quiz: 'Published Live ECZ Pop-Quiz',
        takeover_lesson: 'Delivered Curriculum Exposition',
        summarize_session: 'Generated Class Notes & Summary',
        voice_conversation: `Voice Dialogue: "${query.slice(0, 24)}..."`,
        evaluate_student_answer: `Graded Student Answer (${data.evaluation?.score || 'Checked'})`
      };

      setAiActionHistory(prev => [
        {
          type: actionType,
          title: actionLabels[actionType] || `Processed Action`,
          time: timeStr
        },
        ...prev.slice(0, 15)
      ]);

      if (actionType === 'generate_quiz') {
        setActiveQuiz({
          question: `ECZ Practice: For the quadratic function y = 2x² - 8x + 5, what is the value of the discriminant Δ?`,
          options: ['A) Δ = 24 (Real & Distinct Roots)', 'B) Δ = -24 (No Real Roots)', 'C) Δ = 0 (Repeated Root)', 'D) Δ = 104'],
          correctIndex: 0,
          explanation: 'Δ = b² - 4ac = (-8)² - 4(2)(5) = 64 - 40 = 24. Since Δ > 0, the curve cuts the x-axis at two distinct points.',
          selectedOption: null
        });
      }

      speakText(spoken);
    } catch (err) {
      console.error('AI Sub Teacher error:', err);
    } finally {
      setIsAiLoading(false);
      setAiPromptInput('');
      setSpeechTranscript('');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const userMsg = chatInput.trim();

    setChatMessages(prev => [...prev, {
      sender: currentUser.fullName,
      time: timeStr,
      text: userMsg,
      isTeacher: isHost
    }]);

    setChatInput('');

    // If message mentions "Dr. Mwape" or "AI" or has question mark, auto-trigger AI Sub-Teacher reply
    if (userMsg.toLowerCase().includes('dr. mwape') || userMsg.toLowerCase().includes('ai') || userMsg.toLowerCase().includes('how') || userMsg.toLowerCase().includes('why') || userMsg.includes('?')) {
      setTimeout(() => {
        handleAiAction('explain_concept', userMsg);
      }, 1000);
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(`Zoom Meeting: ${meeting.topic}\nMeeting ID: ${meeting.meetingId}\nPasscode: ${meeting.passcode}\nJoin: ${meeting.joinUrl}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReaction = (emoji: string) => {
    setSelectedReaction(emoji);
    setTimeout(() => setSelectedReaction(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-1 sm:p-3 animate-in fade-in duration-200" id="zoom-meeting-room-modal-container">
      <div className={`bg-[#12141A] w-full ${isFullscreen ? 'h-screen rounded-none' : 'max-w-7xl h-[95vh] rounded-2xl'} flex flex-col overflow-hidden border border-slate-800 shadow-2xl relative text-white transition-all`}>
        
        {/* ZOOM TOP HEADER BAR */}
        <header className="h-14 bg-[#1A1D24] border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-[#2D8CFF] text-white px-2.5 py-1 rounded-md text-xs font-extrabold shadow-sm tracking-wide">
              <Video className="w-3.5 h-3.5" />
              <span>ZOOM CLASSROOM</span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-white truncate max-w-xs">{meeting.topic}</span>
              <span className="text-slate-600">&bull;</span>
              <span className="bg-slate-800 text-slate-300 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-700">
                ID: {meeting.meetingId}
              </span>
              <span className="bg-slate-800 text-slate-300 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-700">
                Passcode: {meeting.passcode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Sub-Teacher Status Badge in Top Bar */}
            <div className="flex items-center gap-1.5 bg-purple-950/80 border border-purple-700/80 text-purple-300 px-2.5 py-1 rounded-full text-xs font-medium">
              <Bot className={`w-3.5 h-3.5 text-purple-400 ${isAiSpeaking ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">Dr. Mwape (AI Sub-Teacher)</span>
              <span className={`w-2 h-2 rounded-full ${isAiSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-purple-400'}`}></span>
            </div>

            {isRecording && (
              <div className="hidden sm:flex items-center gap-1.5 bg-red-950/70 border border-red-800/80 text-red-400 px-2.5 py-1 rounded-full text-xs font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>REC &bull; ECZ Cloud</span>
              </div>
            )}

            <div className="hidden lg:flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 px-2 py-1 rounded text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>256-Bit Encrypted</span>
            </div>

            <button
              onClick={handleCopyInvite}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 transition border border-slate-700"
              title="Copy Zoom Meeting Invitation"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Invite'}</span>
            </button>

            <a
              href={meeting.joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-[#2D8CFF]/20 hover:bg-[#2D8CFF]/30 text-[#4da2ff] rounded text-xs flex items-center gap-1.5 transition border border-[#2D8CFF]/40"
              title="Launch in Native Zoom App"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open Zoom App</span>
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* VIEW SELECTOR BAR */}
        <div className="h-10 bg-[#16181F] border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">View Layout:</span>
            <button
              onClick={() => setViewMode('board')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition ${
                viewMode === 'board' ? 'bg-[#2D8CFF] text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Interactive Whiteboard & AI Co-Teacher</span>
            </button>
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition ${
                viewMode === 'gallery' ? 'bg-[#2D8CFF] text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Gallery Grid (6 Tiles)</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAiVoiceEnabled(!aiVoiceEnabled)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition ${
                aiVoiceEnabled ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800' : 'text-slate-500 bg-slate-800'
              }`}
              title="Toggle AI Sub-Teacher voice readout"
            >
              {aiVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>AI Voice: {aiVoiceEnabled ? 'ON' : 'MUTED'}</span>
            </button>
          </div>
        </div>

        {/* MAIN VIDEO STAGE / WHITEBOARD GRID */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Reaction Overlay */}
          {selectedReaction && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 text-4xl px-6 py-3 rounded-full border border-slate-700 shadow-2xl animate-bounce">
              {selectedReaction}
            </div>
          )}

          {/* Left / Center Stage */}
          <div className="flex-1 p-3 flex flex-col overflow-y-auto">
            {viewMode === 'board' ? (
              /* INTERACTIVE DIGITAL WHITEBOARD WITH AI CO-TEACHER ENGINE */
              <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col p-4 relative overflow-hidden shadow-inner">
                {/* Board Top Info */}
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white">Live Classroom Board: {meeting.subjectName}</span>
                    <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                      {meeting.curriculumCode || 'ECZ-2026-SYLLABUS'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-300 font-medium flex items-center gap-1.5 bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>AI Co-Pilot: Dr. Mwape</span>
                    </span>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Digital Canvas / Blackboard */}
                  <div className="lg:col-span-8 bg-[#0B1120] rounded-xl p-5 border border-slate-800 flex flex-col justify-between shadow-inner space-y-4">
                    <div className="space-y-4">
                      {/* Topic Title */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
                            Teacher & AI Demonstration &bull; ECZ Paper 2
                          </div>
                          <h2 className="text-lg sm:text-xl font-extrabold text-white">
                            {whiteboardTitle}
                          </h2>
                        </div>

                        {isAiSpeaking && (
                          <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-700 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                            <span>Dr. Mwape Speaking</span>
                          </div>
                        )}
                      </div>

                      {/* Whiteboard Markdown Render / Equations */}
                      <div className="bg-[#030712] p-4 rounded-xl border border-slate-800/90 font-mono text-emerald-300 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto shadow-inner">
                        {whiteboardNotes}
                      </div>

                      {/* Interactive Pop-Quiz Card if active */}
                      {activeQuiz && (
                        <div className="bg-slate-900/90 p-4 rounded-xl border border-purple-800/60 space-y-3 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold uppercase tracking-wide text-purple-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                              <span>Dr. Mwape Pop Quiz &bull; Check for Understanding</span>
                            </span>
                            <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-700">
                              Instant Grading
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm font-bold text-white">
                            {activeQuiz.question}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {activeQuiz.options.map((opt, oIdx) => {
                              const isSelected = activeQuiz.selectedOption === oIdx;
                              const isCorrect = oIdx === activeQuiz.correctIndex;
                              const showFeedback = activeQuiz.selectedOption !== null;

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => {
                                    setActiveQuiz(prev => prev ? { ...prev, selectedOption: oIdx } : null);
                                    if (isCorrect) {
                                      speakText("Correct answer! Excellent analytical work.");
                                    } else {
                                      speakText("Not quite. Review the formula: x equals negative b over two a.");
                                    }
                                  }}
                                  className={`p-2.5 rounded-lg text-xs font-semibold text-left transition border ${
                                    showFeedback
                                      ? isCorrect
                                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40'
                                        : isSelected
                                        ? 'bg-red-950 border-red-500 text-red-200'
                                        : 'bg-slate-950 border-slate-800 text-slate-400'
                                      : 'bg-slate-950 hover:bg-purple-950/40 border-slate-800 hover:border-purple-600 text-slate-200'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {activeQuiz.selectedOption !== null && (
                            <p className="text-xs text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                              💡 <strong>Explanation:</strong> {activeQuiz.explanation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Quick Controls */}
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Quick Demonstrations:</span>
                        <button
                          onClick={() => handleAiAction('solve_problem', 'Show completing the square for 2x² - 8x + 5 = 0')}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded text-slate-200 border border-slate-700"
                        >
                          Completing the Square
                        </button>
                        <button
                          onClick={() => handleAiAction('solve_problem', 'Calculate discriminant Δ and roots for y = x² - 9')}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded text-slate-200 border border-slate-700"
                        >
                          Difference of 2 Squares
                        </button>
                      </div>
                      <span className="text-xs text-purple-400 font-medium flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Dr. Mwape AI Engine Active
                      </span>
                    </div>
                  </div>

                  {/* Spotlight Videos on Right Side */}
                  <div className="lg:col-span-4 flex flex-col gap-3">
                    {/* Teacher Spotlight */}
                    <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
                      <img
                        src={meeting.hostAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80'}
                        alt={meeting.hostTeacherName}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500 mb-1.5 shadow-lg"
                      />
                      <span className="text-xs font-bold text-white">{meeting.hostTeacherName}</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Head of Department &bull; Host</span>
                    </div>

                    {/* AI Sub-Teacher Video Tile */}
                    <div className={`bg-linear-to-b from-purple-950/60 to-slate-950 rounded-xl p-3 border ${
                      isAiSpeaking ? 'border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-900/30' : 'border-slate-800'
                    } relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]`}>
                      <div className="relative mb-1.5">
                        <div className="w-16 h-16 rounded-full bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center ring-2 ring-purple-400 shadow-md">
                          <Bot className="w-8 h-8 text-white" />
                        </div>
                        {isAiSpeaking && (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow">
                            <Volume2 className="w-3 h-3 animate-pulse" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-white">Dr. Mwape</span>
                      <span className="text-[10px] text-purple-300 font-medium">AI Sub-Teacher & Co-Pilot</span>
                      
                      {/* Audio waveform */}
                      {isAiSpeaking && (
                        <div className="flex gap-1 items-end h-3 mt-1">
                          <span className="w-1 bg-purple-400 rounded-full animate-bounce h-2"></span>
                          <span className="w-1 bg-purple-400 rounded-full animate-bounce h-4 delay-75"></span>
                          <span className="w-1 bg-purple-400 rounded-full animate-bounce h-3 delay-150"></span>
                          <span className="w-1 bg-purple-400 rounded-full animate-bounce h-4 delay-100"></span>
                        </div>
                      )}
                    </div>

                    {/* Active Student Roster Peek */}
                    <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex-1 flex flex-col">
                      <span className="text-xs font-bold text-slate-300 mb-2">Class Attendees ({meeting.attendeesCount || 28})</span>
                      <div className="space-y-1.5 overflow-y-auto max-h-36 pr-1">
                        {participants.slice(2).map(p => (
                          <div key={p.id} className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800 text-xs">
                            <div className="flex items-center gap-2">
                              <img src={p.avatar} alt={p.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="text-slate-200 truncate max-w-[120px]">{p.name}</span>
                            </div>
                            {p.isHandRaised && (
                              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/40">
                                ✋ Hand
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* PARTICIPANT VIDEO TILES GALLERY GRID */
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className={`bg-slate-900 rounded-xl border ${
                      participant.isAi
                        ? isAiSpeaking
                          ? 'border-purple-500 ring-4 ring-purple-500/30'
                          : 'border-purple-800/80 bg-linear-to-b from-purple-950/40 to-slate-900'
                        : participant.isHandRaised
                        ? 'border-amber-500 ring-2 ring-amber-500/30'
                        : 'border-slate-800'
                    } relative flex flex-col items-center justify-center p-4 overflow-hidden group shadow-lg`}
                  >
                    {/* Camera Video View */}
                    {participant.isAi ? (
                      <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-linear-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center ring-4 ring-purple-400/80 shadow-2xl">
                          <Bot className="w-14 h-14 text-white" />
                        </div>
                        {isAiSpeaking && (
                          <div className="absolute bottom-10 flex gap-1 items-end h-4">
                            <span className="w-1.5 bg-purple-400 rounded-full animate-bounce h-2"></span>
                            <span className="w-1.5 bg-purple-400 rounded-full animate-bounce h-5 delay-75"></span>
                            <span className="w-1.5 bg-purple-400 rounded-full animate-bounce h-3 delay-150"></span>
                            <span className="w-1.5 bg-purple-400 rounded-full animate-bounce h-4 delay-100"></span>
                          </div>
                        )}
                      </div>
                    ) : participant.isVideoOn ? (
                      <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-2 ring-slate-700 shadow-md transition-transform group-hover:scale-105"
                        />
                        {!participant.isMuted && (
                          <div className="absolute bottom-10 flex gap-1 items-end h-4">
                            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2"></span>
                            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-4 delay-75"></span>
                            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3 delay-150"></span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-400 border border-slate-700">
                          {participant.name.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-500 mt-2">Camera Off</span>
                      </div>
                    )}

                    {/* Bottom Tile Info Tag */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-slate-200 truncate">{participant.name}</span>
                        {participant.isAi && (
                          <span className="bg-purple-600 text-white text-[9px] px-1.5 py-0.5 rounded font-extrabold flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> AI SUB-TEACHER
                          </span>
                        )}
                        {participant.role.includes('Host') && (
                          <span className="bg-[#2D8CFF] text-white text-[9px] px-1 rounded font-bold">HOST</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {participant.isHandRaised && (
                          <span className="text-amber-400 animate-bounce" title="Hand Raised">
                            ✋
                          </span>
                        )}
                        {participant.isMuted ? (
                          <MicOff className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DEDICATED SIDE PANELS (AI SUB-TEACHER / PARTICIPANTS / CHAT / WHITEBOARD) */}
          {activeSidePanel !== 'none' && (
            <div className="w-80 sm:w-96 bg-[#1A1D24] border-l border-slate-800 flex flex-col shrink-0 animate-in slide-in-from-right-4 duration-200 z-30">
              
              {/* Panel Header */}
              <div className="h-12 border-b border-slate-800 px-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  {activeSidePanel === 'sub_teacher' && (
                    <>
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span>Dr. Mwape AI Co-Teacher</span>
                    </>
                  )}
                  {activeSidePanel === 'participants' && `Class Roster (${participants.length})`}
                  {activeSidePanel === 'chat' && 'Live Classroom Chat'}
                  {activeSidePanel === 'whiteboard' && 'Digital Blackboard Tools'}
                </span>
                <button
                  onClick={() => setActiveSidePanel('none')}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* PANEL: AI SUB-TEACHER CONTROLLER */}
              {activeSidePanel === 'sub_teacher' && (
                <div className="flex-1 p-3 overflow-y-auto space-y-4">
                  {/* AI Status Card with Two-Way Audio Indicator */}
                  <div className="bg-linear-to-r from-purple-950/70 via-indigo-950/60 to-purple-950/70 p-3.5 rounded-xl border border-purple-700/60 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white shadow">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Dr. Mwape (AI Sub-Teacher)</p>
                          <p className="text-[10px] text-purple-300">
                            {meeting.grade || 'Grade 9'} &bull; {meeting.className} &bull; {meeting.subjectName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                          {isAiSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Live'}
                        </span>
                      </div>
                    </div>

                    {/* Speech Box */}
                    <div className="bg-purple-950/80 p-2.5 rounded-lg border border-purple-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-purple-300 font-semibold">
                        <span>Latest Voice Utterance</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakText(aiLastSpeech)}
                            className="text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
                            title="Replay Voice Speech"
                          >
                            <RotateCcw className="w-3 h-3" /> Replay
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-purple-100 italic">
                        &ldquo;{aiLastSpeech}&rdquo;
                      </p>
                    </div>

                    {/* Audio Speed and Voice Settings */}
                    <div className="flex items-center justify-between pt-1 text-[10px] text-purple-200 border-t border-purple-800/50">
                      <div className="flex items-center gap-1.5">
                        <span>Speed:</span>
                        {[1.0, 1.25].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => setSpeechRate(rate)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              speechRate === rate ? 'bg-purple-600 text-white' : 'bg-purple-900/50 text-purple-300'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setAiVoiceEnabled(!aiVoiceEnabled)}
                        className="text-[10px] flex items-center gap-1 text-purple-300 hover:text-white"
                      >
                        {aiVoiceEnabled ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3 text-red-400" />}
                        <span>{aiVoiceEnabled ? 'Voice Enabled' : 'Muted'}</span>
                      </button>
                    </div>
                  </div>

                  {/* AI MODEL & EDUCATION MODE SELECTOR */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Active AI Model & Education Mode
                    </span>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5 font-semibold">AI Model Engine</label>
                        <select
                          value={currentAiModel}
                          onChange={(e) => setCurrentAiModel(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:border-purple-500"
                        >
                          <option value="gemini-3.7-flash">⚡ Gemini 3.7 Flash (Fast Audio)</option>
                          <option value="gemini-3.1-pro-preview">🔬 Gemini 3.1 Pro (Deep Proofs)</option>
                          <option value="ecz-curriculum-specialist">📋 ECZ Syllabus Specialist</option>
                          <option value="socratic-tutor">💡 Socratic Inquiry Tutor</option>
                          <option value="differentiated-learning">🌱 Remedial Scaffolding</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5 font-semibold">Pedagogical Framework</label>
                        <select
                          value={currentEducationMode}
                          onChange={(e) => setCurrentEducationMode(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:border-purple-500"
                        >
                          <option value="interactive_tutor">🤝 Interactive Co-Teacher</option>
                          <option value="socratic_dialogic">❓ Socratic Questioning Mode</option>
                          <option value="deep_stem_proofs">📐 STEM Proof & Formula Engine</option>
                          <option value="ecz_examiner">🎯 Senior ECZ Examiner & Rubric</option>
                          <option value="differentiated_remedial">🌟 Remedial Mastery Support</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* TWO-WAY VOICE COMMUNICATION DOCK */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-purple-900/50 space-y-2.5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-purple-400" />
                        <span>Two-Way Voice Communication</span>
                      </span>
                      {isListening && (
                        <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-bold animate-pulse">
                          Listening...
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Talk directly to Dr. Mwape. Speak your question and hear the instant spoken reply.
                    </p>

                    {/* Microphone Action Button */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (isListening) {
                            stopVoiceInputAndSend();
                          } else {
                            startVoiceInput();
                          }
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                          isListening
                            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                        }`}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        <span>{isListening ? 'Stop & Speak to Dr. Mwape' : 'Press to Talk / Speak Question'}</span>
                      </button>
                    </div>

                    {/* Speech Transcript Preview */}
                    {(speechTranscript || isListening) && (
                      <div className="p-2 bg-slate-950 rounded-lg border border-purple-800/60 text-xs text-purple-200">
                        <span className="text-[10px] text-purple-400 font-mono block">Voice Transcript:</span>
                        {speechTranscript || 'Listening to your voice...'}
                      </div>
                    )}
                  </div>

                  {/* STUDENT ANSWER EVALUATION WIDGET */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-indigo-900/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Student Answer & Oral Evaluation</span>
                      </span>
                      <span className="text-[9px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800">
                        AI Rubric
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Submit an answer to the current topic question for instant ECZ grading & oral feedback.
                    </p>

                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={studentAnswerInput}
                        onChange={(e) => setStudentAnswerInput(e.target.value)}
                        placeholder="Type student answer (e.g., Turning point is at x = 2, y = -3)..."
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={isAiLoading || !studentAnswerInput.trim()}
                          onClick={() => {
                            handleAiAction('evaluate_student_answer', undefined, {
                              studentAnswer: studentAnswerInput.trim(),
                              currentQuestion: activeQuiz?.question || `${meeting.topic} Problem Solution`,
                              questionContext: whiteboardNotes
                            });
                          }}
                          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Grade My Answer</span>
                        </button>
                      </div>
                    </div>

                    {/* Evaluation Result Card */}
                    {studentAnswerEvaluation && (
                      <div className={`p-2.5 rounded-lg border text-xs space-y-1.5 ${
                        studentAnswerEvaluation.isCorrect
                          ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                          : 'bg-amber-950/60 border-amber-700 text-amber-200'
                      }`}>
                        <div className="flex items-center justify-between font-bold">
                          <span>Evaluation: {studentAnswerEvaluation.score}</span>
                          {studentAnswerEvaluation.badgeAwarded && (
                            <span className="text-[10px] bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-300">
                              🏆 {studentAnswerEvaluation.badgeAwarded}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] leading-relaxed">{studentAnswerEvaluation.feedback}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Hub */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Sub-Teacher Class Operations
                    </span>

                    <button
                      onClick={() => handleAiAction('takeover_lesson')}
                      disabled={isAiLoading}
                      className="w-full p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-between disabled:opacity-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>Step-by-Step Exposition</span>
                      </div>
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleAiAction('generate_quiz')}
                      disabled={isAiLoading}
                      className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-between disabled:opacity-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>Generate Pop-Quiz for Class</span>
                      </div>
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleAiAction('summarize_session')}
                      disabled={isAiLoading}
                      className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-between border border-slate-700 disabled:opacity-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span>Summarize Key Points & Homework</span>
                      </div>
                      <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>

                  {/* Custom Ask AI Sub-Teacher Form */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Ask Dr. Mwape Anything
                    </span>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiPromptInput}
                        onChange={(e) => setAiPromptInput(e.target.value)}
                        placeholder="e.g. How to find maximum height of a projectile?"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAiAction('explain_concept');
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAiAction('explain_concept')}
                        disabled={isAiLoading || !aiPromptInput.trim()}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
                      >
                        {isAiLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Action Log History */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Recent Sub-Teacher Activity
                    </span>
                    {aiActionHistory.map((item, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] flex items-center justify-between">
                        <span className="text-slate-300 truncate max-w-[180px]">{item.title}</span>
                        <span className="text-slate-500 text-[10px] font-mono">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PANEL: PARTICIPANTS */}
              {activeSidePanel === 'participants' && (
                <div className="flex-1 p-3 overflow-y-auto space-y-2">
                  {isHost && (
                    <div className="flex gap-2 mb-3">
                      <button className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 font-medium">
                        Mute All
                      </button>
                      <button className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 font-medium">
                        Lock Room
                      </button>
                    </div>
                  )}
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-2.5">
                        {p.isAi ? (
                          <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white">
                            <Bot className="w-4 h-4" />
                          </div>
                        ) : (
                          <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                        )}
                        <div>
                          <p className="text-xs font-medium text-white">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        {p.isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                        {p.isVideoOn ? <Video className="w-3.5 h-3.5 text-slate-300" /> : <VideoOff className="w-3.5 h-3.5 text-red-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PANEL: CHAT */}
              {activeSidePanel === 'chat' && (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="flex-1 p-3 overflow-y-auto space-y-3">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
                          <span className={`font-bold ${
                            msg.isAi
                              ? 'text-purple-400'
                              : msg.isTeacher
                              ? 'text-[#4da2ff]'
                              : 'text-slate-300'
                          }`}>
                            {msg.sender}
                          </span>
                          <span>{msg.time}</span>
                        </div>
                        <div className={`p-2.5 rounded-lg ${
                          msg.isAi
                            ? 'bg-purple-950/40 border border-purple-700/60 text-purple-100'
                            : msg.isTeacher
                            ? 'bg-[#2D8CFF]/15 border border-[#2D8CFF]/30 text-white'
                            : 'bg-slate-900 border border-slate-800 text-slate-200'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message or ask Dr. Mwape..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D8CFF]"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-[#2D8CFF] hover:bg-blue-600 text-white rounded-lg transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ZOOM BOTTOM CONTROLS DOCK */}
        <footer className="h-18 bg-[#1A1D24] border-t border-slate-800 px-3 sm:px-4 flex items-center justify-between shrink-0 select-none">
          {/* Audio & Video Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition min-w-[52px] sm:min-w-[56px] ${
                isMuted ? 'text-red-400 hover:bg-red-950/40' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
              <span className="text-[10px] mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition min-w-[52px] sm:min-w-[56px] ${
                !isVideoOn ? 'text-red-400 hover:bg-red-950/40' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              {!isVideoOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-slate-200" />}
              <span className="text-[10px] mt-1">{isVideoOn ? 'Stop Video' : 'Start Video'}</span>
            </button>
          </div>

          {/* Central Collaboration & Interactive Tools */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Quick AI Voice Mic / Push-To-Talk Button */}
            <button
              onClick={() => {
                if (isListening) {
                  stopVoiceInputAndSend();
                } else {
                  startVoiceInput();
                }
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition min-w-[56px] sm:min-w-[64px] relative cursor-pointer shadow-md ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse shadow-red-500/40'
                  : isAiSpeaking
                  ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                  : 'bg-linear-to-r from-purple-700 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-500'
              }`}
              title="Talk to Dr. Mwape (Two-Way Voice Communication)"
            >
              {isListening ? (
                <MicOff className="w-5 h-5 animate-bounce" />
              ) : isAiSpeaking ? (
                <Volume2 className="w-5 h-5 animate-pulse" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
              <span className="text-[10px] mt-1 font-bold">
                {isListening ? 'Send Voice' : isAiSpeaking ? 'Speaking...' : 'Talk to AI'}
              </span>
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-purple-300 animate-ping"></span>
            </button>

            {/* AI Sub-Teacher Main Trigger Button */}
            <button
              onClick={() => setActiveSidePanel(activeSidePanel === 'sub_teacher' ? 'none' : 'sub_teacher')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition min-w-[52px] sm:min-w-[64px] relative cursor-pointer ${
                activeSidePanel === 'sub_teacher'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                  : 'text-purple-300 hover:bg-purple-950/40'
              }`}
              title="Open Dr. Mwape AI Co-Teacher & Substitute Assistant"
            >
              <Bot className="w-5 h-5" />
              <span className="text-[10px] mt-1">AI Co-Teacher</span>
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            </button>

            <button
              onClick={() => {
                setViewMode(viewMode === 'board' ? 'gallery' : 'board');
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition min-w-[52px] sm:min-w-[56px] ${
                viewMode === 'board'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-emerald-400 hover:bg-slate-800'
              }`}
              title="Toggle Interactive Whiteboard"
            >
              <Presentation className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-semibold">Whiteboard</span>
            </button>

            <button
              onClick={() => setActiveSidePanel(activeSidePanel === 'participants' ? 'none' : 'participants')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition min-w-[52px] sm:min-w-[56px] relative ${
                activeSidePanel === 'participants' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] mt-1">Participants</span>
              <span className="absolute top-1 right-2 bg-slate-700 text-slate-200 text-[9px] px-1 rounded-full">
                {participants.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSidePanel(activeSidePanel === 'chat' ? 'none' : 'chat')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition min-w-[52px] sm:min-w-[56px] relative ${
                activeSidePanel === 'chat' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[10px] mt-1">Chat</span>
              <span className="absolute top-1 right-2 bg-[#2D8CFF] text-white text-[9px] w-2 h-2 rounded-full"></span>
            </button>

            {/* Reactions */}
            <div className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {['👍', '👏', '🙋‍♂️', '💡', '❤️'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="hover:scale-125 transition p-1 text-sm cursor-pointer"
                  title={`Send ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsHandRaised(!isHandRaised)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition min-w-[52px] sm:min-w-[56px] ${
                isHandRaised ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400 hover:bg-slate-800'
              }`}
            >
              <Hand className="w-5 h-5" />
              <span className="text-[10px] mt-1">{isHandRaised ? 'Lower Hand' : 'Raise Hand'}</span>
            </button>
          </div>

          {/* Leave / End Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>{isHost ? 'End Class' : 'Leave Meeting'}</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
