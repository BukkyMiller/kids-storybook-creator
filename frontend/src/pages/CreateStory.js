import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateStory = () => {
  const navigate = useNavigate();
  const [story, setStory] = useState({
    title: '',
    author: '',
    scenes: []
  });
  const [currentScene, setCurrentScene] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(null);
  const [showStoryForm, setShowStoryForm] = useState(true);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new scenes are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [story.scenes]);

  const handleStoryChange = (field, value) => {
    setStory(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startWriting = () => {
    if (!story.title.trim()) {
      alert('Please give your story a title first!');
      return;
    }
    setShowStoryForm(false);
    // Focus on input after a short delay
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const addScene = () => {
    if (!currentScene.trim()) return;

    const newScene = {
      id: Date.now(),
      text: currentScene.trim(),
      imageUrl: '',
      timestamp: new Date().toISOString()
    };

    setStory(prev => ({
      ...prev,
      scenes: [...prev.scenes, newScene]
    }));
    setCurrentScene('');
    
    // Focus back on input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addScene();
    }
  };

  const generateImage = async (sceneId) => {
    const scene = story.scenes.find(s => s.id === sceneId);
    if (!scene.text.trim()) return;

    setGeneratingImage(sceneId);
    try {
      const response = await axios.post('/api/images/generate', {
        prompt: scene.text
      });
      
      setStory(prev => ({
        ...prev,
        scenes: prev.scenes.map(scene => 
          scene.id === sceneId ? { ...scene, imageUrl: response.data.imageUrl } : scene
        )
      }));
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again!');
    } finally {
      setGeneratingImage(null);
    }
  };

  const removeScene = (sceneId) => {
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.filter(scene => scene.id !== sceneId)
    }));
  };

  const saveStory = async () => {
    if (!story.title.trim()) {
      alert('Please give your story a title!');
      return;
    }

    if (story.scenes.length === 0) {
      alert('Please add at least one scene to your story!');
      return;
    }

    // Convert scenes to pages format for backend compatibility
    const storyToSave = {
      ...story,
      pages: story.scenes.map((scene, index) => ({
        id: index + 1,
        text: scene.text,
        imageUrl: scene.imageUrl
      }))
    };

    setLoading(true);
    try {
      const response = await axios.post('/api/stories', storyToSave);
      alert('Story saved successfully!');
      navigate(`/story/${response.data.id}`);
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Failed to save story. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const editStory = () => {
    setShowStoryForm(true);
  };

  if (showStoryForm) {
    return (
      <div className="create-story">
        <div className="story-setup">
          <h2>🌟 Let's Create Your Story!</h2>
          <div className="story-form">
            <div className="form-group">
              <label htmlFor="title">📖 What's your story called?</label>
              <input
                type="text"
                id="title"
                value={story.title}
                onChange={(e) => handleStoryChange('title', e.target.value)}
                placeholder="Enter your amazing story title..."
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">✍️ Who's the author?</label>
              <input
                type="text"
                id="author"
                value={story.author}
                onChange={(e) => handleStoryChange('author', e.target.value)}
                placeholder="Your name..."
              />
            </div>

            <button onClick={startWriting} className="btn btn-primary">
              🚀 Start Writing My Story!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-story chat-interface">
      <div className="story-header">
        <div className="story-info">
          <h2>📚 {story.title}</h2>
          <p>by {story.author || 'Young Author'}</p>
        </div>
        <div className="header-actions">
          <button onClick={editStory} className="btn btn-secondary">
            ✏️ Edit Title
          </button>
          <button 
            onClick={saveStory}
            disabled={loading || story.scenes.length === 0}
            className="btn btn-primary"
          >
            {loading ? '💾 Saving...' : '💾 Save Story'}
          </button>
        </div>
      </div>

      <div className="chat-container" ref={chatContainerRef}>
        <div className="chat-messages">
          {story.scenes.length === 0 && (
            <div className="welcome-message">
              <div className="ai-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <p>Hi there! I'm your story buddy! 🌟</p>
                  <p>Tell me what happens in your story, scene by scene. I'll help you bring it to life with pictures!</p>
                  <p>Just type what happens first and press Enter...</p>
                </div>
              </div>
            </div>
          )}

          {story.scenes.map((scene, index) => (
            <div key={scene.id} className="scene-message">
              <div className="user-message">
                <div className="message-content">
                  <div className="scene-header">
                    <span className="scene-number">Scene {index + 1}</span>
                    <div className="scene-actions">
                      <button 
                        onClick={() => generateImage(scene.id)}
                        disabled={generatingImage === scene.id}
                        className="btn btn-small btn-secondary"
                      >
                        {generatingImage === scene.id ? '🎨 Creating...' : '🎨 Make Picture'}
                      </button>
                      <button 
                        onClick={() => removeScene(scene.id)}
                        className="btn btn-small btn-danger"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p>{scene.text}</p>
                </div>
                <div className="message-avatar">👤</div>
              </div>
              
              {scene.imageUrl && (
                <div className="ai-message">
                  <div className="message-avatar">🎨</div>
                  <div className="message-content">
                    <p>Here's what I imagined for this scene:</p>
                    <img 
                      src={scene.imageUrl} 
                      alt={`Scene ${index + 1} illustration`}
                      className="scene-image"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="chat-input-container">
        <div className="input-helper">
          <span>💭 What happens next in your story?</span>
        </div>
        <div className="chat-input">
          <textarea
            ref={inputRef}
            value={currentScene}
            onChange={(e) => setCurrentScene(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type what happens next... (Press Enter to add scene)"
            rows="3"
          />
          <button 
            onClick={addScene}
            disabled={!currentScene.trim()}
            className="btn btn-primary send-btn"
          >
            📤 Add Scene
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStory; 