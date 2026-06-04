import React from 'react';
import { CredentialsModule } from './modules/CredentialsModule';
import { CommunicationsModule } from './modules/CommunicationsModule';
import { ProjectsModule } from './modules/ProjectsModule';
import { DocumentsModule } from './modules/DocumentsModule';
import { SocialMediaModule } from './modules/SocialMediaModule';
import { MeetingsModule } from './modules/MeetingsModule';
import { TravelModule } from './modules/TravelModule';
import { MODULES } from '../utils/dataManagers';

const ModuleComponents = {
  credentials: CredentialsModule,
  communications: CommunicationsModule,
  projects: ProjectsModule,
  documents: DocumentsModule,
  socialmedia: SocialMediaModule,
  meetings: MeetingsModule,
  travel: TravelModule
};

export function ModuleModal({ moduleId, onClose }) {
  const module = MODULES.find(m => m.id === moduleId);
  const ModuleComponent = ModuleComponents[moduleId];

  if (!module || !ModuleComponent) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{module.icon} {module.name}</h2>
          <button
            className="icon-btn"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <ModuleComponent onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
