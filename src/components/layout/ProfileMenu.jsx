import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

export function ProfileMenu({ isOpen, onClose, onSettings, user }) {

  if (!isOpen) return null;

  const handleLogout = () => {
    signOut(auth);
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
        {user?.photoURL ? <img className="user-avatar avatar-image" src={user.photoURL} alt="" /> : <div className="user-avatar">👤</div>}
        <div className="user-info">
          <div className="user-name">{user?.displayName || 'Workspace user'}</div>
          <div className="user-status">{user?.email || 'Signed in with Google'}</div>
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
