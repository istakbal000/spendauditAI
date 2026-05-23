'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOOLS, getDefaultPlan } from '@/data/pricing';
import type { AuditEntry, ToolId } from '@/types';

interface ToolSelectorProps {
  selectedToolIds: ToolId[];
  onAdd: (entry: AuditEntry) => void;
}

export default function ToolSelector({ selectedToolIds, onAdd }: ToolSelectorProps) {
  const [open, setOpen] = useState(false);

  const availableTools = TOOLS.filter((t) => !selectedToolIds.includes(t.id));

  const categoryGroups = [
    { label: 'Coding Assistants', category: 'coding' },
    { label: 'General AI', category: 'general' },
    { label: 'API Access', category: 'api' },
  ];

  const handleAdd = (toolId: ToolId) => {
    const tool = TOOLS.find((t) => t.id === toolId);
    const defaultPlan = getDefaultPlan(toolId);
    if (!tool || !defaultPlan) return;

    onAdd({
      toolId,
      planId: defaultPlan.id,
      seats: 1,
      monthlySpend: defaultPlan.pricePerSeat,
    });
    setOpen(false);
  };

  if (availableTools.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/15 hover:border-indigo-500/40 hover:bg-indigo-500/5 text-slate-400 hover:text-indigo-300 transition-all duration-200 text-sm font-medium"
      >
        <Plus size={16} />
        Add another tool
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 z-20 glass-card rounded-2xl p-3 border border-indigo-500/20 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select a tool to add
              </span>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/5 rounded text-slate-400">
                <X size={14} />
              </button>
            </div>

            {categoryGroups.map((group) => {
              const tools = availableTools.filter((t) => t.category === group.category);
              if (tools.length === 0) return null;
              return (
                <div key={group.category} className="mb-3">
                  <p className="text-xs text-slate-600 uppercase tracking-wider px-2 mb-1.5">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {tools.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => handleAdd(tool.id)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm',
                          'bg-white/[0.03] hover:bg-indigo-500/10 hover:text-indigo-300',
                          'border border-white/5 hover:border-indigo-500/20',
                          'text-slate-300 transition-all duration-150'
                        )}
                      >
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-600/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                          {tool.name[0]}
                        </span>
                        {tool.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
