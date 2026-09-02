import React, { useState } from 'react';
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Award,
  Shield,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  MessageSquare,
  FileText,
  Video,
  FileSpreadsheet,
  Globe,
  Search,
  Send,
  HelpCircle,
  Layers,
  Zap,
  Menu,
  X,
  Star,
  Check
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { getZambianTermsForYear } from '../../utils/zambianCalendar';
import { UserRole } from '../../types';

interface SchoolPublicWebsiteProps {
  onEnterPortal: (suggestedRole?: UserRole) => void;
  onOpenDailyCode?: () => void;
  onOpenCreateSchool?: () => void;
}

export const SchoolPublicWebsite: React.FC<SchoolPublicWebsiteProps> = ({
  onEnterPortal,
  onOpenDailyCode,
  onOpenCreateSchool,
}) => {
  const { currentSchool, schools, switchSchool, announcements, currentUser, isAuthenticated } = useSchool();

  const [activeNav, setActiveNav] = useState<'home' | 'academics' | 'admissions' | 'circulars' | 'campus' | 'contact'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Online Admission Inquiry State
  const [applicantName, setApplicantName] = useState('');
  const [applicantGrade, setApplicantGrade] = useState('Grade 8');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+260 977 ');
  const [parentEmail, setParentEmail] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [admissionSuccessMsg, setAdmissionSuccessMsg] = useState<string | null>(null);
  const [admissionErrorMsg, setAdmissionErrorMsg] = useState<string | null>(null);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  // Search filter for circulars
  const [circularSearch, setCircularSearch] = useState('');

  const termDates = getZambianTermsForYear(2026);

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdmissionErrorMsg(null);
    if (!applicantName.trim() || !parentPhone.trim()) {
      setAdmissionErrorMsg('Please provide both the applicant student name and parent contact number.');
      return;
    }
    setIsSubmittingInquiry(true);
    setTimeout(() => {
      setIsSubmittingInquiry(false);
      const refNumber = 'ADM-2026-' + Math.floor(100000 + Math.random() * 900000);
      setAdmissionSuccessMsg(
        `Thank you ${parentName || 'Parent'}! Admission inquiry for ${applicantName} (${applicantGrade}) has been registered with Lusaka Admissions Desk. Reference: ${refNumber}. An SMS confirmation has been dispatched to ${parentPhone}.`
      );
      setApplicantName('');
      setParentName('');
      setPreviousSchool('');
      setInquiryNotes('');
    }, 900);
  };

  const circularsList = announcements || [];
  const filteredCirculars = circularsList.filter((c) =>
    c.title.toLowerCase().includes(circularSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(circularSearch.toLowerCase()) ||
    c.content.toLowerCase().includes(circularSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* AUTHENTICATED ACTIVE SESSION BANNER */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-4 py-2.5 text-xs font-semibold flex flex-wrap items-center justify-between gap-2 shadow-inner border-b border-emerald-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>
              Signed in to {currentSchool.name} as <strong>{currentUser?.fullName || 'User'}</strong> ({currentUser?.role ? currentUser.role.replace(/_/g, ' ').toUpperCase() : 'USER'})
            </span>
          </div>
          <button
            type="button"
            onClick={() => onEnterPortal()}
            className="bg-white hover:bg-emerald-50 text-emerald-900 px-3.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <span>Return to My Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. TOP ANNOUNCEMENT & CONTACT BAR */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Institutional Website</span>
            </div>
            <span className="hidden md:inline text-slate-600">|</span>
            {/* Institution Switcher */}
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                aria-label="Switch School Website"
                value={currentSchool.id}
                onChange={(e) => {
                  if (e.target.value === 'CREATE_NEW') {
                    if (onOpenCreateSchool) onOpenCreateSchool();
                  } else {
                    switchSchool(e.target.value);
                  }
                }}
                className="bg-slate-900 text-slate-200 border border-slate-700 rounded-md px-2 py-0.5 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
                {onOpenCreateSchool && <option value="CREATE_NEW">+ Register New School...</option>}
              </select>
            </div>
            <span className="hidden md:inline text-slate-600">|</span>
            <div className="hidden md:flex items-center gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentSchool.city}, {currentSchool.province}, Zambia</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+260 775 777069</span>
            </div>
            <span className="text-slate-700">|</span>
            {onOpenDailyCode && (
              <button
                type="button"
                onClick={onOpenDailyCode}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                National Passkey Portal
              </button>
            )}
            <span className="text-slate-700">|</span>
            <button
              type="button"
              onClick={() => onEnterPortal()}
              className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-2.5 py-0.5 rounded-full transition cursor-pointer"
            >
              {isAuthenticated ? 'Go to My Dashboard' : 'Portal Login'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN WEBSITE NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 font-black text-xl">
              {currentSchool.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                  {currentSchool.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Zambian Ministry of Education & ECZ Registered Centre • Centre Code #{currentSchool.code}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700">
            {[
              { id: 'home', label: 'Home' },
              { id: 'academics', label: 'Academics & ECZ' },
              { id: 'admissions', label: 'Admissions' },
              { id: 'circulars', label: 'Circulars & Notices' },
              { id: 'campus', label: 'Campus Life' },
              { id: 'contact', label: 'Contact Us' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id as any)}
                className={`px-3.5 py-2 rounded-xl transition ${
                  activeNav === item.id
                    ? 'text-emerald-700 bg-emerald-50 font-bold'
                    : 'hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Portal Gateway CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveNav('admissions')}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold transition"
            >
              Apply Online
            </button>
            <button
              type="button"
              onClick={() => onEnterPortal()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'School Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {[
              { id: 'home', label: 'Home' },
              { id: 'academics', label: 'Academics & ECZ Curriculum' },
              { id: 'admissions', label: 'Admissions & Inquiries' },
              { id: 'circulars', label: 'Circulars & Official Notices' },
              { id: 'campus', label: 'Campus Life & Facilities' },
              { id: 'contact', label: 'Contact & Directions' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveNav(item.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                  activeNav === item.id ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  onEnterPortal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <span>{isAuthenticated ? 'Enter Your Dashboard' : 'Open School Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO BANNER SECTION */}
      {activeNav === 'home' && (
        <>
          <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6">
            {/* Background Decorative Rings */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2026 Academic Year • Enrollments & Admissions Open</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                  Excellence in Zambian & Global Education at{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                    {currentSchool.name}
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                  Nurturing intellectual curiosity, scientific discipline, and high ethical character under the Examinations Council of Zambia (ECZ) syllabus. Empowered by full continuous assessment, live Zoom virtual classrooms, and comprehensive parent-school communication.
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => onEnterPortal()}
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition active:scale-95 flex items-center gap-2"
                  >
                    <span>{isAuthenticated ? 'Enter School Portal' : 'Access School Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveNav('admissions')}
                    className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl text-sm font-bold transition active:scale-95 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Apply for Admission</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveNav('academics')}
                    className="px-4 py-3.5 text-slate-400 hover:text-white text-sm font-semibold transition flex items-center gap-1"
                  >
                    <span>Explore ECZ Curriculum</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-800">
                {[
                  { label: 'ECZ Examination Pass Rate', val: '99.4%', sub: 'Distinction & Merit Grade 7, 9 & 12' },
                  { label: 'Enrolled Learners', val: '1,450+', sub: 'Primary, Junior & Senior Secondary' },
                  { label: 'Certified Educators', val: '88', sub: 'Subject Specialists & Lecturers' },
                  { label: 'Interactive Digital Tools', val: '13', sub: 'Spreadsheet, Word, Zoom & AI Co-Teacher' },
                ].map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">{stat.val}</div>
                    <div className="text-xs font-bold text-white">{stat.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. SCHOOL PORTAL GATEWAY SECTION (Role Cards) */}
          <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                Interactive School Portals
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                Dedicated Web Portals for Every Member
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Click your designated portal below to sign in or access academic records, live classrooms, continuous assessment, and fee billing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  role: 'teacher' as UserRole,
                  title: 'Teacher & Staff Portal',
                  tag: 'Academic Gradebook',
                  icon: GraduationCap,
                  color: 'from-blue-600 to-indigo-600',
                  features: ['Continuous Assessment & Marks Entry', 'Teacher Excel & Word Studios', 'Automated Daily Attendance SMS', 'AI Lesson Planner & Notes'],
                },
                {
                  role: 'student' as UserRole,
                  title: 'Student Learning Hub',
                  tag: 'E-Learning & Homework',
                  icon: BookOpen,
                  color: 'from-emerald-600 to-teal-600',
                  features: ['Interactive Homework & Quiz Submissions', 'Zoom Live Classrooms with Blackboard', 'Smart Study Notes Maker (ECZ)', 'Official Term Digital Report Cards'],
                },
                {
                  role: 'parent' as UserRole,
                  title: 'Parent & Guardian Portal',
                  tag: 'Student Progress & Fees',
                  icon: Users,
                  color: 'from-amber-600 to-orange-600',
                  features: ['Real-time Grade Card & Remarks Access', 'Absentee & Discipline Instant Alerts', 'Mobile Money Fee Payment (Airtel, MTN)', 'Direct Teacher Messaging Desk'],
                },
                {
                  role: 'head_teacher' as UserRole,
                  title: 'Head Teacher Executive Desk',
                  tag: 'Institutional Leadership',
                  icon: Building2,
                  color: 'from-slate-800 to-slate-950',
                  features: ['Staff Academic Approvals & Verification', 'Official Ministry Circular Publishing', 'Financial Publishing & Tuition Ledgers', 'Comprehensive School Analytics'],
                },
                {
                  role: 'deputy_head_teacher' as UserRole,
                  title: 'Deputy Head & Academic Dean',
                  tag: 'Curriculum & Scheduling',
                  icon: Calendar,
                  color: 'from-cyan-600 to-blue-700',
                  features: ['Master Timetable & Duty Roster Matrix', 'Student Conduct & Disciplinary Records', 'Examination Room Allocations', 'Teacher Attendance Roll Supervision'],
                },
                {
                  role: 'school_board' as UserRole,
                  title: 'School Board & Oversight',
                  tag: 'Governance & Audits',
                  icon: Shield,
                  color: 'from-purple-600 to-pink-600',
                  features: ['Institution Infrastructure Budgets', 'Cryptographic Security & Passkey Ledger', 'National School Directory Verification', 'Annual Performance Reviews'],
                },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-200 p-6 flex flex-col justify-between hover:border-emerald-500 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {card.tag}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition mb-3">
                        {card.title}
                      </h3>

                      <ul className="space-y-2 mb-6">
                        {card.features.map((feat, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => onEnterPortal(card.role)}
                      className="w-full py-2.5 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-800 rounded-xl text-xs font-bold border border-slate-200 hover:border-emerald-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Enter {card.title.split(' ')[0]} Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. ACADEMIC HIGHLIGHTS & ECZ CURRICULUM PREVIEW */}
          <section className="py-16 bg-slate-100 border-y border-slate-200 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                    Syllabus & Pedagogy
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                    Comprehensive ECZ Curriculum & STEM
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNav('academics')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>View Full Subject Specifications</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    level: 'Primary Education (Grades 1 - 7)',
                    badge: 'Early Foundations',
                    desc: 'Focus on literacy, numeracy, integrated science, social studies, and creative arts, preparing pupils for the Grade 7 National Composite Examination.',
                    subjects: ['Mathematics & Numeracy', 'English Language', 'Integrated Science', 'Social Studies & Cinyanja/Bemba', 'Creative & Performing Arts'],
                  },
                  {
                    level: 'Junior Secondary (Grades 8 - 9)',
                    badge: 'JSSE National Exams',
                    desc: 'Rigorous introduction to pure sciences, business studies, ICT, and practical agriculture towards the Junior Secondary School Leaving Examination.',
                    subjects: ['Mathematics & Algebra', 'General Science & Biology', 'Computer Studies / ICT', 'Business Studies & Bookkeeping', 'Agricultural Science'],
                  },
                  {
                    level: 'Senior Secondary (Grades 10 - 12)',
                    badge: 'ECZ School Certificate',
                    desc: 'Advanced specialization across Pure Sciences, Commercials, and Arts, with continuous assessment for university entry eligibility.',
                    subjects: ['Pure Mathematics & Add Math', 'Physics & Chemistry (5070)', 'Biology (5090)', 'Civic Education & History', 'Commerce, Accounts & Principles'],
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{item.level}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.desc}</p>
                    <div className="border-t border-slate-100 pt-3">
                      <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Key Subjects:</h4>
                      <ul className="space-y-1.5">
                        {item.subjects.map((sub, sidx) => (
                          <li key={sidx} className="text-xs text-slate-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. LATEST OFFICIAL CIRCULARS & NOTICES */}
          <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                  Public Board
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Official School Notices & Circulars
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveNav('circulars')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Browse All Circulars ({circularsList.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {circularsList.slice(0, 4).map((c) => (
                <div key={c.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 transition">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {c.category.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {c.createdAt}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{c.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ACADEMICS PAGE VIEW */}
      {activeNav === 'academics' && (
        <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1">
          <div className="mb-8">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Academics & ECZ Syllabus
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Academic Programmes & Examination Standards
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-3xl">
              {currentSchool.name} provides certified teaching under the Zambian National Curriculum Framework, enhanced with modern digital labs, Continuous Assessment (CA) tracking, and science practicals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  ECZ Continuous Assessment (CA) Policy
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Under Ministry of Education guidelines, term marks comprise 40% Continuous Assessment (practical projects, homework, and weekly topical tests) and 60% Terminal Examination scores. Our teachers utilize the integrated Teacher Excel Studio to compute authentic grade curves directly against ECZ rubrics.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-800 block">Distinction</span>
                    <span className="text-slate-500 text-[11px]">75% - 100% (1, 2)</span>
                  </div>
                  <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="font-bold text-blue-800 block">Merit</span>
                    <span className="text-slate-500 text-[11px]">65% - 74% (3, 4)</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-800 block">Credit</span>
                    <span className="text-slate-500 text-[11px]">50% - 64% (5, 6)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block">Satisfactory</span>
                    <span className="text-slate-500 text-[11px]">40% - 49% (7, 8)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Video className="w-5 h-5 text-sky-600" />
                  E-Learning & Virtual Classrooms
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Every enrolled student receives access to embedded Zoom classrooms, interactive digital blackboards, and Dr. Mwape (our grounded AI Co-Teacher) for 24/7 syllabus explanations, formula derivations, and past-paper revision.
                </p>
                <button
                  type="button"
                  onClick={() => onEnterPortal('student')}
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition"
                >
                  Enter Student Hub & Zoom Rooms
                </button>
              </div>
            </div>

            {/* Academic Term Dates */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 h-fit">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                2026 Academic Calendar
              </h3>
              <div className="space-y-4 text-xs">
                {termDates && termDates.length > 0 ? (
                  termDates.map((td) => (
                    <div key={td.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                      <div className="font-bold text-emerald-400 mb-1">{td.name}</div>
                      <div className="text-slate-300">Opens: {td.startDate}</div>
                      <div className="text-slate-300">Closes: {td.endDate}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                      <div className="font-bold text-emerald-400 mb-1">Term 1 (2026)</div>
                      <div className="text-slate-300">Opens: 12 January 2026</div>
                      <div className="text-slate-300">Closes: 10 April 2026</div>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                      <div className="font-bold text-emerald-400 mb-1">Term 2 (2026)</div>
                      <div className="text-slate-300">Opens: 11 May 2026</div>
                      <div className="text-slate-300">Closes: 7 August 2026</div>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                      <div className="font-bold text-emerald-400 mb-1">Term 3 (2026)</div>
                      <div className="text-slate-300">Opens: 7 September 2026</div>
                      <div className="text-slate-300">Closes: 4 December 2026</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ADMISSIONS PAGE VIEW */}
      {activeNav === 'admissions' && (
        <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto w-full flex-1">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Online Admissions
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Apply for Admission to {currentSchool.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Submit your admission inquiry for Grade 1 through Grade 12. Our admissions office will verify records and contact parents within 24 hours.
            </p>
          </div>

          {admissionSuccessMsg && (
            <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Application Received Successfully!</p>
                <p className="mt-1 leading-relaxed">{admissionSuccessMsg}</p>
              </div>
            </div>
          )}

          {admissionErrorMsg && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
              <HelpCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Information Required</p>
                <p className="mt-1 leading-relaxed">{admissionErrorMsg}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
            <form onSubmit={handleAdmissionSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mwamba Chileshe"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Grade Applying For *
                  </label>
                  <select
                    value={applicantGrade}
                    onChange={(e) => setApplicantGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="Grade 1">Grade 1 (Primary)</option>
                    <option value="Grade 4">Grade 4 (Middle Primary)</option>
                    <option value="Grade 7">Grade 7 (ECZ Exam Class)</option>
                    <option value="Grade 8">Grade 8 (Junior Secondary)</option>
                    <option value="Grade 9">Grade 9 (JSSE Exam Class)</option>
                    <option value="Grade 10">Grade 10 (Senior Secondary)</option>
                    <option value="Grade 11">Grade 11 (Senior Secondary)</option>
                    <option value="Grade 12">Grade 12 (ECZ School Certificate)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent / Guardian Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Florence Chileshe"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+260 977 123456"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Previous School Attended (if any)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kabulonga Primary School"
                  value={previousSchool}
                  onChange={(e) => setPreviousSchool(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Academic or Health Information
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention any special academic interests, sports achievements, or medical requirements..."
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingInquiry}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingInquiry ? 'Processing Admission Record...' : 'Submit Online Admission Form'}</span>
              </button>
            </form>
          </div>
        </section>
      )}

      {/* CIRCULARS PAGE VIEW */}
      {activeNav === 'circulars' && (
        <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                Public Communications
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                Official School Circulars & Notices
              </h1>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search circulars..."
                value={circularSearch}
                onChange={(e) => setCircularSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredCirculars.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                      {c.category}
                    </span>
                    <span className="font-semibold text-slate-800">Circular Ref #{c.id}</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    Published: {c.createdAt}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{c.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">{c.content}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Authorized by: {c.authorName} ({c.authorRole})</span>
                  <span className="text-emerald-700 font-semibold">Official Stamped Document</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CAMPUS LIFE VIEW */}
      {activeNav === 'campus' && (
        <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1">
          <div className="mb-8">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Holistic Student Life
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Campus Life, Sports & Innovation Clubs
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-3xl">
              Education at {currentSchool.name} extends beyond the classroom into athletics, cultural performance, debate, science fairs, and community leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Inter-House Sports & Athletics',
                desc: 'Annual track & field championships, football leagues, netball tournaments, and swimming galas encouraging teamwork and athletic discipline.',
                tag: 'Athletics & Physical Ed',
              },
              {
                title: 'Robotics & ICT Coding Society',
                desc: 'Students learn algorithmic problem solving, web development, micro-controllers, and participate in national junior STEM innovation fairs.',
                tag: 'STEM & Robotics',
              },
              {
                title: 'National Debate & Model UN Society',
                desc: 'Fostering public speaking, parliamentary debate, critical reasoning, and regional secondary school competitions across Lusaka Province.',
                tag: 'Leadership & Oratory',
              },
              {
                title: 'Junior Engineers, Technicians & Scientists (JETS)',
                desc: 'Hands-on laboratory investigations, physics exhibits, agricultural innovation, and mathematics olympiad coaching.',
                tag: 'JETS Club',
              },
              {
                title: 'Performing Arts & Cultural Troupe',
                desc: 'Traditional Zambian music, choral singing, dramatic arts, and annual cultural celebrations honoring national heritage.',
                tag: 'Arts & Music',
              },
              {
                title: 'Health & First Aid Cadet Corps',
                desc: 'Red Cross certified first aid training, peer health counseling, and community outreach in local clinics.',
                tag: 'Community Service',
              },
            ].map((club, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                  {club.tag}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">{club.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{club.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT PAGE VIEW */}
      {activeNav === 'contact' && (
        <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto w-full flex-1">
          <div className="mb-8">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Contact & Campus Locations
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Campus Physical Address
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentSchool.name} Main Campus<br />
                  Plot 4821, Independence Avenue / Great East Road<br />
                  {currentSchool.city}, {currentSchool.province}, Zambia
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  Phone & WhatsApp Inquiries
                </h3>
                <p className="text-xs text-slate-600">
                  Admissions Office: +260 977 123456<br />
                  Finance & Mobile Money Desk: +260 775 777069<br />
                  WhatsApp Helpline: +260 977 123456
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  Electronic Mail
                </h3>
                <p className="text-xs text-slate-600">
                  admissions@{currentSchool.name.toLowerCase().replace(/[^a-z]/g, '')}.edu.zm<br />
                  headteacher@{currentSchool.name.toLowerCase().replace(/[^a-z]/g, '')}.edu.zm
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  Administration Working Hours
                </h3>
                <p className="text-xs text-slate-600">
                  Monday – Friday: 07:30 – 16:30 CAT<br />
                  Saturday (Admissions & Consultations): 08:30 – 12:30 CAT<br />
                  Sunday & Public Holidays: Closed
                </p>
              </div>
            </div>

            {/* Quick Inquiry Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Have a Question or Need Assistance?</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Whether you are an existing parent checking continuous assessment records or a prospective family looking to enroll, our team is ready to help.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => onEnterPortal()}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Access Online School Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNav('admissions')}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Submit Online Admission Inquiry</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. WEBSITE FOOTER */}
      <footer className="mt-auto bg-slate-950 text-slate-400 border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-black">
                {currentSchool.name.charAt(0)}
              </div>
              <span>{currentSchool.name}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Official school website and educational management portal. Certified Examinations Council of Zambia (ECZ) curriculum centre.
            </p>
            <div className="text-[11px] text-slate-500">
              Centre Registration Code: #{currentSchool.code}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">School Navigation</h4>
            <ul className="space-y-2">
              <li><button type="button" onClick={() => setActiveNav('home')} className="hover:text-emerald-400">Home</button></li>
              <li><button type="button" onClick={() => setActiveNav('academics')} className="hover:text-emerald-400">Academics & ECZ Syllabus</button></li>
              <li><button type="button" onClick={() => setActiveNav('admissions')} className="hover:text-emerald-400">Online Admissions</button></li>
              <li><button type="button" onClick={() => setActiveNav('circulars')} className="hover:text-emerald-400">Circulars & Announcements</button></li>
              <li><button type="button" onClick={() => setActiveNav('campus')} className="hover:text-emerald-400">Campus Life & Sports</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Portal Quick Links</h4>
            <ul className="space-y-2">
              <li><button type="button" onClick={() => onEnterPortal('teacher')} className="hover:text-emerald-400">Teacher & Staff Portal</button></li>
              <li><button type="button" onClick={() => onEnterPortal('student')} className="hover:text-emerald-400">Student Learning Hub</button></li>
              <li><button type="button" onClick={() => onEnterPortal('parent')} className="hover:text-emerald-400">Parent & Guardian Portal</button></li>
              <li><button type="button" onClick={() => onEnterPortal('head_teacher')} className="hover:text-emerald-400">Head Teacher Desk</button></li>
              <li><button type="button" onClick={() => onEnterPortal('school_board')} className="hover:text-emerald-400">School Board & Platform Admin</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">National Passkey & Help</h4>
            <p className="text-slate-400 text-xs mb-3">
              National Daily Verification Passkey Desk & Airtel/MTN MoMo payments support:
            </p>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <div className="text-emerald-400 font-bold">Helpline: +260 775 777069</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Plot 4821, Lusaka, Zambia</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {currentSchool.name}. All rights reserved. Powered by SchoolLink Digital OS.
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setActiveNav('contact')} className="hover:text-slate-300">Privacy Policy</button>
            <button type="button" onClick={() => setActiveNav('contact')} className="hover:text-slate-300">Terms of Use</button>
            <button type="button" onClick={() => onEnterPortal()} className="hover:text-emerald-400 font-bold">Portal Access</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
