import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Storage } from '../utils/storage';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [workspaces] = useState(['Workspace 1', 'Workspace 2', 'Workspace 3']);
  const [currentWorkspace] = useState(0);

  const DEFAULT_SETTINGS = {
    notificationsEnabled: true,
    globalSearchEnabled: true,
    modulePreferences: {
      credentials: true,
      communications: true,
      projects: true,
      documents: true,
      socialmedia: true,
      meetings: true,
      travel: true
    }
  };

  const [notificationsEnabled, setNotificationsEnabled] = useState(DEFAULT_SETTINGS.notificationsEnabled);
  const [globalSearchEnabled, setGlobalSearchEnabled] = useState(DEFAULT_SETTINGS.globalSearchEnabled);
  const [modulePreferences, setModulePreferences] = useState(DEFAULT_SETTINGS.modulePreferences);


  useEffect(() => {
    setNotifications(Storage.get('notifications', []));
    setActivityLog(Storage.get('activityLog', []));

    const loaded = Storage.get('settings', null);
    if (loaded && typeof loaded === 'object') {
      if (typeof loaded.notificationsEnabled === 'boolean') {
        setNotificationsEnabled(loaded.notificationsEnabled);
      }
      if (typeof loaded.globalSearchEnabled === 'boolean') {
        setGlobalSearchEnabled(loaded.globalSearchEnabled);
      }
      if (loaded.modulePreferences && typeof loaded.modulePreferences === 'object') {
        setModulePreferences({
          ...DEFAULT_SETTINGS.modulePreferences,
          ...loaded.modulePreferences
        });
      }
    }
  }, []);


  const addNotification = useCallback((type, title, message) => {
    const notification = {
      id: Date.now(),
      type,
      title,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => {
      const updated = [...prev, notification];
      Storage.set('notifications', updated);
      return updated;
    });
    return notification;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      Storage.set('notifications', updated);
      return updated;
    });
  }, []);

  const logActivity = useCallback((module, action, description) => {
    const activity = {
      id: Date.now(),
      module,
      action,
      description,
      timestamp: new Date()
    };
    setActivityLog(prev => {
      const updated = [activity, ...prev];
      if (updated.length > 100) {
        updated.pop();
      }
      Storage.set('activityLog', updated);
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        notifications,
        activityLog,
        currentModule,
        setCurrentModule,
        addNotification,
        removeNotification,
        logActivity,
        workspaces,
        currentWorkspace,
        notificationCount: notifications.length,

        // Settings state + setters
        notificationsEnabled,
        setNotificationsEnabled,
        globalSearchEnabled,
        setGlobalSearchEnabled,
        modulePreferences,
        setModulePreferences
      }}

    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppState = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
};
