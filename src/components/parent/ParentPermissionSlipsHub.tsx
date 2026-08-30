import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Calendar,
  DollarSign,
  UserCheck,
  AlertCircle,
  Clock,
  Send,
  MapPin
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { PermissionSlip } from '../../types';

interface ParentPermissionSlipsHubProps {
  studentNumber: string;
  studentName: string;
}

export const ParentPermissionSlipsHub: React.FC<ParentPermissionSlipsHubProps> = ({
  studentNumber,
  studentName,
}) => {
  const { permissionSlips, signPermissionSlip, currentUser } = useSchool();

  const [activeSlipId, setActiveSlipId] = useState<string | null>(null);
  const [signatureName, setSignatureName] = useState<string>(currentUser.fullName || 'Mr. Patrick Mweemba');
  const [medicalNotes, setMedicalNotes] = useState<string>('None. Child carries personal asthma inhaler as precaution.');

  const handleSign = (slipId: string) => {
    signPermissionSlip(slipId, signatureName, medicalNotes);
    setActiveSlipId(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          Electronic Consent & Field Trips
        </span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
          Permission Slips & Excursion Authorizations
        </h2>
        <p className="text-xs text-slate-500">
          Review educational trip schedules, learning objectives, and provide legally binding electronic parent consent.
        </p>
      </div>

      {/* SLIPS LIST */}
      <div className="space-y-4">
        {permissionSlips.map((slip) => {
          const isSigned = slip.status === 'signed';

          return (
            <div
              key={slip.id}
              className={`p-5 rounded-2xl border transition shadow-xs ${
                isSigned
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700/60'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                      isSigned
                        ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}>
                      {isSigned ? 'CONSENT AUTHORIZED' : 'SIGNATURE REQUIRED'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Cost: <strong>ZMW {slip.costZMW.toLocaleString()}</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                    {slip.tripTitle}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Destination: <strong>{slip.destination}</strong> ({slip.tripDate})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSigned ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Digitally Signed by {slip.guardianSignatureName}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveSlipId(activeSlipId === slip.id ? null : slip.id)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Review & Authorize Consent</span>
                    </button>
                  )}
                </div>
              </div>

              {/* TRIP DESCRIPTION */}
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-3 font-medium leading-relaxed">
                {slip.description}
              </p>

              {/* MEDICAL NOTES RECORDED */}
              {slip.medicalConditionsNote && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Parent Medical Note:</span> {slip.medicalConditionsNote}
                </div>
              )}

              {/* SIGNATURE FORM */}
              {activeSlipId === slip.id && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3 bg-amber-50/60 dark:bg-amber-950/40 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Parent Electronic Consent Form
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Parent / Guardian Full Legal Name (Electronic Signature)
                      </label>
                      <input
                        type="text"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        required
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Medical Precautions / Emergency Instructions
                      </label>
                      <input
                        type="text"
                        value={medicalNotes}
                        onChange={(e) => setMedicalNotes(e.target.value)}
                        placeholder="Allergies, medication, dietary precautions..."
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    By confirming, I give full consent for {studentName} to participate in this educational trip and authorize the supervising teachers to administer first aid in emergency situations.
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveSlipId(null)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSign(slip.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Authorize Electronic Consent</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
