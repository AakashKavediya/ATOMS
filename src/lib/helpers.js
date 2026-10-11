// ==========================================
// Generic helpers
// ==========================================

/**
 * Format an ISO date string into a friendly display format.
 * Example: "2026-08-12" → "12 Aug 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

/**
 * Get initials from a full name. "Aakash Kavediya" → "AK"
 */
export function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text, max = 40) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
}

/**
 * Wait N milliseconds (useful for testing).
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}