import React, { useState, useEffect } from 'react';
import { DataManagers, MODULES } from '../../utils/dataManagers';

export function SearchResults({ query, onModuleClick, onClose }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!query || query.trim().length === 0) {
        setResults([]);
        return;
      }

      const searchQuery = query.toLowerCase();
      const allResults = [];

      const safePush = (moduleId, type, maybeArr) => {
        if (Array.isArray(maybeArr)) {
          maybeArr.forEach(item => {
            allResults.push({ ...item, moduleId, type });
          });
        }
      };

      try {
        const [credentials, communications, projects, documents, socialmedia, meetings, travel] = await Promise.all([
          DataManagers.credentials.search(searchQuery),
          DataManagers.communications.search(searchQuery),
          DataManagers.projects.search(searchQuery),
          DataManagers.documents.search(searchQuery),
          DataManagers.socialmedia.search(searchQuery),
          DataManagers.meetings.search(searchQuery),
          DataManagers.travel.search(searchQuery)
        ]);

        safePush('credentials', 'Credential', credentials);
        safePush('communications', 'Communication', communications);
        safePush('projects', 'Project', projects);
        safePush('documents', 'Document', documents);
        safePush('socialmedia', 'Social Post', socialmedia);
        safePush('meetings', 'Meeting', meetings);
        safePush('travel', 'Travel', travel);
      } catch (e) {
        if (!cancelled) setResults([]);
        return;
      }

      if (!cancelled) setResults(allResults);
    };

    run();

    return () => {
      cancelled = true;
    };
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
