import React, { useState, useCallback, useEffect } from 'react';
import { DataManagers } from '../../utils/dataManagers';
import { useAppState } from '../../context/AppContext';
import { DetailModal } from '../DetailModal';

export function MeetingsModule() {
  const [meetings, setMeetings] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    participants: '',
    notes: ''
  });
  const { addNotification, logActivity } = useAppState();

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const data = await DataManagers.meetings.getAll();
        setMeetings(data);
      } catch (error) {
        console.error('Error loading meetings:', error);
      }
    };
    loadMeetings();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const participantsArray = formData.participants.split(',').map(p => p.trim());
    const created = await DataManagers.meetings.add({
      ...formData,
      participants: participantsArray
    });
    const updated = await DataManagers.meetings.getAll();
    setMeetings(updated);

    // Auto-open details for the newly created meeting.
    if (created && created.id != null) {
      const full = updated.find(x => x && x.id === created.id) || created;
      setSelectedItem(full);
    }

    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      participants: '',
      notes: ''
    });
    setShowForm(false);
    addNotification('success', 'Meeting Scheduled', `${formData.title} added`);
    logActivity('meetings', 'create', `Scheduled meeting: ${formData.title}`);
  }, [formData, addNotification, logActivity]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Delete this meeting?')) {
      await DataManagers.meetings.delete(id);
      const updated = await DataManagers.meetings.getAll();
      setMeetings(updated);
      addNotification('success', 'Meeting Deleted', 'Removed');
      logActivity('meetings', 'delete', 'Deleted meeting');
    }
  }, [addNotification, logActivity]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn" onClick={() => setShowForm(true)}>
          ➕ Schedule Meeting
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
            <label className="form-label">Meeting Title</label>
            <input
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
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
            <label className="form-label">Time</label>
            <input
              className="form-input"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Participants (comma separated)</label>
            <input
              className="form-input"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" type="submit">Schedule Meeting</button>
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
        {meetings.length === 0 ? (
          <div className="muted" style={{ textAlign: 'center', padding: '2rem' }}>
            No meetings
          </div>
        ) : (
          meetings.map(meeting => (
            <div
              key={meeting.id}
              className="card glass"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedItem(meeting)}
              title="Open details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div className="card-title">{meeting.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                  </div>
                </div>
                <button
                  className="btn small danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(meeting.id);
                  }}
                >
                  Delete
                </button>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                <strong>Participants:</strong> {meeting.participants.join(', ')}<br />
                <strong>Notes:</strong> {meeting.notes}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedItem && (
        <DetailModal
          title={`Meeting • ${selectedItem.title || ''}`}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

