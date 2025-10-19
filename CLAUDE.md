# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive portfolio application for Dennis Williams, featuring a real-time AI chat interface powered by OpenAI Agents SDK. The application uses Next.js 15 with App Router and streams AI responses for immediate user feedback.

## Tech Stack

- **Next.js 15**: React framework with App Router and Server Components
- **React 19**: Component-based UI library
- **TypeScript**: Type-safe development
- **OpenAI Agents SDK**: Streaming AI agent responses (`@openai/openai-agents-js`)
- **Vercel**: Hosting and deployment platform
- **Vanilla CSS**: Custom animations and gradients (no CSS frameworks)

## Architecture

### File Structure
```
app/
  ├── api/chat/route.ts       # Streaming API endpoint for AI agent
  ├── page.tsx                # Main application page
  ├── layout.tsx              # Root layout with metadata
  └── globals.css             # Global styles and animations
components/
  ├── Header.tsx              # Profile section with animated Siri-like orb
  ├── ChatInterface.tsx       # Streaming chat system
  └── BackgroundEffects.tsx   # Animated background particles
```

### Key Features
- **Streaming AI Responses**: Real-time token-by-token responses using OpenAI Agents SDK
- **Siri-like Animation**: Animated orb profile picture with layered gradients
- **Session Management**: Persistent conversation history per user session
- **Suggested Questions**: Clickable prompts to guide user interactions
- **Background Effects**: Floating particles and gradient overlays
- **Responsive Design**: Mobile-first, optimized for all screen sizes

### API Architecture

#### Streaming Endpoint (`/api/chat`)
- **Method**: POST
- **Body**: `{ chatInput: string, sessionId: string }`
- **Response**: Streaming text using `ReadableStream`
- **Security**: API key stored server-side only in environment variables

#### OpenAI Agent Pattern
1. Initialize agent with portfolio context on server
2. Enable streaming with `stream: true`
3. Use `.toTextStream()` for efficient streaming
4. Return progressive responses to client
5. Maintain session context for conversation continuity

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Lint code
npm run lint
```

## Component Customization

### Agent Instructions
Edit the agent configuration in `app/api/chat/route.ts`:
```typescript
const agent = new Agent({
  name: 'Portfolio Assistant',
  instructions: 'Your custom instructions here...'
})
```

### Profile Information
Update the initial system message in `components/ChatInterface.tsx` to modify Dennis's bio and highlights.

### Suggested Questions
Modify the `suggestions` array in `components/ChatInterface.tsx` to change prompt buttons.

### Styling
All styles are in `app/globals.css` - modify CSS custom properties for colors, animations, and layout.

## Environment Variables

Required environment variables (add to `.env.local`):
```
OPENAI_API_KEY=your_openai_api_key_here
```

**Important**: Never commit `.env.local` to version control. API keys must remain server-side only.

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add `OPENAI_API_KEY` environment variable
4. Deploy automatically on push to main

### Environment Configuration
- Development: Uses `.env.local`
- Production: Uses Vercel environment variables
- Edge Runtime: Configured for low-latency responses

## Streaming Implementation Notes

### Client-Side
```typescript
// Fetch with streaming response
const response = await fetch('/api/chat', { method: 'POST', body: JSON.stringify(data) })
const reader = response.body.getReader()
const decoder = new TextDecoder()

// Read stream progressively
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const chunk = decoder.decode(value)
  // Update UI with chunk
}
```

### Server-Side
```typescript
// OpenAI Agent with streaming
const stream = await runner.run(agent, message, { stream: true })
return new Response(stream.toTextStream())
```

## Best Practices

1. **API Security**: Never expose OpenAI API key to client
2. **Error Handling**: Gracefully handle streaming errors and network issues
3. **Rate Limiting**: Implement rate limiting on API routes
4. **Session Management**: Use secure session IDs (not easily guessable)
5. **Type Safety**: Leverage TypeScript for all components and API routes
6. **Performance**: Use React Server Components where possible
7. **Accessibility**: Ensure chat interface is keyboard-navigable

## Troubleshooting

### Streaming Not Working
- Verify `OPENAI_API_KEY` is set correctly
- Check browser console for CORS errors
- Ensure API route returns proper `ReadableStream`

### Session Issues
- Clear localStorage and test with new session
- Verify sessionId is being sent to API
- Check server logs for session handling errors

### Build Errors
- Run `npm run type-check` to identify TypeScript issues
- Ensure all dependencies are installed
- Check for import path errors (use `@/` alias for root imports)