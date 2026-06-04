import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Storage } from '../utils/storage';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [workspaces] = useState(['Workspace 1', 'Workspace 2', 'Workspace 3']);
  const [currentWorkspace] = useState(0);

  useEffect(() => {
    setNotifications(Storage.get('notifications', []));
    setActivityLog(Storage.get('activityLog', []));
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
        notificationCount: notifications.length
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
