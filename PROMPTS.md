# Prompts — AI Spend Audit

## Gemini Audit Summary Prompt

Used in: `src/lib/gemini.ts`

```
You are a concise B2B SaaS analyst. Write an 80–120 word professional audit summary for a startup spending $[X]/month on AI tools.

Tools audited: [toolId (N seats, $X/mo), ...]
Team size: [N]
Use case: [coding|writing|research|data-analysis|mixed]
Monthly savings opportunity: $[X]
Annual savings opportunity: $[X]
Key findings: [reasoning1]; [reasoning2]; ...

Write 2–3 short paragraphs. Be direct and specific. Mention actual dollar amounts. No marketing hype. No bullet points. Professional tone similar to a CFO briefing.
```

### Tone Guidelines
- DO: "Your team is paying $X for Y when Z would suffice at $A."
- DO: Mention specific dollar amounts
- DO: Reference the use case and team size
- DON'T: Use phrases like "revolutionize", "game-changing", "leverage synergies"
- DON'T: Be vague ("you could save money")
- DON'T: Use bullet points

### Fallback Template (no AI)

High-savings version:
> Your team is spending $[X]/month on AI tools, but our audit found $[savings]/month in potential savings — that's $[annual] annually. [Top recommendation reasoning]. With [N] optimizations identified, your team could reduce AI spend by [%]% without losing any meaningful capability.

Efficient version:
> Your AI tool stack of $[X]/month is well-optimized for a [N]-person team focused on [useCase]. Your current plan selections align with your team size and usage patterns. No significant inefficiencies were detected in your current configuration.
