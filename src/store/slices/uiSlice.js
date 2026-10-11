import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getItem, setItem } from '../../lib/secureStore';
import { STORAGE_KEYS } from '../../lib/constants';

// ---------- Async: load persisted prefs ----------
export const loadUIPrefs = createAsyncThunk('ui/loadPrefs', async () => {
  const [sidebarCollapsed, theme] = await Promise.all([
    getItem('atoms.sidebar_collapsed'),
    getItem(STORAGE_KEYS.THEME),
  ]);
  return {
    sidebarCollapsed: sidebarCollapsed ?? false,
    theme: theme || 'light',
  };
});

// ---------- Async: persist ----------
export const persistUIPrefs = createAsyncThunk(
  'ui/persistPrefs',
  async ({ sidebarCollapsed, theme }) => {
    await setItem('atoms.sidebar_collapsed', sidebarCollapsed);
    await setItem(STORAGE_KEYS.THEME, theme);
    return true;
  }
);

const initialState = {
  sidebarCollapsed: false,
  theme: 'light', // 'light' | 'dark'
  loaded: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      persistUIPrefs({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      });
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      persistUIPrefs({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      });
      // Apply class on <html> for Tailwind dark mode
      const root = document.documentElement;
      if (state.theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      const root = document.documentElement;
      if (state.theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUIPrefs.fulfilled, (state, action) => {
      state.sidebarCollapsed = action.payload.sidebarCollapsed;
      state.theme = action.payload.theme;
      state.loaded = true;
      const root = document.documentElement;
      if (state.theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    });
  },
});

export const { toggleSidebar, toggleTheme, setTheme } = uiSlice.actions;

// Selectors
export const selectSidebarCollapsed = (s) => s.ui.sidebarCollapsed;
export const selectTheme = (s) => s.ui.theme;
export const selectUILoaded = (s) => s.ui.loaded;

export default uiSlice.reducer;