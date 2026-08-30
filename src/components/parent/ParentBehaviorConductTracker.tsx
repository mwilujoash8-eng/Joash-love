import React, { useState } from 'react';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Send,
  Calendar,
  User,
  ShieldAlert
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { StudentBehaviorLog } from '../../types';

interface ParentBehaviorConductTrackerProps {
  studentNumber: string;
  studentName: string;
}

export const ParentBehaviorConductTracker: React.FC<ParentBehaviorConductTrackerProps> = ({
  studentNumber,
  studentName,
}) => {
  const { behaviorLogs, acknowledgeBehaviorLog } = useSchool();

  const studentLogs = behaviorLogs.filter(
    (log) => log.studentNumber === studentNumber
  );

  const totalMerits = studentLogs
    .filter((l) => l.type === 'merit')
    .reduce((sum, l) => sum + l.points, 0);

  const totalDemerits = studentLogs
    .filter((l) => l.type === 'demerit')
    .reduce((sum, l) => sum + Math.abs(l.points), 0);

  const netPoints = totalMerits - totalDemerits;

  // Acknowledgement form state
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [parentFeedbackNote, setParentFeedbackNote] = useState<string>('');

  const handleAcknowledge = (logId: string) => {
    acknowledgeBehaviorLog(
      logId,
      parentFeedbackNote || 'Acknowledged and discussed at home with learner.'
    );
    setSelectedLogId(null);
    setParentFeedbackNote('');
  };

  return (
    <div className="space-y-6">
      {/* SUMMARY OVERVIEW */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Student Conduct & Pastoral Care
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Behavior & Commendation Log — {studentName}
            </h2>
            <p className="text-xs text-slate-500">
              Continuous character assessment, teacher merits, and pastoral observations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Merit Points</span>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">+{totalMerits}</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-center">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">Demerits</span>
              <div className="text-lg font-black text-rose-600 dark:text-rose-400">-{totalDemerits}</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center">
              <span className="text-[10px] font-bold uppercase">Net Score</span>
              <div className="text-lg font-black">{netPoints > 0 ? `+${netPoints}` : netPoints}</div>
            </div>
          </div>
        </div>

        {/* LOGS LIST */}
        <div className="space-y-3 pt-4">
          {studentLogs.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No behavior or disciplinary logs recorded this term.
            </div>
          ) : (
            studentLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-xl border transition ${
                  log.type === 'merit'
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                    : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      log.type === 'merit'
                        ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300'
                    }`}>
                      {log.type === 'merit' ? <Award className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black px-2 py-0.5 rounded ${
                          log.type === 'merit'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        }`}>
                          {log.type === 'merit' ? `+${log.points} Merit Points` : `${log.points} Demerit`}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                          {(log.category || log.title || '').replace(/_/g, ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 font-medium">
                        "{log.description}"
                      </p>

                      <div className="text-[11px] text-slate-500 mt-1.5 flex flex-wrap items-center gap-2">
                        <span>Reported by: <strong>{log.teacherName}</strong></span>
                        <span>•</span>
                        <span>{new Date(log.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* ACKNOWLEDGEMENT STATUS */}
                  <div className="sm:text-right shrink-0">
                    {log.acknowledgedByParent ? (
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100/60 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Signed by Parent</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedLogId(selectedLogId === log.id ? null : log.id)}
                        className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Acknowledge Note</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* PARENT NOTES DISPLAY */}
                {log.parentNotes && (
                  <div className="mt-3 p-2.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Parent Response:</span> {log.parentNotes}
                  </div>
                )}

                {/* EXPANDABLE ACKNOWLEDGEMENT FORM */}
                {selectedLogId === log.id && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Add Parent Remarks / Action Plan (Sent to {log.teacherName}):
                    </label>
                    <textarea
                      rows={2}
                      value={parentFeedbackNote}
                      onChange={(e) => setParentFeedbackNote(e.target.value)}
                      placeholder="e.g., Thank you for the update. We have commended Mubita at home..."
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedLogId(null)}
                        className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcknowledge(log.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Confirm Electronic Signature</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
