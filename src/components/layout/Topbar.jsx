import { useState } from 'react';
import { useAppState } from '../../context/AppContext';
import { NotificationsPanel } from './NotificationsPanel';
import { SearchResults } from './SearchResults';
import { QuickActionMenu } from './QuickActionMenu';
import { ProfileMenu } from './ProfileMenu';

export function Topbar({ user, onModuleClick }) {
  const { notificationCount, workspaces, currentWorkspace, globalSearchEnabled, notificationsEnabled } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');


  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="topbar" role="banner">
      {/*<div className="brand">
        <div className="logo" aria-hidden="true">
          <span className="logo-dot"></span>
          <span className="logo-ring"></span>
        </div>
        <div className="brand-text">
          <div className="brand-name">Private Workspace</div>
          <div className="brand-sub">Premium Productivity Hub</div>
        </div>
      </div>*/}

      <div className="topbar-center">
        <div className="workspace-switcher" role="group" aria-label="Workspace switcher">
          <button className="chip ghost" type="button">
            <span className="chip-icon" aria-hidden="true">🏗️</span>
            <span>{workspaces[currentWorkspace]}</span>
            <span className="chip-caret" aria-hidden="true">▾</span>
          </button>
        </div>

        <div className="search" role="search">
          <label className="sr-only" htmlFor="globalSearch">Global search</label>
          <div className="searchbox">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              id="globalSearch"
              type="search"
              autoComplete="off"
              placeholder="Search credentials, projects, docs, meetings…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="icon-btn"
                type="button"
                aria-label="Clear search"
                title="Clear"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <button
          className="icon-btn"
          type="button"
          title="Quick actions"
          aria-label="Quick actions"
          onClick={() => setShowQuickMenu(!showQuickMenu)}
        >
          ⚡
        </button>
        <button
          className="icon-btn"
          type="button"
          title="Notifications"
          aria-label="Notifications"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔
          {notificationsEnabled && notificationCount > 0 && (
            <span className="badge" aria-hidden="true">{notificationCount}</span>
          )}
        </button>

        <div className="profile" role="group" aria-label="User profile">
          <button
            className="profile-btn"
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {user?.photoURL ? (
              <img className="avatar avatar-image" src={user.photoURL} alt="" />
            ) : (
              <span className="avatar" aria-hidden="true">{user?.displayName?.slice(0, 2).toUpperCase() || 'PW'}</span>
            )}
            <span className="profile-name">{user?.displayName || user?.email || 'Workspace user'}</span>
            <span className="chip-caret" aria-hidden="true">▾</span>
          </button>
        </div>
      </div>

      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      {globalSearchEnabled && (
        <SearchResults
          query={searchQuery}
          onModuleClick={onModuleClick}
          onClose={() => setSearchQuery('')}
        />
      )}

      <QuickActionMenu
        isOpen={showQuickMenu}
        onClose={() => setShowQuickMenu(false)}
        onModuleClick={onModuleClick}
      />
      <ProfileMenu
        user={user}
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        onSettings={() => {
          setShowProfileMenu(false);
          // Delegate Settings open to App via custom event.
          window.dispatchEvent(new CustomEvent('pw:openSettings'));
        }}
      />

    </header>
  );
}
