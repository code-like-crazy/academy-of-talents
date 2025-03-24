# Academy of Talents

An innovative educational platform that combines immersive 3D environments with advanced AI technology to deliver personalized learning experiences. Users can choose between exploring a vibrant virtual school environment or utilizing a streamlined 2D interface, both providing real-time access to specialized AI mentors.

## Features

### Immersive Learning Environment
- **Interactive 3D Virtual School**
  - Explorable classroom environments
  - Real-time character animations
  - Dynamic lighting and effects
  - Customizable viewing angles

### AI-Powered Avatars
- **Multiple Specialized AI Mentors**
  - Unique personalities and teaching styles
  - Real-time facial expressions and animations
  - Lip-synced speech with natural voice synthesis
  - Interactive conversations powered by Google's Gemini AI

### Creative Tools
- **AI Image Generation**
  - Create custom artwork through natural language descriptions
  - High-quality, family-friendly image generation
  - Real-time image processing and display

### User Experience
- **Dual Interface Options**
  - Immersive 3D environment for full engagement
  - Streamlined 2D chat interface for focused learning
  - Responsive design for various devices

### Security & Privacy
- **User Authentication**
  - Secure account management
  - Protected user data
  - Personalized learning progress tracking

## Tech Stack

### Frontend
- **Framework & Core**
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS

- **3D Technology**
  - Three.js
  - React Three Fiber
  - React Spring Three
  - Three Stdlib

- **UI Components**
  - Radix UI
  - Shadcn UI
  - Framer Motion
  - Sonner for notifications

### Backend & Services
- **AI & Machine Learning**
  - Google Gemini AI for chat and image generation
  - ElevenLabs for text-to-speech synthesis

- **Database & Authentication**
  - Turso Database
  - Drizzle ORM
  - Auth.js for authentication

### Asset Management
- **3D Assets**
  - Ready Player Me avatars
  - Custom classroom models
  - Mixamo animations

## Project Structure
```
.
├── frontend/                # Next.js frontend application
│   ├── app/                # Next.js app directory
│   │   ├── (auth)/        # Authentication routes
│   │   ├── (main)/        # Main application routes
│   │   └── api/           # API routes (chat, image generation)
│   ├── components/         # React components
│   │   ├── avatar/        # Avatar-related components
│   │   ├── scene-ui/      # 3D scene interface
│   │   └── ui/            # Common UI components
│   ├── config/            # Configuration files
│   └── public/            # Static assets and 3D models
└── backend/               # Python backend server
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- PNPM package manager

### Environment Setup

1. Create a `.env` file in `/frontend`:
```bash
NEXT_PUBLIC_GEMINI_API_KEY=<GEMINI_API_KEY>
TURSO_DATABASE_URL=<TURSO_DATABASE_URL>
TURSO_AUTH_TOKEN=<TURSO_AUTH_TOKEN>
AUTH_SECRET=<AUTH_SECRET>
AUTH_URL=<LOCALHOST_3000>
GOOGLE_API_KEY=<GOOGLE_API_KEY>
SYNTHESIS_URL=<LOCAL_HOST_OR_NGROK>
ELEVENLABS_API_KEY=<ELEVENLABS_API_KEY>
```

2. Copy the `.env` file to `/backend`

### Backend Setup
```bash
# Navigate to backend folder
cd backend

# Create and activate virtual environment
python3 -m venv venv && source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

### Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
pnpm i

# Start the development server
pnpm run dev
```

## References

### 3D Models
- [Ready Player Me](https://readyplayer.me/) - Avatar generation
- [Anime Classroom](https://sketchfab.com/3d-models/anime-classroom-6e17b75780c044429323cd7ab6a5b83c)
- [Teacher Model](https://sketchfab.com/3d-models/zero-two-a2dec30168e9454a97e83ad331ab859c)
- [Road Block](https://poly.pizza/m/e3QRTZLNQU5) by Luca Regazzi (okon3) [CC-BY]
- [Floor Grass Sliced B](https://poly.pizza/m/UMKvhGhK90) by Isa Lousberg
- [Bus](https://poly.pizza/m/bsvS0E1eo4R) by jeremy [CC-BY]
- [Train](https://poly.pizza/m/7UGWg1k6Pwp) by Poly by Google [CC-BY]
- Animations from [Mixamo](https://www.mixamo.com/)

### Sound Effects
- [Duck Sound Effect](https://pixabay.com/sound-effects/075176-duck-quack-40345/)