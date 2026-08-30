import React, { useState } from 'react';
import { Search, X, Check, Calculator, Sparkles, BookOpen } from 'lucide-react';

export interface FormulaDoc {
  name: string;
  category: 'Math' | 'Stats' | 'Logical' | 'ECZ Zambia' | 'Text' | 'Date';
  syntax: string;
  example: string;
  description: string;
}

export const FORMULA_CATALOG: FormulaDoc[] = [
  {
    name: 'SUM',
    category: 'Math',
    syntax: '=SUM(range)',
    example: '=SUM(C5:C12)',
    description: 'Calculates the total sum of all numeric values across the specified cell range or comma-separated list of cells.',
  },
  {
    name: 'AVERAGE',
    category: 'Stats',
    syntax: '=AVERAGE(range)',
    example: '=AVERAGE(F5:F12)',
    description: 'Calculates the arithmetic mean of all numeric cells within the designated range.',
  },
  {
    name: 'ECZ_GRADE',
    category: 'ECZ Zambia',
    syntax: '=ECZ_GRADE(percent_or_score)',
    example: '=ECZ_GRADE(G5)',
    description: 'Evaluates a student percentage or composite score and automatically assigns the official ECZ grade label and points (Distinction 1/2, Merit 3/4, Credit 5/6, Pass 7/8, Unsatisfactory 9).',
  },
  {
    name: 'WEIGHTED_CA',
    category: 'ECZ Zambia',
    syntax: '=WEIGHTED_CA(test1, test2, test3, exam)',
    example: '=WEIGHTED_CA(C5, D5, E5, F5)',
    description: 'Calculates the official Zambian Continuous Assessment composite percentage by combining 40% Continuous Assessment (Tests 1, 2, and 3 out of 60) with 60% Final Examination (out of 100).',
  },
  {
    name: 'ECZ_POINTS',
    category: 'ECZ Zambia',
    syntax: '=ECZ_POINTS(percent_cell)',
    example: '=ECZ_POINTS(G5)',
    description: 'Returns the numerical ECZ points (1 to 9) for national examination ranking.',
  },
  {
    name: 'DIVISION',
    category: 'ECZ Zambia',
    syntax: '=DIVISION(points_total)',
    example: '=DIVISION(H5)',
    description: 'Calculates official Zambian Secondary Division (Division 1, 2, 3, 4, or 0) based on cumulative aggregate subject points.',
  },
  {
    name: 'PASS_FAIL',
    category: 'ECZ Zambia',
    syntax: '=PASS_FAIL(score, [pass_mark])',
    example: '=PASS_FAIL(G5, 40)',
    description: 'Returns PASS if score meets or exceeds the pass threshold (default 40%), otherwise FAIL.',
  },
  {
    name: 'STUDENT_NO',
    category: 'ECZ Zambia',
    syntax: '=STUDENT_NO([cell_or_row], [academic_year])',
    example: '=STUDENT_NO(B5, 2026)',
    description: 'Generates a standardized Zambian student registration number (e.g. STU-2026-005) that automatically adapts to the current or specified academic year.',
  },
  {
    name: 'RANK',
    category: 'Stats',
    syntax: '=RANK(number, ref_range, [order])',
    example: '=RANK(G5, G$5:G$30, 0)',
    description: 'Returns the statistical ranking position of a student mark relative to all marks in the class (1st, 2nd, etc.).',
  },
  {
    name: 'VLOOKUP',
    category: 'Logical',
    syntax: '=VLOOKUP(lookup_value, table_range, col_index, [exact])',
    example: '=VLOOKUP(A5, A5:I30, 2)',
    description: 'Looks up a value in the leftmost column of a table and returns a value in the same row from a specified column.',
  },
  {
    name: 'COUNT',
    category: 'Stats',
    syntax: '=COUNT(range)',
    example: '=COUNT(C5:C25)',
    description: 'Counts the number of cells in a range that contain numbers.',
  },
  {
    name: 'COUNTA',
    category: 'Stats',
    syntax: '=COUNTA(range)',
    example: '=COUNTA(B5:B25)',
    description: 'Counts the number of non-empty cells in a range (both numbers and text strings).',
  },
  {
    name: 'MAX',
    category: 'Stats',
    syntax: '=MAX(range)',
    example: '=MAX(F5:F25)',
    description: 'Finds the highest numerical value in the selected range (useful for top exam scores).',
  },
  {
    name: 'MIN',
    category: 'Stats',
    syntax: '=MIN(range)',
    example: '=MIN(F5:F25)',
    description: 'Finds the lowest numerical value in the selected range.',
  },
  {
    name: 'MEDIAN',
    category: 'Stats',
    syntax: '=MEDIAN(range)',
    example: '=MEDIAN(G5:G25)',
    description: 'Returns the statistical median (middle value) of a collection of student scores.',
  },
  {
    name: 'STDEV',
    category: 'Stats',
    syntax: '=STDEV(range)',
    example: '=STDEV(F5:F25)',
    description: 'Estimates standard deviation based on a sample of test scores to measure academic variance.',
  },
  {
    name: 'PRODUCT',
    category: 'Math',
    syntax: '=PRODUCT(range)',
    example: '=PRODUCT(C5:E5)',
    description: 'Multiplies all numbers given as arguments.',
  },
  {
    name: 'IF',
    category: 'Logical',
    syntax: '=IF(condition, value_if_true, value_if_false)',
    example: '=IF(G5>=50, "PASS", "FAIL")',
    description: 'Checks whether a condition is met, and returns one value if TRUE, and another value if FALSE.',
  },
  {
    name: 'AND',
    category: 'Logical',
    syntax: '=AND(logical1, logical2, ...)',
    example: '=AND(C5>=50, D5>=50)',
    description: 'Returns TRUE if all arguments evaluate to TRUE.',
  },
  {
    name: 'OR',
    category: 'Logical',
    syntax: '=OR(logical1, logical2, ...)',
    example: '=OR(C5>=50, D5>=50)',
    description: 'Returns TRUE if any argument is TRUE.',
  },
  {
    name: 'NOT',
    category: 'Logical',
    syntax: '=NOT(logical)',
    example: '=NOT(G5<40)',
    description: 'Reverses the value of its argument (TRUE becomes FALSE, and vice versa).',
  },
  {
    name: 'COUNTIF',
    category: 'Logical',
    syntax: '=COUNTIF(range, criteria)',
    example: '=COUNTIF(H5:H25, "Distinction 1")',
    description: 'Counts the number of cells within a range that meet the given criteria (e.g. counting distinctions).',
  },
  {
    name: 'SUMIF',
    category: 'Logical',
    syntax: '=SUMIF(range, criteria, [sum_range])',
    example: '=SUMIF(C5:C25, ">15", C5:C25)',
    description: 'Adds the cells specified by a given condition or criteria.',
  },
  {
    name: 'ROUND',
    category: 'Math',
    syntax: '=ROUND(number, num_digits)',
    example: '=ROUND(G5, 1)',
    description: 'Rounds a number to a specified number of decimal places.',
  },
  {
    name: 'ROUNDUP',
    category: 'Math',
    syntax: '=ROUNDUP(number, num_digits)',
    example: '=ROUNDUP(E5, 0)',
    description: 'Rounds a number up, away from zero, to a specified number of decimal places.',
  },
  {
    name: 'ROUNDDOWN',
    category: 'Math',
    syntax: '=ROUNDDOWN(number, num_digits)',
    example: '=ROUNDDOWN(E5, 0)',
    description: 'Rounds a number down, towards zero, to a specified number of decimal places.',
  },
  {
    name: 'CONCAT',
    category: 'Text',
    syntax: '=CONCAT(text1, text2, ...)',
    example: '=CONCAT(B5, " - ", A5)',
    description: 'Combines the text from multiple ranges and/or strings.',
  },
  {
    name: 'UPPER',
    category: 'Text',
    syntax: '=UPPER(text)',
    example: '=UPPER(B5)',
    description: 'Converts a text string to all uppercase letters.',
  },
  {
    name: 'LOWER',
    category: 'Text',
    syntax: '=LOWER(text)',
    example: '=LOWER(B5)',
    description: 'Converts all letters in a text string to lowercase.',
  },
  {
    name: 'PROPER',
    category: 'Text',
    syntax: '=PROPER(text)',
    example: '=PROPER(B5)',
    description: 'Capitalizes the first letter of each word in a text string (proper case).',
  },
  {
    name: 'LEFT',
    category: 'Text',
    syntax: '=LEFT(text, [num_chars])',
    example: '=LEFT(A5, 3)',
    description: 'Returns the specified number of characters from the start of a text string.',
  },
  {
    name: 'RIGHT',
    category: 'Text',
    syntax: '=RIGHT(text, [num_chars])',
    example: '=RIGHT(A5, 4)',
    description: 'Returns the specified number of characters from the end of a text string.',
  },
  {
    name: 'MID',
    category: 'Text',
    syntax: '=MID(text, start_num, num_chars)',
    example: '=MID(A5, 5, 4)',
    description: 'Returns a specific number of characters from a text string, starting at the position you specify.',
  },
  {
    name: 'TRIM',
    category: 'Text',
    syntax: '=TRIM(text)',
    example: '=TRIM(B5)',
    description: 'Removes all spaces from text except for single spaces between words.',
  },
  {
    name: 'LEN',
    category: 'Text',
    syntax: '=LEN(text)',
    example: '=LEN(B5)',
    description: 'Returns the number of characters in a text string.',
  },
  {
    name: 'TODAY',
    category: 'Date',
    syntax: '=TODAY()',
    example: '=TODAY()',
    description: 'Returns the current date formatted according to local locale.',
  },
  {
    name: 'NOW',
    category: 'Date',
    syntax: '=NOW()',
    example: '=NOW()',
    description: 'Returns the current date and time.',
  },
  {
    name: 'SQRT',
    category: 'Math',
    syntax: '=SQRT(number)',
    example: '=SQRT(100)',
    description: 'Returns a positive square root.',
  },
  {
    name: 'POWER',
    category: 'Math',
    syntax: '=POWER(number, power)',
    example: '=POWER(5, 2)',
    description: 'Returns the result of a number raised to a power.',
  },
  {
    name: 'ABS',
    category: 'Math',
    syntax: '=ABS(number)',
    example: '=ABS(-45)',
    description: 'Returns the absolute value of a number (number without its sign).',
  },
];

interface FormulaWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFormula: (syntax: string) => void;
  currentCell: string;
}

export const FormulaWizardModal: React.FC<FormulaWizardModalProps> = ({
  isOpen,
  onClose,
  onSelectFormula,
  currentCell,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<FormulaDoc>(FORMULA_CATALOG[0]);

  if (!isOpen) return null;

  const categories = ['All', 'ECZ Zambia', 'Math', 'Stats', 'Logical', 'Text', 'Date'];

  const filtered = FORMULA_CATALOG.filter((f) => {
    const matchCat = selectedCat === 'All' || f.category === selectedCat;
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase()) ||
      f.syntax.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleApply = () => {
    onSelectFormula(selectedItem.example);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#107C41] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Insert Function & Formula Catalog</h3>
              <p className="text-[11px] text-emerald-100">
                Inserting into cell <span className="font-mono font-bold bg-white/20 px-1 rounded">{currentCell}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search functions (e.g. SUM, ECZ_GRADE, RANK, VLOOKUP, AVERAGE)..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#107C41] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCat === cat
                    ? 'bg-[#107C41] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Body: Split List & Documentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Function List */}
          <div className="overflow-y-auto p-2 max-h-[300px] md:max-h-[360px] space-y-1">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No matching functions found.
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                    selectedItem.name === item.name
                      ? 'bg-emerald-50 text-[#107C41] font-bold border border-emerald-300'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{item.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-[120px]">
                    {item.syntax}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Function Details */}
          <div className="p-4 bg-slate-50 flex flex-col justify-between overflow-y-auto max-h-[300px] md:max-h-[360px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 font-mono">
                  {selectedItem.name}
                </h4>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  {selectedItem.category}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Syntax
                </span>
                <div className="p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs text-emerald-800 font-bold">
                  {selectedItem.syntax}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Description
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Formula Example
                </span>
                <div className="p-2 bg-slate-100 border border-slate-200 rounded-lg font-mono text-xs text-slate-800">
                  {selectedItem.example}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-1.5 bg-[#107C41] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Insert Function</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
