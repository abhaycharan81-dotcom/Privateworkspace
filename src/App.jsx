import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Topbar } from './components/layout/Topbar';

import { Dashboard } from './components/layout/Dashboard';

import { AppProvider } from './context/AppContext';
import { SettingsModal } from './components/layout/SettingsModal';
import { ModulePage } from './components/layout/ModulePage';
import { LoginPage } from './components/layout/LoginPage';
import { auth } from './firebase/firebase';
import './App.css';

function AppContent({ user }) {
  const [currentModule, setCurrentModule] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleModuleClick = (moduleId) => {
    setCurrentModule(moduleId);
  };

  const handleCloseModal = () => {
    setCurrentModule(null);
  };

  useEffect(() => {
    const handler = () => setShowSettings(true);
    window.addEventListener('pw:openSettings', handler);
    return () => window.removeEventListener('pw:openSettings', handler);
  }, []);

  return (
    <div className="app">
      <Topbar user={user} onModuleClick={handleModuleClick} />

      <div className="layout">
        <main className="main" role="main">
          {currentModule ? (
            <ModulePage moduleId={currentModule} onBack={handleCloseModal} />
          ) : (
            <Dashboard onModuleClick={handleModuleClick} />
          )}
        </main>
      </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });
  }, []);

  if (authLoading) {
    return (
      <div className="auth-loading" role="status">
        <span className="loading-mark" aria-hidden="true" />
        <span>Opening your workspace...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AppProvider>
      <AppContent user={user} />
    </AppProvider>
  );
}

