const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/images/generate - Generate image from text
router.post('/generate', async (req, res) => {
  try {
    const { prompt, style = 'cartoon', size = '1024x1024' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Enhance prompt for kid-friendly content
    const enhancedPrompt = `${prompt}, child-friendly, colorful, cartoon style, safe for kids, storybook illustration`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      size: size,
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    
    res.json({
      imageUrl,
      prompt: enhancedPrompt,
      originalPrompt: prompt
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    } else if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else if (error.code === 'content_policy_violation') {
      return res.status(400).json({ error: 'Content policy violation. Please try a different prompt.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate image',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/images/generate-batch - Generate multiple images for story pages
router.post('/generate-batch', async (req, res) => {
  try {
    const { pages } = req.body;
    
    if (!pages || !Array.isArray(pages)) {
      return res.status(400).json({ error: 'Pages array is required' });
    }

    const results = [];
    
    for (const page of pages) {
      if (page.text && !page.imageUrl) {
        try {
          const enhancedPrompt = `${page.text}, child-friendly, colorful, cartoon style, safe for kids, storybook illustration`;
          
          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: enhancedPrompt,
            size: "1024x1024",
            quality: "standard",
            n: 1,
          });

          results.push({
            pageId: page.id,
            imageUrl: response.data[0].url,
            prompt: enhancedPrompt,
            success: true
          });
        } catch (error) {
          results.push({
            pageId: page.id,
            error: error.message,
            success: false
          });
        }
        
        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    res.json({ results });

  } catch (error) {
    console.error('Batch image generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate batch images',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 