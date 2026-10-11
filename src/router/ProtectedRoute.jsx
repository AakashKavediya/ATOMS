import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsBootstrapping, selectUserRole } from '../store/slices/authSlice';
import { ROUTES, ROLE_HOME } from '../lib/constants';

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isBootstrapping = useSelector(selectIsBootstrapping);
  const role = useSelector(selectUserRole);

  // While restoring session, show a loading screen
  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Logged in but role not assigned → show waiting screen
  if (!role) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] flex items-center justify-center p-6">
        <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-3xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Waiting for role assignment
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your account is pending. Please contact your HOD or admin to assign you a role.
          </p>
        </div>
      </div>
    );
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their own home
    return <Navigate to={ROLE_HOME[role] || ROUTES.LOGIN} replace />;
  }

  return children;
}