// ============================================================
// AI Spend Audit — Core Type Definitions
// ============================================================

export type ToolId =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'openai-api'
  | 'anthropic-api'
  | 'gemini'
  | 'windsurf';

export type PrimaryUseCase =
  | 'coding'
  | 'writing'
  | 'research'
  | 'data-analysis'
  | 'mixed';

export type RecommendationType =
  | 'downgrade'
  | 'consolidate'
  | 'alternative'
  | 'efficient'
  | 'upgrade';

export type ConfidenceScore = 'high' | 'medium' | 'low';

// ─── Pricing Data ───────────────────────────────────────────

export interface Plan {
  id: string;
  name: string;
  pricePerSeat: number; // monthly, per seat
  minSeats: number;
  maxSeats?: number; // undefined = unlimited
  features: string[];
  isPopular?: boolean;
}

export interface Tool {
  id: ToolId;
  name: string;
  category: 'coding' | 'writing' | 'general' | 'api';
  plans: Plan[];
  logoUrl?: string;
  website: string;
  description: string;
}

// ─── Audit Input ────────────────────────────────────────────

export interface AuditEntry {
  toolId: ToolId;
  planId: string;
  seats: number;
  monthlySpend: number; // user-reported actual spend
}

export interface AuditInput {
  tools: AuditEntry[];
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
}

// ─── Audit Output ───────────────────────────────────────────

export interface Recommendation {
  toolId: ToolId;
  toolName: string;
  type: RecommendationType;
  currentPlanName: string;
  suggestedPlanName: string;
  currentMonthlyCost: number;
  suggestedMonthlyCost: number;
  savingsAmount: number;
  reasoning: string;
  confidence: ConfidenceScore;
  alternativeToolId?: ToolId;
}

export interface AuditResult {
  id?: string; // UUID, assigned after DB save
  input: AuditInput;
  recommendations: Recommendation[];
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  savingsPercentage: number;
  isEfficient: boolean;
  generatedAt: string; // ISO timestamp
}

// ─── Database Records ───────────────────────────────────────

export interface AuditRecord {
  id: string;
  created_at: string;
  tools: AuditEntry[];
  team_size: number;
  use_case: PrimaryUseCase;
  current_monthly: number;
  optimized_monthly: number;
  monthly_savings: number;
  annual_savings: number;
  recommendations: Recommendation[];
  summary: string | null;
  is_public: boolean;
}

export interface Lead {
  id?: string;
  audit_id: string;
  email: string;
  company?: string;
  role?: string;
  team_size?: string;
  created_at?: string;
}

// ─── Form State ─────────────────────────────────────────────

export interface SpendFormData {
  tools: AuditEntry[];
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
}

export interface LeadFormData {
  email: string;
  company: string;
  role: string;
  teamSize: string;
  // Honeypot
  website_url?: string;
}

// ─── API Responses ──────────────────────────────────────────

export interface SummaryResponse {
  summary: string;
  isFallback: boolean;
}

export interface SaveAuditResponse {
  id: string;
  success: boolean;
}
