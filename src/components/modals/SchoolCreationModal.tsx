import React, { useState } from 'react';
import {
  X,
  Building,
  Calendar,
  Award,
  Layers,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  School as SchoolIcon,
  HelpCircle
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ECZ_GRADING_SCALE } from '../../mockData';
import { TermConfig, AssessmentWeighting, Subject, ClassRoom } from '../../types';

interface SchoolCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ZAMBIAN_PROVINCES = [
  'Central Province',
  'Copperbelt Province',
  'Eastern Province',
  'Luapula Province',
  'Lusaka Province',
  'Muchinga Province',
  'Northern Province',
  'North-Western Province',
  'Southern Province',
  'Western Province',
];

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sub_math', name: 'Mathematics', code: 'MAT-401', category: 'Core', gradesApplicable: ['8', '9', '10', '11', '12'] },
  { id: 'sub_eng', name: 'English Language', code: 'ENG-101', category: 'Core', gradesApplicable: ['8', '9', '10', '11', '12'] },
  { id: 'sub_sci', name: 'Integrated Science', code: 'SCI-201', category: 'Sciences', gradesApplicable: ['8', '9'] },
  { id: 'sub_phy', name: 'Physics (Pure)', code: 'PHY-501', category: 'Sciences', gradesApplicable: ['10', '11', '12'] },
  { id: 'sub_chem', name: 'Chemistry', code: 'CHM-502', category: 'Sciences', gradesApplicable: ['10', '11', '12'] },
  { id: 'sub_bio', name: 'Biology', code: 'BIO-503', category: 'Sciences', gradesApplicable: ['10', '11', '12'] },
  { id: 'sub_cs', name: 'Computer Studies', code: 'CMP-301', category: 'Practical', gradesApplicable: ['8', '9', '10', '11', '12'] },
  { id: 'sub_geo', name: 'Geography', code: 'GEO-202', category: 'Humanities', gradesApplicable: ['8', '9', '10', '11', '12'] },
  { id: 'sub_civ', name: 'Civic Education', code: 'CIV-203', category: 'Humanities', gradesApplicable: ['8', '9', '10', '11', '12'] },
  { id: 'sub_lang', name: 'Zambian Language (Icibemba / Cinyanja / Chitonga)', code: 'ZML-102', category: 'Languages', gradesApplicable: ['8', '9', '10', '11', '12'] },
];

export const SchoolCreationModal: React.FC<SchoolCreationModalProps> = ({ isOpen, onClose }) => {
  const { createSchool } = useSchool();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [schoolName, setSchoolName] = useState('Livingstone STEM Academy');
  const [motto, setMotto] = useState('Knowledge, Innovation & Moral Character');
  const [province, setProvince] = useState('Southern Province');
  const [city, setCity] = useState('Livingstone');
  const [address, setAddress] = useState('Plot 840 Airport Road, Livingstone');
  const [phone, setPhone] = useState('+260 213 321900');
  const [email, setEmail] = useState('admin@livingstonestem.edu.zm');
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80');
  const [regNumber, setRegNumber] = useState('MOE/SEC/SP/4019/2026');

  // Academic Calendar & Terms
  const [academicYear, setAcademicYear] = useState('2026');
  const [weeksPerTerm, setWeeksPerTerm] = useState(13);
  const [test1Week, setTest1Week] = useState(4);
  const [test2Week, setTest2Week] = useState(8);
  const [test3Week, setTest3Week] = useState(12);
  const [examWeek, setExamWeek] = useState(13);

  // Assessment Weights
  const [test1Weight, setTest1Weight] = useState(15);
  const [test2Weight, setTest2Weight] = useState(15);
  const [test3Weight, setTest3Weight] = useState(15);
  const [assignmentWeight, setAssignmentWeight] = useState(15);
  const [examWeight, setExamWeight] = useState(40);
  const [passMark, setPassMark] = useState(50);
  const [ptaDues, setPtaDues] = useState(500);

  // Head Teacher profile
  const [htName, setHtName] = useState('Prof. Emmanuel Musonda');
  const [htEmail, setHtEmail] = useState('e.musonda@livingstonestem.edu.zm');
  const [htPhone, setHtPhone] = useState('+260 977 889900');
  const [htPassword, setHtPassword] = useState('password123');
  const [staffPassword, setStaffPassword] = useState('STEM-STAFF-2026');

  const [selectedGrades, setSelectedGrades] = useState<string[]>(['8', '9', '10', '11', '12']);
  const [createdSchoolCode, setCreatedSchoolCode] = useState<string | null>(null);
  const [createdStaffPassword, setCreatedStaffPassword] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalWeight = test1Weight + test2Weight + test3Weight + assignmentWeight + examWeight;

  const handleCreate = () => {
    const terms: TermConfig[] = [
      {
        id: 'term_1',
        name: 'Term 1 (Jan - Apr)',
        startDate: '2026-01-12',
        endDate: '2026-04-10',
        weeksCount: weeksPerTerm,
        isActive: true,
        test1Week,
        test2Week,
        test3Week,
        examWeek,
        midTermWeek: 7,
      },
      {
        id: 'term_2',
        name: 'Term 2 (May - Aug)',
        startDate: '2026-05-11',
        endDate: '2026-08-07',
        weeksCount: weeksPerTerm,
        isActive: false,
        test1Week,
        test2Week,
        test3Week,
        examWeek,
        midTermWeek: 7,
      },
      {
        id: 'term_3',
        name: 'Term 3 (Sep - Dec)',
        startDate: '2026-09-07',
        endDate: '2026-12-04',
        weeksCount: weeksPerTerm,
        isActive: false,
        test1Week,
        test2Week,
        test3Week,
        examWeek,
        midTermWeek: 7,
      },
    ];

    const weighting: AssessmentWeighting = {
      test1Weight,
      test2Weight,
      test3Weight,
      assignmentWeight,
      examWeight,
    };

    const initialClasses: ClassRoom[] = selectedGrades.map((g, idx) => ({
      id: `class_${Date.now()}_g${g}`,
      name: `Grade ${g}A`,
      grade: g,
      stream: 'A',
      classTeacherId: '',
      classTeacherName: 'To be assigned',
      studentCount: 35,
      roomNumber: `Block A - Room ${idx + 1}`,
    }));

    const newSch = createSchool(
      {
        name: schoolName,
        motto,
        province,
        city,
        address,
        phone,
        email,
        logo,
        registrationNumber: regNumber,
        staffPassword: staffPassword.trim() || 'STEM-STAFF-2026',
        academicYear,
        terms,
        assessmentWeighting: weighting,
        gradingScale: ECZ_GRADING_SCALE,
        grades: selectedGrades,
        classes: initialClasses,
        subjects: DEFAULT_SUBJECTS,
        passMark,
        ptaDuesAmount: ptaDues,
      },
      {
        name: htName,
        email: htEmail,
        phone: htPhone,
        password: htPassword,
      }
    );

    setCreatedSchoolCode(newSch.code);
    setCreatedStaffPassword(newSch.staffPassword || staffPassword);
    setStep(5); // Success step
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <SchoolIcon className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">School Setup Wizard</h2>
              <p className="text-xs text-indigo-200">
                Deploy a scalable, compliant Digital School Operating System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className={step >= 1 ? 'text-indigo-600 font-bold' : ''}>1. School Profile</span>
              <span className={step >= 2 ? 'text-indigo-600 font-bold' : ''}>2. Calendar & Milestones</span>
              <span className={step >= 3 ? 'text-indigo-600 font-bold' : ''}>3. Grading & Weights</span>
              <span className={step >= 4 ? 'text-indigo-600 font-bold' : ''}>4. Head Teacher Profile</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: School Identity */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">School Identity & Accreditation</h3>
                <p className="text-xs text-slate-500">
                  Enter school details recognized by the Ministry of Education and ECZ.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official School Name *
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Lusaka National Technical High School"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">School Motto</label>
                  <input
                    type="text"
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Striving for Academic & Moral Excellence"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Province *</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    {ZAMBIAN_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City / District *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Ndola, Lusaka, Livingstone"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Plot 100 Main Road"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ministry Registration No.</label>
                  <input
                    type="text"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Term PTA Dues (ZMW)</label>
                  <input
                    type="number"
                    value={ptaDues}
                    onChange={(e) => setPtaDues(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Calendar & Milestones */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Academic Calendar & Assessment Milestones</h3>
                <p className="text-xs text-slate-500">
                  Configure school term length and custom continuous assessment week schedules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weeks Per Term (Standard: 13)</label>
                  <input
                    type="number"
                    value={weeksPerTerm}
                    onChange={(e) => setWeeksPerTerm(Number(e.target.value))}
                    min={10}
                    max={16}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-700" />
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                    Configurable Continuous Assessment Schedule (Weeks)
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-indigo-200">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Test 1 (CA-1)</label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500 font-semibold">Week</span>
                      <input
                        type="number"
                        value={test1Week}
                        onChange={(e) => setTest1Week(Number(e.target.value))}
                        min={2}
                        max={12}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-indigo-200">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Test 2 (CA-2)</label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500 font-semibold">Week</span>
                      <input
                        type="number"
                        value={test2Week}
                        onChange={(e) => setTest2Week(Number(e.target.value))}
                        min={3}
                        max={12}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-indigo-200">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Test 3 (CA-3)</label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500 font-semibold">Week</span>
                      <input
                        type="number"
                        value={test3Week}
                        onChange={(e) => setTest3Week(Number(e.target.value))}
                        min={4}
                        max={13}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-indigo-200">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Final Exams</label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500 font-semibold">Week</span>
                      <input
                        type="number"
                        value={examWeek}
                        onChange={(e) => setExamWeek(Number(e.target.value))}
                        min={5}
                        max={14}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Grades Offered at this School
                </label>
                <div className="flex flex-wrap gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((g) => {
                    const selected = selectedGrades.includes(g);
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => {
                          if (selected) {
                            setSelectedGrades(selectedGrades.filter((item) => item !== g));
                          } else {
                            setSelectedGrades([...selectedGrades, g].sort((a, b) => Number(a) - Number(b)));
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                          selected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        Grade {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Grading Scale & Continuous Assessment Weights */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Grading System & Continuous Assessment (C.A.) Weights</h3>
                <p className="text-xs text-slate-500">
                  Configure assessment weighting rules to match school academic policy.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Assessment Weighting Distribution
                  </h4>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${totalWeight === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    Total: {totalWeight}% {totalWeight === 100 ? '✓ Balanced' : '(Must equal 100%)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Test 1 Weight</label>
                    <input
                      type="number"
                      value={test1Weight}
                      onChange={(e) => setTest1Weight(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Test 2 Weight</label>
                    <input
                      type="number"
                      value={test2Weight}
                      onChange={(e) => setTest2Weight(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Test 3 Weight</label>
                    <input
                      type="number"
                      value={test3Weight}
                      onChange={(e) => setTest3Weight(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Assignments</label>
                    <input
                      type="number"
                      value={assignmentWeight}
                      onChange={(e) => setAssignmentWeight(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Final Exam</label>
                    <input
                      type="number"
                      value={examWeight}
                      onChange={(e) => setExamWeight(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* ECZ Grading Standard Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-2">
                  ECZ (Examinations Council of Zambia) 9-Point Grading Scale
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2 border rounded-lg bg-emerald-50 border-emerald-200">
                    <span className="font-bold text-emerald-900">Grade 1-2</span>
                    <p className="text-[11px] text-emerald-700">Distinction (70-100%)</p>
                  </div>
                  <div className="p-2 border rounded-lg bg-blue-50 border-blue-200">
                    <span className="font-bold text-blue-900">Grade 3-4</span>
                    <p className="text-[11px] text-blue-700">Merit (60-69%)</p>
                  </div>
                  <div className="p-2 border rounded-lg bg-amber-50 border-amber-200">
                    <span className="font-bold text-amber-900">Grade 5-6</span>
                    <p className="text-[11px] text-amber-700">Credit (50-59%)</p>
                  </div>
                  <div className="p-2 border rounded-lg bg-slate-100 border-slate-200">
                    <span className="font-bold text-slate-800">Grade 7-8</span>
                    <p className="text-[11px] text-slate-600">Satisfactory (40-49%)</p>
                  </div>
                  <div className="p-2 border rounded-lg bg-red-50 border-red-200">
                    <span className="font-bold text-red-900">Grade 9</span>
                    <p className="text-[11px] text-red-700">Unsatisfactory (&lt;40%)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Head Teacher Profile & Staff Security */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Head Teacher Account & Staff Security Access Code</h3>
                <p className="text-xs text-slate-500">
                  The Head Teacher controls school users, results publishing, permissions, and issues staff passwords.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Head Teacher Full Name & Title *
                  </label>
                  <input
                    type="text"
                    value={htName}
                    onChange={(e) => setHtName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Dr. Mwamba Banda (PhD)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    value={htEmail}
                    onChange={(e) => setHtEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (SMS/WhatsApp Alerts) *
                  </label>
                  <input
                    type="text"
                    value={htPhone}
                    onChange={(e) => setHtPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Head Teacher Account Password *
                  </label>
                  <input
                    type="password"
                    value={htPassword}
                    onChange={(e) => setHtPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center justify-between">
                    <span>School Staff Access Code *</span>
                    <span className="text-[10px] font-normal text-amber-700">For Teachers & Staff</span>
                  </label>
                  <input
                    type="text"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-amber-300 bg-amber-50/50 rounded-lg text-sm font-mono font-bold text-amber-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    placeholder="e.g. STEM-STAFF-2026"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 leading-relaxed space-y-1">
                  <p className="font-semibold">Staff Security & Verification Rule:</p>
                  <p>
                    Teachers and Deputy Heads must provide the <strong>Staff Access Code</strong> ({staffPassword || 'STEM-STAFF-2026'}) during registration to be officially recognized and recorded as school staff.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Success Screen */}
          {step === 5 && (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">School Created Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {schoolName} is now live on the SchoolLink Digital Operating System.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                    Public School Code
                  </span>
                  <div className="text-lg font-mono font-bold text-indigo-900 mt-1 select-all">
                    {createdSchoolCode}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    For students & parents to find and connect to this school.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <span className="text-[10px] text-amber-800 uppercase tracking-wider font-semibold block">
                    Staff Security Password
                  </span>
                  <div className="text-lg font-mono font-bold text-amber-900 mt-1 select-all">
                    {createdStaffPassword || staffPassword}
                  </div>
                  <p className="text-[10px] text-amber-700 mt-1">
                    Provide only to verified teachers and deputy head teachers.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Enter Head Teacher Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {step < 5 && (
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreate}
                disabled={totalWeight !== 100}
                className={`px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition ${
                  totalWeight === 100
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch School Operating System</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
