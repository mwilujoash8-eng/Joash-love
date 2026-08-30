import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  Bell,
  Calendar,
  Plus,
  Award,
  BookOpen,
  DollarSign,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenQuickAction: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenQuickAction,
}) => {
  const { currentUser, notifications } = useSchool();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNavItems = (role: UserRole) => {
    switch (role) {
      case 'head_teacher':
      case 'deputy_head_teacher':
        return [
          { id: 'overview', label: 'Hub', icon: LayoutDashboard },
          { id: 'excel_studio', label: 'Excel Studio', icon: FileSpreadsheet },
          { id: 'approvals', label: 'Approvals', icon: Award },
          { id: 'notices', label: 'Notices', icon: Bell, badge: unreadCount },
        ];
      case 'teacher':
        return [
          { id: 'overview', label: 'My Classes', icon: LayoutDashboard },
          { id: 'excel_studio', label: 'Excel Studio', icon: FileSpreadsheet },
          { id: 'attendance', label: 'Attendance', icon: Users },
          { id: 'timetable', label: 'Timetable', icon: Calendar },
        ];
      case 'student':
        return [
          { id: 'results', label: 'Results', icon: Award },
          { id: 'homework', label: 'Assignments', icon: BookOpen },
          { id: 'timetable', label: 'Timetable', icon: Calendar },
          { id: 'notices', label: 'Notices', icon: Bell, badge: unreadCount },
        ];
      case 'parent':
        return [
          { id: 'children', label: 'Children', icon: Users },
          { id: 'reports', label: 'Reports', icon: Award },
          { id: 'fees', label: 'Fees & Pay', icon: DollarSign },
          { id: 'notices', label: 'Notices', icon: Bell, badge: unreadCount },
        ];
      case 'school_board':
        return [
          { id: 'overview', label: 'Strategy', icon: LayoutDashboard },
          { id: 'financials', label: 'Financials', icon: DollarSign },
          { id: 'staffing', label: 'Staffing', icon: Users },
          { id: 'audit', label: 'Audit Log', icon: ShieldAlert },
        ];
      default:
        return [
          { id: 'overview', label: 'Hub', icon: LayoutDashboard },
          { id: 'excel_studio', label: 'Excel', icon: FileSpreadsheet },
          { id: 'attendance', label: 'Roster', icon: Users },
          { id: 'notices', label: 'Notices', icon: Bell, badge: unreadCount },
        ];
    }
  };

  const navItems = getNavItems(currentUser.role);
  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2, 4);

  return (
    <nav aria-label="Mobile navigation bar" className="fixed bottom-0 left-0 right-0 z-40 bg-[#1E293B] text-white border-t border-slate-700/80 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] pb-safe">
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-between relative">
        {/* Left 2 Items */}
        <div className="flex items-center justify-around flex-1">
          {leftItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition relative min-w-[56px] active:scale-95 ${
                  isActive
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-[#1E293B]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Center Floating Action Button (FAB) */}
        <div className="px-2 -mt-5">
          <button
            onClick={onOpenQuickAction}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 border-2 border-[#1E293B] hover:scale-105 active:scale-95 transition"
            title="Open Quick Actions Menu"
          >
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>

        {/* Right 2 Items */}
        <div className="flex items-center justify-around flex-1">
          {rightItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition relative min-w-[56px] active:scale-95 ${
                  isActive
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-[#1E293B]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
