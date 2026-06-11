import React, { useState, useCallback } from 'react';
import { DataManagers } from '../../utils/dataManagers';
import { useAppState } from '../../context/AppContext';
import { DetailModal } from '../DetailModal';

export function ProjectsModule() {
  const [projects, setProjects] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);


  React.useEffect(() => {
    let cancelled = false;
    DataManagers.projects.getAll().then((list) => {
      if (!cancelled) setProjects(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planned',
    deadline: ''
  });
  const { addNotification, logActivity } = useAppState();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const created = await DataManagers.projects.add(formData);
    const updated = await DataManagers.projects.getAll();
    setProjects(updated);

    // Auto-open details for the newly created project.
    if (created && created.id != null) {
      const full = updated.find(x => x && x.id === created.id) || created;
      setSelectedItem(full);
    }

    setFormData({ name: '', description: '', status: 'planned', deadline: '' });
    setShowForm(false);
    addNotification('success', 'Project Created', `${formData.name} added to tracker`);
    logActivity('projects', 'create', `Started project: ${formData.name}`);
  }, [formData, addNotification, logActivity]);


  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await DataManagers.projects.delete(id);
    const updated = await DataManagers.projects.getAll();
    setProjects(updated);
    addNotification('success', 'Project Deleted', 'Removed');
    logActivity('projects', 'delete', 'Deleted project');
  }, [addNotification, logActivity]);


  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn" onClick={() => setShowForm(true)}>
          ➕ Create Project
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
            <label className="form-label">Project Name</label>
            <input
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              className="form-input"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" type="submit">Create Project</button>
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

      <div style={{ display: 'grid', gap: '1rem' }}>
        {projects.length === 0 ? (
          <div className="muted" style={{ textAlign: 'center', padding: '2rem' }}>
            No projects yet
          </div>
        ) : (
          projects.map(project => (
            <div
              key={project.id}
              className="card glass"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedItem(project)}
              title="Open details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div className="card-title">{project.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    Status: <span style={{ color: 'var(--color-accent)' }}>{project.status}</span>
                  </div>
                </div>
                <button
                  className="btn small danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project.id);
                  }}
                >
                  Delete
                </button>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {project.description}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedItem && (
        <DetailModal
          title={`Project • ${selectedItem.name || ''}`}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

