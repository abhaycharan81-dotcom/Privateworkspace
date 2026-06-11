export function toDisplayValue(value) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value.trim() ? value : '—';

  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  // Handle Date-ish
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? value.toString() : value.toLocaleString();
  }
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
    // Keep as date only if the string looks date-like
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
  }

  // Arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return '—';
    return value
      .map(v => (typeof v === 'string' ? v : toDisplayValue(v)))
      .join(', ');
  }

  // Objects
  if (typeof value === 'object') {
    try {
      // If it is a plain object, stringify keys in a stable-ish way.
      // This is for display only (detail modal).
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

export function pickDisplayTitle(item, fallback = 'Details') {
  if (!item || typeof item !== 'object') return fallback;
  return (
    item.name ||
    item.title ||
    item.platform ||
    item.accountName ||
    item.contact ||
    item.destination ||
    item.username ||
    fallback
  );
}

