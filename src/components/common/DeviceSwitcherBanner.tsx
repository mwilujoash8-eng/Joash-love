import React from 'react';
import { Smartphone, Laptop, Monitor, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';

export const DeviceSwitcherBanner: React.FC = () => {
  const {
    deviceType,
    effectiveDevice,
    deviceMode,
    setDeviceMode,
    screenWidth,
    detectedName,
  } = useDevice();

  return (
    <aside aria-label="Device layout and responsive viewport controls" className="bg-[#0B1329] text-slate-300 text-[11px] px-3 sm:px-6 py-1.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-50">
      {/* Left: Detected Hardware Device Status */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{detectedName}</span>
          <span className="text-slate-400 font-mono">({screenWidth}px)</span>
        </span>
        <span className="hidden md:inline text-slate-400">
          Adaptive layout engine automatically optimizes for touch smartphones and high-resolution laptops.
        </span>
      </div>

      {/* Right: Interactive Device Switcher Controls */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-700/80">
        <button
          onClick={() => setDeviceMode('auto')}
          className={`px-2.5 py-1 rounded-lg font-medium text-[11px] flex items-center gap-1 transition ${
            deviceMode === 'auto'
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Auto-detect based on screen width and touch capability"
        >
          <Sparkles className="w-3 h-3 text-emerald-300" />
          <span>Auto</span>
        </button>

        <button
          onClick={() => setDeviceMode('smartphone')}
          className={`px-2.5 py-1 rounded-lg font-medium text-[11px] flex items-center gap-1 transition ${
            effectiveDevice === 'smartphone' && deviceMode === 'smartphone'
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Force Mobile Smartphone layout (thumb-friendly, bottom nav, mobile cards)"
        >
          <Smartphone className="w-3 h-3" />
          <span>Smartphone</span>
        </button>

        <button
          onClick={() => setDeviceMode('desktop')}
          className={`px-2.5 py-1 rounded-lg font-medium text-[11px] flex items-center gap-1 transition ${
            effectiveDevice === 'desktop' && deviceMode === 'desktop'
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Force Laptop / Desktop layout (multi-column bento, full Excel ribbon, wide charts)"
        >
          <Laptop className="w-3 h-3" />
          <span>Laptop / Desktop</span>
        </button>
      </div>
    </aside>
  );
};
