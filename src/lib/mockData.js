// ==========================================
// Mock data — replace with real API calls later
// ==========================================

// ---------- HOD Dashboard ----------
export const hodStats = [
  { title: "Today's Lectures", value: 12, icon: 'BookOpen', color: 'amber' },
  { title: 'Pending Approvals', value: 4, icon: 'Clock', color: 'blue' },
  { title: 'Substitutions', value: 3, icon: 'RefreshCw', color: 'purple' },
  { title: 'Compensations', value: 1, icon: 'UserCheck', color: 'green' },
];

export const hodLeaveTrends = [
  { month: 'Jan', requests: 5 },
  { month: 'Feb', requests: 8 },
  { month: 'Mar', requests: 3 },
  { month: 'Apr', requests: 10 },
  { month: 'May', requests: 6 },
  { month: 'Jun', requests: 4 },
];

export const hodNotifications = [
  { id: 1, teacher: 'Prof. Smith', type: 'Sick Leave', date: 'Today', status: 'pending' },
  { id: 2, teacher: 'Prof. Johnson', type: 'Casual Leave', date: 'Tomorrow', status: 'pending' },
  { id: 3, teacher: 'Prof. Davis', type: 'Sick Leave', date: 'Oct 12', status: 'pending' },
  { id: 4, teacher: 'Prof. Wilson', type: 'Comp Off', date: 'Oct 15', status: 'pending' },
];

export const hodWorkHours = [
  { teacher: 'Prof. Smith', hoursDone: 18, totalHours: 20 },
  { teacher: 'Prof. Johnson', hoursDone: 15, totalHours: 20 },
  { teacher: 'Prof. Davis', hoursDone: 20, totalHours: 20 },
  { teacher: 'Prof. Wilson', hoursDone: 12, totalHours: 20 },
  { teacher: 'Prof. Brown', hoursDone: 19, totalHours: 20 },
];

// ---------- Faculty ----------
export const facultyList = [
  {
    id: 1,
    name: 'Dr. Neha Gupta',
    initials: 'NG',
    role: 'Associate Professor',
    department: 'Electronics & Telecom',
    email: 'n.gupta@college.edu',
    subjects: ['Cloud Computing', 'DevOps'],
    hoursDone: 19,
    hoursTotal: 22,
    status: 'Available',
  },
  {
    id: 2,
    name: 'Dr. Rajesh Kumar',
    initials: 'RK',
    role: 'Professor',
    department: 'Computer Science',
    email: 'r.kumar@college.edu',
    subjects: ['Data Structures', 'Algorithms'],
    hoursDone: 22,
    hoursTotal: 22,
    status: 'Busy',
  },
  {
    id: 3,
    name: 'Prof. Anjali Sharma',
    initials: 'AS',
    role: 'Assistant Professor',
    department: 'Information Technology',
    email: 'a.sharma@college.edu',
    subjects: ['Web Dev', 'UI/UX'],
    hoursDone: 14,
    hoursTotal: 22,
    status: 'Available',
  },
  {
    id: 4,
    name: 'Dr. Vikram Singh',
    initials: 'VS',
    role: 'Associate Professor',
    department: 'Electronics & Telecom',
    email: 'v.singh@college.edu',
    subjects: ['VLSI', 'Embedded Systems'],
    hoursDone: 18,
    hoursTotal: 22,
    status: 'On Leave',
  },
  {
    id: 5,
    name: 'Prof. Priya Patel',
    initials: 'PP',
    role: 'Assistant Professor',
    department: 'Computer Science',
    email: 'p.patel@college.edu',
    subjects: ['AI', 'Machine Learning'],
    hoursDone: 20,
    hoursTotal: 22,
    status: 'Available',
  },
  {
    id: 6,
    name: 'Dr. Arjun Mehta',
    initials: 'AM',
    role: 'Professor',
    department: 'Information Technology',
    email: 'a.mehta@college.edu',
    subjects: ['Networks', 'Security'],
    hoursDone: 8,
    hoursTotal: 22,
    status: 'Available',
  },
];

// ---------- Leave ----------
export const leaveRequests = [
  {
    id: 1,
    teacherName: 'Dr. Neha Gupta',
    role: 'Associate Professor',
    department: 'Electronics and Telecommunication',
    email: 'n.gupta@college.edu',
    initials: 'NG',
    avatarColor: 'from-amber-400 to-orange-500',
    accentColor: 'bg-orange-400',
    leaveType: 'Sick Leave',
    attachment: 'medical_certificate.pdf',
    date: '10 August 2026',
    duration: 'Full Day',
    status: 'pending',
    remarks: 'Awaiting HOD review',
    lecturesAffected: [
      { time: '9.00 - 10.00', subject: 'Signal and System', class: 'EXTC SY A', room: 'CR: 12' },
      { time: '12.30 - 1.30', subject: 'Digital Signal Processing', class: 'EXTC TY B', room: 'CR: 09' },
    ],
  },
  {
    id: 2,
    teacherName: 'Dr. Rajesh Kumar',
    role: 'Professor',
    department: 'Computer Science',
    email: 'r.kumar@college.edu',
    initials: 'RK',
    avatarColor: 'from-blue-400 to-indigo-500',
    accentColor: 'bg-blue-400',
    leaveType: 'Casual Leave',
    attachment: null,
    date: '12 August 2026',
    duration: 'Half Day',
    status: 'pending',
    remarks: 'Awaiting HOD review',
    lecturesAffected: [
      { time: '10.00 - 11.00', subject: 'Data Structures', class: 'CS SY A', room: 'CR: 21' },
    ],
  },
  {
    id: 3,
    teacherName: 'Prof. Anjali Sharma',
    role: 'Assistant Professor',
    department: 'Information Technology',
    email: 'a.sharma@college.edu',
    initials: 'AS',
    avatarColor: 'from-purple-400 to-fuchsia-500',
    accentColor: 'bg-purple-400',
    leaveType: 'Sick Leave',
    attachment: 'prescription.jpg',
    date: '14 August 2026',
    duration: 'Full Day',
    status: 'pending',
    remarks: 'Awaiting HOD review',
    lecturesAffected: [
      { time: '9.00 - 10.00', subject: 'Web Development', class: 'IT FY B', room: 'CR: 05' },
      { time: '11.00 - 12.00', subject: 'UI/UX Design', class: 'IT SY A', room: 'CR: 18' },
      { time: '2.00 - 3.00', subject: 'Project Lab', class: 'IT TY A', room: 'LAB: 3' },
    ],
  },
];

// ---------- Timetable ----------
export const timetableDays = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
export const timetableSlots = ['09:00', '10:00', '11:00', '12:00', '12:30'];

export const timetableData = {
  Mon: {
    '09:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'pink' },
    '10:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'teal' },
  },
  Tue: {
    '09:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'blue' },
    '10:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'pink' },
    '11:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'blue' },
    '12:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'orange' },
  },
  Wed: {
    '11:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'pink' },
    '12:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'blue' },
  },
  Thur: {
    '10:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'green' },
    '11:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'orange' },
    '12:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'pink' },
  },
  Fri: {
    '09:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'green' },
    '10:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'teal' },
    '11:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'pink' },
    '12:00': { subject: 'Digital Circuits', teacher: 'Dr. Sneha Mehta', room: 'F-101', batch: 'FY-A', type: 'Lec', color: 'blue' },
  },
  Sat: {},
};

// ---------- Teacher Dashboard ----------
export const teacherStats = [
  { title: 'Total Lectures', value: 4, icon: 'BookOpen', color: 'amber' },
  { title: 'Pending Leave Requests', value: 4, icon: 'Clock', color: 'blue' },
  { title: 'Substitute Requests', value: 15, icon: 'RefreshCw', color: 'purple' },
  { title: 'Teaching Hours This Week', value: 6, icon: 'Calendar', color: 'green' },
];

export const teacherTimetableToday = [
  { id: 1, subject: 'Data Structures', class: 'Sem 3 - Div B - C-108', time: null, status: null, accentColor: 'bg-orange-400' },
  { id: 2, subject: 'DBMS', class: 'Sem 3 - Div B - C-108', time: '11:00 — 12:00', status: 'Ongoing', accentColor: 'bg-green-500', isOngoing: true },
  { id: 3, subject: 'Compiler Design', class: 'Sem 7 - Div A - Lab 3', time: '14:00 — 16:00', status: 'Upcoming', accentColor: 'bg-teal-500' },
  { id: 4, subject: 'Computer Network', class: 'Sem 7 - Div A - Lab 3', time: '16:00 — 18:00', status: 'Upcoming', accentColor: 'bg-blue-500' },
];

// ---------- Student Dashboard ----------
export const studentStats = [
  { title: 'Attendance', value: '87%', icon: 'TrendingUp', color: 'green' },
  { title: 'Pending Assignments', value: 3, icon: 'FileText', color: 'amber' },
  { title: "Today's Lectures", value: 5, icon: 'BookOpen', color: 'blue' },
  { title: 'CGPA', value: '8.4', icon: 'Award', color: 'purple' },
];

// ---------- Substitutions ----------
export const substituteRequests = [
  { id: 1, requestId: 'SR-101', subject: 'Software Engg.', teacher: 'Prof. R. Iyer', day: 'Wed, 5 Aug', classInfo: 'Sem 6 - Div A', room: 'C-110', time: '09:00 — 10:00', remark: 'Medical leave approved by HOD.', status: 'Pending' },
  { id: 2, subject: 'Software Engg.', teacher: 'Prof. R. Iyer', day: 'Wed, 5 Aug', classInfo: 'Sem 6 - Div A', room: 'C-110', time: '09:00 — 10:00', remark: 'Medical leave approved by HOD.', status: 'Pending' },
  { id: 3, subject: 'Software Engg.', teacher: 'Prof. R. Iyer', day: 'Wed, 5 Aug', classInfo: 'Sem 6 - Div A', room: 'C-110', time: '09:00 — 10:00', remark: 'Medical leave approved by HOD.', status: 'Pending' },
  { id: 4, requestId: 'SR-110', subject: 'Software Engg.', teacher: 'Prof. R. Iyer', day: 'Wed, 5 Aug', classInfo: 'Sem 6 - Div A', room: 'C-110', time: '09:00 — 10:00', remark: 'Medical leave approved by HOD.', status: 'Pending' },
];

// ---------- Available teachers (for substitution) ----------
export const availableTeachers = [
  { id: 't1', name: 'Prof. R. Iyer', dept: 'Computer Science' },
  { id: 't2', name: 'Prof. S. Mehta', dept: 'Computer Science' },
  { id: 't3', name: 'Prof. A. Kumar', dept: 'Information Technology' },
  { id: 't4', name: 'Prof. N. Sharma', dept: 'Electronics' },
  { id: 't5', name: 'Prof. K. Patel', dept: 'Computer Science' },
];

// ---------- Teacher Leave History ----------
export const teacherLeaveHistory = [
  {
    id: 1,
    date: '12 Aug 2026',
    type: 'Casual Leave',
    duration: 'Full Day',
    status: 'Pending',
    remarks: 'Awaiting HOD review',
    affectedLectures: [
      { id: 101, subject: 'Data Structures', class: 'Sem 3 - Div A', time: '09:00 — 10:00', room: 'C-204', assignedTo: null },
      { id: 102, subject: 'DBMS', class: 'Sem 3 - Div B', time: '11:00 — 12:00', room: 'C-108', assignedTo: null },
    ],
  },
  {
    id: 2,
    date: '05 Aug 2026',
    type: 'Casual Leave',
    duration: 'Full Day',
    status: 'Approved',
    remarks: 'Substitute confirmed',
    affectedLectures: [
      { id: 201, subject: 'Software Engg.', class: 'Sem 6 - Div A', time: '09:00 — 10:00', room: 'C-110', assignedTo: 'Prof. R. Iyer' },
      { id: 202, subject: 'Compiler Design', class: 'Sem 7 - Div A', time: '14:00 — 16:00', room: 'Lab 3', assignedTo: 'Prof. S. Mehta' },
    ],
  },
  {
    id: 3,
    date: '28 Jul 2026',
    type: 'Sick Leave',
    duration: 'Half Day',
    status: 'Approved',
    remarks: 'Approved by HOD',
    affectedLectures: [
      { id: 301, subject: 'Data Structures', class: 'Sem 3 - Div A', time: '09:00 — 10:00', room: 'C-204', assignedTo: 'Prof. A. Kumar' },
    ],
  },
  {
    id: 4,
    date: '20 Jul 2026',
    type: 'Casual Leave',
    duration: 'Full Day',
    status: 'Rejected',
    remarks: 'Insufficient leave balance',
    affectedLectures: [],
  },
];