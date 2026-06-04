import React, { useState, useCallback, useEffect } from 'react';
import { DataManagers } from '../../utils/dataManagers';
import { useAppState } from '../../context/AppContext';

export function TravelModule() {
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    notes: ''
  });
  const { addNotification, logActivity } = useAppState();

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await DataManagers.travel.getAll();
        setTrips(data);
      } catch (error) {
        console.error('Error loading trips:', error);
      }
    };
    loadTrips();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    await DataManagers.travel.add({
      ...formData,
      budget: parseFloat(formData.budget)
    });
    const updated = await DataManagers.travel.getAll();
    setTrips(updated);
    setFormData({
      destination: '',
      startDate: '',
      endDate: '',
      budget: '',
      notes: ''
    });
    setShowForm(false);
    addNotification('success', 'Trip Added', `${formData.destination} added to planner`);
    logActivity('travel', 'create', `Planned trip to ${formData.destination}`);
  }, [formData, addNotification, logActivity]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Delete this trip?')) {
      await DataManagers.travel.delete(id);
      const updated = await DataManagers.travel.getAll();
      setTrips(updated);
      addNotification('success', 'Trip Deleted', 'Removed');
      logActivity('travel', 'delete', 'Deleted trip');
    }
  }, [addNotification, logActivity]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn" onClick={() => setShowForm(true)}>
          ➕ Plan Trip
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
            <label className="form-label">Destination</label>
            <input
              className="form-input"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              className="form-input"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              className="form-input"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Budget ($)</label>
            <input
              className="form-input"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
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
            <button className="btn" type="submit">Plan Trip</button>
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
        {trips.length === 0 ? (
          <div className="muted" style={{ textAlign: 'center', padding: '2rem' }}>
            No trips planned
          </div>
        ) : (
          trips.map(trip => (
            <div key={trip.id} className="card glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div className="card-title">{trip.destination}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="btn small danger"
                  onClick={() => handleDelete(trip.id)}
                >
                  Delete
                </button>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                <strong>Budget:</strong> ${trip.budget}<br />
                <strong>Notes:</strong> {trip.notes}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
