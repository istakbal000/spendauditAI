# Architecture — AI Spend Audit

## System Overview

```
User Browser
    │
    ├── Landing Page (SSG)
    ├── /audit (CSR) ──────→ Audit Engine (pure TS, client-side)
    │                              │
    │                              ▼
    │                     /api/summary (POST)
    │                         Gemini 1.5 Flash
    │                              │
    ├── /results (CSR) ←──── sessionStorage
    │       │
    │       └── /api/audit (POST) ──→ Supabase DB
    │                                   audits table
    │                                   leads table
    │                                   Resend email
    │
    └── /audit/[id] (SSR) ←── Supabase public read
```

## Data Flow

1. **Form → Engine**: User inputs tool data via `SpendForm`. On submit, `runAudit()` runs deterministically client-side.
2. **Engine → AI Summary**: Audit result POSTed to `/api/summary` → Gemini generates narrative.
3. **Both → SessionStorage**: Result + summary cached in browser for results page navigation.
4. **Lead Capture → DB**: Email form POSTs to `/api/audit` → Supabase insert → Resend email.
5. **UUID → Share**: DB returns UUID → shareable `/audit/[id]` URL.
6. **Public Page → SSR**: `/audit/[id]` fetches from Supabase server-side, redacts personal data.

## Key Design Decisions

### No Auth
Value delivery before email capture. The audit runs entirely client-side — Supabase is only touched when a user voluntarily saves their results.

### Deterministic Engine
All savings calculations are rule-based TypeScript, not AI. This ensures:
- Reproducible results
- Testable logic
- No hallucinated savings numbers
- Instant performance

### AI Only for Prose
Gemini is used only to write the audit summary paragraph. It receives structured data and returns narrative text. If Gemini fails, a fallback template activates.

### UUID-based Sharing
Public audit URLs use UUIDs (`/audit/abc-123`) with no personal data in the URL. The DB record's `is_public` flag controls visibility.

### Honeypot Anti-spam
Lead capture form includes a hidden `website_url` field. Bots that fill it get a silent success response — real users never see or interact with this field.

## Security Model

| Concern | Mitigation |
|---|---|
| Secret exposure | All keys in env vars, never client-bundled |
| DB writes | Service role key used server-side only |
| RLS | Public SELECT only on `is_public=true` audits |
| Rate limiting | IP-based in-memory limit on `/api/summary` |
| Spam | Honeypot field on lead form |
| Clickjacking | X-Frame-Options: DENY header |
| MIME sniffing | X-Content-Type-Options: nosniff |

## Performance

- Landing page: Static generation (SSG)
- Results page: Client-side (CSR) — no SSR needed since data is in sessionStorage
- Public audit: Server-side (SSR) with 1-hour revalidation
- Fonts: `next/font` with `display: swap`
- No external image dependencies
