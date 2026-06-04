import React, { useState, useCallback, useEffect } from 'react';
import { DataManagers } from '../../utils/dataManagers';
import { useAppState } from '../../context/AppContext';

const PLATFORMS = ['LinkedIn', 'X', 'Instagram', 'Facebook', 'YouTube'];

export function SocialMediaModule() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    platforms: [],
    status: 'draft'
  });
  const { addNotification, logActivity } = useAppState();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await DataManagers.socialmedia.getAll();
        setPosts(data);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };
    loadPosts();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    await DataManagers.socialmedia.add(formData);
    const updated = await DataManagers.socialmedia.getAll();
    setPosts(updated);
    setFormData({ content: '', platforms: [], status: 'draft' });
    setShowForm(false);
    addNotification('success', 'Post Created', 'Added to content calendar');
    logActivity('socialmedia', 'create', `Created post for ${formData.platforms.join(', ')}`);
  }, [formData, addNotification, logActivity]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Delete this post?')) {
      await DataManagers.socialmedia.delete(id);
      const updated = await DataManagers.socialmedia.getAll();
      setPosts(updated);
      addNotification('success', 'Post Deleted', 'Removed from calendar');
      logActivity('socialmedia', 'delete', 'Deleted post');
    }
  }, [addNotification, logActivity]);

  const togglePlatform = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn" onClick={() => setShowForm(true)}>
          ➕ Create Post
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '0.75rem'
        }}>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="form-textarea"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              style={{ minHeight: '150px' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Platforms</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PLATFORMS.map(platform => (
                <label key={platform} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform)}
                    onChange={() => togglePlatform(platform)}
                  />
                  {platform}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" type="submit">Create Post</button>
            <button
              className="btn secondary"
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.length === 0 ? (
          <div className="muted" style={{ textAlign: 'center', padding: '2rem' }}>
            No posts
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="card glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div className="card-title">Platforms: {post.platforms.join(', ')}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    Status: <span style={{ color: 'var(--color-accent)' }}>{post.status}</span>
                  </div>
                </div>
                <button
                  className="btn small danger"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.5'
              }}>
                {post.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
