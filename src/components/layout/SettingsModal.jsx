import React, { useMemo, useState } from 'react';
import { useAppState } from '../../context/AppContext';
import { Storage } from '../../utils/storage';

const DEFAULT_SETTINGS = {
  notificationsEnabled: true,
  globalSearchEnabled: true,
  modulePreferences: {
    credentials: true,
    communications: true,
    projects: true,
    documents: true,
    socialmedia: true,
    meetings: true,
    travel: true
  }
};

export function SettingsModal({ isOpen, onClose }) {
  const {
    notificationsEnabled,
    setNotificationsEnabled,
    globalSearchEnabled,
    setGlobalSearchEnabled,
    modulePreferences,
    setModulePreferences,
    logActivity
  } = useAppState();

  const [draft, setDraft] = useState(() => {
    // Use context values as initial draft.
    return {
      notificationsEnabled: notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
      globalSearchEnabled: globalSearchEnabled ?? DEFAULT_SETTINGS.globalSearchEnabled,
      modulePreferences: modulePreferences ?? DEFAULT_SETTINGS.modulePreferences
    };
  });

  const dirty = useMemo(() => {
    return (
      (draft.notificationsEnabled !== (notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled)) ||
      (draft.globalSearchEnabled !== (globalSearchEnabled ?? DEFAULT_SETTINGS.globalSearchEnabled)) ||
      JSON.stringify(draft.modulePreferences) !== JSON.stringify(modulePreferences ?? DEFAULT_SETTINGS.modulePreferences)
    );
  }, [draft, notificationsEnabled, globalSearchEnabled, modulePreferences]);

  if (!isOpen) return null;

  const updatePref = (key, value) => {
    setDraft(prev => ({
      ...prev,
      modulePreferences: {
        ...(prev.modulePreferences || DEFAULT_SETTINGS.modulePreferences),
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Persist and apply.
    setNotificationsEnabled(draft.notificationsEnabled);
    setGlobalSearchEnabled(draft.globalSearchEnabled);
    setModulePreferences(draft.modulePreferences);

    Storage.set('settings', {
      notificationsEnabled: draft.notificationsEnabled,
      globalSearchEnabled: draft.globalSearchEnabled,
      modulePreferences: draft.modulePreferences
    });

    logActivity('settings', 'update', 'Updated settings');
    onClose();
  };

  const handleReset = () => {
    setDraft(DEFAULT_SETTINGS);
    Storage.set('settings', DEFAULT_SETTINGS);
    setNotificationsEnabled(DEFAULT_SETTINGS.notificationsEnabled);
    setGlobalSearchEnabled(DEFAULT_SETTINGS.globalSearchEnabled);
    setModulePreferences(DEFAULT_SETTINGS.modulePreferences);
    logActivity('settings', 'reset', 'Reset settings to defaults');
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <div className="modal">
        <div className="modal-header">
          <h2>⚙️ Settings</h2>
          <button className="icon-btn" type="button" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card glass" style={{ padding: '1rem' }}>
            <div className="card-title" style={{ marginBottom: '0.75rem' }}>
              Feature toggles
            </div>

            <label className="form-checkbox" style={{ marginBottom: '0.75rem' }}>
              <input
                type="checkbox"
                checked={!!draft.notificationsEnabled}
                onChange={(e) => setDraft(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
              />
              Enable notifications
            </label>

            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={!!draft.globalSearchEnabled}
                onChange={(e) => setDraft(prev => ({ ...prev, globalSearchEnabled: e.target.checked }))}
              />
              Enable global search
            </label>
          </div>

          <div className="card glass" style={{ padding: '1rem' }}>
            <div className="card-title" style={{ marginBottom: '0.75rem' }}>
              Module visibility
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
              {Object.keys(DEFAULT_SETTINGS.modulePreferences).map((moduleId) => {
                const label = {
                  credentials: 'Credential Management',
                  communications: 'Communication Hub',
                  projects: 'Project Tracking',
                  documents: 'Document Management',
                  socialmedia: 'Social Media Management',
                  meetings: 'Meeting Management',
                  travel: 'Travel Management'
                }[moduleId] || moduleId;

                return (
                  <label key={moduleId} className="form-checkbox" style={{ marginBottom: 0 }}>
                    <input
                      type="checkbox"
                      checked={draft.modulePreferences?.[moduleId] ?? true}
                      onChange={(e) => updatePref(moduleId, e.target.checked)}
                    />
                    {label}
                  </label>
                );
              })}
            </div>

            <p className="text-small" style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Disabled modules won’t appear in module navigation or quick actions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button className="btn secondary" type="button" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-primary" type="button" onClick={handleSave} disabled={!dirty}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

