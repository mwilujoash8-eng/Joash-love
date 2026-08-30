import React, { useState } from 'react';
import { Search, X, Check, ArrowRightLeft } from 'lucide-react';
import { SheetData } from './formulaEngine';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheet: SheetData;
  onReplace: (findText: string, replaceText: string, replaceAll: boolean) => void;
  onSelectCell: (cellKey: string) => void;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  sheet,
  onReplace,
  onSelectCell,
}) => {
  const [activeTab, setActiveTab] = useState<'find' | 'replace'>('find');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFindNext = () => {
    if (!findText.trim()) return;
    const term = matchCase ? findText : findText.toLowerCase();

    const keys = Object.keys(sheet.data);
    for (const k of keys) {
      const v = sheet.data[k]?.value || '';
      const compare = matchCase ? v : v.toLowerCase();
      if (compare.includes(term)) {
        onSelectCell(k);
        setStatusMsg(`Found match at cell ${k}`);
        return;
      }
    }
    setStatusMsg(`No matches found for "${findText}"`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#107C41] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            <h3 className="text-xs font-bold">Find and Replace</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('find')}
            className={`flex-1 py-2 text-center transition ${
              activeTab === 'find' ? 'bg-white text-[#107C41] border-b-2 border-b-[#107C41]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Find
          </button>
          <button
            onClick={() => setActiveTab('replace')}
            className={`flex-1 py-2 text-center transition ${
              activeTab === 'replace' ? 'bg-white text-[#107C41] border-b-2 border-b-[#107C41]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Replace
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-3 bg-white text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Find what:</label>
            <input
              type="text"
              autoFocus
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Text or number to find..."
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#107C41] focus:outline-none"
            />
          </div>

          {activeTab === 'replace' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Replace with:</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replacement value..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#107C41] focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="matchCase"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="rounded text-[#107C41] focus:ring-[#107C41]"
            />
            <label htmlFor="matchCase" className="text-slate-700 select-none cursor-pointer">
              Match case
            </label>
          </div>

          {statusMsg && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium">
              {statusMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Close
          </button>

          {activeTab === 'replace' && (
            <>
              <button
                onClick={() => {
                  onReplace(findText, replaceText, false);
                  setStatusMsg(`Replaced first instance of "${findText}"`);
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg font-semibold"
              >
                Replace
              </button>
              <button
                onClick={() => {
                  onReplace(findText, replaceText, true);
                  setStatusMsg(`Replaced all instances of "${findText}"`);
                }}
                className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg font-bold hover:bg-emerald-200"
              >
                Replace All
              </button>
            </>
          )}

          <button
            onClick={handleFindNext}
            className="px-4 py-1.5 bg-[#107C41] hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
          >
            Find Next
          </button>
        </div>
      </div>
    </div>
  );
};
