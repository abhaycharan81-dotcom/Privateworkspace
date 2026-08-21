// Storage utility for localStorage persistence
import { auth } from '../firebase/firebase';

const PREFIX = 'pw_';

function getUserStorageKey(key) {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('Cannot access user storage without an authenticated user');
  }
  return `${PREFIX}${uid}_${key}`;
}

export const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(getUserStorageKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(getUserStorageKey(key), JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  delete(key) {
    try {
      localStorage.removeItem(getUserStorageKey(key));
      return true;
    } catch (e) {
      console.error('Storage delete error:', e);
      return false;
    }
  },

  clear() {
    try {
      const uidPrefix = `${PREFIX}${auth.currentUser?.uid}_`;
      if (!auth.currentUser?.uid) {
        throw new Error('Cannot clear user storage without an authenticated user');
      }
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(uidPrefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  }
};
