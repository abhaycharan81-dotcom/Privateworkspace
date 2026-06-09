import React, { useState, useCallback, useEffect } from 'react';
import { DataManagers } from '../../utils/dataManagers';
import { useAppState } from '../../context/AppContext';
import { DetailModal } from '../DetailModal';

export function DocumentsModule() {
  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    tags: '',
    notes: ''
  });
  const { addNotification, logActivity } = useAppState();
  const [selectedItem, setSelectedItem] = useState(null);


  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await DataManagers.documents.getAll();
        setDocuments(data);
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    };
    loadDocuments();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    const created = await DataManagers.documents.add({
      ...formData,
      tags: tagsArray
    });
    const updated = await DataManagers.documents.getAll();
    setDocuments(updated);

    // Auto-open details for the newly created document.
    if (created && created.id != null) {
      const full = updated.find(x => x && x.id === created.id) || created;
      setSelectedItem(full);
    }

    setFormData({ name: '', type: '', tags: '', notes: '' });
    setShowForm(false);
    addNotification('success', 'Document Added', `${formData.name} uploaded`);
    logActivity('documents', 'create', `Added document: ${formData.name}`);
  }, [formData, addNotification, logActivity]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Delete this document?')) {
      await DataManagers.documents.delete(id);
      const updated = await DataManagers.documents.getAll();
      setDocuments(updated);
      addNotification('success', 'Document Deleted', 'Removed');
      logActivity('documents', 'delete', 'Deleted document');
    }
  }, [addNotification, logActivity]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn" onClick={() => setShowForm(true)}>
          ➕ Add Document
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
            <label className="form-label">Document Name</label>
            <input
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Document Type</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="">Select type</option>
              <option value="Contract">Contract</option>
              <option value="Proposal">Proposal</option>
              <option value="Report">Report</option>
              <option value="Invoice">Invoice</option>
              <option value="Legal">Legal Document</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              className="form-input"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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
            <button className="btn" type="submit">Add Document</button>
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
            <th>Name</th>
            <th>Type</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                <span className="muted">No documents</span>
              </td>
            </tr>
          ) : (
            documents.map(doc => (
              <tr
                key={doc.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedItem(doc)}
                title="Open details"
              >
                <td>{doc.name}</td>
                <td>{doc.type}</td>
                <td>{doc.tags?.join(', ') || '—'}</td>
                <td>
                  <button
                    className="btn small danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedItem && (
        <DetailModal
          title={`Document • ${selectedItem.name || ''}`}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

