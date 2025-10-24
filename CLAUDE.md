# Portfolio Site - Development Guide

## Project Overview

This is a professional portfolio website built with **Next.js 16** featuring an AI-powered chatbot assistant. The site showcases Patrick Herbert's experience, publications, and skills with a clean, modern design inspired by Apple and Anthropic aesthetics.

**Tech Stack:**
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + PostCSS
- **AI/LLM:** Google Generative AI (Gemini 2.0 Flash Lite)
- **Markdown:** react-markdown with remark-gfm
- **Deployment:** Vercel
- **Runtime:** Node.js >= 20.9.0

## Common Commands

```bash
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint checks
```

## Architecture & Code Structure

### Directory Organization

```
portfolio-site/
├── app/
│   ├── page.tsx                  # Main landing page (home & CV views)
│   ├── layout.tsx                # Root layout with metadata
│   ├── globals.css               # Global styles
│   ├── api/chat/route.ts         # Chat API endpoint
│   ├── components/
│   │   ├── Navigation.tsx        # Header navigation
│   │   ├── ChatBot.tsx           # Chat widget
│   │   ├── ChatMessage.tsx       # Message display
│   │   ├── TypingIndicator.tsx   # Loading animation
│   │   ├── Timeline.tsx          # Experience timeline
│   │   ├── Publications.tsx      # Publications section
│   │   └── CVView.tsx            # Full CV view
│   └── data/
│       ├── experience.ts         # Experience data
│       └── publications.ts       # Publications data
├── lib/
│   └── gemini.ts                 # Google AI integration
├── public/
│   └── cv-content.md             # Chatbot knowledge base
├── next.config.ts, tsconfig.json, eslint.config.mjs, package.json
└── vercel.json                   # Vercel config
```

### Architecture Patterns

#### 1. Client vs Server Components
- **page.tsx:** Client component - manages home/cv tab state
- **Navigation, ChatBot:** Client components - interactive
- **layout.tsx:** Server component - metadata and fonts

#### 2. API Layer
- **Endpoint:** POST /api/chat
- **Request:** { "message": string, "history": Message[] }
- **Response:** { "message": string, "timestamp": string }
- **Handler:** Reads CV markdown, calls Gemini API for response

#### 3. Data Flow
```
User Input (ChatBot) → POST /api/chat → Read cv-content.md
→ Gemini API (lib/gemini.ts) → Response → ChatMessage (markdown)
```

#### 4. Component Composition
- **Page:** Main layout container, manages tabs
- **Sections:** Timeline, Publications, CVView
- **Widgets:** ChatBot widget with message history
- **UI Elements:** ChatMessage, TimelineItem, TypingIndicator

#### 5. Styling
- Tailwind CSS utilities for layout/spacing
- Inline styles for custom colors (warm palette)
- Google Fonts (Geist Sans/Mono) via next/font
- Global CSS baseline in app/globals.css

### Data Layer

**app/data/experience.ts:**
```typescript
interface Experience {
  company: string;
  role: string;
  dates: string;
  location: string;
  summary: string;        // Timeline view
  details: string[];      // Full CV
}
```

**app/data/publications.ts:** Similar structure for research publications

**public/cv-content.md:** Markdown knowledge base
- Read server-side in /api/chat/route.ts
- Injected into Gemini system prompt

## Configuration Details

### Environment Variables (.env.local)
- **GEMINI_API_KEY:** Google Generative AI API key (required)

### TypeScript (tsconfig.json)
- **Target:** ES2017
- **Strict Mode:** Enabled
- **Path Aliases:** @/* → project root
- **Module:** ESNext with bundler resolution

### ESLint (eslint.config.mjs)
- Extends: eslint-config-next and core-web-vitals
- Ignores: .next/, build/, next-env.d.ts
- Format: Flat config (ESLint 9.0+)

### PostCSS (postcss.config.mjs)
- Plugin: @tailwindcss/postcss (Tailwind CSS v4)

### Vercel (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key"
  }
}
```

### Next.js (next.config.ts)
- Minimal configuration, extensible for future needs

## Key Features

### 1. AI Chatbot
- Floating widget with toggle
- Message history and auto-scroll
- Markdown rendering (code blocks, formatting)
- Context-aware responses using CV knowledge
- Typing indicator for better UX

### 2. Portfolio Sections
- Hero section with contact links
- Experience timeline (visual)
- Research publications
- Full CV with detailed work history

### 3. Navigation
- Tab-based (Home / CV)
- Sticky header
- Responsive design

## Development Workflow

### Setup
```bash
node --version              # Verify >= 20.9.0
npm install
# Create .env.local with GEMINI_API_KEY
npm run dev
# Open http://localhost:3000
```

### Common Tasks
- **Update content:** Edit app/data/experience.ts, publications.ts, public/cv-content.md
- **Update UI:** Modify components in app/components/
- **Change colors:** Update inline styles in page.tsx
- **Update chatbot:** Edit system prompt in lib/gemini.ts

### Before Committing
```bash
npm run lint
npm run build
npm run dev
```

### Deploy to Vercel
```bash
npm run build
vercel --prod
```

## Performance Considerations

- **Code Splitting:** App Router automatically splits chunks
- **Styling:** Tailwind v4 generates only used utilities
- **AI Model:** Gemini 2.0 Flash Lite optimized for speed/cost
- **Markdown:** Rendered client-side after response
- **Caching:** Consider caching frequent question responses

## Troubleshooting

**Node Version Error:**
- Upgrade Node.js: nvm install 20 && nvm use 20

**API Key Missing:**
- Verify .env.local exists with GEMINI_API_KEY
- Vercel: Settings → Environment Variables

**Build Errors:**
```bash
rm -rf .next
npm install
npm run build
```

**Chat Not Responding:**
- Check browser console for errors
- Verify GEMINI_API_KEY is valid
- Test API manually with curl

## Future Enhancements

- Response caching for common questions
- Dark mode toggle
- Multi-language support
- Analytics integration
- Export conversation as PDF
- Support for multiple AI providers
- Blog section with MDX
- Search functionality

## Resources

- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Google Generative AI: https://ai.google.dev/docs
- React Markdown: https://github.com/remarkjs/react-markdown
- Vercel: https://vercel.com/docs
