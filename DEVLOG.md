# Dev Log — AI Spend Audit

## v0.1.0 — Initial Build (May 2026)

### Goals
- Build production-quality SaaS MVP from scratch
- No auth, value-first UX
- Deterministic audit engine
- Gemini AI for summaries only

### Decisions Made
- **Tailwind v4** over v3 — new `@import "tailwindcss"` syntax
- **`runAudit()` client-side** — avoids server round-trip for core UX
- **sessionStorage** for results page handoff — avoids URL params complexity
- **Honeypot** over reCAPTCHA — simpler, no UX friction
- **Recharts** over Chart.js — better React integration
- **Resend** over SendGrid — simpler API, better DX

### Challenges
- Tailwind v4 uses different config syntax than v3 (no `tailwind.config.ts`)
- Next.js 16 uses `params` as a Promise in server components
- UUID path aliases required careful tsconfig paths setup

## v0.1.1 — Production Hardening (May 2026)

### Challenges & Fixes
- **Parent Dependency Collision**: Identified `package.json`, `package-lock.json`, and `node_modules` in user home directory `C:\Users\User`. This can bleed React 18 dependencies into the project (which requires React 19 / Next.js 16). Recommend deleting or renaming those home folder items to avoid issues.
- **Serverless Rate Limiting**: Shifted rate-limiting from volatile in-memory Map to an atomic database-backed Supabase RPC routine to support stateless serverless deployments.
- **Domain Hardcoding**: Unified share URLs and email base URLs to dynamic configuration, resolving hardcoded placeholders.

### Next Steps
- Add more AI tools (Perplexity, Midjourney, Runway)
- Add "compare plans" feature
- Add usage-based audit mode (estimated tokens/month)
- Build admin dashboard for lead management
- A/B test hero headline copy
