export function normalizeProjectSteps(steps) {
  if (!Array.isArray(steps)) return [];

  return steps
    .map((s, idx) => {
      const title = (s && typeof s.title === 'string' ? s.title : '').trim();
      const status = s && (s.status === 'complete' || s.status === 'in_progress') ? s.status : 'in_progress';
      const orderNum = Number.isFinite(Number(s && s.order)) ? Number(s.order) : idx;

      return {
        id: s && (typeof s.id === 'number' || typeof s.id === 'string') ? String(s.id) : String(Date.now() + idx),
        title: title || `Step ${orderNum + 1}`,
        order: orderNum,
        status
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function computeProjectCycleProgress(stepsInput) {
  const steps = normalizeProjectSteps(stepsInput);
  const total = steps.length;
  const completeCount = steps.reduce((acc, s) => acc + (s.status === 'complete' ? 1 : 0), 0);
  const percentCompleted = total === 0 ? 0 : Math.round((completeCount / total) * 100);
  const percentRemaining = 100 - percentCompleted;

  // Current position in cycle:
  // - If total=0 => 0
  // - If all complete => total
  // - Else => first incomplete step index + 1
  let currentStepPosition = 0;
  if (total > 0) {
    const firstIncompleteIdx = steps.findIndex((s) => s.status !== 'complete');
    currentStepPosition = firstIncompleteIdx === -1 ? total : firstIncompleteIdx + 1;
  }

  return {
    steps,
    total,
    completeCount,
    percentCompleted,
    percentRemaining,
    currentStepPosition
  };
}

export function createStepsFromTitles(titles) {
  const list = Array.isArray(titles) ? titles : [];
  const clean = list
    .map((t) => (typeof t === 'string' ? t.trim() : ''))
    .filter(Boolean);

  return clean.map((title, idx) => ({
    id: String(Date.now() + idx),
    title,
    order: idx,
    status: 'in_progress'
  }));
}

