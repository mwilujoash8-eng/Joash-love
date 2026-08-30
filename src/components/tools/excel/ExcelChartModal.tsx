import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, X, Download, Sparkles } from 'lucide-react';
import { SheetData, parseCellRef, expandRange } from './formulaEngine';

interface ExcelChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheet: SheetData;
}

export const ExcelChartModal: React.FC<ExcelChartModalProps> = ({ isOpen, onClose, sheet }) => {
  const [chartType, setChartType] = useState<'bar' | 'column' | 'line' | 'pie' | 'area'>('column');
  const [chartTitle, setChartTitle] = useState(`${sheet.name} - Performance Chart`);
  const [dataRange, setDataRange] = useState('B5:F12');

  if (!isOpen) return null;

  // Extract chart data from the sheet based on dataRange or fallback
  const parseChartData = () => {
    try {
      const parts = dataRange.split(':');
      if (parts.length !== 2) return [];

      const start = parseCellRef(parts[0]);
      const end = parseCellRef(parts[1]);
      if (!start || !end) return [];

      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);

      const items: any[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        // Label from column B (or first col)
        const label = sheet.data[`B${r}`]?.value || sheet.data[`A${r}`]?.value || `Row ${r}`;
        const t1 = parseFloat(sheet.data[`C${r}`]?.value?.replace(/[%,K$]/g, '') || '0') || 0;
        const t2 = parseFloat(sheet.data[`D${r}`]?.value?.replace(/[%,K$]/g, '') || '0') || 0;
        const t3 = parseFloat(sheet.data[`E${r}`]?.value?.replace(/[%,K$]/g, '') || '0') || 0;
        const exam = parseFloat(sheet.data[`F${r}`]?.value?.replace(/[%,K$]/g, '') || '0') || 0;
        const pct = parseFloat(sheet.data[`G${r}`]?.value?.replace(/[%,K$]/g, '') || '0') || Math.round((t1 + t2 + t3) / 3);

        items.push({
          name: label.length > 15 ? `${label.substring(0, 15)}...` : label,
          Test1: t1,
          Test2: t2,
          Test3: t3,
          Exam: exam,
          Score: pct || exam || t1 || 50,
          value: pct || exam || t1 || 50,
        });
      }
      return items.length > 0 ? items : getDefaultChartData();
    } catch {
      return getDefaultChartData();
    }
  };

  const getDefaultChartData = () => [
    { name: 'Mubita Mweemba', Test1: 18, Test2: 19, Exam: 88, Score: 88, value: 88 },
    { name: 'Chileshe Mwansa', Test1: 16, Test2: 15, Exam: 74, Score: 74, value: 74 },
    { name: 'Kondwani Banda', Test1: 13, Test2: 14, Exam: 62, Score: 62, value: 62 },
    { name: 'Natasha Phiri', Test1: 19, Test2: 18, Exam: 94, Score: 94, value: 94 },
    { name: 'Thandiwe Zulu', Test1: 11, Test2: 12, Exam: 52, Score: 52, value: 52 },
    { name: 'Bwalya Tembo', Test1: 15, Test2: 17, Exam: 79, Score: 79, value: 79 },
  ];

  const chartData = parseChartData();
  const COLORS = ['#107C41', '#0D6EFD', '#D97706', '#7C3AED', '#DC2626', '#059669', '#2563EB', '#EA580C'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#107C41] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Excel Chart Studio</h3>
              <p className="text-[11px] text-emerald-100">
                Visualizing data from <span className="font-bold">{sheet.name}</span>
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

        {/* Toolbar & Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Chart Type</label>
            <div className="flex gap-1">
              {[
                { id: 'column', label: 'Column' },
                { id: 'bar', label: 'Bar' },
                { id: 'line', label: 'Line' },
                { id: 'area', label: 'Area' },
                { id: 'pie', label: 'Pie' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setChartType(t.id as any)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                    chartType === t.id
                      ? 'bg-[#107C41] text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Chart Title</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#107C41] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Data Range</label>
            <input
              type="text"
              value={dataRange}
              onChange={(e) => setDataRange(e.target.value)}
              placeholder="e.g. B5:F12"
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-800 focus:ring-2 focus:ring-[#107C41] focus:outline-none"
            />
          </div>
        </div>

        {/* Visual Chart Area */}
        <div className="p-6 bg-white flex-1 overflow-y-auto min-h-[380px] flex flex-col items-center justify-center">
          <h4 className="text-sm font-bold text-slate-800 mb-4">{chartTitle}</h4>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'column' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend />
                  <Bar dataKey="Test1" fill="#107C41" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Test2" fill="#0D6EFD" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Exam" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : chartType === 'bar' ? (
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={90} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend />
                  <Bar dataKey="Score" fill="#107C41" radius={[0, 4, 4, 0]} />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Test1" stroke="#107C41" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Exam" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Score" stroke="#D97706" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              ) : chartType === 'area' ? (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="Score" stroke="#107C41" fill="#D2E7D6" />
                </AreaChart>
              ) : (
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Rendered from dynamic spreadsheet range: <strong className="font-mono text-emerald-800">{dataRange}</strong>
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
