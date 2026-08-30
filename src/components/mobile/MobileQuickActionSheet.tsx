import React from 'react';
import {
  X,
  UserPlus,
  FileSpreadsheet,
  CheckCircle,
  Award,
  Bell,
  Smartphone,
  Laptop,
  Sparkles,
  Layers,
  BookOpen,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useDevice } from '../../context/DeviceContext';

interface MobileQuickActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const MobileQuickActionSheet: React.FC<MobileQuickActionSheetProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const { currentUser, currentSchool } = useSchool();
  const { deviceMode, setDeviceMode } = useDevice();

  if (!isOpen) return null;

  const actions = [
    {
      id: 'open_ai_assistant',
      title: 'Gemini AI Assistant (Search & Maps)',
      subtitle: 'ECZ syllabus, STEM reasoning & campus navigation',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
      badge: 'Gemini 3.5 & Pro',
    },
    {
      id: 'quick_add_student',
      title: 'Add Learner (Auto STU Number)',
      subtitle: `Generate STU-${currentSchool.academicYear}-XXX ID`,
      icon: UserPlus,
      color: 'bg-amber-500 text-white',
      badge: 'Zambia ECZ',
    },
    {
      id: 'open_excel',
      title: 'Mobile Excel Studio',
      subtitle: 'Continuous Assessment & Attendance grid',
      icon: FileSpreadsheet,
      color: 'bg-emerald-600 text-white',
      badge: 'Live Sheet',
    },
    {
      id: 'record_attendance',
      title: 'Fast Attendance Check-in',
      subtitle: 'Mark Class Present/Absent with 1 tap',
      icon: CheckCircle,
      color: 'bg-blue-600 text-white',
    },
    {
      id: 'view_report_cards',
      title: 'Digital Term Report Cards',
      subtitle: 'Official ECZ statement of results & PDF',
      icon: Award,
      color: 'bg-purple-600 text-white',
    },
    {
      id: 'post_announcement',
      title: 'Post School Notice & SMS',
      subtitle: 'Broadcast to teachers, parents, or learners',
      icon: Bell,
      color: 'bg-rose-500 text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-250 shadow-2xl">
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Quick Actions Hub</h3>
            <p className="text-xs text-slate-500">
              One-tap administrative & classroom shortcuts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 gap-2.5 my-4">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  onSelectAction(act.id);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center gap-3.5 transition active:scale-98 group"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${act.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                      {act.title}
                    </p>
                    {act.badge && (
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md">
                        {act.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {act.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Device Switcher Section */}
        <div className="p-3 bg-slate-900 text-white rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Device View Engine
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {deviceMode.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              onClick={() => setDeviceMode('auto')}
              className={`py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition ${
                deviceMode === 'auto'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto</span>
            </button>
            <button
              onClick={() => setDeviceMode('smartphone')}
              className={`py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition ${
                deviceMode === 'smartphone'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Phone</span>
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition ${
                deviceMode === 'desktop'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Laptop className="w-3 h-3" />
              <span>Desktop</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
        >
          Close Menu
        </button>
      </div>
    </div>
  );
};
