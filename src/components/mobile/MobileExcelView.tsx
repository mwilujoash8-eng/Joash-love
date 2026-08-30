import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UserPlus,
  Hash,
  Sparkles,
  Award,
  Save,
  CheckCircle,
  Plus,
  Minus,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Sliders,
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface StudentGradeRow {
  row: number;
  studentNo: string;
  fullName: string;
  test1: number;
  test2: number;
  test3: number;
  exam: number;
  weighted: number;
  eczGrade: string;
  comment: string;
}

export const MobileExcelView: React.FC = () => {
  const { currentSchool, saveAssessment } = useSchool();
  const [academicYear, setAcademicYear] = useState<string>(
    currentSchool.academicYear || String(new Date().getFullYear())
  );
  const [selectedClass, setSelectedClass] = useState<string>('Grade 9A');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Initial realistic learner data for continuous assessment marksheet
  const [learners, setLearners] = useState<StudentGradeRow[]>([
    { row: 5, studentNo: `STU-${academicYear}-001`, fullName: 'Bwalya Chanda', test1: 18, test2: 17, test3: 19, exam: 82, weighted: 85, eczGrade: '1 (Distinction)', comment: 'Exceptional problem-solving skills in algebra' },
    { row: 6, studentNo: `STU-${academicYear}-002`, fullName: 'Mubanga Tembo', test1: 14, test2: 15, test3: 16, exam: 74, weighted: 74, eczGrade: '2 (Distinction)', comment: 'Strong performance across all units' },
    { row: 7, studentNo: `STU-${academicYear}-003`, fullName: 'Kondwani Phiri', test1: 12, test2: 13, test3: 11, exam: 62, weighted: 61, eczGrade: '3 (Merit)', comment: 'Good progress, needs geometry practice' },
    { row: 8, studentNo: `STU-${academicYear}-004`, fullName: 'Natasha Lungu', test1: 11, test2: 10, test3: 12, exam: 58, weighted: 57, eczGrade: '4 (Merit)', comment: 'Consistent homework submission' },
    { row: 9, studentNo: `STU-${academicYear}-005`, fullName: 'Taonga Banda', test1: 9, test2: 10, test3: 8, exam: 48, weighted: 47, eczGrade: '5 (Credit)', comment: 'Improvement noted in algebra basics' },
    { row: 10, studentNo: `STU-${academicYear}-006`, fullName: 'Chileshe Mulenga', test1: 16, test2: 15, test3: 17, exam: 79, weighted: 81, eczGrade: '1 (Distinction)', comment: 'Excellent conceptual grasp' },
    { row: 11, studentNo: `STU-${academicYear}-007`, fullName: 'Zizwani Sakala', test1: 8, test2: 7, test3: 9, exam: 42, weighted: 41, eczGrade: '6 (Credit)', comment: 'Requires additional revision support' },
  ]);

  // Modal for quick add
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newLearnerName, setNewLearnerName] = useState('');

  // Calculate ECZ grade based on weighted total
  const computeEczGrade = (pct: number): string => {
    if (pct >= 75) return '1 (Distinction)';
    if (pct >= 70) return '2 (Distinction)';
    if (pct >= 65) return '3 (Merit)';
    if (pct >= 60) return '4 (Merit)';
    if (pct >= 55) return '5 (Credit)';
    if (pct >= 50) return '6 (Credit)';
    if (pct >= 45) return '7 (Satisfactory)';
    if (pct >= 40) return '8 (Satisfactory)';
    return '9 (Unsatisfactory)';
  };

  // Recompute weighted score
  const updateScore = (
    index: number,
    field: 'test1' | 'test2' | 'test3' | 'exam',
    deltaOrVal: number,
    isAbsolute = false
  ) => {
    setLearners((prev) => {
      const next = [...prev];
      const current = { ...next[index] };
      const maxVal = field === 'exam' ? 100 : 20;

      let newVal = isAbsolute ? deltaOrVal : (current[field] || 0) + deltaOrVal;
      newVal = Math.max(0, Math.min(maxVal, newVal));
      current[field] = newVal;

      // ECZ 40% CA + 60% Exam Weighting formula
      const caSum = current.test1 + current.test2 + current.test3;
      const ca40 = (caSum / 60) * 40;
      const exam60 = current.exam * 0.6;
      const weighted = Math.round(ca40 + exam60);

      current.weighted = weighted;
      current.eczGrade = computeEczGrade(weighted);
      next[index] = current;
      return next;
    });
  };

  // Change Academic Year & batch update student IDs
  const handleYearChange = (newYear: string) => {
    setAcademicYear(newYear);
    setLearners((prev) =>
      prev.map((l, i) => ({
        ...l,
        studentNo: `STU-${newYear}-${String(i + 1).padStart(3, '0')}`,
      }))
    );
    setSyncStatus(`✓ Updated all student registration numbers to STU-${newYear}-XXX`);
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // Quick Add Learner
  const handleAddLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearnerName.trim()) return;

    const nextIndex = learners.length + 1;
    const autoNo = `STU-${academicYear}-${String(nextIndex).padStart(3, '0')}`;
    const newEntry: StudentGradeRow = {
      row: learners.length + 5,
      studentNo: autoNo,
      fullName: newLearnerName.trim(),
      test1: 10,
      test2: 10,
      test3: 10,
      exam: 50,
      weighted: 50,
      eczGrade: '6 (Credit)',
      comment: 'Continuous assessment in progress',
    };

    setLearners((prev) => [...prev, newEntry]);
    setNewLearnerName('');
    setIsAddOpen(false);
    setSyncStatus(`✨ Added "${newEntry.fullName}" with ${autoNo}`);
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // 1-Click Sync to School Database
  const handleSyncToGradebook = () => {
    const assessmentPayload: any = {
      id: `ca_sheet_mob_${Date.now()}`,
      schoolId: currentSchool.id,
      academicYear,
      termId: 'term_1',
      subjectId: 'sub_mat',
      subjectName: selectedSubject,
      classId: 'cls_9a',
      className: selectedClass,
      teacherId: 'usr_t_01',
      teacherName: 'Mr. Emmanuel Mwansa',
      title: 'Term 1 Continuous Assessment & Final ECZ Weighted Scores',
      type: 'examination',
      maxScore: 100,
      date: new Date().toISOString().split('T')[0],
      weekNumber: 13,
      status: 'submitted',
      isLocked: false,
      scores: learners.map((l) => ({
        studentId: `stu_dyn_${l.row}`,
        studentNumber: l.studentNo,
        studentName: l.fullName,
        rawScore: l.weighted,
        maxScore: 100,
        percentage: l.weighted,
        remarks: `${l.eczGrade} - ${l.comment}`,
      })),
    };

    saveAssessment(assessmentPayload);
    setSyncStatus('✓ Successfully Synced CA Marks to Head Teacher Approval Queue!');
    setTimeout(() => setSyncStatus(null), 4000);
  };

  const filtered = learners.filter(
    (l) =>
      l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.studentNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Mobile Excel Header & Controls */}
      <div className="bg-[#107C41] text-white p-4 rounded-2xl shadow-lg border border-emerald-700">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center font-bold text-base shadow-xs">
              <FileSpreadsheet className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">Mobile Excel Studio</h2>
              <p className="text-[11px] text-emerald-100">
                ECZ Continuous Assessment (40% CA + 60% Exam)
              </p>
            </div>
          </div>

          <button
            onClick={handleSyncToGradebook}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition shrink-0"
            title="Sync all mobile marks directly into school gradebook database"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        </div>

        {/* Sync Toast */}
        {syncStatus && (
          <div className="mt-2 p-2 bg-emerald-900/90 border border-emerald-300 text-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="truncate">{syncStatus}</span>
          </div>
        )}

        {/* Academic Year & Class Chips */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-600/60">
          <div className="bg-emerald-800/80 px-2 py-1 rounded-xl">
            <span className="text-[9px] text-emerald-200 block font-bold uppercase">Year</span>
            <select
              value={academicYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none w-full cursor-pointer"
            >
              {['2024', '2025', '2026', '2027', '2028'].map((y) => (
                <option key={y} value={y} className="bg-slate-800 text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-emerald-800/80 px-2 py-1 rounded-xl">
            <span className="text-[9px] text-emerald-200 block font-bold uppercase">Class</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none w-full cursor-pointer"
            >
              {['Grade 9A', 'Grade 9B', 'Grade 10 Sci', 'Grade 11 Arts', 'Grade 12'].map((c) => (
                <option key={c} value={c} className="bg-slate-800 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-emerald-800/80 px-2 py-1 rounded-xl">
            <span className="text-[9px] text-emerald-200 block font-bold uppercase">Subject</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none w-full cursor-pointer"
            >
              {['Mathematics', 'Science', 'English', 'Social Studies', 'ICT'].map((s) => (
                <option key={s} value={s} className="bg-slate-800 text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Search & Add Action Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learner or STU number..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs"
          />
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Learner</span>
        </button>
      </div>

      {/* Mobile Touch Learner Cards */}
      <div className="space-y-3">
        {filtered.map((learner, idx) => (
          <div
            key={learner.studentNo}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3"
          >
            {/* Header: Student Name, ID, Weighted Total & ECZ Grade */}
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {learner.fullName}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {learner.studentNo}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{learner.comment}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-black text-emerald-700">
                  {learner.weighted}%
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                  ECZ {learner.eczGrade}
                </span>
              </div>
            </div>

            {/* Continuous Assessment Steppers (Test 1, Test 2, Test 3) */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Test 1 */}
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 block">T1 (/20)</span>
                <div className="flex items-center justify-between gap-1 mt-1">
                  <button
                    onClick={() => updateScore(idx, 'test1', -1)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold active:bg-slate-100 text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-slate-900">{learner.test1}</span>
                  <button
                    onClick={() => updateScore(idx, 'test1', 1)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold active:bg-slate-100 text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Test 2 */}
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 block">T2 (/20)</span>
                <div className="flex items-center justify-between gap-1 mt-1">
                  <button
                    onClick={() => updateScore(idx, 'test2', -1)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold active:bg-slate-100 text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-slate-900">{learner.test2}</span>
                  <button
                    onClick={() => updateScore(idx, 'test2', 1)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold active:bg-slate-100 text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Test 3 */}
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 block">T3 (/20)</span>
                <div className="flex items-center justify-between gap-1 mt-1">
                  <button
                    onClick={() => updateScore(idx, 'test3', -1)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold active:bg-slate-100 text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-slate-900">{learner.test3}</span>
                  <button
                    onClick={() => updateScore(idx, 'test3', 1)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold active:bg-slate-100 text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Exam Score /100 Stepper */}
            <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                  Final Exam Mark (/100)
                </span>
                <span className="text-[11px] text-emerald-700">60% National Weighting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateScore(idx, 'exam', -5)}
                  className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-bold text-xs active:scale-95 shadow-2xs"
                >
                  -5
                </button>
                <input
                  type="number"
                  value={learner.exam}
                  onChange={(e) => updateScore(idx, 'exam', parseInt(e.target.value, 10) || 0, true)}
                  className="w-14 text-center font-black text-sm bg-white border border-emerald-300 rounded-lg py-1 text-slate-900 focus:outline-none"
                />
                <button
                  onClick={() => updateScore(idx, 'exam', 5)}
                  className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-bold text-xs active:scale-95 shadow-2xs"
                >
                  +5
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ADD LEARNER MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Add Learner to Marksheet</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automatically assigns next Zambian registration number for Academic Year {academicYear}.
            </p>

            <form onSubmit={handleAddLearner} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Student Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kondwani Mwila"
                  value={newLearnerName}
                  onChange={(e) => setNewLearnerName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-900 block">
                  Auto-Generated Registration ID:
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  STU-{academicYear}-{String(learners.length + 1).padStart(3, '0')}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Confirm & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
