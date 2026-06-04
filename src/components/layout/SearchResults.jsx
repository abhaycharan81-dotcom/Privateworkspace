import React, { useState, useMemo } from 'react';
import { DataManagers, MODULES } from '../../utils/dataManagers';

export function SearchResults({ query, onModuleClick, onClose }) {
  const results = useMemo(() => {
    if (!query || query.trim().length === 0) return [];

    const searchQuery = query.toLowerCase();
    const allResults = [];

    // Search across all modules
    DataManagers.credentials.search(searchQuery).forEach(item => {
      allResults.push({ ...item, moduleId: 'credentials', type: 'Credential' });
    });

    DataManagers.communications.search(searchQuery).forEach(item => {
      allResults.push({ ...item, moduleId: 'communications', type: 'Communication' });
    });

    DataManagers.projects.search(searchQuery).forEach(item => {
      allResults.push({ ...item, moduleId: 'projects', type: 'Project' });
    });

    DataManagers.documents.search(searchQuery).forEach(item => {
      allResults.push({ ...item, moduleId: 'documents', type: 'Document' });
    });

    DataManagers.socialmedia.search(searchQuery).forEach(item => {
      allResults.push({ ...item, moduleId: 'socialmedia', type: 'Social Post' });
    });

    DataManagers.meetings.search(searchQuery).forEach(item => {
      allResults.push({ ...item, moduleId: 'meetings', type: 'Meeting' });
    });

    DataManagers.travel.search(searchQuery).forEach(item => {
      allResults.push({ ...item, moduleId: 'travel', type: 'Travel' });
    });

    return allResults;
  }, [query]);

  const handleResultClick = (moduleId) => {
    onModuleClick(moduleId);
    onClose();
  };

  if (!query || query.trim().length === 0) {
    return null;
  }

  return (
    <div className="search-results" role="region" aria-label="Search results">
      <div className="results-header">
        <div className="results-title">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </div>
        <button
          className="close-btn"
          type="button"
          onClick={onClose}
          aria-label="Close search results"
        >
          ✕
        </button>
      </div>

      <div className="results-list">
        {results.length === 0 ? (
          <div className="empty-state">
            <p>No results found</p>
          </div>
        ) : (
          results.map(result => {
            const module = MODULES.find(m => m.id === result.moduleId);
            return (
              <div
                key={`${result.moduleId}-${result.id}`}
                className="result-item"
              >
                <div className="result-icon">{module?.icon}</div>
                <div className="result-content">
                  <div className="result-title">
                    {result.name || result.title || result.platform || 'Unnamed'}
                  </div>
                  <div className="result-meta">
                    {result.type} • {module?.name}
                  </div>
                </div>
                <button
                  className="result-action"
                  type="button"
                  onClick={() => handleResultClick(result.moduleId)}
                  aria-label={`Open ${module?.name}`}
                >
                  →
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
