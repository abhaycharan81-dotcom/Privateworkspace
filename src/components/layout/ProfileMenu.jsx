import React from 'react';

export function ProfileMenu({ isOpen, onClose, onSettings }) {

  if (!isOpen) return null;

  const handleLogout = () => {
    // Placeholder for logout functionality
    console.log('Logout clicked');
    onClose();
  };

  const handleSettings = () => {
    if (onSettings) onSettings();
    onClose();
  };



  const handleAbout = () => {
    console.log('About clicked');
    onClose();
  };

  return (
    <div className="profile-menu" role="menu" aria-label="Profile menu">
      <div className="menu-header">
        <div className="user-avatar">👤</div>
        <div className="user-info">
          <div className="user-name">User</div>
          <div className="user-status">Local mode</div>
        </div>
      </div>

      <div className="menu-divider"></div>

      <button
        className="menu-item"
        type="button"
        onClick={handleSettings}
        role="menuitem"
      >
        ⚙️ Settings
      </button>

      <button
        className="menu-item"
        type="button"
        onClick={handleAbout}
        role="menuitem"
      >
        ℹ️ About
      </button>

      <div className="menu-divider"></div>

      <button
        className="menu-item danger"
        type="button"
        onClick={handleLogout}
        role="menuitem"
      >
        🚪 Logout
      </button>

      <button
        className="close-btn menu-close"
        type="button"
        onClick={onClose}
        aria-label="Close menu"
      >
        ✕
      </button>
    </div>
  );
}
