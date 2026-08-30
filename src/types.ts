export type UserRole =
  | 'head_teacher'
  | 'deputy_head_teacher'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'school_board'
  | 'platform_admin';

export type UserCategory =
  | 'school_staff'
  | 'parent'
  | 'student'
  | 'platform_admin';

export type StaffPosition =
  | 'head_teacher'
  | 'deputy_head_teacher'
  | 'teacher';

export type SchoolStaffSubscriptionTier = 'medium' | 'premium';
export type ParentSubscriptionTier = 'medium' | 'premium';
export type SubscriptionPaymentMethod = 'airtel_money' | 'mtn_money' | 'zamtel_money' | 'card_visa_mastercard';

export interface SchoolStaffSubscription {
  tier: SchoolStaffSubscriptionTier;
  pricePerMonthZMW: number; // 400 for Medium, 450 for Premium
  status: 'active' | 'trial' | 'expired' | 'pending';
  billingCycle: 'monthly' | 'annually';
  startDate: string;
  nextBillingDate: string;
  coveredStaffCount: number;
  lastPaymentReference?: string;
  paymentMethod?: SubscriptionPaymentMethod;
  features: string[];
}

export interface ParentSubscription {
  tier: ParentSubscriptionTier;
  pricePerMonthZMW: number; // 150 for Medium, 200 for Premium
  status: 'active' | 'trial' | 'expired' | 'pending';
  billingCycle: 'monthly' | 'annually';
  startDate: string;
  nextBillingDate: string;
  lastPaymentReference?: string;
  paymentMethod?: SubscriptionPaymentMethod;
  features: string[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type AssessmentType =
  | 'test_1'
  | 'test_2'
  | 'test_3'
  | 'assignment'
  | 'quiz'
  | 'practical'
  | 'examination';

export type ResultStatus = 'draft' | 'submitted' | 'approved' | 'published';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export type TermId = 'term_1' | 'term_2' | 'term_3';

export interface TermConfig {
  id: TermId;
  name: string;
  startDate: string;
  endDate: string;
  weeksCount: number;
  isActive: boolean;
  test1Week: number;
  test2Week: number;
  test3Week: number;
  examWeek: number;
  midTermWeek?: number;
}

export interface AssessmentWeighting {
  test1Weight: number; // e.g. 15%
  test2Weight: number; // e.g. 15%
  test3Weight: number; // e.g. 15%
  assignmentWeight: number; // e.g. 15%
  examWeight: number; // e.g. 40%
}

export interface GradeBoundary {
  grade: string; // "1", "2", "3" or "A+", "A"
  label: string; // "Distinction", "Merit", "Credit", "Satisfactory", "Unsatisfactory"
  minScore: number;
  maxScore: number;
  points: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  weekNumber: number;
  termId: TermId;
  type: 'academic' | 'test' | 'exam' | 'holiday' | 'sports' | 'meeting' | 'pta';
  description?: string;
  targetAudience?: UserRole[];
}

export interface ClassRoom {
  id: string;
  name: string; // "Grade 9A", "Grade 10 Science"
  grade: string; // "9", "10"
  stream: string; // "A", "B", "Science"
  classTeacherId: string;
  classTeacherName: string;
  studentCount: number;
  roomNumber?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string; // "MAT-101", "ENG-101", "SCI-101"
  category: 'Core' | 'Sciences' | 'Humanities' | 'Languages' | 'Commercial' | 'Practical';
  gradesApplicable: string[]; // ["8", "9", "10", "11", "12"]
}

export interface PlatformAdminProfile {
  superAdminId: string;
  department: string;
  securityClearance: 'Level 5 (National Directorate)' | 'Level 4 (Regional Inspectorate)';
  authorizedBy: string;
  contactOffice: string;
}

export interface School {
  id: string;
  code: string; // e.g. "SCH-KT-1049"
  name: string;
  motto: string;
  logo: string;
  province: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  registrationNumber: string;
  staffPassword?: string; // Head Teacher set password for registering/recording verified faculty staff
  createdById?: string;
  staffSubscription?: SchoolStaffSubscription; // Paid once by school covering all staff
  academicYear: string; // "2026"
  activeTerm: TermId;
  terms: TermConfig[];
  assessmentWeighting: AssessmentWeighting;
  gradingScale: GradeBoundary[];
  grades: string[];
  classes: ClassRoom[];
  subjects: Subject[];
  calendarEvents: CalendarEvent[];
  passMark: number;
  ptaDuesAmount: number;
  currency: string; // "ZMW" (Zambian Kwacha)
  createdAt: string;
}

export interface AcademicRecordHistory {
  academicYear: string;
  grade: string;
  className: string;
  termReportCardIds: string[];
  averagePercentage?: number;
  aggregatePoints?: number;
  promotionStatus?: string;
  promotedAt?: string;
}

export interface StudentProfile {
  studentNumber: string; // e.g. "STU-2026-0012"
  eczCandidateNumber?: string; // e.g. "ECZ-2026-98104"
  grade: string;
  classId: string;
  className: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianRelationship?: string;
  secondaryGuardianName?: string;
  secondaryGuardianPhone?: string;
  gender: 'Male' | 'Female';
  dateOfBirth?: string;
  admissionDate: string;
  nrcOrBirthCertNumber?: string;
  address?: string;
  bloodGroup?: string;
  medicalConditions?: string;
  allergies?: string;
  dietaryRequirements?: string;
  sportsHouse?: string; // e.g. "Eagle House (Green)", "Cheetah House (Yellow)", "Rhino House (Blue)", "Buffalo House (Red)"
  leadershipPosition?: string; // e.g. "Head Boy", "Head Girl", "Class Prefect", "Library Prefect", "Timekeeper", "None"
  clubsAndSocieties?: string[]; // e.g. ["JETS Club", "Debate Society", "Chess Club", "School Choir"]
  careerAspirations?: string; // e.g. "Biomedical Engineer", "Computer Scientist", "Chartered Accountant"
  favoriteSubjects?: string[];
  busRoute?: string;
  bio?: string;
  academicHistory?: AcademicRecordHistory[];
}

export interface TeacherProfile {
  employeeNumber: string;
  tscNumber?: string;
  assignedSubjectIds: string[];
  assignedClassIds: string[];
  classesAssigned?: string[];
  qualification: string;
  degreeInstitution?: string;
  graduationYear?: string;
  specialization: string;
  department?: string;
  yearsOfExperience?: number;
  officeLocation?: string;
  officeHours?: string;
  contactExtension?: string;
  pedagogicalPhilosophy?: string;
  extracurricularResponsibilities?: string[];
  isFinanceTeam?: boolean; // Designated as Finance Committee / Bursar Team
  financeRoleTitle?: string; // "Finance Secretary", "Bursary Liaison", "Senior Accounts Teacher"
  zoomPersonalRoomId?: string;
  zoomPersonalPasscode?: string;
  bio?: string;
}

export interface HeadTeacherProfile {
  employeeNumber: string;
  tscNumber?: string;
  highestQualification: string;
  almaMater?: string;
  yearsInLeadership?: number;
  administrativeOffice?: string;
  directExtension?: string;
  consultationHours?: string;
  specializedSubject?: string;
  leadershipPhilosophy?: string;
  officialSealTitle?: string;
  boardAffiliations?: string;
  bio?: string;
}

export interface DeputyHeadProfile {
  employeeNumber: string;
  tscNumber?: string;
  portfolioFocus: string; // "Academic Affairs", "Administration & Finance", "Student Welfare & Discipline"
  supervisedDepartments?: string[];
  qualification: string;
  yearsInEducation?: number;
  officeLocation?: string;
  directExtension?: string;
  specialization: string;
  disciplinaryBoardRole?: string;
  bio?: string;
}

export interface ParentProfile {
  connectedStudentNumbers: string[];
  nationalId?: string; // Zambian NRC
  occupation?: string;
  employer?: string;
  workAddress?: string;
  residentialAddress?: string;
  secondaryPhone?: string;
  relationshipToStudents?: string; // "Father", "Mother", "Legal Guardian", "Aunt", "Uncle"
  isPtaExecutive?: boolean;
  ptaExecutiveRole?: string; // "Chairperson", "Vice Chair", "Treasurer", "Committee Member", "Active Member"
  preferredContactMethod?: 'SMS' | 'WhatsApp' | 'Email' | 'InApp';
  emergencyContactPerson?: string;
  emergencyContactPhone?: string;
  bio?: string;
}

export interface BoardProfile {
  position: string; // "Chairperson", "Vice Chair", "Treasurer", "Secretary", "Trustee", "Member"
  committee: string; // "Finance & Audit", "Academic Affairs", "Infrastructure & Development", "Disciplinary"
  appointedYear: string;
  termExpiryYear?: string;
  externalProfession?: string;
  organizationAffiliation?: string;
  governanceExpertise?: string[];
  nationalId?: string;
  officeContact?: string;
  boardKeyInitiatives?: string;
  bio?: string;
}

export interface User {
  id: string;
  fullName: string;
  titlePrefix?: string; // "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Eng.", "Rev."
  email: string;
  password?: string;
  role: UserRole;
  userCategory?: UserCategory; // School Staff, Parent, Student, Platform Administrator
  phone: string;
  whatsAppNumber?: string; // Zambian WhatsApp contact
  alternatePhone?: string;
  avatarUrl?: string;
  coverPhotoUrl?: string; // Facebook-style cover banner photo
  isFinanceTeam?: boolean; // Designated as School Finance Team member
  financeRoleTitle?: string; // e.g. "Senior Finance Teacher", "Bursary Secretary"
  schoolId: string;
  schoolName: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  parentSubscription?: ParentSubscription; // Individual parent subscription
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  nrcNumber?: string;
  address?: string;
  city?: string;
  nationality?: string;
  bio?: string;
  bloodGroup?: string;
  medicalConditions?: string;
  allergies?: string;
  dietaryRequirements?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyRelationship?: string;
  studentProfile?: StudentProfile;
  teacherProfile?: TeacherProfile;
  headTeacherProfile?: HeadTeacherProfile;
  deputyProfile?: DeputyHeadProfile;
  parentProfile?: ParentProfile;
  boardProfile?: BoardProfile;
  adminProfile?: PlatformAdminProfile;
}

export interface ScoreItem {
  studentId: string;
  studentNumber: string;
  studentName: string;
  rawScore: number; // e.g. 16
  maxScore: number; // e.g. 20
  percentage: number; // e.g. 80
  remarks?: string;
}

export interface AssessmentRecord {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  termId: TermId;
  academicYear: string;
  title: string;
  type: AssessmentType;
  maxScore: number;
  date: string;
  weekNumber: number;
  scores: ScoreItem[];
  status: ResultStatus;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  isLocked: boolean;
}

export interface SubjectTermResult {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  test1Score?: { raw: number; max: number; pct: number };
  test2Score?: { raw: number; max: number; pct: number };
  test3Score?: { raw: number; max: number; pct: number };
  assignmentAvgPct?: number;
  examScore?: { raw: number; max: number; pct: number };
  totalContinuousAssessmentPct: number;
  finalExamPct: number;
  finalOverallPercentage: number;
  eczGrade: string; // "1", "2", "3", etc.
  gradeLabel: string; // "Distinction", "Merit", "Credit"
  eczPoints: number;
  teacherRemarks: string;
}

export interface TermReportCard {
  id: string;
  schoolId: string;
  schoolName: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  gender: string;
  grade: string;
  classId: string;
  className: string;
  termId: TermId;
  termName: string;
  academicYear: string;
  subjectResults: SubjectTermResult[];
  totalMarksObtained: number;
  totalMaxPossibleMarks: number;
  averagePercentage: number;
  aggregatePoints: number; // Best 6 subjects ECZ points calculation
  positionInClass: number;
  totalStudentsInClass: number;
  attendanceDaysPresent: number;
  attendanceDaysAbsent: number;
  totalSchoolDays: number;
  attendancePercentage: number;
  classTeacherRemarks: string;
  headTeacherRemarks: string;
  conduct: string;
  nextTermBeginsDate: string;
  promotionStatus: 'Promoted to Next Grade' | 'Promoted on Trial' | 'Retained in Grade' | 'Academic Warning' | 'Satisfactory Progress';
  status: ResultStatus;
  publishedDate?: string;
  headTeacherSignatureName: string;
}

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  date: string;
  termId: TermId;
  academicYear: string;
  recordedByTeacherId: string;
  recordedByTeacherName: string;
  entries: Array<{
    studentId: string;
    studentNumber: string;
    studentName: string;
    status: AttendanceStatus;
    reason?: string;
  }>;
}

export interface Assignment {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  maxScore: number;
  dueDate: string;
  termId: TermId;
  createdAt: string;
  submissionsCount: number;
  totalStudents: number;
}

export interface Announcement {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  category: 'Academic' | 'Examination' | 'PTA' | 'Emergency' | 'Holiday' | 'Sports' | 'General';
  authorName: string;
  authorRole: UserRole;
  targetRoles: UserRole[];
  isPinned: boolean;
  priority: 'normal' | 'urgent';
  createdAt: string;
}

export interface PTARecord {
  id: string;
  schoolId: string;
  title: string;
  meetingDate: string;
  venue: string;
  agendaItems: string[];
  minutesSummary: string;
  duesPerChildZMW: number;
  totalFundsCollectedZMW: number;
  activeProjects: Array<{
    name: string;
    budgetZMW: number;
    progressPercentage: number;
    status: 'In Progress' | 'Completed' | 'Planning';
  }>;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  room: string;
}

export interface AuditLog {
  id: string;
  schoolId: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  ipAddress?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'result' | 'attendance' | 'announcement' | 'assignment' | 'approval' | 'pta' | 'zoom' | 'message';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface TeacherLessonPeriod {
  id: string;
  periodNumber: number;
  timeRange: string;
  timeSlot?: string;
  className: string;
  subjectName: string;
  room: string;
  topic: string;
  topicTaught?: string;
  status: 'taught' | 'not_taught';
  reasonIfNotTaught?: string;
  curriculumReference?: string;
}

export interface TeacherDailyDutyLog {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherNumber?: string;
  department?: string;
  schoolId: string;
  date: string;
  checkInConfirmed: boolean;
  checkInTime: string | null;
  checkInTimestamp?: string | null;
  checkOutConfirmed: boolean;
  checkOutTime: string | null;
  checkOutTimestamp?: string | null;
  periods: TeacherLessonPeriod[];
  totalPeriodsTaught: number;
  totalPeriodsScheduled: number;
  dutyHandoverRemarks?: string;
  teacherNotes?: string;
  sentToSchoolManager: boolean;
  sentToManagerTime?: string | null;
  status?: 'draft' | 'submitted_to_manager' | 'approved_by_manager';
  schoolManagerStatus: 'submitted' | 'reviewed' | 'approved';
}

export interface ZoomMeeting {
  id: string;
  schoolId: string;
  topic: string;
  grade?: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  aiModel?: string;
  educationMode?: string;
  hostTeacherId: string;
  hostTeacherName: string;
  hostAvatar?: string;
  meetingId: string;
  passcode: string;
  startTime: string;
  durationMinutes: number;
  status: 'upcoming' | 'live' | 'ended';
  joinUrl: string;
  recordingUrl?: string;
  lessonObjective: string;
  curriculumCode?: string;
  attendeesCount: number;
  isHostAudioMuted?: boolean;
  isHostVideoOn?: boolean;
}

export interface DirectMessage {
  id: string;
  schoolId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverRole: UserRole;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  relatedSubject?: string;
  attachmentName?: string;
  attachmentType?: 'pdf' | 'doc' | 'image' | 'worksheet';
}

// Facebook-style Story Item
export interface StoryItem {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  mediaType: 'text' | 'image';
  content?: string; // Text content for text stories
  mediaUrl?: string; // Image URL for photo stories
  backgroundGradient?: string; // e.g. "from-purple-600 to-indigo-600"
  caption?: string;
  timestamp: string;
  expiresAt: string; // 24 hours after creation
  likes: string[]; // user IDs who liked
  reactions: Array<{ userId: string; emoji: string; userName: string }>;
  viewedByUserIds: string[];
}

// Group Classes, Grade Groups, Clubs & PTA Group
export type SchoolGroupCategory = 'grade_group' | 'class_group' | 'subject_group' | 'club' | 'pta_group';

export interface SchoolGroup {
  id: string;
  schoolId: string;
  name: string;
  category: SchoolGroupCategory;
  grade?: string; // e.g. "9", "10", "11", "12" or "All"
  classId?: string; // e.g. "class_9a"
  description: string;
  bannerGradient: string;
  icon: string;
  createdById: string;
  createdByName: string;
  isAutoJoinedPta?: boolean; // True for PTA group: all non-students auto included
  memberIds: string[]; // List of user IDs
  postsCount: number;
  recentActivity: string;
  createdAt: string;
}

export interface GroupPost {
  id: string;
  groupId: string;
  schoolId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  content: string;
  likes: string[]; // User IDs
  comments: Array<{
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    authorRole: UserRole;
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  isPinned?: boolean;
  attachmentName?: string;
  attachmentType?: 'notes' | 'doc' | 'image' | 'pdf' | 'link';
  attachmentUrl?: string;
}

// Finance Team Publishing vs General School Publishing
export type PublicationTargetAudience = 
  | 'finance_restricted' // Confidential to Parents, Head Teacher, and Deputy Head Teacher
  | 'all_roles';          // Broadcast to Every Role (Students, Teachers, Parents, Board, etc.)

export type FinancePublicationCategory =
  | 'fee_schedule'
  | 'pta_levy_notice'
  | 'budget_report'
  | 'payment_receipt_guide'
  | 'audited_statement'
  | 'general_announcement';

export interface FinancePublication {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  category: FinancePublicationCategory;
  targetAudience: PublicationTargetAudience;
  amountZMW?: number;
  dueDate?: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    mobileMoneyCode?: string;
  };
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  isFinanceTeamAuthor: boolean;
  financeRoleTitle?: string;
  createdAt: string;
  isPinned?: boolean;
  attachments?: Array<{
    name: string;
    size: string;
    type: string;
  }>;
  viewCount: number;
}

// Deep Masterclass Lecture Content (Pedagogical Textbook Chapter)
export interface MasterLectureProof {
  title: string;
  hypothesis: string;
  proofSteps: string[];
  keyTakeaway: string;
}

export interface MasterWorkedProblem {
  questionNumber: number;
  problemStatement: string;
  examinerThoughtProcess: string;
  stepByStepSolution: string[];
  markingRubricBreakdown: Array<{ step: string; marksAwarded: string }>;
  commonStudentPitfalls: string;
}

export interface MasterLectureChapter {
  thematicIntroduction: string;
  pedagogicalObjectives: string[];
  deepConceptualTheory: string[];
  rigorousProofsAndDerivations: MasterLectureProof[];
  zambianAndAfricanApplications: string;
  masterWorkedProblems: MasterWorkedProblem[];
  socraticCheckpoints: string[];
  commonMisconceptionsBusted: Array<{ misconception: string; scientificReality: string }>;
}

// -------------------------------------------------------------
// PARENT PORTAL EXTENSIONS & FEE/TRANSPORT/HEALTH/BEHAVIOR MODELS
// -------------------------------------------------------------

export type PaymentChannel = 'mtn_momo' | 'airtel_money' | 'zanaco_schoolpay' | 'atlas_mara' | 'bank_transfer' | 'cash';

export interface FeeItemBreakdown {
  id: string;
  name: string; // e.g. "Term Tuition Fee", "PTA Development Levy", "Science Laboratory Fee", "Computer Studies Lab", "Boarding & Meals"
  amount: number;
  amountZMW?: number;
  isMandatory?: boolean;
  isPaid?: boolean;
  category: 'tuition' | 'pta' | 'pta_levy' | 'lab' | 'lab_fee' | 'boarding' | 'uniform_books' | 'ict_levy' | 'sports_club';
}

export interface ParentPaymentTransaction {
  id: string;
  receiptNumber: string;
  studentNumber: string;
  studentName: string;
  parentId: string;
  parentName: string;
  amount: number;
  termId: TermId;
  academicYear: string;
  channel: PaymentChannel;
  referenceNumber: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
  feeItemName: string;
}

export interface ParentFeeStatement {
  studentNumber: string;
  studentName: string;
  className: string;
  academicYear: string;
  termId: TermId;
  totalInvoiced: number;
  totalPaid: number;
  balanceDue: number;
  dueDate: string;
  items: FeeItemBreakdown[];
  transactions: ParentPaymentTransaction[];
}

export interface BusRouteStop {
  id?: string;
  name?: string;
  stopName?: string;
  scheduledTime?: string;
  scheduledMorningTime?: string;
  scheduledAfternoonTime?: string;
  status?: 'completed' | 'current' | 'upcoming' | 'pending';
  isCompletedMorning?: boolean;
  isCompletedAfternoon?: boolean;
}

export interface BusRouteTracker {
  id: string;
  busNumber?: string; // e.g. "Kabwe Tech Bus 04"
  routeNumber?: string;
  busRegistrationNumber?: string;
  tripType?: 'morning_pickup' | 'afternoon_dropoff' | 'sports_excursion';
  driverName: string;
  driverPhone: string;
  matronName?: string;
  matronPhone?: string;
  supervisorName?: string;
  supervisorPhone?: string;
  routeTitle: string; // "Mukobeko - Town Centre - Kasanda"
  currentLocation?: string;
  currentLocationName?: string;
  etaMinutes?: number;
  status: 'idle' | 'morning_in_transit' | 'afternoon_in_transit' | 'arrived_at_school' | 'completed' | 'in_transit';
  assignedStudents?: any[];
  assignedStudentNumbers?: string[];
  stops: BusRouteStop[];
  estimatedArrivalAtSchool?: string;
  lastUpdated?: string;
}

export interface GuardianPickupPass {
  studentNumber: string;
  studentName: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string; // "Mother", "Father", "Uncle", "Designated Driver"
  dailySecurityPin: string; // e.g. "7392"
  qrVerificationCode: string;
  validDate: string; // e.g. "2026-08-28"
  authorizedByHead: boolean;
  pickupTimeWindow: string; // "15:30 - 17:00"
}

export type BehaviorType = 'merit' | 'demerit' | 'attendance_alert' | 'homework_excellence';

export interface StudentBehaviorLog {
  id: string;
  studentNumber: string;
  studentName: string;
  type: BehaviorType;
  category?: string;
  points: number; // positive for merit, negative for demerit
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  subjectName?: string;
  date: string;
  actionTaken?: string;
  acknowledgedByParent?: boolean;
  parentNotes?: string;
}

export interface ParentTeacherConference {
  id: string;
  studentNumber: string;
  studentName: string;
  parentId: string;
  parentName: string;
  teacherId: string;
  teacherName: string;
  subjectName: string;
  date: string;
  timeSlot: string; // e.g. "14:00 - 14:20"
  meetingType?: 'zoom_virtual' | 'in_person';
  mode?: 'zoom_virtual' | 'in_person';
  meetingLink?: string;
  zoomJoinUrl?: string;
  location?: string;
  roomNumber?: string;
  notes?: string;
  topicAgenda?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  teacherNotes?: string;
}

export interface PermissionSlip {
  id: string;
  title?: string; // e.g. "Victoria Falls & Zambezi Hydropower Geography Field Trip"
  tripTitle?: string;
  destination: string;
  date?: string;
  tripDate?: string;
  departureTime?: string;
  returnTime?: string;
  organizingTeacher?: string;
  gradeTarget?: string;
  costZMW: number;
  description: string;
  emergencyProvisions?: string;
  deadlineDate?: string;
  signedByParentId?: string;
  signedTimestamp?: string;
  guardianSignatureName?: string;
  medicalConditionsNote?: string;
  status: 'signed' | 'pending' | 'declined';
}

export interface HealthClinicVisit {
  id: string;
  studentNumber: string;
  studentName: string;
  visitDate?: string;
  timestamp?: string;
  time?: string;
  complaint?: string;
  reasonForVisit?: string;
  temperatureCelsius?: number;
  vitalSigns?: {
    temperatureC: number;
    pulseRateBpm?: number;
    bloodPressure?: string;
  };
  nurseName: string;
  nurseNotes?: string;
  nurseObservations?: string;
  treatmentGiven?: string;
  treatmentAdministered?: string; // e.g. "Paracetamol 500mg, Oral Rehydration Salts"
  actionTaken?: string;
  actionRecommended?: 'returned_to_class' | 'sent_home_with_guardian' | 'referred_to_hospital';
  parentAlertSent?: boolean;
}

export interface CanteenWallet {
  studentNumber: string;
  studentName: string;
  currentBalanceZMW: number;
  dietaryRestrictions: string[]; // e.g. "Peanut Allergy", "Lactose Intolerant", "Halal"
  dailySpendingLimitZMW: number;
  recentTransactions: Array<{
    id: string;
    date: string;
    itemDescription: string;
    amount: number;
    type: 'purchase' | 'top_up';
    channel?: string;
  }>;
}

// -------------------------------------------------------------
// ZAMBIAN MINISTRY OF EDUCATION ACADEMIC CALENDAR STRUCTURE
// -------------------------------------------------------------

export interface ZambianTermInfo {
  year: number;
  activeTermId: TermId;
  termName: string;
  startDate: string;
  endDate: string;
  totalWeeks: number;
  currentWeek: number;
  isHolidayPeriod: boolean;
  holidayName?: string;
  daysRemainingInTerm: number;
  nextTermStartDate?: string;
  milestones: {
    test1Date: string;
    midTermBreakDate: string;
    test2Date: string;
    test3Date: string;
    finalExamsStartDate: string;
    eczNationalExamsStart?: string;
    eczNationalExamsEnd?: string;
    schoolClosingDate: string;
  };
}

// -------------------------------------------------------------
// GEMINI CHATBOT & SEARCH/MAPS GROUNDING TYPES
// -------------------------------------------------------------

export type GeminiModelChoice = 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';
export type GroundingMode = 'none' | 'google_search' | 'google_maps';
export type ChatbotRole =
  | 'moe_ecz_curriculum'
  | 'stem_pro_reasoning'
  | 'campus_maps_navigator'
  | 'search_grounded_research'
  | 'parent_student_advisor'
  | 'custom';

export interface GroundingWebChunk {
  uri: string;
  title: string;
}

export interface GroundingMapsChunk {
  uri: string;
  title: string;
  placeAnswerSources?: {
    reviewSnippets?: {
      snippet: string;
    }[];
  };
}

export interface GroundingChunk {
  web?: GroundingWebChunk;
  maps?: GroundingMapsChunk;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  groundingChunks?: GroundingChunk[];
  searchQueries?: string[];
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  role: ChatbotRole;
  customSystemInstruction?: string;
  model: GeminiModelChoice;
  groundingMode: GroundingMode;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}


