# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page React application that serves as an interactive portfolio for Alex Chen. The app features a chat interface where users can ask questions about Alex's background, with simulated AI responses providing information about skills, experience, and projects.

## Tech Stack

- **React 19**: Component-based UI library
- **Vite**: Fast build tool and development server
- **Vanilla CSS**: No CSS frameworks, using custom animations and gradients
- **ESModules**: Modern JavaScript module system

## Architecture

### Component Structure
- `App.jsx`: Main application component with floating animation logic
- `Header.jsx`: Profile section with animated Siri-like orb
- `ChatInterface.jsx`: Chat system with message handling and suggestions
- `BackgroundEffects.jsx`: Animated background particles and overlays

### Key Features
- **Siri-like Animation**: Animated orb profile picture with layered gradients
- **Interactive Chat**: Message system with predefined AI responses
- **Suggested Questions**: Clickable prompts that populate the input field
- **Background Effects**: Floating particles and gradient overlays
- **Responsive Design**: Mobile-friendly layout

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Component Customization

### Profile Information
Update the initial AI message in `ChatInterface.jsx` to modify Alex's bio and highlights.

### AI Responses
Modify the `responses` array in `ChatInterface.jsx` to change the AI's answer pool.

### Suggested Questions
Update the `suggestions` array in `ChatInterface.jsx` to change the prompt buttons.

### Styling
All styles are in `src/index.css` - modify CSS custom properties and animations for visual changes.