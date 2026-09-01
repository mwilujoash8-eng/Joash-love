import React, { useState } from 'react';
import {
  Shield,
  GraduationCap,
  Users,
  Building,
  School as SchoolIcon,
  CheckCircle2,
  Lock,
  KeyRound,
  ArrowRight,
  Sparkles,
  Search,
  BookOpen,
  Award,
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  UserCheck,
  PlusCircle,
  ChevronRight,
  Phone,
  MessageSquare,
  CreditCard,
  Zap,
  Check,
  Globe
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole, UserCategory, ParentSubscriptionTier } from '../../types';

interface LoginPageProps {
  onOpenCreateSchool: () => void;
  onOpenDailyCodeModal?: () => void;
  onViewWebsite?: () => void;
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onOpenCreateSchool,
  onOpenDailyCodeModal,
  onViewWebsite,
  initialRole,
}) => {
  const { schools, allUsers, login, currentSchool, authenticateWithMasterPasskey } = useSchool();

  // Helper to determine initial category and staffRole from initialRole
  const getInitialCategory = (r?: UserRole): UserCategory => {
    if (!r) return 'school_staff';
    if (r === 'parent') return 'parent';
    if (r === 'student') return 'student';
    if (r === 'platform_admin' || r === 'school_board') return 'platform_admin';
    return 'school_staff';
  };

  const getInitialStaffRole = (r?: UserRole): UserRole => {
    if (r === 'head_teacher' || r === 'deputy_head_teacher' || r === 'teacher') return r;
    return 'head_teacher';
  };

  // 4 User Categories: 'school_staff' | 'parent' | 'student' | 'platform_admin'
  const [selectedCategory, setSelectedCategory] = useState<UserCategory>(getInitialCategory(initialRole));

  // If school staff: 'head_teacher' | 'deputy_head_teacher' | 'teacher'
  const [staffRole, setStaffRole] = useState<UserRole>(getInitialStaffRole(initialRole));

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || 'school_kabwe_tech');
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');

  // Mode: 'signin' | 'register'
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [emailOrId, setEmailOrId] = useState('');
  const [phone, setPhone] = useState('+260 977 ');
  const [whatsAppNumber, setWhatsAppNumber] = useState('+260 977 ');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [staffPasswordInput, setStaffPasswordInput] = useState('');

  // Parent subscription choice on registration
  const [parentSubTier, setParentSubTier] = useState<ParentSubscriptionTier>('medium');

  // Specific role fields
  const [studentGrade, setStudentGrade] = useState('9');
  const [studentClassId, setStudentClassId] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [childStudentNumber, setChildStudentNumber] = useState('');
  const [teacherQualification, setTeacherQualification] = useState('BSc. Mathematics with Education');
  const [teacherSubject, setTeacherSubject] = useState('sub_math');

  // Feedback State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const targetSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
      s.province.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  );

  // Compute active effective role
  const effectiveRole: UserRole =
    selectedCategory === 'school_staff'
      ? staffRole
      : selectedCategory === 'parent'
      ? 'parent'
      : selectedCategory === 'student'
      ? 'student'
      : 'platform_admin';

  const handleCategorySelect = (category: UserCategory) => {
    setSelectedCategory(category);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Autofill sensible email/ID for testing if in signin mode
    let targetRole: UserRole =
      category === 'school_staff'
        ? staffRole
        : category === 'parent'
        ? 'parent'
        : category === 'student'
        ? 'student'
        : 'platform_admin';

    const existingUser = allUsers.find(
      (u) =>
        (category === 'platform_admin' || u.schoolId === selectedSchoolId) &&
        u.role === targetRole
    );
    if (existingUser) {
      setEmailOrId(existingUser.email);
    }
  };

  const handleStaffRoleSelect = (role: UserRole) => {
    setStaffRole(role);
    setErrorMessage(null);
    setSuccessMessage(null);
    const existingUser = allUsers.find(
      (u) => u.schoolId === selectedSchoolId && u.role === role
    );
    if (existingUser) {
      setEmailOrId(existingUser.email);
    }
  };

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    setErrorMessage(null);
    setSuccessMessage(null);
    const existingUser = allUsers.find(
      (u) => u.schoolId === schoolId && u.role === effectiveRole
    );
    if (existingUser) {
      setEmailOrId(existingUser.email);
    }
  };

  const handleFastLogin = (user: (typeof allUsers)[0]) => {
    const cat: UserCategory =
      user.userCategory ||
      (user.role === 'head_teacher' || user.role === 'deputy_head_teacher' || user.role === 'teacher'
        ? 'school_staff'
        : user.role === 'parent'
        ? 'parent'
        : user.role === 'student'
        ? 'student'
        : 'platform_admin');

    setSelectedCategory(cat);
    if (cat === 'school_staff') {
      setStaffRole(user.role);
    }
    if (user.schoolId) {
      setSelectedSchoolId(user.schoolId);
    }

    const result = login({
      role: user.role,
      schoolId: user.schoolId,
      emailOrId: user.email,
      isNewRegistration: false,
    });
    if (!result.success) {
      setErrorMessage(result.message || 'Failed to authenticate.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    let extraProfile: any = undefined;

    if (authMode === 'register') {
      if (effectiveRole === 'student') {
        const cls = targetSchool.classes.find((c) => c.id === studentClassId) || targetSchool.classes[0];
        const autoStudentNo = studentNumber.trim() || `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        extraProfile = {
          studentNumber: autoStudentNo,
          grade: studentGrade,
          classId: cls?.id || 'class_default',
          className: cls?.name || `Grade ${studentGrade}A`,
          gender: 'Male',
          admissionDate: '2026-01-12',
        };
      } else if (effectiveRole === 'parent') {
        extraProfile = {
          connectedStudentNumbers: childStudentNumber.trim() ? [childStudentNumber.trim().toUpperCase()] : ['STU-2026-0012'],
          isPtaExecutive: false,
          nationalId: '342119/11/1',
        };
      } else if (effectiveRole === 'teacher' || effectiveRole === 'deputy_head_teacher') {
        extraProfile = {
          employeeNumber: `TS-${targetSchool.code.substring(4, 7)}-${Math.floor(100 + Math.random() * 900)}`,
          assignedSubjectIds: [teacherSubject],
          assignedClassIds: [targetSchool.classes[0]?.id || ''],
          qualification: teacherQualification,
          specialization: 'Secondary Education',
        };
      }
    }

    const effectiveWhatsApp = sameAsPhone ? phone.trim() : whatsAppNumber.trim();

    // Check if user entered the master passkey "5 April 2013" in password or ID
    const trimmedPass = password.trim().toLowerCase();
    const trimmedId = emailOrId.trim().toLowerCase();
    if (
      trimmedPass === '5 april 2013' ||
      trimmedPass === '05 april 2013' ||
      trimmedPass === '5/4/2013' ||
      trimmedPass === '05/04/2013' ||
      trimmedPass === '5-4-2013' ||
      trimmedPass === '05-04-2013' ||
      trimmedId === '5 april 2013' ||
      trimmedId === '05 april 2013'
    ) {
      const passResult = authenticateWithMasterPasskey('5 April 2013');
      setIsSubmitting(false);
      if (passResult.success) {
        setSuccessMessage(passResult.message);
        return;
      }
    }

    const result = login({
      role: effectiveRole,
      schoolId: selectedCategory === 'platform_admin' ? undefined : selectedSchoolId,
      emailOrId: emailOrId.trim() || (authMode === 'register' ? `${fullName.toLowerCase().replace(/\s+/g, '.')}@schoollink.edu.zm` : undefined),
      password: password.trim(),
      staffPassword: staffPasswordInput.trim(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsAppNumber: effectiveWhatsApp,
      extraProfile,
      isNewRegistration: authMode === 'register',
      parentSubscriptionTier: parentSubTier,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Authentication error. Please check your credentials.');
    } else {
      setSuccessMessage(`Welcome! Authenticated as ${result.user?.fullName}.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased">
      {/* Top Ministry Certification Bar */}
      <div className="bg-[#090D16] border-b border-slate-800 text-slate-400 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-300">Republic of Zambia &bull; Ministry of Education Compliant</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">ECZ Standard Assessment Framework (Grades 8 - 12)</span>
          </div>

          <div className="flex items-center gap-3">
            {onViewWebsite && (
              <button
                type="button"
                onClick={onViewWebsite}
                className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>School Website</span>
              </button>
            )}

            <button
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition underline decoration-emerald-500/40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showDemoAccounts ? 'Hide Quick Accounts' : 'Quick Demo Accounts'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Quick Demo Profiles Drawer */}
      {showDemoAccounts && (
        <div className="bg-slate-900 border-b border-slate-800 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Instant Role Fast-Login (4 Core Categories)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Select any profile across School Staff (Head/Deputy/Teacher), Parent, Student, or Platform Admin.
                </p>
              </div>
              <div className="text-[11px] bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-slate-300">
                Staff Password for {targetSchool.name.split(' ')[0]}: <span className="font-mono font-bold text-emerald-400">{targetSchool.staffPassword || 'KABWE-STAFF-2026'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {allUsers.slice(0, 6).map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleFastLogin(u)}
                  className="bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl p-2.5 text-left transition flex items-center gap-2.5 group"
                >
                  <img src={u.avatarUrl} alt={u.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">{u.fullName}</p>
                    <p className="text-[10px] text-slate-400 capitalize truncate">{u.role.replace('_', ' ')}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Authentication Arena */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 5 Cols: Category Selector & Subscription Information */}
        <div className="lg:col-span-5 space-y-6">
          {/* Logo & Headline */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
                <SchoolIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  SchoolLink <span className="text-emerald-400 text-sm font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">Zambia</span>
                </h1>
                <p className="text-xs text-slate-400">Institutional School Management Operating System</p>
              </div>
            </div>
          </div>

          {/* Master Access & Daily Passkey Card */}
          {onOpenDailyCodeModal && (
            <button
              type="button"
              onClick={onOpenDailyCodeModal}
              className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-800/80 to-indigo-950/40 border border-amber-500/30 hover:border-amber-400/60 transition group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-white group-hover:text-amber-300 transition flex items-center gap-1.5 flex-wrap">
                      <span>Daily Passkey & Master Database Access</span>
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono border border-amber-400/30">Admin Access</span>
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Enter Master Access Passkey or redeem single-use activation code
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition shrink-0" />
              </div>
            </button>
          )}

          {/* 4 Main Categories Selector Cards */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Choose User Category
            </label>

            {/* Category 1: School Staff */}
            <div
              onClick={() => handleCategorySelect('school_staff')}
              className={`cursor-pointer rounded-2xl p-4 border transition ${
                selectedCategory === 'school_staff'
                  ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      School Staff
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-800">
                        Paid by School
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Head Teacher, Deputy Head Teacher & Teachers
                    </p>
                  </div>
                </div>
                {selectedCategory === 'school_staff' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
              </div>

              {/* Sub-tabs for staff positions */}
              {selectedCategory === 'school_staff' && (
                <div className="mt-3 pt-3 border-t border-emerald-900/40 space-y-2">
                  <p className="text-[11px] font-semibold text-emerald-300">Select Position in School:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'head_teacher', label: 'Head Teacher', desc: 'Principal Admin' },
                      { id: 'deputy_head_teacher', label: 'Deputy Head', desc: 'Curriculum' },
                      { id: 'teacher', label: 'Teacher', desc: 'Marks & Tests' }
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStaffRoleSelect(pos.id as UserRole);
                        }}
                        className={`p-2 rounded-xl text-left border transition ${
                          staffRole === pos.id
                            ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <p className="text-xs truncate">{pos.label}</p>
                        <p className="text-[9px] text-slate-400 truncate">{pos.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Staff Subscription Coverage Note */}
                  <div className="mt-2 bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-2.5 text-[11px] text-emerald-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>School Staff Subscription:</strong> Medium K400/mo or Premium K450/mo. Paid once by the school and covers all staff under that unique School ID.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Category 2: Parents */}
            <div
              onClick={() => handleCategorySelect('parent')}
              className={`cursor-pointer rounded-2xl p-4 border transition ${
                selectedCategory === 'parent'
                  ? 'bg-gradient-to-r from-teal-950/80 to-slate-900 border-teal-500/60 shadow-lg shadow-teal-900/20 ring-1 ring-teal-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Parent / Guardian
                      <span className="text-[10px] bg-teal-950 text-teal-300 font-semibold px-2 py-0.5 rounded border border-teal-800">
                        Individual
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Access to linked children's results, tests, assignments & attendance
                    </p>
                  </div>
                </div>
                {selectedCategory === 'parent' && (
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                )}
              </div>

              {selectedCategory === 'parent' && (
                <div className="mt-3 pt-3 border-t border-teal-900/40 text-[11px] text-teal-200 bg-teal-950/60 border border-teal-800/60 rounded-xl p-2.5 flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Parent Subscriptions:</strong> Medium K150/mo (Basic progress, results, attendance) &bull; Premium K200/mo (AI learning insights, trajectory charts & detailed reports).
                  </span>
                </div>
              )}
            </div>

            {/* Category 3: Students */}
            <div
              onClick={() => handleCategorySelect('student')}
              className={`cursor-pointer rounded-2xl p-4 border transition ${
                selectedCategory === 'student'
                  ? 'bg-gradient-to-r from-sky-950/80 to-slate-900 border-sky-500/60 shadow-lg shadow-sky-900/20 ring-1 ring-sky-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Student / Pupil
                      <span className="text-[10px] bg-sky-950 text-sky-300 font-semibold px-2 py-0.5 rounded border border-sky-800">
                        Learner Portal
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Continuous Assessment (CA-1 to CA-3), report cards & homework
                    </p>
                  </div>
                </div>
                {selectedCategory === 'student' && (
                  <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
                )}
              </div>
            </div>

            {/* Category 4: Platform Administrator */}
            <div
              onClick={() => handleCategorySelect('platform_admin')}
              className={`cursor-pointer rounded-2xl p-4 border transition ${
                selectedCategory === 'platform_admin'
                  ? 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-900/20 ring-1 ring-indigo-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Platform Administrator
                      <span className="text-[10px] bg-indigo-950 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-800">
                        National Level
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      National school directory, subscriptions, revenue & security audit
                    </p>
                  </div>
                </div>
                {selectedCategory === 'platform_admin' && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                )}
              </div>
            </div>
          </div>

          {/* School Creation CTA for Head Teachers */}
          {selectedCategory === 'school_staff' && staffRole === 'head_teacher' && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-300">Are you a Head Teacher of a new school?</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Create your school profile and generate staff password code.</p>
              </div>
              <button
                type="button"
                onClick={onOpenCreateSchool}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create School</span>
              </button>
            </div>
          )}
        </div>

        {/* Right 7 Cols: Authentication Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Mode Switcher: Sign In vs Register */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                authMode === 'signin'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Sign In with Existing Account</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                authMode === 'register'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>Create New User Profile</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* School Selector (hidden for Platform Admin) */}
            {selectedCategory !== 'platform_admin' && (
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Institution / School ID
                </label>
                <div className="relative">
                  <select
                    value={selectedSchoolId}
                    onChange={(e) => handleSchoolChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code}) - {s.city}, {s.province}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <span>Selected: <strong>{targetSchool.name}</strong></span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="font-mono text-emerald-400">{targetSchool.code}</span>
                </p>
              </div>
            )}

            {/* If Registering: Full Name */}
            {authMode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kondwani Phiri"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            )}

            {/* Email / ID */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                {authMode === 'signin' ? 'Email Address or ID' : 'Official Email Address'}
              </label>
              <input
                type="text"
                required
                placeholder={
                  effectiveRole === 'student'
                    ? 'student.number or email'
                    : effectiveRole === 'teacher'
                    ? 'teacher.id or email'
                    : 'user@schoollink.edu.zm'
                }
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Phone & WhatsApp Inputs */}
            {authMode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+260 977 123456"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (sameAsPhone) setWhatsAppNumber(e.target.value);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      WhatsApp Number
                    </label>
                    <label className="text-[10px] text-emerald-400 cursor-pointer flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => {
                          setSameAsPhone(e.target.checked);
                          if (e.target.checked) setWhatsAppNumber(phone);
                        }}
                        className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                      />
                      <span>Same as phone</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={sameAsPhone}
                    placeholder="+260 977 123456"
                    value={sameAsPhone ? phone : whatsAppNumber}
                    onChange={(e) => setWhatsAppNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 disabled:opacity-60 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Parent Subscription Plan Selection (Only for Parent in register mode) */}
            {authMode === 'register' && selectedCategory === 'parent' && (
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-teal-900/60 space-y-2">
                <label className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
                  Select Parent Subscription Plan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setParentSubTier('medium')}
                    className={`p-3 rounded-xl border text-left transition ${
                      parentSubTier === 'medium'
                        ? 'bg-teal-950/80 border-teal-400 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Medium</span>
                      <span className="text-xs font-extrabold text-teal-400">K150/mo</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Results, tests, attendance & circulars</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setParentSubTier('premium')}
                    className={`p-3 rounded-xl border text-left transition ${
                      parentSubTier === 'premium'
                        ? 'bg-teal-950/80 border-teal-400 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1">
                        Premium <Sparkles className="w-3 h-3 text-amber-400" />
                      </span>
                      <span className="text-xs font-extrabold text-amber-400">K200/mo</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">AI learning insights & detailed reports</p>
                  </button>
                </div>
              </div>
            )}

            {/* Specific extra fields when registering */}
            {authMode === 'register' && selectedCategory === 'parent' && (
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Child's Student Number (To Link)
                </label>
                <input
                  type="text"
                  placeholder="e.g. STU-2026-0012"
                  value={childStudentNumber}
                  onChange={(e) => setChildStudentNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            )}

            {authMode === 'register' && selectedCategory === 'student' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Grade Level
                  </label>
                  <select
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="8">Grade 8 (Junior)</option>
                    <option value="9">Grade 9 (ECZ Exam)</option>
                    <option value="10">Grade 10 (Senior)</option>
                    <option value="11">Grade 11 (Senior)</option>
                    <option value="12">Grade 12 (ECZ Exam)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Assigned Class Stream
                  </label>
                  <select
                    value={studentClassId}
                    onChange={(e) => setStudentClassId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  >
                    {targetSchool.classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Staff Password Verification for Teacher & Deputy Head Teacher */}
            {(effectiveRole === 'teacher' || effectiveRole === 'deputy_head_teacher') && (
              <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-2xl space-y-1.5">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  Official Staff Password Code
                </label>
                <input
                  type="text"
                  placeholder={`Issued by ${targetSchool.name.split(' ')[0]} Head Teacher`}
                  value={staffPasswordInput}
                  onChange={(e) => setStaffPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder:text-slate-600 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <p className="text-[10px] text-amber-200/80">
                  Default Staff Access Code for demo: <span className="font-mono font-bold text-white">{targetSchool.staffPassword || 'STAFF-2026'}</span>
                </p>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Account Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Messages */}
            {errorMessage && (
              <div className="bg-rose-950/60 border border-rose-500/40 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating Secure Access...</span>
                </>
              ) : (
                <>
                  <span>
                    {authMode === 'signin'
                      ? `Access ${effectiveRole.replace('_', ' ').toUpperCase()} Dashboard`
                      : `Register & Enter as ${effectiveRole.replace('_', ' ').toUpperCase()}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
