import {
  rtdbGetAll,
  rtdbAdd,
  rtdbUpdate,
  rtdbDelete,
} from './rtb.js';

// RTDB-backed async equivalents of the previous localStorage DataManagers.
// Each module is stored at: /users/<uid>/data/<moduleName>

const ensureArray = (x, fallback) => (Array.isArray(x) ? x : fallback);

const addBulk = async (moduleName, items) => {
  if (!Array.isArray(items) || items.length === 0) return;
  // Simple sequential writes for single-user app.
  for (const item of items) {
    // Preserve existing id if present, otherwise let add() create.
    await rtdbAdd(moduleName, item);
  }
};

export const AsyncDataManagers = {

  credentials: {
    getAll: () => rtdbGetAll('credentials', []),
    add: async (data) => {
      const credential = {
        id: Date.now(),
        ...data,
        createdAt: new Date(),
      };
      await rtdbAdd('credentials', credential);
      return credential;
    },
    update: async (id, data) => {
      return rtdbUpdate('credentials', id, (current) => ({
        ...current,
        ...data,
        updatedAt: new Date(),
      }));
    },
    delete: async (id) => rtdbDelete('credentials', id),
  },

  communications: {
    getAll: () => rtdbGetAll('communications', []),
    add: async (data) => {
      const communication = {
        id: Date.now(),
        ...data,
        createdAt: new Date(),
      };
      await rtdbAdd('communications', communication);
      return communication;
    },
    update: async (id, data) => {
      return rtdbUpdate('communications', id, (current) => ({
        ...current,
        ...data,
        updatedAt: new Date(),
      }));
    },
    delete: async (id) => rtdbDelete('communications', id),
  },

  projects: {
    getAll: () => rtdbGetAll('projects', []),
    add: async (data) => {
      const project = {
        id: Date.now(),
        ...data,
        status: data.status || 'planned',
        tasks: [],
        createdAt: new Date(),
      };
      await rtdbAdd('projects', project);
      return project;
    },
    update: async (id, data) => {
      return rtdbUpdate('projects', id, (current) => ({
        ...current,
        ...data,
        updatedAt: new Date(),
      }));
    },
    delete: async (id) => rtdbDelete('projects', id),
  },

  documents: {
    getAll: () => rtdbGetAll('documents', []),
    add: async (data) => {
      const document = {
        id: Date.now(),
        ...data,
        createdAt: new Date(),
      };
      await rtdbAdd('documents', document);
      return document;
    },
    update: async (id, data) => {
      return rtdbUpdate('documents', id, (current) => ({
        ...current,
        ...data,
        updatedAt: new Date(),
      }));
    },
    delete: async (id) => rtdbDelete('documents', id),
  },

  socialmedia: {
    getAll: () => rtdbGetAll('socialmedia', []),
    add: async (data) => {
      const post = {
        id: Date.now(),
        ...data,
        status: data.status || 'draft',
        createdAt: new Date(),
      };
      await rtdbAdd('socialmedia', post);
      return post;
    },
    update: async (id, data) => {
      return rtdbUpdate('socialmedia', id, (current) => ({
        ...current,
        ...data,
        updatedAt: new Date(),
      }));
    },
    delete: async (id) => rtdbDelete('socialmedia', id),
  },

  meetings: {
    getAll: () => rtdbGetAll('meetings', []),
    add: async (data) => {
      const meeting = {
        id: Date.now(),
        ...data,
        status: data.status || 'scheduled',
        actionItems: [],
        createdAt: new Date(),
      };
      await rtdbAdd('meetings', meeting);
      return meeting;
    },
    update: async (id, data) => {
      return rtdbUpdate('meetings', id, (current) => ({
        ...current,
        ...data,
        updatedAt: new Date(),
      }));
    },
    delete: async (id) => rtdbDelete('meetings', id),
  },

  travel: {
    getAll: () => rtdbGetAll('travel', []),
    add: async (data) => {
      const trip = {
        id: Date.now(),
        ...data,
        expenses: 0,
        createdAt: new Date(),
      };
      await rtdbAdd('travel', trip);
      return trip;
    },
    update: async (id, data) => {
      return rtdbUpdate('travel', id, (current) => ({
        ...current,
        ...data,
        updatedAt: new Date(),
      }));
    },
    delete: async (id) => rtdbDelete('travel', id),
  },
};

