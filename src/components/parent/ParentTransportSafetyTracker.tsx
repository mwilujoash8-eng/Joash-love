import React, { useState } from 'react';
import {
  Bus,
  Shield,
  Phone,
  QrCode,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Key,
  RefreshCw,
  Share2,
  Navigation
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { BusRouteTracker, GuardianPickupPass } from '../../types';

interface ParentTransportSafetyTrackerProps {
  studentNumber: string;
  studentName: string;
}

export const ParentTransportSafetyTracker: React.FC<ParentTransportSafetyTrackerProps> = ({
  studentNumber,
  studentName,
}) => {
  const { busTrackers, guardianPasses, generateDailyGuardianPass } = useSchool();

  // Find active bus tracker
  const busRoute: BusRouteTracker = busTrackers.find((b) =>
    (b.assignedStudents || b.assignedStudentNumbers || []).includes(studentNumber)
  ) || busTrackers[0] || {
    id: 'bus_04',
    routeTitle: 'Mukobeko - Town Centre - Kasanda (Route 4B)',
    routeNumber: 'Route 4B',
    busRegistrationNumber: 'BAH 8821 ZM',
    driverName: 'Mr. Joseph Sakala',
    driverPhone: '+260 977 443 190',
    matronName: 'Mrs. Patricia Tembo',
    matronPhone: '+260 966 812 344',
    currentLocation: 'Passing Luangwa Market Junction (Speed: 38 km/h)',
    tripType: 'afternoon_dropoff',
    status: 'morning_in_transit',
    etaMinutes: 12,
    stops: [
      { id: 's1', name: 'Kabwe Secondary & Tech Gate', scheduledTime: '15:30', status: 'completed' },
      { id: 's2', name: 'Highridge Primary Junction', scheduledTime: '15:42', status: 'completed' },
      { id: 's3', name: 'Chowa Township Market', scheduledTime: '15:55', status: 'completed' },
      { id: 's4', name: 'Mine Club Roundabout (Student Drop-off)', scheduledTime: '16:08', status: 'current' },
      { id: 's5', name: 'Railway Station North Gate', scheduledTime: '16:22', status: 'pending' },
    ],
    assignedStudents: [studentNumber],
  };

  // Guardian pass
  const existingPass: GuardianPickupPass = guardianPasses[studentNumber] || {
    studentNumber,
    studentName,
    guardianName: 'Mr. Patrick Mweemba',
    guardianPhone: '+260 966 892 110',
    guardianRelation: 'Father (Primary Contact)',
    dailySecurityPin: '8492',
    qrVerificationCode: `KTH-SEC-GATE-PASS-${studentNumber}-8492`,
    validDate: new Date().toISOString().split('T')[0],
    authorizedByHead: true,
    pickupTimeWindow: '15:30 - 17:15 PM',
  };

  const [guardianNameInput, setGuardianNameInput] = useState(existingPass.guardianName);
  const [guardianPhoneInput, setGuardianPhoneInput] = useState(existingPass.guardianPhone);
  const [guardianRelationInput, setGuardianRelationInput] = useState(existingPass.guardianRelation);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'bus' | 'pass'>('bus');

  const handleGenerateNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      generateDailyGuardianPass(
        studentNumber,
        guardianNameInput,
        guardianPhoneInput,
        guardianRelationInput
      );
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* TOP TOGGLE NAV */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>School Transport & Gate Security Hub</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time GPS bus tracking and daily authorized campus gate pick-up authorization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('bus')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bus'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Live School Bus Track</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pass')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pass'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Daily Gate Pass (PIN: {existingPass.dailySecurityPin})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE BUS TRACKER */}
      {activeTab === 'bus' && (
        <div className="space-y-4">
          {/* BUS STATUS CARD */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-2xl p-5 shadow-md border border-emerald-800/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <Bus className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                      {busRoute.routeNumber}
                    </span>
                    <span className="text-xs text-slate-300 font-mono font-bold">
                      {busRoute.busRegistrationNumber}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    {busRoute.tripType === 'afternoon_dropoff' ? 'Afternoon Home Drop-off Route' : 'Morning Campus Shuttle'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>{busRoute.currentLocation}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Arrival</div>
                  <div className="text-lg font-black font-mono text-amber-400">
                    ~{busRoute.etaMinutes} Minutes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CREW CONTACTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                  DR
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{busRoute.driverName}</div>
                  <div className="text-[11px] text-slate-500">Official Transport Driver</div>
                </div>
              </div>
              <a
                href={`tel:${busRoute.driverPhone}`}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Driver</span>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                  MT
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {busRoute.matronName || busRoute.supervisorName || 'Mrs. Patricia Tembo'}
                  </div>
                  <div className="text-[11px] text-slate-500">Student Care Matron</div>
                </div>
              </div>
              <a
                href={`tel:${busRoute.matronPhone || busRoute.supervisorPhone || '+260966812344'}`}
                className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Matron</span>
              </a>
            </div>
          </div>

          {/* ROUTE PROGRESS TIMELINE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Real-time Bus Route Stops Progression
            </h4>

            <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {busRoute.stops.map((stop, idx) => {
                const stopKey = stop.id || `bus_stop_${idx}_${stop.name || stop.stopName || 'stop'}`;
                const stopStatus = stop.status || (stop.isCompletedMorning ? 'completed' : idx === 0 ? 'completed' : idx === 1 ? 'current' : 'pending');
                const stopDisplayName = stop.name || stop.stopName || `Stop ${idx + 1}`;
                const stopDisplayTime = stop.scheduledTime || stop.scheduledMorningTime || stop.scheduledAfternoonTime || '07:30 AM';

                return (
                  <div key={stopKey} className="relative flex items-start gap-4 pl-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                      stopStatus === 'completed'
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : stopStatus === 'current'
                        ? 'bg-amber-500 border-amber-600 text-white animate-bounce'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                    }`}>
                      {stopStatus === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {stopDisplayName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Scheduled: {stopDisplayTime}
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        stopStatus === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : stopStatus === 'current'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {stopStatus === 'completed' && 'Passed & Cleared'}
                        {stopStatus === 'current' && 'Arriving Next (ETA 2 min)'}
                        {stopStatus !== 'completed' && stopStatus !== 'current' && 'Upcoming Stop'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAILY GUARDIAN SECURITY GATE PASS */}
      {activeTab === 'pass' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DIGITAL PASS VISUAL */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 rounded-3xl border border-emerald-700/50 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold font-mono tracking-wider text-emerald-400">
                    KABWE TECH SECURE GATE PASS
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                  AUTHORIZED
                </span>
              </div>

              <div className="mt-4 text-center space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                  Daily Gate Verification PIN
                </span>
                <div className="text-4xl font-black font-mono tracking-widest text-emerald-400 bg-slate-900/90 py-3 rounded-2xl border border-emerald-500/40 shadow-inner">
                  {existingPass.dailySecurityPin}
                </div>
                <p className="text-[11px] text-slate-400">
                  Valid for: <strong className="text-white">{existingPass.validDate}</strong> ({existingPass.pickupTimeWindow})
                </p>
              </div>

              <div className="mt-5 space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-bold text-white">{studentName} ({studentNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Authorized Guardian:</span>
                  <span className="font-bold text-white">{existingPass.guardianName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Relationship:</span>
                  <span className="text-slate-300">{existingPass.guardianRelation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Emergency Phone:</span>
                  <span className="font-mono text-emerald-300">{existingPass.guardianPhone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Encrypted: {existingPass.qrVerificationCode.substring(0, 18)}...</span>
              </div>
              <span className="text-emerald-400 font-bold">Head of Security Cleared</span>
            </div>
          </div>

          {/* EDIT / REGENERATE PASS FORM */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Authorize Alternate Pickup Person / Generate Fresh PIN
              </h3>
              <p className="text-xs text-slate-500">
                To protect child safety, the school gate security officers verify this dynamic 4-digit PIN upon dismissal.
              </p>
            </div>

            <form onSubmit={handleGenerateNewPin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name of Collecting Guardian / Driver
                </label>
                <input
                  type="text"
                  value={guardianNameInput}
                  onChange={(e) => setGuardianNameInput(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Relationship to Student
                </label>
                <select
                  value={guardianRelationInput}
                  onChange={(e) => setGuardianRelationInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Father (Primary Contact)">Father</option>
                  <option value="Mother (Primary Contact)">Mother</option>
                  <option value="Authorized Uncle / Aunt">Uncle / Aunt</option>
                  <option value="Designated Family Driver">Family Driver / Chauffeur</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Guardian Phone Number (for SMS gate verification)
                </label>
                <input
                  type="text"
                  value={guardianPhoneInput}
                  onChange={(e) => setGuardianPhoneInput(e.target.value)}
                  required
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generating Secure Pass...' : 'Generate New Daily Security PIN'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
