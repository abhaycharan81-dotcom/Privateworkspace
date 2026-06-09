import React, { useEffect, useState } from 'react';
import { Topbar } from './components/layout/Topbar';

import { Dashboard } from './components/layout/Dashboard';

import { ModuleModal } from './components/ModuleModal';
import { AppProvider } from './context/AppContext';
import { SettingsModal } from './components/layout/SettingsModal';
import './App.css';

function AppContent() {
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
      <Topbar onModuleClick={handleModuleClick} />


      <div className="layout">
        <main className="main" role="main">
          <Dashboard onModuleClick={handleModuleClick} />
        </main>
      </div>


      {currentModule && (
        <ModuleModal
          moduleId={currentModule}
          onClose={handleCloseModal}
        />
      )}

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>

  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
