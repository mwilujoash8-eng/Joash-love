import React, { useState } from 'react';
import {
  Building,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Calendar,
  DollarSign,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface BoardDashboardProps {
  onOpenProfile?: () => void;
}

export const BoardDashboard: React.FC<BoardDashboardProps> = ({ onOpenProfile }) => {
  const { currentSchool, currentUser, allUsers, reportCards } = useSchool();
  const [activeTab, setActiveTab] = useState<'oversight' | 'finance' | 'strategic'>('oversight');

  const boardPosition = currentUser.boardProfile?.position || 'Board Chairperson';
  const boardCommittee = currentUser.boardProfile?.committee || 'Executive Governance & Finance';

  const academicData = [
    { grade: 'Grade 8', passRate: 91.5, distinctions: 14 },
    { grade: 'Grade 9', passRate: 96.2, distinctions: 22 },
    { grade: 'Grade 10', passRate: 88.0, distinctions: 12 },
    { grade: 'Grade 11', passRate: 94.8, distinctions: 19 },
    { grade: 'Grade 12', passRate: 98.1, distinctions: 28 },
  ];

  return (
    <div className="space-y-6">
      {/* Board Header */}
      <div className="bg-[#1E293B] rounded-2xl p-6 text-white shadow-lg border border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xl shadow-inner">
              <Building className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  School Board & Governance
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  {boardPosition.toUpperCase()}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-0.5 text-white">{currentUser.fullName}</h1>
              <p className="text-xs text-slate-300 mt-1">
                {boardCommittee} &bull; {currentSchool.name}
              </p>
            </div>
          </div>

          {onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Building className="w-4 h-4 text-emerald-400" />
              <span>Edit Governor Profile</span>
            </button>
          )}
        </div>

        {/* Board High-Level KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/80">
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Total Learner Body</span>
            <div className="text-xl font-bold text-white mt-0.5">360 Learners</div>
            <span className="text-[10px] text-emerald-400">100% Capacity</span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Overall School Pass Rate</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">95.4%</div>
            <span className="text-[10px] text-slate-400">ECZ Standards</span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">PTA Revenue Collected</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">K 162,000</div>
            <span className="text-[10px] text-slate-400">92% collection rate</span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Capital Projects</span>
            <div className="text-xl font-bold text-sky-400 mt-0.5">4 Active</div>
            <span className="text-[10px] text-slate-400">Solar, Lab, Reticulation</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 pb-1 overflow-x-auto">
        {[
          { id: 'oversight', label: 'Academic & Institutional Oversight', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'finance', label: 'Financial & Infrastructure Audits', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'strategic', label: 'Strategic Governance Resolutions', icon: <ShieldCheck className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
              activeTab === tab.id
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: ACADEMIC OVERSIGHT */}
      {activeTab === 'oversight' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Term 1 School Performance Overview</h3>
                <p className="text-xs text-slate-500">Board governance analysis of academic achievement across grades 8 through 12</p>
              </div>
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded">
                Strategic Goal: &gt;95% Pass Rate
              </span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={academicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="passRate" name="Pass Rate (%)" fill="#7e22ce" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCE & INFRASTRUCTURE */}
      {activeTab === 'finance' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Capital Projects & PTA Infrastructure Ledger</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: '15kVA Solar Photovoltaic Inverter & Battery', allocation: 'K 120,000', status: '85% Complete', notes: 'Guarantees uninterrupted power for computer labs and examinations' },
              { name: 'ICT Computer Lab Upgrade (40 Workstations)', allocation: 'K 180,000', status: '100% Completed', notes: 'Commissioned for practical examinations' },
              { name: 'Commercial High-Yield Borehole', allocation: 'K 65,000', status: '60% Complete', notes: 'Ensures water sanitation security across boarding facilities' },
              { name: 'Science Laboratory Reagents & ECZ Kits', allocation: 'K 45,000', status: '100% Delivered', notes: 'Procured from Ministry accredited suppliers' },
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                  <span className="text-xs font-mono font-bold text-purple-900">{p.allocation}</span>
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {p.status}
                </span>
                <p className="text-xs text-slate-600 italic">&ldquo;{p.notes}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STRATEGIC GOVERNANCE */}
      {activeTab === 'strategic' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Board Resolutions & Strategic Directives</h3>
          {[
            { ref: 'RES-2026-01', title: 'Adoption of SchoolLink Digital Operating System', date: 'January 2026', body: 'Unanimous resolution to transition all academic records, attendance, and term report cards to the secure cloud platform.' },
            { ref: 'RES-2026-02', title: 'Approval of Solar Inverter Infrastructure Budget', date: 'February 2026', body: 'Approved allocation of K120,000 ZMW from the school capital development fund.' },
          ].map((r, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-900">{r.ref}</span>
                <span className="text-[10px] text-slate-500">{r.date}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-1">{r.title}</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
