import React, { useState } from 'react';
import {
  School as SchoolIcon,
  Shield,
  Bell,
  UserCheck,
  ChevronDown,
  PlusCircle,
  RotateCcw,
  CheckCircle,
  Copy,
  Check,
  Building,
  GraduationCap,
  Users,
  Briefcase,
  Layers,
  X,
  ExternalLink,
  LogOut,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenCreateSchool: () => void;
  onOpenRegisterUser: () => void;
  onOpenAuditLogs: () => void;
  onOpenRoleSwitcher?: () => void;
  onOpenProfile?: () => void;
  onOpenGeminiAI?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateSchool,
  onOpenRegisterUser,
  onOpenAuditLogs,
  onOpenRoleSwitcher,
  onOpenProfile,
  onOpenGeminiAI,
}) => {
  const {
    schools,
    currentSchool,
    currentUser,
    allUsers,
    switchSchool,
    switchUser,
    logout,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    resetDemoData,
  } = useSchool();

  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roleLabels: Record<UserRole, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    head_teacher: { label: 'Head Teacher', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', text: 'text-emerald-400', icon: <Shield className="w-3.5 h-3.5" /> },
    deputy_head_teacher: { label: 'Deputy Head', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: 'text-blue-400', icon: <Shield className="w-3.5 h-3.5" /> },
    teacher: { label: 'Teacher', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', text: 'text-emerald-400', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    student: { label: 'Student', bg: 'bg-sky-500/20 text-sky-300 border-sky-500/30', text: 'text-sky-400', icon: <Users className="w-3.5 h-3.5" /> },
    parent: { label: 'Parent / Guardian', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30', text: 'text-amber-400', icon: <Users className="w-3.5 h-3.5" /> },
    school_board: { label: 'School Board', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30', text: 'text-purple-400', icon: <Building className="w-3.5 h-3.5" /> },
    platform_admin: { label: 'Platform Admin', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', text: 'text-indigo-400', icon: <Shield className="w-3.5 h-3.5" /> },
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSchool.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Group demo users by role for quick switching
  const schoolUsers = allUsers.filter((u) => u.schoolId === currentSchool.id);

  return (
    <header className="sticky top-0 z-40 bg-[#1E293B] text-white border-b border-slate-700 shadow-md">
      {/* Top status & system bar */}
      <div className="bg-[#0F172A] text-slate-300 text-xs px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE SESSION
          </span>
          <span className="text-slate-300 text-xs font-medium">
            Academic Year {currentSchool.academicYear} &bull; Term 1 (13 Weeks) &bull; ECZ Standards
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuditLogs}
            className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-1.5 text-[11px] font-medium"
            title="System Security & Audit Trail"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audit Trail</span>
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={resetDemoData}
            className="text-slate-400 hover:text-amber-300 transition flex items-center gap-1.5 text-[11px] font-medium"
            title="Reset to initial realistic demo data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Sleek Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: School Branding & Selector */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <button
              onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
              className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-xl hover:bg-slate-800/70 transition border border-transparent hover:border-slate-700 text-left group"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-sm shadow-emerald-500/20 shrink-0">
                {currentSchool.logo ? (
                  <img
                    src={currentSchool.logo}
                    alt={currentSchool.name}
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  'SL'
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold text-white truncate leading-tight group-hover:text-emerald-400 transition">
                    {currentSchool.name}
                  </h1>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="text-emerald-400 font-semibold text-[10px] tracking-wider uppercase">SchoolLink OS</span>
                  <span>&bull;</span>
                  <span className="text-slate-300 font-medium truncate">{currentSchool.city}</span>
                </div>
              </div>
            </button>

            {/* School Dropdown */}
            {showSchoolDropdown && (
              <div className="absolute left-0 mt-2 w-80 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Select School
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{schools.length} Registered</span>
                </div>

                <div className="max-h-60 overflow-y-auto py-1">
                  {schools.map((sch) => (
                    <button
                      key={sch.id}
                      onClick={() => {
                        switchSchool(sch.id);
                        setShowSchoolDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition ${
                        sch.id === currentSchool.id ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden font-bold text-xs text-slate-700">
                        {sch.logo ? (
                          <img src={sch.logo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Building className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate">{sch.name}</p>
                        <p className="text-xs text-slate-500">{sch.code} &bull; {sch.city}</p>
                      </div>
                      {sch.id === currentSchool.id && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => {
                      setShowSchoolDropdown(false);
                      onOpenCreateSchool();
                    }}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create New School</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* School Code Badge with Copy */}
          <button
            onClick={handleCopyCode}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono border border-slate-700 transition"
            title="Click to copy School Registration Code"
          >
            <span className="font-bold text-emerald-400">{currentSchool.code}</span>
            {copiedCode ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>

        {/* Right: Quick Role Switcher, Notifications & Active User Profile */}
        <div className="flex items-center gap-3">
          {/* Gemini AI Studio Button */}
          {onOpenGeminiAI && (
            <button
              onClick={onOpenGeminiAI}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm shadow-emerald-500/20 transition active:scale-95 group"
              title="Open Gemini AI Assistant with Search & Maps Grounding"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Gemini AI Studio</span>
              <span className="hidden md:inline text-[9px] bg-emerald-700/60 px-1.5 py-0.2 rounded text-emerald-100 font-mono">
                3.5 / Pro
              </span>
            </button>
          )}

          {/* Quick Persona Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700/80 text-white text-xs font-medium shadow-xs transition"
              title="Switch role view to test Head Teacher, Deputy, Teacher, Student, Parent, or Board"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline text-slate-300">Active Role:</span>
              <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border ${roleLabels[currentUser.role].bg}`}>
                {roleLabels[currentUser.role].label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Switcher Menu */}
            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-84 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Switch Role Dashboard
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      Multi-Role OS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select any persona to explore their dedicated tools, gradebook, or reports:
                  </p>
                </div>

                <div className="max-h-72 overflow-y-auto py-1">
                  {schoolUsers.map((user) => {
                    const r = roleLabels[user.role];
                    const isSelected = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUser(user.id);
                          setShowRoleSwitcher(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition ${
                          isSelected ? 'bg-emerald-50/80 font-semibold' : ''
                        }`}
                      >
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {user.fullName}
                            </span>
                            {user.verificationStatus === 'verified' && (
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {r.label}
                            </span>
                            {user.studentProfile && (
                              <span className="truncate">{user.studentProfile.className}</span>
                            )}
                            {user.teacherProfile && (
                              <span className="truncate">{user.teacherProfile.specialization}</span>
                            )}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50 flex flex-col gap-2">
                  {onOpenRoleSwitcher && (
                    <button
                      onClick={() => {
                        setShowRoleSwitcher(false);
                        onOpenRoleSwitcher();
                      }}
                      className="w-full py-2 px-3 bg-[#1E293B] hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Role & School Selection Portal</span>
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowRoleSwitcher(false);
                        onOpenRegisterUser();
                      }}
                      className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Register User</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowRoleSwitcher(false);
                        onOpenCreateSchool();
                      }}
                      className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition shadow-sm shadow-emerald-200"
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>Create School</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition border border-slate-700"
              title="View In-App & SMS Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#1E293B]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications & Alerts</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No notifications right now
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 text-left transition cursor-pointer hover:bg-slate-50 ${
                          !n.isRead ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-700">
            <button
              type="button"
              onClick={onOpenProfile}
              title="Click to view & edit your complete profile"
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer group text-left"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[140px] group-hover:text-emerald-400 transition">
                  {currentUser.titlePrefix ? `${currentUser.titlePrefix} ` : ''}{currentUser.fullName}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium mt-0.5 truncate max-w-[140px] flex items-center justify-end gap-1">
                  <span>{roleLabels[currentUser.role].label}</span>
                  <span className="text-[9px] bg-slate-700 text-slate-300 px-1 py-0.2 rounded font-mono group-hover:bg-emerald-600 group-hover:text-white transition">Edit</span>
                </p>
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-emerald-500 overflow-hidden shadow-xs shrink-0 group-hover:scale-105 group-hover:border-emerald-400 transition">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
            <button
              onClick={logout}
              title="Sign Out / Switch Role Portal"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition border border-transparent hover:border-slate-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
