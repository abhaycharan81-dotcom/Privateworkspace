// Storage utility for localStorage persistence
const PREFIX = 'pw_';

export const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  delete(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch (e) {
      console.error('Storage delete error:', e);
      return false;
    }
  },

  clear() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(PREFIX)) {
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
