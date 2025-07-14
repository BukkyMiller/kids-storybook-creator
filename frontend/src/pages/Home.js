import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="bounce">Create Magical Stories!</h1>
        <p>
          Welcome to the amazing world of storytelling! Create your own storybooks 
          with your imagination and let AI bring them to life with beautiful pictures.
        </p>
        <Link to="/create" className="btn btn-primary">
          ✨ Start Creating!
        </Link>
      </section>

      <section className="features">
        <div className="feature-card fade-in">
          <div className="feature-icon">📝</div>
          <h3>Write Your Story</h3>
          <p>Use your imagination to write amazing stories. Add as many pages as you want!</p>
        </div>
        
        <div className="feature-card fade-in">
          <div className="feature-icon">🎨</div>
          <h3>AI Creates Pictures</h3>
          <p>Watch as AI creates beautiful illustrations for each page of your story!</p>
        </div>
        
        <div className="feature-card fade-in">
          <div className="feature-icon">📖</div>
          <h3>Read & Share</h3>
          <p>Read your finished storybook and share it with family and friends!</p>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to begin your adventure?</h2>
        <Link to="/create" className="btn btn-secondary">
          🚀 Create Your First Story
        </Link>
      </section>
    </div>
  );
};

export default Home; 