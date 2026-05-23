# Pricing Data — AI Spend Audit

Last updated: May 2026

> Prices are sourced from public pricing pages. Verify before major decisions.

## Cursor

| Plan | Price/seat/mo | Min Seats |
|---|---|---|
| Hobby | $0 | 1 |
| Pro | $20 | 1 |
| Business | $40 | 1 |

Source: https://cursor.com/pricing

## GitHub Copilot

| Plan | Price/seat/mo | Min Seats |
|---|---|---|
| Individual | $10 | 1 |
| Business | $19 | 1 |
| Enterprise | $39 | 1 |

Source: https://github.com/features/copilot

## Claude (Anthropic)

| Plan | Price/seat/mo | Min Seats |
|---|---|---|
| Free | $0 | 1 |
| Pro | $20 | 1 |
| Team | $25 | 5 |
| Enterprise | Custom | — |

Source: https://claude.ai/upgrade

## ChatGPT (OpenAI)

| Plan | Price/seat/mo | Min Seats |
|---|---|---|
| Free | $0 | 1 |
| Plus | $20 | 1 |
| Team | $25 | 2 |
| Enterprise | ~$60 | 150 |

Source: https://openai.com/chatgpt/pricing

## Gemini (Google)

| Plan | Price/seat/mo | Min Seats |
|---|---|---|
| Free | $0 | 1 |
| Advanced | $19.99 | 1 |
| Business (Workspace) | $30 | 1 |

Source: https://one.google.com/about/plans

## Windsurf (Codeium)

| Plan | Price/seat/mo | Min Seats |
|---|---|---|
| Free | $0 | 1 |
| Pro | $15 | 1 |
| Teams | $35 | 5 |

Source: https://windsurf.com/pricing

## OpenAI API

Pay-as-you-go — no fixed seat cost. Audit based on reported monthly spend.

## Anthropic API

Pay-as-you-go — no fixed seat cost. Audit based on reported monthly spend.

---

## Update Process

When pricing changes:
1. Update `src/data/pricing.ts`
2. Update this document
3. Review audit rules in `src/engine/audit.ts` — savings calculations may need adjustment
4. Run `npm test` to verify test expectations still hold
