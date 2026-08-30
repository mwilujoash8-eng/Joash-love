import { CellData, SheetData } from './formulaEngine';
import { School, User } from '../../../types';

export interface ExcelTemplatePreset {
  id: string;
  name: string;
  category: 'academic' | 'finance' | 'admin' | 'analytics';
  description: string;
  generate: (school: School, currentUser: User, allUsers: User[]) => SheetData;
}

export const EXCEL_TEMPLATES: ExcelTemplatePreset[] = [
  {
    id: 'ecz_ca_marksheet',
    name: 'ECZ Continuous Assessment (CA) Marksheet',
    category: 'academic',
    description: 'Official Ministry of Education 40% CA + 60% Exam Marksheet with auto-calculated ECZ Grades and remarks.',
    generate: (school, currentUser, allUsers) => {
      const data: Record<string, CellData> = {};
      const selClass = school.classes[0] || { id: 'c1', name: 'Grade 9A', grade: '9' };
      const selSub = school.subjects[0] || { id: 's1', name: 'Mathematics' };

      // Title & School Meta
      data['A1'] = { value: `${school.name.toUpperCase()} - CONTINUOUS ASSESSMENT MARKSHEET`, bold: true, bg: '#107C41', color: '#FFFFFF', align: 'left', fontSize: 13 };
      data['A2'] = { value: `Class: ${selClass.name} | Subject: ${selSub.name} | Term: ${school.activeTerm.toUpperCase()} ${school.academicYear} | Teacher: ${currentUser.fullName}`, bold: true, bg: '#E8F5E9', color: '#1B5E20' };

      // Headers
      const headers = [
        { col: 'A', title: 'STUDENT NO.' },
        { col: 'B', title: 'LEARNER FULL NAME' },
        { col: 'C', title: 'CA TEST 1 (20)' },
        { col: 'D', title: 'CA TEST 2 (20)' },
        { col: 'E', title: 'CA TEST 3 (20)' },
        { col: 'F', title: 'EXAM (100)' },
        { col: 'G', title: 'WEIGHTED %' },
        { col: 'H', title: 'ECZ GRADE' },
        { col: 'I', title: 'TEACHER REMARK' },
      ];

      headers.forEach((h) => {
        data[`${h.col}4`] = { value: h.title, bold: true, bg: '#2E7D32', color: '#FFFFFF', align: 'center', border: 'all' };
      });

      const students = allUsers.filter((u) => u.schoolId === school.id && u.role === 'student');
      const year = school.academicYear || String(new Date().getFullYear());
      const studentList = students.length > 0 ? students : [
        { id: '1', fullName: 'Mubita Mweemba', studentProfile: { studentNumber: `STU-${year}-001` } },
        { id: '2', fullName: 'Chileshe Mwansa', studentProfile: { studentNumber: `STU-${year}-002` } },
        { id: '3', fullName: 'Kondwani Banda', studentProfile: { studentNumber: `STU-${year}-003` } },
        { id: '4', fullName: 'Natasha Phiri', studentProfile: { studentNumber: `STU-${year}-004` } },
        { id: '5', fullName: 'Thandiwe Zulu', studentProfile: { studentNumber: `STU-${year}-005` } },
        { id: '6', fullName: 'Bwalya Tembo', studentProfile: { studentNumber: `STU-${year}-006` } },
        { id: '7', fullName: 'Luyando Moonga', studentProfile: { studentNumber: `STU-${year}-007` } },
        { id: '8', fullName: 'Kabwe Chilufya', studentProfile: { studentNumber: `STU-${year}-008` } },
      ];

      const sampleScores = [
        { t1: 18, t2: 19, t3: 17, exam: 88, remark: 'Outstanding analytical skills and mastery' },
        { t1: 16, t2: 15, t3: 14, exam: 74, remark: 'Commendable effort; very good grasp' },
        { t1: 13, t2: 14, t3: 12, exam: 62, remark: 'Good progress; improve problem solving' },
        { t1: 19, t2: 18, t3: 20, exam: 94, remark: 'Exceptional distinction-level achievement' },
        { t1: 11, t2: 12, t3: 10, exam: 52, remark: 'Satisfactory; extra remedial practice needed' },
        { t1: 15, t2: 17, t3: 16, exam: 79, remark: 'Very solid grasp of syllabus topics' },
        { t1: 14, t2: 13, t3: 15, exam: 68, remark: 'Consistent participation and diligence' },
        { t1: 9,  t2: 11, t3: 10, exam: 45, remark: 'Needs focused support on core principles' },
      ];

      studentList.forEach((st, idx) => {
        const row = 5 + idx;
        const scores = sampleScores[idx % sampleScores.length];
        const caTotal = scores.t1 + scores.t2 + scores.t3;
        const weightedPct = Math.round(((caTotal / 60) * 0.4 + (scores.exam / 100) * 0.6) * 100);
        const stuNum = (st as any).studentProfile?.studentNumber || `STU-${year}-${String(idx + 1).padStart(3, '0')}`;

        data[`A${row}`] = { value: stuNum, align: 'center', bold: true, color: '#1B5E20', border: 'all' };
        data[`B${row}`] = { value: st.fullName, align: 'left', bold: true, border: 'all' };
        data[`C${row}`] = { value: String(scores.t1), align: 'center', format: 'number', decimals: 0, border: 'all' };
        data[`D${row}`] = { value: String(scores.t2), align: 'center', format: 'number', decimals: 0, border: 'all' };
        data[`E${row}`] = { value: String(scores.t3), align: 'center', format: 'number', decimals: 0, border: 'all' };
        data[`F${row}`] = { value: String(scores.exam), align: 'center', format: 'number', decimals: 0, border: 'all' };
        data[`G${row}`] = {
          value: `${weightedPct}%`,
          formula: `=ROUND(((C${row}+D${row}+E${row})/60)*40+(F${row}*0.6), 0)`,
          align: 'center',
          bold: true,
          bg: '#E8F5E9',
          border: 'all',
        };
        data[`H${row}`] = {
          value: `=ECZ_GRADE(G${row})`,
          formula: `=ECZ_GRADE(G${row})`,
          align: 'center',
          bold: true,
          color: '#1B5E20',
          bg: '#C8E6C9',
          border: 'all',
        };
        data[`I${row}`] = { value: scores.remark, align: 'left', border: 'all' };
      });

      const summaryRow = 5 + studentList.length + 1;
      data[`B${summaryRow}`] = { value: 'CLASS AVERAGE', bold: true, align: 'right', bg: '#F1F5F9', border: 'thick' };
      data[`C${summaryRow}`] = { value: '', formula: `=AVERAGE(C5:C${summaryRow - 2})`, bold: true, align: 'center', bg: '#F1F5F9', border: 'thick' };
      data[`D${summaryRow}`] = { value: '', formula: `=AVERAGE(D5:D${summaryRow - 2})`, bold: true, align: 'center', bg: '#F1F5F9', border: 'thick' };
      data[`E${summaryRow}`] = { value: '', formula: `=AVERAGE(E5:E${summaryRow - 2})`, bold: true, align: 'center', bg: '#F1F5F9', border: 'thick' };
      data[`F${summaryRow}`] = { value: '', formula: `=AVERAGE(F5:F${summaryRow - 2})`, bold: true, align: 'center', bg: '#F1F5F9', border: 'thick' };
      data[`G${summaryRow}`] = { value: '', formula: `=AVERAGE(G5:G${summaryRow - 2})`, bold: true, align: 'center', bg: '#C8E6C9', color: '#1B5E20', border: 'thick' };

      return {
        id: 'sheet_ecz_ca',
        name: 'ECZ CA Marksheet',
        data,
        rowCount: Math.max(30, summaryRow + 5),
        colCount: 12,
        tabColor: '#107C41',
      };
    },
  },
  {
    id: 'class_attendance_register',
    name: 'Weekly Class Attendance Register',
    category: 'academic',
    description: 'Weekly student attendance roll sheet with daily tally, total present, and calculated percentage rate.',
    generate: (school, currentUser, allUsers) => {
      const data: Record<string, CellData> = {};
      const selClass = school.classes[0] || { id: 'c1', name: 'Grade 9A' };

      data['A1'] = { value: `${school.name.toUpperCase()} - CLASS ATTENDANCE REGISTER`, bold: true, bg: '#0D6EFD', color: '#FFFFFF', align: 'left', fontSize: 13 };
      data['A2'] = { value: `Class: ${selClass.name} | Term: ${school.activeTerm.toUpperCase()} | Week 4 | Class Teacher: ${currentUser.fullName}`, bold: true, bg: '#E7F1FF', color: '#0A58CA' };

      const headers = [
        { col: 'A', title: 'STUDENT NO.' },
        { col: 'B', title: 'STUDENT NAME' },
        { col: 'C', title: 'MON' },
        { col: 'D', title: 'TUE' },
        { col: 'E', title: 'WED' },
        { col: 'F', title: 'THU' },
        { col: 'G', title: 'FRI' },
        { col: 'H', title: 'TOTAL PRESENT' },
        { col: 'I', title: 'ATTENDANCE %' },
      ];

      headers.forEach((h) => {
        data[`${h.col}4`] = { value: h.title, bold: true, bg: '#0D6EFD', color: '#FFFFFF', align: 'center', border: 'all' };
      });

      const students = allUsers.filter((u) => u.schoolId === school.id && u.role === 'student');
      const year = school.academicYear || String(new Date().getFullYear());
      const studentList = students.length > 0 ? students : [
        { id: '1', fullName: 'Mubita Mweemba', studentProfile: { studentNumber: `STU-${year}-001` } },
        { id: '2', fullName: 'Chileshe Mwansa', studentProfile: { studentNumber: `STU-${year}-002` } },
        { id: '3', fullName: 'Kondwani Banda', studentProfile: { studentNumber: `STU-${year}-003` } },
        { id: '4', fullName: 'Natasha Phiri', studentProfile: { studentNumber: `STU-${year}-004` } },
        { id: '5', fullName: 'Thandiwe Zulu', studentProfile: { studentNumber: `STU-${year}-005` } },
      ];

      studentList.forEach((st, idx) => {
        const row = 5 + idx;
        const stuNum = (st as any).studentProfile?.studentNumber || `STU-${year}-${String(idx + 1).padStart(3, '0')}`;
        data[`A${row}`] = { value: stuNum, align: 'center', bold: true, border: 'all' };
        data[`B${row}`] = { value: st.fullName, align: 'left', bold: true, border: 'all' };
        data[`C${row}`] = { value: 'P', align: 'center', bg: '#D1E7DD', color: '#0F5132', border: 'all' };
        data[`D${row}`] = { value: 'P', align: 'center', bg: '#D1E7DD', color: '#0F5132', border: 'all' };
        data[`E${row}`] = { value: idx === 2 ? 'A' : 'P', align: 'center', bg: idx === 2 ? '#F8D7DA' : '#D1E7DD', color: idx === 2 ? '#842029' : '#0F5132', border: 'all' };
        data[`F${row}`] = { value: 'P', align: 'center', bg: '#D1E7DD', color: '#0F5132', border: 'all' };
        data[`G${row}`] = { value: 'P', align: 'center', bg: '#D1E7DD', color: '#0F5132', border: 'all' };
        data[`H${row}`] = { value: idx === 2 ? '4' : '5', formula: `=COUNTIF(C${row}:G${row}, "P")`, align: 'center', bold: true, border: 'all' };
        data[`I${row}`] = { value: idx === 2 ? '80%' : '100%', formula: `=ROUND((H${row}/5)*100, 0)&"%"`, align: 'center', bold: true, bg: '#E7F1FF', border: 'all' };
      });

      return {
        id: 'sheet_attendance',
        name: 'Attendance Register',
        data,
        rowCount: Math.max(30, studentList.length + 10),
        colCount: 12,
        tabColor: '#0D6EFD',
      };
    },
  },
  {
    id: 'school_fees_ledger',
    name: 'PTA & School Fees Collection Ledger',
    category: 'finance',
    description: 'School accounts and bursar fee tracking sheet with student invoices, amount paid, and outstanding balances.',
    generate: (school, currentUser, allUsers) => {
      const data: Record<string, CellData> = {};
      const year = school.academicYear || String(new Date().getFullYear());

      data['A1'] = { value: `${school.name.toUpperCase()} - TERM ${school.activeTerm.toUpperCase()} FEES COLLECTION LEDGER`, bold: true, bg: '#D97706', color: '#FFFFFF', align: 'left', fontSize: 13 };
      data['A2'] = { value: `Academic Year: ${school.academicYear} | Currency: Zambian Kwacha (ZMW) | Bursar Office`, bold: true, bg: '#FEF3C7', color: '#92400E' };

      const headers = [
        { col: 'A', title: 'STUDENT NO.' },
        { col: 'B', title: 'STUDENT NAME' },
        { col: 'C', title: 'CLASS' },
        { col: 'D', title: 'TOTAL INVOICED (ZMW)' },
        { col: 'E', title: 'AMOUNT PAID (ZMW)' },
        { col: 'F', title: 'BALANCE OUTSTANDING (ZMW)' },
        { col: 'G', title: 'RECEIPT NO.' },
        { col: 'H', title: 'PAYMENT STATUS' },
      ];

      headers.forEach((h) => {
        data[`${h.col}4`] = { value: h.title, bold: true, bg: '#B45309', color: '#FFFFFF', align: 'center', border: 'all' };
      });

      const sampleRecords = [
        { no: `STU-${year}-001`, name: 'Mubita Mweemba', class: 'Grade 9A', inv: 1500, paid: 1500, rNo: `REC-${year}-881`, status: 'CLEARED' },
        { no: `STU-${year}-002`, name: 'Chileshe Mwansa', class: 'Grade 9A', inv: 1500, paid: 1000, rNo: `REC-${year}-882`, status: 'PARTIAL' },
        { no: `STU-${year}-003`, name: 'Kondwani Banda', class: 'Grade 9A', inv: 1500, paid: 1500, rNo: `REC-${year}-883`, status: 'CLEARED' },
        { no: `STU-${year}-004`, name: 'Natasha Phiri', class: 'Grade 9A', inv: 1500, paid: 750,  rNo: `REC-${year}-884`, status: 'PARTIAL' },
        { no: `STU-${year}-005`, name: 'Thandiwe Zulu', class: 'Grade 9A', inv: 1500, paid: 1500, rNo: `REC-${year}-885`, status: 'CLEARED' },
        { no: `STU-${year}-006`, name: 'Bwalya Tembo', class: 'Grade 9A', inv: 1500, paid: 0,    rNo: 'N/A',            status: 'UNPAID' },
      ];

      sampleRecords.forEach((rec, idx) => {
        const row = 5 + idx;
        const balance = rec.inv - rec.paid;

        data[`A${row}`] = { value: rec.no, align: 'center', bold: true, border: 'all' };
        data[`B${row}`] = { value: rec.name, align: 'left', bold: true, border: 'all' };
        data[`C${row}`] = { value: rec.class, align: 'center', border: 'all' };
        data[`D${row}`] = { value: String(rec.inv), align: 'right', format: 'currency', decimals: 2, border: 'all' };
        data[`E${row}`] = { value: String(rec.paid), align: 'right', format: 'currency', decimals: 2, border: 'all' };
        data[`F${row}`] = { value: String(balance), formula: `=D${row}-E${row}`, align: 'right', bold: true, format: 'currency', decimals: 2, color: balance > 0 ? '#B91C1C' : '#15803D', border: 'all' };
        data[`G${row}`] = { value: rec.rNo, align: 'center', border: 'all' };
        data[`H${row}`] = {
          value: rec.status,
          align: 'center',
          bold: true,
          bg: rec.status === 'CLEARED' ? '#DCFCE7' : rec.status === 'PARTIAL' ? '#FEF08A' : '#FEE2E2',
          color: rec.status === 'CLEARED' ? '#166534' : rec.status === 'PARTIAL' ? '#854D0E' : '#991B1B',
          border: 'all',
        };
      });

      const sumRow = 5 + sampleRecords.length + 1;
      data[`C${sumRow}`] = { value: 'TOTALS', bold: true, align: 'right', bg: '#FEF3C7', border: 'thick' };
      data[`D${sumRow}`] = { value: '', formula: `=SUM(D5:D${sumRow - 2})`, bold: true, align: 'right', format: 'currency', decimals: 2, bg: '#FEF3C7', border: 'thick' };
      data[`E${sumRow}`] = { value: '', formula: `=SUM(E5:E${sumRow - 2})`, bold: true, align: 'right', format: 'currency', decimals: 2, bg: '#FEF3C7', color: '#15803D', border: 'thick' };
      data[`F${sumRow}`] = { value: '', formula: `=SUM(F5:F${sumRow - 2})`, bold: true, align: 'right', format: 'currency', decimals: 2, bg: '#FEF3C7', color: '#B91C1C', border: 'thick' };

      return {
        id: 'sheet_fees',
        name: 'School Fees Ledger',
        data,
        rowCount: 35,
        colCount: 12,
        tabColor: '#D97706',
      };
    },
  },
  {
    id: 'exam_analytics_breakdown',
    name: 'ECZ National Exam Performance & Grade Distribution',
    category: 'analytics',
    description: 'Statistical distribution breakdown with Distinction, Merit, Credit, Pass bands and chart visualization.',
    generate: (school) => {
      const data: Record<string, CellData> = {};

      data['A1'] = { value: 'EXAM PERFORMANCE & GRADE DISTRIBUTION ANALYSIS', bold: true, bg: '#7C3AED', color: '#FFFFFF', fontSize: 13 };
      data['A2'] = { value: `School: ${school.name} | Examination Council of Zambia Standard Metrics`, bold: true, bg: '#F3E8FF', color: '#6B21A8' };

      data['A4'] = { value: 'GRADE BAND', bold: true, bg: '#6D28D9', color: '#FFF', align: 'center', border: 'all' };
      data['B4'] = { value: 'MARK RANGE', bold: true, bg: '#6D28D9', color: '#FFF', align: 'center', border: 'all' };
      data['C4'] = { value: 'STUDENT COUNT', bold: true, bg: '#6D28D9', color: '#FFF', align: 'center', border: 'all' };
      data['D4'] = { value: 'PERCENTAGE (%)', bold: true, bg: '#6D28D9', color: '#FFF', align: 'center', border: 'all' };
      data['E4'] = { value: 'ECZ STANDING', bold: true, bg: '#6D28D9', color: '#FFF', align: 'center', border: 'all' };

      const bands = [
        { band: 'Distinction 1', range: '75% - 100%', count: 18, standing: 'Distinction' },
        { band: 'Distinction 2', range: '70% - 74%',  count: 14, standing: 'Distinction' },
        { band: 'Merit 3-4',     range: '60% - 69%',  count: 22, standing: 'Merit' },
        { band: 'Credit 5-6',    range: '50% - 59%',  count: 12, standing: 'Credit' },
        { band: 'Pass 7-8',      range: '40% - 49%',  count: 4,  standing: 'Pass' },
        { band: 'Unsatisfactory 9', range: '0% - 39%', count: 0, standing: 'Unsatisfactory' },
      ];

      bands.forEach((b, idx) => {
        const row = 5 + idx;
        data[`A${row}`] = { value: b.band, bold: true, border: 'all' };
        data[`B${row}`] = { value: b.range, align: 'center', border: 'all' };
        data[`C${row}`] = { value: String(b.count), align: 'center', bold: true, format: 'number', decimals: 0, border: 'all' };
        data[`D${row}`] = { value: '', formula: `=ROUND((C${row}/C11)*100, 1)&"%"`, align: 'center', bold: true, bg: '#F3E8FF', border: 'all' };
        data[`E${row}`] = { value: b.standing, align: 'center', bold: true, color: b.standing === 'Distinction' ? '#15803D' : b.standing === 'Merit' ? '#0369A1' : '#6B21A8', border: 'all' };
      });

      data['A11'] = { value: 'TOTAL CANDIDATES', bold: true, bg: '#EDE9FE', border: 'thick' };
      data['C11'] = { value: '70', formula: `=SUM(C5:C10)`, bold: true, align: 'center', bg: '#EDE9FE', border: 'thick' };
      data['D11'] = { value: '100%', bold: true, align: 'center', bg: '#EDE9FE', border: 'thick' };

      return {
        id: 'sheet_exam_analysis',
        name: 'Exam Grade Analytics',
        data,
        rowCount: 30,
        colCount: 12,
        tabColor: '#7C3AED',
      };
    },
  },
  {
    id: 'department_budget_planner',
    name: 'Department Budget & Expenditure Planner',
    category: 'finance',
    description: 'Operational expenditure ledger with budget allocations, expense tracking, and remaining variances.',
    generate: (school) => {
      const data: Record<string, CellData> = {};

      data['A1'] = { value: `${school.name.toUpperCase()} - SCIENCE & STEM DEPARTMENT BUDGET`, bold: true, bg: '#047857', color: '#FFFFFF', fontSize: 13 };
      data['A2'] = { value: `Academic Year: ${school.academicYear} | Head of Department: Academic Office`, bold: true, bg: '#D1FAE5', color: '#065F46' };

      const headers = [
        { col: 'A', title: 'ITEM CODE' },
        { col: 'B', title: 'EXPENSE DESCRIPTION' },
        { col: 'C', title: 'CATEGORY' },
        { col: 'D', title: 'BUDGET ALLOCATED (ZMW)' },
        { col: 'E', title: 'ACTUAL EXPENDITURE (ZMW)' },
        { col: 'F', title: 'VARIANCE REMAINING (ZMW)' },
        { col: 'G', title: 'UTILIZATION %' },
      ];

      headers.forEach((h) => {
        data[`${h.col}4`] = { value: h.title, bold: true, bg: '#065F46', color: '#FFFFFF', align: 'center', border: 'all' };
      });

      const items = [
        { code: 'SCI-01', desc: 'Science Laboratory Reagents & Chemicals', cat: 'Lab Consumables', budget: 12000, actual: 8500 },
        { code: 'SCI-02', desc: 'Physics Apparatus & Measuring Instruments', cat: 'Equipment', budget: 18000, actual: 16200 },
        { code: 'SCI-03', desc: 'Biology Specimen Jars & Dissection Kits', cat: 'Lab Consumables', budget: 7500,  actual: 5400 },
        { code: 'SCI-04', desc: 'ECZ Mock Examination Stationery & Print Paper', cat: 'Stationery', budget: 9000, actual: 9000 },
        { code: 'SCI-05', desc: 'Junior Engineers Technicians (JETS) Fair Sponsorship', cat: 'Activities', budget: 6000, actual: 4200 },
      ];

      items.forEach((it, idx) => {
        const row = 5 + idx;
        data[`A${row}`] = { value: it.code, align: 'center', bold: true, border: 'all' };
        data[`B${row}`] = { value: it.desc, align: 'left', bold: true, border: 'all' };
        data[`C${row}`] = { value: it.cat, align: 'center', border: 'all' };
        data[`D${row}`] = { value: String(it.budget), align: 'right', format: 'currency', decimals: 2, border: 'all' };
        data[`E${row}`] = { value: String(it.actual), align: 'right', format: 'currency', decimals: 2, border: 'all' };
        data[`F${row}`] = { value: '', formula: `=D${row}-E${row}`, align: 'right', bold: true, format: 'currency', decimals: 2, border: 'all' };
        data[`G${row}`] = { value: '', formula: `=ROUND((E${row}/D${row})*100, 1)&"%"`, align: 'center', bold: true, bg: '#ECFDF5', border: 'all' };
      });

      const sumRow = 5 + items.length + 1;
      data[`C${sumRow}`] = { value: 'TOTAL DEPARTMENT EXPENDITURE', bold: true, align: 'right', bg: '#D1FAE5', border: 'thick' };
      data[`D${sumRow}`] = { value: '', formula: `=SUM(D5:D${sumRow - 2})`, bold: true, align: 'right', format: 'currency', decimals: 2, bg: '#D1FAE5', border: 'thick' };
      data[`E${sumRow}`] = { value: '', formula: `=SUM(E5:E${sumRow - 2})`, bold: true, align: 'right', format: 'currency', decimals: 2, bg: '#D1FAE5', border: 'thick' };
      data[`F${sumRow}`] = { value: '', formula: `=SUM(F5:F${sumRow - 2})`, bold: true, align: 'right', format: 'currency', decimals: 2, bg: '#D1FAE5', color: '#047857', border: 'thick' };

      return {
        id: 'sheet_budget',
        name: 'Department Budget',
        data,
        rowCount: 30,
        colCount: 12,
        tabColor: '#047857',
      };
    },
  },
  {
    id: 'teacher_weekly_timetable',
    name: 'Teacher Weekly Timetable & Room Matrix',
    category: 'admin',
    description: 'Weekly teaching schedule with period breakdowns, assigned grades, room numbers, and free study blocks.',
    generate: (school, currentUser) => {
      const data: Record<string, CellData> = {};

      data['A1'] = { value: `${school.name.toUpperCase()} - TEACHER MASTER TIMETABLE`, bold: true, bg: '#0284C7', color: '#FFFFFF', fontSize: 13 };
      data['A2'] = { value: `Teacher: ${currentUser.fullName} | Role: ${currentUser.role.toUpperCase()} | Term 1 Master Schedule`, bold: true, bg: '#E0F2FE', color: '#0369A1' };

      const days = ['TIME / PERIOD', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
      days.forEach((day, idx) => {
        const col = ['A', 'B', 'C', 'D', 'E', 'F'][idx];
        data[`${col}4`] = { value: day, bold: true, bg: '#0369A1', color: '#FFFFFF', align: 'center', border: 'all' };
      });

      const periods = [
        { time: '07:30 - 08:10 (P1)', mon: 'Grade 9A Maths (Rm 4)', tue: 'Grade 10B Maths (Rm 7)', wed: 'Grade 9A Maths (Rm 4)', thu: 'Grade 10B Maths (Rm 7)', fri: 'Grade 11 Science (Lab 1)' },
        { time: '08:10 - 08:50 (P2)', mon: 'Grade 9A Maths (Rm 4)', tue: 'Grade 10B Maths (Rm 7)', wed: 'Grade 9A Maths (Rm 4)', thu: 'Grade 10B Maths (Rm 7)', fri: 'Grade 11 Science (Lab 1)' },
        { time: '08:50 - 09:30 (P3)', mon: 'Free / Prep Block',     tue: 'Grade 8A Maths (Rm 2)', wed: 'Grade 8A Maths (Rm 2)',  thu: 'Free / Prep Block',     fri: 'Grade 9A Remedial' },
        { time: '09:30 - 10:00 (TEA)', mon: '--- MORNING TEA BREAK ---', tue: '--- MORNING TEA BREAK ---', wed: '--- MORNING TEA BREAK ---', thu: '--- MORNING TEA BREAK ---', fri: '--- MORNING TEA BREAK ---' },
        { time: '10:00 - 10:40 (P4)', mon: 'Grade 12 Add Maths',   tue: 'Grade 11 Science (Lab)', wed: 'Grade 12 Add Maths',   thu: 'Grade 11 Science (Lab)', fri: 'Grade 8A Maths (Rm 2)' },
        { time: '10:40 - 11:20 (P5)', mon: 'Grade 12 Add Maths',   tue: 'Grade 11 Science (Lab)', wed: 'Grade 12 Add Maths',   thu: 'Grade 11 Science (Lab)', fri: 'Grade 8A Maths (Rm 2)' },
        { time: '11:20 - 12:00 (P6)', mon: 'Department Meeting',    tue: 'Free / Lesson Planning', wed: 'JETS Club Mentorship', thu: 'Staff Professional Dev', fri: 'Assembly & Dismissal' },
      ];

      periods.forEach((p, idx) => {
        const row = 5 + idx;
        const isBreak = idx === 3;
        data[`A${row}`] = { value: p.time, bold: true, align: 'center', bg: isBreak ? '#FEF08A' : '#F8FAFC', border: 'all' };
        data[`B${row}`] = { value: p.mon, align: 'center', bg: isBreak ? '#FEF08A' : p.mon.includes('Free') ? '#F1F5F9' : '#E0F2FE', border: 'all' };
        data[`C${row}`] = { value: p.tue, align: 'center', bg: isBreak ? '#FEF08A' : p.tue.includes('Free') ? '#F1F5F9' : '#E0F2FE', border: 'all' };
        data[`D${row}`] = { value: p.wed, align: 'center', bg: isBreak ? '#FEF08A' : p.wed.includes('Free') ? '#F1F5F9' : '#E0F2FE', border: 'all' };
        data[`E${row}`] = { value: p.thu, align: 'center', bg: isBreak ? '#FEF08A' : p.thu.includes('Free') ? '#F1F5F9' : '#E0F2FE', border: 'all' };
        data[`F${row}`] = { value: p.fri, align: 'center', bg: isBreak ? '#FEF08A' : p.fri.includes('Free') ? '#F1F5F9' : '#E0F2FE', border: 'all' };
      });

      return {
        id: 'sheet_timetable',
        name: 'Teacher Timetable',
        data,
        rowCount: 25,
        colCount: 10,
        tabColor: '#0284C7',
      };
    },
  },
  {
    id: 'learner_enrollment_registry',
    name: 'Learner Enrollment & Admission Registry',
    category: 'admin',
    description: 'Official Ministry of Education learner admission register with auto-incremented student numbers, bio-data, NRC, parent contacts, and status.',
    generate: (school, currentUser, allUsers) => {
      const data: Record<string, CellData> = {};
      const selClass = school.classes[0] || { id: 'c1', name: 'Grade 9A', grade: '9' };
      const year = school.academicYear || String(new Date().getFullYear());

      // Title & School Meta
      data['A1'] = { value: `${school.name.toUpperCase()} - OFFICIAL LEARNER ADMISSION & ENROLLMENT REGISTRY`, bold: true, bg: '#0F766E', color: '#FFFFFF', align: 'left', fontSize: 13 };
      data['A2'] = { value: `Class: ${selClass.name} | Academic Year: ${year} | Registry Officer: ${currentUser.fullName} | Status: Active Roll`, bold: true, bg: '#CCFBF1', color: '#115E59' };

      // Headers
      const headers = [
        { col: 'A', title: 'STUDENT NUMBER' },
        { col: 'B', title: 'FULL NAME (SURNAME FIRST)' },
        { col: 'C', title: 'GENDER' },
        { col: 'D', title: 'DATE OF BIRTH' },
        { col: 'E', title: 'GRADE & STREAM' },
        { col: 'F', title: 'ECZ EXAM NO. / NRC' },
        { col: 'G', title: 'PRIMARY GUARDIAN NAME' },
        { col: 'H', title: 'EMERGENCY CONTACT' },
        { col: 'I', title: 'RESIDENTIAL ADDRESS' },
        { col: 'J', title: 'ADMISSION DATE' },
        { col: 'K', title: 'ENROLLMENT STATUS' },
        { col: 'L', title: 'SPECIAL NEEDS / ALERTS' },
      ];

      headers.forEach((h) => {
        data[`${h.col}4`] = { value: h.title, bold: true, bg: '#0D9488', color: '#FFFFFF', align: 'center', border: 'all' };
      });

      const students = allUsers.filter((u) => u.schoolId === school.id && u.role === 'student');
      const studentList = students.length > 0 ? students : [
        { id: '1', fullName: 'Mweemba, Mubita', studentProfile: { studentNumber: `STU-${year}-001`, gender: 'Male', dob: '2011-04-12', parentName: 'Mr. & Mrs. Mweemba', phone: '+260 97 7123456', address: 'Plot 45, Bwacha Township, Kabwe' } },
        { id: '2', fullName: 'Mulenga, Natasha', studentProfile: { studentNumber: `STU-${year}-002`, gender: 'Female', dob: '2011-08-25', parentName: 'Dr. Joseph Mulenga', phone: '+260 96 6234567', address: '12 Kasama Road, Highridge, Kabwe' } },
        { id: '3', fullName: 'Mwansa, Chileshe', studentProfile: { studentNumber: `STU-${year}-003`, gender: 'Female', dob: '2011-02-18', parentName: 'Mrs. Mary Mwansa', phone: '+260 95 5345678', address: '8 Luangwa Street, Mine Area, Kabwe' } },
        { id: '4', fullName: 'Banda, Kondwani', studentProfile: { studentNumber: `STU-${year}-004`, gender: 'Male', dob: '2010-11-30', parentName: 'Mr. Peter Banda', phone: '+260 97 8456789', address: '24 Lukanga Road, Ngungu, Kabwe' } },
        { id: '5', fullName: 'Phiri, Natasha', studentProfile: { studentNumber: `STU-${year}-005`, gender: 'Female', dob: '2011-06-14', parentName: 'Mr. & Mrs. Phiri', phone: '+260 96 9567890', address: '15 Chimanimani, Kabwe' } },
        { id: '6', fullName: 'Zulu, Thandiwe', studentProfile: { studentNumber: `STU-${year}-006`, gender: 'Female', dob: '2011-09-03', parentName: 'Mrs. Grace Zulu', phone: '+260 97 1678901', address: '7 Makululu Section 2, Kabwe' } },
        { id: '7', fullName: 'Tembo, Bwalya', studentProfile: { studentNumber: `STU-${year}-007`, gender: 'Male', dob: '2010-12-19', parentName: 'Mr. Isaac Tembo', phone: '+260 95 2789012', address: '31 Railway Compound, Kabwe' } },
        { id: '8', fullName: 'Moonga, Luyando', studentProfile: { studentNumber: `STU-${year}-008`, gender: 'Female', dob: '2011-03-22', parentName: 'Mr. Clement Moonga', phone: '+260 96 3890123', address: '19 Chowa Township, Kabwe' } },
      ];

      studentList.forEach((st, idx) => {
        const row = 5 + idx;
        const prof = (st as any).studentProfile || {};
        const stuNum = prof.studentNumber || `STU-${year}-${String(idx + 1).padStart(3, '0')}`;
        const gender = prof.gender || (idx % 2 === 0 ? 'Male' : 'Female');
        const dob = prof.dob || `2011-0${(idx % 9) + 1}-15`;
        const eczNo = `2026/09/${String(100 + idx + 1)}`;
        const parentName = prof.parentName || `Guardian of ${st.fullName.split(' ')[0]}`;
        const phone = prof.phone || `+260 97 ${Math.floor(1000000 + Math.random() * 9000000)}`;
        const address = prof.address || `${10 + idx * 3} Great North Road, Kabwe`;
        const admDate = `${year}-01-12`;
        const status = 'ACTIVE';
        const special = idx === 1 ? 'Asthma inhaler required' : 'None';

        data[`A${row}`] = { value: stuNum, align: 'center', bold: true, color: '#0F766E', border: 'all' };
        data[`B${row}`] = { value: st.fullName, align: 'left', bold: true, border: 'all' };
        data[`C${row}`] = { value: gender, align: 'center', border: 'all' };
        data[`D${row}`] = { value: dob, align: 'center', border: 'all' };
        data[`E${row}`] = { value: selClass.name, align: 'center', border: 'all' };
        data[`F${row}`] = { value: eczNo, align: 'center', border: 'all' };
        data[`G${row}`] = { value: parentName, align: 'left', border: 'all' };
        data[`H${row}`] = { value: phone, align: 'center', border: 'all' };
        data[`I${row}`] = { value: address, align: 'left', border: 'all' };
        data[`J${row}`] = { value: admDate, align: 'center', border: 'all' };
        data[`K${row}`] = { value: status, align: 'center', bold: true, bg: '#DCFCE7', color: '#166534', border: 'all' };
        data[`L${row}`] = { value: special, align: 'left', color: idx === 1 ? '#B45309' : '#64748B', border: 'all' };
      });

      // Extra empty rows ready for adding more learners
      for (let emptyIdx = 0; emptyIdx < 8; emptyIdx++) {
        const row = 5 + studentList.length + emptyIdx;
        const autoNo = `STU-${year}-${String(studentList.length + emptyIdx + 1).padStart(3, '0')}`;
        data[`A${row}`] = { value: autoNo, align: 'center', bold: true, color: '#0F766E', border: 'all' };
        data[`B${row}`] = { value: '', align: 'left', border: 'all' };
        data[`C${row}`] = { value: '', align: 'center', border: 'all' };
        data[`D${row}`] = { value: '', align: 'center', border: 'all' };
        data[`E${row}`] = { value: selClass.name, align: 'center', border: 'all' };
        data[`F${row}`] = { value: '', align: 'center', border: 'all' };
        data[`G${row}`] = { value: '', align: 'left', border: 'all' };
        data[`H${row}`] = { value: '', align: 'center', border: 'all' };
        data[`I${row}`] = { value: '', align: 'left', border: 'all' };
        data[`J${row}`] = { value: `${year}-01-12`, align: 'center', border: 'all' };
        data[`K${row}`] = { value: 'ACTIVE', align: 'center', bold: true, bg: '#DCFCE7', color: '#166534', border: 'all' };
        data[`L${row}`] = { value: 'None', align: 'left', color: '#64748B', border: 'all' };
      }

      const totalRow = 5 + studentList.length + 9;
      data[`A${totalRow}`] = { value: 'TOTAL ENROLLED LEARNERS', bold: true, bg: '#CCFBF1', color: '#115E59', align: 'left', border: 'thick' };
      data[`B${totalRow}`] = { value: String(studentList.length), formula: `=COUNTA(B5:B${totalRow - 2})`, bold: true, align: 'center', bg: '#CCFBF1', color: '#0F766E', border: 'thick' };

      return {
        id: 'sheet_learner_enrollment',
        name: 'Learner Enrollment',
        data,
        rowCount: Math.max(35, totalRow + 5),
        colCount: 12,
        tabColor: '#0F766E',
      };
    },
  },
];
