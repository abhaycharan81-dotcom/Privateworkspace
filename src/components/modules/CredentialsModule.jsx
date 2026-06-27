import React, { useState, useCallback, useEffect } from 'react';
import { DataManagers } from '../../utils/dataManagers';
import { useAppState } from '../../context/AppContext';
import { DetailModal } from '../DetailModal';
import { EditDetailModal } from '../EditDetailModal';

export function CredentialsModule() {
  const [credentials, setCredentials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    platform: '',
    username: '',
    email: '',
    password: '',
    notes: '',
    tags: ''
  });
  const { addNotification, logActivity } = useAppState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editing, setEditing] = useState(false);



  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const data = await DataManagers.credentials.getAll();
        setCredentials(data);
      } catch (error) {
        console.error('Error loading credentials:', error);
      }
    };
    loadCredentials();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t);

    const created = await DataManagers.credentials.add({
      ...formData,
      tags: tagsArray
    });

    const updated = await DataManagers.credentials.getAll();
    setCredentials(updated);

    // Auto-open details for the newly created credential.
    if (created && created.id != null) {
      const full = updated.find(x => x && x.id === created.id) || created;
      setSelectedItem(full);
    }

    setFormData({
      platform: '',
      username: '',
      email: '',
      password: '',
      notes: '',
      tags: ''
    });
    setShowForm(false);
    addNotification('success', 'Credential Added', `${formData.platform} credential saved`);
    logActivity('credentials', 'create', `Added credential: ${formData.platform}`);
  }, [formData, addNotification, logActivity]);

  const handleDelete = useCallback(async (id, platform) => {
    if (window.confirm('Delete this credential?')) {
      await DataManagers.credentials.delete(id);
      const updated = await DataManagers.credentials.getAll();
      setCredentials(updated);
      addNotification('success', 'Credential Deleted', 'Removed from vault');
      logActivity('credentials', 'delete', `Deleted credential: ${platform}`);
    }
  }, [addNotification, logActivity]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button 
          className="btn" 
          onClick={() => setShowForm(true)}
        >
          ➕ Add New Credential
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '0.75rem'
        }}>
          <div className="form-group">
            <label className="form-label">Platform</label>
            <input
              className="form-input"
              name="platform"
              placeholder="e.g., GitHub, AWS, Slack"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              name="notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              className="form-input"
              name="tags"
              placeholder="work, important, 2fa"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" type="submit">Save Credential</button>
            <button
              className="btn secondary"
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Platform</th>
            <th>Username</th>
            <th>Email</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {credentials.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                <span className="muted">No credentials saved</span>
              </td>
            </tr>
          ) : (
            credentials.map(cred => (
              <tr
                key={cred.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedItem(cred)}
                title="Open details"
              >
                <td>{cred.platform}</td>
                <td>{cred.username}</td>
                <td>{cred.email || '—'}</td>
                <td>{cred.tags?.join(', ') || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      className="btn small"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(cred);
                        setEditing(true);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn small danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cred.id, cred.platform);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedItem && !editing && (
        <DetailModal
          title={`Credential • ${selectedItem.platform || ''}`}
          item={selectedItem}
          onClose={() => {
            setSelectedItem(null);
            setEditing(false);
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
            <button
              className="btn small"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
            >
              ✏️ Edit
            </button>
          </div>
        </DetailModal>
      )}

      {selectedItem && editing && (
        <EditDetailModal
          moduleId="credentials"
          title={`Edit Credential • ${selectedItem.platform || ''}`}
          item={selectedItem}
          onClose={() => {
            setEditing(false);
          }}
          onSave={async (updated) => {
            await DataManagers.credentials.update(selectedItem.id, updated);
            const refreshed = await DataManagers.credentials.getAll();
            setCredentials(refreshed);
            const full = refreshed.find((x) => x && x.id === selectedItem.id);
            setSelectedItem(full || updated);
            setEditing(false);
            addNotification('success', 'Credential Updated', 'Changes saved');
            logActivity('credentials', 'update', `Updated credential: ${updated.platform || selectedItem.platform}`);
          }}
        />
      )}

    </div>
  );
}

