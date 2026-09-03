import React, { useState } from 'react';
import {
  Bell,
  Layers,
  ChevronDown,
  Building,
  Check,
  PlusCircle,
  LogOut,
  Smartphone,
  Laptop,
  Sparkles,
  Shield,
  GraduationCap,
  Users,
  UserCheck,
  RotateCcw,
  KeyRound,
  Video,
  Grid,
  Globe,
  Lock,
  Unlock,
  Menu,
  X
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useDevice } from '../../context/DeviceContext';
import { UserRole } from '../../types';
import { AdminAccessModal } from '../modals/AdminAccessModal';

interface MobileTopBarProps {
  onOpenCreateSchool: () => void;
  onOpenRegisterUser: () => void;
  onOpenAuditLogs: () => void;
  onOpenRoleSwitcher: () => void;
  onOpenProfile?: () => void;
  onOpenGeminiAI?: () => void;
  onOpenDailyCodeModal?: () => void;
  onOpenGoogleMeet?: () => void;
  onOpenSchoolModules?: () => void;
  onViewWebsite?: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  onOpenCreateSchool,
  onOpenRegisterUser,
  onOpenAuditLogs,
  onOpenRoleSwitcher,
  onOpenProfile,
  onOpenGeminiAI,
  onOpenDailyCodeModal,
  onOpenGoogleMeet,
  onOpenSchoolModules,
  onViewWebsite,
}) => {
  const {
    currentSchool,
    schools,
    currentUser,
    allUsers,
    switchSchool,
    switchUser,
    logout,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    resetDemoData,
    isDemoMode,
    setDemoMode,
    isAdminUnlocked,
    lockAdmin,
    isRoleSwitchingAllowed,
  } = useSchool();

  const { deviceMode, setDeviceMode, effectiveDevice, toggleDeviceMode } = useDevice();

  const [showSchoolSheet, setShowSchoolSheet] = useState(false);
  const [showRoleSheet, setShowRoleSheet] = useState(false);
  const [showNotificationSheet, setShowNotificationSheet] = useState(false);
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [adminAccessModalOpen, setAdminAccessModalOpen] = useState(false);
  const [targetAdminUser, setTargetAdminUser] = useState<(typeof allUsers)[0] | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roleMeta: Record<UserRole, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    head_teacher: { label: 'Head Teacher', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', text: 'text-emerald-400', icon: <Shield className="w-3.5 h-3.5" /> },
    deputy_head_teacher: { label: 'Deputy Head', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: 'text-blue-400', icon: <Shield className="w-3.5 h-3.5" /> },
    teacher: { label: 'Teacher', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', text: 'text-emerald-400', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    student: { label: 'Student', bg: 'bg-sky-500/20 text-sky-300 border-sky-500/30', text: 'text-sky-400', icon: <Users className="w-3.5 h-3.5" /> },
    parent: { label: 'Parent / Guardian', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30', text: 'text-amber-400', icon: <Users className="w-3.5 h-3.5" /> },
    school_board: { label: 'School Board', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30', text: 'text-purple-400', icon: <Building className="w-3.5 h-3.5" /> },
    platform_admin: { label: 'Platform Admin', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', text: 'text-indigo-400', icon: <Shield className="w-3.5 h-3.5" /> },
  };

  const schoolUsers = allUsers.filter((u) => u.schoolId === currentSchool.id);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1E293B] text-white border-b border-slate-700/80 shadow-md">
        {/* SchoolLink Mobile Web Portal Top Bar - Clean Non-Overlapping Header */}
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          {/* Left: School Selector with Logo */}
          <button
            onClick={() => setShowSchoolSheet(true)}
            className="flex items-center gap-2 text-left min-w-0 flex-1 group active:opacity-80 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-sm text-white shrink-0 overflow-hidden shadow-xs">
              {currentSchool.logo ? (
                <img
                  src={currentSchool.logo}
                  alt={currentSchool.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                'SL'
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h1 className="text-xs font-bold text-white truncate group-hover:text-emerald-400 max-w-[140px] sm:max-w-[220px]">
                  {currentSchool.name}
                </h1>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {currentSchool.code} &bull; Term 1
              </p>
            </div>
          </button>

          {/* Right: Quick Role Badge, Notification Bell & Menu Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Role Switcher Pill OR Locked Role Pill */}
            {isRoleSwitchingAllowed ? (
              <button
                onClick={() => setShowRoleSheet(true)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition active:scale-95 cursor-pointer ${roleMeta[currentUser.role].bg}`}
                title="Tap to switch persona"
              >
                {roleMeta[currentUser.role].icon}
                <span className="max-w-[55px] sm:max-w-[70px] truncate">{roleMeta[currentUser.role].label.split(' ')[0]}</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-70" />
              </button>
            ) : (
              <div
                className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${roleMeta[currentUser.role].bg} opacity-90`}
                title="Assigned Role (Locked in Live Mode)"
              >
                <Lock className="w-2.5 h-2.5 text-amber-400" />
                <span className="max-w-[55px] sm:max-w-[70px] truncate">{roleMeta[currentUser.role].label.split(' ')[0]}</span>
              </div>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotificationSheet(true)}
              className="relative p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 active:scale-95 cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Mobile Hub Menu Button */}
            <button
              type="button"
              onClick={() => setShowMenuSheet(true)}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40 active:scale-95 cursor-pointer shadow-xs"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Action Pill Strip - Horizontal Scrolling, Guaranteed No Overlapping */}
        <div className="px-3 py-1.5 bg-slate-900/70 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {onViewWebsite && (
            <button
              type="button"
              onClick={onViewWebsite}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-teal-300 border border-slate-700 text-[11px] font-semibold active:scale-95 transition cursor-pointer"
            >
              <Globe className="w-3 h-3 text-teal-400" />
              <span>Website</span>
            </button>
          )}

          {onOpenSchoolModules && (
            <button
              type="button"
              onClick={onOpenSchoolModules}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[11px] font-semibold active:scale-95 transition cursor-pointer"
            >
              <Grid className="w-3 h-3 text-emerald-400" />
              <span>Modules</span>
            </button>
          )}

          {onOpenGoogleMeet && (
            <button
              type="button"
              onClick={onOpenGoogleMeet}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[11px] font-semibold active:scale-95 transition cursor-pointer"
            >
              <Video className="w-3 h-3 text-emerald-400" />
              <span>Meet</span>
            </button>
          )}

          {onOpenGeminiAI && (
            <button
              type="button"
              onClick={onOpenGeminiAI}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-semibold shadow-xs active:scale-95 transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Studio</span>
            </button>
          )}

          {onOpenDailyCodeModal && (
            <button
              type="button"
              onClick={onOpenDailyCodeModal}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold active:scale-95 transition cursor-pointer"
            >
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>Passkey</span>
            </button>
          )}

          {onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold active:scale-95 transition cursor-pointer"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                alt=""
                className="w-3.5 h-3.5 rounded-full object-cover"
              />
              <span>Profile</span>
            </button>
          )}
        </div>
      </header>

      {/* MOBILE BOTTOM SHEET: School Selector */}
      {showSchoolSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setShowSchoolSheet(false)}
          />
          <div className="relative bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-250 shadow-2xl">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Select School Institution</h3>
                <p className="text-xs text-slate-500">Switch active school context</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                {schools.length} Schools
              </span>
            </div>

            <div className="divide-y divide-slate-100 my-3">
              {schools.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    switchSchool(s.id);
                    setShowSchoolSheet(false);
                  }}
                  className={`w-full text-left py-3.5 px-3 flex items-center gap-3 rounded-xl transition ${
                    s.id === currentSchool.id ? 'bg-emerald-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 overflow-hidden">
                    {s.logo ? (
                      <img src={s.logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Building className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.code} &bull; {s.city}</p>
                  </div>
                  {s.id === currentSchool.id && (
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setShowSchoolSheet(false);
                  onOpenCreateSchool();
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New School</span>
              </button>
              <button
                onClick={() => setShowSchoolSheet(false)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET: Role Switcher */}
      {showRoleSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setShowRoleSheet(false)}
          />
          <div className="relative bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-250 shadow-2xl">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Switch Persona & Role</h3>
                <p className="text-xs text-slate-500">Test different user experiences in SchoolLink</p>
              </div>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Multi-Role
              </span>
            </div>

            <div className="divide-y divide-slate-100 my-2">
              {schoolUsers.map((u) => {
                const r = roleMeta[u.role];
                const isSelected = u.id === currentUser.id;
                const isUserAdmin = u.role === 'head_teacher' || u.role === 'platform_admin';
                const requiresPasskey = isUserAdmin && isDemoMode && !isAdminUnlocked;

                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      if (requiresPasskey) {
                        setTargetAdminUser(u);
                        setAdminAccessModalOpen(true);
                        setShowRoleSheet(false);
                      } else {
                        switchUser(u.id);
                        setShowRoleSheet(false);
                      }
                    }}
                    className={`w-full text-left py-3 px-2 flex items-center gap-3 rounded-xl transition cursor-pointer ${
                      isSelected ? 'bg-emerald-50/80 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={u.avatarUrl}
                      alt={u.fullName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {u.fullName}
                        </span>
                        {u.verificationStatus === 'verified' && (
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        {requiresPasskey && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded border border-amber-300 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Code</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {r.label}
                        </span>
                        {u.studentProfile && (
                          <span className="truncate">{u.studentProfile.className}</span>
                        )}
                        {u.teacherProfile && (
                          <span className="truncate">{u.teacherProfile.specialization}</span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowRoleSheet(false);
                  onOpenRoleSwitcher();
                }}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Full Persona Gateway</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowRoleSheet(false);
                    onOpenRegisterUser();
                  }}
                  className="flex-1 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold"
                >
                  + Register User
                </button>
                <button
                  onClick={() => setShowRoleSheet(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET: Notifications */}
      {showNotificationSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setShowNotificationSheet(false)}
          />
          <div className="relative bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-250 shadow-2xl">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100 my-2 max-h-60 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`py-3 px-2 transition ${!n.isRead ? 'bg-emerald-50/50 rounded-xl' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowNotificationSheet(false)}
              className="w-full mt-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET: Main Navigation & Actions Menu */}
      {showMenuSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setShowMenuSheet(false)}
          />
          <div className="relative bg-white rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-250 shadow-2xl pb-safe">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />
            
            {/* Header: User Profile Summary */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                  alt={currentUser.fullName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{currentUser.fullName}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowMenuSheet(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 gap-2 my-3.5">
              {onViewWebsite && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenuSheet(false);
                    onViewWebsite();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-teal-50/60 hover:bg-teal-100/60 border border-teal-200/80 flex items-center gap-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900">Public School Website</p>
                    <p className="text-[11px] text-slate-500">Admissions, ECZ syllabus, faculty and events</p>
                  </div>
                </button>
              )}

              {onOpenSchoolModules && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenuSheet(false);
                    onOpenSchoolModules();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-200/80 flex items-center gap-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Grid className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900">SchoolLink Modules Hub</p>
                    <p className="text-[11px] text-slate-500">Excel, Word Studio, Digital Classroom, Study Notes, Fees</p>
                  </div>
                </button>
              )}

              {onOpenGoogleMeet && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenuSheet(false);
                    onOpenGoogleMeet();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200/80 flex items-center gap-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Video className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900">Google Meet Video Classroom</p>
                    <p className="text-[11px] text-slate-500">Live lessons, consultations, and board meetings</p>
                  </div>
                </button>
              )}

              {onOpenGeminiAI && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenuSheet(false);
                    onOpenGeminiAI();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-purple-50/60 hover:bg-purple-100/60 border border-purple-200/80 flex items-center gap-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900">Gemini AI Assistant</p>
                    <p className="text-[11px] text-slate-500">Grounded search, ECZ curriculum help & lesson drafts</p>
                  </div>
                </button>
              )}

              {onOpenDailyCodeModal && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenuSheet(false);
                    onOpenDailyCodeModal();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/80 flex items-center gap-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900">Daily Passkey & Master Security</p>
                    <p className="text-[11px] text-slate-500">Universal master passkey: 5 April 2013</p>
                  </div>
                </button>
              )}

              {onOpenProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenuSheet(false);
                    onOpenProfile();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900">My Profile & Security</p>
                    <p className="text-[11px] text-slate-500">Edit contact details and credentials</p>
                  </div>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowMenuSheet(false);
                  setShowSchoolSheet(true);
                }}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-3 transition cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Building className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900">Switch Institution</p>
                  <p className="text-[11px] text-slate-500">Current: {currentSchool.name}</p>
                </div>
              </button>

              {isRoleSwitchingAllowed && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenuSheet(false);
                    setShowRoleSheet(true);
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-3 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900">Switch Role / Persona</p>
                    <p className="text-[11px] text-slate-500">Test as Teacher, Student, Parent, or Admin</p>
                  </div>
                </button>
              )}
            </div>

            {/* Bottom Actions: Reset, Mode, Logout */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700">Demonstration Mode</span>
                <button
                  type="button"
                  onClick={() => setDemoMode(!isDemoMode)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                    isDemoMode ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isDemoMode ? 'Active (Demo)' : 'Live Mode'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowMenuSheet(false);
                  logout();
                }}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of SchoolLink</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Access Passcode Modal */}
      <AdminAccessModal
        isOpen={adminAccessModalOpen}
        onClose={() => {
          setAdminAccessModalOpen(false);
          setTargetAdminUser(null);
        }}
        targetRole={targetAdminUser?.role}
        targetUserId={targetAdminUser?.id}
      />
    </>
  );
};
