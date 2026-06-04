import React from 'react';
import { MODULES } from '../../utils/dataManagers';

export function Dashboard({ onModuleClick }) {
  return (
    <section className="dashboard" id="dashboard" aria-label="Workspace modules dashboard">
      <div className="dashboard-title">
        <h2>Workspace Modules</h2>
        <p>Click on any module to explore and manage your data</p>
      </div>
      <div className="module-grid">
        {MODULES.map(module => (
          <div
            key={module.id}
            className="module-card"
            data-module={module.id}
            onClick={() => onModuleClick(module.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="module-icon">{module.icon}</div>
            <div className="module-name">{module.name}</div>
            <div className="module-description">{module.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
