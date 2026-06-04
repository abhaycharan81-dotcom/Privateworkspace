import React from 'react';
import { useAppState } from '../../context/AppContext';

export function NotificationsPanel({ isOpen, onClose }) {
  const { notifications, removeNotification } = useAppState();

  if (!isOpen) return null;

  return (
    <div className="notifications-panel" role="region" aria-label="Notifications">
      <div className="panel-header">
        <div className="panel-title">Notifications</div>
        <button
          className="close-btn"
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
        >
          ✕
        </button>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item notification-${notification.type}`}
            >
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
              </div>
              <button
                className="close-btn small"
                type="button"
                onClick={() => removeNotification(notification.id)}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
