# AI Spend Audit

> Audit your startup's AI tool stack in 60 seconds. Get personalized savings recommendations — no login required.

[![CI](https://github.com/istakbal000/ai-spend-audit/actions/workflows/ci.yml/badge.svg)](https://github.com/istakbal000/ai-spend-audit/actions)

---

## 🚀 What is this?

AI Spend Audit is a B2B SaaS tool for startups and engineering teams that want to stop overpaying for AI subscriptions. Users input their current AI tools, plans, and seats — the engine identifies savings opportunities through downgrade suggestions, redundancy detection, and plan optimization.

**No login. No credit card. Instant results.**

---

## ✨ Features

- 🔍 **Instant Stack Analysis** — audit 8 major AI platforms in seconds
- 💰 **Savings Detection** — downgrade suggestions, consolidation alerts, overlap detection
- 🤖 **AI Summary** — Gemini-powered personalized audit narrative
- 🔗 **Shareable Reports** — UUID-based public links, SEO-optimized
- 📧 **Lead Capture** — email capture post-value, not pre-value
- 📊 **Visual Dashboard** — before/after charts, spend breakdown
- 📬 **Transactional Emails** — via Resend

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini 1.5 Flash |
| Email | Resend |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Testing | Vitest |
| CI/CD | GitHub Actions |
| Deploy | Vercel |

---

## 🏃 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/istakbal000/ai-spend-audit
cd ai-spend-audit
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Fill in your Supabase, Gemini, and Resend keys
```

### 3. Set Up Database

Run the SQL in `supabase/migrations/001_initial.sql` in your Supabase SQL editor.

### 4. Run Locally

```bash
npm run dev
# Opens at http://localhost:3000
```

---

## 🧪 Testing

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run type-check # TypeScript check
npm run lint       # ESLint
```

---

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables from `.env.example`
4. Deploy!

See `ARCHITECTURE.md` for full system design.

---

## 📁 Project Structure

```
app/                 # Next.js App Router pages
  api/               # API routes (summary, audit)
  audit/             # Audit form + public [id] pages
  results/           # Results dashboard
src/
  components/        # React components
    landing/         # Landing page sections
    form/            # Spend input form
    results/         # Results dashboard
  data/              # pricing.ts — hardcoded AI tool pricing
  engine/            # audit.ts — deterministic rules engine
  lib/               # supabase, gemini, resend, utils
  tests/             # Vitest test suite
  types/             # TypeScript definitions
supabase/
  migrations/        # SQL schema files
.github/workflows/   # CI/CD
```

---

## 📄 License

MIT
