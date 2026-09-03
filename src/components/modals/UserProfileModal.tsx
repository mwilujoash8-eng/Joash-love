import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Shield,
  GraduationCap,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  HeartPulse,
  Lock,
  Camera,
  Save,
  Check,
  Plus,
  Trash2,
  Briefcase,
  AlertCircle,
  Clock,
  Video,
  FileText,
  Copy,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { User, UserRole } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: User; // if undefined, edits currentUser
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
];

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  targetUser,
}) => {
  const { currentUser, currentSchool, updateUserProfile, updateUserProfilePic, updateUserCoverPhoto } = useSchool();
  const activeUser = targetUser || currentUser;

  // Active Tab: 'basic' | 'role_details' | 'health_emergency' | 'security'
  const [activeTab, setActiveTab] = useState<'basic' | 'role_details' | 'health_emergency' | 'security'>('basic');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);

  // Form State initialized from activeUser
  const [formData, setFormData] = useState<User>(activeUser);

  // Helper for dynamic array items (e.g. student connected IDs, teacher assigned classes, etc.)
  const [newStudentIdInput, setNewStudentIdInput] = useState('');
  const [newClubInput, setNewClubInput] = useState('');
  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [newExpertiseInput, setNewExpertiseInput] = useState('');

  // Password update state
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    passwordError: '',
  });

  useEffect(() => {
    if (activeUser) {
      setFormData(JSON.parse(JSON.stringify(activeUser)));
      setSaveSuccess(false);
    }
  }, [activeUser, isOpen]);

  if (!isOpen) return null;

  const roleMeta: Record<UserRole, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    head_teacher: { label: 'Head Teacher / Principal', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: <Shield className="w-4 h-4 text-emerald-600" /> },
    deputy_head_teacher: { label: 'Deputy Head Teacher', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: <Shield className="w-4 h-4 text-blue-600" /> },
    teacher: { label: 'Faculty Educator / Teacher', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200', icon: <GraduationCap className="w-4 h-4 text-teal-600" /> },
    student: { label: 'Student Scholar', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200', icon: <BookOpen className="w-4 h-4 text-sky-600" /> },
    parent: { label: 'Parent / Legal Guardian', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: <Users className="w-4 h-4 text-amber-600" /> },
    school_board: { label: 'School Board Governor', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: <Building className="w-4 h-4 text-purple-600" /> },
    platform_admin: { label: 'Platform Administrator', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', icon: <Shield className="w-4 h-4 text-indigo-600" /> },
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(formData.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if updating password
    let updatedPayload: Partial<User> = { ...formData };
    if (passwordState.newPassword) {
      if (passwordState.newPassword !== passwordState.confirmPassword) {
        setPasswordState((p) => ({ ...p, passwordError: 'Passwords do not match' }));
        return;
      }
      if (passwordState.newPassword.length < 6) {
        setPasswordState((p) => ({ ...p, passwordError: 'Password must be at least 6 characters' }));
        return;
      }
      updatedPayload.password = passwordState.newPassword;
    }

    updateUserProfile(activeUser.id, updatedPayload);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Helper toggle functions for multi-selects
  const toggleTeacherClass = (classId: string) => {
    setFormData((prev) => {
      const existing = prev.teacherProfile?.assignedClassIds || [];
      const updated = existing.includes(classId)
        ? existing.filter((c) => c !== classId)
        : [...existing, classId];
      return {
        ...prev,
        teacherProfile: {
          ...prev.teacherProfile!,
          assignedClassIds: updated,
        },
      };
    });
  };

  const toggleTeacherSubject = (subjectId: string) => {
    setFormData((prev) => {
      const existing = prev.teacherProfile?.assignedSubjectIds || [];
      const updated = existing.includes(subjectId)
        ? existing.filter((s) => s !== subjectId)
        : [...existing, subjectId];
      return {
        ...prev,
        teacherProfile: {
          ...prev.teacherProfile!,
          assignedSubjectIds: updated,
        },
      };
    });
  };

  const handleAddConnectedChild = () => {
    if (!newStudentIdInput.trim()) return;
    const cleanId = newStudentIdInput.trim().toUpperCase();
    setFormData((prev) => {
      const currentList = prev.parentProfile?.connectedStudentNumbers || [];
      if (currentList.includes(cleanId)) return prev;
      return {
        ...prev,
        parentProfile: {
          ...prev.parentProfile!,
          connectedStudentNumbers: [...currentList, cleanId],
        },
      };
    });
    setNewStudentIdInput('');
  };

  const handleRemoveConnectedChild = (num: string) => {
    setFormData((prev) => ({
      ...prev,
      parentProfile: {
        ...prev.parentProfile!,
        connectedStudentNumbers: (prev.parentProfile?.connectedStudentNumbers || []).filter((n) => n !== num),
      },
    }));
  };

  const handleAddClub = () => {
    if (!newClubInput.trim()) return;
    setFormData((prev) => {
      const list = prev.studentProfile?.clubsAndSocieties || [];
      return {
        ...prev,
        studentProfile: {
          ...prev.studentProfile!,
          clubsAndSocieties: [...list, newClubInput.trim()],
        },
      };
    });
    setNewClubInput('');
  };

  const handleRemoveClub = (club: string) => {
    setFormData((prev) => ({
      ...prev,
      studentProfile: {
        ...prev.studentProfile!,
        clubsAndSocieties: (prev.studentProfile?.clubsAndSocieties || []).filter((c) => c !== club),
      },
    }));
  };

  const handleAddExpertise = () => {
    if (!newExpertiseInput.trim()) return;
    setFormData((prev) => {
      const list = prev.boardProfile?.governanceExpertise || [];
      return {
        ...prev,
        boardProfile: {
          ...prev.boardProfile!,
          governanceExpertise: [...list, newExpertiseInput.trim()],
        },
      };
    });
    setNewExpertiseInput('');
  };

  const handleRemoveExpertise = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      boardProfile: {
        ...prev.boardProfile!,
        governanceExpertise: (prev.boardProfile?.governanceExpertise || []).filter((e) => e !== item),
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in duration-150"
        onClick={(e) => e.stopPropagation()}
        id="user-profile-modal-card"
      >
        {/* MODAL HEADER WITH FACEBOOK-STYLE COVER PHOTO & HERO BANNER */}
        <div className="relative shrink-0 border-b border-slate-700 bg-slate-900">
          {/* COVER PHOTO BANNER */}
          <div className="h-32 sm:h-44 w-full relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
            <img
              src={formData.coverPhotoUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80'}
              alt="Profile Cover"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 p-2 text-white/80 hover:text-white bg-slate-900/60 hover:bg-slate-900 rounded-xl transition cursor-pointer"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>

            {/* EDIT COVER PHOTO BUTTON */}
            <button
              type="button"
              onClick={() => setShowCoverPicker(!showCoverPicker)}
              className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold border border-white/20 shadow-md backdrop-blur-xs transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              <span>Change Cover Photo</span>
            </button>
          </div>

          {/* COVER PHOTO PICKER POP-OUT */}
          {showCoverPicker && (
            <div className="p-4 bg-slate-800 border-b border-slate-700 animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-white">Select Cover Photo Banner</p>
                <button
                  type="button"
                  onClick={() => setShowCoverPicker(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {COVER_PRESETS.map((cUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setFormData((p) => ({ ...p, coverPhotoUrl: cUrl }));
                      updateUserCoverPhoto(activeUser.id, cUrl);
                      setShowCoverPicker(false);
                    }}
                    className={`h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                      formData.coverPhotoUrl === cUrl ? 'border-indigo-400 scale-105' : 'border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={cUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AVATAR & IDENTITY DETAILS */}
          <div className="p-4 sm:p-6 pt-0 relative z-10 flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16">
            {/* AVATAR WITH CAMERA OVERLAY */}
            <div className="relative group shrink-0">
              <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl border-4 border-slate-900 overflow-hidden shadow-2xl bg-slate-800 relative">
                <img
                  src={formData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                  alt={formData.fullName}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-indigo-400" />
                  <span>Update Pic</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg border-2 border-slate-900 text-xs transition cursor-pointer"
                title="Change Profile Picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* IDENTITY DETAILS & BADGES */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 shadow-xs ${roleMeta[formData.role].bg} ${roleMeta[formData.role].color}`}>
                  {roleMeta[formData.role].icon}
                  <span>{roleMeta[formData.role].label}</span>
                </span>

                {/* FINANCE TEAM BADGE */}
                {formData.isFinanceTeam && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Finance Team: {formData.financeRoleTitle || 'Accounts Officer'}</span>
                  </span>
                )}

                {/* PTA AUTO-MEMBER BADGE (FOR EVERYONE EXCEPT STUDENTS) */}
                {formData.role !== 'student' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Users className="w-3 h-3 text-indigo-400" />
                    <span>PTA Council Auto-Member</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white truncate flex items-center gap-2">
                <span>{formData.titlePrefix ? `${formData.titlePrefix} ` : ''}{formData.fullName}</span>
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1 text-slate-300">
                  <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{formData.schoolName || currentSchool.name}</span>
                </span>

                <button
                  type="button"
                  onClick={handleCopyId}
                  className="flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-indigo-400 transition"
                  title="Click to copy System User ID"
                >
                  <span>ID: {formData.id}</span>
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* AVATAR PICKER POP-OUT */}
          {showAvatarPicker && (
            <div className="mt-4 p-4 bg-slate-800 rounded-2xl border border-slate-700 animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-200">Select Profile Picture Preset or Upload Custom</p>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Done
                </button>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mb-3">
                {AVATAR_PRESETS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, avatarUrl: url }));
                      setShowAvatarPicker(false);
                    }}
                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      formData.avatarUrl === url ? 'border-emerald-400 scale-105 shadow-md' : 'border-slate-700 hover:border-slate-500 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-700">
                <div className="w-full sm:flex-1">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Image URL:</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.avatarUrl || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, avatarUrl: e.target.value }))}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-emerald-500"
                  />
                </div>

                <div className="w-full sm:w-auto self-end">
                  <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Local File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-slate-100 px-4 sm:px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'basic'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Personal & Contact Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('role_details')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'role_details'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>2. {roleMeta[formData.role].label} Specifications</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
              Full Data
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('health_emergency')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'health_emergency'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            <span>3. Emergency & Health Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span>4. Security & Account</span>
          </button>
        </div>

        {/* PROFILE EDIT FORM BODY */}
        <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* SUCCESS NOTIFICATION BANNER */}
          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between animate-in fade-in duration-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold">Profile Successfully Updated & Persisted!</p>
                  <p className="text-[11px] text-emerald-700">All changes have been synchronized across your role dashboard, registers, and audit logs.</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded">
                Live
              </span>
            </div>
          )}

          {/* TAB 1: PERSONAL & CONTACT INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Universal Identity & Residential Contact
                </h3>
                <p className="text-xs text-slate-500">Official Zambian Ministry of Education personal record</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Title / Prefix */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title / Salutation</label>
                  <select
                    value={formData.titlePrefix || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, titlePrefix: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                  >
                    <option value="">(None)</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Eng.">Eng.</option>
                    <option value="Rev.">Rev.</option>
                  </select>
                </div>

                {/* Full Legal Name */}
                <div className="sm:col-span-9">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                {/* Email Address */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                    />
                  </div>
                </div>

                {/* Primary Phone Number */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Mobile Phone (Zambia) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="+260 97X XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                    />
                  </div>
                </div>

                {/* Alternate Phone / WhatsApp */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alternate / WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="+260 96X XXX XXX"
                    value={formData.alternatePhone || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, alternatePhone: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                {/* NRC Number */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    National ID / Zambian NRC (XXXXXX/XX/X)
                  </label>
                  <input
                    type="text"
                    placeholder="123456/11/1"
                    value={formData.nrcNumber || formData.parentProfile?.nationalId || formData.boardProfile?.nationalId || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        nrcNumber: val,
                        parentProfile: p.parentProfile ? { ...p.parentProfile, nationalId: val } : undefined,
                        boardProfile: p.boardProfile ? { ...p.boardProfile, nationalId: val } : undefined,
                      }));
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 font-mono focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                {/* Gender */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender || (formData.studentProfile?.gender) || 'Male'}
                    onChange={(e) => {
                      const val = e.target.value as 'Male' | 'Female' | 'Other';
                      setFormData((p) => ({
                        ...p,
                        gender: val,
                        studentProfile: p.studentProfile ? { ...p.studentProfile, gender: val as 'Male' | 'Female' } : undefined,
                      }));
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Prefer not to say</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth || formData.studentProfile?.dateOfBirth || '2000-01-01'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        dateOfBirth: val,
                        studentProfile: p.studentProfile ? { ...p.studentProfile, dateOfBirth: val } : undefined,
                      }));
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                {/* City / Province */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Town</label>
                  <input
                    type="text"
                    placeholder="e.g. Kabwe, Central Province"
                    value={formData.city || currentSchool.city || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                {/* Residential Physical Address */}
                <div className="sm:col-span-12">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Residential Physical Address / Suburb Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Plot 428, Mukobeko Road, Highridge, Kabwe"
                      value={formData.address || formData.studentProfile?.address || formData.parentProfile?.residentialAddress || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((p) => ({
                          ...p,
                          address: val,
                          studentProfile: p.studentProfile ? { ...p.studentProfile, address: val } : undefined,
                          parentProfile: p.parentProfile ? { ...p.parentProfile, residentialAddress: val } : undefined,
                        }));
                      }}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                    />
                  </div>
                </div>

                {/* Bio / Personal Statement */}
                <div className="sm:col-span-12">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Personal Statement / Professional Biography
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share your background, educational journey, goals, or message to the school community..."
                    value={formData.bio || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-emerald-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROLE-SPECIFIC DETAILED FIELDS */}
          {activeTab === 'role_details' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* --- 1. HEAD TEACHER FIELDS --- */}
              {formData.role === 'head_teacher' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider">
                        Head Teacher / Principal Governance Dossier
                      </h3>
                      <p className="text-xs text-slate-500">Senior leadership & statutory administrative details</p>
                    </div>
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        TSC (Teaching Service Commission) Registration No.
                      </label>
                      <input
                        type="text"
                        placeholder="TSC/HT/2026/89401"
                        value={formData.headTeacherProfile?.tscNumber || 'TSC/HT/2026/89401'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            headTeacherProfile: {
                              ...p.headTeacherProfile,
                              highestQualification: p.headTeacherProfile?.highestQualification || 'PhD in Educational Administration',
                              employeeNumber: p.headTeacherProfile?.employeeNumber || 'HT-KTH-001',
                              tscNumber: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Administrative Employee Number
                      </label>
                      <input
                        type="text"
                        placeholder="HT-KTH-001"
                        value={formData.headTeacherProfile?.employeeNumber || 'HT-KTH-001'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            headTeacherProfile: {
                              ...p.headTeacherProfile,
                              highestQualification: p.headTeacherProfile?.highestQualification || 'PhD in Educational Administration',
                              tscNumber: p.headTeacherProfile?.tscNumber || 'TSC/HT/2026/89401',
                              employeeNumber: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Highest Academic Qualification
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. PhD in Educational Policy & Management"
                        value={formData.headTeacherProfile?.highestQualification || 'PhD in Educational Policy & Management (UNZA)'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            headTeacherProfile: {
                              ...p.headTeacherProfile,
                              employeeNumber: p.headTeacherProfile?.employeeNumber || 'HT-KTH-001',
                              highestQualification: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Alma Mater / University Attended
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. University of Zambia (UNZA)"
                        value={formData.headTeacherProfile?.almaMater || 'University of Zambia (UNZA)'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            headTeacherProfile: {
                              ...p.headTeacherProfile,
                              employeeNumber: p.headTeacherProfile?.employeeNumber || 'HT-KTH-001',
                              highestQualification: p.headTeacherProfile?.highestQualification || 'PhD',
                              almaMater: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Years in Educational Leadership
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={formData.headTeacherProfile?.yearsInLeadership || 18}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            headTeacherProfile: {
                              ...p.headTeacherProfile,
                              employeeNumber: p.headTeacherProfile?.employeeNumber || 'HT-KTH-001',
                              highestQualification: p.headTeacherProfile?.highestQualification || 'PhD',
                              yearsInLeadership: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Principal's Office Location & Direct Extension
                      </label>
                      <input
                        type="text"
                        placeholder="Admin Block - Room 101, Ext 101"
                        value={formData.headTeacherProfile?.administrativeOffice || 'Administration Block, Office 101 (Ext: 101)'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            headTeacherProfile: {
                              ...p.headTeacherProfile,
                              employeeNumber: p.headTeacherProfile?.employeeNumber || 'HT-KTH-001',
                              highestQualification: p.headTeacherProfile?.highestQualification || 'PhD',
                              administrativeOffice: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Public & Parent Consultation Schedule
                      </label>
                      <input
                        type="text"
                        placeholder="Tuesdays & Thursdays (14:00 - 16:30)"
                        value={formData.headTeacherProfile?.consultationHours || 'Tuesdays & Thursdays (14:00 - 16:30)'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            headTeacherProfile: {
                              ...p.headTeacherProfile,
                              employeeNumber: p.headTeacherProfile?.employeeNumber || 'HT-KTH-001',
                              highestQualification: p.headTeacherProfile?.highestQualification || 'PhD',
                              consultationHours: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official Report Card Sign-off Title & Seal
                      </label>
                      <input
                        type="text"
                        placeholder="Head Teacher & Chief Examination Officer"
                        value={formData.headTeacherProfile?.officialSealTitle || 'Principal & Chief Examination Officer'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            headTeacherProfile: {
                              ...p.headTeacherProfile,
                              employeeNumber: p.headTeacherProfile?.employeeNumber || 'HT-KTH-001',
                              highestQualification: p.headTeacherProfile?.highestQualification || 'PhD',
                              officialSealTitle: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        School Vision & Leadership Philosophy
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Our vision is to empower every Zambian scholar through rigorous STEM excellence, integrity, and national leadership."
                        value={formData.headTeacherProfile?.leadershipPhilosophy || 'Fostering academic rigor, disciplined curiosity, and digital competence across the Zambian curriculum.'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            headTeacherProfile: {
                              ...p.headTeacherProfile,
                              employeeNumber: p.headTeacherProfile?.employeeNumber || 'HT-KTH-001',
                              highestQualification: p.headTeacherProfile?.highestQualification || 'PhD',
                              leadershipPhilosophy: e.target.value,
                            },
                          }))
                        }
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --- 2. DEPUTY HEAD TEACHER FIELDS --- */}
              {formData.role === 'deputy_head_teacher' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-blue-950 uppercase tracking-wider">
                        Deputy Head Administration & Academic Management
                      </h3>
                      <p className="text-xs text-slate-500">Roster coordination, timetable control & discipline</p>
                    </div>
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Portfolio Focus Responsibility
                      </label>
                      <select
                        value={formData.deputyProfile?.portfolioFocus || 'Academic Affairs & Curriculum'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            deputyProfile: {
                              ...p.deputyProfile,
                              employeeNumber: p.deputyProfile?.employeeNumber || 'DH-KTH-002',
                              qualification: p.deputyProfile?.qualification || 'M.Ed Curriculum Studies',
                              specialization: p.deputyProfile?.specialization || 'Academic Standards & Timetabling',
                              portfolioFocus: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="Academic Affairs & Curriculum">Academic Affairs & Curriculum Standards</option>
                        <option value="Administration & Staff Operations">Administration & Staff Operations</option>
                        <option value="Student Welfare & Discipline">Student Welfare & Discipline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        TSC Registration & Employee ID
                      </label>
                      <input
                        type="text"
                        placeholder="TSC/DH/2026/41029"
                        value={formData.deputyProfile?.tscNumber || 'TSC/DH/2026/41029'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            deputyProfile: {
                              ...p.deputyProfile,
                              portfolioFocus: p.deputyProfile?.portfolioFocus || 'Academic Affairs',
                              qualification: p.deputyProfile?.qualification || 'M.Ed',
                              specialization: p.deputyProfile?.specialization || 'Administration',
                              employeeNumber: p.deputyProfile?.employeeNumber || 'DH-KTH-002',
                              tscNumber: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Academic Qualifications & Specialization
                      </label>
                      <input
                        type="text"
                        placeholder="M.Ed Educational Management (CBU)"
                        value={formData.deputyProfile?.qualification || 'M.Ed in Curriculum Studies & Educational Leadership (CBU)'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            deputyProfile: {
                              ...p.deputyProfile,
                              portfolioFocus: p.deputyProfile?.portfolioFocus || 'Academic Affairs',
                              employeeNumber: p.deputyProfile?.employeeNumber || 'DH-KTH-002',
                              specialization: p.deputyProfile?.specialization || 'Pedagogy',
                              qualification: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Office Location & Duty Extension
                      </label>
                      <input
                        type="text"
                        placeholder="Admin Block - Room 102 (Ext 102)"
                        value={formData.deputyProfile?.officeLocation || 'Admin Block, Office 102 (Ext: 102)'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            deputyProfile: {
                              ...p.deputyProfile,
                              portfolioFocus: p.deputyProfile?.portfolioFocus || 'Academic Affairs',
                              employeeNumber: p.deputyProfile?.employeeNumber || 'DH-KTH-002',
                              qualification: p.deputyProfile?.qualification || 'M.Ed',
                              specialization: p.deputyProfile?.specialization || 'Pedagogy',
                              officeLocation: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --- 3. TEACHER / EDUCATOR FIELDS --- */}
              {formData.role === 'teacher' && (
                <div className="space-y-5">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-teal-950 uppercase tracking-wider">
                        Faculty Educator Teaching Profile & Load
                      </h3>
                      <p className="text-xs text-slate-500">Assigned classes, subjects, qualifications & Zoom setup</p>
                    </div>
                    <GraduationCap className="w-5 h-5 text-teal-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Teacher Service Commission (TSC) Number
                      </label>
                      <input
                        type="text"
                        placeholder="TSC/SEC/10492/2026"
                        value={formData.teacherProfile?.tscNumber || 'TSC/SEC/10492/2026'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            teacherProfile: {
                              ...p.teacherProfile!,
                              tscNumber: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Staff Employee Number
                      </label>
                      <input
                        type="text"
                        placeholder="TS-KTH-042"
                        value={formData.teacherProfile?.employeeNumber || 'TS-KTH-042'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            teacherProfile: {
                              ...p.teacherProfile!,
                              employeeNumber: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Academic Qualification & University
                      </label>
                      <input
                        type="text"
                        placeholder="BSc. Mathematics with Education (UNZA)"
                        value={formData.teacherProfile?.qualification || 'BSc. Mathematics with Education (UNZA)'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            teacherProfile: {
                              ...p.teacherProfile!,
                              qualification: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Teaching Specialization
                      </label>
                      <input
                        type="text"
                        placeholder="Senior Pure Mathematics & ICT"
                        value={formData.teacherProfile?.specialization || 'Senior Pure Mathematics & Computing'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            teacherProfile: {
                              ...p.teacherProfile!,
                              specialization: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Department
                      </label>
                      <select
                        value={formData.teacherProfile?.department || 'Mathematics'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            teacherProfile: {
                              ...p.teacherProfile!,
                              department: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="Mathematics">Department of Mathematics</option>
                        <option value="Natural Sciences">Department of Natural Sciences</option>
                        <option value="Languages & Literature">Department of Languages & Literature</option>
                        <option value="Social Sciences & Humanities">Department of Social Sciences & Humanities</option>
                        <option value="Commercial Studies">Department of Commercial Studies</option>
                        <option value="Practical & Vocational Arts">Department of Practical & Vocational Arts</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Years of Teaching Experience
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="45"
                        value={formData.teacherProfile?.yearsOfExperience || 9}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            teacherProfile: {
                              ...p.teacherProfile!,
                              yearsOfExperience: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Staffroom Desk Location / Office Hours
                      </label>
                      <input
                        type="text"
                        placeholder="Staffroom Block B, Desk 14 (Mon-Fri 14:00-15:30)"
                        value={formData.teacherProfile?.officeHours || 'Staffroom Block B, Desk 14 (Mon-Fri 14:00-15:30)'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            teacherProfile: {
                              ...p.teacherProfile!,
                              officeHours: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Personal Zoom Classroom ID
                      </label>
                      <div className="relative">
                        <Video className="w-4 h-4 text-[#2D8CFF] absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="849 2018 3920"
                          value={formData.teacherProfile?.zoomPersonalRoomId || '849 2018 3920'}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              teacherProfile: {
                                ...p.teacherProfile!,
                                zoomPersonalRoomId: e.target.value,
                              },
                            }))
                          }
                          className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* MULTI-SELECT: ASSIGNED TEACHING CLASSES */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Assigned Teaching Classes & Streams (Select all that apply):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {currentSchool.classes.map((cls) => {
                        const isAssigned = (formData.teacherProfile?.assignedClassIds || []).includes(cls.id);
                        return (
                          <button
                            key={cls.id}
                            type="button"
                            onClick={() => toggleTeacherClass(cls.id)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                              isAssigned
                                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span>{cls.name}</span>
                            {isAssigned && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* MULTI-SELECT: ASSIGNED TEACHING SUBJECTS */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Assigned Subjects / Disciplines:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {currentSchool.subjects.map((sub) => {
                        const isAssigned = (formData.teacherProfile?.assignedSubjectIds || []).includes(sub.id);
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => toggleTeacherSubject(sub.id)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                              isAssigned
                                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div>
                              <p className="truncate">{sub.name}</p>
                              <p className="text-[10px] opacity-80">{sub.code}</p>
                            </div>
                            {isAssigned && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* --- 4. STUDENT SCHOLAR FIELDS --- */}
              {formData.role === 'student' && (
                <div className="space-y-5">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-sky-950 uppercase tracking-wider">
                        Student Scholar Enrollment & Academic Track
                      </h3>
                      <p className="text-xs text-slate-500">Candidate identification, class stream, aspirations & clubs</p>
                    </div>
                    <BookOpen className="w-5 h-5 text-sky-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official Student ID Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="STU-2026-0012"
                        value={formData.studentProfile?.studentNumber || 'STU-2026-0012'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            studentProfile: {
                              ...p.studentProfile!,
                              studentNumber: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ECZ Examination Candidate Number
                      </label>
                      <input
                        type="text"
                        placeholder="ECZ-2026-98104"
                        value={formData.studentProfile?.eczCandidateNumber || 'ECZ-2026-98104'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            studentProfile: {
                              ...p.studentProfile!,
                              eczCandidateNumber: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Assigned Class & Stream
                      </label>
                      <select
                        value={formData.studentProfile?.classId || currentSchool.classes[0]?.id}
                        onChange={(e) => {
                          const sel = currentSchool.classes.find((c) => c.id === e.target.value);
                          setFormData((p) => ({
                            ...p,
                            studentProfile: {
                              ...p.studentProfile!,
                              classId: e.target.value,
                              className: sel?.name || 'Grade 9A',
                              grade: sel?.grade || '9',
                            },
                          }));
                        }}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        {currentSchool.classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} (Grade {cls.grade} - Stream {cls.stream})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Student Leadership / Prefect Post
                      </label>
                      <select
                        value={formData.studentProfile?.leadershipPosition || 'None'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            studentProfile: {
                              ...p.studentProfile!,
                              leadershipPosition: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="None">Regular Student Scholar</option>
                        <option value="Head Boy">Head Boy</option>
                        <option value="Head Girl">Head Girl</option>
                        <option value="Deputy Head Boy">Deputy Head Boy</option>
                        <option value="Deputy Head Girl">Deputy Head Girl</option>
                        <option value="Class Prefect">Class Prefect / Monitor</option>
                        <option value="Library Prefect">Library Prefect</option>
                        <option value="Timekeeper">School Timekeeper</option>
                        <option value="Sanitation Prefect">Sanitation & Health Prefect</option>
                        <option value="Sports Captain">Sports & Athletics Captain</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sports House / Team
                      </label>
                      <select
                        value={formData.studentProfile?.sportsHouse || 'Eagle House (Green)'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            studentProfile: {
                              ...p.studentProfile!,
                              sportsHouse: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="Eagle House (Green)">Eagle House (Green)</option>
                        <option value="Cheetah House (Yellow)">Cheetah House (Yellow)</option>
                        <option value="Rhino House (Blue)">Rhino House (Blue)</option>
                        <option value="Buffalo House (Red)">Buffalo House (Red)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Career Ambition & Future Discipline
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Biomedical Engineer / Software Architect"
                        value={formData.studentProfile?.careerAspirations || 'Biomedical Engineer & AI Researcher'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            studentProfile: {
                              ...p.studentProfile!,
                              careerAspirations: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Guardian / Parent Name
                      </label>
                      <input
                        type="text"
                        placeholder="Mr. Joseph Mweemba"
                        value={formData.studentProfile?.guardianName || ''}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            studentProfile: {
                              ...p.studentProfile!,
                              guardianName: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Guardian Contact Phone
                      </label>
                      <input
                        type="text"
                        placeholder="+260 977 654321"
                        value={formData.studentProfile?.guardianPhone || ''}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            studentProfile: {
                              ...p.studentProfile!,
                              guardianPhone: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* CLUBS & SOCIETIES TAGS */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Enrolled Clubs, Societies & Extracurriculars:
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(formData.studentProfile?.clubsAndSocieties || ['JETS Science Club', 'Debate Society', 'Chess Club']).map(
                        (club, i) => (
                          <span
                            key={i}
                            className="bg-sky-100 text-sky-800 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3 h-3 text-sky-600" />
                            <span>{club}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveClub(club)}
                              className="text-sky-600 hover:text-sky-900 ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )
                      )}
                    </div>
                    <div className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        placeholder="Add club (e.g. Science Fair, Choir, Football)"
                        value={newClubInput}
                        onChange={(e) => setNewClubInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddClub();
                          }
                        }}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddClub}
                        className="px-3 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 5. PARENT / GUARDIAN FIELDS --- */}
              {formData.role === 'parent' && (
                <div className="space-y-5">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-amber-950 uppercase tracking-wider">
                        Parent & Guardian Family Portfolio
                      </h3>
                      <p className="text-xs text-slate-500">Connected children, PTA designation, profession & alerts</p>
                    </div>
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Occupation & Professional Field
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Logistics Officer / Civil Engineer"
                        value={formData.parentProfile?.occupation || 'Senior Logistics Specialist'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            parentProfile: {
                              ...p.parentProfile!,
                              occupation: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Employer / Business Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Zambia Railways Limited / Self-Employed"
                        value={formData.parentProfile?.employer || 'Zambia Railways Limited'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            parentProfile: {
                              ...p.parentProfile!,
                              employer: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        PTA (Parent-Teacher Association) Executive Role
                      </label>
                      <select
                        value={formData.parentProfile?.ptaExecutiveRole || 'Active Member'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((p) => ({
                            ...p,
                            parentProfile: {
                              ...p.parentProfile!,
                              ptaExecutiveRole: val,
                              isPtaExecutive: val !== 'Active Member',
                            },
                          }));
                        }}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="Active Member">PTA General Member</option>
                        <option value="PTA Chairperson">PTA Chairperson</option>
                        <option value="PTA Vice Chairperson">PTA Vice Chairperson</option>
                        <option value="PTA Treasurer">PTA Treasurer</option>
                        <option value="PTA Committee Member">PTA Executive Committee Member</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Preferred School Alert Channel
                      </label>
                      <select
                        value={formData.parentProfile?.preferredContactMethod || 'SMS'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            parentProfile: {
                              ...p.parentProfile!,
                              preferredContactMethod: e.target.value as any,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="SMS">SMS Instant Text Message</option>
                        <option value="WhatsApp">WhatsApp Message Digest</option>
                        <option value="InApp">SchoolLink OS In-App Portal</option>
                        <option value="Email">Official Email Dispatch</option>
                      </select>
                    </div>
                  </div>

                  {/* CONNECTED STUDENT CHILDREN MANAGEMENT */}
                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-amber-950">
                        Linked Student Scholars / Enrolled Children ({formData.parentProfile?.connectedStudentNumbers?.length || 0}):
                      </label>
                      <span className="text-[10px] text-amber-800 font-semibold">
                        Instant Report Card & Gradebook Access
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {(formData.parentProfile?.connectedStudentNumbers || []).map((stuNum) => (
                        <span
                          key={stuNum}
                          className="bg-white border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-xs"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                          <span>{stuNum}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveConnectedChild(stuNum)}
                            className="text-slate-400 hover:text-rose-600 transition"
                            title="Unlink student"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        placeholder="Enter Student ID (e.g. STU-2026-0012)"
                        value={newStudentIdInput}
                        onChange={(e) => setNewStudentIdInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddConnectedChild();
                          }
                        }}
                        className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleAddConnectedChild}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Link Child</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 6. SCHOOL BOARD MEMBER FIELDS --- */}
              {formData.role === 'school_board' && (
                <div className="space-y-5">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-purple-950 uppercase tracking-wider">
                        School Board Governance & Oversight Dossier
                      </h3>
                      <p className="text-xs text-slate-500">Board designation, standing committee & strategic focus</p>
                    </div>
                    <Building className="w-5 h-5 text-purple-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Board Designation / Title
                      </label>
                      <select
                        value={formData.boardProfile?.position || 'Chairperson'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            boardProfile: {
                              ...p.boardProfile!,
                              position: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="Chairperson">Board Chairperson</option>
                        <option value="Vice Chair">Vice Chairperson</option>
                        <option value="Treasurer">Board Treasurer & Finance Chair</option>
                        <option value="Secretary">Board Secretary</option>
                        <option value="Trustee">Institutional Trustee</option>
                        <option value="Member">Board Governor / Member</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Standing Committee
                      </label>
                      <select
                        value={formData.boardProfile?.committee || 'Finance & Infrastructure'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            boardProfile: {
                              ...p.boardProfile!,
                              committee: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="Finance & Infrastructure">Finance, Audit & Infrastructure</option>
                        <option value="Academic Standards & Curriculum">Academic Standards & Curriculum Quality</option>
                        <option value="Staff Welfare & Discipline">Staff Welfare & Disciplinary Ethics</option>
                        <option value="Community & Stakeholder Engagement">Community & Stakeholder Engagement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        External Profession & Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Partner, KPMG / High Court Advocate"
                        value={formData.boardProfile?.externalProfession || 'Senior Chartered Accountant (FCCA)'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            boardProfile: {
                              ...p.boardProfile!,
                              externalProfession: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Appointed Year & Term Expiry
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Appointed: 2024"
                          value={formData.boardProfile?.appointedYear || '2024'}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              boardProfile: {
                                ...p.boardProfile!,
                                appointedYear: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-center"
                        />
                        <input
                          type="text"
                          placeholder="Expiry: 2028"
                          value={formData.boardProfile?.termExpiryYear || '2028'}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              boardProfile: {
                                ...p.boardProfile!,
                                termExpiryYear: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GOVERNANCE EXPERTISE TAGS */}
                  <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200">
                    <label className="block text-xs font-bold text-purple-950 mb-2">
                      Areas of Board Expertise:
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(formData.boardProfile?.governanceExpertise || ['Financial Audit & Budgeting', 'Legal Compliance', 'STEM Infrastructure']).map(
                        (item, i) => (
                          <span
                            key={i}
                            className="bg-white border border-purple-300 text-purple-900 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                          >
                            <Award className="w-3 h-3 text-purple-600" />
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExpertise(item)}
                              className="text-purple-500 hover:text-rose-600 ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )
                      )}
                    </div>
                    <div className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        placeholder="Add expertise (e.g. Grant Management, IT Policy)"
                        value={newExpertiseInput}
                        onChange={(e) => setNewExpertiseInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddExpertise();
                          }
                        }}
                        className="flex-1 px-3 py-1.5 bg-white border border-purple-300 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddExpertise}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EMERGENCY & HEALTH DETAILS */}
          {activeTab === 'health_emergency' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Emergency Medical Contacts & Clinical Health Information
                </h3>
                <p className="text-xs text-slate-500">Crucial records for school clinic, laboratory safety & sudden emergencies</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Emergency Contact Name */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Emergency Contact Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Mulenga Musonda"
                    value={formData.emergencyContactName || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, emergencyContactName: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                {/* Emergency Relationship */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Spouse / Parent / Sibling"
                    value={formData.emergencyRelationship || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, emergencyRelationship: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                {/* Emergency Phone */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+260 97X XXX XXX"
                    value={formData.emergencyContactPhone || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, emergencyContactPhone: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                {/* Blood Group */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup || formData.studentProfile?.bloodGroup || 'O+'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        bloodGroup: val,
                        studentProfile: p.studentProfile ? { ...p.studentProfile, bloodGroup: val } : undefined,
                      }));
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-emerald-500"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                  </select>
                </div>

                {/* Allergies */}
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Known Allergies (Food, Chemical, Drug)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Peanuts, Dust, Bee stings (or 'None')"
                    value={formData.allergies || formData.studentProfile?.allergies || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        allergies: val,
                        studentProfile: p.studentProfile ? { ...p.studentProfile, allergies: val } : undefined,
                      }));
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                {/* Chronic Medical Conditions */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Medical Conditions / Health Warnings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Asthma (Inhaler user), Diabetes (or 'None')"
                    value={formData.medicalConditions || formData.studentProfile?.medicalConditions || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        medicalConditions: val,
                        studentProfile: p.studentProfile ? { ...p.studentProfile, medicalConditions: val } : undefined,
                      }));
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                {/* Dietary Requirements */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dietary Requirements (Cafeteria / Dining Hall)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Halal, Vegetarian, Gluten Free, Standard"
                    value={formData.dietaryRequirements || formData.studentProfile?.dietaryRequirements || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        dietaryRequirements: val,
                        studentProfile: p.studentProfile ? { ...p.studentProfile, dietaryRequirements: val } : undefined,
                      }));
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & CREDENTIALS */}
          {activeTab === 'security' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Account Credentials & Authentication Security
                </h3>
                <p className="text-xs text-slate-500">Manage your encrypted login password & account ledger</p>
              </div>

              {passwordState.passwordError && (
                <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordState.passwordError}</span>
                </div>
              )}

              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-700" />
                  <span>Update Account Password</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={passwordState.newPassword}
                      onChange={(e) => {
                        setPasswordState((p) => ({ ...p, newPassword: e.target.value, passwordError: '' }));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={passwordState.confirmPassword}
                      onChange={(e) => {
                        setPasswordState((p) => ({ ...p, confirmPassword: e.target.value, passwordError: '' }));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Leave password fields blank if you only wish to update personal or role information.
                </p>
              </div>

              {/* ACCOUNT STATS & LEDGER SNAPSHOT */}
              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] border-b border-slate-800 pb-2">
                  <span>Account Registered:</span>
                  <span>{new Date(formData.createdAt || '2026-01-01').toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] border-b border-slate-800 pb-2">
                  <span>Verification Status:</span>
                  <span className="text-emerald-400 font-bold uppercase">{formData.verificationStatus}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span>System Authority Role:</span>
                  <span className="text-white font-bold">{formData.role}</span>
                </div>
              </div>
            </div>
          )}

          {/* FORM FOOTER ACTIONS */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 bg-white/95 backdrop-blur-xs">
            <div className="text-xs text-slate-500 hidden sm:block">
              <span>All changes are automatically audited with time and IP signatures.</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-200 hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Complete Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
