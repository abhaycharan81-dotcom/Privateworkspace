import React from 'react';
import { MODULES } from '../../utils/dataManagers';

const ModuleComponents = {
  credentials: React.lazy(() => import('../modules/CredentialsModule').then(m => ({ default: m.CredentialsModule }))),
  communications: React.lazy(() => import('../modules/CommunicationsModule').then(m => ({ default: m.CommunicationsModule }))),
  projects: React.lazy(() => import('../modules/ProjectsModule').then(m => ({ default: m.ProjectsModule }))),
  documents: React.lazy(() => import('../modules/DocumentsModule').then(m => ({ default: m.DocumentsModule }))),
  socialmedia: React.lazy(() => import('../modules/SocialMediaModule').then(m => ({ default: m.SocialMediaModule }))),
  meetings: React.lazy(() => import('../modules/MeetingsModule').then(m => ({ default: m.MeetingsModule }))),
  travel: React.lazy(() => import('../modules/TravelModule').then(m => ({ default: m.TravelModule })))
};

export function ModulePage({ moduleId, onBack }) {
  const module = MODULES.find(m => m.id === moduleId);
  const ModuleComponent = ModuleComponents[moduleId];

  if (!module || !ModuleComponent) return null;

  return (
    <section className="module-page" aria-label={`${module.name} page`}>
      <div className="module-page-header">
        <button className="btn secondary" type="button" onClick={onBack}>
          ← Back
        </button>
        <div className="module-page-title">
          <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>{module.icon}</span>
          <h2>{module.name}</h2>
          <p>{module.description}</p>
        </div>
      </div>

      <React.Suspense fallback={<div className="text-small">Loading…</div>}>
        <ModuleComponent />
      </React.Suspense>
    </section>
  );
}

