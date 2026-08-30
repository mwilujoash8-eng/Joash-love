import { calculateEczGrade } from '../../../mockData';

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  fontFamily?: string;
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  bg?: string;
  color?: string;
  format?: 'general' | 'number' | 'currency' | 'percent' | 'date' | 'text' | 'accounting';
  decimals?: number;
  border?: 'none' | 'all' | 'thick' | 'bottom' | 'top_bottom' | 'box';
  wrap?: boolean;
}

export interface CellData extends CellStyle {
  value: string;
  formula?: string;
  calculatedValue?: string;
}

export interface SheetData {
  id: string;
  name: string;
  data: Record<string, CellData>;
  rowCount: number;
  colCount: number;
  tabColor?: string;
}

export const COL_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'
];

/** Convert column index (0-based) to letter A, B, ... Z, AA, etc. */
export function colIndexToLetter(idx: number): string {
  if (idx < 26) return COL_LETTERS[idx];
  const first = Math.floor(idx / 26) - 1;
  const second = idx % 26;
  return `${COL_LETTERS[first]}${COL_LETTERS[second]}`;
}

/** Convert letter A, B, etc. to 0-based column index */
export function colLetterToIndex(letter: string): number {
  const upper = letter.toUpperCase().trim();
  if (upper.length === 1) {
    return COL_LETTERS.indexOf(upper);
  }
  if (upper.length === 2) {
    const first = COL_LETTERS.indexOf(upper[0]);
    const second = COL_LETTERS.indexOf(upper[1]);
    return (first + 1) * 26 + second;
  }
  return 0;
}

/** Parse a cell reference like 'B5' into { col: 'B', colIdx: 1, row: 5 } */
export function parseCellRef(ref: string): { col: string; colIdx: number; row: number } | null {
  const match = ref.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  const col = match[1];
  const row = parseInt(match[2], 10);
  return { col, colIdx: colLetterToIndex(col), row };
}

/** Expand range 'C5:C10' or 'A1:B3' into list of cell keys ['C5', 'C6', ..., 'C10'] */
export function expandRange(rangeStr: string): string[] {
  const parts = rangeStr.trim().toUpperCase().split(':');
  if (parts.length === 1) {
    return [parts[0]];
  }
  if (parts.length === 2) {
    const start = parseCellRef(parts[0]);
    const end = parseCellRef(parts[1]);
    if (!start || !end) return [parts[0], parts[1]];

    const minCol = Math.min(start.colIdx, end.colIdx);
    const maxCol = Math.max(start.colIdx, end.colIdx);
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);

    const cells: string[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        cells.push(`${colIndexToLetter(c)}${r}`);
      }
    }
    return cells;
  }
  return [];
}

/** Format a raw numeric or text string according to cell format */
export function formatCellValue(raw: string, style?: CellStyle): string {
  if (!raw || raw === '') return '';
  if (!style || !style.format || style.format === 'general') return raw;

  const num = parseFloat(raw.replace(/[%,K$\s]/g, ''));
  if (isNaN(num)) return raw;

  const decimals = style.decimals !== undefined ? style.decimals : 2;

  switch (style.format) {
    case 'number':
      return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    case 'currency':
      return `K ${num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;
    case 'accounting':
      return `ZMW ${num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;
    case 'percent':
      return `${(num > 1 && !raw.includes('%') ? num : num <= 1 ? num * 100 : num).toFixed(decimals)}%`;
    case 'date':
      try {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) return d.toLocaleDateString('en-GB');
      } catch {
        // fallback
      }
      return raw;
    case 'text':
      return String(raw);
    default:
      return raw;
  }
}

/** Helper: extract numeric value safely */
function extractNumeric(raw: string): number {
  if (!raw) return 0;
  const cleaned = String(raw).replace(/[%,K$ZMW\s]/gi, '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

/** Main Formula Evaluator Engine */
export function evaluateFormula(formula: string, sheetData: Record<string, CellData>): string {
  if (!formula || !formula.startsWith('=')) {
    return formula || '';
  }

  const expr = formula.substring(1).trim();
  const upper = expr.toUpperCase();

  try {
    // 1. =SUM(...)
    if (upper.startsWith('SUM(') && upper.endsWith(')')) {
      const inner = expr.substring(4, expr.length - 1);
      const cells = inner.split(',').flatMap((p) => expandRange(p.trim()));
      let sum = 0;
      cells.forEach((k) => {
        const raw = getCalculatedVal(k, sheetData);
        const val = extractNumeric(raw);
        if (!isNaN(val)) sum += val;
      });
      return String(roundTo(sum, 4));
    }

    // 2. =AVERAGE(...)
    if (upper.startsWith('AVERAGE(') && upper.endsWith(')')) {
      const inner = expr.substring(8, expr.length - 1);
      const cells = inner.split(',').flatMap((p) => expandRange(p.trim()));
      let sum = 0;
      let count = 0;
      cells.forEach((k) => {
        const raw = getCalculatedVal(k, sheetData);
        if (raw !== '') {
          const val = extractNumeric(raw);
          if (!isNaN(val)) {
            sum += val;
            count++;
          }
        }
      });
      return count > 0 ? String(roundTo(sum / count, 2)) : '0';
    }

    // 3. =COUNT(...)
    if (upper.startsWith('COUNT(') && upper.endsWith(')')) {
      const inner = expr.substring(6, expr.length - 1);
      const cells = inner.split(',').flatMap((p) => expandRange(p.trim()));
      let count = 0;
      cells.forEach((k) => {
        const raw = getCalculatedVal(k, sheetData);
        if (raw !== '' && !isNaN(extractNumeric(raw))) count++;
      });
      return String(count);
    }

    // 4. =COUNTA(...)
    if (upper.startsWith('COUNTA(') && upper.endsWith(')')) {
      const inner = expr.substring(7, expr.length - 1);
      const cells = inner.split(',').flatMap((p) => expandRange(p.trim()));
      let count = 0;
      cells.forEach((k) => {
        const val = getCalculatedVal(k, sheetData).trim();
        if (val !== '') count++;
      });
      return String(count);
    }

    // 5. =MAX(...)
    if (upper.startsWith('MAX(') && upper.endsWith(')')) {
      const inner = expr.substring(4, expr.length - 1);
      const cells = inner.split(',').flatMap((p) => expandRange(p.trim()));
      let max: number | null = null;
      cells.forEach((k) => {
        const raw = getCalculatedVal(k, sheetData);
        if (raw !== '') {
          const val = extractNumeric(raw);
          if (max === null || val > max) max = val;
        }
      });
      return max !== null ? String(roundTo(max, 4)) : '0';
    }

    // 6. =MIN(...)
    if (upper.startsWith('MIN(') && upper.endsWith(')')) {
      const inner = expr.substring(4, expr.length - 1);
      const cells = inner.split(',').flatMap((p) => expandRange(p.trim()));
      let min: number | null = null;
      cells.forEach((k) => {
        const raw = getCalculatedVal(k, sheetData);
        if (raw !== '') {
          const val = extractNumeric(raw);
          if (min === null || val < min) min = val;
        }
      });
      return min !== null ? String(roundTo(min, 4)) : '0';
    }

    // 7. =MEDIAN(...)
    if (upper.startsWith('MEDIAN(') && upper.endsWith(')')) {
      const inner = expr.substring(7, expr.length - 1);
      const cells = inner.split(',').flatMap((p) => expandRange(p.trim()));
      const nums: number[] = [];
      cells.forEach((k) => {
        const raw = getCalculatedVal(k, sheetData);
        if (raw !== '') {
          const val = extractNumeric(raw);
          if (!isNaN(val)) nums.push(val);
        }
      });
      if (nums.length === 0) return '0';
      nums.sort((a, b) => a - b);
      const mid = Math.floor(nums.length / 2);
      const median = nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      return String(roundTo(median, 2));
    }

    // 8. =STDEV(...)
    if (upper.startsWith('STDEV(') && upper.endsWith(')')) {
      const inner = expr.substring(6, expr.length - 1);
      const cells = inner.split(',').flatMap((p) => expandRange(p.trim()));
      const nums: number[] = [];
      cells.forEach((k) => {
        const raw = getCalculatedVal(k, sheetData);
        if (raw !== '') {
          const val = extractNumeric(raw);
          if (!isNaN(val)) nums.push(val);
        }
      });
      if (nums.length < 2) return '0';
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      const variance = nums.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / (nums.length - 1);
      return String(roundTo(Math.sqrt(variance), 2));
    }

    // 9. =ROUND(val, digits)
    if (upper.startsWith('ROUND(') && upper.endsWith(')')) {
      const inner = expr.substring(6, expr.length - 1);
      const parts = splitTopLevel(inner);
      const val = evaluateSubExpr(parts[0], sheetData);
      const digits = parseInt(parts[1] || '0', 10);
      return String(roundTo(val, digits));
    }

    // 10. =ROUNDUP(val, digits)
    if (upper.startsWith('ROUNDUP(') && upper.endsWith(')')) {
      const inner = expr.substring(8, expr.length - 1);
      const parts = splitTopLevel(inner);
      const val = evaluateSubExpr(parts[0], sheetData);
      const digits = parseInt(parts[1] || '0', 10);
      const factor = Math.pow(10, digits);
      return String(Math.ceil(val * factor) / factor);
    }

    // 11. =ROUNDDOWN(val, digits)
    if (upper.startsWith('ROUNDDOWN(') && upper.endsWith(')')) {
      const inner = expr.substring(10, expr.length - 1);
      const parts = splitTopLevel(inner);
      const val = evaluateSubExpr(parts[0], sheetData);
      const digits = parseInt(parts[1] || '0', 10);
      const factor = Math.pow(10, digits);
      return String(Math.floor(val * factor) / factor);
    }

    // 12. =ECZ_GRADE(pct_or_score)
    if (upper.startsWith('ECZ_GRADE(') && upper.endsWith(')')) {
      const inner = expr.substring(10, expr.length - 1).trim();
      const val = evaluateSubExpr(inner, sheetData);
      const res = calculateEczGrade(val);
      return `${res.gradeLabel} (${res.points} Pts)`;
    }

    // 13. =ECZ_POINTS(pct_or_score)
    if (upper.startsWith('ECZ_POINTS(') && upper.endsWith(')')) {
      const inner = expr.substring(11, expr.length - 1).trim();
      const val = evaluateSubExpr(inner, sheetData);
      const res = calculateEczGrade(val);
      return String(res.points);
    }

    // 14. =WEIGHTED_CA(t1, t2, t3, exam)
    if (upper.startsWith('WEIGHTED_CA(') && upper.endsWith(')')) {
      const inner = expr.substring(12, expr.length - 1);
      const parts = splitTopLevel(inner);
      const t1 = evaluateSubExpr(parts[0], sheetData);
      const t2 = evaluateSubExpr(parts[1], sheetData);
      const t3 = evaluateSubExpr(parts[2], sheetData);
      const exam = evaluateSubExpr(parts[3], sheetData);
      const caTotal = t1 + t2 + t3; // out of 60
      const weighted = ((caTotal / 60) * 40) + ((exam / 100) * 60);
      return `${Math.round(weighted)}%`;
    }

    // 14b. =STUDENT_NO([ref_or_row], [year])
    if ((upper.startsWith('STUDENT_NO(') || upper.startsWith('AUTO_STUDENT_NO(') || upper.startsWith('STUDENT_ID(')) && upper.endsWith(')')) {
      const startIdx = upper.indexOf('(') + 1;
      const inner = expr.substring(startIdx, expr.length - 1);
      const parts = splitTopLevel(inner);
      let rowNum = 1;
      let yr = new Date().getFullYear().toString();

      if (parts[0] && parts[0].trim()) {
        const arg1 = parts[0].trim().replace(/^["']|["']$/g, '');
        const parsed = parseCellRef(arg1);
        if (parsed) {
          rowNum = parsed.row >= 5 ? parsed.row - 4 : parsed.row;
        } else {
          const num = parseInt(arg1, 10);
          if (!isNaN(num)) rowNum = num;
        }
      }

      if (parts[1] && parts[1].trim()) {
        const arg2 = parts[1].trim().replace(/^["']|["']$/g, '');
        const numYr = parseInt(arg2, 10);
        if (!isNaN(numYr) && numYr > 1900 && numYr < 2100) {
          yr = String(numYr);
        }
      }

      const padded = String(Math.max(1, rowNum)).padStart(3, '0');
      return `STU-${yr}-${padded}`;
    }

    // 15. =IF(cond, true_val, false_val)
    if (upper.startsWith('IF(') && upper.endsWith(')')) {
      const inner = expr.substring(3, expr.length - 1);
      const parts = splitTopLevel(inner);
      if (parts.length >= 2) {
        const condResult = evaluateCondition(parts[0], sheetData);
        if (condResult) {
          return cleanFormulaResult(parts[1], sheetData);
        } else {
          return parts[2] !== undefined ? cleanFormulaResult(parts[2], sheetData) : '';
        }
      }
    }

    // 16. =COUNTIF(range, criteria)
    if (upper.startsWith('COUNTIF(') && upper.endsWith(')')) {
      const inner = expr.substring(8, expr.length - 1);
      const parts = splitTopLevel(inner);
      const cells = expandRange(parts[0].trim());
      const criteria = parts[1] ? parts[1].trim().replace(/^["']|["']$/g, '') : '';
      let count = 0;
      cells.forEach((k) => {
        const cellVal = getCalculatedVal(k, sheetData);
        if (matchesCriteria(cellVal, criteria)) count++;
      });
      return String(count);
    }

    // 17. =SUMIF(range, criteria, [sum_range])
    if (upper.startsWith('SUMIF(') && upper.endsWith(')')) {
      const inner = expr.substring(6, expr.length - 1);
      const parts = splitTopLevel(inner);
      const rangeCells = expandRange(parts[0].trim());
      const criteria = parts[1] ? parts[1].trim().replace(/^["']|["']$/g, '') : '';
      const sumCells = parts[2] ? expandRange(parts[2].trim()) : rangeCells;
      let sum = 0;
      rangeCells.forEach((k, idx) => {
        const cellVal = getCalculatedVal(k, sheetData);
        if (matchesCriteria(cellVal, criteria)) {
          const sumVal = extractNumeric(getCalculatedVal(sumCells[idx] || k, sheetData));
          if (!isNaN(sumVal)) sum += sumVal;
        }
      });
      return String(roundTo(sum, 2));
    }

    // 18. =RANK(val, range, [order])
    if (upper.startsWith('RANK(') && upper.endsWith(')')) {
      const inner = expr.substring(5, expr.length - 1);
      const parts = splitTopLevel(inner);
      const val = evaluateSubExpr(parts[0], sheetData);
      const cells = expandRange(parts[1].trim());
      const order = parts[2] ? parseInt(parts[2].trim(), 10) : 0; // 0 = descending (highest is 1st)

      const values: number[] = [];
      cells.forEach((k) => {
        const raw = getCalculatedVal(k, sheetData);
        if (raw !== '') values.push(extractNumeric(raw));
      });

      if (order === 0) {
        values.sort((a, b) => b - a);
      } else {
        values.sort((a, b) => a - b);
      }
      const rank = values.indexOf(val) + 1;
      return rank > 0 ? String(rank) : '1';
    }

    // 19. =VLOOKUP(val, table_range, col_index, [exact])
    if (upper.startsWith('VLOOKUP(') && upper.endsWith(')')) {
      const inner = expr.substring(8, expr.length - 1);
      const parts = splitTopLevel(inner);
      if (parts.length >= 3) {
        const lookupVal = cleanFormulaResult(parts[0], sheetData).trim().toLowerCase();
        const tableParts = parts[1].trim().split(':');
        if (tableParts.length === 2) {
          const start = parseCellRef(tableParts[0]);
          const end = parseCellRef(tableParts[1]);
          const colOffset = parseInt(parts[2].trim(), 10) - 1;

          if (start && end) {
            for (let r = Math.min(start.row, end.row); r <= Math.max(start.row, end.row); r++) {
              const lookupCell = `${colIndexToLetter(Math.min(start.colIdx, end.colIdx))}${r}`;
              const cellVal = getCalculatedVal(lookupCell, sheetData).trim().toLowerCase();
              if (cellVal === lookupVal || cellVal.includes(lookupVal)) {
                const targetCol = Math.min(start.colIdx, end.colIdx) + colOffset;
                const targetCell = `${colIndexToLetter(targetCol)}${r}`;
                return getCalculatedVal(targetCell, sheetData);
              }
            }
          }
        }
      }
      return '#N/A';
    }

    // 20. =CONCAT(...) or =CONCATENATE(...)
    if ((upper.startsWith('CONCAT(') || upper.startsWith('CONCATENATE(')) && upper.endsWith(')')) {
      const startIdx = upper.startsWith('CONCAT(') ? 7 : 12;
      const inner = expr.substring(startIdx, expr.length - 1);
      const parts = splitTopLevel(inner);
      return parts.map((p) => cleanFormulaResult(p, sheetData)).join('');
    }

    // 21. =UPPER, =LOWER, =TRIM, =LEN, =PROPER
    if (upper.startsWith('UPPER(') && upper.endsWith(')')) {
      const inner = expr.substring(6, expr.length - 1);
      return cleanFormulaResult(inner, sheetData).toUpperCase();
    }
    if (upper.startsWith('LOWER(') && upper.endsWith(')')) {
      const inner = expr.substring(6, expr.length - 1);
      return cleanFormulaResult(inner, sheetData).toLowerCase();
    }
    if (upper.startsWith('TRIM(') && upper.endsWith(')')) {
      const inner = expr.substring(5, expr.length - 1);
      return cleanFormulaResult(inner, sheetData).trim();
    }
    if (upper.startsWith('LEN(') && upper.endsWith(')')) {
      const inner = expr.substring(4, expr.length - 1);
      return String(cleanFormulaResult(inner, sheetData).length);
    }
    if (upper.startsWith('PROPER(') && upper.endsWith(')')) {
      const inner = expr.substring(7, expr.length - 1);
      const str = cleanFormulaResult(inner, sheetData);
      return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
    }

    // 22. =LEFT(text, [n]), =RIGHT(text, [n]), =MID(text, start, [n])
    if (upper.startsWith('LEFT(') && upper.endsWith(')')) {
      const inner = expr.substring(5, expr.length - 1);
      const parts = splitTopLevel(inner);
      const str = cleanFormulaResult(parts[0], sheetData);
      const n = parts[1] ? parseInt(parts[1].trim(), 10) : 1;
      return str.substring(0, n);
    }
    if (upper.startsWith('RIGHT(') && upper.endsWith(')')) {
      const inner = expr.substring(6, expr.length - 1);
      const parts = splitTopLevel(inner);
      const str = cleanFormulaResult(parts[0], sheetData);
      const n = parts[1] ? parseInt(parts[1].trim(), 10) : 1;
      return str.substring(Math.max(0, str.length - n));
    }
    if (upper.startsWith('MID(') && upper.endsWith(')')) {
      const inner = expr.substring(4, expr.length - 1);
      const parts = splitTopLevel(inner);
      const str = cleanFormulaResult(parts[0], sheetData);
      const start = parts[1] ? parseInt(parts[1].trim(), 10) - 1 : 0;
      const len = parts[2] ? parseInt(parts[2].trim(), 10) : str.length;
      return str.substring(start, start + len);
    }

    // 23. =PASS_FAIL(score, [pass_mark])
    if (upper.startsWith('PASS_FAIL(') && upper.endsWith(')')) {
      const inner = expr.substring(10, expr.length - 1);
      const parts = splitTopLevel(inner);
      const score = evaluateSubExpr(parts[0], sheetData);
      const passMark = parts[1] ? evaluateSubExpr(parts[1], sheetData) : 40;
      return score >= passMark ? 'PASS' : 'FAIL';
    }

    // 24. =DIVISION(points)
    if (upper.startsWith('DIVISION(') && upper.endsWith(')')) {
      const inner = expr.substring(9, expr.length - 1);
      const pts = evaluateSubExpr(inner, sheetData);
      if (pts >= 6 && pts <= 12) return 'Division 1 (Distinction)';
      if (pts <= 18) return 'Division 2 (Merit)';
      if (pts <= 24) return 'Division 3 (Credit)';
      if (pts <= 34) return 'Division 4 (Pass)';
      return 'Division 0 (Unsatisfactory)';
    }

    // 25. =TODAY() & =NOW()
    if (upper === 'TODAY()') {
      return new Date().toLocaleDateString('en-GB');
    }
    if (upper === 'NOW()') {
      return new Date().toLocaleString('en-GB');
    }

    // 26. =ABS(x), =SQRT(x), =POWER(b, e), =PRODUCT(...)
    if (upper.startsWith('ABS(') && upper.endsWith(')')) {
      const inner = expr.substring(4, expr.length - 1);
      return String(Math.abs(evaluateSubExpr(inner, sheetData)));
    }
    if (upper.startsWith('SQRT(') && upper.endsWith(')')) {
      const inner = expr.substring(5, expr.length - 1);
      return String(roundTo(Math.sqrt(evaluateSubExpr(inner, sheetData)), 4));
    }
    if (upper.startsWith('POWER(') && upper.endsWith(')')) {
      const inner = expr.substring(6, expr.length - 1);
      const parts = splitTopLevel(inner);
      return String(Math.pow(evaluateSubExpr(parts[0], sheetData), evaluateSubExpr(parts[1], sheetData)));
    }
    if (upper.startsWith('PRODUCT(') && upper.endsWith(')')) {
      const inner = expr.substring(8, expr.length - 1);
      const cells = inner.split(',').flatMap((p) => expandRange(p.trim()));
      let prod = 1;
      cells.forEach((k) => {
        const raw = getCalculatedVal(k, sheetData);
        const val = extractNumeric(raw);
        if (!isNaN(val)) prod *= val;
      });
      return String(roundTo(prod, 4));
    }

    // 27. =AND(...), =OR(...), =NOT(...)
    if (upper.startsWith('AND(') && upper.endsWith(')')) {
      const inner = expr.substring(4, expr.length - 1);
      const parts = splitTopLevel(inner);
      const allTrue = parts.every((p) => evaluateCondition(p, sheetData));
      return allTrue ? 'TRUE' : 'FALSE';
    }
    if (upper.startsWith('OR(') && upper.endsWith(')')) {
      const inner = expr.substring(3, expr.length - 1);
      const parts = splitTopLevel(inner);
      const anyTrue = parts.some((p) => evaluateCondition(p, sheetData));
      return anyTrue ? 'TRUE' : 'FALSE';
    }
    if (upper.startsWith('NOT(') && upper.endsWith(')')) {
      const inner = expr.substring(4, expr.length - 1);
      return !evaluateCondition(inner, sheetData) ? 'TRUE' : 'FALSE';
    }

    // 28. Standard arithmetic evaluation fallback e.g. (C5+D5+E5)/3 or A1*100
    return String(evaluateMathExpression(expr, sheetData));
  } catch (err) {
    return '#ERROR!';
  }
}

/** Get cell value or calculated value */
function getCalculatedVal(cellKey: string, sheetData: Record<string, CellData>): string {
  const cell = sheetData[cellKey];
  if (!cell) return '';
  if (cell.value !== undefined) {
    return String(cell.value);
  }
  return '';
}

function roundTo(num: number, digits: number): number {
  const factor = Math.pow(10, digits);
  return Math.round(num * factor) / factor;
}

/** Split by comma at the top parenthesis level */
function splitTopLevel(str: string): string[] {
  const results: string[] = [];
  let current = '';
  let parenDepth = 0;
  let inQuote = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' || char === "'") inQuote = !inQuote;
    if (!inQuote) {
      if (char === '(') parenDepth++;
      else if (char === ')') parenDepth--;
      else if (char === ',' && parenDepth === 0) {
        results.push(current.trim());
        current = '';
        continue;
      }
    }
    current += char;
  }
  if (current.trim()) results.push(current.trim());
  return results;
}

/** Evaluate sub-expression to number */
function evaluateSubExpr(expr: string, sheetData: Record<string, CellData>): number {
  if (!expr) return 0;
  const clean = expr.trim();
  const cellRef = parseCellRef(clean);
  if (cellRef) {
    const v = getCalculatedVal(clean.toUpperCase(), sheetData);
    return extractNumeric(v);
  }
  if (clean.startsWith('=')) {
    const v = evaluateFormula(clean, sheetData);
    return extractNumeric(v);
  }
  const directNum = parseFloat(clean.replace(/[%,K$ZMW\s]/gi, ''));
  if (!isNaN(directNum)) return directNum;

  return evaluateMathExpression(clean, sheetData);
}

/** Clean a formula string parameter (remove quotes or resolve cell) */
function cleanFormulaResult(str: string, sheetData: Record<string, CellData>): string {
  if (!str) return '';
  const trimmed = str.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.substring(1, trimmed.length - 1);
  }
  const cellRef = parseCellRef(trimmed);
  if (cellRef) {
    return getCalculatedVal(trimmed.toUpperCase(), sheetData);
  }
  if (trimmed.startsWith('=')) {
    return evaluateFormula(trimmed, sheetData);
  }
  return trimmed;
}

/** Evaluate boolean condition like 'G5>=50' or 'A1="Pass"' */
function evaluateCondition(condStr: string, sheetData: Record<string, CellData>): boolean {
  if (!condStr) return false;
  const operators = ['>=', '<=', '<>', '!=', '==', '>', '<', '='];
  let op = '';
  for (const o of operators) {
    if (condStr.includes(o)) {
      op = o;
      break;
    }
  }

  if (!op) {
    const val = evaluateSubExpr(condStr, sheetData);
    return Boolean(val);
  }

  const parts = condStr.split(op);
  const left = cleanFormulaResult(parts[0], sheetData);
  const right = cleanFormulaResult(parts[1], sheetData);

  const leftNum = parseFloat(left.replace(/[%,K$ZMW\s]/gi, ''));
  const rightNum = parseFloat(right.replace(/[%,K$ZMW\s]/gi, ''));

  const isNumeric = !isNaN(leftNum) && !isNaN(rightNum);

  switch (op) {
    case '>=':
      return isNumeric ? leftNum >= rightNum : left >= right;
    case '<=':
      return isNumeric ? leftNum <= rightNum : left <= right;
    case '>':
      return isNumeric ? leftNum > rightNum : left > right;
    case '<':
      return isNumeric ? leftNum < rightNum : left < right;
    case '<>':
    case '!=':
      return isNumeric ? leftNum !== rightNum : left !== right;
    case '=':
    case '==':
      return isNumeric ? leftNum === rightNum : left.toLowerCase() === right.toLowerCase();
    default:
      return false;
  }
}

/** Matches criteria string like '>=50', '<20', 'Distinction', '*text*' */
function matchesCriteria(val: string, criteria: string): boolean {
  if (!criteria) return true;
  if (criteria.startsWith('>=') || criteria.startsWith('<=') || criteria.startsWith('>') || criteria.startsWith('<') || criteria.startsWith('=')) {
    const opMatch = criteria.match(/^([><=]+)(.+)$/);
    if (opMatch) {
      const op = opMatch[1];
      const target = parseFloat(opMatch[2]);
      const v = extractNumeric(val);
      if (isNaN(v) || isNaN(target)) return false;
      if (op === '>=') return v >= target;
      if (op === '<=') return v <= target;
      if (op === '>') return v > target;
      if (op === '<') return v < target;
      if (op === '=') return v === target;
    }
  }
  return val.trim().toLowerCase() === criteria.trim().toLowerCase();
}

/** Safe arithmetic solver with cell references e.g. (C5 + D5) * 0.4 */
function evaluateMathExpression(expr: string, sheetData: Record<string, CellData>): number {
  try {
    // Replace cell references with numbers
    const replaced = expr.replace(/[A-Z]+\d+/g, (match) => {
      const val = getCalculatedVal(match, sheetData);
      const num = extractNumeric(val);
      return isNaN(num) ? '0' : String(num);
    });

    // Sanitize for only math chars
    const sanitized = replaced.replace(/[^0-9+\-*/().]/g, '');
    if (!sanitized) return 0;

    // eslint-disable-next-line no-new-func
    const result = Function(`'use strict'; return (${sanitized})`)();
    return typeof result === 'number' && !isNaN(result) ? roundTo(result, 4) : 0;
  } catch {
    return 0;
  }
}
