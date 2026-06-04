import { AsyncDataManagers } from './asyncDataManagers.js';
import { Storage } from './storage';



export const MODULES = [

  {
    id: 'credentials',
    name: 'Credential Management',
    icon: '🔐',
    description: 'Securely manage credentials and account information',
    color: '#ef4444'
  },
  {
    id: 'communications',
    name: 'Communication Hub',
    icon: '💬',
    description: 'Centralize communication tracking and follow-ups',
    color: '#3b82f6'
  },
  {
    id: 'projects',
    name: 'Project Tracking',
    icon: '📋',
    description: 'Manage ongoing and future projects with Kanban',
    color: '#8b5cf6'
  },
  {
    id: 'documents',
    name: 'Document Management',
    icon: '📄',
    description: 'Store and organize important documents',
    color: '#f59e0b'
  },
  {
    id: 'socialmedia',
    name: 'Social Media Management',
    icon: '📱',
    description: 'Manage content across multiple platforms',
    color: '#ec4899'
  },
  {
    id: 'meetings',
    name: 'Meeting Management',
    icon: '🗓️',
    description: 'Schedule meetings and track action items',
    color: '#10b981'
  },
  {
    id: 'travel',
    name: 'Travel Management',
    icon: '✈️',
    description: 'Plan trips and track travel expenses',
    color: '#06b6d4'
  }
];


export const DataManagers = {
  // RTDB-backed implementation (async)
  credentials: {
    getAll() {
      return AsyncDataManagers.credentials.getAll();
    },
    
    add(data) {
      return AsyncDataManagers.credentials.add(data);
    },
    
    update(id, data) {
      return AsyncDataManagers.credentials.update(id, data);
    },
    
    delete(id) {
      return AsyncDataManagers.credentials.delete(id);
    },
    
    search(query) {
      // Search requires loaded data; callers should handle this
      // For now, return a promise that resolves to empty array
      return Promise.resolve([]);
    }
  },

  communications: {
    getAll() {
      return AsyncDataManagers.communications.getAll();
    },
    add(data) {
      return AsyncDataManagers.communications.add(data);
    },
    update(id, data) {
      return AsyncDataManagers.communications.update(id, data);
    },
    delete(id) {
      return AsyncDataManagers.communications.delete(id);
    },
    search(query) {
      // Optional: search works on loaded data; keep it local to avoid extra reads.
      const communications = Storage.get('communications', []);
      const q = (query || '').toLowerCase();
      return communications.filter(c =>
        (c.contact || '').toLowerCase().includes(q) ||
        (c.type || '').toLowerCase().includes(q) ||
        (c.notes || '').toLowerCase().includes(q)
      );
    }
  },


  projects: {
    getAll() {
      return AsyncDataManagers.projects.getAll();
    },

    add(data) {
      return AsyncDataManagers.projects.add(data);
    },

    update(id, data) {
      return AsyncDataManagers.projects.update(id, data);
    },

    delete(id) {
      return AsyncDataManagers.projects.delete(id);
    },

    search(query) {
      const stored = Storage.get('projects', []);
      const projects = Array.isArray(stored) ? stored : Object.values(stored || {});
      const q = (query || '').toLowerCase();
      return projects.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }
  },


  documents: {
    getAll() {
      return AsyncDataManagers.documents.getAll();
    },

    add(data) {
      return AsyncDataManagers.documents.add(data);
    },

    update(id, data) {
      return AsyncDataManagers.documents.update(id, data);
    },

    delete(id) {
      return AsyncDataManagers.documents.delete(id);
    },

    search(query) {
      const documents = Storage.get('documents', []);
      const q = (query || '').toLowerCase();
      return documents.filter(d =>
        (d.name || '').toLowerCase().includes(q) ||
        (d.type || '').toLowerCase().includes(q) ||
        (d.tags && d.tags.some(tag => (tag || '').toLowerCase().includes(q)))
      );
    }
  },


  socialmedia: {
    getAll() {
      return AsyncDataManagers.socialmedia.getAll();
    },

    add(data) {
      return AsyncDataManagers.socialmedia.add(data);
    },

    update(id, data) {
      return AsyncDataManagers.socialmedia.update(id, data);
    },

    delete(id) {
      return AsyncDataManagers.socialmedia.delete(id);
    },

    search(query) {
      const posts = Storage.get('socialmedia', []);
      const q = (query || '').toLowerCase();
      return posts.filter(p =>
        (p.content || '').toLowerCase().includes(q) ||
        (p.platforms && p.platforms.some(pl => (pl || '').toLowerCase().includes(q)))
      );
    }
  },


  meetings: {
    getAll() {
      return AsyncDataManagers.meetings.getAll();
    },

    add(data) {
      return AsyncDataManagers.meetings.add(data);
    },

    update(id, data) {
      return AsyncDataManagers.meetings.update(id, data);
    },

    delete(id) {
      return AsyncDataManagers.meetings.delete(id);
    },

    search(query) {
      const meetings = Storage.get('meetings', []);
      const q = (query || '').toLowerCase();
      return meetings.filter(m =>
        (m.title || '').toLowerCase().includes(q) ||
        (m.participants && m.participants.some(p => (p || '').toLowerCase().includes(q))) ||
        (m.notes || '').toLowerCase().includes(q)
      );
    }
  },


  travel: {
    getAll() {
      return AsyncDataManagers.travel.getAll();
    },

    add(data) {
      return AsyncDataManagers.travel.add(data);
    },

    update(id, data) {
      return AsyncDataManagers.travel.update(id, data);
    },

    delete(id) {
      return AsyncDataManagers.travel.delete(id);
    },

    search(query) {
      const trips = Storage.get('travel', []);
      const q = (query || '').toLowerCase();
      return trips.filter(t =>
        (t.destination || '').toLowerCase().includes(q) ||
        (t.notes || '').toLowerCase().includes(q)
      );
    }
  }
};

