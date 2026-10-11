import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import HODDashboardPage from '../pages/hod/DashboardPage';
import FacultyPage from '../pages/hod/FacultyPage';
import TeacherDashboardPage from '../pages/teacher/DashboardPage';
import StudentDashboardPage from '../pages/student/DashboardPage';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import TimetablePage from '../pages/hod/TimetablePage';
import LeaveManagementPage from '../pages/hod/LeaveManagementPage';
import ApplyLeavePage from '../pages/teacher/ApplyLeavePage';
import LeaveHistoryPage from '../pages/teacher/LeaveHistoryPage';
import SubstitutionsPage from '../pages/teacher/SubstitutionsPage';
import StudentAttendancePage from '../pages/student/AttendancePage';
import StudentProfilePage from '../pages/student/ProfilePage';
import { ROLES, ROUTES } from '../lib/constants';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path={ROUTES.REGISTER} element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* HOD */}
      <Route
        path="/hod"
        element={
            <ProtectedRoute allowedRoles={[ROLES.HOD, ROLES.ADMIN]}>
            <AppLayout title="HOD Portal" subtitle="Department Management" />
            </ProtectedRoute>
        }
        >
        <Route index element={<HODDashboardPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="leave" element={<LeaveManagementPage />} />
      </Route>

      {/* Teacher */}
      <Route
        path="/teacher"
        element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <AppLayout title="Teacher Portal" subtitle="Your workspace" />
            </ProtectedRoute>
        }
        >
        <Route index element={<TeacherDashboardPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="apply-leave" element={<ApplyLeavePage />} />
        <Route path="leave-history" element={<LeaveHistoryPage />} />
        <Route path="substitutions" element={<SubstitutionsPage />} />
      </Route>

      {/* Student */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <AppLayout title="Student Portal" subtitle="Your academics" />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboardPage />} />
        <Route path="attendance" element={<StudentAttendancePage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}