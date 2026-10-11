// ==========================================
// useAuth — convenient auth hook
// ==========================================

import { useSelector, useDispatch } from 'react-redux';
import {
  signInWithGoogle,
  signInWithPassword,
  registerAccount,
  logoutUser,
  restoreSession,
  clearAuthError,
  selectUser,
  selectIsAuthenticated,
  selectIsBootstrapping,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
} from '../store/slices/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isBootstrapping = useSelector(selectIsBootstrapping);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const role = useSelector(selectUserRole);

  return {
    // State
    user,
    isAuthenticated,
    isBootstrapping,
    isLoading,
    error,
    role,

    // Actions
    signInWithGoogle: (idToken) => dispatch(signInWithGoogle(idToken)).unwrap(),
    signInWithPassword: (creds) => dispatch(signInWithPassword(creds)).unwrap(),
    register: (payload) => dispatch(registerAccount(payload)).unwrap(),
    logout: () => dispatch(logoutUser()).unwrap(),
    restoreSession: () => dispatch(restoreSession()).unwrap(),
    clearError: () => dispatch(clearAuthError()),
  };
}