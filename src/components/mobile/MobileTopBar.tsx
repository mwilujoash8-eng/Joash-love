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
  Globe
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useDevice } from '../../context/DeviceContext';
import { UserRole } from '../../types';

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
  } = useSchool();

  const { deviceMode, setDeviceMode, effectiveDevice, toggleDeviceMode } = useDevice();

  const [showSchoolSheet, setShowSchoolSheet] = useState(false);
  const [showRoleSheet, setShowRoleSheet] = useState(false);
  const [showNotificationSheet, setShowNotificationSheet] = useState(false);

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
      <header className="sticky top-0 z-40 bg-[#1E293B] text-white border-b border-slate-700 shadow-md">
        {/* SchoolLink Mobile Web Portal Top Bar */}
        <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
          {/* Left: School Selector with Logo */}
          <button
            onClick={() => setShowSchoolSheet(true)}
            className="flex items-center gap-2 text-left min-w-0 flex-1 group active:opacity-80"
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
                <h1 className="text-xs font-bold text-white truncate group-hover:text-emerald-400">
                  {currentSchool.name}
                </h1>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {currentSchool.code} &bull; Term 1 ({currentSchool.academicYear})
              </p>
            </div>
          </button>

          {/* Right: School Modules, Quick Role Badge, Notification Bell & Device Switcher */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* School Public Website Button */}
            {onViewWebsite && (
              <button
                type="button"
                onClick={onViewWebsite}
                className="p-1.5 rounded-lg bg-slate-800 text-teal-400 border border-slate-700 active:scale-95 shadow-2xs"
                title="View Public School Website"
              >
                <Globe className="w-3.5 h-3.5" />
              </button>
            )}

            {/* School Modules Launcher Button */}
            {onOpenSchoolModules && (
              <button
                type="button"
                onClick={onOpenSchoolModules}
                className="p-1.5 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 active:scale-95 shadow-2xs"
                title="SchoolLink Website Modules (Excel, Word, Zoom, Notes, AI, Fees)"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Google Meet Video Button */}
            {onOpenGoogleMeet && (
              <button
                type="button"
                onClick={onOpenGoogleMeet}
                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 active:scale-95 shadow-2xs"
                title="Google Meet Video Conferencing"
              >
                <Video className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}

            {/* Daily Passkey & Subscriptions */}
            {onOpenDailyCodeModal && (
              <button
                type="button"
                onClick={onOpenDailyCodeModal}
                className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 active:scale-95 shadow-2xs"
                title="Daily Code & Master Admin Passkey (5 April 2013)"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}

            {/* Gemini AI Studio Button */}
            {onOpenGeminiAI && (
              <button
                type="button"
                onClick={onOpenGeminiAI}
                className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/40 active:scale-95 shadow-2xs"
                title="Gemini AI Studio (Search & Maps Grounding)"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Quick Role Switcher Pill */}
            <button
              onClick={() => setShowRoleSheet(true)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition active:scale-95 ${roleMeta[currentUser.role].bg}`}
              title="Tap to switch persona"
            >
              {roleMeta[currentUser.role].icon}
              <span className="max-w-[70px] truncate">{roleMeta[currentUser.role].label.split(' ')[0]}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-70" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotificationSheet(true)}
              className="relative p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 active:scale-95"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Avatar with Profile View */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="w-7 h-7 rounded-full border border-emerald-500 overflow-hidden shrink-0 active:scale-95 cursor-pointer"
              title="View & Edit Profile"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
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
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setShowRoleSheet(false);
                    }}
                    className={`w-full text-left py-3 px-2 flex items-center gap-3 rounded-xl transition ${
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
              className="w-full mt-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
