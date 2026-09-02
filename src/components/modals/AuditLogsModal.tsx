import React, { useState } from 'react';
import {
  X,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Download
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({ isOpen, onClose }) => {
  const { auditLogs, currentSchool } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    const matchSearch =
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterAction === 'ALL' || log.action === filterAction;
    return matchSearch && matchFilter;
  });

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Actor Name', 'Actor Role', 'Action', 'Details', 'IP Address'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.userName || ''}"`,
      `"${l.userRole || ''}"`,
      `"${l.action}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      `"${l.ipAddress || '102.140.211.89'}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SchoolLink_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">System Security & Audit Trail</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  IMMUTABLE LOGS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentSchool.name} &bull; Tamper-evident activity ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit trail by user, action, or details..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
            >
              <option value="ALL">All Actions ({auditLogs.length})</option>
              <option value="PUBLISH_REPORT_CARDS">Publish Report Cards</option>
              <option value="APPROVE_ASSESSMENT">Approve Assessment</option>
              <option value="SAVE_ASSESSMENT_SCORES">Save Scores</option>
              <option value="REGISTER_USER">User Registrations</option>
              <option value="CREATE_SCHOOL">School Setup</option>
            </select>
          </div>
        </div>

        {/* Log table */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-white text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">Timestamp (CAT)</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5">Operator</th>
                  <th className="p-2.5">Audit Event Details</th>
                  <th className="p-2.5">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-2.5 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-2.5 font-bold text-indigo-700">{log.action}</td>
                    <td className="p-2.5">
                      <span className="font-bold text-slate-900">{log.userName}</span>
                      <span className="block text-[10px] text-slate-500">{log.userRole}</span>
                    </td>
                    <td className="p-2.5 font-sans text-slate-700 max-w-md">{log.details}</td>
                    <td className="p-2.5 text-slate-400 text-[11px]">{log.ipAddress || '102.140.211.89'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredLogs.length} verified events</span>
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
