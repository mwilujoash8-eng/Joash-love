import React, { useState } from 'react';
import {
  Grid,
  FileSpreadsheet,
  FileText,
  Video,
  GraduationCap,
  Sparkles,
  BookOpen,
  MessageSquare,
  Users,
  CreditCard,
  Calendar,
  Award,
  Shield,
  X,
  Search,
  ChevronRight,
  Globe,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface SchoolModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModule?: (moduleId: string) => void;
  onOpenGeminiAI?: () => void;
  onOpenGoogleClassroom?: () => void;
  onOpenGoogleMeet?: () => void;
  onOpenDailyCode?: () => void;
  onOpenAuditLogs?: () => void;
}

interface WebsiteModuleItem {
  id: string;
  name: string;
  category: 'academic' | 'ai' | 'community' | 'admin';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  badge?: string;
  status: 'active' | 'ready';
  actionType: 'callback' | 'navigate';
}

export const SchoolModulesModal: React.FC<SchoolModulesModalProps> = ({
  isOpen,
  onClose,
  onOpenModule,
  onOpenGeminiAI,
  onOpenGoogleClassroom,
  onOpenGoogleMeet,
  onOpenDailyCode,
  onOpenAuditLogs,
}) => {
  const { currentSchool } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const websiteModules: WebsiteModuleItem[] = [
    {
      id: 'excel_studio',
      name: 'Teacher Excel Studio',
      category: 'academic',
      description: 'Full online spreadsheet workbook engine with ECZ continuous assessment grade curves and report sync.',
      icon: FileSpreadsheet,
      iconBg: 'bg-emerald-500/10 border-emerald-500/30',
      iconColor: 'text-emerald-500',
      badge: 'Core Academic',
      status: 'active',
      actionType: 'navigate',
    },
    {
      id: 'word_studio',
      name: 'Teacher Word Studio',
      category: 'academic',
      description: 'Official document creator for lesson plans, exam question papers, and school circulars.',
      icon: FileText,
      iconBg: 'bg-blue-500/10 border-blue-500/30',
      iconColor: 'text-blue-500',
      badge: 'Document Studio',
      status: 'active',
      actionType: 'navigate',
    },
    {
      id: 'zoom_classroom',
      name: 'Zoom Virtual Classroom',
      category: 'academic',
      description: 'Embedded interactive live classes with digital blackboard notes and AI Co-Teacher.',
      icon: Video,
      iconBg: 'bg-sky-500/10 border-sky-500/30',
      iconColor: 'text-sky-500',
      badge: 'Live Video',
      status: 'active',
      actionType: 'navigate',
    },
    {
      id: 'gemini_ai',
      name: 'Gemini AI Assistant',
      category: 'ai',
      description: 'Grounded educational intelligence assistant with search citations, lesson drafting, and syllabus analysis.',
      icon: Sparkles,
      iconBg: 'bg-purple-500/10 border-purple-500/30',
      iconColor: 'text-purple-500',
      badge: 'AI Grounded',
      status: 'active',
      actionType: 'callback',
    },
    {
      id: 'study_notes',
      name: 'Smart Study Notes Maker',
      category: 'academic',
      description: 'Master ECZ lecture series across Science, Mathematics, Biology, and interactive revision quizzes.',
      icon: BookOpen,
      iconBg: 'bg-amber-500/10 border-amber-500/30',
      iconColor: 'text-amber-500',
      badge: 'ECZ Syllabus',
      status: 'active',
      actionType: 'navigate',
    },
    {
      id: 'google_classroom',
      name: 'Google Classroom Hub',
      category: 'academic',
      description: 'Direct course syncing, homework assignments distribution, and syllabus material repository.',
      icon: GraduationCap,
      iconBg: 'bg-emerald-500/10 border-emerald-500/30',
      iconColor: 'text-emerald-600',
      badge: 'Workspace',
      status: 'active',
      actionType: 'callback',
    },
    {
      id: 'google_meet',
      name: 'Google Meet Video Rooms',
      category: 'academic',
      description: 'Instant parent-teacher conferences, departmental staff meetings, and virtual consultation links.',
      icon: Video,
      iconBg: 'bg-teal-500/10 border-teal-500/30',
      iconColor: 'text-teal-600',
      badge: 'Video Call',
      status: 'active',
      actionType: 'callback',
    },
    {
      id: 'campus_stories',
      name: 'Campus Stories & Media',
      category: 'community',
      description: 'Visual stories feed highlighting student achievements, sports days, and campus updates.',
      icon: Layers,
      iconBg: 'bg-pink-500/10 border-pink-500/30',
      iconColor: 'text-pink-500',
      badge: 'Campus Feed',
      status: 'active',
      actionType: 'navigate',
    },
    {
      id: 'school_groups',
      name: 'School Groups & Channels',
      category: 'community',
      description: 'Class streams, grade forums, and parent-teacher channels with real-time academic discussions.',
      icon: Users,
      iconBg: 'bg-indigo-500/10 border-indigo-500/30',
      iconColor: 'text-indigo-500',
      badge: 'Community',
      status: 'active',
      actionType: 'navigate',
    },
    {
      id: 'fees_portal',
      name: 'Finance & Fee Billing Portal',
      category: 'admin',
      description: 'Tuition invoicing, Airtel Money, MTN MoMo, Zamtel Kwacha mobile money reconciliation.',
      icon: CreditCard,
      iconBg: 'bg-emerald-500/10 border-emerald-500/30',
      iconColor: 'text-emerald-600',
      badge: 'Mobile Money',
      status: 'active',
      actionType: 'navigate',
    },
    {
      id: 'duty_roster',
      name: 'Duty Register & Timetable',
      category: 'admin',
      description: 'Staff weekly supervision schedules, lesson period allocations, and teacher attendance tracking.',
      icon: Calendar,
      iconBg: 'bg-cyan-500/10 border-cyan-500/30',
      iconColor: 'text-cyan-600',
      badge: 'Scheduling',
      status: 'active',
      actionType: 'navigate',
    },
    {
      id: 'report_cards',
      name: 'ECZ Digital Report Cards',
      category: 'academic',
      description: 'Official terminal report cards with automated teacher remarks, grading scales, and PDF download.',
      icon: Award,
      iconBg: 'bg-rose-500/10 border-rose-500/30',
      iconColor: 'text-rose-500',
      badge: 'Grading OS',
      status: 'active',
      actionType: 'navigate',
    },
    {
      id: 'audit_trail',
      name: 'Audit Trail & Security Ledger',
      category: 'admin',
      description: 'Immutable cryptographic access log tracking all grade edits, user approvals, and passkey events.',
      icon: Shield,
      iconBg: 'bg-slate-500/10 border-slate-500/30',
      iconColor: 'text-slate-600',
      badge: 'Security',
      status: 'active',
      actionType: 'callback',
    },
  ];

  const filteredModules = websiteModules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.badge?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || module.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLaunchModule = (module: WebsiteModuleItem) => {
    onClose();
    if (module.id === 'gemini_ai' && onOpenGeminiAI) {
      onOpenGeminiAI();
    } else if (module.id === 'google_classroom' && onOpenGoogleClassroom) {
      onOpenGoogleClassroom();
    } else if (module.id === 'google_meet' && onOpenGoogleMeet) {
      onOpenGoogleMeet();
    } else if (module.id === 'audit_trail' && onOpenAuditLogs) {
      onOpenAuditLogs();
    } else if (onOpenModule) {
      onOpenModule(module.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  School Website Portal Modules
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  13 Web Modules
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Integrated academic, communication, and management website tools for {currentSchool.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search website modules & tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Modules' },
              { id: 'academic', label: 'Academic & Class' },
              { id: 'ai', label: 'AI Assistant' },
              { id: 'community', label: 'Community' },
              { id: 'admin', label: 'Admin & Finance' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Website Modules */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => handleLaunchModule(module)}
                className="group p-4 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl text-left transition shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${module.iconBg} ${module.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {module.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                        {module.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition flex items-center justify-between">
                    <span>{module.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-600">
                  <span>Open Website Tool</span>
                  <span className="text-[10px] text-slate-400 font-normal">Browser Ready</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>All modules run inside standard web browsers with responsive smartphone and computer views.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition"
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>
  );
};
