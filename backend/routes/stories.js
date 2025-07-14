const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage for development (replace with database in production)
let stories = [];

// GET /api/stories - Get all stories
router.get('/', (req, res) => {
  try {
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// GET /api/stories/:id - Get specific story
router.get('/:id', (req, res) => {
  try {
    const story = stories.find(s => s.id === req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// POST /api/stories - Create new story
router.post('/', (req, res) => {
  try {
    const { title, pages, author } = req.body;
    
    if (!title || !pages || !Array.isArray(pages)) {
      return res.status(400).json({ error: 'Title and pages are required' });
    }

    const newStory = {
      id: uuidv4(),
      title,
      author: author || 'Young Author',
      pages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    stories.push(newStory);
    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// PUT /api/stories/:id - Update story
router.put('/:id', (req, res) => {
  try {
    const storyIndex = stories.findIndex(s => s.id === req.params.id);
    if (storyIndex === -1) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const { title, pages, author } = req.body;
    
    stories[storyIndex] = {
      ...stories[storyIndex],
      title: title || stories[storyIndex].title,
      author: author || stories[storyIndex].author,
      pages: pages || stories[storyIndex].pages,
      updatedAt: new Date().toISOString()
    };

    res.json(stories[storyIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update story' });
  }
});

// DELETE /api/stories/:id - Delete story
router.delete('/:id', (req, res) => {
  try {
    const storyIndex = stories.findIndex(s => s.id === req.params.id);
    if (storyIndex === -1) {
      return res.status(404).json({ error: 'Story not found' });
    }

    stories.splice(storyIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

module.exports = router; 