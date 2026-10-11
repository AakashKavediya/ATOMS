// ==========================================
// Secure token storage
// - Uses Tauri Store when running inside the desktop app
// - Falls back to localStorage in a browser (dev mode)
// ==========================================

import { STORAGE_KEYS } from './constants';

let storeInstance = null;
let isTauri = false;

// Detect Tauri environment
function detectTauri() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

// Lazy-load the Tauri Store plugin
async function getStore() {
  if (storeInstance) return storeInstance;

  if (!detectTauri()) {
    isTauri = false;
    return null;
  }

  try {
    const { load } = await import('@tauri-apps/plugin-store');
    storeInstance = await load('atoms.store.json', { autoSave: true });
    isTauri = true;
    return storeInstance;
  } catch (err) {
    console.warn('Tauri Store unavailable, falling back to localStorage:', err);
    isTauri = false;
    return null;
  }
}

// ==========================================
// Generic get/set/remove
// ==========================================
export async function setItem(key, value) {
  const store = await getStore();
  if (store) {
    await store.set(key, value);
    await store.save();
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export async function getItem(key) {
  const store = await getStore();
  if (store) {
    const value = await store.get(key);
    return value ?? null;
  }
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export async function removeItem(key) {
  const store = await getStore();
  if (store) {
    await store.delete(key);
    await store.save();
  } else {
    localStorage.removeItem(key);
  }
}

// ==========================================
// Convenience helpers for auth tokens
// ==========================================
export async function saveTokens({ access_token, refresh_token }) {
  if (access_token) await setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
  if (refresh_token) await setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
}

export async function loadTokens() {
  const [access_token, refresh_token] = await Promise.all([
    getItem(STORAGE_KEYS.ACCESS_TOKEN),
    getItem(STORAGE_KEYS.REFRESH_TOKEN),
  ]);
  return { access_token, refresh_token };
}

export async function clearTokens() {
  await Promise.all([
    removeItem(STORAGE_KEYS.ACCESS_TOKEN),
    removeItem(STORAGE_KEYS.REFRESH_TOKEN),
    removeItem(STORAGE_KEYS.USER),
  ]);
}

export async function saveUser(user) {
  await setItem(STORAGE_KEYS.USER, user);
}

export async function loadUser() {
  return await getItem(STORAGE_KEYS.USER);
}