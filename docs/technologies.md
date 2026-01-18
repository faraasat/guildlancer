# Technology Stack

Please prefer cli for scaffolding where it available.

## Frontend (User Interface)

- **Framework:** Next.js (App Router)
  - Chosen for its React server components, creating a fast, SEO-friendly, and modern web application.
- **Language:** TypeScript
  - Ensures type safety and cleaner code, essential for managing complex data models like Guilds, Bounties, and Rankings.
- **Styling:** Tailwind CSS
  - Utility-first CSS framework for rapid UI development.
  - **Theme:** "Cyberpunk / Sci-Fi Web3". Dark mode by default, neon accents (cyan, magenta, electric purple), glassmorphism effects, and heads-up display (HUD) style data visualization.
- **Component Library:** Shadcn/ui (Radix UI) + Lucide Icons
  - Provides accessible, unstyled components that can be easily customized to fit the futuristic theme.
- **Animations:** Framer Motion
  - For smooth transitions, loading states, and "tech" interface animations (e.g., scanning effects, sliding panels).
- **Data Visualization / Charts:** Recharts
  - For rendering complex, animesque, and futuristic graphs for Guild rankings, Trust Scores, and Hunter metrics.

## Backend (Server-Side Logic)

- **Runtime:** Next.js Server Actions / Server Functions
  - Serverless functions hosted directly within the Next.js application to handle API requests and business logic without a separate backend server.
- **Database:** MongoDB (Atlas Free Tier)
  - NoSQL database chosen for its flexibility with varying document structures (Bounties with different metadata, Guilds with evolving histories).
- **ODM:** Mongoose
  - Schema modeling for MongoDB to enforce data structure at the application level.

## AI & Intelligence

- **LLM Provider:** GroqCloud (Free Tier)
  - Leveraging ultra-fast inference speeds for real-time interactions.
- **Models:** Llama 3 or Mixtral (via Groq)
  - Used for:
    - Matching Bounties to Guilds.
    - Summarizing dispute contexts.
    - Analyzing Guild reliability.
    - Providing "decision support" in conflict resolution.

## Authentication & Security

- **Auth:** NextAuth.js (Auth.js)
  - Flexible authentication handling credential login (email/password) and OAuth providers if needed.
- **Validation:** Zod
  - Schema validation for user inputs and API data integrity.

## Hosting & Deployment

- **Deployment Platform:** Vercel (Free Tier)
  - Native support for Next.js, providing serverless infrastructure, global CDN, and automatic CI/CD.
- **Version Control:** GitHub

## Monorepo

Use Yarn 3 and Turborepo.
