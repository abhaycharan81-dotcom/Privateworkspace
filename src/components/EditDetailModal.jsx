import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { pickDisplayTitle } from '../utils/formatters';


function safeParseJSON(text) {
  try {
    const trimmed = String(text ?? '').trim();
    if (!trimmed) return undefined;
    return JSON.parse(trimmed);
  } catch {
    return undefined;
  }
}

function stringifyForInput(value) {
  if (value === undefined) return '';
  if (value === null) return '';

  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  // Arrays/objects
  return JSON.stringify(value, null, 2);
}

function renderInputForValue({ key, value, editedValue, onChange }) {
  const isComplex = value !== null && typeof value === 'object';

  if (isComplex) {
    return (
      <div
        key={key}
        style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', padding: '0.75rem' }}
      >
        <div
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '0.35rem',
            textTransform: 'capitalize'
          }}
        >
          {key}
        </div>
        <textarea
          className="form-textarea"
          value={editedValue}
          onChange={(e) => onChange(key, e.target.value)}
          style={{ minHeight: '140px', fontFamily: 'monospace', fontSize: '0.9rem' }}
        />
        <div className="text-small" style={{ color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
          Stored as JSON. Edit and save.
        </div>
      </div>
    );
  }

  // Primitive: input or textarea depending on length
  const primitiveStr = editedValue ?? '';
  const useTextarea = primitiveStr.length > 120;

  return (
    <div
      key={key}
      style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', padding: '0.75rem' }}
    >
      <div
        style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '0.35rem',
          textTransform: 'capitalize'
        }}
      >
        {key}
      </div>
      {useTextarea ? (
        <textarea
          className="form-textarea"
          value={primitiveStr}
          onChange={(e) => onChange(key, e.target.value)}
        />
      ) : (
        <input className="form-input" value={primitiveStr} onChange={(e) => onChange(key, e.target.value)} />
      )}
    </div>
  );
}

export function EditDetailModal({
  title,
  moduleId,
  item,
  onClose,
  onSave
}) {
  const safeTitle = useMemo(() => {
    return title || pickDisplayTitle(item, `Edit ${moduleId}`);
  }, [title, item, moduleId]);

  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!item) return;

    const next = {};
    Object.keys(item)
      .filter((k) => k !== 'id')
      .forEach((k) => {
        next[k] = stringifyForInput(item[k]);
      });

    setDraft(next);
    setSaving(false);
  }, [item]);

  const handleChange = useCallback((key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!item) return;
    setSaving(true);

    const updated = { ...item };
    Object.keys(item)
      .filter((k) => k !== 'id')
      .forEach((k) => {
        const original = item[k];
        const inputText = draft[k];

        if (original !== null && typeof original === 'object') {
          // parse json
          const parsed = safeParseJSON(inputText);
          updated[k] = parsed !== undefined ? parsed : inputText;
          return;
        }

        if (typeof original === 'number') {
          const n = Number(inputText);
          updated[k] = Number.isNaN(n) ? inputText : n;
          return;
        }
        if (typeof original === 'boolean') {
          updated[k] = inputText === 'true' || inputText === true;
          return;
        }

        updated[k] = inputText;
      });

    try {
      await onSave?.(updated);
      onClose();
    } finally {
      setSaving(false);
    }
  }, [draft, item, onClose, onSave]);

  if (!item) return null;

  const keys = Object.keys(item).filter((k) => k !== 'id');

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label={safeTitle}>
        <div className="modal-header">
          <h2>{safeTitle}</h2>
          <button
            className="icon-btn"
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={saving}
          >
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="card glass" style={{ padding: '0.9rem' }}>
              <div className="card-title" style={{ marginBottom: '0.5rem' }}>
                Editing enabled
              </div>
              <div className="text-small" style={{ color: 'var(--color-text-secondary)' }}>
                Fields are editable. For arrays/objects, edit JSON.
              </div>
            </div>

            {keys.map((key) =>
              renderInputForValue({
                key,
                value: item[key],
                editedValue: draft[key],
                onChange: handleChange
              })
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn secondary" type="button" onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button className="btn" type="button" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

