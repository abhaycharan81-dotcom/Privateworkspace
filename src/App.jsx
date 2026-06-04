import React, { useState } from 'react';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { Hero } from './components/layout/Hero';
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
        <Sidebar onModuleClick={handleModuleClick} />

        <main className="main" role="main">
          <Hero onModuleClick={handleModuleClick} />
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
