'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import type { AuditResult } from '@/types';

interface SavingsChartProps {
  result: AuditResult;
}

const COLORS = ['#6366f1', '#10b981', '#7c3aed', '#f59e0b', '#38bdf8', '#f43f5e'];

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-3 text-sm border border-indigo-500/20">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function SavingsChart({ result }: SavingsChartProps) {
  const { recommendations, currentMonthlySpend, optimizedMonthlySpend } = result;

  // Bar chart data: Before vs After per tool
  const barData = recommendations
    .filter((r) => r.savingsAmount > 0)
    .slice(0, 6)
    .map((r) => ({
      name: r.toolName.length > 10 ? r.toolName.slice(0, 10) + '…' : r.toolName,
      Before: r.currentMonthlyCost,
      After: r.suggestedMonthlyCost,
    }));

  // Pie chart data: spend breakdown
  const pieData = result.input.tools
    .filter((t) => t.monthlySpend > 0)
    .map((t, i) => ({
      name: t.toolId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      value: t.monthlySpend,
      fill: COLORS[i % COLORS.length],
    }));

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Before/After Bar Chart */}
      {barData.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">
            Before vs After — Per Tool
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={4} barCategoryGap="30%">
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="Before" fill="#6366f1" radius={[4, 4, 0, 0]} name="Current" />
                <Bar dataKey="After" fill="#10b981" radius={[4, 4, 0, 0]} name="Optimized" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-5 mt-4 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" /> Current
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Optimized
            </span>
          </div>
        </div>
      )}

      {/* Spend Breakdown Pie */}
      {pieData.length > 1 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">
            Current Spend Breakdown
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
