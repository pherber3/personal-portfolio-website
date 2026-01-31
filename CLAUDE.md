# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional portfolio website built with **Next.js 16** featuring a RAG-powered AI chatbot assistant. The site showcases Patrick Herbert's experience, publications, and skills with a clean, modern design inspired by Apple and Anthropic aesthetics.

**Tech Stack:**
- **Framework:** Next.js 16 (App Router) with React 19.2
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + PostCSS with custom color palette
- **AI/LLM:** Google Generative AI (Gemini 2.0 Flash Lite)
- **Markdown:** react-markdown with remark-gfm; MDX blog via next-mdx-remote
- **Blog:** MDX with remark-math, rehype-katex, rehype-slug
- **Analytics:** Vercel Analytics & Speed Insights
- **Deployment:** Vercel
- **Runtime:** Node.js >= 20.9.0
- **Testing:** None configured (linting only via ESLint 9)

## Common Commands

```bash
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint checks
node check-models.js     # List available Gemini models (requires GEMINI_API_KEY)
```

## Architecture & Code Structure

### Directory Organization

```
portfolio-site/
├── app/
│   ├── page.tsx                  # Main landing page (home & CV views)
│   ├── layout.tsx                # Root layout with metadata
│   ├── globals.css               # Global styles & custom color palette
│   ├── api/chat/route.ts         # Chat API endpoint (RAG implementation)
│   ├── components/
│   │   ├── Navigation.tsx        # Header navigation
│   │   ├── ChatBot.tsx           # Chat widget
│   │   ├── ChatMessage.tsx       # Message display
│   │   ├── TypingIndicator.tsx   # Loading animation
│   │   ├── Timeline.tsx          # Experience timeline
│   │   ├── Publications.tsx      # Publications section
│   │   └── CVView.tsx            # Full CV view
│   ├── blog/
│   │   ├── page.tsx              # Blog listing page
│   │   ├── BlogNavWrapper.tsx    # Navigation wrapper for blog
│   │   └── [slug]/
│   │       ├── page.tsx          # Individual blog post page
│   │       └── mdx-components.tsx # Custom MDX components
│   └── data/
│       ├── experience.ts         # Experience data
│       └── publications.ts       # Publications data
├── content/
│   └── blog/                     # MDX blog posts (frontmatter + content)
│       └── *.mdx
├── lib/
│   ├── gemini.ts                 # Google AI integration
│   └── blog.ts                   # Blog utilities (getAllPosts, getPostBySlug)
├── public/
│   ├── detailed-experience.md    # RAG knowledge base (724 lines)
│   └── blog/                     # Blog static assets (SVGs, HTML widgets)
├── check-models.js               # Utility to list Gemini models
├── next.config.ts, tsconfig.json, eslint.config.mjs, package.json
└── vercel.json                   # Vercel config
```

### Architecture Patterns

#### 1. Client vs Server Components
- **page.tsx:** Client component ('use client') - manages home/cv tab state
- **Navigation, ChatBot:** Client components - interactive
- **layout.tsx:** Server component - metadata, fonts, and analytics
- **blog/[slug]/page.tsx:** Server component - MDX rendering with generateStaticParams

#### 2. RAG (Retrieval-Augmented Generation) Pattern
- **Knowledge Base:** `public/detailed-experience.md` (27KB of detailed experience)
- **Retrieval:** File read on each API call (no caching)
- **Augmentation:** System prompt + knowledge injected into Gemini context
- **Generation:** Gemini 2.0 Flash Lite generates contextual responses

#### 3. API Layer
- **Endpoint:** POST /api/chat
- **Request:** `{ "message": string, "history": Message[] }`
- **Response:** `{ "message": string, "timestamp": string }`
- **Error Handling:**
  - 429 (rate limit): "I am receiving too many requests..."
  - 400 (bad request): "I couldn't understand that format..."
  - Generic errors: "I'm having trouble responding..."

#### 4. Data Flow
```
User Input (ChatBot) → POST /api/chat → Read detailed-experience.md
→ Gemini API (lib/gemini.ts) → Response → ChatMessage (markdown)
```

#### 5. Styling & Design System

**Custom Color Palette (defined in globals.css):**
- Primary: `#3A4D39` (Deep forest green)
- Secondary: `#738F70` (Sage green)
- Background: `#FDFCFB` (Paper white)
- Foreground: `#1A1A1A` (Ink black)
- Border: `#E5E2D9`
- Muted: `#787570`
- Paper Offset: `#F4F2ED`

**Typography:**
- Sans: Geist (--font-geist-sans)
- Mono: Geist Mono (--font-geist-mono)
- Serif: Newsreader (--font-newsreader) for academic headings

### Data Layer

**app/data/experience.ts:**
```typescript
interface Experience {
  company: string;
  role: string;
  dates: string;
  location: string;
  summary: string;        // Timeline view
  details: string[];      // Full CV view
}
```

**app/data/publications.ts:**
```typescript
interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: number;
  volume?: string;
  pages?: string;
  doi: string;
}
```

**public/detailed-experience.md:**
- Comprehensive knowledge base for RAG
- Includes technical projects, model architectures, research details
- Math notation, specific models (ONNX, TensorRT, Plackett-Luce)
- Read server-side in /api/chat/route.ts

**lib/blog.ts:**
```typescript
interface BlogPostMeta {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime?: number;
  slug: string;
}
```
- `getAllPostSlugs()`: Returns slug array from content/blog/*.mdx
- `getPostBySlug(slug)`: Parses frontmatter via gray-matter, returns meta + content
- `getAllPosts()`: Returns all posts sorted by date (newest first)

**content/blog/*.mdx (Blog Posts):**
- MDX files with YAML frontmatter (title, date, excerpt, tags, readingTime)
- Rendered server-side via next-mdx-remote/rsc
- Plugins: remark-gfm, remark-math, rehype-slug, rehype-katex
- Custom components: TableOfContents, Callout, Figure (defined in mdx-components.tsx)
- Static assets (SVGs, interactive HTML widgets) in public/blog/

## Configuration Details

### Environment Variables (.env.local)
- **GEMINI_API_KEY:** Google Generative AI API key (required)

### TypeScript (tsconfig.json)
- **Target:** ES2017
- **Strict Mode:** Enabled
- **Path Aliases:** @/* → project root
- **Module:** ESNext with bundler resolution

### ESLint (eslint.config.mjs)
- Extends: eslint-config-next/core-web-vitals and typescript
- Ignores: .next/, out/, build/, next-env.d.ts
- Format: Flat config (ESLint 9.0+)

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

## Key Features

### 1. AI Chatbot (RAG-powered)
- Floating widget with toggle
- Message history (not persisted)
- Auto-scroll on new messages
- Markdown rendering with syntax highlighting
- Context-aware responses using detailed-experience.md
- Example questions shown until first message
- Error handling for rate limits and API errors
- System prompt enforces third-person responses about Patrick

### 2. Portfolio Sections
- Hero section with LinkedIn/Email/GitHub links
- Timeline view (expandable experience items)
- Publications (lazy load after 3 items)
- Full CV with smooth scroll navigation (140px offset for sticky header)

### 3. Blog
- MDX-based blog at /blog with dynamic [slug] routes
- Static generation via generateStaticParams
- LaTeX math support (remark-math + rehype-katex)
- Auto-generated heading anchors (rehype-slug)
- Custom MDX components: TableOfContents, Callout, Figure
- SEO: Open Graph article tags, canonical URLs, keywords from tags
- Interactive embeds via iframes to public/blog/ assets

### 4. Navigation
- Tab-based (Home / CV / Blog)
- Sticky header with scroll indicator
- Responsive design (mobile breakpoint: 768px)
- Scroll reset on tab change
- Blog routes detected via usePathname().startsWith('/blog')

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
- **Update experience:** Edit app/data/experience.ts and public/detailed-experience.md
- **Update publications:** Edit app/data/publications.ts
- **Add a blog post:** Create content/blog/your-slug.mdx with frontmatter (title, date, excerpt, tags, readingTime)
- **Add blog assets:** Place SVGs/HTML widgets in public/blog/
- **Change colors:** Update CSS variables in app/globals.css
- **Update chatbot behavior:** Edit system prompt in lib/gemini.ts
- **Test Gemini models:** Run `node check-models.js`

### Before Committing
```bash
npm run lint
npm run build
```

### Deploy to Vercel
```bash
vercel --prod
```

## SEO

- **metadataBase:** `https://pherbert.vercel.app` (set in app/layout.tsx)
- **Sitemap:** Auto-generated at /sitemap.xml via app/sitemap.ts (includes all blog posts)
- **Robots:** /robots.txt via app/robots.ts (allows all, disallows /api/)
- **Blog post metadata:** Open Graph article tags, canonical URLs, keywords, authors
- **Google Search Console:** Verified via public/googledbcb345959fff76d.html

## Performance Considerations

- **Model Selection:** Gemini 2.0 Flash Lite (optimized for speed/cost over Pro)
- **Code Splitting:** App Router automatically handles chunking
- **Styling:** Tailwind v4 generates only used utilities
- **Fonts:** Google Fonts with display: swap for performance
- **Analytics:** Vercel Analytics and Speed Insights track Web Vitals
- **Markdown:** Rendered client-side after API response
- **No caching:** Consider implementing response caching for common questions

## Troubleshooting

**Node Version Error:**
```bash
nvm install 20 && nvm use 20
```

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
- Check for rate limiting (429 errors)
- Test with: `node check-models.js`

## Resources

- Next.js App Router: https://nextjs.org/docs/app
- Tailwind CSS v4: https://tailwindcss.com/docs
- Google Generative AI: https://ai.google.dev/docs
- React Markdown: https://github.com/remarkjs/react-markdown
- Vercel Deployment: https://vercel.com/docs