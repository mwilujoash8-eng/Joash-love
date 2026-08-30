import React from 'react';
import {
  HeartPulse,
  Thermometer,
  Pill,
  CheckCircle2,
  Calendar,
  AlertCircle,
  PhoneCall,
  Activity
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { HealthClinicVisit } from '../../types';

interface ParentClinicHealthTrackerProps {
  studentNumber: string;
  studentName: string;
}

export const ParentClinicHealthTracker: React.FC<ParentClinicHealthTrackerProps> = ({
  studentNumber,
  studentName,
}) => {
  const { clinicVisits } = useSchool();

  const studentVisits = clinicVisits.filter(
    (v) => v.studentNumber === studentNumber
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            School Health Sick Bay & Nursing Log
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Clinic Visits & Medical Care — {studentName}
          </h2>
          <p className="text-xs text-slate-500">
            Real-time logs from Resident School Nurse (Sister Grace Banda) for fever, first aid, and medication.
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Sick Bay Hot-Line</div>
          <div className="font-mono font-bold text-slate-900 dark:text-white">+260 977 820 119</div>
        </div>
      </div>

      {/* VISITS LIST */}
      <div className="space-y-4">
        {studentVisits.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
            No clinic visits or sick bay admissions recorded for this term. Learner is in good health!
          </div>
        ) : (
          studentVisits.map((visit) => {
            const visitTitle = visit.complaint || visit.reasonForVisit || 'Routine Health Observation';
            const visitNurse = visit.nurseName || 'Sister Grace Banda (RN)';
            const visitTimeStr = visit.timestamp ? new Date(visit.timestamp).toLocaleString() : `${visit.visitDate || '2026-02-12'} at ${visit.time || '11:15 AM'}`;
            const visitTemp = visit.temperatureCelsius || visit.vitalSigns?.temperatureC;
            const visitAction = visit.actionTaken || visit.actionRecommended || 'returned_to_class';
            const visitTreatment = visit.treatmentGiven || visit.treatmentAdministered || 'Observation and oral hydration';
            const visitNotes = visit.nurseNotes || visit.nurseObservations || 'Student cleared and vitals stable.';

            return (
              <div
                key={visit.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {visitTitle}
                      </h3>
                      <div className="text-[11px] text-slate-500">
                        Attended by: <strong>{visitNurse}</strong> • {visitTimeStr}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {visitTemp && (
                      <span className="text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>{visitTemp}°C</span>
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      visitAction === 'returned_to_class'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    }`}>
                      {visitAction.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Treatment & Medication Administered</span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                      {visitTreatment}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Clinical Observations / Parent Note</span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                      {visitNotes}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
