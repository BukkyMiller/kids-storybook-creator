import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get('/api/stories');
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setError('Failed to load stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await axios.delete(`/api/stories/${id}`);
        setStories(stories.filter(story => story.id !== id));
      } catch (error) {
        console.error('Error deleting story:', error);
        alert('Failed to delete story. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="my-stories">
        <div className="loading-spinner"></div>
        <p style={{ textAlign: 'center', color: '#fff' }}>Loading your stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-stories">
        <div className="card">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchStories} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-stories">
      <div className="page-header">
        <h2>My Stories</h2>
        <Link to="/create" className="btn btn-primary">
          ➕ Create New Story
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="empty-state">
          <div className="card">
            <div className="empty-icon">📚</div>
            <h3>No stories yet!</h3>
            <p>Start creating your first magical story with AI-generated illustrations.</p>
            <Link to="/create" className="btn btn-primary">
              ✨ Create Your First Story
            </Link>
          </div>
        </div>
      ) : (
        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="story-card fade-in">
              <div className="story-preview">
                {story.pages[0]?.imageUrl ? (
                  <img 
                    src={story.pages[0].imageUrl} 
                    alt={`${story.title} preview`}
                    className="story-preview-image"
                  />
                ) : (
                  <div className="no-preview">
                    <div className="no-preview-icon">📖</div>
                    <span>No image</span>
                  </div>
                )}
              </div>
              
              <div className="story-info">
                <h3>{story.title}</h3>
                <p className="story-author">By {story.author}</p>
                <p className="story-meta">
                  {story.pages.length} pages • Created {formatDate(story.createdAt)}
                </p>
                
                <div className="story-actions">
                  <Link 
                    to={`/story/${story.id}`} 
                    className="btn btn-primary"
                  >
                    📖 Read
                  </Link>
                  <Link 
                    to={`/create?edit=${story.id}`} 
                    className="btn btn-secondary"
                  >
                    ✏️ Edit
                  </Link>
                  <button 
                    onClick={() => deleteStory(story.id)}
                    className="btn btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyStories; 