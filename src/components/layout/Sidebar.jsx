import React from 'react';
import { MODULES } from '../../utils/dataManagers';

export function Sidebar({ onModuleClick }) {
  return (
    <nav className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-section">
        <div className="sidebar-title">Workspace modules</div>
        <div className="module-list" id="sidebarModuleList">
          {MODULES.map(module => (
            <button
              key={module.id}
              className="sidebar-link"
              data-module={module.id}
              title={module.description}
              onClick={() => onModuleClick(module.id)}
            >
              {module.icon} {module.name}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-title">Utilities</div>
        <div className="sidebar-actions">
          <button className="sidebar-link" type="button">
            📊 Recent activity
          </button>
          <button className="sidebar-link" type="button">
            ⚙️ Settings
          </button>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-row">
          <span className="pill">Local-first</span>
          <span className="muted">All data stored in your browser.</span>
        </div>
      </div>
    </nav>
  );
}
