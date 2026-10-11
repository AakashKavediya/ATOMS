import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsBootstrapping, selectUserRole } from '../store/slices/authSlice';
import { ROUTES, ROLE_HOME } from '../lib/constants';

export default function PublicRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isBootstrapping = useSelector(selectIsBootstrapping);
  const role = useSelector(selectUserRole);

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && role) {
    return <Navigate to={ROLE_HOME[role] || '/'} replace />;
  }

  return children;
}