# Technology Stack

**Note:** Prefer CLI for scaffolding where available. All technologies listed are free or have generous free tiers suitable for MVP development.

## Frontend (User Interface)

- **Framework:** Next.js 16+ (App Router)
  - React-based framework with server components for optimal performance, SEO, and modern development experience
  - Free deployment on Vercel
  - Built-in API routes via Server Actions for backend functionality
- **Language:** TypeScript
  - Type safety for complex data models (Guilds, Bounties, Rankings, Disputes)
  - Better developer experience and code maintainability
- **Styling:** Tailwind CSS v3+
  - Utility-first CSS framework for rapid UI development
  - **Theme:** "Web3 Cyberpunk / Sci-Fi Fusion"
    - Dark mode by default with cosmic backgrounds
    - Neon accent colors: cyan, magenta, electric purple, lime green
    - Glassmorphism and neumorphism effects
    - HUD (Heads-Up Display) style interfaces
    - Animated gradients and particle effects
    - Matrix-style data streams for backgrounds
    - Holographic card designs for guilds and profiles
- **Component Library:** Shadcn/ui (Radix UI primitives)
  - Accessible, unstyled components customizable for futuristic theme
  - Copy-paste component architecture
  - Free and open source
- **Icons:** Lucide Icons
  - Consistent icon set with tech/sci-fi aesthetic
  - Lightweight and customizable
- **Animations:** Framer Motion
  - Smooth page transitions and micro-interactions
  - Loading states with "scanning" and "digital" effects
  - Sliding panels and morphing UI elements
  - Parallax scrolling effects
- **Data Visualization:** Recharts + D3.js utilities
  - Anime-style complex charts (radar, area, composed)
  - Real-time updating graphs for trust scores and rankings
  - Custom styled charts matching sci-fi theme
  - Performance metrics visualization

## Backend (Server-Side Logic)

- **Runtime:** Next.js Server Actions / API Routes
  - Serverless functions within Next.js for all backend operations
  - No separate backend server required
  - Automatically scales with Vercel deployment
  - Free tier includes 100GB bandwidth and 100 hours of serverless function execution
- **Database:** MongoDB Atlas (Free Tier - M0)
  - NoSQL database for flexible document structures
  - Free tier includes 512MB storage (sufficient for MVP)
  - Supports complex queries and aggregations for ranking calculations
  - Easy scaling path for production
- **ODM:** Mongoose v8+
  - Schema modeling and validation for MongoDB
  - Middleware for hooks (pre-save, post-update for rank calculations)
  - Built-in TypeScript support
- **API Design:**
  - RESTful principles via Next.js API routes
  - Server Actions for mutations
  - Tidy error handling with Zod validation

## AI & Intelligence Layer

- **LLM Provider:** GroqCloud (Free Tier)
  - Ultra-fast inference (300+ tokens/second)
  - Free tier includes generous API calls for MVP testing
  - Enterprise-grade performance without costs
- **Models:**
  - Primary: Llama 3.1 70B or Mixtral 8x7B (via Groq)
  - Fallback: Llama 3.1 8B for simpler tasks
- **AI Use Cases:**
  - **Bounty-Guild Matching:** Analyze bounty requirements and guild capabilities
  - **Dispute Analysis:** Summarize conflict context and suggest fair outcomes
  - **Fraud Detection:** Pattern recognition for reputation manipulation
  - **Trust Score Calculations:** Weighted analysis of guild performance metrics
  - **Content Moderation:** Filter inappropriate bounty descriptions
  - **Natural Language Queries:** Allow users to search with conversational inputs
- **Integration:** Direct API calls via fetch in Server Actions
- **Fallback Strategy:** Rule-based logic if AI unavailable

## Authentication & Security

- **Auth Provider:** NextAuth.js v5 (Auth.js)
  - Flexible authentication supporting multiple strategies
  - Session management with JWT
  - Free and open source
- **Auth Methods:**
  - Credentials (email/password) with bcrypt hashing
  - OAuth providers (Google, GitHub) optional
  - Magic link authentication for passwordless flow
- **Validation:** Zod
  - Runtime type checking and schema validation
  - Form validation on client and server
  - API request/response validation
- **Security Measures:**
  - CSRF protection via NextAuth
  - Rate limiting on API routes
  - Input sanitization for XSS prevention
  - Environment variables for secrets

## Real-time Communication

- **WebSocket Alternative:** Pusher (Free Tier) or Ably (Free Tier)
  - For guild chat and live updates
  - Free tier: 100 concurrent connections, 200k messages/day
  - Fallback: Polling-based updates if needed
- **Alternative:** Socket.io with custom WebSocket server (if needed later)

## File Storage (Optional)

- **Provider:** Cloudinary (Free Tier) or Uploadthing
  - For profile avatars, guild banners, bounty proof images
  - Free tier: 25GB storage, 25GB bandwidth/month
  - Automatic image optimization and transformations

## Development & Testing

- **Package Manager:** Yarn 3+
- **Code Quality:**
  - ESLint with TypeScript rules
  - Prettier for code formatting
- **Testing (Future):**
  - Vitest for unit tests
  - Playwright for e2e tests
- **Version Control:** Git + GitHub
- **Environment Management:** .env.local for secrets

## Deployment & Hosting

- **Platform:** Vercel (Free Tier)
- **Domain:** Free Vercel subdomain (\*.vercel.app) for MVP
- **Database Hosting:** MongoDB Atlas (Free M0 cluster)
- **Monitoring:** Vercel Analytics (Free tier available)

## Additional Utilities

- **Date/Time:** date-fns (lightweight alternative to moment.js)
- **Forms:** React Hook Form (performant form management)
- **State Management:**
  - React Context for global state (auth, theme)
  - Zustand for complex client state (if needed)
- **Notifications:** React Hot Toast or Sonner (toast notifications)
- **Email (Optional):** Resend (Free tier - 100 emails/day)

## Monorepo and Package Manager

Use Yarn 3 and Turborepo.
