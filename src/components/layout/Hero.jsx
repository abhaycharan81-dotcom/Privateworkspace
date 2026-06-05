import React, { useState, useEffect } from 'react';
import { DataManagers, MODULES } from '../../utils/dataManagers';
import { useAppState } from '../../context/AppContext';

export function Hero({ onModuleClick }) {
  const [stats, setStats] = useState({
    credentials: 0,
    projects: 0,
    documents: 0,
    meetings: 0
  });
  const [meetings, setMeetings] = useState([]);
  const [projects, setProjects] = useState([]);
  // Note: Recent activity removed.

  useEffect(() => {

    const loadData = async () => {
      try {
        const [credentialsData, projectsData, documentsData, meetingsData] = await Promise.all([
          DataManagers.credentials.getAll(),
          DataManagers.projects.getAll(),
          DataManagers.documents.getAll(),
          DataManagers.meetings.getAll()
        ]);

        setStats({
          credentials: credentialsData.length,
          projects: projectsData.length,
          documents: documentsData.length,
          meetings: meetingsData.length
        });

        setMeetings(meetingsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const upcomingMeetings = meetings.slice(0, 3);
  const pendingProjects = projects
    .filter(p => p.status !== 'completed')
    .slice(0, 3);

  return (
    <section className="hero" aria-label="Landing hero">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">{stats.credentials}</div>
              <div className="stat-label">Credentials</div>
            </div>
            <div className="stat">
              <div className="stat-value">{stats.projects}</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat">
              <div className="stat-value">{stats.documents}</div>
              <div className="stat-label">Documents</div>
            </div>
            <div className="stat">
              <div className="stat-value">{stats.meetings}</div>
              <div className="stat-label">Meetings</div>
            </div>
          </div>

          <div className="hero-secondary">
            <div className="card glass stat-card">
              <div className="card-title">Upcoming meetings</div>
              <div className="list compact">
                {upcomingMeetings.length === 0 ? (
                  <div className="list-item">
                    <span className="muted">No upcoming meetings</span>
                  </div>
                ) : (
                  upcomingMeetings.map(m => (
                    <div key={m.id} className="list-item">
                      <div className="list-item-label">{m.title}</div>
                      <div className="list-item-meta">
                        {new Date(m.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="card-foot">
                <button
                  className="link-btn"
                  type="button"
                  onClick={() => onModuleClick('meetings')}
                >
                  View all
                </button>
              </div>
            </div>
            <div className="card glass stat-card">
              <div className="card-title">Pending tasks</div>
              <div className="list compact">
                {pendingProjects.length === 0 ? (
                  <div className="list-item">
                    <span className="muted">No pending tasks</span>
                  </div>
                ) : (
                  pendingProjects.map(p => (
                    <div key={p.id} className="list-item">
                      <div className="list-item-label">{p.name}</div>
                      <div className="list-item-meta">{p.status}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="card-foot">
                <button
                  className="link-btn"
                  type="button"
                  onClick={() => onModuleClick('projects')}
                >
                  Go to Projects
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          {/* Recent activity removed */}
        </div>

      </div>
    </section>
  );
}
