# Portfolio Website

A professional portfolio website with an AI-powered chatbot that answers questions about Patrick Herbert's experience, skills, and publications.

## Features

- Clean, Apple/Anthropic-inspired design
- Interactive AI chatbot powered by Google Gemini 2.0 Flash Lite
- Markdown rendering for chat responses
- Typing indicators for better UX
- Responsive design for all devices
- CV-based knowledge system

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI/LLM**: Google Generative AI (Gemini 1.5 Flash)
- **Markdown**: react-markdown with remark-gfm
- **Deployment**: Vercel

## Setup

1. **Install dependencies**:
```bash
cd d:\Projects\portfolio-site
npm install
```

2. **Environment variables** are already configured in `.env.local`

3. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
portfolio-site/
├── app/
│   ├── page.tsx                 # Main landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── api/chat/route.ts        # Chat API endpoint
│   └── components/
│       ├── ChatBot.tsx          # Main chat widget
│       ├── ChatMessage.tsx      # Message component
│       └── TypingIndicator.tsx  # Loading animation
├── lib/
│   └── gemini.ts                # Gemini AI integration
├── public/
│   └── cv-content.md            # CV content for chatbot
├── .env.local                   # Environment variables
└── package.json
```

## Customization

### Update CV Content

Edit [public/cv-content.md](public/cv-content.md) to update the information the chatbot knows about.

### Modify Design

- Colors and styles: [app/globals.css](app/globals.css) and Tailwind classes
- Landing page content: [app/page.tsx](app/page.tsx)
- Chat UI: [app/components/ChatBot.tsx](app/components/ChatBot.tsx)

### Change AI Model

Edit [lib/gemini.ts](lib/gemini.ts) to switch models or adjust the system prompt.

## API Usage

### Chat Endpoint

**POST** `/api/chat`

Request body:
```json
{
  "message": "What is Patrick's experience with ML?",
  "history": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ]
}
```

Response:
```json
{
  "message": "Patrick has extensive experience...",
  "timestamp": "2025-10-23T03:49:01.157Z"
}
```

## License

MIT
