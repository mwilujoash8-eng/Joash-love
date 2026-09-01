import React, { useState } from 'react';
import {
  School as SchoolIcon,
  GraduationCap,
  Users,
  Shield,
  BookOpen,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  Video,
  FileSpreadsheet,
  FileText,
  CreditCard,
  MessageSquare,
  Award,
  Globe,
  ChevronRight,
  ExternalLink,
  Lock,
  Compass,
  Star,
  Activity,
  Layers
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

interface LandingPageProps {
  onEnterPortal: (role?: UserRole) => void;
  onOpenCreateSchool: () => void;
  onOpenDailyCodeModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterPortal,
  onOpenCreateSchool,
  onOpenDailyCodeModal,
}) => {
  const { schools, currentSchool, allUsers } = useSchool();
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'academics' | 'admissions' | 'contact'>('home');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(currentSchool?.id || schools[0]?.id);

  const displaySchool = schools.find((s) => s.id === selectedSchoolId) || currentSchool || schools[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased">
      {/* Top Ministry & Accreditation Announcement Bar */}
      <div className="bg-[#090D16] border-b border-slate-800 text-slate-400 text-xs px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">Republic of Zambia &bull; Ministry of Education Standard</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">ECZ Examination Centers &bull; 2026 Academic Session</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <Phone className="w-3 h-3" /> +260 977 123456
            </span>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => onEnterPortal()}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>Portal Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Institutional Website Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40 shrink-0">
              <SchoolIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">SchoolLink</span>
                <span className="text-[10px] uppercase font-bold bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                  Official Website
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                {displaySchool.name}
              </p>
            </div>
          </div>

          {/* Website Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setActiveSection('home')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                activeSection === 'home'
                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                  : 'hover:text-white hover:bg-slate-800'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveSection('about')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                activeSection === 'about'
                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                  : 'hover:text-white hover:bg-slate-800'
              }`}
            >
              About Institution
            </button>
            <button
              onClick={() => setActiveSection('academics')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                activeSection === 'academics'
                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                  : 'hover:text-white hover:bg-slate-800'
              }`}
            >
              Curriculum & ECZ
            </button>
            <button
              onClick={() => setActiveSection('admissions')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                activeSection === 'admissions'
                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                  : 'hover:text-white hover:bg-slate-800'
              }`}
            >
              Admissions & Fees
            </button>
            <button
              onClick={() => setActiveSection('contact')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                activeSection === 'contact'
                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                  : 'hover:text-white hover:bg-slate-800'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {onOpenDailyCodeModal && (
              <button
                type="button"
                onClick={onOpenDailyCodeModal}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition"
              >
                <span>Daily Passkey</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onEnterPortal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Access Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>The National Digital School Website & Portal</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Empowering Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">Education</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Welcome to the official institutional website of <strong>{displaySchool.name}</strong>. Built to seamlessly connect school leadership, educators, learners, and parents through modern digital tools, continuous assessment, and live virtual classrooms.
              </p>

              {/* Quick Role Portal Buttons */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Select Your Portal Gateway:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => onEnterPortal('head_teacher')}
                    className="p-3 rounded-2xl bg-slate-800/90 hover:bg-emerald-950/80 border border-slate-700 hover:border-emerald-500/50 text-left transition group cursor-pointer"
                  >
                    <Shield className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition" />
                    <p className="text-xs font-bold text-white group-hover:text-emerald-300">Staff Portal</p>
                    <p className="text-[10px] text-slate-400">Teachers & Admin</p>
                  </button>

                  <button
                    onClick={() => onEnterPortal('student')}
                    className="p-3 rounded-2xl bg-slate-800/90 hover:bg-sky-950/80 border border-slate-700 hover:border-sky-500/50 text-left transition group cursor-pointer"
                  >
                    <BookOpen className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition" />
                    <p className="text-xs font-bold text-white group-hover:text-sky-300">Student Portal</p>
                    <p className="text-[10px] text-slate-400">Results & Homework</p>
                  </button>

                  <button
                    onClick={() => onEnterPortal('parent')}
                    className="p-3 rounded-2xl bg-slate-800/90 hover:bg-teal-950/80 border border-slate-700 hover:border-teal-500/50 text-left transition group cursor-pointer"
                  >
                    <Users className="w-5 h-5 text-teal-400 mb-2 group-hover:scale-110 transition" />
                    <p className="text-xs font-bold text-white group-hover:text-teal-300">Parent Portal</p>
                    <p className="text-[10px] text-slate-400">Attendance & Fees</p>
                  </button>

                  <button
                    onClick={() => onEnterPortal('platform_admin')}
                    className="p-3 rounded-2xl bg-slate-800/90 hover:bg-indigo-950/80 border border-slate-700 hover:border-indigo-500/50 text-left transition group cursor-pointer"
                  >
                    <Award className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition" />
                    <p className="text-xs font-bold text-white group-hover:text-indigo-300">Admin Desk</p>
                    <p className="text-[10px] text-slate-400">System Oversight</p>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onEnterPortal()}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Enter Online Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenCreateSchool}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-bold border border-slate-700 transition cursor-pointer"
                >
                  <span>Register a New School</span>
                </button>
              </div>
            </div>

            {/* Right Card: School Profile & Institutional Snapshot */}
            <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">School Profile</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{displaySchool.name}</h3>
                  <p className="text-xs text-slate-400">{displaySchool.code} &bull; {displaySchool.city}, {displaySchool.province}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-lg">
                  {displaySchool.logo ? (
                    <img src={displaySchool.logo} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    'SL'
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Academic Year</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{displaySchool.academicYear}</p>
                  <p className="text-[11px] text-slate-500">Term 1 in progress</p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">ECZ Center</p>
                  <p className="text-sm font-bold text-sky-400 mt-0.5">Accredited</p>
                  <p className="text-[11px] text-slate-500">Grades 8 to 12</p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Active Students</p>
                  <p className="text-sm font-bold text-white mt-0.5">{allUsers.filter(u => u.role === 'student').length * 45 + 320}</p>
                  <p className="text-[11px] text-slate-500">Enrolled Pupils</p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Faculty Staff</p>
                  <p className="text-sm font-bold text-amber-400 mt-0.5">{allUsers.filter(u => u.role === 'teacher' || u.role === 'head_teacher').length * 8 + 24}</p>
                  <p className="text-[11px] text-slate-500">Certified Teachers</p>
                </div>
              </div>

              {/* Institution Principal's Note */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-200/90 leading-relaxed">
                <p className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Head Teacher's Welcome</span>
                </p>
                "At {displaySchool.name}, we are committed to holistic academic achievement, ethical integrity, and 21st-century technological literacy. Our digital school website provides real-time access to pupil marks and learning resources."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE DIGITAL ACADEMIC PILLARS */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Integrated School Ecosystem</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">Complete Educational Web Platform</h2>
            <p className="text-slate-400 text-sm mt-2">
              Everything your school needs is built directly into this website with zero third-party software installation required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-3xl transition group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">ECZ Grading & Results</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Continuous Assessment (CA-1 to CA-3), digital termly report cards, and automated division calculations adhering to national curriculum criteria.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 p-6 rounded-3xl transition group">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition">Embedded Zoom Classrooms</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Conduct live online lessons with interactive digital whiteboards, student response evaluations, and Dr. Mwape AI Co-Teacher assistance.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 p-6 rounded-3xl transition group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">Excel & Word Studios</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Formula-enabled spreadsheet gradebooks and official document generators for lesson plans, exam papers, and Ministry circulars.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-6 rounded-3xl transition group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">Mobile Money & Fees</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Airtel Money, MTN MoMo, and Zamtel Kwacha payment logging with manual transaction verification desk and instant parent receipts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT & CAMPUS NOTICE SECTION */}
      <section className="py-16 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Institutional Excellence</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Dedicated to Nurturing Tomorrow's Leaders</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {displaySchool.name} is proud to be a premier learning center serving the community of {displaySchool.city} and surrounding areas. Our modern teaching pedagogy combines STEM disciplines, arts, and physical education with continuous character development.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fully compliant with Examinations Council of Zambia (ECZ) standards</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Science, ICT, and Agriculture laboratories</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time parent notifications for attendance and performance</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>Term 1 Key Academic Dates</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-start justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">Continuous Assessment 1 (CA-1)</p>
                    <p className="text-[11px] text-slate-400">Formative tests across all subjects</p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">Completed</span>
                </div>

                <div className="flex items-start justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">Mid-Term Examinations & CA-2</p>
                    <p className="text-[11px] text-slate-400">Consolidated gradebook review</p>
                  </div>
                  <span className="text-[10px] font-bold bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">Active</span>
                </div>

                <div className="flex items-start justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">Final Term Examinations & Report Cards</p>
                    <p className="text-[11px] text-slate-400">Digital cards published to parents</p>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">Week 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#090D16] border-t border-slate-800 py-10 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <SchoolIcon className="w-5 h-5 text-emerald-400" />
              <span>{displaySchool.name}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Institutional Digital School Website and Educational Portal for Zambian and Regional Education.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Portals & Access</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => onEnterPortal('head_teacher')} className="hover:text-emerald-400 transition">Head Teacher Portal</button></li>
              <li><button onClick={() => onEnterPortal('teacher')} className="hover:text-emerald-400 transition">Teacher Gradebook</button></li>
              <li><button onClick={() => onEnterPortal('student')} className="hover:text-emerald-400 transition">Student Homework & Tests</button></li>
              <li><button onClick={() => onEnterPortal('parent')} className="hover:text-emerald-400 transition">Parent Portal & Fees</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Academic Tools</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => onEnterPortal()} className="hover:text-emerald-400 transition">Embedded Zoom Classrooms</button></li>
              <li><button onClick={() => onEnterPortal()} className="hover:text-emerald-400 transition">Excel Spreadsheet Studio</button></li>
              <li><button onClick={() => onEnterPortal()} className="hover:text-emerald-400 transition">Microsoft Word Studio</button></li>
              <li><button onClick={() => onEnterPortal()} className="hover:text-emerald-400 transition">ECZ Grading Scale</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Contact Administration</h4>
            <p className="text-slate-400 text-xs mb-1">{displaySchool.city}, {displaySchool.province}, Zambia</p>
            <p className="text-slate-400 text-xs mb-1">Phone: +260 977 123456</p>
            <p className="text-slate-400 text-xs mb-3">Email: info@{displaySchool.code.toLowerCase().replace(/_/g, '')}.edu.zm</p>
            <div className="pt-2">
              <button
                onClick={() => onEnterPortal()}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5"
              >
                <span>Login to Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>&copy; {new Date().getFullYear()} {displaySchool.name}. Powered by SchoolLink Digital OS.</p>
          <div className="flex items-center gap-3">
            <span>Ministry of Education Compliant</span>
            <span>&bull;</span>
            <span>ECZ Standard Grading</span>
            <span>&bull;</span>
            <span>Encrypted Ledger</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
