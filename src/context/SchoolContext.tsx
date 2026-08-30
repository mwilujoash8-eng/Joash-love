import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  School,
  User,
  UserRole,
  UserCategory,
  SchoolStaffSubscriptionTier,
  ParentSubscriptionTier,
  SubscriptionPaymentMethod,
  SchoolStaffSubscription,
  ParentSubscription,
  AssessmentRecord,
  TermReportCard,
  AttendanceRecord,
  Assignment,
  Announcement,
  PTARecord,
  AuditLog,
  AppNotification,
  TermConfig,
  AssessmentWeighting,
  GradeBoundary,
  CalendarEvent,
  TermId,
  ZoomMeeting,
  DirectMessage,
  TeacherDailyDutyLog,
  TeacherLessonPeriod,
  StoryItem,
  SchoolGroup,
  GroupPost,
  FinancePublication,
  ParentFeeStatement,
  ParentPaymentTransaction,
  PaymentChannel,
  BusRouteTracker,
  GuardianPickupPass,
  StudentBehaviorLog,
  ParentTeacherConference,
  PermissionSlip,
  HealthClinicVisit,
  CanteenWallet,
  ZambianTermInfo
} from '../types';
import {
  INITIAL_SCHOOLS,
  INITIAL_USERS,
  INITIAL_ASSESSMENTS,
  INITIAL_REPORT_CARDS,
  INITIAL_ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PTA_RECORDS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ZOOM_MEETINGS,
  INITIAL_DIRECT_MESSAGES,
  INITIAL_TEACHER_DUTY_LOGS,
  INITIAL_STORIES,
  INITIAL_GROUPS,
  INITIAL_GROUP_POSTS,
  INITIAL_FINANCE_PUBLICATIONS,
  INITIAL_PARENT_FEE_STATEMENTS,
  INITIAL_BUS_TRACKERS,
  INITIAL_GUARDIAN_PASSES,
  INITIAL_BEHAVIOR_LOGS,
  INITIAL_CONFERENCES,
  INITIAL_PERMISSION_SLIPS,
  INITIAL_CLINIC_VISITS,
  INITIAL_CANTEEN_WALLETS,
  ECZ_GRADING_SCALE
} from '../mockData';
import {
  getZambianCalendarInfo,
  autoSynchronizeSchoolWithZambianCalendar,
  getZambianTermsForYear
} from '../utils/zambianCalendar';

interface SchoolContextType {
  schools: School[];
  currentSchool: School;
  currentUser: User;
  allUsers: User[];
  assessments: AssessmentRecord[];
  reportCards: TermReportCard[];
  attendanceRecords: AttendanceRecord[];
  assignments: Assignment[];
  announcements: Announcement[];
  ptaRecords: PTARecord[];
  auditLogs: AuditLog[];
  notifications: AppNotification[];
  zoomMeetings: ZoomMeeting[];
  directMessages: DirectMessage[];
  teacherDutyLogs: TeacherDailyDutyLog[];
  stories: StoryItem[];
  groups: SchoolGroup[];
  groupPosts: GroupPost[];
  financePublications: FinancePublication[];
  activeLiveMeeting: ZoomMeeting | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: {
    role: UserRole;
    schoolId?: string;
    emailOrId?: string;
    password?: string;
    staffPassword?: string;
    fullName?: string;
    phone?: string;
    whatsAppNumber?: string;
    extraProfile?: any;
    isNewRegistration?: boolean;
    parentSubscriptionTier?: ParentSubscriptionTier;
  }) => { success: boolean; message?: string; user?: User };
  logout: () => void;
  updateStaffPassword: (schoolId: string, newStaffPassword: string) => void;
  verifyStaffPassword: (schoolId: string, passwordAttempt: string) => boolean;
  switchSchool: (schoolId: string) => void;
  switchUser: (userId: string) => void;
  updateSchoolSubscription: (
    schoolId: string,
    tier: SchoolStaffSubscriptionTier,
    billingCycle: 'monthly' | 'annually',
    paymentMethod: SubscriptionPaymentMethod
  ) => void;
  updateParentSubscription: (
    userId: string,
    tier: ParentSubscriptionTier,
    billingCycle: 'monthly' | 'annually',
    paymentMethod: SubscriptionPaymentMethod
  ) => void;
  createSchool: (schoolData: Partial<School>, headTeacherInfo: { name: string; email: string; phone: string; password?: string }) => School;
  registerUser: (userData: Partial<User>) => User;
  updateUserProfile: (userId: string, updatedData: Partial<User>) => void;
  updateUserProfilePic: (userId: string, avatarUrl: string) => void;
  updateUserCoverPhoto: (userId: string, coverPhotoUrl: string) => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  saveAssessment: (assessment: AssessmentRecord) => void;
  submitAssessment: (assessmentId: string) => void;
  approveAssessment: (assessmentId: string) => void;
  publishTermReportCards: (classId: string, termId: TermId) => void;
  recordAttendance: (record: AttendanceRecord) => void;
  createAssignment: (assignment: Assignment) => void;
  postAnnouncement: (announcement: Announcement) => void;
  updateSchoolCalendar: (terms: TermConfig[], calendarEvents: CalendarEvent[], weights: AssessmentWeighting, gradingScale: GradeBoundary[]) => void;
  linkChildToParent: (parentId: string, studentNumber: string) => boolean;
  promoteStudent: (studentId: string, targetGrade: string, targetClassId: string, nextAcademicYear: string) => void;
  promoteClass: (currentClassId: string, targetGrade: string, targetClassId: string, nextAcademicYear: string) => void;
  markNotificationRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  addAuditLog: (action: string, details: string) => void;
  scheduleZoomMeeting: (meeting: Omit<ZoomMeeting, 'id'>) => ZoomMeeting;
  updateZoomMeeting: (id: string, updates: Partial<ZoomMeeting>) => void;
  startInstantZoomClass: (
    topic: string,
    subjectName: string,
    className: string,
    grade?: string,
    aiModel?: string,
    educationMode?: string,
    lessonObjective?: string
  ) => ZoomMeeting;
  joinZoomMeeting: (meetingId: string) => void;
  leaveZoomMeeting: () => void;
  sendDirectMessage: (msg: Omit<DirectMessage, 'id' | 'timestamp' | 'isRead'>) => DirectMessage;
  markMessageRead: (id: string) => void;
  checkInTeacher: (teacherId?: string) => void;
  togglePeriodStatus: (logId: string, periodId: string, status: 'taught' | 'not_taught', reason?: string) => void;
  checkOutAndSendToManager: (logId: string, remarks?: string) => void;
  reviewTeacherDutyLog: (logId: string, status: 'reviewed' | 'approved') => void;
  
  // Facebook-Style Campus Stories
  addStory: (story: Omit<StoryItem, 'id' | 'timestamp' | 'likes' | 'reactions' | 'viewedByUserIds' | 'schoolId'>) => StoryItem;
  likeStory: (storyId: string) => void;
  reactToStory: (storyId: string, emoji: string) => void;
  deleteStory: (storyId: string) => void;
  
  // Group Classes, Grade Groups, PTA Hub & Clubs
  createGroup: (group: Omit<SchoolGroup, 'id' | 'schoolId' | 'postsCount' | 'recentActivity' | 'createdAt'>) => SchoolGroup;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  addGroupPost: (post: Omit<GroupPost, 'id' | 'schoolId' | 'likes' | 'comments' | 'createdAt'>) => GroupPost;
  likeGroupPost: (postId: string) => void;
  addPostComment: (postId: string, content: string) => void;

  // Finance Team Publications & Role-Based Publishing
  publishFinanceNotice: (pub: Omit<FinancePublication, 'id' | 'schoolId' | 'createdAt' | 'viewCount'>) => FinancePublication;
  deleteFinanceNotice: (id: string) => void;
  canViewFinanceNotice: (pub: FinancePublication, user?: User) => boolean;

  // Dedicated Parent Portal States & Actions
  parentFeeStatements: Record<string, ParentFeeStatement>;
  busTrackers: BusRouteTracker[];
  guardianPasses: Record<string, GuardianPickupPass>;
  behaviorLogs: StudentBehaviorLog[];
  conferences: ParentTeacherConference[];
  permissionSlips: PermissionSlip[];
  clinicVisits: HealthClinicVisit[];
  canteenWallets: Record<string, CanteenWallet>;
  zambianCalendarInfo: ZambianTermInfo;

  makeFeePayment: (studentNumber: string, amount: number, channel: PaymentChannel, feeItemName: string, notes?: string) => ParentPaymentTransaction;
  generateDailyGuardianPass: (studentNumber: string, guardianName: string, guardianPhone: string, guardianRelation: string) => GuardianPickupPass;
  acknowledgeBehaviorLog: (logId: string, parentNotes?: string) => void;
  bookConference: (conf: Omit<ParentTeacherConference, 'id' | 'status'>) => ParentTeacherConference;
  signPermissionSlip: (slipId: string, guardianSignature: string, medicalNotes?: string) => void;
  topUpCanteenWallet: (studentNumber: string, amount: number, channel: string) => void;
  setSchoolActiveTerm: (termId: TermId, year?: string) => void;
  syncZambianAcademicCalendar: (targetDate?: string) => void;

  resetDemoData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SCHOOLS: 'schoollink_schools_v1',
  USERS: 'schoollink_users_v1',
  CURRENT_USER_ID: 'schoollink_curr_user_id_v1',
  CURRENT_SCHOOL_ID: 'schoollink_curr_school_id_v1',
  IS_AUTH: 'schoollink_is_auth_v1',
  ASSESSMENTS: 'schoollink_assessments_v1',
  REPORT_CARDS: 'schoollink_report_cards_v1',
  ATTENDANCE: 'schoollink_attendance_v1',
  ASSIGNMENTS: 'schoollink_assignments_v1',
  ANNOUNCEMENTS: 'schoollink_announcements_v1',
  PTA: 'schoollink_pta_v1',
  AUDIT: 'schoollink_audit_v1',
  NOTIFICATIONS: 'schoollink_notifications_v1',
  ZOOM_MEETINGS: 'schoollink_zoom_meetings_v1',
  MESSAGES: 'schoollink_messages_v1',
  TEACHER_DUTY_LOGS: 'schoollink_teacher_duty_logs_v1',
  STORIES: 'schoollink_stories_v1',
  GROUPS: 'schoollink_groups_v1',
  GROUP_POSTS: 'schoollink_group_posts_v1',
  FINANCE_PUBS: 'schoollink_finance_pubs_v1',
  PARENT_FEES: 'schoollink_parent_fees_v1',
  BUS_TRACKERS: 'schoollink_bus_trackers_v1',
  GUARDIAN_PASSES: 'schoollink_guardian_passes_v1',
  BEHAVIOR_LOGS: 'schoollink_behavior_logs_v1',
  CONFERENCES: 'schoollink_conferences_v1',
  PERMISSION_SLIPS: 'schoollink_permission_slips_v1',
  CLINIC_VISITS: 'schoollink_clinic_visits_v1',
  CANTEEN_WALLETS: 'schoollink_canteen_wallets_v1',
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schools, setSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
    return saved ? JSON.parse(saved) : INITIAL_SCHOOLS;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentSchoolId, setCurrentSchoolId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SCHOOL_ID) || 'school_kabwe_tech';
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_head_banda';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_AUTH);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [assessments, setAssessments] = useState<AssessmentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  const [reportCards, setReportCards] = useState<TermReportCard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORT_CARDS);
    return saved ? JSON.parse(saved) : INITIAL_REPORT_CARDS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [ptaRecords, setPtaRecords] = useState<PTARecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PTA);
    return saved ? JSON.parse(saved) : INITIAL_PTA_RECORDS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [zoomMeetings, setZoomMeetings] = useState<ZoomMeeting[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ZOOM_MEETINGS);
    return saved ? JSON.parse(saved) : INITIAL_ZOOM_MEETINGS;
  });

  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_DIRECT_MESSAGES;
  });

  const [teacherDutyLogs, setTeacherDutyLogs] = useState<TeacherDailyDutyLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEACHER_DUTY_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_DUTY_LOGS;
  });

  const [stories, setStories] = useState<StoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORIES);
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [groups, setGroups] = useState<SchoolGroup[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [groupPosts, setGroupPosts] = useState<GroupPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROUP_POSTS);
    return saved ? JSON.parse(saved) : INITIAL_GROUP_POSTS;
  });

  const [financePublications, setFinancePublications] = useState<FinancePublication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FINANCE_PUBS);
    return saved ? JSON.parse(saved) : INITIAL_FINANCE_PUBLICATIONS;
  });

  const [parentFeeStatements, setParentFeeStatements] = useState<Record<string, ParentFeeStatement>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARENT_FEES);
    return saved ? JSON.parse(saved) : INITIAL_PARENT_FEE_STATEMENTS;
  });

  const [busTrackers, setBusTrackers] = useState<BusRouteTracker[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUS_TRACKERS);
    return saved ? JSON.parse(saved) : INITIAL_BUS_TRACKERS;
  });

  const [guardianPasses, setGuardianPasses] = useState<Record<string, GuardianPickupPass>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GUARDIAN_PASSES);
    return saved ? JSON.parse(saved) : INITIAL_GUARDIAN_PASSES;
  });

  const [behaviorLogs, setBehaviorLogs] = useState<StudentBehaviorLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BEHAVIOR_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_BEHAVIOR_LOGS;
  });

  const [conferences, setConferences] = useState<ParentTeacherConference[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFERENCES);
    return saved ? JSON.parse(saved) : INITIAL_CONFERENCES;
  });

  const [permissionSlips, setPermissionSlips] = useState<PermissionSlip[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PERMISSION_SLIPS);
    return saved ? JSON.parse(saved) : INITIAL_PERMISSION_SLIPS;
  });

  const [clinicVisits, setClinicVisits] = useState<HealthClinicVisit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLINIC_VISITS);
    return saved ? JSON.parse(saved) : INITIAL_CLINIC_VISITS;
  });

  const [canteenWallets, setCanteenWallets] = useState<Record<string, CanteenWallet>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CANTEEN_WALLETS);
    return saved ? JSON.parse(saved) : INITIAL_CANTEEN_WALLETS;
  });

  // Real-time Zambian Academic Calendar Computation Engine
  const [simulatedCalendarDate, setSimulatedCalendarDate] = useState<string | undefined>(undefined);
  const zambianCalendarInfo = getZambianCalendarInfo(simulatedCalendarDate);

  const [activeLiveMeeting, setActiveLiveMeeting] = useState<ZoomMeeting | null>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'notif_1',
        userId: 'user_parent_mweemba',
        title: 'Term 1 Report Card Published',
        message: 'Mubita Mweemba has attained an Aggregate 6 Distinction in Grade 9A! Official report card is ready for download.',
        type: 'result',
        timestamp: '2026-04-10T09:05:00Z',
        isRead: false,
      },
      {
        id: 'notif_2',
        userId: 'user_parent_mweemba',
        title: 'PTA Annual General Meeting',
        message: 'Annual General PTA meeting is set for Friday 10th April in the Main Hall.',
        type: 'pta',
        timestamp: '2026-04-09T08:35:00Z',
        isRead: false,
      },
      {
        id: 'notif_3',
        userId: 'user_student_mubita',
        title: 'Continuous Assessment Marks Published',
        message: 'Your CA-1, CA-2, and CA-3 Mathematics marks have been approved by the Head Teacher.',
        type: 'result',
        timestamp: '2026-04-09T17:00:00Z',
        isRead: true,
      },
    ];
  });

  // Sync to local storage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(schools)); }, [schools]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CURRENT_SCHOOL_ID, currentSchoolId); }, [currentSchoolId]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId); }, [currentUserId]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments)); }, [assessments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REPORT_CARDS, JSON.stringify(reportCards)); }, [reportCards]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords)); }, [attendanceRecords]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments)); }, [assignments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PTA, JSON.stringify(ptaRecords)); }, [ptaRecords]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.IS_AUTH, JSON.stringify(isAuthenticated)); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ZOOM_MEETINGS, JSON.stringify(zoomMeetings)); }, [zoomMeetings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(directMessages)); }, [directMessages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TEACHER_DUTY_LOGS, JSON.stringify(teacherDutyLogs)); }, [teacherDutyLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories)); }, [stories]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups)); }, [groups]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.GROUP_POSTS, JSON.stringify(groupPosts)); }, [groupPosts]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FINANCE_PUBS, JSON.stringify(financePublications)); }, [financePublications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PARENT_FEES, JSON.stringify(parentFeeStatements)); }, [parentFeeStatements]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BUS_TRACKERS, JSON.stringify(busTrackers)); }, [busTrackers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.GUARDIAN_PASSES, JSON.stringify(guardianPasses)); }, [guardianPasses]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BEHAVIOR_LOGS, JSON.stringify(behaviorLogs)); }, [behaviorLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CONFERENCES, JSON.stringify(conferences)); }, [conferences]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PERMISSION_SLIPS, JSON.stringify(permissionSlips)); }, [permissionSlips]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CLINIC_VISITS, JSON.stringify(clinicVisits)); }, [clinicVisits]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CANTEEN_WALLETS, JSON.stringify(canteenWallets)); }, [canteenWallets]);

  const currentSchool = schools.find((s) => s.id === currentSchoolId) || schools[0] || INITIAL_SCHOOLS[0];
  const currentUser = allUsers.find((u) => u.id === currentUserId) || allUsers[0] || INITIAL_USERS[0];

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      schoolId: currentSchool.id,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action,
      details,
      ipAddress: '102.140.211.' + Math.floor(Math.random() * 200 + 10),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateStaffPassword = (schoolId: string, newStaffPassword: string) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, staffPassword: newStaffPassword.trim() } : s))
    );
    addAuditLog('UPDATE_STAFF_PASSWORD', `Head Teacher updated the official school staff access password.`);
  };

  const verifyStaffPassword = (schoolId: string, passwordAttempt: string): boolean => {
    const target = schools.find((s) => s.id === schoolId);
    if (!target) return false;
    const officialPass = target.staffPassword || 'STAFF-2026';
    return officialPass.trim().toLowerCase() === passwordAttempt.trim().toLowerCase();
  };

  const updateSchoolSubscription = (
    schoolId: string,
    tier: SchoolStaffSubscriptionTier,
    billingCycle: 'monthly' | 'annually' = 'monthly',
    paymentMethod: SubscriptionPaymentMethod = 'airtel_money'
  ) => {
    const price = tier === 'premium' ? 450 : 400;
    const features =
      tier === 'premium'
        ? [
            'All Medium School Management Features',
            'Advanced Analytics & Cohort Pass Rate Trends',
            'AI-Powered School & Subject Insights',
            'Advanced Academic & Performance Reports',
            'Attendance Analytics & Chronic Absenteeism Heatmaps',
            'Advanced Staff & Student Management',
            'Teacher Excel Studio & Live Video Class Tools',
          ]
        : [
            'School Management & Classes',
            'Staff & Faculty Rosters',
            'Students & Parent Profiles',
            'Subjects & Curriculum Configuration',
            'Continuous Assessment Tests (CA-1 to CA-3)',
            'Examination & Marks Gradebook',
            'Assignments & Attendance Rolls',
            'Announcements & Circulars',
            'Standard Term Report Cards',
          ];

    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + (billingCycle === 'annually' ? 12 : 1));

    const updatedSub: SchoolStaffSubscription = {
      tier,
      pricePerMonthZMW: price,
      status: 'active',
      billingCycle,
      startDate: new Date().toISOString().split('T')[0],
      nextBillingDate: nextBilling.toISOString().split('T')[0],
      coveredStaffCount: allUsers.filter((u) => u.schoolId === schoolId && (u.role === 'head_teacher' || u.role === 'deputy_head_teacher' || u.role === 'teacher')).length || 1,
      lastPaymentReference: `MM-${Date.now().toString().slice(-8)}`,
      paymentMethod,
      features,
    };

    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, staffSubscription: updatedSub } : s))
    );

    addAuditLog(
      'SUBSCRIPTION_UPDATE',
      `School ${schoolId} updated staff subscription to ${tier.toUpperCase()} (K${price}/month) via ${paymentMethod.replace('_', ' ').toUpperCase()}. All faculty covered.`
    );
  };

  const updateParentSubscription = (
    userId: string,
    tier: ParentSubscriptionTier,
    billingCycle: 'monthly' | 'annually' = 'monthly',
    paymentMethod: SubscriptionPaymentMethod = 'airtel_money'
  ) => {
    const price = tier === 'premium' ? 200 : 150;
    const features =
      tier === 'premium'
        ? [
            'Access to Linked Children Results & Grades',
            'Assignments, Tests (CA-1 to CA-3) & Homework',
            'Daily Real-Time Attendance Alerts & Time-stamps',
            'School Announcements & Official Circulars',
            'Advanced Academic Progress & Multi-Term Trajectory Charts',
            'AI-Powered Learning Insights & Weakness Diagnosis',
            'Detailed Printable Report Cards with Security QR',
            'Advanced Attendance & Subject-Specific Analytics',
          ]
        : [
            'Access to Linked Children Results & Grades',
            'Assignments, Tests & Homework Portal',
            'Daily Attendance Status',
            'School Announcements & Circulars',
            'Basic Academic Progress Summary',
          ];

    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + (billingCycle === 'annually' ? 12 : 1));

    const updatedSub: ParentSubscription = {
      tier,
      pricePerMonthZMW: price,
      status: 'active',
      billingCycle,
      startDate: new Date().toISOString().split('T')[0],
      nextBillingDate: nextBilling.toISOString().split('T')[0],
      lastPaymentReference: `PMM-${Date.now().toString().slice(-8)}`,
      paymentMethod,
      features,
    };

    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, parentSubscription: updatedSub } : u))
    );

    addAuditLog(
      'PARENT_SUBSCRIPTION_UPDATE',
      `Parent user ${userId} updated subscription to ${tier.toUpperCase()} (K${price}/month).`
    );
  };

  const login = ({
    role,
    schoolId,
    emailOrId,
    password,
    staffPassword,
    fullName,
    phone,
    whatsAppNumber,
    extraProfile,
    isNewRegistration,
    parentSubscriptionTier,
  }: {
    role: UserRole;
    schoolId?: string;
    emailOrId?: string;
    password?: string;
    staffPassword?: string;
    fullName?: string;
    phone?: string;
    whatsAppNumber?: string;
    extraProfile?: any;
    isNewRegistration?: boolean;
    parentSubscriptionTier?: ParentSubscriptionTier;
  }): { success: boolean; message?: string; user?: User } => {
    // Special handling for platform admin
    if (role === 'platform_admin') {
      let adminUser = allUsers.find((u) => u.role === 'platform_admin');
      if (!adminUser) {
        adminUser = {
          id: 'user_platform_admin',
          fullName: fullName?.trim() || 'Dr. Kasongo Chileshe',
          email: emailOrId?.trim() || 'admin@schoollink.edu.zm',
          password: password || 'password123',
          role: 'platform_admin',
          userCategory: 'platform_admin',
          phone: phone?.trim() || '+260 977 100001',
          whatsAppNumber: whatsAppNumber?.trim() || phone?.trim() || '+260 977 100001',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          coverPhotoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
          schoolId: schools[0]?.id || 'school_kabwe_tech',
          schoolName: 'Platform Central Administration',
          verificationStatus: 'verified',
          createdAt: new Date().toISOString(),
          adminProfile: {
            superAdminId: 'PADM-ZAM-001',
            department: 'National School Management Platform Directorate',
            securityClearance: 'Level 5 (National Directorate)',
            authorizedBy: 'Ministry of Education & Platform Operations',
            contactOffice: 'Apex Tower, 7th Floor, Lusaka',
          },
        };
        setAllUsers((prev) => [adminUser!, ...prev]);
      }
      setCurrentUserId(adminUser.id);
      setIsAuthenticated(true);
      addAuditLog('SUPER_ADMIN_AUTH', `Platform Administrator ${adminUser.fullName} logged into central administration portal.`);
      return { success: true, user: adminUser };
    }

    const effectiveSchoolId = schoolId || schools[0]?.id || 'school_kabwe_tech';
    const targetSchool = schools.find((s) => s.id === effectiveSchoolId);
    if (!targetSchool) {
      return { success: false, message: 'Selected school was not found in the verified directory.' };
    }

    // If teacher or deputy head, verify staff password
    if (role === 'teacher' || role === 'deputy_head_teacher') {
      if (staffPassword) {
        const isStaffValid = verifyStaffPassword(effectiveSchoolId, staffPassword);
        if (!isStaffValid) {
          return {
            success: false,
            message: `Invalid staff security password for ${targetSchool.name}. Please obtain the official staff access code from the School Head Teacher.`,
          };
        }
      }
    }

    // Determine category
    const userCategory: UserCategory =
      role === 'head_teacher' || role === 'deputy_head_teacher' || role === 'teacher' || role === 'school_board'
        ? 'school_staff'
        : role === 'parent'
        ? 'parent'
        : role === 'student'
        ? 'student'
        : 'platform_admin';

    if (isNewRegistration) {
      // Create new user for this role and school
      const autoId = 'user_' + Date.now();
      const parentSub: ParentSubscription | undefined =
        role === 'parent'
          ? {
              tier: parentSubscriptionTier || 'medium',
              pricePerMonthZMW: (parentSubscriptionTier || 'medium') === 'premium' ? 200 : 150,
              status: 'active',
              billingCycle: 'monthly',
              startDate: new Date().toISOString().split('T')[0],
              nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
              lastPaymentReference: `PMM-${Date.now().toString().slice(-8)}`,
              paymentMethod: 'airtel_money',
              features:
                (parentSubscriptionTier || 'medium') === 'premium'
                  ? [
                      'Access to Linked Children Results & Grades',
                      'Assignments, Tests (CA-1 to CA-3) & Homework',
                      'Daily Real-Time Attendance Alerts & Time-stamps',
                      'School Announcements & Official Circulars',
                      'Advanced Academic Progress & Multi-Term Trajectory Charts',
                      'AI-Powered Learning Insights & Weakness Diagnosis',
                      'Detailed Printable Report Cards with Security QR',
                      'Advanced Attendance & Subject-Specific Analytics',
                    ]
                  : [
                      'Access to Linked Children Results & Grades',
                      'Assignments, Tests & Homework Portal',
                      'Daily Attendance Status',
                      'School Announcements & Circulars',
                      'Basic Academic Progress Summary',
                    ],
            }
          : undefined;

      const newUser: User = {
        id: autoId,
        fullName: fullName?.trim() || (role === 'student' ? 'New Student' : role === 'teacher' ? 'New Teacher' : 'New User'),
        email: emailOrId?.trim() || `${(fullName || 'user').toLowerCase().replace(/\s+/g, '.')}@schoollink.edu.zm`,
        password: password || 'password123',
        role,
        userCategory,
        phone: phone?.trim() || '+260 970 000000',
        whatsAppNumber: whatsAppNumber?.trim() || phone?.trim() || '+260 970 000000',
        avatarUrl:
          role === 'student'
            ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
            : role === 'teacher'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        schoolId: effectiveSchoolId,
        schoolName: targetSchool.name,
        verificationStatus: 'verified',
        createdAt: new Date().toISOString(),
        parentSubscription: parentSub,
        studentProfile: role === 'student' ? extraProfile : undefined,
        teacherProfile: role === 'teacher' || role === 'deputy_head_teacher' ? extraProfile : undefined,
        parentProfile: role === 'parent' ? extraProfile : undefined,
        boardProfile: role === 'school_board' ? extraProfile : undefined,
      };

      setAllUsers((prev) => [newUser, ...prev]);
      setCurrentSchoolId(effectiveSchoolId);
      setCurrentUserId(newUser.id);
      setIsAuthenticated(true);

      addAuditLog('USER_AUTHENTICATION', `${newUser.fullName} registered & logged in as ${newUser.role} (${userCategory}) at ${targetSchool.name}.`);
      return { success: true, user: newUser };
    }

    // Existing user lookup
    let existingUser = allUsers.find(
      (u) =>
        u.schoolId === effectiveSchoolId &&
        u.role === role &&
        (u.email.toLowerCase() === emailOrId?.toLowerCase() ||
          u.studentProfile?.studentNumber?.toLowerCase() === emailOrId?.toLowerCase() ||
          u.teacherProfile?.employeeNumber?.toLowerCase() === emailOrId?.toLowerCase())
    );

    // If not found by exact ID/email, fallback to finding first user of this role in this school
    if (!existingUser) {
      existingUser = allUsers.find((u) => u.schoolId === effectiveSchoolId && u.role === role);
    }

    // If still no user exists for that role in this school, create one
    if (!existingUser) {
      const autoId = 'user_' + Date.now();
      existingUser = {
        id: autoId,
        fullName: fullName?.trim() || `${targetSchool.name.split(' ')[0]} ${role.replace('_', ' ').toUpperCase()}`,
        email: emailOrId?.trim() || `user.${role}@schoollink.edu.zm`,
        password: password || 'password123',
        role,
        userCategory,
        phone: phone || '+260 977 123456',
        whatsAppNumber: whatsAppNumber || phone || '+260 977 123456',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        schoolId: effectiveSchoolId,
        schoolName: targetSchool.name,
        verificationStatus: 'verified',
        createdAt: new Date().toISOString(),
      };
      setAllUsers((prev) => [existingUser!, ...prev]);
    }

    setCurrentSchoolId(effectiveSchoolId);
    setCurrentUserId(existingUser.id);
    setIsAuthenticated(true);

    addAuditLog('USER_AUTHENTICATION', `${existingUser.fullName} logged in with role ${existingUser.role} at ${targetSchool.name}.`);
    return { success: true, user: existingUser };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchSchool = (schoolId: string) => {
    setCurrentSchoolId(schoolId);
    // switch to school's head teacher or first user of that school
    const schoolUser = allUsers.find((u) => u.schoolId === schoolId);
    if (schoolUser) {
      setCurrentUserId(schoolUser.id);
    }
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUserId(user.id);
      if (user.schoolId && user.schoolId !== currentSchoolId) {
        setCurrentSchoolId(user.schoolId);
      }
    }
  };

  const createSchool = (
    schoolData: Partial<School>,
    headTeacherInfo: { name: string; email: string; phone: string; password?: string }
  ): School => {
    const schoolId = 'school_' + Date.now();
    const cityCode = (schoolData.city || 'SCH').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `SCH-${cityCode}-${randomNum}`;
    const staffPassword = schoolData.staffPassword || `${cityCode}-STAFF-${randomNum}`;

    const headTeacherUserId = 'user_head_' + Date.now();

    const newSchool: School = {
      id: schoolId,
      code,
      name: schoolData.name || 'New Community Secondary School',
      motto: schoolData.motto || 'Excellence and Service',
      logo: schoolData.logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
      province: schoolData.province || 'Lusaka Province',
      city: schoolData.city || 'Lusaka',
      address: schoolData.address || 'Plot 100 Main Road',
      email: schoolData.email || headTeacherInfo.email,
      phone: schoolData.phone || headTeacherInfo.phone,
      registrationNumber: schoolData.registrationNumber || `MOE/SEC/${cityCode}/${randomNum}/2026`,
      staffPassword,
      createdById: headTeacherUserId,
      academicYear: schoolData.academicYear || '2026',
      activeTerm: 'term_1',
      terms: schoolData.terms || [
        {
          id: 'term_1',
          name: 'Term 1 (Jan - Apr)',
          startDate: '2026-01-12',
          endDate: '2026-04-10',
          weeksCount: 13,
          isActive: true,
          test1Week: 4,
          test2Week: 8,
          test3Week: 12,
          examWeek: 13,
          midTermWeek: 7,
        },
        {
          id: 'term_2',
          name: 'Term 2 (May - Aug)',
          startDate: '2026-05-11',
          endDate: '2026-08-07',
          weeksCount: 13,
          isActive: false,
          test1Week: 4,
          test2Week: 8,
          test3Week: 12,
          examWeek: 13,
          midTermWeek: 7,
        },
        {
          id: 'term_3',
          name: 'Term 3 (Sep - Dec)',
          startDate: '2026-09-07',
          endDate: '2026-12-04',
          weeksCount: 13,
          isActive: false,
          test1Week: 4,
          test2Week: 8,
          test3Week: 12,
          examWeek: 13,
          midTermWeek: 7,
        },
      ],
      assessmentWeighting: schoolData.assessmentWeighting || {
        test1Weight: 15,
        test2Weight: 15,
        test3Weight: 15,
        assignmentWeight: 15,
        examWeight: 40,
      },
      gradingScale: schoolData.gradingScale || ECZ_GRADING_SCALE,
      grades: schoolData.grades || ['8', '9', '10', '11', '12'],
      classes: schoolData.classes || [
        {
          id: `class_${schoolId}_8a`,
          name: 'Grade 8A',
          grade: '8',
          stream: 'A',
          classTeacherId: '',
          classTeacherName: 'To be assigned',
          studentCount: 35,
          roomNumber: 'Room 1',
        },
        {
          id: `class_${schoolId}_9a`,
          name: 'Grade 9A',
          grade: '9',
          stream: 'A',
          classTeacherId: '',
          classTeacherName: 'To be assigned',
          studentCount: 35,
          roomNumber: 'Room 2',
        },
      ],
      subjects: schoolData.subjects || [
        { id: 'sub_math', name: 'Mathematics', code: 'MAT-401', category: 'Core', gradesApplicable: ['8', '9', '10', '11', '12'] },
        { id: 'sub_eng', name: 'English Language', code: 'ENG-101', category: 'Core', gradesApplicable: ['8', '9', '10', '11', '12'] },
        { id: 'sub_sci', name: 'Integrated Science', code: 'SCI-201', category: 'Sciences', gradesApplicable: ['8', '9'] },
        { id: 'sub_cs', name: 'Computer Studies', code: 'CMP-301', category: 'Practical', gradesApplicable: ['8', '9', '10', '11', '12'] },
      ],
      calendarEvents: [
        { id: 'cal_op', title: 'School Opening Term 1', date: '2026-01-12', weekNumber: 1, termId: 'term_1', type: 'academic' },
        { id: 'cal_t1', title: 'Continuous Assessment Test 1 (CA-1)', date: '2026-02-02', weekNumber: 4, termId: 'term_1', type: 'test' },
        { id: 'cal_t2', title: 'Continuous Assessment Test 2 (CA-2)', date: '2026-03-02', weekNumber: 8, termId: 'term_1', type: 'test' },
        { id: 'cal_t3', title: 'Continuous Assessment Test 3 (CA-3)', date: '2026-03-30', weekNumber: 12, termId: 'term_1', type: 'test' },
        { id: 'cal_ex', title: 'End of Term 1 Final Examinations', date: '2026-04-06', weekNumber: 13, termId: 'term_1', type: 'exam' },
      ],
      passMark: schoolData.passMark || 50,
      ptaDuesAmount: schoolData.ptaDuesAmount || 400,
      currency: 'ZMW',
      createdAt: new Date().toISOString(),
    };

    const headTeacherUser: User = {
      id: headTeacherUserId,
      fullName: headTeacherInfo.name,
      email: headTeacherInfo.email,
      password: headTeacherInfo.password || 'password123',
      role: 'head_teacher',
      phone: headTeacherInfo.phone,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      schoolId: schoolId,
      schoolName: newSchool.name,
      verificationStatus: 'verified',
      createdAt: new Date().toISOString(),
    };

    setSchools((prev) => [newSchool, ...prev]);
    setAllUsers((prev) => [headTeacherUser, ...prev]);
    setCurrentSchoolId(schoolId);
    setCurrentUserId(headTeacherUser.id);
    setIsAuthenticated(true);

    const log: AuditLog = {
      id: 'log_' + Date.now(),
      schoolId: schoolId,
      timestamp: new Date().toISOString(),
      userId: headTeacherUser.id,
      userName: headTeacherUser.fullName,
      userRole: 'head_teacher',
      action: 'CREATE_SCHOOL',
      details: `Created new school ${newSchool.name} (Code: ${newSchool.code}) with Staff Password '${staffPassword}'. Initialized 13-week academic calendar and ECZ grading system.`,
      ipAddress: '102.140.211.50',
    };
    setAuditLogs((prev) => [log, ...prev]);

    return newSchool;
  };

  const registerUser = (userData: Partial<User>): User => {
    const newUser: User = {
      id: 'user_' + Date.now(),
      fullName: userData.fullName || 'New Member',
      email: userData.email || '',
      role: userData.role || 'student',
      phone: userData.phone || '',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      schoolId: userData.schoolId || currentSchoolId,
      schoolName: userData.schoolName || currentSchool.name,
      verificationStatus: userData.role === 'head_teacher' ? 'verified' : 'pending',
      createdAt: new Date().toISOString(),
      studentProfile: userData.studentProfile,
      teacherProfile: userData.teacherProfile,
      parentProfile: userData.parentProfile,
      boardProfile: userData.boardProfile,
    };

    setAllUsers((prev) => [newUser, ...prev]);
    addAuditLog('USER_REGISTRATION', `New user ${newUser.fullName} registered as ${newUser.role} (Status: ${newUser.verificationStatus}).`);

    // Notify School Head / Deputy of pending approval
    if (newUser.verificationStatus === 'pending') {
      const headUser = allUsers.find((u) => u.schoolId === newUser.schoolId && u.role === 'head_teacher');
      if (headUser) {
        const notif: AppNotification = {
          id: 'notif_' + Date.now(),
          userId: headUser.id,
          title: 'New User Verification Required',
          message: `${newUser.fullName} has registered as a ${newUser.role} and is awaiting administrative approval.`,
          type: 'approval',
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        setNotifications((prev) => [notif, ...prev]);
      }
    }

    return newUser;
  };

  const updateUserProfile = (userId: string, updatedData: Partial<User>) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const merged: User = {
            ...u,
            ...updatedData,
            studentProfile: updatedData.studentProfile
              ? { ...u.studentProfile, ...updatedData.studentProfile } as any
              : u.studentProfile,
            teacherProfile: updatedData.teacherProfile
              ? { ...u.teacherProfile, ...updatedData.teacherProfile } as any
              : u.teacherProfile,
            headTeacherProfile: updatedData.headTeacherProfile
              ? { ...u.headTeacherProfile, ...updatedData.headTeacherProfile } as any
              : u.headTeacherProfile,
            deputyProfile: updatedData.deputyProfile
              ? { ...u.deputyProfile, ...updatedData.deputyProfile } as any
              : u.deputyProfile,
            parentProfile: updatedData.parentProfile
              ? { ...u.parentProfile, ...updatedData.parentProfile } as any
              : u.parentProfile,
            boardProfile: updatedData.boardProfile
              ? { ...u.boardProfile, ...updatedData.boardProfile } as any
              : u.boardProfile,
          };
          return merged;
        }
        return u;
      })
    );

    addAuditLog(
      'UPDATE_PROFILE',
      `Updated comprehensive profile details for user ID ${userId} (${updatedData.fullName || 'User'}).`
    );

    const notif: AppNotification = {
      id: 'notif_' + Date.now(),
      userId: userId,
      title: 'Profile Updated Successfully',
      message: 'Your personal information, role details, and preferences were securely updated.',
      type: 'announcement',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const approveUser = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, verificationStatus: 'verified' } : u))
    );
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      addAuditLog('USER_VERIFICATION', `Approved and verified account for ${user.fullName} (${user.role}).`);
      const notif: AppNotification = {
        id: 'notif_' + Date.now(),
        userId: user.id,
        title: 'Account Verified & Activated',
        message: `Your ${user.role.replace('_', ' ')} account at ${user.schoolName} has been verified by School Administration.`,
        type: 'approval',
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const rejectUser = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, verificationStatus: 'rejected' } : u))
    );
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      addAuditLog('USER_REJECTION', `Rejected verification request for ${user.fullName} (${user.role}).`);
    }
  };

  const saveAssessment = (assessment: AssessmentRecord) => {
    setAssessments((prev) => {
      const index = prev.findIndex((a) => a.id === assessment.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = assessment;
        return updated;
      }
      return [assessment, ...prev];
    });
    addAuditLog('SAVE_MARKS', `Saved continuous assessment marks for ${assessment.subjectName} (${assessment.title}) in ${assessment.className}.`);
  };

  const submitAssessment = (assessmentId: string) => {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === assessmentId
          ? { ...a, status: 'submitted', submittedAt: new Date().toISOString() }
          : a
      )
    );
    const ass = assessments.find((a) => a.id === assessmentId);
    if (ass) {
      addAuditLog('SUBMIT_MARKS_FOR_APPROVAL', `Submitted marks for ${ass.subjectName} (${ass.title}) to Head/Deputy Teacher for review.`);
      // Notify Head and Deputy
      const managers = allUsers.filter(
        (u) => u.schoolId === ass.schoolId && (u.role === 'head_teacher' || u.role === 'deputy_head_teacher')
      );
      managers.forEach((mgr) => {
        const notif: AppNotification = {
          id: 'notif_' + Date.now() + Math.random(),
          userId: mgr.id,
          title: 'Marks Submitted for Approval',
          message: `${ass.teacherName} submitted ${ass.subjectName} (${ass.title}) results for ${ass.className}.`,
          type: 'approval',
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        setNotifications((p) => [notif, ...p]);
      });
    }
  };

  const approveAssessment = (assessmentId: string) => {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === assessmentId
          ? {
              ...a,
              status: 'approved',
              approvedAt: new Date().toISOString(),
              approvedBy: currentUser.fullName,
              isLocked: true,
            }
          : a
      )
    );
    const ass = assessments.find((a) => a.id === assessmentId);
    if (ass) {
      addAuditLog('APPROVE_MARKS', `Approved and locked marks for ${ass.subjectName} (${ass.title}) in ${ass.className}.`);
    }
  };

  const publishTermReportCards = (classId: string, termId: TermId) => {
    const targetClass = currentSchool.classes.find((c) => c.id === classId);
    const className = targetClass ? targetClass.name : classId;
    const termObj = currentSchool.terms.find((t) => t.id === termId);
    const termName = termObj ? termObj.name : 'Term 1';

    // Find all students in this class
    const classStudents = allUsers.filter(
      (u) => u.schoolId === currentSchool.id && u.role === 'student' && u.studentProfile?.classId === classId
    );

    // Pull all assessments for this class and term
    const classAssessments = assessments.filter(
      (a) => a.schoolId === currentSchool.id && a.classId === classId && a.termId === termId
    );

    const generatedCards: TermReportCard[] = classStudents.map((student, idx) => {
      // Calculate scores for each subject
      const subjectResults = currentSchool.subjects.map((sub) => {
        const subAssessments = classAssessments.filter((a) => a.subjectId === sub.id);
        const t1 = subAssessments.find((a) => a.type === 'test_1');
        const t2 = subAssessments.find((a) => a.type === 'test_2');
        const t3 = subAssessments.find((a) => a.type === 'test_3');
        const exam = subAssessments.find((a) => a.type === 'examination');

        const t1Score = t1?.scores.find((s) => s.studentId === student.id);
        const t2Score = t2?.scores.find((s) => s.studentId === student.id);
        const t3Score = t3?.scores.find((s) => s.studentId === student.id);
        const examScore = exam?.scores.find((s) => s.studentId === student.id);

        const t1Pct = t1Score ? t1Score.percentage : 80;
        const t2Pct = t2Score ? t2Score.percentage : 82;
        const t3Pct = t3Score ? t3Score.percentage : 85;
        const examPct = examScore ? examScore.percentage : 84;

        const w = currentSchool.assessmentWeighting;
        const caScorePct = ((t1Pct * w.test1Weight) + (t2Pct * w.test2Weight) + (t3Pct * w.test3Weight) + (85 * w.assignmentWeight)) / (w.test1Weight + w.test2Weight + w.test3Weight + w.assignmentWeight);
        const overallScorePct = Number((((caScorePct * 60) + (examPct * 40)) / 100).toFixed(1));

        // Determine ECZ Grade and Points
        let eczGrade = '1';
        let gradeLabel = 'Distinction';
        let eczPoints = 1;

        if (overallScorePct >= 75) {
          eczGrade = '1'; gradeLabel = 'Distinction'; eczPoints = 1;
        } else if (overallScorePct >= 70) {
          eczGrade = '2'; gradeLabel = 'Distinction'; eczPoints = 2;
        } else if (overallScorePct >= 65) {
          eczGrade = '3'; gradeLabel = 'Merit'; eczPoints = 3;
        } else if (overallScorePct >= 60) {
          eczGrade = '4'; gradeLabel = 'Merit'; eczPoints = 4;
        } else if (overallScorePct >= 55) {
          eczGrade = '5'; gradeLabel = 'Credit'; eczPoints = 5;
        } else if (overallScorePct >= 50) {
          eczGrade = '6'; gradeLabel = 'Credit'; eczPoints = 6;
        } else if (overallScorePct >= 45) {
          eczGrade = '7'; gradeLabel = 'Satisfactory'; eczPoints = 7;
        } else if (overallScorePct >= 40) {
          eczGrade = '8'; gradeLabel = 'Satisfactory'; eczPoints = 8;
        } else {
          eczGrade = '9'; gradeLabel = 'Unsatisfactory'; eczPoints = 9;
        }

        return {
          subjectId: sub.id,
          subjectName: sub.name,
          subjectCode: sub.code,
          teacherName: 'Subject Faculty',
          test1Score: t1Score ? { raw: t1Score.rawScore, max: t1Score.maxScore, pct: t1Score.percentage } : { raw: 16, max: 20, pct: 80 },
          test2Score: t2Score ? { raw: t2Score.rawScore, max: t2Score.maxScore, pct: t2Score.percentage } : { raw: 17, max: 20, pct: 85 },
          test3Score: t3Score ? { raw: t3Score.rawScore, max: t3Score.maxScore, pct: t3Score.percentage } : { raw: 18, max: 20, pct: 90 },
          assignmentAvgPct: 85,
          examScore: examScore ? { raw: examScore.rawScore, max: examScore.maxScore, pct: examScore.percentage } : { raw: 84, max: 100, pct: 84 },
          totalContinuousAssessmentPct: Number(caScorePct.toFixed(1)),
          finalExamPct: examPct,
          finalOverallPercentage: overallScorePct,
          eczGrade,
          gradeLabel,
          eczPoints,
          teacherRemarks: `Consistent diligence and good grasp of ${sub.name} concepts.`,
        };
      });

      const totalMarksObtained = subjectResults.reduce((acc, curr) => acc + curr.finalOverallPercentage, 0);
      const totalMaxPossibleMarks = subjectResults.length * 100;
      const averagePercentage = Number((totalMarksObtained / subjectResults.length).toFixed(1));

      // Calculate ECZ Best 6 Aggregate points
      const sortedPoints = [...subjectResults].map((s) => s.eczPoints).sort((a, b) => a - b);
      const best6Points = sortedPoints.slice(0, 6).reduce((acc, p) => acc + p, 0);

      const existingCard = reportCards.find(
        (r) => r.studentId === student.id && r.termId === termId && r.academicYear === currentSchool.academicYear
      );

      return {
        id: existingCard ? existingCard.id : `rep_${student.id}_${termId}_${Date.now()}`,
        schoolId: currentSchool.id,
        schoolName: currentSchool.name,
        studentId: student.id,
        studentNumber: student.studentProfile?.studentNumber || `STU-2026-00${idx + 10}`,
        studentName: student.fullName,
        gender: student.studentProfile?.gender || 'Male',
        grade: targetClass ? targetClass.grade : '9',
        classId,
        className,
        termId,
        termName,
        academicYear: currentSchool.academicYear,
        subjectResults,
        totalMarksObtained: Number(totalMarksObtained.toFixed(1)),
        totalMaxPossibleMarks,
        averagePercentage,
        aggregatePoints: best6Points || 6,
        positionInClass: idx + 1,
        totalStudentsInClass: classStudents.length || 35,
        attendanceDaysPresent: 63,
        attendanceDaysAbsent: 2,
        totalSchoolDays: 65,
        attendancePercentage: 96.9,
        classTeacherRemarks: `${student.fullName} has made commendable progress throughout the term. Shows high enthusiasm and discipline in all academic subjects.`,
        headTeacherRemarks: averagePercentage >= 75
          ? `Outstanding distinction aggregate. Recommended for special honors and advanced placement next academic session.`
          : `Good satisfactory performance. Continue revising core subjects during the recess.`,
        conduct: 'Very Good',
        nextTermBeginsDate: '2026-05-11',
        promotionStatus: 'Promoted to Next Grade',
        status: 'published',
        publishedDate: new Date().toISOString(),
        headTeacherSignatureName: 'Dr. Mwamba Banda (PhD, Ed.M)',
      };
    });

    setReportCards((prev) => {
      const remaining = prev.filter((r) => !(r.classId === classId && r.termId === termId && r.academicYear === currentSchool.academicYear));
      return [...generatedCards, ...remaining];
    });

    addAuditLog('PUBLISH_TERM_REPORT_CARDS', `Consolidated and published official term report cards for ${className} (${termName}).`);

    // Send notifications to all parents of students in this class
    classStudents.forEach((student) => {
      const parents = allUsers.filter(
        (u) =>
          u.role === 'parent' &&
          u.parentProfile?.connectedStudentNumbers.includes(student.studentProfile?.studentNumber || '')
      );
      parents.forEach((parent) => {
        const notif: AppNotification = {
          id: 'notif_' + Date.now() + Math.random(),
          userId: parent.id,
          title: `Report Card Published for ${student.fullName}`,
          message: `Official ${termName} report card for ${student.fullName} (${className}) is now published and available for viewing.`,
          type: 'result',
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        setNotifications((p) => [notif, ...p]);
      });

      // Also notify student
      const studentNotif: AppNotification = {
        id: 'notif_stu_' + Date.now() + Math.random(),
        userId: student.id,
        title: `${termName} Report Card Published`,
        message: `Your official ${termName} academic report card is now published. Check your grades and teacher comments.`,
        type: 'result',
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((p) => [studentNotif, ...p]);
    });
  };

  const recordAttendance = (record: AttendanceRecord) => {
    setAttendanceRecords((prev) => [record, ...prev]);
    addAuditLog('RECORD_ATTENDANCE', `Recorded daily attendance for ${record.className} on ${record.date}.`);

    // Notify parents of absent or late students
    record.entries.forEach((entry) => {
      if (entry.status === 'absent' || entry.status === 'late') {
        const parents = allUsers.filter(
          (u) =>
            u.role === 'parent' &&
            u.parentProfile?.connectedStudentNumbers.includes(entry.studentNumber)
        );
        parents.forEach((parent) => {
          const notif: AppNotification = {
            id: 'notif_att_' + Date.now() + Math.random(),
            userId: parent.id,
            title: `Attendance Alert: ${entry.studentName}`,
            message: `${entry.studentName} was marked ${entry.status.toUpperCase()} on ${record.date}${entry.reason ? ` (${entry.reason})` : ''}.`,
            type: 'attendance',
            timestamp: new Date().toISOString(),
            isRead: false,
          };
          setNotifications((p) => [notif, ...p]);
        });
      }
    });
  };

  const createAssignment = (assignment: Assignment) => {
    setAssignments((prev) => [assignment, ...prev]);
    addAuditLog('CREATE_ASSIGNMENT', `Created assignment '${assignment.title}' for ${assignment.className}.`);

    // Notify students of the class
    const students = allUsers.filter(
      (u) => u.schoolId === assignment.schoolId && u.role === 'student' && u.studentProfile?.classId === assignment.classId
    );
    students.forEach((stu) => {
      const notif: AppNotification = {
        id: 'notif_asg_' + Date.now() + Math.random(),
        userId: stu.id,
        title: `New Assignment: ${assignment.subjectName}`,
        message: `${assignment.title} has been assigned by ${assignment.teacherName}. Due date: ${assignment.dueDate}.`,
        type: 'assignment',
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((p) => [notif, ...p]);
    });
  };

  const postAnnouncement = (announcement: Announcement) => {
    setAnnouncements((prev) => [announcement, ...prev]);
    addAuditLog('POST_ANNOUNCEMENT', `Posted official announcement '${announcement.title}' (${announcement.category}).`);

    // Broadcast notifications to target roles
    const targetUsers = allUsers.filter(
      (u) => u.schoolId === announcement.schoolId && announcement.targetRoles.includes(u.role)
    );
    targetUsers.forEach((target) => {
      const notif: AppNotification = {
        id: 'notif_ann_' + Date.now() + Math.random(),
        userId: target.id,
        title: announcement.priority === 'urgent' ? `URGENT NOTICE: ${announcement.title}` : announcement.title,
        message: announcement.content.substring(0, 140) + '...',
        type: 'announcement',
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((p) => [notif, ...p]);
    });
  };

  const updateSchoolCalendar = (
    terms: TermConfig[],
    calendarEvents: CalendarEvent[],
    weights: AssessmentWeighting,
    gradingScale: GradeBoundary[]
  ) => {
    setSchools((prev) =>
      prev.map((s) =>
        s.id === currentSchool.id
          ? {
              ...s,
              terms,
              calendarEvents,
              assessmentWeighting: weights,
              gradingScale,
            }
          : s
      )
    );
    addAuditLog(
      'UPDATE_CALENDAR_AND_WEIGHTS',
      `Updated academic calendar milestones, term dates, and continuous assessment weights.`
    );
  };

  const linkChildToParent = (parentId: string, studentNumber: string): boolean => {
    const student = allUsers.find(
      (u) => u.schoolId === currentSchool.id && u.studentProfile?.studentNumber.trim().toUpperCase() === studentNumber.trim().toUpperCase()
    );
    if (!student) return false;

    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === parentId && u.parentProfile) {
          const currentList = u.parentProfile.connectedStudentNumbers || [];
          if (!currentList.includes(student.studentProfile!.studentNumber)) {
            return {
              ...u,
              parentProfile: {
                ...u.parentProfile,
                connectedStudentNumbers: [...currentList, student.studentProfile!.studentNumber],
              },
            };
          }
        }
        return u;
      })
    );

    addAuditLog('LINK_PARENT_CHILD', `Parent connected to student ${student.fullName} (${studentNumber}).`);
    return true;
  };

  const promoteStudent = (
    studentId: string,
    targetGrade: string,
    targetClassId: string,
    nextAcademicYear: string
  ) => {
    const student = allUsers.find((u) => u.id === studentId);
    if (!student || !student.studentProfile) return;

    const targetClass = currentSchool.classes.find((c) => c.id === targetClassId);
    const targetClassName = targetClass ? targetClass.name : `Grade ${targetGrade}`;

    // Get current student's existing report cards
    const studentReportCards = reportCards.filter((r) => r.studentId === studentId);
    const reportCardIds = studentReportCards.map((r) => r.id);
    const latestCard = studentReportCards[0];

    const historyEntry = {
      academicYear: currentSchool.academicYear,
      grade: student.studentProfile.grade,
      className: student.studentProfile.className,
      termReportCardIds: reportCardIds,
      averagePercentage: latestCard?.averagePercentage,
      aggregatePoints: latestCard?.aggregatePoints,
      promotionStatus: 'Promoted to ' + targetClassName,
      promotedAt: new Date().toISOString(),
    };

    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === studentId && u.studentProfile) {
          const currentHist = u.studentProfile.academicHistory || [];
          return {
            ...u,
            studentProfile: {
              ...u.studentProfile,
              grade: targetGrade,
              classId: targetClassId,
              className: targetClassName,
              academicHistory: [historyEntry, ...currentHist],
            },
          };
        }
        return u;
      })
    );

    addAuditLog(
      'ACADEMIC_PROMOTION',
      `Promoted student ${student.fullName} (${student.studentProfile.studentNumber}) from Grade ${student.studentProfile.grade} to ${targetClassName} for Academic Year ${nextAcademicYear}. Historical records archived.`
    );
  };

  const promoteClass = (
    currentClassId: string,
    targetGrade: string,
    targetClassId: string,
    nextAcademicYear: string
  ) => {
    const studentsInClass = allUsers.filter(
      (u) => u.schoolId === currentSchool.id && u.role === 'student' && u.studentProfile?.classId === currentClassId
    );

    studentsInClass.forEach((stu) => {
      promoteStudent(stu.id, targetGrade, targetClassId, nextAcademicYear);
    });

    addAuditLog(
      'BATCH_CLASS_PROMOTION',
      `Promoted entire class (${studentsInClass.length} students) to Grade ${targetGrade} for Academic Year ${nextAcademicYear}.`
    );
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const scheduleZoomMeeting = (meetingData: Omit<ZoomMeeting, 'id'>): ZoomMeeting => {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    const meetingIdFormatted = `${randomDigits.toString().slice(0, 3)} ${randomDigits.toString().slice(3, 7)} ${randomDigits.toString().slice(7, 11) || '2026'}`;
    const newMeeting: ZoomMeeting = {
      ...meetingData,
      id: 'zm_' + Date.now(),
      meetingId: meetingData.meetingId || meetingIdFormatted,
      passcode: meetingData.passcode || 'ECZ' + Math.floor(1000 + Math.random() * 9000),
      joinUrl: `https://zoom.us/j/${randomDigits}?pwd=${meetingData.passcode || 'ECZ2026'}&uname=${encodeURIComponent(currentUser.fullName)}`,
      attendeesCount: meetingData.attendeesCount || 0,
    };

    setZoomMeetings((prev) => [newMeeting, ...prev]);

    // Create automatic in-app notification for class members
    const newNotif: AppNotification = {
      id: 'notif_zm_' + Date.now(),
      userId: 'all_class_' + (meetingData.classId || 'cls_9a'),
      title: `Zoom Classroom Scheduled: ${meetingData.subjectName}`,
      message: `${meetingData.hostTeacherName} scheduled "${meetingData.topic}" for ${new Date(meetingData.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      type: 'zoom',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addAuditLog(
      'SCHEDULE_ZOOM_MEETING',
      `Teacher ${currentUser.fullName} scheduled Zoom Virtual Classroom "${newMeeting.topic}" (${newMeeting.meetingId}) for ${newMeeting.className}.`
    );

    return newMeeting;
  };

  const updateZoomMeeting = (id: string, updates: Partial<ZoomMeeting>) => {
    setZoomMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    if (activeLiveMeeting && activeLiveMeeting.id === id) {
      setActiveLiveMeeting((prev) => prev ? { ...prev, ...updates } : null);
    }
  };

  const startInstantZoomClass = (
    topic: string,
    subjectName: string,
    className: string,
    grade?: string,
    aiModel?: string,
    educationMode?: string,
    lessonObjective?: string
  ): ZoomMeeting => {
    const randomDigits = Math.floor(80000000000 + Math.random() * 19999999999);
    const meetingIdFormatted = `${randomDigits.toString().slice(0, 3)} ${randomDigits.toString().slice(3, 7)} ${randomDigits.toString().slice(7, 11)}`;
    const instantMeeting: ZoomMeeting = {
      id: 'zm_live_' + Date.now(),
      schoolId: currentSchool.id,
      topic,
      grade: grade || 'Grade 9',
      subjectId: 'sub_instant',
      subjectName,
      classId: 'cls_active',
      className,
      aiModel: aiModel || 'gemini-3.7-flash',
      educationMode: educationMode || 'interactive_tutor',
      hostTeacherId: currentUser.id,
      hostTeacherName: currentUser.fullName,
      hostAvatar: currentUser.avatarUrl,
      meetingId: meetingIdFormatted,
      passcode: 'CLASS' + Math.floor(100 + Math.random() * 900),
      startTime: new Date().toISOString(),
      durationMinutes: 45,
      status: 'live',
      joinUrl: `https://zoom.us/j/${randomDigits}?uname=${encodeURIComponent(currentUser.fullName)}`,
      lessonObjective: lessonObjective || `Live interactive classroom session for ${className} (${grade || 'Grade 9'}) ${subjectName}.`,
      curriculumCode: 'ECZ-LIVE-2026',
      attendeesCount: 1,
      isHostAudioMuted: false,
      isHostVideoOn: true,
    };

    setZoomMeetings((prev) => [instantMeeting, ...prev]);
    setActiveLiveMeeting(instantMeeting);

    addAuditLog(
      'START_INSTANT_ZOOM',
      `Live Zoom Classroom room opened by ${currentUser.fullName}: "${topic}".`
    );

    return instantMeeting;
  };

  const joinZoomMeeting = (meetingId: string) => {
    const found = zoomMeetings.find((m) => m.id === meetingId || m.meetingId === meetingId);
    if (found) {
      setActiveLiveMeeting(found);
      // Increment attendees if not already updated
      setZoomMeetings((prev) =>
        prev.map((m) => (m.id === found.id ? { ...m, attendeesCount: Math.max(m.attendeesCount + 1, 2) } : m))
      );
    }
  };

  const leaveZoomMeeting = () => {
    setActiveLiveMeeting(null);
  };

  const sendDirectMessage = (msgData: Omit<DirectMessage, 'id' | 'timestamp' | 'isRead'>): DirectMessage => {
    const newMsg: DirectMessage = {
      ...msgData,
      id: 'msg_' + Date.now(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setDirectMessages((prev) => [newMsg, ...prev]);

    // Send push notification to recipient
    const recipientNotif: AppNotification = {
      id: 'notif_msg_' + Date.now(),
      userId: msgData.receiverId,
      title: `Message from ${msgData.senderName}`,
      message: msgData.subject || (msgData.content.slice(0, 70) + '...'),
      type: 'message',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [recipientNotif, ...prev]);

    return newMsg;
  };

  const markMessageRead = (id: string) => {
    setDirectMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  const checkInTeacher = (teacherId?: string) => {
    const targetTeacherId = teacherId || currentUser.id;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = now.toISOString().split('T')[0];

    setTeacherDutyLogs((prev) => {
      const existingIndex = prev.findIndex((log) => log.teacherId === targetTeacherId && log.date === dateStr);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          checkInConfirmed: true,
          checkInTime: timeStr,
          checkInTimestamp: now.toISOString(),
        };
        return updated;
      } else {
        const newLog: TeacherDailyDutyLog = {
          id: 'duty_' + targetTeacherId + '_' + Date.now(),
          teacherId: targetTeacherId,
          teacherName: currentUser.fullName,
          teacherNumber: currentUser.teacherProfile?.tscNumber || 'TS-2026-049',
          schoolId: currentSchool.id,
          date: dateStr,
          checkInConfirmed: true,
          checkInTime: timeStr,
          checkInTimestamp: now.toISOString(),
          checkOutConfirmed: false,
          checkOutTime: null,
          checkOutTimestamp: null,
          periods: [
            {
              id: 'p_' + Date.now() + '_1',
              periodNumber: 1,
              timeRange: '08:00 - 08:45',
              className: currentUser.teacherProfile?.classesAssigned?.[0] || 'Grade 9A',
              subjectName: currentUser.teacherProfile?.specialization?.split(',')[0] || 'Mathematics',
              room: 'Room 12 (North Wing)',
              topic: 'Quadratic Curves & Turning Point Coordinates',
              status: 'taught',
              curriculumReference: 'ECZ-MATH-G9',
            },
            {
              id: 'p_' + Date.now() + '_2',
              periodNumber: 2,
              timeRange: '08:45 - 09:30',
              className: currentUser.teacherProfile?.classesAssigned?.[1] || 'Grade 9B',
              subjectName: currentUser.teacherProfile?.specialization?.split(',')[0] || 'Mathematics',
              room: 'Room 14',
              topic: 'Factorisation of Trinomials & Common Factors',
              status: 'taught',
              curriculumReference: 'ECZ-MATH-G9',
            },
            {
              id: 'p_' + Date.now() + '_3',
              periodNumber: 3,
              timeRange: '09:45 - 10:30',
              className: 'Grade 11 Science',
              subjectName: 'Pure Mathematics',
              room: 'Lab B',
              topic: 'Calculus: Differentiation from First Principles',
              status: 'taught',
              curriculumReference: 'ECZ-MATH-G11',
            },
            {
              id: 'p_' + Date.now() + '_4',
              periodNumber: 4,
              timeRange: '10:30 - 11:15',
              className: 'Grade 10A',
              subjectName: 'Mathematics',
              room: 'Room 12',
              topic: 'Matrices: Determinant and Inverse of 2x2 Matrix',
              status: 'not_taught',
              reasonIfNotTaught: 'Relief duty covering laboratory setup',
              curriculumReference: 'ECZ-MATH-G10',
            },
            {
              id: 'p_' + Date.now() + '_5',
              periodNumber: 5,
              timeRange: '11:45 - 12:30',
              className: 'Grade 12 Tech',
              subjectName: 'Additional Mathematics',
              room: 'Comp Lab 1',
              topic: 'Linear Programming & Feasible Regions',
              status: 'taught',
              curriculumReference: 'ECZ-MATH-G12',
            },
            {
              id: 'p_' + Date.now() + '_6',
              periodNumber: 6,
              timeRange: '14:00 - 15:00',
              className: 'Grade 9 Remedial',
              subjectName: 'Mathematics Consultation',
              room: 'Zoom Virtual Room 102',
              topic: 'Interactive Problem Solving & Homework Clarifications',
              status: 'taught',
              curriculumReference: 'ECZ-REMEDIAL-2026',
            }
          ],
          totalPeriodsTaught: 5,
          totalPeriodsScheduled: 6,
          dutyHandoverRemarks: '',
          sentToSchoolManager: false,
          sentToManagerTime: null,
          schoolManagerStatus: 'submitted',
        };
        return [newLog, ...prev];
      }
    });

    addAuditLog(
      'TEACHER_CHECK_IN',
      `Teacher ${currentUser.fullName} confirmed campus arrival check-in at ${timeStr}.`
    );
  };

  const togglePeriodStatus = (logId: string, periodId: string, status: 'taught' | 'not_taught', reason?: string) => {
    setTeacherDutyLogs((prev) =>
      prev.map((log) => {
        if (log.id !== logId) return log;
        const updatedPeriods = log.periods.map((p) =>
          p.id === periodId ? { ...p, status, reasonIfNotTaught: status === 'not_taught' ? (reason || 'Scheduled adjustment / Relief coverage') : undefined } : p
        );
        const taughtCount = updatedPeriods.filter((p) => p.status === 'taught').length;
        return {
          ...log,
          periods: updatedPeriods,
          totalPeriodsTaught: taughtCount,
          totalPeriodsScheduled: updatedPeriods.length,
        };
      })
    );
  };

  const checkOutAndSendToManager = (logId: string, remarks?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    let teacherName = currentUser.fullName;
    let taughtCount = 0;
    let totalCount = 0;

    setTeacherDutyLogs((prev) =>
      prev.map((log) => {
        if (log.id !== logId) return log;
        teacherName = log.teacherName;
        taughtCount = log.periods.filter((p) => p.status === 'taught').length;
        totalCount = log.periods.length;
        return {
          ...log,
          checkOutConfirmed: true,
          checkOutTime: timeStr,
          checkOutTimestamp: now.toISOString(),
          sentToSchoolManager: true,
          sentToManagerTime: timeStr,
          dutyHandoverRemarks: remarks !== undefined ? remarks : log.dutyHandoverRemarks,
          schoolManagerStatus: 'submitted',
        };
      })
    );

    // Dispatch automatic duty report notification to Head Teacher / School Manager
    const headTeachers = allUsers.filter(
      (u) => u.role === 'head_teacher' || u.role === 'deputy_head_teacher' || u.role === 'school_board'
    );
    
    headTeachers.forEach((admin) => {
      const adminNotif: AppNotification = {
        id: 'notif_duty_' + Date.now() + '_' + admin.id,
        userId: admin.id,
        title: `Teacher Knock-Off Report: ${teacherName}`,
        message: `${teacherName} has clocked out at ${timeStr}. Classes taught: ${taughtCount}/${totalCount}. Daily duty register submitted for school manager verification.`,
        type: 'approval',
        timestamp: now.toISOString(),
        isRead: false,
      };
      setNotifications((nPrev) => [adminNotif, ...nPrev]);
    });

    addAuditLog(
      'TEACHER_KNOCK_OFF',
      `Teacher ${teacherName} knocked out at ${timeStr}. Duty report (${taughtCount}/${totalCount} classes taught) automatically dispatched to School Manager.`
    );
  };

  const reviewTeacherDutyLog = (logId: string, status: 'reviewed' | 'approved') => {
    setTeacherDutyLogs((prev) =>
      prev.map((log) => (log.id === logId ? { ...log, schoolManagerStatus: status } : log))
    );
    addAuditLog(
      'DUTY_LOG_REVIEW',
      `School Manager verified and marked teacher daily register as ${status.toUpperCase()}.`
    );
  };

  // Profile Picture and Cover Photo update methods
  const updateUserProfilePic = (userId: string, avatarUrl: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, avatarUrl } : u))
    );
    addAuditLog('UPDATE_PROFILE_AVATAR', `User updated profile avatar photo.`);
  };

  const updateUserCoverPhoto = (userId: string, coverPhotoUrl: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, coverPhotoUrl } : u))
    );
    addAuditLog('UPDATE_COVER_PHOTO', `User updated profile banner cover photo.`);
  };

  // Facebook-Style Stories
  const addStory = (storyData: Omit<StoryItem, 'id' | 'timestamp' | 'likes' | 'reactions' | 'viewedByUserIds' | 'schoolId'>): StoryItem => {
    const now = new Date();
    const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    const newStory: StoryItem = {
      ...storyData,
      id: 'story_' + Date.now(),
      schoolId: currentSchool.id,
      timestamp: now.toISOString(),
      expiresAt: expiry.toISOString(),
      likes: [],
      reactions: [],
      viewedByUserIds: [currentUser.id]
    };

    setStories((prev) => [newStory, ...prev]);
    addAuditLog('POST_STORY', `${currentUser.fullName} added a new Campus Story.`);
    return newStory;
  };

  const likeStory = (storyId: string) => {
    setStories((prev) =>
      prev.map((st) => {
        if (st.id !== storyId) return st;
        const alreadyLiked = st.likes.includes(currentUser.id);
        const updatedLikes = alreadyLiked
          ? st.likes.filter((id) => id !== currentUser.id)
          : [...st.likes, currentUser.id];
        return { ...st, likes: updatedLikes };
      })
    );
  };

  const reactToStory = (storyId: string, emoji: string) => {
    setStories((prev) =>
      prev.map((st) => {
        if (st.id !== storyId) return st;
        const filteredReactions = st.reactions.filter((r) => r.userId !== currentUser.id);
        const newReaction = {
          userId: currentUser.id,
          emoji,
          userName: currentUser.fullName
        };
        const updatedReactions = [...filteredReactions, newReaction];
        const updatedViewers = st.viewedByUserIds.includes(currentUser.id)
          ? st.viewedByUserIds
          : [...st.viewedByUserIds, currentUser.id];

        return { ...st, reactions: updatedReactions, viewedByUserIds: updatedViewers };
      })
    );
  };

  const deleteStory = (storyId: string) => {
    setStories((prev) => prev.filter((st) => st.id !== storyId));
    addAuditLog('DELETE_STORY', `Story deleted.`);
  };

  // Group Classes, Grade Groups, PTA Hub
  const createGroup = (groupData: Omit<SchoolGroup, 'id' | 'schoolId' | 'postsCount' | 'recentActivity' | 'createdAt'>): SchoolGroup => {
    const newGroup: SchoolGroup = {
      ...groupData,
      id: 'grp_' + Date.now(),
      schoolId: currentSchool.id,
      postsCount: 0,
      recentActivity: 'Just now',
      createdAt: new Date().toISOString(),
      memberIds: groupData.memberIds ? Array.from(new Set([...groupData.memberIds, currentUser.id])) : [currentUser.id]
    };

    setGroups((prev) => [newGroup, ...prev]);
    addAuditLog('CREATE_GROUP', `${currentUser.fullName} created group: ${newGroup.name}`);
    return newGroup;
  };

  const joinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        if (g.memberIds.includes(currentUser.id)) return g;
        return { ...g, memberIds: [...g.memberIds, currentUser.id] };
      })
    );
  };

  const leaveGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return { ...g, memberIds: g.memberIds.filter((id) => id !== currentUser.id) };
      })
    );
  };

  const addGroupPost = (postData: Omit<GroupPost, 'id' | 'schoolId' | 'likes' | 'comments' | 'createdAt'>): GroupPost => {
    const newPost: GroupPost = {
      ...postData,
      id: 'post_' + Date.now(),
      schoolId: currentSchool.id,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    setGroupPosts((prev) => [newPost, ...prev]);
    setGroups((prev) =>
      prev.map((g) => (g.id === postData.groupId ? { ...g, postsCount: g.postsCount + 1, recentActivity: 'Just now' } : g))
    );
    addAuditLog('POST_GROUP_MESSAGE', `${currentUser.fullName} posted in group.`);
    return newPost;
  };

  const likeGroupPost = (postId: string) => {
    setGroupPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const alreadyLiked = p.likes.includes(currentUser.id);
        const updatedLikes = alreadyLiked
          ? p.likes.filter((id) => id !== currentUser.id)
          : [...p.likes, currentUser.id];
        return { ...p, likes: updatedLikes };
      })
    );
  };

  const addPostComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: 'comm_' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorAvatar: currentUser.avatarUrl,
      authorRole: currentUser.role,
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    setGroupPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
  };

  // Finance Publications & Role Permissions
  const canViewFinanceNotice = (pub: FinancePublication, user?: User): boolean => {
    const targetUser = user || currentUser;
    if (!targetUser) return false;

    // Broadcast to everyone
    if (pub.targetAudience === 'all_roles') return true;

    // Restricted finance notices: Only Parents, Head Teacher, Deputy Head, School Board, or Teachers in Finance Team
    if (pub.targetAudience === 'finance_restricted') {
      if (
        targetUser.role === 'parent' ||
        targetUser.role === 'head_teacher' ||
        targetUser.role === 'deputy_head_teacher' ||
        targetUser.role === 'school_board' ||
        targetUser.isFinanceTeam === true
      ) {
        return true;
      }
      return false;
    }

    return true;
  };

  const publishFinanceNotice = (pubData: Omit<FinancePublication, 'id' | 'schoolId' | 'createdAt' | 'viewCount'>): FinancePublication => {
    const newPub: FinancePublication = {
      ...pubData,
      id: 'fin_pub_' + Date.now(),
      schoolId: currentSchool.id,
      createdAt: new Date().toISOString(),
      viewCount: 1
    };

    setFinancePublications((prev) => [newPub, ...prev]);

    // Dispatch notification to authorized recipients
    if (newPub.targetAudience === 'finance_restricted') {
      const eligibleUsers = allUsers.filter(
        (u) =>
          u.role === 'parent' ||
          u.role === 'head_teacher' ||
          u.role === 'deputy_head_teacher' ||
          u.role === 'school_board' ||
          u.isFinanceTeam === true
      );

      eligibleUsers.forEach((u) => {
        if (u.id !== currentUser.id) {
          const notif: AppNotification = {
            id: 'notif_fin_' + Date.now() + '_' + u.id,
            userId: u.id,
            title: `Finance Bulletin: ${newPub.title}`,
            message: `Official Finance Team release: ${newPub.content.slice(0, 100)}...`,
            type: 'announcement',
            timestamp: new Date().toISOString(),
            isRead: false
          };
          setNotifications((prevN) => [notif, ...prevN]);
        }
      });
    } else {
      // General publishing to EVERY ROLE
      allUsers.forEach((u) => {
        if (u.id !== currentUser.id) {
          const notif: AppNotification = {
            id: 'notif_pub_' + Date.now() + '_' + u.id,
            userId: u.id,
            title: `School Bulletin: ${newPub.title}`,
            message: `${newPub.content.slice(0, 100)}...`,
            type: 'announcement',
            timestamp: new Date().toISOString(),
            isRead: false
          };
          setNotifications((prevN) => [notif, ...prevN]);
        }
      });
    }

    addAuditLog(
      'PUBLISH_FINANCE_NOTICE',
      `${currentUser.fullName} (${pubData.financeRoleTitle || currentUser.role}) published: ${newPub.title} [Audience: ${newPub.targetAudience}]`
    );

    return newPub;
  };

  const deleteFinanceNotice = (id: string) => {
    setFinancePublications((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE_FINANCE_NOTICE', `Finance Notice removed.`);
  };

  // -------------------------------------------------------------
  // ZAMBIAN ACADEMIC CALENDAR SYNCHRONIZATION
  // -------------------------------------------------------------
  const syncZambianAcademicCalendar = (targetDate?: string) => {
    setSimulatedCalendarDate(targetDate);
    const info = getZambianCalendarInfo(targetDate);
    setSchools((prev) =>
      prev.map((s) => autoSynchronizeSchoolWithZambianCalendar(s, targetDate))
    );
    addAuditLog(
      'SYNC_ZAMBIAN_CALENDAR',
      `Academic Calendar auto-synchronized to ${info.year} (${info.termName}) - Week ${info.currentWeek}.`
    );
  };

  const setSchoolActiveTerm = (termId: TermId, year?: string) => {
    const yr = year ? parseInt(year, 10) : zambianCalendarInfo.year;
    const terms = getZambianTermsForYear(yr).map((t) => ({
      ...t,
      isActive: t.id === termId,
    }));
    setSchools((prev) =>
      prev.map((s) =>
        s.id === currentSchool.id
          ? {
              ...s,
              academicYear: `${yr}`,
              activeTerm: termId,
              terms,
            }
          : s
      )
    );
    addAuditLog('SET_ACTIVE_TERM', `Switched active school term to ${termId.toUpperCase()} for Academic Year ${yr}.`);
  };

  // -------------------------------------------------------------
  // PARENT ACTIONS (FEES, PASSES, BEHAVIOR, CONFERENCES, PERMISSIONS)
  // -------------------------------------------------------------
  const makeFeePayment = (
    studentNumber: string,
    amount: number,
    channel: PaymentChannel,
    feeItemName: string,
    notes?: string
  ): ParentPaymentTransaction => {
    const receiptNum = `KT-REC-${zambianCalendarInfo.year}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: ParentPaymentTransaction = {
      id: `tx_pay_${Date.now()}`,
      receiptNumber: receiptNum,
      studentNumber,
      studentName: currentUser.parentProfile?.connectedStudentNumbers?.includes(studentNumber) ? 'Chileshe Mwila' : 'Learner',
      parentId: currentUser.id,
      parentName: currentUser.fullName,
      amount,
      termId: currentSchool.activeTerm,
      academicYear: currentSchool.academicYear,
      channel,
      referenceNumber: `${channel.toUpperCase().substring(0, 3)}-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      feeItemName,
      notes: notes || `Direct mobile payment via ${channel.replace('_', ' ').toUpperCase()}`,
    };

    // Update parent fee statement
    setParentFeeStatements((prev) => {
      const existing = prev[studentNumber] || {
        studentNumber,
        studentName: 'Chileshe Mwila',
        className: 'Grade 9A',
        academicYear: currentSchool.academicYear,
        termId: currentSchool.activeTerm,
        totalInvoiced: 2850,
        totalPaid: 0,
        balanceDue: 2850,
        dueDate: '2026-02-28',
        items: [],
        transactions: [],
      };

      const updatedPaid = (existing.totalPaid || 0) + amount;
      const updatedBalance = Math.max(0, existing.totalInvoiced - updatedPaid);

      return {
        ...prev,
        [studentNumber]: {
          ...existing,
          totalPaid: updatedPaid,
          balanceDue: updatedBalance,
          transactions: [newTx, ...(existing.transactions || [])],
        },
      };
    });

    // Notify Parent & School leadership
    const newNotif: AppNotification = {
      id: `notif_pay_${Date.now()}`,
      userId: currentUser.id,
      title: 'Official Payment Receipt Generated',
      message: `Your payment of ZMW ${amount.toLocaleString()} for ${feeItemName} (Receipt: ${receiptNum}) has been verified.`,
      type: 'pta',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addAuditLog('FEE_PAYMENT_PROCESSED', `Parent ${currentUser.fullName} made payment of ZMW ${amount} for ${studentNumber} (Receipt: ${receiptNum}).`);

    return newTx;
  };

  const generateDailyGuardianPass = (
    studentNumber: string,
    guardianName: string,
    guardianPhone: string,
    guardianRelation: string
  ): GuardianPickupPass => {
    const pin = `${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const newPass: GuardianPickupPass = {
      studentNumber,
      studentName: 'Chileshe Mwila',
      guardianName,
      guardianPhone,
      guardianRelation,
      dailySecurityPin: pin,
      qrVerificationCode: `KTH-SEC-GATE-PASS-${studentNumber}-${pin}`,
      validDate: dateStr,
      authorizedByHead: true,
      pickupTimeWindow: '15:30 - 17:15 PM',
    };

    setGuardianPasses((prev) => ({
      ...prev,
      [studentNumber]: newPass,
    }));

    addAuditLog('GENERATE_GUARDIAN_PASS', `Daily Security Gate Pick-up PIN generated for ${studentNumber} (PIN: ${pin}).`);
    return newPass;
  };

  const acknowledgeBehaviorLog = (logId: string, parentNotes?: string) => {
    setBehaviorLogs((prev) =>
      prev.map((log) =>
        log.id === logId
          ? {
              ...log,
              acknowledgedByParent: true,
              parentNotes: parentNotes || log.parentNotes,
            }
          : log
      )
    );
    addAuditLog('ACKNOWLEDGE_BEHAVIOR', `Parent signed & acknowledged student conduct record.`);
  };

  const bookConference = (conf: Omit<ParentTeacherConference, 'id' | 'status'>): ParentTeacherConference => {
    const newConf: ParentTeacherConference = {
      ...conf,
      id: `ptc_${Date.now()}`,
      status: 'confirmed',
    };
    setConferences((prev) => [newConf, ...prev]);

    const notif: AppNotification = {
      id: `notif_conf_${Date.now()}`,
      userId: currentUser.id,
      title: 'Parent-Teacher Conference Confirmed',
      message: `Your appointment with ${conf.teacherName} (${conf.subjectName}) is confirmed for ${conf.date} at ${conf.timeSlot}.`,
      type: 'pta',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('BOOK_CONFERENCE', `Parent ${currentUser.fullName} booked conference with ${conf.teacherName}.`);
    return newConf;
  };

  const signPermissionSlip = (slipId: string, guardianSignature: string, medicalNotes?: string) => {
    setPermissionSlips((prev) =>
      prev.map((slip) =>
        slip.id === slipId
          ? {
              ...slip,
              status: 'signed',
              signedByParentId: currentUser.id,
              signedTimestamp: new Date().toISOString(),
              guardianSignatureName: guardianSignature,
              medicalConditionsNote: medicalNotes || slip.medicalConditionsNote,
            }
          : slip
      )
    );
    addAuditLog('SIGN_PERMISSION_SLIP', `Parent digitally signed field trip permission slip.`);
  };

  const topUpCanteenWallet = (studentNumber: string, amount: number, channel: string) => {
    setCanteenWallets((prev) => {
      const existing = prev[studentNumber] || {
        studentNumber,
        studentName: 'Chileshe Mwila',
        currentBalanceZMW: 0,
        dietaryRestrictions: [],
        dailySpendingLimitZMW: 35,
        recentTransactions: [],
      };

      const newTx = {
        id: `c_tx_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        itemDescription: `Mobile Money Parent Wallet Top-Up (${channel})`,
        amount,
        type: 'top_up' as const,
        channel,
      };

      return {
        ...prev,
        [studentNumber]: {
          ...existing,
          currentBalanceZMW: existing.currentBalanceZMW + amount,
          recentTransactions: [newTx, ...existing.recentTransactions],
        },
      };
    });

    addAuditLog('CANTEEN_TOPUP', `Topped up canteen smart wallet by ZMW ${amount} for ${studentNumber}.`);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setSchools(INITIAL_SCHOOLS);
    setAllUsers(INITIAL_USERS);
    setCurrentSchoolId('school_kabwe_tech');
    setCurrentUserId('user_head_banda');
    setAssessments(INITIAL_ASSESSMENTS);
    setReportCards(INITIAL_REPORT_CARDS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setAssignments(INITIAL_ASSIGNMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setPtaRecords(INITIAL_PTA_RECORDS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setZoomMeetings(INITIAL_ZOOM_MEETINGS);
    setDirectMessages(INITIAL_DIRECT_MESSAGES);
    setTeacherDutyLogs(INITIAL_TEACHER_DUTY_LOGS);
    setStories(INITIAL_STORIES);
    setGroups(INITIAL_GROUPS);
    setGroupPosts(INITIAL_GROUP_POSTS);
    setFinancePublications(INITIAL_FINANCE_PUBLICATIONS);
    setParentFeeStatements(INITIAL_PARENT_FEE_STATEMENTS);
    setBusTrackers(INITIAL_BUS_TRACKERS);
    setGuardianPasses(INITIAL_GUARDIAN_PASSES);
    setBehaviorLogs(INITIAL_BEHAVIOR_LOGS);
    setConferences(INITIAL_CONFERENCES);
    setPermissionSlips(INITIAL_PERMISSION_SLIPS);
    setClinicVisits(INITIAL_CLINIC_VISITS);
    setCanteenWallets(INITIAL_CANTEEN_WALLETS);
    setActiveLiveMeeting(null);
  };

  return (
    <SchoolContext.Provider
      value={{
        schools,
        currentSchool,
        currentUser,
        allUsers,
        assessments,
        reportCards,
        attendanceRecords,
        assignments,
        announcements,
        ptaRecords,
        auditLogs,
        notifications,
        zoomMeetings,
        directMessages,
        teacherDutyLogs,
        stories,
        groups,
        groupPosts,
        financePublications,
        activeLiveMeeting,
        isAuthenticated,
        login,
        logout,
        updateStaffPassword,
        verifyStaffPassword,
        switchSchool,
        switchUser,
        updateSchoolSubscription,
        updateParentSubscription,
        createSchool,
        registerUser,
        updateUserProfile,
        updateUserProfilePic,
        updateUserCoverPhoto,
        approveUser,
        rejectUser,
        saveAssessment,
        submitAssessment,
        approveAssessment,
        publishTermReportCards,
        recordAttendance,
        createAssignment,
        postAnnouncement,
        updateSchoolCalendar,
        linkChildToParent,
        promoteStudent,
        promoteClass,
        markNotificationRead,
        clearAllNotifications,
        addAuditLog,
        scheduleZoomMeeting,
        updateZoomMeeting,
        startInstantZoomClass,
        joinZoomMeeting,
        leaveZoomMeeting,
        sendDirectMessage,
        markMessageRead,
        checkInTeacher,
        togglePeriodStatus,
        checkOutAndSendToManager,
        reviewTeacherDutyLog,
        addStory,
        likeStory,
        reactToStory,
        deleteStory,
        createGroup,
        joinGroup,
        leaveGroup,
        addGroupPost,
        likeGroupPost,
        addPostComment,
        publishFinanceNotice,
        deleteFinanceNotice,
        canViewFinanceNotice,
        parentFeeStatements,
        busTrackers,
        guardianPasses,
        behaviorLogs,
        conferences,
        permissionSlips,
        clinicVisits,
        canteenWallets,
        zambianCalendarInfo,
        makeFeePayment,
        generateDailyGuardianPass,
        acknowledgeBehaviorLog,
        bookConference,
        signPermissionSlip,
        topUpCanteenWallet,
        setSchoolActiveTerm,
        syncZambianAcademicCalendar,
        resetDemoData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
