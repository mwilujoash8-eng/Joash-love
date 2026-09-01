import { getAccessToken } from './googleAuth';

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  ownerId?: string;
  courseState?: string;
  alternateLink?: string;
  enrollmentCode?: string;
}

export interface ClassroomCourseWork {
  id: string;
  title: string;
  description?: string;
  state?: string;
  alternateLink?: string;
  maxPoints?: number;
  dueDate?: { year: number; month: number; day: number };
  dueTime?: { hours: number; minutes: number };
  creationTime?: string;
  workType?: string;
}

export interface ClassroomAnnouncement {
  id: string;
  text: string;
  creationTime?: string;
  updateTime?: string;
  alternateLink?: string;
  state?: string;
}

export const fetchClassroomCourses = async (): Promise<ClassroomCourse[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace');

  const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch Classroom courses: ${res.statusText}`);
  }

  const data = await res.json();
  return data.courses || [];
};

export const fetchCourseWork = async (courseId: string): Promise<ClassroomCourseWork[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch course work: ${res.statusText}`);
  }

  const data = await res.json();
  return data.courseWork || [];
};

export const fetchAnnouncements = async (courseId: string): Promise<ClassroomAnnouncement[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch announcements: ${res.statusText}`);
  }

  const data = await res.json();
  return data.announcements || [];
};

export const createClassroomAnnouncement = async (
  courseId: string,
  text: string
): Promise<ClassroomAnnouncement> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      state: 'PUBLISHED',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create announcement: ${res.statusText}`);
  }

  return res.json();
};

export const createClassroomCourseWork = async (
  courseId: string,
  title: string,
  description: string,
  maxPoints: number = 100
): Promise<ClassroomCourseWork> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      maxPoints,
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create coursework: ${res.statusText}`);
  }

  return res.json();
};
