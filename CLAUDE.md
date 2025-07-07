# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive portfolio website that functions as an AI-powered resume. Users can ask questions about Alex Chen's background through a chat interface that provides simulated AI responses.

## Architecture

- **Single-file application**: Complete website contained in `index.html` with embedded CSS and JavaScript
- **No build process**: Static HTML file that runs directly in browsers
- **Vanilla JavaScript**: No external dependencies or frameworks
- **Client-side only**: All functionality runs in the browser

## Key Components

### Chat System
- Message rendering with user/AI avatars
- Predefined response system that randomly selects from response arrays
- Suggested question buttons that populate the input field
- Auto-scrolling message container

### Visual Effects
- CSS particle animation system with floating elements
- Glassmorphism design using backdrop-filter
- Gradient animations on text and backgrounds
- Responsive hover effects and transitions

## Development

Since this is a static HTML file:
- Open `index.html` directly in a browser for development
- Use any static file server for local hosting: `python -m http.server 8000`
- No build, lint, or test commands - changes are immediately visible on refresh

## Customization Points

- **Profile data**: Update name, title, and bio in the initial AI message (line 401-408)
- **AI responses**: Modify the `responses` array in `sendMessage()` function (line 478-484)
- **Suggested questions**: Update suggestion buttons in HTML (line 416-421)
- **Styling**: Adjust CSS custom properties and animations throughout the embedded styles