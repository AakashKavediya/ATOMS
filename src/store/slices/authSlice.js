// ==========================================
// Auth slice — Redux Toolkit
// Handles: login, register, Google sign-in, logout, session restore
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
 * Sign in with email + password.
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
 * Restore session on app startup — reads tokens + user from storage.
 */
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const { access_token } = await loadTokens();
      if (!access_token) return null;

      const cachedUser = await loadUser();

      // Validate the token by hitting /auth/me
      const { data } = await api.get('/auth/me');
      const user = data.user;

      await saveUser(user);
      return user;
    } catch (err) {
      // Token invalid/expired & refresh failed → clear everything
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
  isLoading: false,       // for login/register actions
  isBootstrapping: true,  // true until restoreSession finishes
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Manually clear error (e.g., when user starts typing).
     */
    clearAuthError: (state) => {
      state.error = null;
    },

    /**
     * Update user (e.g., after profile edit).
     */
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
    builder
      .addCase(logoutUser.fulfilled, (state) => {
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