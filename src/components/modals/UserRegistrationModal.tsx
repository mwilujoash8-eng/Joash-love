import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Shield,
  GraduationCap,
  Users,
  Building,
  CheckCircle2,
  Search,
  School as SchoolIcon,
  Link as LinkIcon
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({ isOpen, onClose }) => {
  const { schools, currentSchool, registerUser, switchUser } = useSchool();

  const [role, setRole] = useState<UserRole>('student');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(currentSchool.id);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+260 ');

  // Student specific
  const [studentGrade, setStudentGrade] = useState('9');
  const [studentClassId, setStudentClassId] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [studentGender, setStudentGender] = useState<'Male' | 'Female'>('Male');

  // Parent specific
  const [childName, setChildName] = useState('');
  const [childStudentNo, setChildStudentNo] = useState('');
  const [childGrade, setChildGrade] = useState('9');
  const [parentNrc, setParentNrc] = useState('');

  // Teacher specific
  const [teacherSubjects, setTeacherSubjects] = useState<string[]>(['sub_math']);
  const [teacherClasses, setTeacherClasses] = useState<string[]>([]);
  const [teacherQualification, setTeacherQualification] = useState('BSc. Mathematics with Education');
  const [staffPasswordInput, setStaffPasswordInput] = useState('');
  const [staffPasswordError, setStaffPasswordError] = useState<string | null>(null);

  // Board specific
  const [boardPosition, setBoardPosition] = useState('Board Member');
  const [boardCommittee, setBoardCommittee] = useState('Academic & Curriculum Committee');

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState<any>(null);

  if (!isOpen) return null;

  const targetSchool = schools.find((s) => s.id === selectedSchoolId) || currentSchool;

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(schoolSearch.toLowerCase()) ||
      s.city.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffPasswordError(null);

    // Validate staff password for teacher or deputy head
    if (role === 'teacher' || role === 'deputy_head_teacher') {
      const officialStaffPass = targetSchool.staffPassword || 'STAFF-2026';
      if (staffPasswordInput.trim().toLowerCase() !== officialStaffPass.trim().toLowerCase()) {
        setStaffPasswordError(
          `Invalid staff access code for ${targetSchool.name}. Please obtain the official staff security password from your School Head Teacher.`
        );
        return;
      }
    }

    let studentProfile;
    let parentProfile;
    let teacherProfile;
    let boardProfile;

    if (role === 'student') {
      const cls = targetSchool.classes.find((c) => c.id === studentClassId) || targetSchool.classes[0];
      const autoStudentNo = studentNumber.trim() || `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      studentProfile = {
        studentNumber: autoStudentNo,
        grade: studentGrade,
        classId: cls?.id || 'class_default',
        className: cls?.name || `Grade ${studentGrade}A`,
        gender: studentGender,
        admissionDate: '2026-01-12',
      };
    } else if (role === 'parent') {
      parentProfile = {
        connectedStudentNumbers: childStudentNo.trim() ? [childStudentNo.trim().toUpperCase()] : ['STU-2026-0012'],
        nationalId: parentNrc,
        isPtaExecutive: false,
      };
    } else if (role === 'teacher' || role === 'deputy_head_teacher') {
      teacherProfile = {
        employeeNumber: `TS-${targetSchool.code.substring(4, 7)}-${Math.floor(100 + Math.random() * 900)}`,
        assignedSubjectIds: teacherSubjects,
        assignedClassIds: teacherClasses.length > 0 ? teacherClasses : [targetSchool.classes[0]?.id || ''],
        qualification: teacherQualification,
        specialization: 'Secondary Education',
      };
    } else if (role === 'school_board') {
      boardProfile = {
        position: boardPosition,
        committee: boardCommittee,
        appointedYear: '2026',
      };
    }

    const newUser = registerUser({
      fullName,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@schoollink.edu.zm`,
      role,
      phone,
      schoolId: targetSchool.id,
      schoolName: targetSchool.name,
      studentProfile,
      parentProfile,
      teacherProfile,
      boardProfile,
    });

    setCreatedUser(newUser);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Role-Based Registration</h2>
              <p className="text-xs text-slate-300">
                Join a registered school as a Parent, Student, Teacher, or Board Member
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

        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Registration Complete</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {createdUser?.fullName} has been registered to <strong>{createdUser?.schoolName}</strong> as a{' '}
              <strong className="capitalize">{createdUser?.role?.replace('_', ' ')}</strong>.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  switchUser(createdUser.id);
                  onClose();
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
              >
                Log In & Open Dashboard
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Step 1: Select Role */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                1. Select Your Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { r: 'student' as UserRole, label: 'Student', icon: <Users className="w-4 h-4 text-sky-600" />, desc: 'Grades, tests & timetable' },
                  { r: 'parent' as UserRole, label: 'Parent / Guardian', icon: <Users className="w-4 h-4 text-amber-600" />, desc: 'Child reports, attendance & PTA' },
                  { r: 'teacher' as UserRole, label: 'Teacher', icon: <GraduationCap className="w-4 h-4 text-emerald-600" />, desc: 'Gradebooks, marks & attendance' },
                  { r: 'deputy_head_teacher' as UserRole, label: 'Deputy Head', icon: <Shield className="w-4 h-4 text-blue-600" />, desc: 'Academics & supervision' },
                  { r: 'head_teacher' as UserRole, label: 'Head Teacher', icon: <Shield className="w-4 h-4 text-indigo-600" />, desc: 'Primary administrator' },
                  { r: 'school_board' as UserRole, label: 'School Board', icon: <Building className="w-4 h-4 text-purple-600" />, desc: 'Governance oversight' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.r}
                    onClick={() => setRole(item.r)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      role === item.r
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      {item.icon}
                      {role === item.r && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.label}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Search and Select School */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                2. Search and Select School
              </label>
              <div className="relative mb-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  placeholder="Search by school name, city, or unique code (e.g. SCH-KT-1049)..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-slate-50/50">
                {filteredSchools.map((sch) => (
                  <button
                    type="button"
                    key={sch.id}
                    onClick={() => setSelectedSchoolId(sch.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition ${
                      selectedSchoolId === sch.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden text-slate-600">
                      {sch.logo ? <img src={sch.logo} alt="" className="w-full h-full object-cover" /> : <SchoolIcon className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate">{sch.name}</p>
                      <p className={`text-[10px] ${selectedSchoolId === sch.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {sch.code} &bull; {sch.city}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: User Details */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                3. Personal & Contact Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'student' ? 'e.g. Mubita Mweemba' : 'e.g. Mr. Joseph Mweemba'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Alerts) *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+260 977 123456"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Role-Specific Fields */}
            {role === 'student' && (
              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 space-y-3">
                <h4 className="text-xs font-bold text-sky-900">Student Academic Enrollment Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Grade Level</label>
                    <select
                      value={studentGrade}
                      onChange={(e) => setStudentGrade(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:ring-2 focus:ring-sky-500"
                    >
                      {targetSchool.grades.map((g) => (
                        <option key={g} value={g}>Grade {g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Class Section</label>
                    <select
                      value={studentClassId}
                      onChange={(e) => setStudentClassId(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:ring-2 focus:ring-sky-500"
                    >
                      {targetSchool.classes.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Student Number</label>
                    <input
                      type="text"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      placeholder="e.g. STU-2026-0042"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'parent' && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-bold text-amber-900">Connect to Child / Student</h4>
                </div>
                <p className="text-[11px] text-amber-800">
                  Enter your child's student number to connect and view term results, attendance, and PTA records.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Child Student Number *</label>
                    <input
                      type="text"
                      required
                      value={childStudentNo}
                      onChange={(e) => setChildStudentNo(e.target.value)}
                      placeholder="e.g. STU-2026-0012"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Parent National NRC</label>
                    <input
                      type="text"
                      value={parentNrc}
                      onChange={(e) => setParentNrc(e.target.value)}
                      placeholder="e.g. 342119/11/1"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {(role === 'teacher' || role === 'deputy_head_teacher') && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-900">Teaching Assignment & Staff Security</h4>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold border border-amber-200">
                    Staff Code Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Qualification</label>
                    <input
                      type="text"
                      value={teacherQualification}
                      onChange={(e) => setTeacherQualification(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Primary Subject</label>
                    <select
                      value={teacherSubjects[0]}
                      onChange={(e) => setTeacherSubjects([e.target.value])}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {targetSchool.subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 bg-amber-50 border border-amber-300/80 rounded-lg p-2.5 space-y-1">
                    <label className="block text-[11px] font-bold text-amber-900">
                      Official School Staff Access Code / Password *
                    </label>
                    <input
                      type="text"
                      required
                      value={staffPasswordInput}
                      onChange={(e) => setStaffPasswordInput(e.target.value)}
                      placeholder={`e.g. ${targetSchool.staffPassword || 'KABWE-STAFF-2026'}`}
                      className="w-full px-2.5 py-1.5 border border-amber-400 rounded text-xs font-mono font-bold text-amber-900 bg-white focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-[10px] text-amber-700">
                      Must match the password configured by the Head Teacher of {targetSchool.name}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {staffPasswordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
                {staffPasswordError}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Submit Registration & Request Access</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
