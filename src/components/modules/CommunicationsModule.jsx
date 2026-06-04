import React, { useState, useCallback, useEffect } from 'react';
import { DataManagers } from '../../utils/dataManagers';
import { useAppState } from '../../context/AppContext';

export function CommunicationsModule() {
  const [communications, setCommunications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contact: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const { addNotification, logActivity } = useAppState();

  useEffect(() => {
    const loadCommunications = async () => {
      try {
        const data = await DataManagers.communications.getAll();
        setCommunications(data);
      } catch (error) {
        console.error('Error loading communications:', error);
      }
    };
    loadCommunications();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    await DataManagers.communications.add(formData);
    const updated = await DataManagers.communications.getAll();
    setCommunications(updated);
    setFormData({
      contact: '',
      type: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowForm(false);
    addNotification('success', 'Communication Logged', 'Added conversation note');
    logActivity('communications', 'create', `Logged communication with ${formData.contact}`);
  }, [formData, addNotification, logActivity]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Delete this communication?')) {
      await DataManagers.communications.delete(id);
      const updated = await DataManagers.communications.getAll();
      setCommunications(updated);
      addNotification('success', 'Communication Deleted', 'Removed');
      logActivity('communications', 'delete', 'Deleted communication');
    }
  }, [addNotification, logActivity]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn" onClick={() => setShowForm(true)}>
          ➕ Log Communication
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
            <label className="form-label">Contact Name</label>
            <input
              className="form-input"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="">Select type</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="Meeting">Meeting</option>
              <option value="Message">Message</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" type="submit">Log Communication</button>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {communications.length === 0 ? (
          <div className="muted" style={{ textAlign: 'center', padding: '2rem' }}>
            No communications logged
          </div>
        ) : (
          communications.map(comm => (
            <div key={comm.id} className="card glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div className="card-title">{comm.contact}</div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.5rem'
                  }}>
                    {comm.type} • {new Date(comm.date).toLocaleDateString()}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)'
                  }}>
                    {comm.notes}
                  </div>
                </div>
                <button
                  className="btn small danger"
                  onClick={() => handleDelete(comm.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
