# Patrick Herbert - Portfolio Website

A professional portfolio website with an AI-powered chatbot that answers questions about Patrick Herbert's experience, skills, and publications.

## Features

- Clean, Apple/Anthropic-inspired design
- Interactive AI chatbot powered by Google Gemini 1.5 Flash
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

## Prerequisites

**Important**: This project requires Node.js >= 20.9.0

You are currently using Node.js 18.12.1. Please upgrade Node.js before running the development server.

### Install Node.js 20+

**Option 1: Using nvm (Node Version Manager) - Recommended**
```bash
# Install nvm from: https://github.com/coreybutler/nvm-windows
# Then install Node 20:
nvm install 20
nvm use 20
```

**Option 2: Direct Download**
Download from: https://nodejs.org/ (LTS version)

## Setup

1. **Install dependencies**:
```bash
cd d:\Projects\portfolio-site
npm install
```

2. **Environment variables** are already configured in `.env.local`:
```
GEMINI_API_KEY=AIzaSyBmdiXbM30j_rrVv8WaQPOYg3nwujf8qwY
```

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

## Deployment to Vercel

### Quick Deploy

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd d:\Projects\portfolio-site
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **portfolio-site** (or your choice)
- In which directory is your code located? **./**
- Want to override settings? **N**

3. **Set environment variables in Vercel**:
```bash
vercel env add GEMINI_API_KEY
```
Paste your API key when prompted.

4. **Deploy to production**:
```bash
vercel --prod
```

### Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: `AIzaSyBmdiXbM30j_rrVv8WaQPOYg3nwujf8qwY`
5. Deploy!

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

## Troubleshooting

### Node Version Error
If you see "Node.js version >= 20.9.0 is required", upgrade Node.js (see Prerequisites above).

### API Key Error
Make sure `.env.local` exists and contains your `GEMINI_API_KEY`.

### Build Errors
Try clearing Next.js cache:
```bash
rm -rf .next
npm run dev
```

## License

MIT
