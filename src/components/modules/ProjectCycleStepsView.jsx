import React, { useEffect, useState, useCallback } from 'react';

export function ProjectCycleStepsView({ steps, currentStepPosition, handleStepStatusChange }) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  useEffect(() => {
    setActiveStepIdx(Math.max(0, (currentStepPosition || 0) - 1));
  }, [currentStepPosition]);

  const safeSteps = Array.isArray(steps) ? steps : [];

  const activeStep = safeSteps[activeStepIdx];
  const isComplete = activeStep?.status === 'complete';

  const onSelectStep = useCallback((idx, e) => {
    e?.stopPropagation?.();
    setActiveStepIdx(idx);
  }, []);

  if (safeSteps.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div
        style={{
          display: 'flex',
          gap: '0.6rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        {safeSteps.map((s, idx) => {
          const stepComplete = s.status === 'complete';
          const isActive = idx === activeStepIdx;

          return (
            <button
              key={s.id}
              type="button"
              className="icon-btn"
              aria-label={`Step ${idx + 1}`}
              onClick={(e) => onSelectStep(idx, e)}
              title={s.title}
              style={{
                width: 44,
                height: 44,
                border: isActive ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
                background: isActive ? 'rgba(124, 58, 237, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                color: stepComplete ? 'var(--success)' : 'var(--text-light)'
              }}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div
        style={{
          borderRadius: '0.75rem',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)',
          padding: '0.85rem'
        }}
      >
        {activeStep ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-light)' }}>
              {activeStepIdx + 1}. {activeStep.title}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Status: {isComplete ? 'Complete' : 'In progress'}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button
                className={`btn small ${isComplete ? 'secondary' : ''}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStepStatusChange(activeStep.id, 'complete');
                }}
              >
                ✅ Complete
              </button>
              <button
                className={`btn small ${!isComplete ? 'secondary' : ''}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStepStatusChange(activeStep.id, 'in_progress');
                }}
              >
                ⏳ In progress
              </button>
            </div>
          </div>
        ) : (
          <div className="muted">Select a step to view details.</div>
        )}
      </div>
    </div>
  );
}

