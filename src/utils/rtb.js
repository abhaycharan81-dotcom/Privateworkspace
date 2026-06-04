import { ref, get, set, remove, child, update } from 'firebase/database';
import { database } from '../firebase/firebase.js';

const getUserUid = () => {
  // Anonymous auth is not wired yet, so we use a fixed key for now.
  // Security rules will still scope access to this fixed key.
  // We will update this to uid-based once auth is in place.
  return 'local-user';
};

const pathFor = (moduleName) => {
  // Schema: /users/<uid>/data/<moduleName>
  const uid = getUserUid();
  return `users/${uid}/data/${moduleName}`;
};

export async function rtdbGetAll(moduleName, defaultValue = []) {
  const dbPath = pathFor(moduleName);
  const snapshot = await get(child(ref(database), dbPath));
  if (!snapshot.exists()) return defaultValue;
  const val = snapshot.val();

  // Firebase RTDB sometimes stores collections as objects (key->item) instead of arrays.
  // Callers expect an array with `.filter`, `.map`, etc.
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object') return Object.values(val);
  return defaultValue;
}


export async function rtdbSetAll(moduleName, items) {
  const dbPath = pathFor(moduleName);
  await set(child(ref(database), dbPath), items);
  return true;
}

export async function rtdbAdd(moduleName, item) {
  const items = await rtdbGetAll(moduleName, []);
  const next = [...items, item];
  await rtdbSetAll(moduleName, next);
  return item;
}

export async function rtdbUpdate(moduleName, id, updater) {
  const items = await rtdbGetAll(moduleName, []);
  const idx = items.findIndex((x) => x && x.id === id);
  if (idx < 0) return null;
  const current = items[idx];
  const updated = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  items[idx] = updated;
  await rtdbSetAll(moduleName, items);
  return updated;
}

export async function rtdbDelete(moduleName, id) {
  const items = await rtdbGetAll(moduleName, []);
  const next = items.filter((x) => x && x.id !== id);
  await rtdbSetAll(moduleName, next);
  return true;
}

export function rtdbSearchLocal(moduleName, items, query, predicate) {
  // pure helper - keeps existing search behaviors in the managers.
  const q = (query || '').toLowerCase();
  if (!q) return items;
  return predicate(items, q);
}

