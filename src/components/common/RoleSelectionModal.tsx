import React, { useState } from 'react';
import {
  X,
  Shield,
  GraduationCap,
  Users,
  Building,
  School as SchoolIcon,
  PlusCircle,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  Check,
  Lock,
  Unlock
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';
import { AdminAccessModal } from '../modals/AdminAccessModal';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateSchool: () => void;
  onOpenRegisterUser: () => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateSchool,
  onOpenRegisterUser,
}) => {
  const {
    schools,
    currentSchool,
    currentUser,
    allUsers,
    switchSchool,
    switchUser,
    isDemoMode,
    setDemoMode,
    isAdminUnlocked,
    isRoleSwitchingAllowed,
  } = useSchool();

  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [adminAccessModalOpen, setAdminAccessModalOpen] = useState(false);
  const [pendingAdminRole, setPendingAdminRole] = useState<UserRole | null>(null);
  const [restrictionNotice, setRestrictionNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const rolesList: Array<{
    id: UserRole;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    border: string;
    badge: string;
    specialAction?: string;
  }> = [
    {
      id: 'head_teacher',
      title: 'School Head Teacher',
      description: 'Primary administrator. Full authority over school settings, classes, subjects, faculty, report approvals, and academic calendars.',
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      color: 'bg-emerald-500/10 text-emerald-400',
      border: 'hover:border-emerald-500/50',
      badge: 'Primary Administrator',
      specialAction: 'Create a School',
    },
    {
      id: 'deputy_head_teacher',
      title: 'Deputy Head Teacher',
      description: 'Academic supervision, continuous assessment verification, exam invigilation schedules, and disciplinary oversight.',
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      color: 'bg-blue-500/10 text-blue-400',
      border: 'hover:border-blue-500/50',
      badge: 'Academic Supervision',
    },
    {
      id: 'teacher',
      title: 'Class & Subject Teacher',
      description: 'Mark entry for CA Test 1-3 & Exams, attendance roll-call, assignment dispatch, ECZ gradebook management, and student remarks.',
      icon: <GraduationCap className="w-6 h-6 text-emerald-400" />,
      color: 'bg-emerald-500/10 text-emerald-400',
      border: 'hover:border-emerald-500/50',
      badge: 'Faculty Portal',
    },
    {
      id: 'student',
      title: 'Student / Learner',
      description: 'Interactive class timetable, assignments, daily attendance logs, Test 1-3 & exam results, official report cards, and announcements.',
      icon: <Users className="w-6 h-6 text-sky-400" />,
      color: 'bg-sky-500/10 text-sky-400',
      border: 'hover:border-sky-500/50',
      badge: 'Learner Portal',
    },
    {
      id: 'parent',
      title: 'Parent & Guardian',
      description: 'Connected children switcher, real-time results, official digital report cards, daily attendance alerts, homework, and PTA projects.',
      icon: <Users className="w-6 h-6 text-amber-400" />,
      color: 'bg-amber-500/10 text-amber-400',
      border: 'hover:border-amber-500/50',
      badge: 'Guardian Portal',
    },
    {
      id: 'school_board',
      title: 'School Board & Governance',
      description: 'Governance oversight dashboard, enrollment statistics, academic performance aggregates, and PTA financial/capital project status.',
      icon: <Building className="w-6 h-6 text-purple-400" />,
      color: 'bg-purple-500/10 text-purple-400',
      border: 'hover:border-purple-500/50',
      badge: 'Governance & PTA',
    },
    {
      id: 'platform_admin',
      title: 'Platform Administrator',
      description: 'National Directorate central console. Multi-tenant school licensing, staff & parent subscriptions, revenue analytics, and security audit logs.',
      icon: <Shield className="w-6 h-6 text-indigo-400" />,
      color: 'bg-indigo-500/10 text-indigo-400',
      border: 'hover:border-indigo-500/50',
      badge: 'National Directorate',
    },
  ];

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(schoolSearch.toLowerCase()) ||
      s.city.toLowerCase().includes(schoolSearch.toLowerCase()) ||
      s.province.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  // Available users matching selected role and current school
  const matchingUsers = allUsers.filter(
    (u) =>
      selectedRole === 'platform_admin'
        ? u.role === 'platform_admin'
        : u.role === selectedRole && u.schoolId === currentSchool.id
  );

  const handleSelectRole = (role: UserRole) => {
    setRestrictionNotice(null);

    // If role switching is not allowed (in live mode and non-admin)
    if (!isRoleSwitchingAllowed && role !== currentUser.role) {
      setRestrictionNotice(
        `Role Switching Locked: In Live Mode, you can only access your assigned dashboard (${currentUser.role.replace('_', ' ')}). Only School Administrators can switch personas.`
      );
      return;
    }

    const isTargetAdmin = role === 'head_teacher' || role === 'platform_admin';
    if (isTargetAdmin && isDemoMode && !isAdminUnlocked) {
      setPendingAdminRole(role);
      setAdminAccessModalOpen(true);
      return;
    }

    setSelectedRole(role);
    // Find an existing verified user for this role
    const match =
      role === 'platform_admin'
        ? allUsers.find((u) => u.role === 'platform_admin')
        : allUsers.find((u) => u.role === role && u.schoolId === currentSchool.id);
    if (match) {
      switchUser(match.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-700 w-full max-w-4xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <SchoolIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">SchoolLink Role & School Selection</h2>
                {/* Demo Mode indicator & toggle */}
                <button
                  type="button"
                  onClick={() => setDemoMode(!isDemoMode)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    isDemoMode
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Click to toggle Demo Mode vs Live Mode"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                  <span>{isDemoMode ? 'Demo Mode Active' : 'Live Mode Active'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                {isDemoMode
                  ? 'Demo Mode: Multi-role exploration enabled. Admin roles require security passcode.'
                  : 'Live Mode: Persona locked to assigned credentials. Only Admin can switch.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Restriction Notice if user tries to switch without permission */}
        {restrictionNotice && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between text-xs text-amber-200 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{restrictionNotice}</span>
            </div>
            <button
              onClick={() => setRestrictionNotice(null)}
              className="text-amber-400 hover:text-white text-[11px] underline font-bold ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Active School Indicator & Search */}
          <div className="bg-[#0F172A] rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={currentSchool.logo}
                alt=""
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-500/30"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    Selected School
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    {currentSchool.code}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">{currentSchool.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{currentSchool.city}, {currentSchool.province}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onOpenCreateSchool();
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create New School</span>
              </button>
            </div>
          </div>

          {/* Role Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Select Your Role
              </h3>
              <span className="text-xs text-slate-400">
                Current: <strong className="text-emerald-400 capitalize">{currentUser.role.replace('_', ' ')}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {rolesList.map((role) => {
                const isSelected = selectedRole === role.id;
                const isTargetAdmin = role.id === 'head_teacher' || role.id === 'platform_admin';
                const requiresPasskey = isTargetAdmin && isDemoMode && !isAdminUnlocked;
                const isLockedInLive = !isRoleSwitchingAllowed && role.id !== currentUser.role;

                return (
                  <div
                    key={role.id}
                    onClick={() => handleSelectRole(role.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                        : isLockedInLive
                        ? 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-80'
                        : 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.color}`}>
                          {role.icon}
                        </div>
                        <div className="flex items-center gap-1">
                          {requiresPasskey && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-amber-400" />
                              <span>Code</span>
                            </span>
                          )}
                          {isLockedInLive && (
                            <span className="text-[9px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-slate-500" />
                              <span>Live</span>
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {role.badge}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white">{role.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Active Selection</span>
                          </>
                        ) : isLockedInLive ? (
                          <span className="text-slate-500 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        ) : (
                          <span>Select Role &rarr;</span>
                        )}
                      </span>

                      {role.id === 'head_teacher' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onOpenCreateSchool();
                          }}
                          className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-2 py-1 rounded-lg border border-emerald-500/30 font-bold transition"
                        >
                          + Create School
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Profiles & Registration Actions for Selected Role */}
          <div className="bg-[#0F172A] rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  2. Profiles & Verification ({selectedRole.replace('_', ' ')})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connect as a verified member or register a new profile at {currentSchool.name}
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenRegisterUser();
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Register New {selectedRole.replace('_', ' ')}</span>
              </button>
            </div>

            {matchingUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {matchingUsers.map((usr) => {
                  const isCurrent = currentUser.id === usr.id;
                  return (
                    <div
                      key={usr.id}
                      onClick={() => {
                        switchUser(usr.id);
                        onClose();
                      }}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/40'
                          : 'bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={usr.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-white truncate">{usr.fullName}</h5>
                          <p className="text-[10px] text-slate-400 truncate">
                            {usr.studentProfile?.className || usr.teacherProfile?.qualification || usr.boardProfile?.position || usr.role.replace('_', ' ')}
                          </p>
                        </div>
                      </div>

                      {isCurrent && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 bg-slate-900/40 rounded-xl border border-dashed border-slate-700">
                <p className="text-xs text-slate-400">
                  No registered {selectedRole.replace('_', ' ')} found for this school yet.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenRegisterUser();
                  }}
                  className="mt-2 text-xs font-bold text-emerald-400 hover:underline"
                >
                  Register now with student ID or credentials &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0F172A] border-t border-slate-700 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Strict school isolation &bull; Multi-role encryption &bull; ECZ Standards
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            Enter Dashboard
          </button>
        </div>
      </div>

      {/* Admin Passcode Modal */}
      <AdminAccessModal
        isOpen={adminAccessModalOpen}
        onClose={() => {
          setAdminAccessModalOpen(false);
          setPendingAdminRole(null);
        }}
        targetRole={pendingAdminRole || undefined}
      />
    </div>
  );
};
