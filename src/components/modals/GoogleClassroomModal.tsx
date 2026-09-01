import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  Sparkles,
  BookOpen,
  Send,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  LogOut,
} from 'lucide-react';
import {
  googleSignIn,
  googleSignOut,
  getAccessToken,
  initAuth,
} from '../../services/googleAuth';
import {
  fetchClassroomCourses,
  fetchCourseWork,
  fetchAnnouncements,
  createClassroomAnnouncement,
  createClassroomCourseWork,
  ClassroomCourse,
  ClassroomCourseWork,
  ClassroomAnnouncement,
} from '../../services/googleClassroom';
import { User } from 'firebase/auth';

interface GoogleClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleClassroomModal: React.FC<GoogleClassroomModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);
  const [courseWorkList, setCourseWorkList] = useState<ClassroomCourseWork[]>([]);
  const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Announcement creation state
  const [newAnnouncementText, setNewAnnouncementText] = useState('');
  const [isPostingAnnouncement, setIsPostingAnnouncement] = useState(false);

  // Coursework creation state
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDescription, setAssignDescription] = useState('');
  const [assignPoints, setAssignPoints] = useState(100);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (authedUser, authedToken) => {
        setUser(authedUser);
        setToken(authedToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  useEffect(() => {
    if (token) {
      loadCourses();
    }
  }, [token]);

  useEffect(() => {
    if (selectedCourse && token) {
      loadCourseDetails(selectedCourse.id);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    setIsLoadingData(true);
    setErrorMsg(null);
    try {
      const fetched = await fetchClassroomCourses();
      setCourses(fetched);
      if (fetched.length > 0 && !selectedCourse) {
        setSelectedCourse(fetched[0]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load Google Classroom courses');
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadCourseDetails = async (courseId: string) => {
    setIsLoadingData(true);
    setErrorMsg(null);
    try {
      const [work, notes] = await Promise.all([
        fetchCourseWork(courseId).catch(() => []),
        fetchAnnouncements(courseId).catch(() => []),
      ]);
      setCourseWorkList(work);
      setAnnouncements(notes);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load coursework');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async () => {
    setIsLoadingAuth(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setSuccessMsg('Successfully connected to Google Classroom!');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Classroom sign-in was cancelled or failed.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    await googleSignOut();
    setUser(null);
    setToken(null);
    setCourses([]);
    setSelectedCourse(null);
    setCourseWorkList([]);
    setAnnouncements([]);
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !newAnnouncementText.trim()) return;

    setIsPostingAnnouncement(true);
    setErrorMsg(null);
    try {
      await createClassroomAnnouncement(selectedCourse.id, newAnnouncementText.trim());
      setNewAnnouncementText('');
      setSuccessMsg('Announcement published to Google Classroom stream!');
      setTimeout(() => setSuccessMsg(null), 3000);
      loadCourseDetails(selectedCourse.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish announcement');
    } finally {
      setIsPostingAnnouncement(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !assignTitle.trim()) return;

    setIsCreatingAssignment(true);
    setErrorMsg(null);
    try {
      await createClassroomCourseWork(
        selectedCourse.id,
        assignTitle.trim(),
        assignDescription.trim(),
        assignPoints
      );
      setAssignTitle('');
      setAssignDescription('');
      setShowCreateAssignment(false);
      setSuccessMsg('Assignment synced and created on Google Classroom!');
      setTimeout(() => setSuccessMsg(null), 3000);
      loadCourseDetails(selectedCourse.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create assignment');
    } finally {
      setIsCreatingAssignment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-2xl border border-emerald-400/30">
              <GraduationCap className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">Google Classroom Integration</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Sync courses, coursework, assignments, and announcements directly with Google Classroom
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="px-5 py-3 bg-rose-50 border-b border-rose-200 flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!user || !token ? (
            /* Unauthenticated View with Official Sign In With Google button */
            <div className="py-12 px-4 max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto text-emerald-700 shadow-inner">
                <GraduationCap className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-black text-slate-900">Connect Google Classroom</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sign in with your institutional or teacher Google account to synchronize your courses, assignments, rosters, and announcements with SchoolLink OS.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoadingAuth}
                  className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isLoadingAuth ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs text-slate-500 space-y-1.5">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  What this enables:
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>View active classes and subjects directly inside SchoolLink</li>
                  <li>Post announcements to students' Google Classroom streams</li>
                  <li>Publish new assignments and track submissions</li>
                  <li>Seamless dual synchronization with ECZ assessment tools</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Authenticated Classroom Dashboard */
            <div className="space-y-6">
              {/* User Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-10 h-10 rounded-full border border-slate-300 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h5 className="text-xs font-black text-slate-900">
                      {user.displayName || 'Google Classroom User'}
                    </h5>
                    <p className="text-[11px] font-mono text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadCourses}
                    disabled={isLoadingData}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    title="Refresh courses"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>

              {/* Course Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Select Google Classroom Course
                </label>
                {courses.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                    No active Google Classroom courses found for this account. Create courses in Google Classroom first or refresh.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {courses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className={`p-3.5 rounded-2xl text-left border transition flex flex-col justify-between gap-2 cursor-pointer ${
                          selectedCourse?.id === course.id
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-black text-xs text-slate-900 line-clamp-1">{course.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {course.section || 'All Sections'} &bull; {course.room || 'Online'}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                          {course.enrollmentCode && (
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                              Code: {course.enrollmentCode}
                            </span>
                          )}
                          {course.alternateLink && (
                            <a
                              href={course.alternateLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:underline flex items-center gap-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Open <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Course Work & Announcements */}
              {selectedCourse && (
                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span>{selectedCourse.name} — Stream & Assignments</span>
                      </h4>
                    </div>

                    <button
                      onClick={() => setShowCreateAssignment(!showCreateAssignment)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Assignment</span>
                    </button>
                  </div>

                  {/* Create Assignment Panel */}
                  {showCreateAssignment && (
                    <form
                      onSubmit={handleCreateAssignment}
                      className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-3 animate-in fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950">
                          Publish New Coursework to Google Classroom
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowCreateAssignment(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Assignment Title
                        </label>
                        <input
                          type="text"
                          value={assignTitle}
                          onChange={(e) => setAssignTitle(e.target.value)}
                          placeholder="e.g. Grade 9 Quadratic Equations Homework 3"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-hidden focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Instructions / Description
                          </label>
                          <textarea
                            value={assignDescription}
                            onChange={(e) => setAssignDescription(e.target.value)}
                            placeholder="Instructions for students..."
                            rows={2}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Max Marks / Points
                          </label>
                          <input
                            type="number"
                            value={assignPoints}
                            onChange={(e) => setAssignPoints(Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-hidden focus:border-emerald-500"
                            min={1}
                            max={100}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowCreateAssignment(false)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isCreatingAssignment}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          {isCreatingAssignment ? 'Publishing...' : 'Sync & Publish'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Post Quick Announcement Form */}
                  <form onSubmit={handlePostAnnouncement} className="flex gap-2">
                    <input
                      type="text"
                      value={newAnnouncementText}
                      onChange={(e) => setNewAnnouncementText(e.target.value)}
                      placeholder={`Share an announcement with ${selectedCourse.name}...`}
                      className="flex-1 bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-hidden"
                    />
                    <button
                      type="submit"
                      disabled={isPostingAnnouncement || !newAnnouncementText.trim()}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isPostingAnnouncement ? 'Posting...' : 'Post'}</span>
                    </button>
                  </form>

                  {/* Coursework & Stream lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Active Coursework */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Assignments ({courseWorkList.length})</span>
                        </span>
                      </div>

                      {courseWorkList.length === 0 ? (
                        <p className="text-slate-400 text-xs py-4 text-center">No assignments published yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {courseWorkList.map((work) => (
                            <div
                              key={work.id}
                              className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="font-bold text-xs text-slate-900">{work.title}</div>
                                {work.maxPoints !== undefined && (
                                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                                    {work.maxPoints} pts
                                  </span>
                                )}
                              </div>
                              {work.description && (
                                <p className="text-[11px] text-slate-600 line-clamp-2">{work.description}</p>
                              )}
                              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                                <span>Status: {work.state || 'PUBLISHED'}</span>
                                {work.alternateLink && (
                                  <a
                                    href={work.alternateLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-600 hover:underline flex items-center gap-0.5"
                                  >
                                    View in Classroom <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: Announcements Stream */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          <span>Announcements Stream ({announcements.length})</span>
                        </span>
                      </div>

                      {announcements.length === 0 ? (
                        <p className="text-slate-400 text-xs py-4 text-center">No announcements on stream yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {announcements.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1"
                            >
                              <p className="text-xs text-slate-800 leading-relaxed">{item.text}</p>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                                <span>{item.creationTime ? new Date(item.creationTime).toLocaleDateString() : 'Recent'}</span>
                                {item.alternateLink && (
                                  <a
                                    href={item.alternateLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-teal-600 hover:underline flex items-center gap-0.5"
                                  >
                                    Open Post <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
