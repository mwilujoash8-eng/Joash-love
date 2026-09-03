import React, { useState } from 'react';
import {
  DollarSign,
  Shield,
  Send,
  Lock,
  Globe,
  FileText,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Plus,
  Trash2,
  Filter,
  CreditCard,
  Phone,
  Sparkles,
  Award,
  Users,
  Search,
  ExternalLink
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { FinancePublication, PublicationTargetAudience, FinancePublicationCategory } from '../../types';

export const FinancePublishingStudio: React.FC = () => {
  const {
    currentUser,
    currentSchool,
    financePublications,
    publishFinanceNotice,
    deleteFinanceNotice,
    canViewFinanceNotice
  } = useSchool();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposingNotice, setIsComposingNotice] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Form State
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'fee_schedule' as FinancePublicationCategory,
    targetAudience: 'finance_restricted' as PublicationTargetAudience,
    amountZMW: 3200,
    dueDate: '2026-02-28',
    bankName: 'Zambia National Commercial Bank (Zanaco)',
    accountName: `${currentSchool.name} - Tuition Account`,
    accountNumber: '1049-8839-2041',
    branch: `${currentSchool.city} Main Branch`,
    mobileMoneyCode: '*115*4*1049# (Airtel) / *303*2*1049# (MTN)',
    attachmentName: 'Official_Financial_Schedule_2026.pdf',
    isPinned: true
  });

  // Check if current user is authorized to publish
  const isFinanceTeamMember = currentUser.isFinanceTeam === true;
  const isSchoolAdmin = currentUser.role === 'head_teacher' || currentUser.role === 'deputy_head_teacher' || currentUser.role === 'school_board';
  const canPublish = isFinanceTeamMember || isSchoolAdmin;

  // Filter notices visible to current user
  const visibleNotices = financePublications.filter((pub) => {
    // 1. Role-based view check
    if (!canViewFinanceNotice(pub, currentUser)) return false;

    // 2. Category filter
    if (activeCategoryFilter !== 'all' && pub.category !== activeCategoryFilter) return false;

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return pub.title.toLowerCase().includes(q) || pub.content.toLowerCase().includes(q);
    }

    return true;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title.trim() || !newNotice.content.trim()) return;

    publishFinanceNotice({
      title: newNotice.title.trim(),
      content: newNotice.content.trim(),
      category: newNotice.category,
      targetAudience: newNotice.targetAudience,
      amountZMW: newNotice.amountZMW > 0 ? Number(newNotice.amountZMW) : undefined,
      dueDate: newNotice.dueDate || undefined,
      bankDetails: {
        bankName: newNotice.bankName,
        accountName: newNotice.accountName,
        accountNumber: newNotice.accountNumber,
        branch: newNotice.branch,
        mobileMoneyCode: newNotice.mobileMoneyCode
      },
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      isFinanceTeamAuthor: isFinanceTeamMember,
      financeRoleTitle: currentUser.financeRoleTitle || (isFinanceTeamMember ? 'Finance Committee Officer' : 'School Administration'),
      isPinned: newNotice.isPinned,
      attachments: [
        { name: newNotice.attachmentName || 'School_Finance_Publication.pdf', size: '320 KB', type: 'application/pdf' }
      ]
    });

    setPublishSuccess(true);
    setIsComposingNotice(false);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Finance & School Publishing Studio</span>
              </span>

              {isFinanceTeamMember && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Finance Team Member: {currentUser.financeRoleTitle || 'Accounts Officer'}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              School Finance Bulletins & Publishing
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Official school fees, PTA development levies, and bursaries. Financial notices are securely routed to{' '}
              <strong className="text-amber-300">Parents, Head Teacher, and Deputy Head Teacher</strong>, while public bulletins are broadcast to <strong className="text-indigo-300">Every Role</strong>.
            </p>
          </div>

          {/* COMPOSE BUTTON FOR FINANCE TEAM & ADMINS */}
          {canPublish && (
            <button
              type="button"
              onClick={() => setIsComposingNotice(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-black shadow-lg hover:shadow-xl transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Notice / Bulletin</span>
            </button>
          )}
        </div>

        {/* ROLE PERMISSION AUDIENCE SUMMARY CARD */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-100">Confidential Finance Target</p>
              <p className="text-[11px] text-slate-400">Restricted strictly to Parents, Head Teacher & Deputy</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-100">General Publishing Target</p>
              <p className="text-[11px] text-slate-400">Broadcast openly to Every Role (Students, Teachers, Board)</p>
            </div>
          </div>
        </div>
      </div>

      {publishSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Notice successfully published and dispatched to authorized recipient portals!</span>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Notices' },
            { id: 'fee_schedule', label: 'Fee Schedules' },
            { id: 'pta_levy_notice', label: 'PTA Levies' },
            { id: 'budget_report', label: 'Bursary & CDF' },
            { id: 'audited_statement', label: 'Audits' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search financial notices..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* PUBLICATIONS LIST */}
      <div className="space-y-4">
        {visibleNotices.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No Notices Found</h3>
            <p className="text-xs text-slate-500">
              There are no publications matching the current filter or security access level.
            </p>
          </div>
        ) : (
          visibleNotices.map((pub) => {
            const isRestricted = pub.targetAudience === 'finance_restricted';

            return (
              <div
                key={pub.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between gap-4"
              >
                {/* NOTICE HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* AUDIENCE BADGE */}
                      {isRestricted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                          <Lock className="w-3 h-3 text-amber-700" />
                          <span>Confidential: Parents, Head & Deputy Only</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-300">
                          <Globe className="w-3 h-3 text-indigo-700" />
                          <span>Public Bulletin: Every Role</span>
                        </span>
                      )}

                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {pub.category.replace('_', ' ')}
                      </span>

                      {pub.isPinned && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          📌 Pinned Official Notice
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {pub.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>Published by <strong>{pub.authorName}</strong></span>
                      {pub.financeRoleTitle && (
                        <span className="text-indigo-600 font-semibold">• {pub.financeRoleTitle}</span>
                      )}
                      <span>• {new Date(pub.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>
                  </div>

                  {/* AMOUNT CHIP IF SPECIFIED */}
                  {pub.amountZMW && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-right shrink-0">
                      <p className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Fee / Levy Amount</p>
                      <p className="text-lg sm:text-xl font-black text-emerald-900">
                        K{pub.amountZMW.toLocaleString()} <span className="text-xs font-bold text-emerald-700">ZMW</span>
                      </p>
                      {pub.dueDate && (
                        <p className="text-[10px] font-semibold text-slate-600 mt-0.5">
                          Due: {new Date(pub.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* CONTENT BODY */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {pub.content}
                </p>

                {/* BANK DETAILS BREAKDOWN IF INCLUDED */}
                {pub.bankDetails && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Bank Account</p>
                      <p className="font-bold text-slate-800">{pub.bankDetails.bankName}</p>
                      <p className="font-mono text-slate-600 font-bold">{pub.bankDetails.accountNumber} ({pub.bankDetails.branch})</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Money Merchant Pay</p>
                      <p className="font-bold text-indigo-700">{pub.bankDetails.mobileMoneyCode || 'Airtel / MTN SchoolPay'}</p>
                      <p className="text-[11px] text-slate-500">Attach receipt in Parent Portal</p>
                    </div>
                  </div>
                )}

                {/* ATTACHMENTS & CONTROLS */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {pub.attachments?.map((att, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                        title="Download Attachment"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{att.name} ({att.size})</span>
                        <Download className="w-3 h-3 text-slate-500 ml-1" />
                      </div>
                    ))}
                  </div>

                  {canPublish && (pub.authorId === currentUser.id || currentUser.role === 'head_teacher') && (
                    <button
                      type="button"
                      onClick={() => deleteFinanceNotice(pub.id)}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-bold transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* COMPOSE NOTICE MODAL */}
      {isComposingNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in duration-150">
            {/* MODAL HEADER */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Publish Official Notice / Bulletin</h3>
                  <p className="text-xs text-slate-300">
                    Publisher: {currentUser.fullName} ({currentUser.financeRoleTitle || currentUser.role})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsComposingNotice(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              {/* TARGET AUDIENCE SELECTION (CRUCIAL USER REQUIREMENT) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-black text-slate-800 mb-2">
                  1. Select Target Recipient Audience (Strict Security Rule)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl border-2 flex flex-col gap-1 cursor-pointer transition ${
                      newNotice.targetAudience === 'finance_restricted'
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Confidential Finance</span>
                      </span>
                      <input
                        type="radio"
                        name="targetAudience"
                        checked={newNotice.targetAudience === 'finance_restricted'}
                        onChange={() => setNewNotice({ ...newNotice, targetAudience: 'finance_restricted' })}
                        className="text-amber-600"
                      />
                    </div>
                    <p className="text-[11px] text-amber-900 leading-tight">
                      Sent <strong>ONLY</strong> to Parents, Head Teacher, and Deputy Head Teacher. Students and general teachers are excluded.
                    </p>
                  </label>

                  <label
                    className={`p-3 rounded-xl border-2 flex flex-col gap-1 cursor-pointer transition ${
                      newNotice.targetAudience === 'all_roles'
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Public Bulletin</span>
                      </span>
                      <input
                        type="radio"
                        name="targetAudience"
                        checked={newNotice.targetAudience === 'all_roles'}
                        onChange={() => setNewNotice({ ...newNotice, targetAudience: 'all_roles' })}
                        className="text-indigo-600"
                      />
                    </div>
                    <p className="text-[11px] text-indigo-900 leading-tight">
                      Broadcast to <strong>EVERY ROLE</strong> (Students, Teachers, Parents, Board members).
                    </p>
                  </label>
                </div>
              </div>

              {/* NOTICE TITLE & CATEGORY */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    placeholder="e.g., Term 1 Tuition Fee Schedule / PTA Solar Levy"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as FinancePublicationCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="fee_schedule">Tuition Fee Schedule</option>
                    <option value="pta_levy_notice">PTA Development Levy</option>
                    <option value="budget_report">CDF / Bursary Guide</option>
                    <option value="audited_statement">Audited Statement</option>
                    <option value="general_announcement">General School Bulletin</option>
                  </select>
                </div>
              </div>

              {/* CONTENT BODY */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Details & Payment Instructions
                </label>
                <textarea
                  rows={4}
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Provide details regarding payment instructions, deadlines, account numbers, and reconciliation..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* AMOUNT & DUE DATE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount (ZMW) - Optional
                  </label>
                  <input
                    type="number"
                    value={newNotice.amountZMW}
                    onChange={(e) => setNewNotice({ ...newNotice, amountZMW: Number(e.target.value) })}
                    placeholder="3200"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Due Date - Optional
                  </label>
                  <input
                    type="date"
                    value={newNotice.dueDate}
                    onChange={(e) => setNewNotice({ ...newNotice, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* BANK & MOBILE MONEY DETAILS */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-800">Bank & Mobile Money Routing</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={newNotice.bankName}
                    onChange={(e) => setNewNotice({ ...newNotice, bankName: e.target.value })}
                    placeholder="Bank Name (e.g. Zanaco)"
                    className="px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                  <input
                    type="text"
                    value={newNotice.accountNumber}
                    onChange={(e) => setNewNotice({ ...newNotice, accountNumber: e.target.value })}
                    placeholder="Account Number"
                    className="px-3 py-1.5 rounded-lg border border-slate-300 font-mono"
                  />
                  <input
                    type="text"
                    value={newNotice.mobileMoneyCode}
                    onChange={(e) => setNewNotice({ ...newNotice, mobileMoneyCode: e.target.value })}
                    placeholder="Mobile Money Code (Airtel/MTN)"
                    className="sm:col-span-2 px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* ATTACHMENT NAME */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Attachment PDF Name
                </label>
                <input
                  type="text"
                  value={newNotice.attachmentName}
                  onChange={(e) => setNewNotice({ ...newNotice, attachmentName: e.target.value })}
                  placeholder="Official_Fee_Schedule.pdf"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComposingNotice(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md transition cursor-pointer"
                >
                  Publish & Dispatch Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
