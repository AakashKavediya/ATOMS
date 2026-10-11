// ==========================================
// ATOMS — App-wide constants
// ==========================================

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// ==========================================
// User Roles
// ==========================================
export const ROLES = {
  HOD: 'HOD',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
};

// ==========================================
// User Status
// ==========================================
export const USER_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
};

// ==========================================
// Storage keys (used by Tauri Store + fallback to localStorage)
// ==========================================
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'atoms.access_token',
  REFRESH_TOKEN: 'atoms.refresh_token',
  USER: 'atoms.user',
  THEME: 'atoms.theme',
};

// ==========================================
// Route paths
// ==========================================
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  HOD_DASHBOARD: '/hod',
  TEACHER_DASHBOARD: '/teacher',
  STUDENT_DASHBOARD: '/student',
};

// ==========================================
// Role → Landing route (after login)
// ==========================================
export const ROLE_HOME = {
  HOD: ROUTES.HOD_DASHBOARD,
  TEACHER: ROUTES.TEACHER_DASHBOARD,
  STUDENT: ROUTES.STUDENT_DASHBOARD,
  ADMIN: ROUTES.HOD_DASHBOARD, // admin lands on HOD view for now
};