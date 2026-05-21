// ============================================================
// AI Spend Audit — Pricing Data
// Current as of May 2026 (verify and update periodically)
// ============================================================

import type { Tool } from '@/types';

export const TOOLS: Tool[] = [
  // ─── Cursor ──────────────────────────────────────────────
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'coding',
    website: 'https://cursor.com',
    description: 'AI-first code editor with deep codebase understanding.',
    plans: [
      {
        id: 'cursor-free',
        name: 'Hobby',
        pricePerSeat: 0,
        minSeats: 1,
        features: ['2,000 completions/mo', 'Limited fast requests', 'Community support'],
      },
      {
        id: 'cursor-pro',
        name: 'Pro',
        pricePerSeat: 20,
        minSeats: 1,
        features: ['Unlimited completions', '500 fast requests/mo', 'Priority support'],
        isPopular: true,
      },
      {
        id: 'cursor-business',
        name: 'Business',
        pricePerSeat: 40,
        minSeats: 1,
        features: ['Everything in Pro', 'Admin dashboard', 'SSO', 'Centralized billing', 'Policy controls'],
      },
    ],
  },

  // ─── GitHub Copilot ──────────────────────────────────────
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'coding',
    website: 'https://github.com/features/copilot',
    description: 'AI pair programmer integrated into GitHub and major IDEs.',
    plans: [
      {
        id: 'copilot-individual',
        name: 'Individual',
        pricePerSeat: 10,
        minSeats: 1,
        features: ['Code suggestions', 'Chat in IDE', 'CLI integration'],
        isPopular: true,
      },
      {
        id: 'copilot-business',
        name: 'Business',
        pricePerSeat: 19,
        minSeats: 1,
        features: ['Everything in Individual', 'Policy management', 'Audit logs', 'IP indemnity'],
      },
      {
        id: 'copilot-enterprise',
        name: 'Enterprise',
        pricePerSeat: 39,
        minSeats: 1,
        features: ['Everything in Business', 'Personalized to your codebase', 'PR summaries', 'Fine-tuned models'],
      },
    ],
  },

  // ─── Claude (Anthropic) ──────────────────────────────────
  {
    id: 'claude',
    name: 'Claude',
    category: 'general',
    website: 'https://claude.ai',
    description: 'Anthropic\'s AI assistant — great for writing and analysis.',
    plans: [
      {
        id: 'claude-free',
        name: 'Free',
        pricePerSeat: 0,
        minSeats: 1,
        features: ['Limited Claude 3 Sonnet', 'Basic features'],
      },
      {
        id: 'claude-pro',
        name: 'Pro',
        pricePerSeat: 20,
        minSeats: 1,
        features: ['5× more usage', 'Claude 3 Opus', 'Priority access', 'Projects'],
        isPopular: true,
      },
      {
        id: 'claude-team',
        name: 'Team',
        pricePerSeat: 25,
        minSeats: 5,
        features: ['Everything in Pro', 'Higher rate limits', 'Admin console', 'Priority support'],
      },
      {
        id: 'claude-enterprise',
        name: 'Enterprise',
        pricePerSeat: 0, // custom pricing
        minSeats: 1,
        features: ['Custom context window', 'SSO', 'Audit logs', 'SLA'],
      },
    ],
  },

  // ─── ChatGPT ─────────────────────────────────────────────
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'general',
    website: 'https://chat.openai.com',
    description: 'OpenAI\'s flagship conversational AI, widely used across teams.',
    plans: [
      {
        id: 'chatgpt-free',
        name: 'Free',
        pricePerSeat: 0,
        minSeats: 1,
        features: ['GPT-4o mini', 'Limited GPT-4o', 'Basic DALL-E'],
      },
      {
        id: 'chatgpt-plus',
        name: 'Plus',
        pricePerSeat: 20,
        minSeats: 1,
        features: ['GPT-4o', 'Advanced Voice', 'DALL-E 3', 'Custom GPTs'],
        isPopular: true,
      },
      {
        id: 'chatgpt-team',
        name: 'Team',
        pricePerSeat: 25,
        minSeats: 2,
        features: ['Everything in Plus', 'Admin console', 'Higher rate limits', 'Data not used for training'],
      },
      {
        id: 'chatgpt-enterprise',
        name: 'Enterprise',
        pricePerSeat: 60,
        minSeats: 150,
        features: ['Unlimited GPT-4o', 'Custom context', 'SSO', 'Analytics', 'Dedicated support'],
      },
    ],
  },

  // ─── OpenAI API ──────────────────────────────────────────
  {
    id: 'openai-api',
    name: 'OpenAI API',
    category: 'api',
    website: 'https://platform.openai.com',
    description: 'Direct API access to GPT-4o, embeddings, and more.',
    plans: [
      {
        id: 'openai-api-payg',
        name: 'Pay-as-you-go',
        pricePerSeat: 0,
        minSeats: 1,
        features: ['GPT-4o, 3.5-turbo', 'Embeddings', 'Fine-tuning', 'Usage-based billing'],
        isPopular: true,
      },
      {
        id: 'openai-api-tier2',
        name: 'Tier 2',
        pricePerSeat: 0,
        minSeats: 1,
        features: ['Higher rate limits', 'Priority support', 'After $50 spend'],
      },
      {
        id: 'openai-api-enterprise',
        name: 'Enterprise',
        pricePerSeat: 0,
        minSeats: 1,
        features: ['Custom rate limits', 'Private deployment', 'SLA', 'Dedicated support'],
      },
    ],
  },

  // ─── Anthropic API ───────────────────────────────────────
  {
    id: 'anthropic-api',
    name: 'Anthropic API',
    category: 'api',
    website: 'https://console.anthropic.com',
    description: 'Direct API access to Claude 3 family models.',
    plans: [
      {
        id: 'anthropic-api-payg',
        name: 'Pay-as-you-go',
        pricePerSeat: 0,
        minSeats: 1,
        features: ['Claude 3 Haiku, Sonnet, Opus', 'Usage-based billing', 'Rate limits based on tier'],
        isPopular: true,
      },
      {
        id: 'anthropic-api-build',
        name: 'Build',
        pricePerSeat: 0,
        minSeats: 1,
        features: ['Higher rate limits', 'After $25 spend'],
      },
    ],
  },

  // ─── Gemini ──────────────────────────────────────────────
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'general',
    website: 'https://gemini.google.com',
    description: 'Google\'s multimodal AI assistant with deep Google Workspace integration.',
    plans: [
      {
        id: 'gemini-free',
        name: 'Free',
        pricePerSeat: 0,
        minSeats: 1,
        features: ['Gemini 1.5 Flash', 'Basic features', 'Google app integration'],
      },
      {
        id: 'gemini-advanced',
        name: 'Advanced',
        pricePerSeat: 19.99,
        minSeats: 1,
        features: ['Gemini Ultra', '1M token context', 'Google One 2TB storage'],
        isPopular: true,
      },
      {
        id: 'gemini-workspace',
        name: 'Business (Workspace)',
        pricePerSeat: 30,
        minSeats: 1,
        features: ['Gemini in Docs/Sheets/Meet', 'Admin controls', 'Enterprise security'],
      },
    ],
  },

  // ─── Windsurf ────────────────────────────────────────────
  {
    id: 'windsurf',
    name: 'Windsurf',
    category: 'coding',
    website: 'https://windsurf.com',
    description: 'Agentic AI code editor by Codeium with Flow state awareness.',
    plans: [
      {
        id: 'windsurf-free',
        name: 'Free',
        pricePerSeat: 0,
        minSeats: 1,
        features: ['Limited Flows', 'Basic AI features'],
      },
      {
        id: 'windsurf-pro',
        name: 'Pro',
        pricePerSeat: 15,
        minSeats: 1,
        features: ['Unlimited Flows', 'Priority access', 'Advanced models'],
        isPopular: true,
      },
      {
        id: 'windsurf-teams',
        name: 'Teams',
        pricePerSeat: 35,
        minSeats: 5,
        features: ['Everything in Pro', 'Team analytics', 'Admin controls', 'SSO'],
      },
    ],
  },
];

// ─── Helper Functions ────────────────────────────────────────

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}

export function getPlanById(toolId: string, planId: string) {
  const tool = getToolById(toolId);
  return tool?.plans.find((p) => p.id === planId);
}

export function getDefaultPlan(toolId: string) {
  const tool = getToolById(toolId);
  return tool?.plans.find((p) => p.isPopular) ?? tool?.plans[0];
}

export const TOOL_CATEGORIES = {
  coding: TOOLS.filter((t) => t.category === 'coding'),
  general: TOOLS.filter((t) => t.category === 'general'),
  api: TOOLS.filter((t) => t.category === 'api'),
};
