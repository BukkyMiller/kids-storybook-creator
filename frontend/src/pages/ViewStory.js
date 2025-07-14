import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ViewStory = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`/api/stories/${id}`);
        setStory(response.data);
      } catch (error) {
        console.error('Error fetching story:', error);
        setError('Failed to load story. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <div className="story-viewer">
        <div className="loading-spinner"></div>
        <p style={{ textAlign: 'center', color: '#fff' }}>Loading your story...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="story-viewer">
        <div className="card">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <Link to="/stories" className="btn btn-primary">
            Back to My Stories
          </Link>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="story-viewer">
        <div className="card">
          <h2>Story not found</h2>
          <p>The story you're looking for doesn't exist.</p>
          <Link to="/stories" className="btn btn-primary">
            Back to My Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="story-viewer">
      <div className="story-header">
        <h1>{story.title}</h1>
        <p className="story-author">By {story.author}</p>
        <div className="story-actions">
          <Link to="/stories" className="btn btn-secondary">
            📚 Back to Stories
          </Link>
          <Link to={`/create?edit=${story.id}`} className="btn btn-primary">
            ✏️ Edit Story
          </Link>
        </div>
      </div>

      <div className="story-content">
        {story.pages.map((page, index) => (
          <div key={page.id} className="story-page fade-in">
            <div className="page-text">
              <h3>Page {index + 1}</h3>
              <p>{page.text}</p>
            </div>
            <div className="page-image">
              {page.imageUrl ? (
                <img 
                  src={page.imageUrl} 
                  alt={`Page ${index + 1} illustration`}
                  className="story-page-image"
                />
              ) : (
                <div className="no-image">
                  <div className="no-image-icon">🎨</div>
                  <p>No image generated for this page</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="story-footer">
        <div className="card">
          <h3>The End</h3>
          <p>Thank you for reading "{story.title}"!</p>
          <div className="story-actions">
            <Link to="/create" className="btn btn-primary">
              ✨ Create Another Story
            </Link>
            <Link to="/stories" className="btn btn-secondary">
              📚 View All Stories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStory; 