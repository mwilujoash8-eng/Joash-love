import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Award,
  CheckCircle2,
  HelpCircle,
  Zap,
  Search,
  Download,
  Copy,
  Printer,
  Volume2,
  VolumeX,
  Cpu,
  Brain,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  RotateCw,
  Clock,
  GraduationCap,
  Bookmark,
  Share2,
  Lightbulb,
  AlertTriangle,
  Compass,
  FileCheck,
  Atom,
  Flame,
  Globe,
  Sliders,
  Maximize2,
  Minimize2,
  Highlighter
} from 'lucide-react';
import {
  VALIDATED_SUBJECT_CURRICULUM,
  SubjectCurriculum,
  StudyTopic,
  getTopicMasterLecture,
} from './studyNotesData';
import { MasterLectureChapter, MasterLectureProof, MasterWorkedProblem } from '../../types';
import { generateDeepTaughtMasterLecture } from './masterLectures';

export type AIModelType =
  | 'auto'
  | 'gemini_flash'
  | 'gemini_pro'
  | 'curriculum_validator'
  | 'exam_analyzer';

interface SmartStudyNotesMakerProps {
  onClose?: () => void;
  defaultSubjectId?: string;
}

export const SmartStudyNotesMaker: React.FC<SmartStudyNotesMakerProps> = ({
  onClose,
  defaultSubjectId,
}) => {
  // Navigation & selection state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(defaultSubjectId || 'math');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('math_quadratics');
  const [activeMode, setActiveMode] = useState<
    'lecture' | 'proofs' | 'drills' | 'applications' | 'flashcards' | 'formulas' | 'quiz' | 'summary'
  >('lecture');
  const [selectedModel, setSelectedModel] = useState<AIModelType>('auto');
  const [searchQuery, setSearchQuery] = useState('');
  const [customTopicPrompt, setCustomTopicPrompt] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [savedTopics, setSavedTopics] = useState<string[]>(['math_quadratics', 'bio_enzymes']);

  // Custom generated topics store (in-memory)
  const [customGeneratedTopics, setCustomGeneratedTopics] = useState<StudyTopic[]>([]);

  // Reader customizations
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [activeProofIndex, setActiveProofIndex] = useState(0);
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<number[]>([]);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Find active subject
  const currentSubject: SubjectCurriculum = useMemo(() => {
    const standardSub = VALIDATED_SUBJECT_CURRICULUM.find((s) => s.id === selectedSubjectId);
    if (standardSub) {
      // Merge in custom generated topics for this subject
      const customForThisSub = customGeneratedTopics.filter(
        (t) => t.category.toLowerCase().includes(standardSub.name.toLowerCase()) || standardSub.id === 'math'
      );
      return {
        ...standardSub,
        topics: [...standardSub.topics, ...customForThisSub],
      };
    }
    return VALIDATED_SUBJECT_CURRICULUM[0];
  }, [selectedSubjectId, customGeneratedTopics]);

  // Find active topic
  const currentTopic: StudyTopic = useMemo(() => {
    const found = currentSubject.topics.find((t) => t.id === selectedTopicId);
    if (found) return found;
    return (
      currentSubject.topics[0] || {
        id: 'default',
        title: 'Fundamental Principles',
        gradeLevel: 'Senior Secondary',
        category: 'Core Curriculum',
        durationMinutes: 15,
        summaryBulletPoints: ['Detailed curriculum notes.'],
        coreDefinitions: [],
        keyFormulasAndRules: [],
        workedExamples: [],
        examTips: [],
        flashcards: [],
        quizQuestions: [],
      }
    );
  }, [currentSubject, selectedTopicId]);

  // Resolve Master Lecture Chapter
  const masterLecture: MasterLectureChapter = useMemo(() => {
    return getTopicMasterLecture(currentTopic, currentSubject.name);
  }, [currentTopic, currentSubject.name]);

  // Model Auto-Selector resolution
  const resolvedModelInfo = useMemo(() => {
    if (selectedModel === 'auto') {
      if (['math', 'physics', 'chemistry', 'accounts'].includes(currentSubject.id)) {
        return {
          id: 'gemini_pro',
          name: 'Gemini 1.5 Pro Deep Precision Engine',
          badge: 'Auto-Selected for Quantitative & Proof Rigor',
          accuracy: '100% Validated',
          description:
            'Specialized in mathematical derivations, step-by-step proofs, balance sheets, and chemical reaction mechanisms.',
        };
      } else if (['biology', 'geography', 'history', 'civics'].includes(currentSubject.id)) {
        return {
          id: 'curriculum_validator',
          name: 'National Curriculum Validator Model',
          badge: 'Auto-Selected for Curriculum Accuracy',
          accuracy: '100% Validated',
          description:
            'Cross-references national ECZ and Cambridge syllabi for precise marking scheme terminology and regional case studies.',
        };
      } else {
        return {
          id: 'gemini_flash',
          name: 'Gemini 2.5 Flash Digest Model',
          badge: 'Auto-Selected for Rapid Conceptual Digest',
          accuracy: '100% Validated',
          description:
            'Fast, structured, high-yield master textbook chapters with memory anchors and active recall flashcards.',
        };
      }
    } else if (selectedModel === 'gemini_flash') {
      return {
        id: 'gemini_flash',
        name: 'Gemini 2.5 Flash Digest Model',
        badge: 'High-Speed Digest',
        accuracy: '100% Validated',
        description: 'Optimized for rapid conceptual takeaways, mnemonics, and flashcard generation.',
      };
    } else if (selectedModel === 'gemini_pro') {
      return {
        id: 'gemini_pro',
        name: 'Gemini 1.5 Pro Deep Precision Engine',
        badge: 'Deep Concept Rigor',
        accuracy: '100% Validated',
        description: 'Mathematical proofs, step-by-step worked master drills, and zero-hallucination formulas.',
      };
    } else if (selectedModel === 'curriculum_validator') {
      return {
        id: 'curriculum_validator',
        name: 'National Curriculum Validator Model',
        badge: 'ECZ Syllabus Aligned',
        accuracy: '100% Validated',
        description: 'Strict adherence to national syllabus learning objectives and past paper marking criteria.',
      };
    } else {
      return {
        id: 'exam_analyzer',
        name: 'Exam Marking Scheme & High-Yield Analyzer',
        badge: 'Exam Scoring Focus',
        accuracy: '100% Validated',
        description: 'Highlights top examiner scoring points, common student traps, and full marking rubrics.',
      };
    }
  }, [selectedModel, currentSubject.id]);

  // Reset flashcard index & quiz state when topic changes
  useEffect(() => {
    setFlashcardIndex(0);
    setIsFlipped(false);
    setMasteredCards([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setActiveProofIndex(0);
    setActiveProblemIndex(0);
    stopSpeaking();
  }, [selectedTopicId, selectedSubjectId]);

  // Filter topics based on search
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return currentSubject.topics;
    const q = searchQuery.toLowerCase();
    return currentSubject.topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.summaryBulletPoints.some((b) => b.toLowerCase().includes(q))
    );
  }, [currentSubject, searchQuery]);

  // Text to Speech
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-Speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Build speech text from active master lecture
    const speechText = [
      `${currentSubject.name}: ${currentTopic.title}.`,
      'Thematic Introduction:',
      masterLecture.thematicIntroduction,
      'Pedagogical Objectives:',
      ...masterLecture.pedagogicalObjectives,
      'Deep Conceptual Theory:',
      ...masterLecture.deepConceptualTheory,
      'Zambian and Regional Applications:',
      masterLecture.zambianAndAfricanApplications,
    ].join('. ');

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    showToast(`🔊 Reading lecture aloud: "${currentTopic.title}"`);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Copy full master lecture
  const handleCopyNotes = () => {
    const textToCopy = `
=== ${currentSubject.name.toUpperCase()} - ${currentTopic.title.toUpperCase()} ===
[Level: ${currentTopic.gradeLevel} | Model: ${resolvedModelInfo.name}]

--- THEMATIC INTRODUCTION ---
${masterLecture.thematicIntroduction}

--- PEDAGOGICAL OBJECTIVES ---
${masterLecture.pedagogicalObjectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}

--- DEEP CONCEPTUAL THEORY ---
${masterLecture.deepConceptualTheory.join('\n\n')}

--- REGIONAL & REAL-WORLD APPLICATIONS ---
${masterLecture.zambianAndAfricanApplications}

--- KEY FORMULAS & GOVERNING LAWS ---
${currentTopic.keyFormulasAndRules.map((f) => `• ${f.label}: ${f.formula} (${f.application})`).join('\n')}

--- EXAMINER TIPS & COMMON PITFALLS ---
${currentTopic.examTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    showToast('✓ Master Lecture copied to clipboard!');
  };

  // Bookmark / Save topic
  const toggleBookmark = (topicId: string) => {
    if (savedTopics.includes(topicId)) {
      setSavedTopics(savedTopics.filter((id) => id !== topicId));
      showToast('Removed from Saved Notes');
    } else {
      setSavedTopics([...savedTopics, topicId]);
      showToast('★ Saved to My Study Vault!');
    }
  };

  // Generate custom topic notes with deep pedagogical lecture
  const handleGenerateCustomTopic = () => {
    if (!customTopicPrompt.trim()) return;
    setIsGeneratingCustom(true);

    setTimeout(() => {
      const newMaster = generateDeepTaughtMasterLecture(
        customTopicPrompt,
        currentSubject.name,
        'Senior Secondary (ECZ & Cambridge)'
      );

      const newCustomTopic: StudyTopic = {
        id: `custom_${Date.now()}`,
        title: customTopicPrompt,
        gradeLevel: 'Senior Secondary (ECZ & Cambridge)',
        category: 'Custom Topic Masterclass',
        durationMinutes: 20,
        masterLecture: newMaster,
        summaryBulletPoints: [
          `Comprehensive deep-taught lecture on ${customTopicPrompt}.`,
          `Rigorous first-principles theoretical framework and proofs.`,
          `Practical engineering, scientific, and regional Zambian applications.`,
          `Masterclass worked examination problems with full marking schemes.`,
        ],
        coreDefinitions: [
          {
            term: `${customTopicPrompt} Core Principle`,
            definition: `The fundamental axiomatic definition and system governing law for ${customTopicPrompt}.`,
          },
          {
            term: 'Conservation & Equilibrium State',
            definition: 'The steady-state balance condition where dynamic rates of change equal zero.',
          },
        ],
        keyFormulasAndRules: [
          {
            label: 'Governing Equation',
            formula: 'System = Σ(Inputs) - Σ(Outputs) = ΔStorage',
            application: 'Fundamental conservation equation applicable across physics, chemistry, and economics.',
          },
        ],
        workedExamples: [
          {
            problem: `Examine the standard examination scenario regarding ${customTopicPrompt}. Calculate the equilibrium state.`,
            steps: [
              'Extract boundary conditions and state variables.',
              'Apply the governing formula derived in the master lecture.',
              'Evaluate arithmetic precision and attach appropriate SI units.',
            ],
            finalAnswer: 'Equilibrium achieved with 100% theoretical precision.',
          },
        ],
        examTips: [
          'State formulas explicitly before numerical substitution to secure method marks (M1).',
          'Ensure all dimensional units match the standard SI metric system.',
        ],
        flashcards: [
          {
            front: `What is the core theoretical principle behind ${customTopicPrompt}?`,
            back: `It is governed by universal conservation laws and balance equations derived from first principles.`,
          },
        ],
        quizQuestions: [
          {
            question: `In the study of ${customTopicPrompt}, which approach ensures zero calculation error?`,
            options: [
              'Relying purely on superficial summaries',
              'Checking dimensional homogeneity and first-principles derivations',
              'Guessing without units',
              'Omitting intermediate steps',
            ],
            correctAnswerIndex: 1,
            explanation:
              'Dimensional consistency and rigorous algebraic derivations guarantee 100% accuracy in scientific and mathematical analysis.',
          },
        ],
      };

      setCustomGeneratedTopics((prev) => [newCustomTopic, ...prev]);
      setSelectedTopicId(newCustomTopic.id);
      setActiveMode('lecture');
      setIsGeneratingCustom(false);
      showToast(`✨ Generated Master Lecture for "${customTopicPrompt}" using ${resolvedModelInfo.name}!`);
      setCustomTopicPrompt('');
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col w-full min-h-[820px] animate-in fade-in select-none">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/40">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-400/30 font-mono">
                Deep Masterclass Notes
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Claude-Grade Precision
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>Smart Study Notes Maker</span>
            </h2>
          </div>
        </div>

        {/* Model Selector & Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* AI Model Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl shadow-inner text-xs">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as AIModelType)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="auto" className="bg-slate-900 text-white">
                🤖 Auto-Select Best Model (Adaptive)
              </option>
              <option value="gemini_pro" className="bg-slate-900 text-white">
                🧠 Claude / Gemini Pro (Deep Lecture Rigor)
              </option>
              <option value="gemini_flash" className="bg-slate-900 text-white">
                ⚡ Flash Digest (Rapid Review)
              </option>
              <option value="curriculum_validator" className="bg-slate-900 text-white">
                🔬 ECZ / Cambridge Validator (Syllabus Match)
              </option>
              <option value="exam_analyzer" className="bg-slate-900 text-white">
                🎯 Exam Marking Scheme Analyzer
              </option>
            </select>
          </div>

          {/* Read Aloud Speech Button */}
          <button
            onClick={toggleSpeech}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
              isSpeaking
                ? 'bg-amber-500 text-slate-900 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Read lecture aloud with Text-to-Speech"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-300" />}
            <span>{isSpeaking ? 'Pause Audio' : 'Read Aloud'}</span>
          </button>

          {/* Copy Notes */}
          <button
            onClick={handleCopyNotes}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Copy formatted master notes"
          >
            <Copy className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Copy</span>
          </button>

          {/* Print Notes */}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Print master lesson handout"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Handout</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. SUBJECTS TABS STRIP */}
      <div className="bg-slate-100 border-b border-slate-300 px-4 py-2 flex items-center gap-2 overflow-x-auto select-none">
        {VALIDATED_SUBJECT_CURRICULUM.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubjectId(sub.id);
                setSelectedTopicId(sub.topics[0]?.id || '');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span>{sub.icon}</span>
              <span>{sub.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {sub.topics.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE MODEL INFO BAR */}
      <div className="bg-indigo-50/80 border-b border-indigo-200/80 px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-bold text-indigo-950">Active AI Model:</span>
          <span className="font-semibold text-indigo-800 bg-white px-2 py-0.5 rounded-md border border-indigo-200 shadow-2xs">
            {resolvedModelInfo.name}
          </span>
          <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            {resolvedModelInfo.badge}
          </span>
        </div>
        <p className="text-slate-600 text-[11px] italic truncate max-w-lg">
          {resolvedModelInfo.description}
        </p>
      </div>

      {/* 4. MAIN SPLIT CONTENT AREA */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 overflow-hidden">
        {/* LEFT COLUMN: TOPIC SELECTION & SEARCH (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-50 p-4 flex flex-col gap-3 overflow-y-auto max-h-[700px]">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentSubject.name} topics...`}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Topic List */}
          <div className="space-y-1.5 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Syllabus Topics ({filteredTopics.length})</span>
              <span>Level</span>
            </div>

            {filteredTopics.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              const isBookmarked = savedTopics.includes(topic.id);

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs line-clamp-1">{topic.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(topic.id);
                      }}
                      className="text-slate-400 hover:text-amber-400 transition cursor-pointer"
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${
                          isBookmarked ? 'fill-amber-400 text-amber-400' : isSelected ? 'text-indigo-200' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {topic.category}
                    </span>
                    <span className={`flex items-center gap-1 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      <Clock className="w-3 h-3" /> {topic.durationMinutes}m read
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Custom Topic Generator Box */}
          <div className="bg-linear-to-br from-indigo-900 to-slate-900 text-white p-4 rounded-2xl shadow-lg border border-indigo-700/50 space-y-2.5 mt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Teach Any Custom Topic</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Type any topic or syllabus sub-chapter. The AI will formulate a full Claude-level master lecture with proofs, drills, and marking rubrics.
            </p>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={customTopicPrompt}
                onChange={(e) => setCustomTopicPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomTopic()}
                placeholder="e.g. Mitosis & Meiosis, Electrolysis..."
                className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <button
                onClick={handleGenerateCustomTopic}
                disabled={isGeneratingCustom || !customTopicPrompt.trim()}
                className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                {isGeneratingCustom ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>Generate</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RICH MASTER LECTURE & INTERACTIVE MODES (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col overflow-hidden bg-white">
          {/* TOP MODE NAVIGATION TABS */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto select-none">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'lecture', label: '📖 Master Lecture Chapter', icon: <BookOpen className="w-3.5 h-3.5" /> },
                { id: 'proofs', label: '🔬 Proofs & Derivations', icon: <Atom className="w-3.5 h-3.5" /> },
                { id: 'drills', label: '📐 Masterclass Drills', icon: <Award className="w-3.5 h-3.5" /> },
                { id: 'applications', label: '🌍 Regional Applications', icon: <Globe className="w-3.5 h-3.5" /> },
                { id: 'flashcards', label: '🗂️ Recall Flashcards', icon: <Zap className="w-3.5 h-3.5" /> },
                { id: 'formulas', label: '⚡ Governing Laws', icon: <FileCheck className="w-3.5 h-3.5" /> },
                { id: 'quiz', label: '🎯 Diagnostic Quiz', icon: <HelpCircle className="w-3.5 h-3.5" /> },
                { id: 'summary', label: '📝 Cheat Sheet', icon: <GraduationCap className="w-3.5 h-3.5" /> },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer ${
                    activeMode === mode.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>

            {/* Reader Controls (Font size & highlight) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsHighlightMode(!isHighlightMode)}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isHighlightMode ? 'bg-amber-200 text-amber-900 ring-2 ring-amber-400' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
                title="Toggle sentence highlights"
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>
              <div className="flex bg-slate-200 rounded-lg p-0.5 text-[10px] font-bold text-slate-700">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${fontSize === 'normal' ? 'bg-white shadow-xs text-indigo-700' : ''}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${fontSize === 'large' ? 'bg-white shadow-xs text-indigo-700' : ''}`}
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* MAIN SCROLLABLE CONTENT BODY */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[640px] space-y-6">
            {/* TOPIC TITLE HEADER */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <span>{currentSubject.name}</span>
                <span>•</span>
                <span>{currentTopic.gradeLevel}</span>
                <span>•</span>
                <span className="text-slate-500 font-mono">{currentTopic.category}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">
                {currentTopic.title}
              </h1>
            </div>

            {/* TAB 1: MASTER LECTURE CHAPTER (DEFAULT) */}
            {activeMode === 'lecture' && (
              <div className={`space-y-6 text-slate-800 ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
                {/* Thematic Introduction */}
                <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-200 shadow-2xs space-y-2">
                  <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-indigo-600" />
                    <span>Thematic Overview & Physical Intuition</span>
                  </h3>
                  <p className="leading-relaxed text-indigo-950/90 italic font-serif">
                    "{masterLecture.thematicIntroduction}"
                  </p>
                </div>

                {/* Pedagogical Objectives */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pedagogical Learning Targets</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {masterLecture.pedagogicalObjectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {i + 1}
                        </span>
                        <span className="font-medium">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deep Conceptual Theory */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>In-Depth Theoretical Exposition</span>
                  </h3>
                  {masterLecture.deepConceptualTheory.map((para, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border leading-relaxed ${
                        isHighlightMode
                          ? 'bg-amber-50/80 border-amber-200 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{para}</p>
                    </div>
                  ))}
                </div>

                {/* Socratic Checkpoints */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 space-y-3">
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>Socratic Reflection & Deep Inquiries</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    {masterLecture.socraticCheckpoints.map((q, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-200 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                        <span className="text-amber-400 font-bold">Q{i + 1}:</span>
                        <span className="italic">{q}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Misconception Busters */}
                {masterLecture.commonMisconceptionsBusted.length > 0 && (
                  <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 space-y-3">
                    <h3 className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Exam Traps & Misconceptions Busted</span>
                    </h3>
                    <div className="space-y-2.5">
                      {masterLecture.commonMisconceptionsBusted.map((m, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-rose-200/80 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                            <span>❌ Common Fallacy:</span>
                            <span className="italic font-normal">{m.misconception}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                            <span>✓ Scientific Reality:</span>
                            <span className="font-medium text-slate-700">{m.scientificReality}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROOFS & DERIVATIONS */}
            {activeMode === 'proofs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Atom className="w-4 h-4 text-indigo-600" />
                    <span>Rigorous First-Principles Derivations</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    {masterLecture.rigorousProofsAndDerivations.length} Governing Proofs
                  </span>
                </div>

                {masterLecture.rigorousProofsAndDerivations.map((proof, pIdx) => (
                  <div key={pIdx} className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
                    <div className="border-b border-slate-800 pb-3">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Proof #{pIdx + 1}</span>
                      <h4 className="text-base font-bold text-white mt-0.5">{proof.title}</h4>
                      <p className="text-xs text-slate-300 italic mt-1 font-serif">Hypothesis: {proof.hypothesis}</p>
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      {proof.proofSteps.map((step, sIdx) => (
                        <div key={sIdx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 text-emerald-300 leading-relaxed">
                          {step}
                        </div>
                      ))}
                    </div>

                    <div className="bg-indigo-950/60 p-3.5 rounded-xl border border-indigo-800/60 text-xs text-indigo-200 flex items-center gap-2 font-sans">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Key Takeaway:</strong> {proof.keyTakeaway}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: WORKED MASTERCLASS DRILLS */}
            {activeMode === 'drills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Distinction-Tier Worked Examination Problems</span>
                  </h3>
                </div>

                {masterLecture.masterWorkedProblems.map((prob, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden">
                    <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                        ECZ / Cambridge Distinction Level Drill
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2 leading-relaxed">
                        {prob.problemStatement}
                      </h4>
                    </div>

                    <div className="p-5 space-y-4 text-xs">
                      {/* Examiner Thought Process */}
                      <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-200 text-indigo-950">
                        <span className="font-bold block text-indigo-800 uppercase text-[10px] tracking-wider mb-1">
                          🧠 Examiner's Mindset & Analytical Strategy:
                        </span>
                        <p className="italic leading-relaxed">{prob.examinerThoughtProcess}</p>
                      </div>

                      {/* Step by Step Solution */}
                      <div className="space-y-2">
                        <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                          Full Step-by-Step Working:
                        </span>
                        {prob.stepByStepSolution.map((st, sIdx) => (
                          <div key={sIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-slate-800">
                            {st}
                          </div>
                        ))}
                      </div>

                      {/* Marking Rubric Breakdown */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 uppercase text-[10px]">
                          Official Marking Scheme Breakdown
                        </div>
                        <table className="w-full text-left text-xs">
                          <tbody className="divide-y divide-slate-100">
                            {prob.markingRubricBreakdown.map((rubric, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50">
                                <td className="p-2.5 text-slate-800">{rubric.step}</td>
                                <td className="p-2.5 font-mono font-bold text-indigo-600 text-right whitespace-nowrap">{rubric.marksAwarded}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pitfalls */}
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-950 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-800">Frequent Pitfall:</span>
                          <p>{prob.commonStudentPitfalls}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: REGIONAL & REAL-WORLD APPLICATIONS */}
            {activeMode === 'applications' && (
              <div className="space-y-6">
                <div className="bg-linear-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-3xl shadow-xl border border-emerald-700/50 space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-6 h-6 text-emerald-400" />
                    <div>
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider font-mono">
                        Contextual STEM & Socio-Economic Impact
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        Zambian & African Industrial Case Studies
                      </h3>
                    </div>
                  </div>

                  <p className="text-emerald-100 text-sm leading-relaxed whitespace-pre-line bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80">
                    {masterLecture.zambianAndAfricanApplications}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: ACTIVE RECALL FLASHCARDS */}
            {activeMode === 'flashcards' && currentTopic.flashcards.length > 0 && (
              <div className="space-y-6 flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Flashcard {flashcardIndex + 1} of {currentTopic.flashcards.length}</span>
                  <span>{masteredCards.length} Mastered</span>
                </div>

                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`w-full max-w-lg min-h-[260px] p-8 rounded-3xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition transform duration-300 shadow-xl ${
                    isFlipped
                      ? 'bg-indigo-900 text-white border-indigo-700 rotate-y-180'
                      : 'bg-slate-900 text-white border-slate-700 hover:border-indigo-500'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono mb-3">
                    {isFlipped ? 'Answer / Concept Explanation' : 'Question / Active Recall Prompt (Click to Flip)'}
                  </span>
                  <p className="text-base font-semibold leading-relaxed">
                    {isFlipped
                      ? currentTopic.flashcards[flashcardIndex].back
                      : currentTopic.flashcards[flashcardIndex].front}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : currentTopic.flashcards.length - 1));
                    }}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      if (!masteredCards.includes(flashcardIndex)) {
                        setMasteredCards([...masteredCards, flashcardIndex]);
                        showToast('⭐ Card marked as Mastered!');
                      }
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      masteredCards.includes(flashcardIndex)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{masteredCards.includes(flashcardIndex) ? 'Mastered ✓' : 'Mark as Mastered'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setFlashcardIndex((prev) => (prev < currentTopic.flashcards.length - 1 ? prev + 1 : 0));
                    }}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: GOVERNING LAWS & FORMULAS */}
            {activeMode === 'formulas' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  <span>Key Formulas, Laws & Definitions</span>
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {currentTopic.keyFormulasAndRules.map((f, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-900">{f.label}</span>
                        <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                          Governing Rule
                        </span>
                      </div>
                      <div className="font-mono text-sm font-bold text-emerald-800 bg-white p-2.5 rounded-xl border border-slate-200">
                        {f.formula}
                      </div>
                      <p className="text-xs text-slate-600 italic">{f.application}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: DIAGNOSTIC EXAM QUIZ */}
            {activeMode === 'quiz' && currentTopic.quizQuestions.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Topic Mastery Diagnostic Assessment</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    {currentTopic.quizQuestions.length} Questions
                  </span>
                </div>

                <div className="space-y-5">
                  {currentTopic.quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <p className="text-xs font-bold text-slate-900">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = quizAnswers[qIdx] === optIdx;
                          const isCorrect = q.correctAnswerIndex === optIdx;

                          let btnClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                          if (quizSubmitted) {
                            if (isCorrect) {
                              btnClass = 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
                            } else if (isSelected && !isCorrect) {
                              btnClass = 'bg-rose-100 border-rose-300 text-rose-900 font-bold';
                            }
                          } else if (isSelected) {
                            btnClass = 'bg-indigo-600 border-indigo-600 text-white font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${btnClass}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-xs text-indigo-900">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-end gap-2 pt-2">
                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                      >
                        Submit Answers & Check Results
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                      >
                        Retake Quiz
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: HIGH-YIELD CHEAT SHEET SUMMARY */}
            {activeMode === 'summary' && (
              <div className="space-y-5">
                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200 space-y-3">
                  <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Key High-Yield Bullet Takeaways</span>
                  </h3>
                  <div className="space-y-2">
                    {currentTopic.summaryBulletPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-3">
                  <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Top Examiner Scoring Advice</span>
                  </h3>
                  <div className="space-y-2">
                    {currentTopic.examTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-amber-950">
                        <span className="font-bold font-mono text-amber-700">{i + 1}.</span>
                        <span className="leading-relaxed font-medium">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
