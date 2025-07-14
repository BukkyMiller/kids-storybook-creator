# Kids Storybook Creator 📚✨

An interactive storytelling application for kids where they can create personalized storybooks through their narratives, and AI generates beautiful visuals for each page.

## Features

- 🎨 **AI-Generated Visuals**: Create stunning images for each story page based on narrative text
- 📝 **Easy Story Creation**: Kid-friendly interface for writing and organizing story content
- 📖 **Interactive Story Reader**: Beautiful storybook viewer with generated images and text
- 💾 **Save & Manage Stories**: Store and organize created stories
- 📤 **Export & Share**: Export stories to PDF and share with family and friends
- 🎯 **Kid-Friendly Design**: Intuitive interface designed specifically for children

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key (for AI image generation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kids-storybook-creator
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
# Create .env file in backend directory
cd backend
touch .env
```

Add the following content to the `.env` file:
```
# Server Configuration
PORT=5000
NODE_ENV=development

# OpenAI Configuration
# IMPORTANT: Add your OpenAI API key here
OPENAI_API_KEY=your_openai_api_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Image Generation Settings
MAX_IMAGE_SIZE=1024
DEFAULT_IMAGE_STYLE=cartoon
IMAGE_QUALITY=standard
```

4. Start the development server:
```bash
npm run dev
```

This will start both the frontend (React) on `http://localhost:3000` and backend (Express) on `http://localhost:5000`.

## Project Structure

```
kids-storybook-creator/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # Styled components
│   └── package.json
├── backend/                  # Express backend API
│   ├── routes/              # API routes
│   ├── models/              # Database models
│   ├── middleware/          # Express middleware
│   ├── services/            # Business logic
│   └── package.json
└── README.md
```

## API Endpoints

- `POST /api/stories` - Create a new story
- `GET /api/stories` - Get all stories
- `GET /api/stories/:id` - Get specific story
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story
- `POST /api/generate-image` - Generate AI image for story page

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 