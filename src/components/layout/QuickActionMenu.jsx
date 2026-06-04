import React from 'react';
import { MODULES } from '../../utils/dataManagers';

export function QuickActionMenu({ isOpen, onClose, onModuleClick }) {
  if (!isOpen) return null;

  const handleActionClick = (moduleId) => {
    onModuleClick(moduleId);
    onClose();
  };

  const quickActions = MODULES.slice(0, 4); // Show first 4 modules as quick actions

  return (
    <div className="quick-action-menu" role="menu" aria-label="Quick actions">
      <div className="menu-header">
        <div className="menu-title">Quick Actions</div>
        <button
          className="close-btn"
          type="button"
          onClick={onClose}
          aria-label="Close quick actions"
        >
          ✕
        </button>
      </div>

      <div className="menu-items">
        {quickActions.map(module => (
          <button
            key={module.id}
            className="menu-item quick-action"
            type="button"
            onClick={() => handleActionClick(module.id)}
            role="menuitem"
          >
            <span className="action-icon">{module.icon}</span>
            <span className="action-label">{module.name}</span>
          </button>
        ))}
      </div>

      <div className="menu-divider"></div>

      <div className="menu-title small">Other Actions</div>
      <button
        className="menu-item"
        type="button"
        onClick={() => handleActionClick(MODULES[4]?.id)}
        role="menuitem"
      >
        <span className="action-icon">{MODULES[4]?.icon}</span>
        <span className="action-label">{MODULES[4]?.name}</span>
      </button>
      <button
        className="menu-item"
        type="button"
        onClick={() => handleActionClick(MODULES[5]?.id)}
        role="menuitem"
      >
        <span className="action-icon">{MODULES[5]?.icon}</span>
        <span className="action-label">{MODULES[5]?.name}</span>
      </button>
      <button
        className="menu-item"
        type="button"
        onClick={() => handleActionClick(MODULES[6]?.id)}
        role="menuitem"
      >
        <span className="action-icon">{MODULES[6]?.icon}</span>
        <span className="action-label">{MODULES[6]?.name}</span>
      </button>
    </div>
  );
}
