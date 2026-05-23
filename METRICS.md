# Metrics — AI Spend Audit

## North Star Metric

**Number of audits completed per week** — reflects product value delivery.

## Key Metrics to Track

### Acquisition
| Metric | Target | Source |
|---|---|---|
| Weekly visitors | — | Vercel Analytics |
| Landing → Audit conversion | >35% | Custom event |
| Traffic source breakdown | — | Vercel Analytics |

### Activation
| Metric | Target | Source |
|---|---|---|
| Audit completion rate | >80% | Custom event |
| Avg tools per audit | — | Supabase query |
| Avg savings found | — | Supabase query |
| Time to complete form | <90s | Custom event |

### Retention / Virality
| Metric | Target | Source |
|---|---|---|
| Share link click rate | >15% | Custom event |
| Return visitors | — | Vercel Analytics |

### Monetization
| Metric | Target | Source |
|---|---|---|
| Email capture rate | >25% | Supabase leads count |
| High-savings audit rate | — | Supabase query |
| Consultation booked rate | >8% | Manual / CRM |

## Supabase Queries for Key Metrics

```sql
-- Total audits this week
SELECT COUNT(*) FROM audits
WHERE created_at > NOW() - INTERVAL '7 days';

-- Average monthly savings found
SELECT AVG(monthly_savings) FROM audits
WHERE monthly_savings > 0;

-- High-savings audits (>$500/mo)
SELECT COUNT(*) FROM audits
WHERE monthly_savings > 500
AND created_at > NOW() - INTERVAL '30 days';

-- Lead capture rate
SELECT
  COUNT(DISTINCT l.id)::float / COUNT(DISTINCT a.id) AS lead_rate
FROM audits a
LEFT JOIN leads l ON l.audit_id = a.id
WHERE a.created_at > NOW() - INTERVAL '30 days';
```
