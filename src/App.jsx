import React, { useState } from 'react';
import { Topbar } from './components/layout/Topbar';

import { Dashboard } from './components/layout/Dashboard';

import { ModuleModal } from './components/ModuleModal';
import { AppProvider } from './context/AppContext';
import './App.css';

function AppContent() {
  const [currentModule, setCurrentModule] = useState(null);

  const handleModuleClick = (moduleId) => {
    setCurrentModule(moduleId);
  };

  const handleCloseModal = () => {
    setCurrentModule(null);
  };

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
