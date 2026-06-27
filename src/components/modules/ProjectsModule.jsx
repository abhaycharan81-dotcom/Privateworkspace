import React, { useEffect, useState, useCallback, useMemo } from 'react';

import { DataManagers } from '../../utils/dataManagers';
import { useAppState } from '../../context/AppContext';
import { DetailModal } from '../DetailModal';
import { EditDetailModal } from '../EditDetailModal';
import { formatProjectDeadlineLabel } from '../../utils/formatters';
import { computeProjectCycleProgress, createStepsFromTitles, normalizeProjectSteps } from '../../utils/projectCycle';
import { ProjectCycleStepsView } from './ProjectCycleStepsView';


function EditStepsPanel({ selectedItem, onCancel, onSave }) {

  const [stepsDraft, setStepsDraft] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const normalized = normalizeProjectSteps(selectedItem?.steps);
    setStepsDraft(normalized);
  }, [selectedItem]);

  const handleAddStep = () => {
    setStepsDraft((prev) => {
      const nextOrder = prev.length;
      return [
        ...prev,
        {
          id: String(Date.now() + Math.floor(Math.random() * 1000)),
          title: `Step ${nextOrder + 1}`,
          order: nextOrder,
          status: 'in_progress'
        }
      ];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(normalizeProjectSteps(stepsDraft));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <div className="card glass" style={{ padding: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div className="card-title" style={{ marginBottom: '0.2rem' }}>
              Project cycle steps
            </div>
            <div className="text-small" style={{ color: 'var(--color-text-secondary)' }}>
              Add/edit steps, set status, and reorder them.
            </div>
          </div>
          <button className="btn small" type="button" onClick={handleAddStep} disabled={saving}>
            ➕ Add Step
          </button>
        </div>

        {stepsDraft.length === 0 ? (
          <div className="muted" style={{ marginTop: '0.75rem' }}>
            No steps yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.6rem', marginTop: '0.75rem' }}>
            {stepsDraft.map((s, idx) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '0.65rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '0.65rem',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-accent)' }}>{idx + 1}</span>
                    <input
                      className="form-input"
                      value={s.title}
                      onChange={(e) => {
                        const v = e.target.value;
                        setStepsDraft((prev) => prev.map((x) => (x.id === s.id ? { ...x, title: v } : x)));
                      }}
                      style={{ width: '320px', maxWidth: '70vw' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {s.status === 'complete' ? 'Completed' : 'Remaining / In progress'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button
                    className={`btn small ${s.status === 'complete' ? 'secondary' : ''}`}
                    type="button"
                    onClick={() => setStepsDraft((prev) => prev.map((x) => (x.id === s.id ? { ...x, status: 'complete' } : x)))}
                  >
                    ✅ Complete
                  </button>
                  <button
                    className={`btn small ${s.status !== 'complete' ? 'secondary' : ''}`}
                    type="button"
                    onClick={() => setStepsDraft((prev) => prev.map((x) => (x.id === s.id ? { ...x, status: 'in_progress' } : x)))}
                  >
                    ⏳ In progress
                  </button>

                  <button
                    className="btn small"
                    type="button"
                    onClick={() => {
                      if (idx === 0) return;
                      setStepsDraft((prev) => {
                        const copy = [...prev];
                        const tmp = copy[idx - 1];
                        copy[idx - 1] = copy[idx];
                        copy[idx] = tmp;
                        return copy.map((x, i) => ({ ...x, order: i }));
                      });
                    }}
                    disabled={idx === 0}
                  >
                    ↑
                  </button>

                  <button
                    className="btn small"
                    type="button"
                    onClick={() => {
                      if (idx === stepsDraft.length - 1) return;
                      setStepsDraft((prev) => {
                        const copy = [...prev];
                        const tmp = copy[idx + 1];
                        copy[idx + 1] = copy[idx];
                        copy[idx] = tmp;
                        return copy.map((x, i) => ({ ...x, order: i }));
                      });
                    }}
                    disabled={idx === stepsDraft.length - 1}
                  >
                    ↓
                  </button>

                  <button
                    className="btn small danger"
                    type="button"
                    onClick={() =>
                      setStepsDraft((prev) => prev.filter((x) => x.id !== s.id).map((x, i) => ({ ...x, order: i })))
                    }
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.9rem' }}>
          <button className="btn secondary" type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="btn" type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Steps'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProjectsModule() {
  const [projects, setProjects] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editingSteps, setEditingSteps] = useState(false);
  const { addNotification, logActivity } = useAppState();

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
    deadline: '',
    stepsText: ''
  });

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const payload = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        deadline: formData.deadline,
        steps:
          (formData.stepsText || '').trim().length > 0
            ? createStepsFromTitles(formData.stepsText.split(/\r?\n/g))
            : []
      };

      const created = await DataManagers.projects.add(payload);
      const updated = await DataManagers.projects.getAll();
      setProjects(updated);

      if (created && created.id != null) {
        const full = updated.find((x) => x && x.id === created.id) || created;
        setSelectedItem(full);
      }

      setFormData({ name: '', description: '', status: 'planned', deadline: '', stepsText: '' });
      setShowForm(false);
      addNotification('success', 'Project Created', `${formData.name} added to tracker`);
      logActivity('projects', 'create', `Started project: ${formData.name}`);
    },
    [formData, addNotification, logActivity]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm('Delete this project?')) return;
      await DataManagers.projects.delete(id);
      const updated = await DataManagers.projects.getAll();
      setProjects(updated);
      addNotification('success', 'Project Deleted', 'Removed');
      logActivity('projects', 'delete', 'Deleted project');
    },
    [addNotification, logActivity]
  );

  const handleStepStatusChange = useCallback(
    async (stepId, nextStatus) => {
      if (!selectedItem) return;
      const current = computeProjectCycleProgress(selectedItem.steps);
      const updatedSteps = current.steps.map((s) => (s.id === stepId ? { ...s, status: nextStatus } : s));

      const nextProject = { ...selectedItem, steps: updatedSteps };
      setSelectedItem(nextProject);

      await DataManagers.projects.update(selectedItem.id, { steps: updatedSteps });
      addNotification('success', 'Step Updated', `${current.steps.find((s) => s.id === stepId)?.title || 'Step'} updated`);
      logActivity('projects', 'update-step', `Project: ${selectedItem.name} updated step status`);

      // keep list in sync
      const refreshed = await DataManagers.projects.getAll();
      setProjects(refreshed);
      const full = refreshed.find((x) => x && x.id === selectedItem.id);
      setSelectedItem(full || nextProject);
    },
    [selectedItem, addNotification, logActivity]
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn" onClick={() => setShowForm(true)}>
          ➕ Create Project
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '0.75rem'
          }}
        >
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

          <div className="form-group">
            <label className="form-label">Project cycle steps (optional)</label>
            <textarea
              className="form-textarea"
              value={formData.stepsText}
              onChange={(e) => setFormData({ ...formData, stepsText: e.target.value })}
              placeholder="One step per line, e.g.\nStep 1\nStep 2\nStep 3"
              style={{ minHeight: '100px', fontFamily: 'monospace' }}
            />
            <div className="text-small" style={{ color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
              If provided, steps will be created and can be marked complete/in progress.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" type="submit">
              Create Project
            </button>

            <button className="btn secondary" type="button" onClick={() => setShowForm(false)}>
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
          projects.map((project) => (
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
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                    Deadline: <span style={{ color: 'var(--color-accent)' }}>{formatProjectDeadlineLabel(project.deadline)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    className="btn small"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(project);
                      setEditing(true);
                      setEditingSteps(false);
                    }}
                  >
                    ✏️ Edit
                  </button>
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
              </div>

              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{project.description}</div>
            </div>
          ))
        )}
      </div>

      {selectedItem && !editing && (
        <DetailModal
          title={`Project • ${selectedItem.name || ''}`}
          item={selectedItem}
          onClose={() => {
            setSelectedItem(null);
            setEditing(false);
            setEditingSteps(false);
          }}
        >
          {(() => {
            const { steps, percentCompleted, percentRemaining, currentStepPosition, total } = computeProjectCycleProgress(selectedItem.steps);
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                  <div style={{ fontWeight: 600 }}>
                    {total > 0 ? `Step ${currentStepPosition} of ${total}` : 'No cycle steps yet'}
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>
                    Completed: <span style={{ color: 'var(--color-accent)' }}>{percentCompleted}%</span> • Remaining:{' '}
                    <span style={{ color: 'var(--color-accent)' }}>{percentRemaining}%</span>
                  </div>
                </div>

                <div
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    height: '12px',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div
                    style={{
                      width: `${percentCompleted}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(139,92,246,1) 0%, rgba(59,130,246,1) 100%)',
                      transition: 'width 180ms ease'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    className="btn small"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditing(true);
                      setEditingSteps(false);
                    }}
                  >
                    ✏️ Edit Project
                  </button>
                  <button
                    className="btn small secondary"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSteps(true);
                    }}
                  >
                    🧩 Edit Steps
                  </button>
                </div>

                {!editingSteps ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {steps.length === 0 ? (
                      <div className="muted" style={{ padding: '0.5rem 0.25rem' }}>
                        Add steps to track progress.
                      </div>
                    ) : (
                      <ProjectCycleStepsView
                        steps={steps}
                        currentStepPosition={currentStepPosition}
                        handleStepStatusChange={handleStepStatusChange}
                      />
                    )}
                  </div>
                ) : (


                  <EditStepsPanel
                    selectedItem={selectedItem}
                    onCancel={() => setEditingSteps(false)}
                    onSave={async (nextSteps) => {
                      const nextProject = { ...selectedItem, steps: nextSteps };
                      setSelectedItem(nextProject);
                      await DataManagers.projects.update(selectedItem.id, { steps: nextSteps });
                      const refreshed = await DataManagers.projects.getAll();
                      setProjects(refreshed);
                      const full = refreshed.find((x) => x && x.id === selectedItem.id);
                      setSelectedItem(full || nextProject);
                      setEditingSteps(false);
                      addNotification('success', 'Steps Saved', 'Project cycle steps updated');
                      logActivity('projects', 'update-steps', `Updated steps for project: ${selectedItem.name}`);
                    }}
                  />
                )}
              </div>
            );
          })()}
        </DetailModal>
      )}

      {selectedItem && editing && (
        <EditDetailModal
          moduleId="projects"
          title={`Edit Project • ${selectedItem.name || ''}`}
          item={selectedItem}
          onClose={() => {
            setEditing(false);
          }}
          onSave={async (updated) => {
            await DataManagers.projects.update(selectedItem.id, updated);
            const refreshed = await DataManagers.projects.getAll();
            setProjects(refreshed);
            const full = refreshed.find((x) => x && x.id === selectedItem.id);
            setSelectedItem(full || updated);
            setEditing(false);
            addNotification('success', 'Project Updated', 'Changes saved');
            logActivity('projects', 'update', `Updated project: ${updated.name || selectedItem.name}`);
          }}
        />
      )}
    </div>
  );
}

