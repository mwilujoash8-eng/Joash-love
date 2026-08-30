import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  UserCheck,
  Plus,
  BookOpen,
  Send
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ParentTeacherConference } from '../../types';

interface ParentTeacherConferenceBookerProps {
  studentNumber: string;
  studentName: string;
}

export const ParentTeacherConferenceBooker: React.FC<ParentTeacherConferenceBookerProps> = ({
  studentNumber,
  studentName,
}) => {
  const { conferences, bookConference, currentUser } = useSchool();
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Form State
  const [teacherName, setTeacherName] = useState('Mr. Brian Tembo');
  const [subjectName, setSubjectName] = useState('Mathematics & Additional Math');
  const [date, setDate] = useState('2026-03-20');
  const [timeSlot, setTimeSlot] = useState('14:30 - 15:00');
  const [meetingType, setMeetingType] = useState<'in_person' | 'zoom_virtual'>('zoom_virtual');
  const [agenda, setAgenda] = useState('Discussion on Continuous Assessment 2 progress and STEM Olympiad preparation');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookConference({
      studentNumber,
      studentName,
      parentId: currentUser.id,
      parentName: currentUser.fullName,
      teacherId: 'teacher_tembo',
      teacherName,
      subjectName,
      date,
      timeSlot,
      meetingType,
      meetingLink: meetingType === 'zoom_virtual' ? 'https://schoollink.zm/zoom/ptc-math-2026' : undefined,
      location: meetingType === 'in_person' ? 'Senior Staffroom Block A, Room 4' : undefined,
      notes: agenda,
    });
    setShowBookingForm(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Parent-Teacher Consultation Booker
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Book 1-on-1 Academic Conference
          </h2>
          <p className="text-xs text-slate-500">
            Schedule private appointments with subject teachers or class masters (In-Person or Virtual Live Zoom).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showBookingForm ? 'Close Form' : 'Book New Conference'}</span>
        </button>
      </div>

      {/* BOOKING FORM MODAL / COLLAPSIBLE */}
      {showBookingForm && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Schedule Consultation for {studentName} ({studentNumber})
          </h3>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Subject Teacher
                </label>
                <select
                  value={teacherName}
                  onChange={(e) => {
                    setTeacherName(e.target.value);
                    if (e.target.value.includes('Tembo')) setSubjectName('Mathematics & Additional Math');
                    if (e.target.value.includes('Lungu')) setSubjectName('Integrated Science & Biology');
                    if (e.target.value.includes('Chanda')) setSubjectName('English Language & Literature');
                    if (e.target.value.includes('Banda')) setSubjectName('Head Teacher / Executive Master');
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Mr. Brian Tembo">Mr. Brian Tembo (Mathematics Master)</option>
                  <option value="Ms. Chileshe Lungu">Ms. Chileshe Lungu (Science & Biology HOD)</option>
                  <option value="Mr. Kelvin Chanda">Mr. Kelvin Chanda (English & Debate Master)</option>
                  <option value="Dr. Musonda Mwape">Dr. Musonda Mwape (Head Teacher Consultation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Focus / Subject Area
                </label>
                <input
                  type="text"
                  value={subjectName}
                  readOnly
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="14:00 - 14:30">14:00 - 14:30 (Afternoon Period)</option>
                  <option value="14:30 - 15:00">14:30 - 15:00 (Afternoon Period)</option>
                  <option value="15:30 - 16:00">15:30 - 16:00 (Post-Class Hours)</option>
                  <option value="16:00 - 16:30">16:00 - 16:30 (Evening Session)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Meeting Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMeetingType('zoom_virtual')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    meetingType === 'zoom_virtual'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Virtual Video (Zoom Link)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingType('in_person')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    meetingType === 'in_person'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>In-Person at Campus Staffroom</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Discussion Agenda / Parent Concerns
              </label>
              <textarea
                rows={2}
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="Specify what you wish to review (e.g. CA scores, homework habits, revision tips)..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3 h-3" />
                <span>Confirm & Reserve Appointment</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SCHEDULED CONFERENCES LIST */}
      <div className="space-y-3">
        {conferences.map((conf, idx) => {
          const isVirtual = (conf.meetingType || conf.mode) === 'zoom_virtual';
          const link = conf.meetingLink || conf.zoomJoinUrl;
          const loc = conf.location || conf.roomNumber || 'Block A - Staff Consultation Room';
          const confKey = conf.id || `conf_${idx}_${conf.date}`;

          return (
            <div
              key={confKey}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isVirtual
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {isVirtual ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {conf.teacherName} ({conf.subjectName})
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                      {conf.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <strong>{new Date(conf.date).toLocaleDateString()}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{conf.timeSlot}</span>
                    </span>
                    <span>•</span>
                    <span>{isVirtual ? 'Virtual Zoom Class Link' : loc}</span>
                  </div>

                  {(conf.notes || conf.topicAgenda) && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 italic">
                      "{conf.notes || conf.topicAgenda}"
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                {isVirtual && link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Live Zoom</span>
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">In-Person Confirmed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
