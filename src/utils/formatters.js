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

function startOfLocalDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameLocalDay(a, b) {
  return startOfLocalDay(a).getTime() === startOfLocalDay(b).getTime();
}

function parseDeadline(deadline) {
  if (!deadline) return undefined;
  if (deadline instanceof Date) {
    return Number.isNaN(deadline.getTime()) ? undefined : deadline;
  }
  if (typeof deadline === 'string') {
    const s = deadline.trim();
    if (!s) return undefined;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  // try generic parse
  const d = new Date(deadline);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function formatProjectDeadlineLabel(deadline) {
  const d = parseDeadline(deadline);
  if (!d) return '—';

  const now = new Date();
  const today = startOfLocalDay(now);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (isSameLocalDay(d, today)) return 'by today';
  if (isSameLocalDay(d, tomorrow)) return 'by tonight';

  // keep output compact but readable
  const dateStr = d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  return `by ${dateStr}`;
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


