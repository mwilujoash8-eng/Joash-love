import { TermConfig, TermId, ZambianTermInfo, School, CalendarEvent } from '../types';

/**
 * Official Zambian Ministry of Education Academic Calendar Engine
 * 
 * In Zambia:
 * - The academic year runs from January to December (3 terms per year).
 * - Term 1 (13 Weeks): Mid-January to mid-April (Jan - Apr)
 * - 1st Holiday: April (approx. 4 weeks)
 * - Term 2 (13 Weeks): Early May to early August (May - Aug)
 * - 2nd Holiday: August (approx. 4 weeks)
 * - Term 3 (13 Weeks): Early September to early December (Sep - Dec)
 *   * Includes ECZ (Examinations Council of Zambia) National Examinations for Grade 7, 9 & 12.
 * - 3rd Holiday: December to January (approx. 5-6 weeks)
 */

/**
 * Calculates standard official Monday-based term dates for any given academic year.
 */
export function getZambianTermsForYear(year: number): TermConfig[] {
  // Helper to format YYYY-MM-DD
  const fmt = (y: number, m: number, d: number) => {
    const mm = m < 10 ? `0${m}` : `${m}`;
    const dd = d < 10 ? `0${d}` : `${d}`;
    return `${y}-${mm}-${dd}`;
  };

  // Term 1: Jan 12/14 to Apr 10/17 (13 weeks)
  const term1Start = fmt(year, 1, 12);
  const term1End = fmt(year, 4, 10);

  // Term 2: May 11 to Aug 07 (13 weeks)
  const term2Start = fmt(year, 5, 11);
  const term2End = fmt(year, 8, 7);

  // Term 3: Sep 07 to Dec 04 (13 weeks)
  const term3Start = fmt(year, 9, 7);
  const term3End = fmt(year, 12, 4);

  return [
    {
      id: 'term_1',
      name: `Term 1, ${year} (Jan - Apr)`,
      startDate: term1Start,
      endDate: term1End,
      weeksCount: 13,
      isActive: false,
      test1Week: 4,
      test2Week: 8,
      test3Week: 12,
      examWeek: 13,
      midTermWeek: 7,
    },
    {
      id: 'term_2',
      name: `Term 2, ${year} (May - Aug)`,
      startDate: term2Start,
      endDate: term2End,
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
      name: `Term 3, ${year} (Sep - Dec - ECZ Exams)`,
      startDate: term3Start,
      endDate: term3End,
      weeksCount: 13,
      isActive: false,
      test1Week: 4,
      test2Week: 8,
      test3Week: 12,
      examWeek: 13,
      midTermWeek: 7,
    },
  ];
}

/**
 * Generates official Zambian national calendar events for the school
 */
export function getZambianNationalEvents(year: number): CalendarEvent[] {
  return [
    // Term 1
    {
      id: `ev_${year}_t1_open`,
      title: `Ministry of Education Term 1 Official Opening`,
      date: `${year}-01-12`,
      weekNumber: 1,
      termId: 'term_1',
      type: 'academic',
      description: 'Official commencement of the Zambian academic year for all primary and secondary schools.',
      targetAudience: ['head_teacher', 'deputy_head_teacher', 'teacher', 'student', 'parent', 'school_board'],
    },
    {
      id: `ev_${year}_youth_day`,
      title: `National Youth Day (Public Holiday)`,
      date: `${year}-03-12`,
      weekNumber: 9,
      termId: 'term_1',
      type: 'holiday',
      description: 'Zambian National Youth Day celebrations across all schools.',
    },
    {
      id: `ev_${year}_t1_close`,
      title: `Term 1 Official Closing Day`,
      date: `${year}-04-10`,
      weekNumber: 13,
      termId: 'term_1',
      type: 'academic',
      description: 'Report Card distribution and commencement of April holiday break.',
    },

    // Term 2
    {
      id: `ev_${year}_t2_open`,
      title: `Term 2 Official Re-Opening`,
      date: `${year}-05-11`,
      weekNumber: 1,
      termId: 'term_2',
      type: 'academic',
      description: 'Term 2 resumption with continuous assessment cycle.',
    },
    {
      id: `ev_${year}_african_freedom`,
      title: `Africa Freedom Day (Public Holiday)`,
      date: `${year}-05-25`,
      weekNumber: 3,
      termId: 'term_2',
      type: 'holiday',
      description: 'Commemoration of African liberation and unity.',
    },
    {
      id: `ev_${year}_heroes_unity`,
      title: `Heroes & Unity Days`,
      date: `${year}-07-06`,
      weekNumber: 9,
      termId: 'term_2',
      type: 'holiday',
      description: 'Zambian national solidarity holidays.',
    },
    {
      id: `ev_${year}_t2_close`,
      title: `Term 2 Official Closing Day`,
      date: `${year}-08-07`,
      weekNumber: 13,
      termId: 'term_2',
      type: 'academic',
      description: 'End of Term 2 assessments and commencement of August holidays.',
    },

    // Term 3
    {
      id: `ev_${year}_t3_open`,
      title: `Term 3 Opening & ECZ Exam Preparation`,
      date: `${year}-09-07`,
      weekNumber: 1,
      termId: 'term_3',
      type: 'academic',
      description: 'Crucial promotional and national examination term starts.',
    },
    {
      id: `ev_${year}_teachers_day`,
      title: `World Teachers' Day Celebrations`,
      date: `${year}-10-05`,
      weekNumber: 5,
      termId: 'term_3',
      type: 'academic',
      description: 'Honoring pedagogical excellence across Zambia.',
    },
    {
      id: `ev_${year}_independence`,
      title: `Zambia Independence Day (National Holiday)`,
      date: `${year}-10-24`,
      weekNumber: 7,
      termId: 'term_3',
      type: 'holiday',
      description: 'Celebration of national sovereignty and peace.',
    },
    {
      id: `ev_${year}_ecz_g12`,
      title: `ECZ Grade 12 National Examinations Start`,
      date: `${year}-10-26`,
      weekNumber: 8,
      termId: 'term_3',
      type: 'exam',
      description: 'Examinations Council of Zambia Grade 12 School Certificate Examinations.',
    },
    {
      id: `ev_${year}_ecz_g9`,
      title: `ECZ Grade 9 JSSLE National Examinations Start`,
      date: `${year}-11-16`,
      weekNumber: 11,
      termId: 'term_3',
      type: 'exam',
      description: 'Junior Secondary School Leaving Examination papers administered nationwide.',
    },
    {
      id: `ev_${year}_t3_close`,
      title: `Term 3 & Academic Year Graduation Closing`,
      date: `${year}-12-04`,
      weekNumber: 13,
      termId: 'term_3',
      type: 'academic',
      description: 'Annual Speech & Prize Giving Day, final promotion results, and long Christmas vacation.',
    },
  ];
}

/**
 * Given a date (or default current time), analyzes exactly where we are in the Zambian academic calendar.
 */
export function getZambianCalendarInfo(targetDate?: Date | string): ZambianTermInfo {
  const d = targetDate ? new Date(targetDate) : new Date();
  const year = d.getFullYear();
  const terms = getZambianTermsForYear(year);

  const t1 = terms[0];
  const t2 = terms[1];
  const t3 = terms[2];

  const dStr = d.toISOString().split('T')[0];

  const t1Start = new Date(t1.startDate);
  const t1End = new Date(t1.endDate);
  const t2Start = new Date(t2.startDate);
  const t2End = new Date(t2.endDate);
  const t3Start = new Date(t3.startDate);
  const t3End = new Date(t3.endDate);

  let activeTermId: TermId = 'term_1';
  let termName = t1.name;
  let startDate = t1.startDate;
  let endDate = t1.endDate;
  let isHolidayPeriod = false;
  let holidayName: string | undefined = undefined;
  let currentWeek = 1;
  let nextTermStartDate: string | undefined = undefined;

  if (d < t1Start) {
    // Early January (End of year break before Term 1)
    isHolidayPeriod = true;
    holidayName = 'Christmas & New Year School Holidays';
    activeTermId = 'term_1';
    termName = t1.name;
    startDate = t1.startDate;
    endDate = t1.endDate;
    currentWeek = 0;
    nextTermStartDate = t1.startDate;
  } else if (d >= t1Start && d <= t1End) {
    // Inside Term 1
    activeTermId = 'term_1';
    termName = t1.name;
    startDate = t1.startDate;
    endDate = t1.endDate;
    isHolidayPeriod = false;
    currentWeek = calculateWeekNumber(d, t1Start);
  } else if (d > t1End && d < t2Start) {
    // April Holiday Break
    isHolidayPeriod = true;
    holidayName = 'Term 1 April Holiday Break';
    activeTermId = 'term_1';
    termName = t1.name;
    startDate = t1.startDate;
    endDate = t1.endDate;
    currentWeek = 13;
    nextTermStartDate = t2.startDate;
  } else if (d >= t2Start && d <= t2End) {
    // Inside Term 2
    activeTermId = 'term_2';
    termName = t2.name;
    startDate = t2.startDate;
    endDate = t2.endDate;
    isHolidayPeriod = false;
    currentWeek = calculateWeekNumber(d, t2Start);
  } else if (d > t2End && d < t3Start) {
    // August Holiday Break
    isHolidayPeriod = true;
    holidayName = 'Term 2 August Holiday Vacation';
    activeTermId = 'term_2';
    termName = t2.name;
    startDate = t2.startDate;
    endDate = t2.endDate;
    currentWeek = 13;
    nextTermStartDate = t3.startDate;
  } else if (d >= t3Start && d <= t3End) {
    // Inside Term 3
    activeTermId = 'term_3';
    termName = t3.name;
    startDate = t3.startDate;
    endDate = t3.endDate;
    isHolidayPeriod = false;
    currentWeek = calculateWeekNumber(d, t3Start);
  } else {
    // December / January Long Vacation
    isHolidayPeriod = true;
    holidayName = 'Annual Christmas & Year-End Holidays';
    activeTermId = 'term_3';
    termName = t3.name;
    startDate = t3.startDate;
    endDate = t3.endDate;
    currentWeek = 13;
    nextTermStartDate = `${year + 1}-01-11`;
  }

  // Cap week number between 1 and 13
  if (!isHolidayPeriod) {
    currentWeek = Math.max(1, Math.min(13, currentWeek));
  }

  // Days remaining calculation
  const endDateTime = new Date(endDate).getTime();
  const currentDateTime = d.getTime();
  const diffDays = Math.max(0, Math.ceil((endDateTime - currentDateTime) / (1000 * 60 * 60 * 24)));

  return {
    year,
    activeTermId,
    termName,
    startDate,
    endDate,
    totalWeeks: 13,
    currentWeek,
    isHolidayPeriod,
    holidayName,
    daysRemainingInTerm: diffDays,
    nextTermStartDate,
    milestones: {
      test1Date: calculateMilestoneDate(startDate, 4),
      midTermBreakDate: calculateMilestoneDate(startDate, 7),
      test2Date: calculateMilestoneDate(startDate, 8),
      test3Date: calculateMilestoneDate(startDate, 12),
      finalExamsStartDate: calculateMilestoneDate(startDate, 13),
      eczNationalExamsStart: activeTermId === 'term_3' ? `${year}-10-26` : undefined,
      eczNationalExamsEnd: activeTermId === 'term_3' ? `${year}-11-27` : undefined,
      schoolClosingDate: endDate,
    },
  };
}

function calculateWeekNumber(current: Date, termStart: Date): number {
  const diffMs = current.getTime() - termStart.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}

function calculateMilestoneDate(startDateStr: string, weekNumber: number): string {
  const s = new Date(startDateStr);
  s.setDate(s.getDate() + (weekNumber - 1) * 7);
  return s.toISOString().split('T')[0];
}

/**
 * Automatically adjusts and returns an updated School record synchronized with Zambian academic rules
 */
export function autoSynchronizeSchoolWithZambianCalendar(school: School, targetDate?: Date | string): School {
  const info = getZambianCalendarInfo(targetDate);
  const updatedTerms = getZambianTermsForYear(info.year).map((t) => ({
    ...t,
    isActive: t.id === info.activeTermId,
  }));

  const zambianEvents = getZambianNationalEvents(info.year);

  return {
    ...school,
    academicYear: `${info.year}`,
    activeTerm: info.activeTermId,
    terms: updatedTerms,
    calendarEvents: school.calendarEvents && school.calendarEvents.length > 0 ? school.calendarEvents : zambianEvents,
  };
}
