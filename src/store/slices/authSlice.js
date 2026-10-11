// ==========================================
// Auth slice — Redux Toolkit
// Handles: login, register, Google sign-in, logout, session restore, demo login
// ==========================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';
import {
  saveTokens,
  loadTokens,
  clearTokens,
  saveUser,
  loadUser,
} from '../../lib/secureStore';
import { ROLES } from '../../lib/constants';

// ==========================================
// Demo accounts — frontend-only preview
// ==========================================
export const DEMO_ACCOUNTS = [
  {
    role: 'HOD',
    email: 'hod@somaiya.edu',
    password: 'demo123',
    user: {
      id: 'demo-hod-001',
      email: 'hod@somaiya.edu',
      name: 'Dr. Rajesh Shah',
      picture: null,
      role: 'HOD',
      status: 'ACTIVE',
    },
  },
  {
    role: 'TEACHER',
    email: 'teacher@somaiya.edu',
    password: 'demo123',
    user: {
      id: 'demo-teacher-001',
      email: 'teacher@somaiya.edu',
      name: 'Prof. Neha Gupta',
      picture: null,
      role: 'TEACHER',
      status: 'ACTIVE',
    },
  },
  {
    role: 'STUDENT',
    email: 'student@somaiya.edu',
    password: 'demo123',
    user: {
      id: 'demo-student-001',
      email: 'student@somaiya.edu',
      name: 'Sneha Kulkarni',
      picture: null,
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  },
];

// ==========================================
// Async Thunks
// ==========================================

/**
 * Sign in with Google.
 * @param {string} idToken — Google ID token from Google Sign-In
 */
export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (idToken, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/google', { id_token: idToken });
      await saveTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      await saveUser(data.user);
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || 'Google sign-in failed'
      );
    }
  }
);

/**
 * Sign in with email + password (real backend).
 */
export const signInWithPassword = createAsyncThunk(
  'auth/signInWithPassword',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await saveTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      await saveUser(data.user);
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || 'Login failed'
      );
    }
  }
);

/**
 * Register a new account (email + password).
 */
export const registerAccount = createAsyncThunk(
  'auth/registerAccount',
  async ({ email, name, password, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', {
        email,
        name,
        password,
        role,
      });
      await saveTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      await saveUser(data.user);
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || 'Registration failed'
      );
    }
  }
);

/**
 * Demo login — bypasses the backend entirely.
 * Matches credentials against DEMO_ACCOUNTS.
 */
export const loginAsDemo = createAsyncThunk(
  'auth/loginAsDemo',
  async ({ email, password }, { rejectWithValue }) => {
    const account = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!account) {
      return rejectWithValue('No demo account found for this email');
    }

    if (account.password !== password) {
      return rejectWithValue('Incorrect demo password');
    }

    // Persist the demo user so session restore works
    await saveUser(account.user);

    // Simulate a tiny delay so the loading state is visible
    await new Promise((r) => setTimeout(r, 250));

    return account.user;
  }
);

/**
 * Restore session on app startup — reads tokens + user from storage.
 */
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const { access_token } = await loadTokens();

      // No access token → check if there's a demo user stored
      if (!access_token) {
        const cachedUser = await loadUser();
        if (cachedUser && cachedUser.id?.startsWith('demo-')) {
          // Valid demo session
          return cachedUser;
        }
        return null;
      }

      // Real session → validate with backend
      const { data } = await api.get('/auth/me');
      const user = data.user;

      await saveUser(user);
      return user;
    } catch (err) {
      // Fall back to cached demo user if backend is unreachable
      try {
        const cachedUser = await loadUser();
        if (cachedUser && cachedUser.id?.startsWith('demo-')) {
          return cachedUser;
        }
      } catch {
        // ignore
      }
      await clearTokens();
      return rejectWithValue('Session expired');
    }
  }
);

/**
 * Logout — revokes the refresh token on the backend, clears local state.
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const { refresh_token } = await loadTokens();
      if (refresh_token) {
        await api.post('/auth/logout', { refresh_token }).catch(() => {});
      }
    } finally {
      await clearTokens();
    }
    return true;
  }
);

// ==========================================
// Slice
// ==========================================

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isBootstrapping: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      saveUser(action.payload);
    },
  },
  extraReducers: (builder) => {
    // --------- Google Sign-In ---------
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Google sign-in failed';
      });

    // --------- Password Login ---------
    builder
      .addCase(signInWithPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });

    // --------- Register ---------
    builder
      .addCase(registerAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      });

    // --------- Demo Login ---------
    builder
      .addCase(loginAsDemo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsDemo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsDemo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Demo login failed';
      });

    // --------- Session Restore ---------
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isBootstrapping = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isBootstrapping = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isBootstrapping = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // --------- Logout ---------
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { clearAuthError, setUser } = authSlice.actions;

// ==========================================
// Selectors
// ==========================================
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsBootstrapping = (state) => state.auth.isBootstrapping;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.user?.role || null;

export default authSlice.reducer;