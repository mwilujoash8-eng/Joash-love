import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import {
  Bot,
  User,
  Sparkles,
  Send,
  Trash2,
  Download,
  Copy,
  Check,
  Search,
  MapPin,
  ExternalLink,
  Zap,
  BrainCircuit,
  Globe,
  Compass,
  GraduationCap,
  HeartHandshake,
  Settings2,
  RefreshCw,
  Info,
  ChevronDown,
  Layers,
  FileText,
  Map,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  GeminiModelChoice,
  GroundingMode,
  ChatbotRole,
  ChatMessage,
  GroundingChunk,
} from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { sendChatMessage } from '../../services/apiClient';

interface GeminiChatbotStudioProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
  initialPrompt?: string;
  initialRole?: ChatbotRole;
}

const ROLE_PRESETS: Record<
  ChatbotRole,
  {
    name: string;
    description: string;
    icon: React.ReactNode;
    defaultModel: GeminiModelChoice;
    defaultGrounding: GroundingMode;
    badgeColor: string;
    systemInstruction: string;
    starterPrompts: string[];
  }
> = {
  moe_ecz_curriculum: {
    name: 'ECZ Curriculum & Pedagogy Specialist',
    description: 'Expert on Zambian Junior/Senior Secondary syllabi, SBA guidelines, and lesson plan formats.',
    icon: <GraduationCap className="w-4 h-4" />,
    defaultModel: 'gemini-3.5-flash',
    defaultGrounding: 'none',
    badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    systemInstruction:
      'You are the Senior Curriculum Specialist for the Examinations Council of Zambia (ECZ) and Zambian Ministry of Education (MoE). You assist educators, learners, and administrators in crafting compliant lesson plans, syllabus breakdown, Continuous Assessment (SBA) tasks, marking rubrics, and academic calendar pacing for Zambian schools (Grades 1 to 12). Always reference relevant Zambian educational contexts and standards.',
    starterPrompts: [
      'Create a 40-minute Grade 10 Mathematics lesson plan on Quadratic Equations with ECZ formative assessment.',
      'How is School-Based Assessment (SBA) weighted for Grade 12 Sciences under ECZ regulations?',
      'Draft a comprehensive biology practical rubric for testing food nutrients in maize meal and groundnuts.',
      'Explain the distinction between Grade 9 Junior Secondary and Grade 12 Senior Secondary grading scales.',
    ],
  },
  stem_pro_reasoning: {
    name: 'Deep STEM & Complex Reasoning Tutor',
    description: 'Powered by Gemini 3.1 Pro for multi-step mathematical proofs, physics derivations, and chemistry mechanisms.',
    icon: <BrainCircuit className="w-4 h-4" />,
    defaultModel: 'gemini-3.1-pro-preview',
    defaultGrounding: 'none',
    badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    systemInstruction:
      'You are an elite STEM Professor and Mathematical Reasoning Specialist powered by Gemini 3.1 Pro. Provide rigorous, step-by-step mathematical proofs, detailed physics equations, chemical reaction mechanisms, and algorithmic pseudocode. Format equations clearly with LaTeX-style notation. Break down complex multi-step reasoning systematically.',
    starterPrompts: [
      'Derive the formula for relativistic kinetic energy step by step with dimensional analysis.',
      'Solve and explain the integration of (3x^2 + 5) / (x^3 + 5x - 2) with clear boundary conditions.',
      'Explain the thermodynamic spontaneity of the Haber Process under varying temperature and pressure.',
      'Construct a recursive algorithm in pseudocode for calculating optimal school bus routes.',
    ],
  },
  search_grounded_research: {
    name: 'Live Search-Grounded Educational Researcher',
    description: 'Grounds answers with real-time Google Search data for up-to-date MoE policies, bursaries, and national news.',
    icon: <Globe className="w-4 h-4" />,
    defaultModel: 'gemini-3.5-flash',
    defaultGrounding: 'google_search',
    badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    systemInstruction:
      'You are a Real-Time Educational Researcher powered by Google Search Grounding. Provide up-to-date, fact-checked information regarding Zambian education announcements, Higher Education Loans and Scholarships Board (HELSB) bursaries, national examination timetables, and global pedagogical innovations. Always provide structured, grounded answers with citations.',
    starterPrompts: [
      'What are the latest Zambian Ministry of Education circulars regarding school term dates in 2026?',
      'Search for current Higher Education Loans and Scholarships Board (HELSB) university application requirements.',
      'Find the latest news and updates on solar power initiatives for rural Zambian schools.',
      'What are the latest international best practices for digital STEM labs in sub-Saharan Africa?',
    ],
  },
  campus_maps_navigator: {
    name: 'Campus & Regional Maps Navigator',
    description: 'Grounds answers with Google Maps data for schools, examination centers, bus transit, and emergency clinics.',
    icon: <Compass className="w-4 h-4" />,
    defaultModel: 'gemini-3.5-flash',
    defaultGrounding: 'google_maps',
    badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    systemInstruction:
      'You are the Campus & Regional Education Navigator powered by Google Maps Grounding. Assist students, parents, and teachers in finding secondary schools, universities, national examination centers, bus transit stops, libraries, and emergency clinics across Zambia (specifically Central Province, Lusaka, Copperbelt, and regional hubs). Provide geographic landmarks, accessibility details, and navigation guidance.',
    starterPrompts: [
      'Find verified secondary schools and exam centers around Kabwe and Central Province.',
      'Where is Mulungushi University Main Campus located relative to Kabwe Town Centre?',
      'Identify key hospitals and emergency clinics accessible from Highridge and Mukobeko in Kabwe.',
      'Locate major public libraries and educational resource centers in Lusaka and Central Province.',
    ],
  },
  parent_student_advisor: {
    name: 'Parent & Student Pastoral Counselor',
    description: 'Supportive guidance for career choices, study habits, student well-being, and parent-teacher synergy.',
    icon: <HeartHandshake className="w-4 h-4" />,
    defaultModel: 'gemini-3.5-flash',
    defaultGrounding: 'none',
    badgeColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    systemInstruction:
      'You are a compassionate Pastoral Counselor, Career Advisor, and Student-Parent Liaison. Offer empathetic, practical advice on student study schedules, exam anxiety management, career pathways (STEM, commerce, arts, vocational trades), and constructive communication strategies between parents and teachers.',
    starterPrompts: [
      'How can a Grade 11 student balance 8 ECZ subjects with extracurricular sports and study timetable?',
      'Draft a warm, polite message from a parent to a mathematics teacher requesting extra revision guidance.',
      'What career options are available in Zambia for students excelling in Physics, Chemistry, and Computer Studies?',
      'Suggest 5 proven techniques for managing test anxiety before national examinations.',
    ],
  },
  custom: {
    name: 'Custom System Instruction Studio',
    description: 'Define your own specialized persona, role parameters, and customized prompt guidelines.',
    icon: <Settings2 className="w-4 h-4" />,
    defaultModel: 'gemini-3.5-flash',
    defaultGrounding: 'none',
    badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    systemInstruction:
      'You are an intelligent educational assistant tailored for SchoolLink OS. Provide insightful, structured, and helpful responses.',
    starterPrompts: [
      'How can I optimize our school staff meeting agenda for maximum collaboration?',
      'Draft a grant proposal summary for installing solar backup power in science laboratories.',
    ],
  },
};

const LOCATION_PRESETS = [
  { name: 'Kabwe / Central Province', latitude: -14.4426, longitude: 28.4464 },
  { name: 'Lusaka / National Capital', latitude: -15.4167, longitude: 28.2833 },
  { name: 'Ndola / Copperbelt Province', latitude: -12.9694, longitude: 28.6366 },
  { name: 'Kitwe / Copperbelt Province', latitude: -12.8024, longitude: 28.2132 },
  { name: 'Livingstone / Southern Province', latitude: -17.8419, longitude: 25.8544 },
];

export const GeminiChatbotStudio: React.FC<GeminiChatbotStudioProps> = ({
  isOpen = true,
  onClose,
  isModal = false,
  initialPrompt = '',
  initialRole = 'moe_ecz_curriculum',
}) => {
  const { currentSchool, currentUser } = useSchool();

  // Active role & configurations
  const [selectedRole, setSelectedRole] = useState<ChatbotRole>(initialRole);
  const [model, setModel] = useState<GeminiModelChoice>(ROLE_PRESETS[initialRole].defaultModel);
  const [groundingMode, setGroundingMode] = useState<GroundingMode>(ROLE_PRESETS[initialRole].defaultGrounding);
  const [customSystemInstruction, setCustomSystemInstruction] = useState<string>(
    ROLE_PRESETS[initialRole].systemInstruction
  );
  const [selectedLocation, setSelectedLocation] = useState(LOCATION_PRESETS[0]);
  const [showRoleConfig, setShowRoleConfig] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Message state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      role: 'model',
      text: `Hello ${currentUser.fullName || 'there'}! I am **SchoolLink AI**, your Gemini-powered academic assistant for **${currentSchool.name}**.\n\n` +
        `I am configured with the **${ROLE_PRESETS[initialRole].name}** persona. How may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: ROLE_PRESETS[initialRole].defaultModel,
    },
  ]);

  const [inputQuery, setInputQuery] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Sync role change defaults
  const handleSelectRole = (newRole: ChatbotRole) => {
    setSelectedRole(newRole);
    setModel(ROLE_PRESETS[newRole].defaultModel);
    setGroundingMode(ROLE_PRESETS[newRole].defaultGrounding);
    setCustomSystemInstruction(ROLE_PRESETS[newRole].systemInstruction);
  };

  // Enforce gemini-3.5-flash when Google Search or Google Maps grounding is selected
  const handleGroundingModeChange = (mode: GroundingMode) => {
    setGroundingMode(mode);
    if (mode === 'google_search' || mode === 'google_maps') {
      setModel('gemini-3.5-flash');
    }
  };

  // Send message
  const handleSendMessage = async (queryToSend?: string) => {
    const textToSend = queryToSend || inputQuery.trim();
    if (!textToSend || isLoading) return;

    const userMessageId = `user_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update conversation thread immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Build history for backend
      // Format as array of { role: 'user' | 'model', text: string }
      const historyPayload = updatedMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      // Effective system instruction
      const effectiveSystemInstruction =
        selectedRole === 'custom'
          ? customSystemInstruction
          : `${customSystemInstruction}\n\nContextual School: ${currentSchool.name}, ${currentSchool.city}, Zambia. Active User: ${currentUser.fullName} (${currentUser.role}).`;

      const result = await sendChatMessage({
        messages: historyPayload,
        model: model,
        systemInstruction: effectiveSystemInstruction,
        groundingMode: groundingMode,
        useSearchGrounding: groundingMode === 'google_search',
        useMapsGrounding: groundingMode === 'google_maps',
        userLocation: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
      });

      const assistantMsg: ChatMessage = {
        id: `model_${Date.now()}`,
        role: 'model',
        text: result.text || 'I have processed your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: model,
        groundingChunks: [],
        searchQueries: [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'model',
        text: `⚠️ **Unable to complete response.**\n\n*Error details:* ${err.message || 'Network connection timeout'}.\n\nPlease try again or switch to another Gemini model.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all conversation history in this session?')) {
      setMessages([
        {
          id: `welcome_${Date.now()}`,
          role: 'model',
          text: `Chat cleared. Ready for a new topic with **${ROLE_PRESETS[selectedRole].name}**.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: model,
        },
      ]);
    }
  };

  const handleExportTranscript = () => {
    const transcript = messages
      .map(
        (m) =>
          `### [${m.role === 'user' ? currentUser.fullName || 'User' : 'SchoolLink AI'}] - ${m.timestamp}\n${m.text}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SchoolLink_AI_Chat_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden transition-all duration-200 ${
        isModal
          ? isFullscreen
            ? 'fixed inset-3 z-50 rounded-2xl shadow-2xl'
            : 'fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 z-50 max-w-5xl mx-auto'
          : 'w-full h-[720px]'
      }`}
    >
      {/* HEADER BAR */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate">
                SchoolLink Gemini AI Studio
              </h2>
              <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Multi-Turn Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-2">
              <span>{ROLE_PRESETS[selectedRole].name}</span>
              <span>&bull;</span>
              <span className="font-mono text-emerald-300 font-bold">{model}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowRoleConfig(!showRoleConfig)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              showRoleConfig
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Configure System Role & Grounding"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden md:inline">Role & Grounding</span>
          </button>

          <button
            type="button"
            onClick={handleExportTranscript}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Export Chat Transcript (.md)"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {isModal && (
            <>
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition hidden sm:block"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* EXPANDABLE ROLE & GROUNDING CONFIGURATION PANEL */}
      {showRoleConfig && (
        <div className="bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 text-xs space-y-4 animate-in slide-in-from-top-2 duration-150 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. ROLE PRESET SELECTOR */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chatbot Persona & Role</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => handleSelectRole(e.target.value as ChatbotRole)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {Object.entries(ROLE_PRESETS).map(([key, roleInfo]) => (
                  <option key={key} value={key}>
                    {roleInfo.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1 italic leading-tight">
                {ROLE_PRESETS[selectedRole].description}
              </p>
            </div>

            {/* 2. MODEL SELECTOR */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Gemini Model Tier</span>
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as GeminiModelChoice)}
                disabled={groundingMode !== 'none'}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
              >
                <option value="gemini-3.5-flash">gemini-3.5-flash (General & Grounding Standard)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Deep Reasoning)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Instant Ultra-Fast Q&A)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                {groundingMode !== 'none'
                  ? '🔒 Locked to gemini-3.5-flash for Search & Maps Grounding.'
                  : model === 'gemini-3.1-pro-preview'
                  ? '🧠 High-precision mathematical and curriculum reasoning.'
                  : model === 'gemini-3.1-flash-lite'
                  ? '⚡ Fast latency for quick drafts and short answers.'
                  : '✨ Versatile multimodal reasoning for general tasks.'}
              </p>
            </div>

            {/* 3. GROUNDING MODE SELECTOR */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Real-World Grounding</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleGroundingModeChange('none')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition text-center ${
                    groundingMode === 'none'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => handleGroundingModeChange('google_search')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition flex items-center justify-center gap-1 ${
                    groundingMode === 'google_search'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50'
                  }`}
                  title="Grounded with Google Search Live Web Data"
                >
                  <Search className="w-3 h-3" />
                  <span>Search</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleGroundingModeChange('google_maps')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition flex items-center justify-center gap-1 ${
                    groundingMode === 'google_maps'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50'
                  }`}
                  title="Grounded with Google Maps Place Data"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Maps</span>
                </button>
              </div>

              {/* Geographic Coordinates Picker if Maps Grounding active */}
              {groundingMode === 'google_maps' && (
                <div className="mt-2">
                  <select
                    value={selectedLocation.name}
                    onChange={(e) => {
                      const found = LOCATION_PRESETS.find((l) => l.name === e.target.value);
                      if (found) setSelectedLocation(found);
                    }}
                    className="w-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-lg px-2 py-1 text-[10px] font-semibold"
                  >
                    {LOCATION_PRESETS.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        📍 {loc.name} ({loc.latitude.toFixed(2)}, {loc.longitude.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* CUSTOM SYSTEM INSTRUCTION TEXTAREA (if Custom is chosen) */}
          {selectedRole === 'custom' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Custom System Instruction Prompt:
              </label>
              <textarea
                value={customSystemInstruction}
                onChange={(e) => setCustomSystemInstruction(e.target.value)}
                rows={2}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Give the chatbot specific guidelines, persona constraints, and output structures..."
              />
            </div>
          )}
        </div>
      )}

      {/* QUICK STATUS BAR */}
      <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${ROLE_PRESETS[selectedRole].badgeColor}`}>
            {ROLE_PRESETS[selectedRole].icon}
            <span>{ROLE_PRESETS[selectedRole].name}</span>
          </span>

          {groundingMode === 'google_search' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 animate-pulse">
              <Globe className="w-3 h-3" />
              <span>Live Google Search Grounding Active</span>
            </span>
          )}

          {groundingMode === 'google_maps' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
              <MapPin className="w-3 h-3" />
              <span>Google Maps Grounding ({selectedLocation.name})</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <span>Context: <strong>{currentSchool.code}</strong></span>
          <span>&bull;</span>
          <span>{currentUser.role.replace('_', ' ').toUpperCase()}</span>
        </div>
      </div>

      {/* SCROLLABLE CONVERSATION THREAD */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                  isUser
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : msg.isError
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-900 dark:bg-slate-800 text-emerald-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble Container */}
              <div className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Name & Time */}
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {isUser ? currentUser.fullName || 'You' : 'SchoolLink AI Assistant'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {msg.timestamp}
                  </span>
                  {msg.modelUsed && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                      {msg.modelUsed}
                    </span>
                  )}
                </div>

                {/* Message Body */}
                <div
                  className={`rounded-2xl px-4 py-3.5 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : msg.isError
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-tl-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs'
                  }`}
                >
                  <div className="prose prose-xs dark:prose-invert max-w-none break-words">
                    <Markdown>{msg.text}</Markdown>
                  </div>

                  {/* Copy Button on Hover */}
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(msg.id, msg.text)}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-black/10 hover:bg-black/20 text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* GROUNDING CITATIONS: SEARCH SOURCES */}
                {msg.groundingChunks && msg.groundingChunks.some((c) => c.web) && (
                  <div className="mt-2.5 w-full bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-bold text-[11px]">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Google Search Verified Sources:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {msg.groundingChunks
                        .filter((c) => c.web)
                        .map((chunk, idx) => {
                          const web = chunk.web!;
                          return (
                            <a
                              key={idx}
                              href={web.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900 hover:border-blue-400 text-blue-700 dark:text-blue-300 transition group"
                            >
                              <span className="truncate text-[11px] font-medium group-hover:underline">
                                {web.title || web.uri}
                              </span>
                              <ExternalLink className="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
                            </a>
                          );
                        })}
                    </div>

                    {msg.searchQueries && msg.searchQueries.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-1 text-[10px] text-slate-500">
                        <span className="font-semibold">Search Queries:</span>
                        {msg.searchQueries.map((q, idx) => (
                          <span key={idx} className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900 font-mono">
                            "{q}"
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* GROUNDING CITATIONS: MAPS PLACES */}
                {msg.groundingChunks && msg.groundingChunks.some((c) => c.maps) && (
                  <div className="mt-2.5 w-full bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Google Maps Verified Places & Landmarks:</span>
                    </div>

                    <div className="space-y-2">
                      {msg.groundingChunks
                        .filter((c) => c.maps)
                        .map((chunk, idx) => {
                          const mapItem = chunk.maps!;
                          return (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900 space-y-1"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-slate-900 dark:text-white text-xs">
                                  📍 {mapItem.title}
                                </span>
                                {mapItem.uri && (
                                  <a
                                    href={mapItem.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1 hover:underline shrink-0"
                                  >
                                    <span>Open in Maps</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>

                              {mapItem.placeAnswerSources?.reviewSnippets && mapItem.placeAnswerSources.reviewSnippets.length > 0 && (
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                                  "{mapItem.placeAnswerSources.reviewSnippets[0].snippet}"
                                </p>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* LOADING STATE INDICATOR */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center animate-pulse shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-xs px-4 py-3 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span className="font-semibold">
                  Thinking with <strong>{model}</strong>...
                </span>
              </div>
              {groundingMode === 'google_search' && (
                <p className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  <span>Grounding response with real-time Google Search data...</span>
                </p>
              )}
              {groundingMode === 'google_maps' && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Grounding response with Google Maps geospatial database...</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* STARTER PROMPT SUGGESTIONS (if few messages) */}
      {messages.length <= 2 && (
        <div className="px-4 sm:px-6 py-2 bg-slate-50/50 dark:bg-slate-850/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Suggested Prompts for {ROLE_PRESETS[selectedRole].name}:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {ROLE_PRESETS[selectedRole].starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap text-left text-xs bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 transition shadow-2xs shrink-0"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* INPUT THREAD FORM */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${ROLE_PRESETS[selectedRole].name}... (Press Enter to send, Shift+Enter for new line)`}
              rows={2}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>
            Powered by <strong>Google Gemini API</strong> &bull; Google Search & Maps Grounding
          </span>
          <span className="font-mono">
            {messages.length} message{messages.length !== 1 ? 's' : ''} in thread
          </span>
        </div>
      </div>
    </div>
  );
};
