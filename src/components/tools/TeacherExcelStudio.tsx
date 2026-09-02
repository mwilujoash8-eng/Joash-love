import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  RotateCw,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Calculator,
  Percent,
  DollarSign,
  Printer,
  Sparkles,
  CheckCircle2,
  Table,
  Layers,
  Search,
  Filter,
  ArrowUpDown,
  FileDown,
  FileUp,
  RefreshCw,
  Copy,
  Scissors,
  Clipboard,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  HelpCircle,
  FolderOpen,
  FilePlus,
  Grid,
  Check,
  X,
  Palette,
  ChevronDown,
  Edit2,
  Calendar,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Hash,
  CalendarCheck,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import {
  CellData,
  SheetData,
  COL_LETTERS,
  colIndexToLetter,
  colLetterToIndex,
  parseCellRef,
  expandRange,
  formatCellValue,
  evaluateFormula,
} from './excel/formulaEngine';
import { EXCEL_TEMPLATES } from './excel/excelTemplates';
import { FormulaWizardModal } from './excel/FormulaWizardModal';
import { ExcelChartModal } from './excel/ExcelChartModal';
import { FindReplaceModal } from './excel/FindReplaceModal';

export const TeacherExcelStudio: React.FC = () => {
  const { currentSchool, currentUser, allUsers, saveAssessment } = useSchool();

  // Academic Year & Automatic Student Number Configuration
  const [academicYear, setAcademicYear] = useState<string>(
    currentSchool.academicYear || String(new Date().getFullYear())
  );
  const [autoGenStudentNumbers, setAutoGenStudentNumbers] = useState<boolean>(true);
  const [isQuickAddStudentOpen, setIsQuickAddStudentOpen] = useState<boolean>(false);
  const [newStudentFullName, setNewStudentFullName] = useState<string>('');

  // Ribbon Active Tab
  const [activeRibbon, setActiveRibbon] = useState<
    'home' | 'insert' | 'formulas' | 'data' | 'review' | 'templates' | 'file'
  >('home');

  // Class & Subject selector for auto-enrollment import
  const [selectedClassId, setSelectedClassId] = useState<string>(currentSchool.classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(currentSchool.subjects[0]?.id || '');

  // Grid display settings
  const [showGridlines, setShowGridlines] = useState(true);
  const [showHeadings, setShowHeadings] = useState(true);
  const [showFormulaBar, setShowFormulaBar] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sheets state: initialize with ECZ CA Marksheet template
  const [sheets, setSheets] = useState<SheetData[]>(() => {
    const defaultTemplate = EXCEL_TEMPLATES[0].generate(currentSchool, currentUser, allUsers);
    const analysisTemplate = EXCEL_TEMPLATES[3].generate(currentSchool, currentUser, allUsers);
    return [defaultTemplate, analysisTemplate];
  });

  const [activeSheetId, setActiveSheetId] = useState<string>(() => sheets[0]?.id || 'sheet_ecz_ca');
  const activeSheet = sheets.find((s) => s.id === activeSheetId) || sheets[0];

  // Selection & Editing state
  const [selectedCell, setSelectedCell] = useState<string>('C5');
  const [selectedRange, setSelectedRange] = useState<string[]>(['C5']);
  const [formulaInput, setFormulaInput] = useState<string>('18');
  const [isInlineEditing, setIsInlineEditing] = useState<boolean>(false);
  const [clipboard, setClipboard] = useState<{ cellData: CellData; type: 'copy' | 'cut' } | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<Record<string, CellData>[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  // Notifications / Sync toast
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Modals state
  const [isFormulaWizardOpen, setIsFormulaWizardOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [isRenameSheetOpen, setIsRenameSheetOpen] = useState(false);
  const [newSheetName, setNewSheetName] = useState('');

  // Dropdown menus state
  const [showFillColorPicker, setShowFillColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBorderMenu, setShowBorderMenu] = useState(false);
  const [showNumberFormatMenu, setShowNumberFormatMenu] = useState(false);
  const [showAutoSumMenu, setShowAutoSumMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected class & subject objects
  const selectedClass = currentSchool.classes.find((c) => c.id === selectedClassId) || currentSchool.classes[0];
  const selectedSubject = currentSchool.subjects.find((s) => s.id === selectedSubjectId) || currentSchool.subjects[0];
  const classStudents = allUsers.filter(
    (u) => u.schoolId === currentSchool.id && u.role === 'student' && u.studentProfile?.classId === selectedClassId
  );

  // Sync formula input whenever selected cell or active sheet changes
  useEffect(() => {
    const cell = activeSheet.data[selectedCell];
    setFormulaInput(cell?.formula || cell?.value || '');
  }, [selectedCell, activeSheetId]);

  // Push history state
  const pushHistory = (newData: Record<string, CellData>) => {
    const nextHistory = history.slice(0, historyIdx + 1);
    nextHistory.push(JSON.parse(JSON.stringify(newData)));
    if (nextHistory.length > 30) nextHistory.shift();
    setHistory(nextHistory);
    setHistoryIdx(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prevData = history[historyIdx - 1];
      setSheets((prev) =>
        prev.map((s) => (s.id === activeSheetId ? { ...s, data: JSON.parse(JSON.stringify(prevData)) } : s))
      );
      setHistoryIdx(historyIdx - 1);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const nextData = history[historyIdx + 1];
      setSheets((prev) =>
        prev.map((s) => (s.id === activeSheetId ? { ...s, data: JSON.parse(JSON.stringify(nextData)) } : s))
      );
      setHistoryIdx(historyIdx + 1);
    }
  };

  // Re-evaluate all formulas in a sheet dataset
  const recalculateSheet = (currentData: Record<string, CellData>): Record<string, CellData> => {
    const updated: Record<string, CellData> = { ...currentData };
    // Pass 1: compute calculated values
    Object.keys(updated).forEach((k) => {
      const cell = updated[k];
      if (cell && cell.formula && cell.formula.startsWith('=')) {
        const res = evaluateFormula(cell.formula, updated);
        updated[k] = { ...cell, value: res };
      }
    });
    return updated;
  };

  // Compute next student registration number based on academic year and current sheet
  const getNextStudentNumberForSheet = (sheetData: Record<string, CellData>, year: string, targetRow: number): string => {
    let maxIdx = 0;
    Object.keys(sheetData).forEach((k) => {
      const p = parseCellRef(k);
      if (p && p.col === 'A') {
        const val = sheetData[k]?.value || '';
        const matchWithYear = val.match(/^STU-(\d{4})-(\d+)$/i);
        if (matchWithYear) {
          const num = parseInt(matchWithYear[2], 10);
          if (!isNaN(num) && num > maxIdx) {
            maxIdx = num;
          }
        } else {
          const matchSimple = val.match(/^STU-(\d+)$/i);
          if (matchSimple) {
            const num = parseInt(matchSimple[1], 10);
            if (!isNaN(num) && num > maxIdx) {
              maxIdx = num;
            }
          }
        }
      }
    });

    const nextNumber = maxIdx > 0 ? maxIdx + 1 : Math.max(1, targetRow >= 5 ? targetRow - 4 : targetRow);
    return `STU-${year}-${String(nextNumber).padStart(3, '0')}`;
  };

  // Update a single cell or range with automatic student number generator and formulas
  const updateCellValue = (cellKey: string, rawVal: string) => {
    setSheets((prev) =>
      prev.map((s) => {
        if (s.id === activeSheetId) {
          const currentCell = s.data[cellKey] || { value: '' };
          const isFormula = rawVal.startsWith('=');
          const nextData: Record<string, CellData> = {
            ...s.data,
            [cellKey]: {
              ...currentCell,
              value: isFormula ? evaluateFormula(rawVal, s.data) : rawVal,
              formula: isFormula ? rawVal : undefined,
            },
          };

          // AUTO-GENERATE STUDENT NUMBER WHEN ENTERING NAME IN COLUMN B (ROW >= 5)
          const parsed = parseCellRef(cellKey);
          if (autoGenStudentNumbers && parsed && parsed.col === 'B' && parsed.row >= 5) {
            const stuNoKey = `A${parsed.row}`;
            const trimmedName = rawVal.trim();

            if (trimmedName.length > 0) {
              const existingId = nextData[stuNoKey]?.value?.trim();
              if (!existingId || existingId === '') {
                const autoStuNo = getNextStudentNumberForSheet(nextData, academicYear, parsed.row);
                nextData[stuNoKey] = {
                  value: autoStuNo,
                  align: 'center',
                  bold: true,
                  color: '#1B5E20',
                  border: 'all',
                };

                // Auto-fill template calculations if this is a CA Marksheet
                const isCaMarksheet =
                  s.data['A1']?.value?.includes('CONTINUOUS ASSESSMENT') ||
                  s.data['G4']?.value?.includes('WEIGHTED') ||
                  s.id === 'sheet_ecz_ca';

                if (isCaMarksheet) {
                  const r = parsed.row;
                  if (!nextData[`C${r}`]) nextData[`C${r}`] = { value: '0', align: 'center', format: 'number', decimals: 0, border: 'all' };
                  if (!nextData[`D${r}`]) nextData[`D${r}`] = { value: '0', align: 'center', format: 'number', decimals: 0, border: 'all' };
                  if (!nextData[`E${r}`]) nextData[`E${r}`] = { value: '0', align: 'center', format: 'number', decimals: 0, border: 'all' };
                  if (!nextData[`F${r}`]) nextData[`F${r}`] = { value: '0', align: 'center', format: 'number', decimals: 0, border: 'all' };
                  if (!nextData[`G${r}`]) {
                    nextData[`G${r}`] = {
                      value: '0%',
                      formula: `=ROUND(((C${r}+D${r}+E${r})/60)*40+(F${r}*0.6), 0)`,
                      align: 'center',
                      bold: true,
                      bg: '#E8F5E9',
                      border: 'all',
                    };
                  }
                  if (!nextData[`H${r}`]) {
                    nextData[`H${r}`] = {
                      value: `=ECZ_GRADE(G${r})`,
                      formula: `=ECZ_GRADE(G${r})`,
                      align: 'center',
                      bold: true,
                      color: '#1B5E20',
                      bg: '#C8E6C9',
                      border: 'all',
                    };
                  }
                  if (!nextData[`I${r}`]) {
                    nextData[`I${r}`] = { value: 'Continuous assessment in progress', align: 'left', border: 'all' };
                  }
                }

                // Auto-fill attendance calculations if attendance register
                const isAttendanceSheet =
                  s.data['A1']?.value?.includes('ATTENDANCE') || s.id === 'sheet_attendance';

                if (isAttendanceSheet) {
                  const r = parsed.row;
                  ['C', 'D', 'E', 'F', 'G'].forEach((c) => {
                    if (!nextData[`${c}${r}`]) {
                      nextData[`${c}${r}`] = { value: 'P', align: 'center', bg: '#D1E7DD', color: '#0F5132', border: 'all' };
                    }
                  });
                  if (!nextData[`H${r}`]) {
                    nextData[`H${r}`] = { value: '5', formula: `=COUNTIF(C${r}:G${r}, "P")`, align: 'center', bold: true, border: 'all' };
                  }
                  if (!nextData[`I${r}`]) {
                    nextData[`I${r}`] = { value: '100%', formula: `=ROUND((H${r}/5)*100, 0)&"%"`, align: 'center', bold: true, bg: '#E7F1FF', border: 'all' };
                  }
                }

                // Auto-fill learner enrollment data if Learner Admission sheet
                const isLearnerEnrollment =
                  s.data['A1']?.value?.includes('LEARNER ADMISSION') ||
                  s.data['A1']?.value?.includes('ENROLLMENT REGISTRY') ||
                  s.id === 'sheet_learner_enrollment';

                if (isLearnerEnrollment) {
                  const r = parsed.row;
                  if (!nextData[`C${r}`]) nextData[`C${r}`] = { value: r % 2 === 0 ? 'Male' : 'Female', align: 'center', border: 'all' };
                  if (!nextData[`D${r}`]) nextData[`D${r}`] = { value: `${academicYear}-01-15`, align: 'center', border: 'all' };
                  if (!nextData[`E${r}`]) nextData[`E${r}`] = { value: selectedClass?.name || 'Grade 9A', align: 'center', border: 'all' };
                  if (!nextData[`F${r}`]) nextData[`F${r}`] = { value: `${academicYear}/09/${100 + r}`, align: 'center', border: 'all' };
                  if (!nextData[`G${r}`]) nextData[`G${r}`] = { value: `Guardian of ${trimmedName.split(' ')[0]}`, align: 'left', border: 'all' };
                  if (!nextData[`H${r}`]) nextData[`H${r}`] = { value: '+260 97 0000000', align: 'center', border: 'all' };
                  if (!nextData[`I${r}`]) nextData[`I${r}`] = { value: 'Kabwe Central', align: 'left', border: 'all' };
                  if (!nextData[`J${r}`]) nextData[`J${r}`] = { value: `${academicYear}-01-12`, align: 'center', border: 'all' };
                  if (!nextData[`K${r}`]) nextData[`K${r}`] = { value: 'ACTIVE', align: 'center', bold: true, bg: '#DCFCE7', color: '#166534', border: 'all' };
                  if (!nextData[`L${r}`]) nextData[`L${r}`] = { value: 'None', align: 'left', color: '#64748B', border: 'all' };
                }

                setSyncStatus(`✨ Auto-generated Student Number: ${autoStuNo} (${academicYear}) for "${trimmedName}"`);
                setTimeout(() => setSyncStatus(null), 4000);
              }
            }
          }

          const recalculated = recalculateSheet(nextData);
          pushHistory(recalculated);
          return { ...s, data: recalculated };
        }
        return s;
      })
    );
  };

  // Switch or batch update student numbers to a different academic year
  const handleBatchUpdateYear = (newYear: string) => {
    setAcademicYear(newYear);
    setSheets((prev) =>
      prev.map((s) => {
        if (s.id === activeSheetId) {
          const nextData = { ...s.data };
          let updatedCount = 0;

          // Update header year in A2 if exists
          if (nextData['A2'] && nextData['A2'].value) {
            nextData['A2'] = {
              ...nextData['A2'],
              value: nextData['A2'].value.replace(/\b20\d{2}\b/g, newYear),
            };
          }

          // Update all STU numbers in Column A
          for (let r = 5; r <= s.rowCount; r++) {
            const cellKey = `A${r}`;
            const cell = nextData[cellKey];
            if (cell && cell.value) {
              const val = cell.value.trim();
              if (/^STU-\d{4}-\d+$/i.test(val)) {
                const parts = val.split('-');
                const newId = `STU-${newYear}-${parts[2]}`;
                nextData[cellKey] = { ...cell, value: newId };
                updatedCount++;
              } else if (/^STU-\d+$/i.test(val)) {
                const parts = val.split('-');
                const newId = `STU-${newYear}-${parts[1].padStart(3, '0')}`;
                nextData[cellKey] = { ...cell, value: newId };
                updatedCount++;
              }
            }
          }

          const recalculated = recalculateSheet(nextData);
          pushHistory(recalculated);
          return { ...s, data: recalculated };
        }
        return s;
      })
    );

    setSyncStatus(`✓ Academic Year set to ${newYear} (All student numbers updated to STU-${newYear}-...)`);
    setTimeout(() => setSyncStatus(null), 4000);
  };

  // Quick Add Learner modal submission
  const handleQuickAddStudent = (name: string) => {
    if (!name.trim()) return;
    const s = activeSheet;
    let targetRow = 5;
    while (s.data[`B${targetRow}`]?.value?.trim()) {
      targetRow++;
    }

    const autoStuNo = getNextStudentNumberForSheet(s.data, academicYear, targetRow);
    const nextData = { ...s.data };

    nextData[`A${targetRow}`] = {
      value: autoStuNo,
      align: 'center',
      bold: true,
      color: '#1B5E20',
      border: 'all',
    };
    nextData[`B${targetRow}`] = {
      value: name.trim(),
      align: 'left',
      bold: true,
      border: 'all',
    };

    // CA Marksheet auto-fill
    const isCaMarksheet =
      s.data['A1']?.value?.includes('CONTINUOUS ASSESSMENT') ||
      s.data['G4']?.value?.includes('WEIGHTED') ||
      s.id === 'sheet_ecz_ca';

    if (isCaMarksheet) {
      const r = targetRow;
      nextData[`C${r}`] = { value: '0', align: 'center', format: 'number', decimals: 0, border: 'all' };
      nextData[`D${r}`] = { value: '0', align: 'center', format: 'number', decimals: 0, border: 'all' };
      nextData[`E${r}`] = { value: '0', align: 'center', format: 'number', decimals: 0, border: 'all' };
      nextData[`F${r}`] = { value: '0', align: 'center', format: 'number', decimals: 0, border: 'all' };
      nextData[`G${r}`] = {
        value: '0%',
        formula: `=ROUND(((C${r}+D${r}+E${r})/60)*40+(F${r}*0.6), 0)`,
        align: 'center',
        bold: true,
        bg: '#E8F5E9',
        border: 'all',
      };
      nextData[`H${r}`] = {
        value: `=ECZ_GRADE(G${r})`,
        formula: `=ECZ_GRADE(G${r})`,
        align: 'center',
        bold: true,
        color: '#1B5E20',
        bg: '#C8E6C9',
        border: 'all',
      };
      nextData[`I${r}`] = { value: 'Continuous assessment in progress', align: 'left', border: 'all' };
    }

    const recalculated = recalculateSheet(nextData);
    pushHistory(recalculated);

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId
          ? { ...sheet, data: recalculated, rowCount: Math.max(sheet.rowCount, targetRow + 5) }
          : sheet
      )
    );

    setSelectedCell(`C${targetRow}`);
    setSelectedRange([`C${targetRow}`]);
    setSyncStatus(`✨ Added "${name.trim()}" with Student No ${autoStuNo} (${academicYear})`);
    setTimeout(() => setSyncStatus(null), 4000);
    setNewStudentFullName('');
    setIsQuickAddStudentOpen(false);
  };

  // Update cell styling (bold, italic, color, bg, align, format, borders)
  const updateCellStyle = (updates: Partial<CellData>) => {
    setSheets((prev) =>
      prev.map((s) => {
        if (s.id === activeSheetId) {
          const nextData = { ...s.data };
          selectedRange.forEach((k) => {
            const current = nextData[k] || { value: '' };
            nextData[k] = { ...current, ...updates };
          });
          pushHistory(nextData);
          return { ...s, data: nextData };
        }
        return s;
      })
    );
  };

  // Clipboard actions
  const handleCopy = () => {
    const cell = activeSheet.data[selectedCell];
    if (cell) {
      setClipboard({ cellData: { ...cell }, type: 'copy' });
      setSyncStatus(`Copied cell ${selectedCell} to clipboard`);
      setTimeout(() => setSyncStatus(null), 2000);
    }
  };

  const handleCut = () => {
    const cell = activeSheet.data[selectedCell];
    if (cell) {
      setClipboard({ cellData: { ...cell }, type: 'cut' });
      updateCellValue(selectedCell, '');
      setSyncStatus(`Cut cell ${selectedCell}`);
      setTimeout(() => setSyncStatus(null), 2000);
    }
  };

  const handlePaste = (pasteType: 'all' | 'values' | 'formulas' = 'all') => {
    if (!clipboard) return;
    setSheets((prev) =>
      prev.map((s) => {
        if (s.id === activeSheetId) {
          const target = s.data[selectedCell] || { value: '' };
          let nextCell: CellData = { ...target };

          if (pasteType === 'all') {
            nextCell = { ...clipboard.cellData };
          } else if (pasteType === 'values') {
            nextCell = { ...target, value: clipboard.cellData.value, formula: undefined };
          } else if (pasteType === 'formulas') {
            nextCell = {
              ...target,
              formula: clipboard.cellData.formula,
              value: clipboard.cellData.formula
                ? evaluateFormula(clipboard.cellData.formula, s.data)
                : clipboard.cellData.value,
            };
          }

          const nextData = { ...s.data, [selectedCell]: nextCell };
          const recalculated = recalculateSheet(nextData);
          pushHistory(recalculated);
          return { ...s, data: recalculated };
        }
        return s;
      })
    );
  };

  // Row and Column operations
  const insertRow = (offset: number) => {
    const parsed = parseCellRef(selectedCell);
    if (!parsed) return;
    const targetRow = parsed.row + offset;

    setSheets((prev) =>
      prev.map((s) => {
        if (s.id === activeSheetId) {
          const nextData: Record<string, CellData> = {};
          Object.keys(s.data).forEach((k) => {
            const p = parseCellRef(k);
            if (!p) return;
            if (p.row >= targetRow) {
              nextData[`${p.col}${p.row + 1}`] = s.data[k];
            } else {
              nextData[k] = s.data[k];
            }
          });
          return { ...s, data: nextData, rowCount: s.rowCount + 1 };
        }
        return s;
      })
    );
  };

  const insertColumn = (offset: number) => {
    const parsed = parseCellRef(selectedCell);
    if (!parsed) return;
    const targetColIdx = parsed.colIdx + offset;

    setSheets((prev) =>
      prev.map((s) => {
        if (s.id === activeSheetId) {
          const nextData: Record<string, CellData> = {};
          Object.keys(s.data).forEach((k) => {
            const p = parseCellRef(k);
            if (!p) return;
            if (p.colIdx >= targetColIdx) {
              nextData[`${colIndexToLetter(p.colIdx + 1)}${p.row}`] = s.data[k];
            } else {
              nextData[k] = s.data[k];
            }
          });
          return { ...s, data: nextData, colCount: Math.min(26, s.colCount + 1) };
        }
        return s;
      })
    );
  };

  const deleteRow = () => {
    const parsed = parseCellRef(selectedCell);
    if (!parsed) return;
    const rowToDelete = parsed.row;

    setSheets((prev) =>
      prev.map((s) => {
        if (s.id === activeSheetId) {
          const nextData: Record<string, CellData> = {};
          Object.keys(s.data).forEach((k) => {
            const p = parseCellRef(k);
            if (!p || p.row === rowToDelete) return;
            if (p.row > rowToDelete) {
              nextData[`${p.col}${p.row - 1}`] = s.data[k];
            } else {
              nextData[k] = s.data[k];
            }
          });
          return { ...s, data: nextData, rowCount: Math.max(10, s.rowCount - 1) };
        }
        return s;
      })
    );
  };

  const deleteColumn = () => {
    const parsed = parseCellRef(selectedCell);
    if (!parsed) return;
    const colToDelete = parsed.colIdx;

    setSheets((prev) =>
      prev.map((s) => {
        if (s.id === activeSheetId) {
          const nextData: Record<string, CellData> = {};
          Object.keys(s.data).forEach((k) => {
            const p = parseCellRef(k);
            if (!p || p.colIdx === colToDelete) return;
            if (p.colIdx > colToDelete) {
              nextData[`${colIndexToLetter(p.colIdx - 1)}${p.row}`] = s.data[k];
            } else {
              nextData[k] = s.data[k];
            }
          });
          return { ...s, data: nextData, colCount: Math.max(5, s.colCount - 1) };
        }
        return s;
      })
    );
  };

  // Clear operations
  const clearSelection = (mode: 'all' | 'formats' | 'contents') => {
    setSheets((prev) =>
      prev.map((s) => {
        if (s.id === activeSheetId) {
          const nextData = { ...s.data };
          selectedRange.forEach((k) => {
            if (mode === 'all') {
              delete nextData[k];
            } else if (mode === 'contents') {
              if (nextData[k]) nextData[k] = { ...nextData[k], value: '', formula: undefined };
            } else if (mode === 'formats') {
              if (nextData[k]) {
                const { value, formula } = nextData[k];
                nextData[k] = { value, formula };
              }
            }
          });
          return { ...s, data: nextData };
        }
        return s;
      })
    );
  };

  // Sort active column
  const sortColumn = (direction: 'asc' | 'desc') => {
    const parsed = parseCellRef(selectedCell);
    if (!parsed) return;
    const col = parsed.col;

    // Collect rows starting from row 5 onwards
    const rowsWithValues: { row: number; val: string }[] = [];
    for (let r = 5; r <= activeSheet.rowCount; r++) {
      const v = activeSheet.data[`${col}${r}`]?.value || '';
      rowsWithValues.push({ row: r, val: v });
    }

    rowsWithValues.sort((a, b) => {
      const numA = parseFloat(a.val.replace(/[%,K$]/g, ''));
      const numB = parseFloat(b.val.replace(/[%,K$]/g, ''));
      if (!isNaN(numA) && !isNaN(numB)) {
        return direction === 'asc' ? numA - numB : numB - numA;
      }
      return direction === 'asc' ? a.val.localeCompare(b.val) : b.val.localeCompare(a.val);
    });

    setSheets((prev) =>
      prev.map((s) => {
        if (s.id === activeSheetId) {
          const nextData = { ...s.data };
          // Re-map entire row values based on sorted row index
          const originalRows = rowsWithValues.map((item) => {
            const rowMap: Record<string, CellData> = {};
            for (let c = 0; c < s.colCount; c++) {
              const letter = colIndexToLetter(c);
              if (s.data[`${letter}${item.row}`]) {
                rowMap[letter] = s.data[`${letter}${item.row}`];
              }
            }
            return rowMap;
          });

          originalRows.forEach((rowMap, idx) => {
            const targetRowNum = 5 + idx;
            for (let c = 0; c < s.colCount; c++) {
              const letter = colIndexToLetter(c);
              const cellKey = `${letter}${targetRowNum}`;
              if (rowMap[letter]) {
                nextData[cellKey] = rowMap[letter];
              } else {
                delete nextData[cellKey];
              }
            }
          });

          return { ...s, data: nextData };
        }
        return s;
      })
    );

    setSyncStatus(`Sorted column ${col} ${direction.toUpperCase()}`);
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // Find and Replace Handler
  const handleFindReplace = (findText: string, replaceText: string, replaceAll: boolean) => {
    if (!findText) return;
    setSheets((prev) =>
      prev.map((s) => {
        if (s.id === activeSheetId) {
          const nextData = { ...s.data };
          let replacedCount = 0;
          Object.keys(nextData).forEach((k) => {
            const val = nextData[k]?.value || '';
            if (val.includes(findText)) {
              if (replaceAll || replacedCount === 0) {
                nextData[k] = {
                  ...nextData[k],
                  value: val.split(findText).join(replaceText),
                };
                replacedCount++;
              }
            }
          });
          return { ...s, data: nextData };
        }
        return s;
      })
    );
  };

  // 1-Click Sync to School Assessment Database
  const handleSyncToGradebook = () => {
    const studentsToUse = classStudents.length > 0 ? classStudents : [
      { id: '1', fullName: 'Mubita Mweemba', studentProfile: { studentNumber: 'STU-2026-001' } },
      { id: '2', fullName: 'Chileshe Mwansa', studentProfile: { studentNumber: 'STU-2026-002' } },
      { id: '3', fullName: 'Kondwani Banda', studentProfile: { studentNumber: 'STU-2026-003' } },
      { id: '4', fullName: 'Natasha Phiri', studentProfile: { studentNumber: 'STU-2026-004' } },
      { id: '5', fullName: 'Thandiwe Zulu', studentProfile: { studentNumber: 'STU-2026-005' } },
      { id: '6', fullName: 'Bwalya Tembo', studentProfile: { studentNumber: 'STU-2026-006' } },
      { id: '7', fullName: 'Luyando Moonga', studentProfile: { studentNumber: 'STU-2026-007' } },
      { id: '8', fullName: 'Kabwe Chilufya', studentProfile: { studentNumber: 'STU-2026-008' } },
    ];

    const scores = studentsToUse.map((st, idx) => {
      const row = 5 + idx;
      const t1 = parseFloat(activeSheet.data[`C${row}`]?.value || '15') || 15;
      const t2 = parseFloat(activeSheet.data[`D${row}`]?.value || '15') || 15;
      const t3 = parseFloat(activeSheet.data[`E${row}`]?.value || '15') || 15;
      const exam = parseFloat(activeSheet.data[`F${row}`]?.value || '70') || 70;
      const pct = Math.round(((t1 + t2 + t3) / 60) * 40 + (exam / 100) * 60);

      return {
        studentId: st.id,
        studentName: st.fullName,
        studentNumber: (st as any).studentProfile?.studentNumber || '',
        rawScore: Math.round((t1 + t2 + t3) / 3),
        maxScore: 20,
        percentage: pct,
        remarks: activeSheet.data[`I${row}`]?.value || 'Continuous assessment complete.',
      };
    });

    const assId = `ass_excel_${selectedClassId}_${selectedSubjectId}_${Date.now()}`;
    saveAssessment({
      id: assId,
      schoolId: currentSchool.id,
      academicYear: currentSchool.academicYear,
      termId: currentSchool.activeTerm,
      classId: selectedClassId,
      className: selectedClass?.name || 'Grade 9A',
      subjectId: selectedSubjectId,
      subjectName: selectedSubject?.name || 'Mathematics',
      teacherId: currentUser.id,
      teacherName: currentUser.fullName,
      type: 'test_1',
      title: `${selectedSubject?.name} CA Marksheet (Excel Synced)`,
      maxScore: 20,
      date: new Date().toISOString().split('T')[0],
      weekNumber: 4,
      scores,
      status: 'submitted',
      isLocked: false,
    });

    setSyncStatus('✓ Sheet successfully synchronized & submitted to SchoolLink Continuous Assessment!');
    setTimeout(() => setSyncStatus(null), 5000);
  };

  // Export to CSV
  const handleExportCsv = () => {
    let csvContent = '';
    for (let r = 1; r <= activeSheet.rowCount; r++) {
      const rowVals: string[] = [];
      for (let c = 0; c < activeSheet.colCount; c++) {
        const col = colIndexToLetter(c);
        const val = activeSheet.data[`${col}${r}`]?.value || '';
        rowVals.push(`"${val.replace(/"/g, '""')}"`);
      }
      csvContent += rowVals.join(',') + '\r\n';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeSheet.name.replace(/\s+/g, '_')}_${currentSchool.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(sheets, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SchoolLink_Workbook_${currentSchool.code}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import File (CSV or JSON)
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed[0]?.data) {
            setSheets(parsed);
            setActiveSheetId(parsed[0].id);
            setSyncStatus('Imported Workbook JSON successfully');
          }
        } catch {
          setSyncStatus('Error: Invalid Workbook JSON file.');
        }
      } else if (file.name.endsWith('.csv')) {
        const lines = content.split(/\r\n|\n/);
        const nextData: Record<string, CellData> = {};
        lines.forEach((line, rIdx) => {
          if (!line.trim()) return;
          const cols = line.split(',');
          cols.forEach((val, cIdx) => {
            const cleanVal = val.replace(/^"|"$/g, '').trim();
            const cellKey = `${colIndexToLetter(cIdx)}${rIdx + 1}`;
            nextData[cellKey] = { value: cleanVal };
          });
        });

        const newSheet: SheetData = {
          id: `sheet_${Date.now()}`,
          name: file.name.replace('.csv', ''),
          data: nextData,
          rowCount: Math.max(30, lines.length + 5),
          colCount: 15,
        };
        setSheets([...sheets, newSheet]);
        setActiveSheetId(newSheet.id);
        setSyncStatus(`Imported CSV into new sheet: ${newSheet.name}`);
      }
    };
    reader.readAsText(file);
  };

  // Add new Sheet
  const handleAddNewSheet = () => {
    const count = sheets.length + 1;
    const newSheet: SheetData = {
      id: `sheet_${Date.now()}`,
      name: `Sheet ${count}`,
      data: {},
      rowCount: 35,
      colCount: 12,
    };
    setSheets([...sheets, newSheet]);
    setActiveSheetId(newSheet.id);
  };

  // Add Official Learner Enrollment Sheet for Adding Learners
  const handleAddLearnerSheet = () => {
    const learnerTemplate = EXCEL_TEMPLATES.find((t) => t.id === 'learner_enrollment_registry');
    if (!learnerTemplate) return;
    const generated = learnerTemplate.generate(currentSchool, currentUser, allUsers);

    // Check if an enrollment sheet already exists
    const existingIndex = sheets.findIndex(
      (s) => s.id === generated.id || s.name.toLowerCase().includes('learner') || s.name.toLowerCase().includes('enrollment')
    );

    if (existingIndex !== -1) {
      setActiveSheetId(sheets[existingIndex].id);
      setSelectedCell('B5');
      setSelectedRange(['B5']);
      setSyncStatus(`Switched to active "${sheets[existingIndex].name}" worksheet. Ready to enter new learners!`);
    } else {
      setSheets((prev) => [...prev, generated]);
      setActiveSheetId(generated.id);
      setSelectedCell('B5');
      setSelectedRange(['B5']);
      setSyncStatus(`✓ "Learner Enrollment" worksheet created with auto-sequenced student numbers!`);
    }
    setTimeout(() => setSyncStatus(null), 4500);
  };

  // Duplicate Sheet
  const handleDuplicateSheet = (sheet: SheetData) => {
    const copy: SheetData = {
      ...sheet,
      id: `sheet_${Date.now()}`,
      name: `${sheet.name} (Copy)`,
      data: JSON.parse(JSON.stringify(sheet.data)),
    };
    setSheets([...sheets, copy]);
    setActiveSheetId(copy.id);
  };

  // Delete Sheet
  const handleDeleteSheet = (id: string) => {
    if (sheets.length <= 1) {
      setSyncStatus('Workbook must contain at least one visible worksheet.');
      return;
    }
    const filtered = sheets.filter((s) => s.id !== id);
    setSheets(filtered);
    setActiveSheetId(filtered[0].id);
  };

  // Live Aggregate Statistics for selected cells (Status Bar)
  const selectionStats = useMemo(() => {
    let sum = 0;
    let count = 0;
    let numericCount = 0;
    let min: number | null = null;
    let max: number | null = null;

    selectedRange.forEach((k) => {
      const cell = activeSheet.data[k];
      if (cell && cell.value !== undefined && cell.value !== '') {
        count++;
        const num = parseFloat(String(cell.value).replace(/[%,K$]/g, ''));
        if (!isNaN(num)) {
          numericCount++;
          sum += num;
          if (min === null || num < min) min = num;
          if (max === null || num > max) max = num;
        }
      }
    });

    return {
      count,
      numericCount,
      sum: Math.round(sum * 100) / 100,
      average: numericCount > 0 ? Math.round((sum / numericCount) * 100) / 100 : 0,
      min: min !== null ? min : 0,
      max: max !== null ? max : 0,
    };
  }, [selectedRange, activeSheet.data]);

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* 1. TOP TITLE BAR (Excel Standard) */}
      <div className="bg-[#107C41] text-white px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0C5E31] select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold shadow-inner">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white font-mono">
                Microsoft Excel &bull; SchoolLink Edition
              </span>
              <span className="text-xs text-emerald-100 font-medium truncate max-w-xs">
                {activeSheet.name} &bull; {currentSchool.name}
              </span>
            </div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>ECZ Continuous Assessment & Marksheet System</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Academic Year Control with Auto-Update */}
          <div className="flex items-center gap-1.5 bg-[#0C5E31] px-2.5 py-1 rounded-xl border border-emerald-700/50 text-xs shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-[11px] text-emerald-200 font-semibold hidden sm:inline">Year:</span>
            <select
              value={academicYear}
              onChange={(e) => handleBatchUpdateYear(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              title="Select academic year (all student numbers will use this year prefix)"
            >
              {['2024', '2025', '2026', '2027', '2028', '2029', '2030'].map((yr) => (
                <option key={yr} value={yr} className="bg-slate-800 text-white">
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Add Learners Sheet Button */}
          <button
            onClick={handleAddLearnerSheet}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 border border-emerald-500/40"
            title="Open/Add official Learner Admission & Enrollment Registry spreadsheet"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-200" />
            <span>+ Add Learners Sheet</span>
          </button>

          {/* Quick Add Student Button */}
          <button
            onClick={() => setIsQuickAddStudentOpen(true)}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Add new learner with auto-generated student number"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-900" />
            <span>Add Learner</span>
          </button>

          {/* 1-Click Sync to Assessment Database */}
          <button
            onClick={handleSyncToGradebook}
            className="px-3.5 py-1.5 bg-white text-[#107C41] hover:bg-emerald-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Commit active sheet marks directly to central SchoolLink database"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sync to School Gradebook</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-[#0C5E31] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="Export CSV sheet"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Open Charts */}
          <button
            onClick={() => setIsChartModalOpen(true)}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Charts</span>
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="p-1.5 bg-[#0C5E31] hover:bg-emerald-900 text-white rounded-xl transition"
            title="Print Worksheet"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-[#0C5E31] hover:bg-emerald-900 text-white rounded-xl transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Excel'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. EXCEL RIBBON TABS */}
      <div className="bg-[#F3F2F1] border-b border-slate-300 px-4 pt-1.5 flex items-center gap-1 overflow-x-auto text-xs font-medium text-slate-700 select-none">
        {[
          { id: 'file', label: 'File' },
          { id: 'home', label: 'Home' },
          { id: 'insert', label: 'Insert & Charts' },
          { id: 'formulas', label: 'Formulas (ECZ / Stats)' },
          { id: 'data', label: 'Data & Class List' },
          { id: 'review', label: 'Review & View' },
          { id: 'templates', label: 'School Templates' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRibbon(tab.id as any)}
            className={`px-3 py-1.5 rounded-t-lg transition font-semibold ${
              activeRibbon === tab.id
                ? 'bg-white text-[#107C41] border-t-2 border-t-[#107C41] border-l border-r border-slate-300 shadow-2xs font-bold'
                : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. RIBBON TOOLBAR */}
      <div className="bg-[#F8F9FA] border-b border-slate-300 p-2 flex flex-wrap items-center gap-3 text-xs min-h-[50px]">
        {/* FILE TAB */}
        {activeRibbon === 'file' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAddLearnerSheet}
              className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-600 flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-200" />
              <span>+ Add Learners Sheet</span>
            </button>

            <button
              onClick={handleAddNewSheet}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <FilePlus className="w-3.5 h-3.5 text-[#107C41]" />
              <span>New Blank Sheet</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Open / Import CSV/JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".csv,.json"
              className="hidden"
            />

            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>Save Workbook (.json)</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Worksheet</span>
            </button>
          </div>
        )}

        {/* HOME TAB */}
        {activeRibbon === 'home' && (
          <>
            {/* Undo / Redo */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
              <button
                onClick={handleUndo}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                title="Undo (Ctrl+Z)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                title="Redo (Ctrl+Y)"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Clipboard */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
              <button
                onClick={() => handlePaste('all')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 flex items-center gap-1"
                title="Paste (Ctrl+V)"
              >
                <Clipboard className="w-3.5 h-3.5 text-[#107C41]" />
                <span className="text-[11px] font-bold">Paste</span>
              </button>
              <button
                onClick={handleCut}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                title="Cut (Ctrl+X)"
              >
                <Scissors className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                title="Copy (Ctrl+C)"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Font formatting */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
              {/* Font Family */}
              <select
                value={activeSheet.data[selectedCell]?.fontFamily || 'Calibri'}
                onChange={(e) => updateCellStyle({ fontFamily: e.target.value })}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#107C41]"
              >
                <option value="Calibri">Calibri</option>
                <option value="Aptos">Aptos</option>
                <option value="Arial">Arial</option>
                <option value="Segoe UI">Segoe UI</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>

              {/* Font Size */}
              <select
                value={activeSheet.data[selectedCell]?.fontSize || 11}
                onChange={(e) => updateCellStyle({ fontSize: parseInt(e.target.value, 10) })}
                className="px-1.5 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#107C41]"
              >
                {[9, 10, 11, 12, 14, 16, 18, 20, 24].map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>

              <button
                onClick={() =>
                  updateCellStyle({
                    bold: !activeSheet.data[selectedCell]?.bold,
                  })
                }
                className={`p-1.5 rounded hover:bg-slate-200 font-bold ${
                  activeSheet.data[selectedCell]?.bold ? 'bg-slate-300' : ''
                }`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5 text-slate-800" />
              </button>

              <button
                onClick={() =>
                  updateCellStyle({
                    italic: !activeSheet.data[selectedCell]?.italic,
                  })
                }
                className={`p-1.5 rounded hover:bg-slate-200 ${
                  activeSheet.data[selectedCell]?.italic ? 'bg-slate-300' : ''
                }`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5 text-slate-800" />
              </button>

              <button
                onClick={() =>
                  updateCellStyle({
                    underline: !activeSheet.data[selectedCell]?.underline,
                  })
                }
                className={`p-1.5 rounded hover:bg-slate-200 ${
                  activeSheet.data[selectedCell]?.underline ? 'bg-slate-300' : ''
                }`}
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-3.5 h-3.5 text-slate-800" />
              </button>
            </div>

            {/* Borders & Colors */}
            <div className="flex items-center gap-1.5 border-r border-slate-300 pr-2">
              {/* Fill Color */}
              <div className="relative">
                <button
                  onClick={() => setShowFillColorPicker(!showFillColorPicker)}
                  className="p-1.5 rounded hover:bg-slate-200 flex items-center gap-1"
                  title="Fill Color"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-600" />
                  <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
                </button>
                {showFillColorPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-xl p-2 z-50 grid grid-cols-5 gap-1.5 w-40">
                    {[
                      { bg: '#FFFFFF', name: 'White' },
                      { bg: '#E8F5E9', name: 'Light Green' },
                      { bg: '#C8E6C9', name: 'Green' },
                      { bg: '#FFF9C4', name: 'Light Yellow' },
                      { bg: '#FFECB3', name: 'Amber' },
                      { bg: '#FFCDD2', name: 'Red' },
                      { bg: '#E1F5FE', name: 'Light Blue' },
                      { bg: '#F3E8FF', name: 'Purple' },
                      { bg: '#F1F5F9', name: 'Light Slate' },
                      { bg: '#E2E8F0', name: 'Slate' },
                    ].map((c) => (
                      <button
                        key={c.bg}
                        onClick={() => {
                          updateCellStyle({ bg: c.bg });
                          setShowFillColorPicker(false);
                        }}
                        className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition shadow-2xs"
                        style={{ backgroundColor: c.bg }}
                        title={c.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Text Color */}
              <div className="relative">
                <button
                  onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                  className="p-1.5 rounded hover:bg-slate-200 flex items-center gap-1"
                  title="Font Color"
                >
                  <span className="font-bold text-xs underline decoration-red-600">A</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
                </button>
                {showTextColorPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-xl p-2 z-50 grid grid-cols-5 gap-1.5 w-40">
                    {[
                      { col: '#000000', name: 'Black' },
                      { col: '#107C41', name: 'Dark Green' },
                      { col: '#0D6EFD', name: 'Blue' },
                      { col: '#DC2626', name: 'Red' },
                      { col: '#D97706', name: 'Amber' },
                      { col: '#7C3AED', name: 'Purple' },
                      { col: '#475569', name: 'Slate' },
                      { col: '#FFFFFF', name: 'White' },
                    ].map((c) => (
                      <button
                        key={c.col}
                        onClick={() => {
                          updateCellStyle({ color: c.col });
                          setShowTextColorPicker(false);
                        }}
                        className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition"
                        style={{ backgroundColor: c.col }}
                        title={c.name}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Alignments */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
              <button
                onClick={() => updateCellStyle({ align: 'left' })}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateCellStyle({ align: 'center' })}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateCellStyle({ align: 'right' })}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Number Formats */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
              <button
                onClick={() => updateCellStyle({ format: 'currency', decimals: 2 })}
                className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-slate-700"
                title="Zambian Kwacha Currency (ZMW)"
              >
                K Currency
              </button>
              <button
                onClick={() => updateCellStyle({ format: 'percent', decimals: 1 })}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 font-bold text-xs"
                title="Percentage (%)"
              >
                %
              </button>
              <button
                onClick={() => updateCellStyle({ format: 'number', decimals: 2 })}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 font-mono text-xs"
                title="Number with 2 decimals"
              >
                .00
              </button>
            </div>

            {/* Cells Insert / Delete & Quick Learner */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
              <button
                onClick={() => setIsQuickAddStudentOpen(true)}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs"
                title="Add Learner Row with Auto Student Number"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Learner</span>
              </button>
              <button
                onClick={() => insertRow(0)}
                className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-medium text-slate-700"
              >
                + Row
              </button>
              <button
                onClick={() => insertColumn(0)}
                className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-medium text-slate-700"
              >
                + Col
              </button>
              <button
                onClick={deleteRow}
                className="p-1.5 rounded hover:bg-red-50 text-red-600"
                title="Delete Selected Row"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* AutoSum & Functions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const r = parseInt(selectedCell.replace(/\D/g, ''), 10) || 5;
                  const c = selectedCell.replace(/\d/g, '');
                  const formula = `=SUM(${c}5:${c}${r - 1})`;
                  setFormulaInput(formula);
                  updateCellValue(selectedCell, formula);
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-slate-800 flex items-center gap-1"
              >
                <Calculator className="w-3 h-3 text-[#107C41]" />
                <span>AutoSum</span>
              </button>

              <button
                onClick={() => setIsFormulaWizardOpen(true)}
                className="px-2.5 py-1 bg-[#107C41] text-white hover:bg-emerald-800 rounded text-[11px] font-bold flex items-center gap-1 shadow-xs"
              >
                <Sparkles className="w-3 h-3" />
                <span>Insert Function</span>
              </button>

              <button
                onClick={() => setIsFindReplaceOpen(true)}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                title="Find and Replace"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}

        {/* INSERT TAB */}
        {activeRibbon === 'insert' && (
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsChartModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#107C41] text-white rounded-lg font-bold text-xs hover:bg-emerald-800 flex items-center gap-1.5 shadow-sm"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Insert Column / Bar Chart</span>
            </button>

            <button
              onClick={() => setIsChartModalOpen(true)}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5"
            >
              <LineChart className="w-4 h-4 text-blue-600" />
              <span>Insert Line Trend Graph</span>
            </button>

            <button
              onClick={() => setIsChartModalOpen(true)}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5"
            >
              <PieChart className="w-4 h-4 text-amber-600" />
              <span>Insert Pie / Grade Distribution Chart</span>
            </button>

            <button
              onClick={() => setIsFormulaWizardOpen(true)}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4 text-purple-600" />
              <span>Function Library</span>
            </button>
          </div>
        )}

        {/* FORMULAS TAB */}
        {activeRibbon === 'formulas' && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700 text-xs">Zambian School Formulas:</span>

            <button
              onClick={() => {
                const r = selectedCell.replace(/\D/g, '') || '5';
                const formula = `=ECZ_GRADE(G${r})`;
                setFormulaInput(formula);
                updateCellValue(selectedCell, formula);
              }}
              className="px-2.5 py-1 bg-[#107C41] text-white rounded font-mono text-[11px] font-bold hover:bg-emerald-800"
            >
              =ECZ_GRADE(G{selectedCell.replace(/\D/g, '') || '5'})
            </button>

            <button
              onClick={() => {
                const r = selectedCell.replace(/\D/g, '') || '5';
                const formula = `=WEIGHTED_CA(C${r}, D${r}, E${r}, F${r})`;
                setFormulaInput(formula);
                updateCellValue(selectedCell, formula);
              }}
              className="px-2.5 py-1 bg-white border border-slate-300 text-slate-800 rounded font-mono text-[11px] font-bold hover:bg-emerald-50"
            >
              =WEIGHTED_CA(t1, t2, t3, exam)
            </button>

            <button
              onClick={() => {
                const r = selectedCell.replace(/\D/g, '') || '5';
                const formula = `=STUDENT_NO(B${r}, ${academicYear})`;
                setFormulaInput(formula);
                updateCellValue(selectedCell, formula);
              }}
              className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded font-mono text-[11px] font-bold hover:bg-emerald-100 flex items-center gap-1"
              title="Insert dynamic Zambian Student Registration Number formula"
            >
              <Hash className="w-3 h-3 text-emerald-700" />
              <span>=STUDENT_NO(B{selectedCell.replace(/\D/g, '') || '5'}, {academicYear})</span>
            </button>

            <button
              onClick={() => {
                const r = parseInt(selectedCell.replace(/\D/g, ''), 10) || 5;
                const c = selectedCell.replace(/\d/g, '');
                const formula = `=AVERAGE(${c}5:${c}${r - 1})`;
                setFormulaInput(formula);
                updateCellValue(selectedCell, formula);
              }}
              className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-[11px] hover:bg-slate-100"
            >
              =AVERAGE(col_range)
            </button>

            <button
              onClick={() => {
                const r = parseInt(selectedCell.replace(/\D/g, ''), 10) || 5;
                const c = selectedCell.replace(/\d/g, '');
                const formula = `=MAX(${c}5:${c}${r - 1})`;
                setFormulaInput(formula);
                updateCellValue(selectedCell, formula);
              }}
              className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-[11px] hover:bg-slate-100"
            >
              =MAX(col_range)
            </button>

            <button
              onClick={() => setIsFormulaWizardOpen(true)}
              className="px-3 py-1 bg-purple-600 text-white rounded font-bold text-[11px] hover:bg-purple-700 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Full Function Catalog</span>
            </button>
          </div>
        )}

        {/* DATA TAB */}
        {activeRibbon === 'data' && (
          <div className="flex items-center gap-3 flex-wrap">
            {/* Quick Add Learner Button */}
            <button
              onClick={() => setIsQuickAddStudentOpen(true)}
              className="px-3 py-1.5 bg-amber-500 text-white rounded-lg font-bold text-xs hover:bg-amber-600 flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Quick Add Learner</span>
            </button>

            {/* Academic Year Control */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-300">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Year:</span>
              <select
                value={academicYear}
                onChange={(e) => handleBatchUpdateYear(e.target.value)}
                className="bg-transparent text-xs font-bold text-emerald-800 focus:outline-none cursor-pointer"
              >
                {['2024', '2025', '2026', '2027', '2028', '2029', '2030'].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-Gen Student Number Toggle */}
            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <input
                type="checkbox"
                checked={autoGenStudentNumbers}
                onChange={(e) => setAutoGenStudentNumbers(e.target.checked)}
                className="rounded text-[#107C41] focus:ring-[#107C41]"
              />
              <span className="font-semibold text-emerald-900">Auto Student Numbers (STU-{academicYear}-XXX)</span>
            </label>

            {/* Class Selector for student import */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-300">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Class:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-transparent text-xs font-semibold focus:outline-none"
              >
                {currentSchool.classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} (Gr {cls.grade})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                const updated = EXCEL_TEMPLATES[0].generate(currentSchool, currentUser, allUsers);
                setSheets((prev) => prev.map((s) => (s.id === activeSheetId ? { ...s, data: updated.data } : s)));
                setSyncStatus(`Imported ${classStudents.length || 8} students from ${selectedClass?.name || 'Class'}`);
                setTimeout(() => setSyncStatus(null), 4000);
              }}
              className="px-3 py-1.5 bg-[#107C41] text-white rounded-lg font-bold text-xs hover:bg-emerald-800 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Enrolled Learners</span>
            </button>

            <button
              onClick={() => sortColumn('asc')}
              className="px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 flex items-center gap-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Sort A to Z</span>
            </button>

            <button
              onClick={() => sortColumn('desc')}
              className="px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 flex items-center gap-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Sort Z to A</span>
            </button>
          </div>
        )}

        {/* REVIEW & VIEW TAB */}
        {activeRibbon === 'review' && (
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showGridlines}
                onChange={(e) => setShowGridlines(e.target.checked)}
                className="rounded text-[#107C41] focus:ring-[#107C41]"
              />
              <span>Gridlines</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showHeadings}
                onChange={(e) => setShowHeadings(e.target.checked)}
                className="rounded text-[#107C41] focus:ring-[#107C41]"
              />
              <span>Headings (A-Z & 1-50)</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showFormulaBar}
                onChange={(e) => setShowFormulaBar(e.target.checked)}
                className="rounded text-[#107C41] focus:ring-[#107C41]"
              />
              <span>Formula Bar</span>
            </label>

            <div className="flex items-center gap-1 border-l border-slate-300 pl-3">
              <span className="text-[10px] font-bold text-slate-500">Zoom:</span>
              {[75, 100, 125].map((z) => (
                <button
                  key={z}
                  onClick={() => setZoomLevel(z)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    zoomLevel === z ? 'bg-[#107C41] text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {z}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeRibbon === 'templates' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {EXCEL_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  const generated = tmpl.generate(currentSchool, currentUser, allUsers);
                  setSheets((prev) => {
                    const exists = prev.find((s) => s.id === generated.id);
                    if (exists) {
                      return prev.map((s) => (s.id === generated.id ? generated : s));
                    }
                    return [...prev, generated];
                  });
                  setActiveSheetId(generated.id);
                  setSyncStatus(`Loaded template: ${tmpl.name}`);
                  setTimeout(() => setSyncStatus(null), 3000);
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:border-emerald-300 flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#107C41]" />
                <span>{tmpl.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. FORMULA BAR */}
      {showFormulaBar && (
        <div className="bg-white border-b border-slate-300 px-4 py-1.5 flex items-center gap-2 text-xs select-none">
          {/* Name Box */}
          <div className="w-16 font-mono font-bold text-slate-800 bg-slate-100 border border-slate-300 px-2 py-1 rounded text-center">
            {selectedCell}
          </div>

          {/* Action buttons */}
          <button
            onClick={() => {
              const cell = activeSheet.data[selectedCell];
              setFormulaInput(cell?.formula || cell?.value || '');
            }}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500"
            title="Cancel edit"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => updateCellValue(selectedCell, formulaInput)}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-emerald-600"
            title="Commit formula"
          >
            <Check className="w-3.5 h-3.5" />
          </button>

          {/* fx Function Wizard button */}
          <button
            onClick={() => setIsFormulaWizardOpen(true)}
            className="px-2 py-0.5 rounded text-slate-600 hover:bg-emerald-50 hover:text-[#107C41] font-serif italic text-sm font-bold flex items-center gap-0.5"
            title="Insert Function Dialog"
          >
            fx
          </button>

          {/* Formula text input */}
          <input
            type="text"
            value={formulaInput}
            onChange={(e) => {
              setFormulaInput(e.target.value);
              updateCellValue(selectedCell, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const parsed = parseCellRef(selectedCell);
                if (parsed) {
                  setSelectedCell(`${parsed.col}${parsed.row + 1}`);
                  setSelectedRange([`${parsed.col}${parsed.row + 1}`]);
                }
              }
            }}
            placeholder="Enter formula or value (e.g. =SUM(C5:C10) or =ECZ_GRADE(G5))"
            className="flex-1 px-3 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#107C41] focus:outline-none"
          />
        </div>
      )}

      {/* SYNC NOTIFICATION BANNER */}
      {syncStatus && (
        <div className="bg-emerald-100 border-b border-emerald-300 text-emerald-900 px-4 py-2 text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* 5. SPREADSHEET GRID VIEW */}
      <div
        className="overflow-auto bg-slate-100 flex-1 max-h-[560px] relative select-none"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
      >
        <table className={`border-collapse table-fixed text-xs bg-white ${!showGridlines ? 'no-grid' : ''}`}>
          {/* COLUMN HEADERS */}
          {showHeadings && (
            <thead>
              <tr className="bg-[#F3F2F1] text-slate-600 font-semibold sticky top-0 z-20">
                {/* Top-Left Corner Box */}
                <th className="w-12 h-7 border border-slate-300 bg-[#E1DFDD] text-center text-[10px] sticky left-0 z-30"></th>
                {Array.from({ length: activeSheet.colCount }).map((_, cIdx) => {
                  const colLetter = colIndexToLetter(cIdx);
                  const isColSelected = selectedCell.startsWith(colLetter);

                  return (
                    <th
                      key={colLetter}
                      className={`h-7 border border-slate-300 px-2 text-center text-[11px] select-none ${
                        isColSelected ? 'bg-[#D2E7D6] text-[#107C41] font-bold' : ''
                      }`}
                      style={{
                        width: colLetter === 'A' ? 120 : colLetter === 'B' ? 200 : colLetter === 'I' ? 260 : 105,
                      }}
                    >
                      {colLetter}
                    </th>
                  );
                })}
              </tr>
            </thead>
          )}

          {/* GRID ROWS */}
          <tbody>
            {Array.from({ length: activeSheet.rowCount }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              const isRowSelected = selectedCell.endsWith(String(rowNum));

              return (
                <tr key={rowNum}>
                  {/* Row Number header */}
                  {showHeadings && (
                    <td
                      className={`w-12 h-6 border border-slate-300 text-center text-[11px] font-medium sticky left-0 z-10 select-none ${
                        isRowSelected ? 'bg-[#D2E7D6] text-[#107C41] font-bold' : 'bg-[#F3F2F1] text-slate-600'
                      }`}
                    >
                      {rowNum}
                    </td>
                  )}

                  {/* Cell items */}
                  {Array.from({ length: activeSheet.colCount }).map((_, cIdx) => {
                    const colLetter = colIndexToLetter(cIdx);
                    const cellKey = `${colLetter}${rowNum}`;
                    const cellData = activeSheet.data[cellKey];
                    const isSelected = selectedCell === cellKey;
                    const isInRange = selectedRange.includes(cellKey);

                    // Formatted display value
                    const displayValue = formatCellValue(cellData?.value || '', cellData);

                    return (
                      <td
                        key={cellKey}
                        onClick={(e) => {
                          if (e.shiftKey) {
                            setSelectedRange(expandRange(`${selectedCell}:${cellKey}`));
                          } else {
                            setSelectedCell(cellKey);
                            setSelectedRange([cellKey]);
                          }
                        }}
                        onDoubleClick={() => {
                          setSelectedCell(cellKey);
                          setSelectedRange([cellKey]);
                          setIsInlineEditing(true);
                        }}
                        className={`h-6 border border-slate-300 px-2 text-[11px] truncate relative cursor-cell transition-colors ${
                          isSelected
                            ? 'ring-2 ring-[#107C41] ring-inset z-5 bg-emerald-50/40 font-semibold'
                            : isInRange
                            ? 'bg-emerald-100/50'
                            : 'hover:bg-slate-50'
                        } ${cellData?.border === 'thick' ? 'border-b-2 border-b-slate-900' : ''}`}
                        style={{
                          backgroundColor: cellData?.bg,
                          color: cellData?.color,
                          fontWeight: cellData?.bold ? 'bold' : 'normal',
                          fontStyle: cellData?.italic ? 'italic' : 'normal',
                          textDecoration: `${cellData?.underline ? 'underline' : ''} ${
                            cellData?.strikethrough ? 'line-through' : ''
                          }`.trim(),
                          textAlign: cellData?.align || 'left',
                          fontFamily: cellData?.fontFamily || 'Calibri',
                          fontSize: cellData?.fontSize ? `${cellData.fontSize}px` : undefined,
                        }}
                      >
                        {isSelected && isInlineEditing ? (
                          <input
                            type="text"
                            autoFocus
                            value={formulaInput}
                            onChange={(e) => {
                              setFormulaInput(e.target.value);
                              updateCellValue(cellKey, e.target.value);
                            }}
                            onBlur={() => setIsInlineEditing(false)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === 'Tab') {
                                setIsInlineEditing(false);
                                const parsed = parseCellRef(selectedCell);
                                if (parsed) {
                                  setSelectedCell(`${parsed.col}${parsed.row + 1}`);
                                }
                              }
                            }}
                            className="absolute inset-0 w-full h-full px-2 text-xs font-mono bg-white outline-none border-2 border-[#107C41] z-30"
                          />
                        ) : (
                          displayValue
                        )}

                        {/* Excel corner grab handle */}
                        {isSelected && (
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#107C41] border border-white z-10" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 6. BOTTOM SHEET TABS BAR */}
      <div className="bg-[#F3F2F1] border-t border-slate-300 px-3 py-1.5 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-1 overflow-x-auto">
          {sheets.map((sheet) => (
            <div key={sheet.id} className="flex items-center group relative">
              <button
                onClick={() => setActiveSheetId(sheet.id)}
                className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeSheetId === sheet.id
                    ? 'bg-white text-[#107C41] shadow-2xs font-bold border-b-2 border-b-[#107C41]'
                    : 'hover:bg-slate-200 text-slate-600'
                }`}
              >
                {sheet.tabColor && (
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sheet.tabColor }} />
                )}
                <span>{sheet.name}</span>
              </button>

              {activeSheetId === sheet.id && (
                <button
                  onClick={() => {
                    const newName = prompt('Enter new sheet name:', sheet.name);
                    if (newName && newName.trim()) {
                      setSheets((prev) =>
                        prev.map((s) => (s.id === sheet.id ? { ...s, name: newName.trim() } : s))
                      );
                    }
                  }}
                  className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"
                  title="Rename Sheet"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ))}

          {/* Add Sheet button */}
          <button
            onClick={handleAddNewSheet}
            className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
            title="Add New Sheet"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Add Learners Sheet shortcut */}
          <button
            onClick={handleAddLearnerSheet}
            className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded text-[11px] font-bold flex items-center gap-1 transition"
            title="Add/Open Learner Enrollment Registry Sheet"
          >
            <UserPlus className="w-3 h-3 text-emerald-700" />
            <span>+ Learners Sheet</span>
          </button>
        </div>

        {/* STATUS METRICS */}
        <div className="flex items-center gap-4 text-[11px] text-slate-600 font-medium">
          {selectionStats.count > 1 && (
            <div className="hidden sm:flex items-center gap-3 bg-slate-200 px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold text-slate-800">
              <span>Count: {selectionStats.count}</span>
              {selectionStats.numericCount > 0 && (
                <>
                  <span>Sum: {selectionStats.sum}</span>
                  <span>Average: {selectionStats.average}</span>
                  <span>Min: {selectionStats.min}</span>
                  <span>Max: {selectionStats.max}</span>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="hidden md:inline">Ready &bull; Auto-Calc Active</span>
            <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">
              {zoomLevel}%
            </span>
          </div>
        </div>
      </div>

      {/* FORMULA WIZARD MODAL */}
      <FormulaWizardModal
        isOpen={isFormulaWizardOpen}
        onClose={() => setIsFormulaWizardOpen(false)}
        onSelectFormula={(syntax) => {
          setFormulaInput(syntax);
          updateCellValue(selectedCell, syntax);
        }}
        currentCell={selectedCell}
      />

      {/* DYNAMIC CHART MODAL */}
      <ExcelChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        sheet={activeSheet}
      />

      {/* FIND AND REPLACE MODAL */}
      <FindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        sheet={activeSheet}
        onReplace={handleFindReplace}
        onSelectCell={(k) => {
          setSelectedCell(k);
          setSelectedRange([k]);
        }}
      />
    </div>
  );
};
