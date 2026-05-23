# Tests — AI Spend Audit

## Test Suite: `src/tests/audit.test.ts`

Run with: `npm test`

### Coverage

| Test | Description | Expected |
|---|---|---|
| ChatGPT Team → Plus | 2 users on Team plan | Downgrade rec, $10/mo savings |
| Cursor Business → Pro | Solo dev on Business | Downgrade rec, $20/mo savings |
| Copilot Enterprise → Business | 5-person team | Downgrade rec, $100/mo savings |
| 3 coding tools | Cursor + Copilot + Windsurf | Consolidation rec |
| 3 general AI tools | ChatGPT + Claude + Gemini | Consolidation rec |
| Efficient stack | Solo on Cursor Pro | `isEfficient: true`, no recs |
| Annual savings | Any savings scenario | `annualSavings === monthlySavings × 12` |
| Optimized spend | Any scenario | `optimizedMonthlySpend >= 0` |
| Savings % bounds | Any scenario | `0 <= savingsPercentage <= 100` |

### Running Tests

```bash
npm test              # single run
npm run test:watch    # watch mode for development
```

### Adding Tests

Test files go in `src/tests/`. Follow the Vitest describe/it/expect pattern.
The audit engine is pure TypeScript with no side effects — easy to unit test.

### Philosophy

- Test the audit **engine** rules exhaustively (business logic)
- Don't test UI components — test behavior, not implementation
- Each rule gets its own test case
- Edge cases: 0-spend tools, 1-seat business plans, max-seat enterprise
