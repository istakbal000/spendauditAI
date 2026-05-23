# Reflection — AI Spend Audit

## What Went Well

- **Value-first UX** — Running the full audit client-side before asking for email is the right call. It eliminates friction and builds trust.
- **Deterministic engine** — Using pure rule-based logic for calculations means every recommendation is explainable, testable, and trustworthy. No AI hallucinations in the numbers.
- **Tailwind v4** — The new `@import "tailwindcss"` approach is cleaner than a config file, though it required adjusting from training data defaults.
- **Modular architecture** — Separating pricing data, engine logic, and API routes made each piece independently testable and readable.

## What Could Be Better

- **Pricing freshness** — Hardcoded pricing data goes stale. A future version should either scrape pricing pages or allow user correction.
- **API tools audit depth** — OpenAI API and Anthropic API savings are hard to calculate without usage data (tokens consumed). Currently relies on user-reported spend.
- **No usage trends** — The audit is a point-in-time snapshot. Monthly trend tracking would be much more valuable.

## If Building This From Scratch Again

1. Start with the audit engine tests first (TDD) — the rules are clear enough to specify upfront
2. Design the data schema before the UI — the `AuditResult` type shapes everything
3. Consider a separate pricing CMS instead of hardcoded data from day one

## Open Questions

- Should users be able to upload invoices/receipts for auto-parsing?
- Is the email capture friction worth the benefit, or should sharing be frictionless?
- What's the right monetization model — consultation lead gen, or subscription?
