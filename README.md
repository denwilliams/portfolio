# Dennis Williams - Interactive Portfolio

An interactive portfolio website featuring a real-time AI chat interface powered by OpenAI Agents SDK. Built with Next.js 15 and deployed on Vercel.

## Features

- **AI-Powered Chat**: Real-time streaming responses using OpenAI Agents SDK
- **Interactive Portfolio**: Ask questions about Dennis's background, skills, and experience
- **Siri-like Animations**: Animated orb profile picture with layered gradients
- **Responsive Design**: Optimized for mobile and desktop
- **Background Effects**: Floating particles and gradient overlays
- **Session Management**: Persistent conversation history

## Tech Stack

- **Next.js 15**: React framework with App Router and Server Components
- **OpenAI Agents SDK**: Streaming AI agent responses
- **React 19**: Component-based UI library
- **TypeScript**: Type-safe development
- **Vercel**: Hosting and deployment platform
- **Vanilla CSS**: Custom animations and gradients

## Architecture

### Frontend
- `app/page.tsx`: Main application page
- `components/Header.tsx`: Profile section with animated Siri-like orb
- `components/ChatInterface.tsx`: Streaming chat system
- `components/BackgroundEffects.tsx`: Animated background particles

### Backend
- `app/api/chat/route.ts`: API route for streaming agent responses
- Server-side agent initialization with OpenAI SDK
- Secure API key management
- Session-based conversation context

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Lint code
npm run lint
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Deploy!

The application will be automatically deployed on every push to main branch.

## Customization

### Update Portfolio Information
Edit the agent instructions in `app/api/chat/route.ts` to modify Dennis's bio and capabilities.

### Modify Suggested Questions
Update the `suggestions` array in `components/ChatInterface.tsx` to change prompt buttons.

### Customize Styling
All styles are in `app/globals.css` - modify CSS custom properties for visual changes.

### Agent Configuration
Configure the AI agent's personality, knowledge base, and behavior in the API route handler.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for agent SDK | Yes |
| `NODE_ENV` | Environment mode (development/production) | Auto |

## Performance

- **Streaming responses**: Sub-second time to first token
- **Server Components**: Reduced client-side JavaScript
- **Edge deployment**: Low-latency responses via Vercel Edge
- **Optimized bundle**: Code splitting and lazy loading

## Security

- API keys stored server-side only
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configured for production domain

## License

MIT

## Contact

For questions or feedback, reach out through the chat interface or visit [Dennis's portfolio](your-domain.com).
