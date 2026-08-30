import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  ChevronDown,
  RefreshCw,
  Sun,
  Flag,
  CheckCircle2
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { TermId } from '../../types';

export const ZambianCalendarBanner: React.FC = () => {
  const { currentSchool, zambianCalendarInfo, setSchoolActiveTerm, syncZambianAcademicCalendar } = useSchool();
  const [showTermSelector, setShowTermSelector] = useState(false);
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);

  const isHoliday = zambianCalendarInfo.isHolidayPeriod;
  const currentWeek = zambianCalendarInfo.currentWeek;
  const daysLeft = zambianCalendarInfo.daysRemainingInTerm;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-2xl p-3.5 sm:p-4 text-white shadow-md mb-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Zambian Flag Colors Accent & Official Term Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
                Republic of Zambia • MoE Calendar
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                {currentSchool.academicYear} Academic Year
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                {isHoliday ? (
                  <span className="text-amber-300 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-400" />
                    {zambianCalendarInfo.holidayName || 'Official School Vacation Break'}
                  </span>
                ) : (
                  <span>
                    {currentSchool.activeTerm === 'term_1' && 'Term 1: Continuous Assessment Phase'}
                    {currentSchool.activeTerm === 'term_2' && 'Term 2: Mid-Year Mastery Phase'}
                    {currentSchool.activeTerm === 'term_3' && 'Term 3: ECZ National Examination Phase'}
                  </span>
                )}
              </h2>
            </div>
          </div>
        </div>

        {/* Center/Right: Calendar Progress & Term Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          {/* Term Week Pill */}
          {!isHoliday ? (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">
                Week <strong className="text-white font-mono">{currentWeek}</strong> of 13
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-300 font-semibold">{daysLeft} Days to Term Close</span>
            </div>
          ) : (
            <div className="bg-amber-950/60 border border-amber-800/60 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next Term Re-Opens: <strong>{zambianCalendarInfo.nextTermStartDate || 'January 2027'}</strong></span>
            </div>
          )}

          {/* View Key Milestones Button */}
          <button
            type="button"
            onClick={() => setShowMilestonesModal(true)}
            className="px-2.5 py-1.5 bg-emerald-800/40 hover:bg-emerald-700/50 text-emerald-200 border border-emerald-600/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="View ECZ Examination dates and Ministry term milestones"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Official Dates & ECZ Schedule</span>
            <span className="sm:hidden">Schedule</span>
          </button>

          {/* Term Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTermSelector(!showTermSelector)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{currentSchool.activeTerm.replace('_', ' ').toUpperCase()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showTermSelector && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 border-b border-slate-800">
                  Switch Active Zambian Term
                </div>

                {[
                  { id: 'term_1', name: `Term 1 (${currentSchool.academicYear})`, dates: 'Jan 12 - Apr 10', badge: '13 Weeks' },
                  { id: 'term_2', name: `Term 2 (${currentSchool.academicYear})`, dates: 'May 11 - Aug 07', badge: '13 Weeks' },
                  { id: 'term_3', name: `Term 3 (${currentSchool.academicYear})`, dates: 'Sep 07 - Dec 04', badge: 'ECZ Exams' },
                ].map((term) => (
                  <button
                    key={term.id}
                    type="button"
                    onClick={() => {
                      setSchoolActiveTerm(term.id as TermId);
                      setShowTermSelector(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                      currentSchool.activeTerm === term.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{term.name}</div>
                      <div className="text-[10px] opacity-80">{term.dates}</div>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${currentSchool.activeTerm === term.id ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {term.badge}
                    </span>
                  </button>
                ))}

                <div className="pt-1 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      syncZambianAcademicCalendar();
                      setShowTermSelector(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-950/40 rounded flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-Sync with Real Zambian Date</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: OFFICIAL ZAMBIAN MOE & ECZ MILESTONES */}
      {showMilestonesModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Ministry of Education Zambia
                </span>
                <h3 className="text-lg font-bold text-white">
                  {currentSchool.academicYear} Official Academic & ECZ Calendar
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMilestonesModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
              {/* Term 1 Box */}
              <div className={`p-3 rounded-xl border ${currentSchool.activeTerm === 'term_1' ? 'bg-emerald-950/50 border-emerald-600/60' : 'bg-slate-800/40 border-slate-800'}`}>
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="text-emerald-400">Term 1 (January - April)</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">13 Weeks</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-1 space-y-0.5">
                  <div>• <strong>Jan 12:</strong> Official School Opening</div>
                  <div>• <strong>Feb 06:</strong> Continuous Assessment Test 1 (CA-1)</div>
                  <div>• <strong>Feb 27:</strong> Mid-Term Break Week</div>
                  <div>• <strong>Mar 06:</strong> Continuous Assessment Test 2 (CA-2)</div>
                  <div>• <strong>Apr 03:</strong> End of Term 1 Final Examinations</div>
                  <div>• <strong>Apr 10:</strong> Term 1 Closing & Report Card Issuance</div>
                  <div>• <strong>Apr 11 - May 10:</strong> 4-Week April Vacation Break</div>
                </div>
              </div>

              {/* Term 2 Box */}
              <div className={`p-3 rounded-xl border ${currentSchool.activeTerm === 'term_2' ? 'bg-emerald-950/50 border-emerald-600/60' : 'bg-slate-800/40 border-slate-800'}`}>
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="text-amber-400">Term 2 (May - August)</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">13 Weeks</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-1 space-y-0.5">
                  <div>• <strong>May 11:</strong> Term 2 Official Re-Opening</div>
                  <div>• <strong>May 25:</strong> Africa Freedom Day Holiday</div>
                  <div>• <strong>Jun 05:</strong> Continuous Assessment Test 1 (CA-1)</div>
                  <div>• <strong>Jun 26:</strong> Mid-Term Break Week</div>
                  <div>• <strong>Jul 06:</strong> Heroes & Unity Days</div>
                  <div>• <strong>Jul 31:</strong> Term 2 Final Exams & Mock Tests</div>
                  <div>• <strong>Aug 07:</strong> Term 2 Closing & August Vacation</div>
                  <div>• <strong>Aug 08 - Sep 06:</strong> 4-Week August Holiday Break</div>
                </div>
              </div>

              {/* Term 3 Box */}
              <div className={`p-3 rounded-xl border ${currentSchool.activeTerm === 'term_3' ? 'bg-emerald-950/50 border-emerald-600/60' : 'bg-slate-800/40 border-slate-800'}`}>
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="text-rose-400">Term 3 & ECZ National Exams (September - December)</span>
                  <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded">Promotional & National</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-1 space-y-0.5">
                  <div>• <strong>Sep 07:</strong> Term 3 Commencement</div>
                  <div>• <strong>Oct 05:</strong> World Teachers' Day Celebrations</div>
                  <div>• <strong>Oct 24:</strong> National Independence Day Holiday</div>
                  <div>• <strong>Oct 26 - Nov 13:</strong> <strong className="text-rose-300">ECZ Grade 12 School Certificate Examinations</strong></div>
                  <div>• <strong>Nov 16 - Nov 27:</strong> <strong className="text-rose-300">ECZ Grade 9 JSSLE National Examinations</strong></div>
                  <div>• <strong>Nov 23 - Nov 27:</strong> <strong className="text-rose-300">ECZ Grade 7 Composite Examinations</strong></div>
                  <div>• <strong>Dec 04:</strong> Speech Day, Graduation & Final Term Closing</div>
                  <div>• <strong>Dec 05 - Jan 10:</strong> 5-Week Annual Christmas Vacation</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowMilestonesModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Calendar Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
