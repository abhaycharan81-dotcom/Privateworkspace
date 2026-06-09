import React from 'react';
import { toDisplayValue, pickDisplayTitle } from '../utils/formatters';

function renderValue(value) {
  // Keep rendering simple but robust.
  // For arrays/objects we show pretty text.
  const text = toDisplayValue(value);
  return (
    <pre
      style={{
        margin: 0,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontFamily: 'inherit',
        fontSize: '0.95rem'
      }}
    >
      {text}
    </pre>
  );
}

export function DetailModal({ title, item, onClose }) {
  if (!item) return null;

  const safeTitle = title || pickDisplayTitle(item, 'Details');

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
          >
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gap: '0.75rem'
            }}
          >
            {Object.keys(item).map((key) => (
              <div key={key} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', padding: '0.75rem' }}>
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
                {renderValue(item[key])}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

