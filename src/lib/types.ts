export type EcosystemSource = 'github' | 'mcp_registry' | 'agent_marketplace' | 'manual_scan';

export type RiskTier = 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK';

export type AgentCategory = 
  | 'productivity' 
  | 'coding' 
  | 'finance' 
  | 'sysadmin' 
  | 'sales_marketing' 
  | 'research';

export type SensitivityLevel = 'low' | 'medium' | 'high' | 'critical';

export type AccessType = 'read_only' | 'read_write' | 'execute_admin';

export interface PermissionScope {
  scope: string; // e.g., 'gmail:read', 'terminal:exec', 'fs:write'
  sensitivity: SensitivityLevel;
  justification?: string;
  isHighRisk?: boolean;
  humanLabel?: string;
  humanImpact?: string;
  detectedVia?: string; // e.g. 'Dependency: subprocess', 'Manifest: mcp.json'
  accessType?: AccessType;
  categoryGroup?: 'system' | 'network' | 'filesystem' | 'database' | 'personal_data' | 'financial' | 'browser' | 'code';
}

export interface AgentPublisher {
  name: string;
  domain?: string;
  verifiedDomain: boolean;
  identityType: 'verified_org' | 'individual' | 'anonymous';
  githubUser?: string;
  reputationScore: number; // 0-100
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  requiresApproval?: boolean;
}

export interface AgentFingerprint {
  fingerprintId: string;
  timestamp: string;
  manifestHash: string;
  toolSchemasHash: string;
  permissionsHash: string;
  dependenciesHash: string;
  isDriftDetected: boolean;
  lastDriftTimestamp?: string;
}

export interface AgentRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: AgentCategory;
  sourceEcosystem: EcosystemSource;
  publisher: AgentPublisher;
  framework: 'mcp' | 'langchain' | 'crewai' | 'autogen' | 'eliza' | 'custom';
  repositoryUrl?: string;
  websiteUrl?: string;
  packageUrl?: string;
  
  // Technical specs
  declaredCapabilities: string[];
  requestedPermissions: PermissionScope[];
  toolsDeclared: ToolDefinition[];
  externalConnections: string[];
  
  // Governance & sandboxing
  hasAuditLogs: boolean;
  requiresHumanApproval: boolean;
  isSandboxed: boolean;
  hasPromptInjectionGuard: boolean;
  hasKnownCVEs: boolean;
  cveCount: number;
  hasMalwareHistory: boolean;
  hasCredentialStealRisk: boolean;
  
  // Community & Telemetry
  starsCount?: number;
  forksCount?: number;
  monthlyUsers?: number;
  lastCommitDate?: string;
  discoveredAt: string;
  
  // Fingerprint
  fingerprint: AgentFingerprint;
}

export interface SignalEvaluation {
  id: string;
  dimensionId: 'identity' | 'permissions' | 'security' | 'governance' | 'reputation';
  name: string;
  score: number; // 0 - 100
  weight: number;
  status: 'passed' | 'warning' | 'failed' | 'unknown';
  evidence: string;
  isVerified: boolean;
}

export interface DimensionScore {
  name: string;
  score: number; // 0 - 100
  weight: number; // e.g. 0.25
  signals: SignalEvaluation[];
}

export interface CriticalOverride {
  triggered: boolean;
  rule: string;
  severity: 'HIGH_RISK' | 'CRITICAL_RISK';
  cappedScore: number;
  reason: string;
}

export interface TrustEvaluationResult {
  agentId: string;
  agentName: string;
  trustyScore: number; // 0 - 100
  rawWeightedScore: number;
  riskTier: RiskTier;
  confidence: number; // 0 - 100%
  lastEvaluated: string;
  
  dimensions: {
    identity: DimensionScore;
    permissions: DimensionScore;
    security: DimensionScore;
    governance: DimensionScore;
    reputation: DimensionScore;
  };
  
  overrideApplied?: CriticalOverride;
  
  positiveSignals: string[];
  riskSignals: string[];
  unknownSignals: string[];
  
  summaryReasoning: string;
}

export type CreditTier = 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'SUBPRIME_D';

export interface PaymentRailConnection {
  rail: 'visa' | 'stripe' | 'plaid' | 'mastercard' | 'brex';
  name: string;
  status: 'simulated_active' | 'certified' | 'restricted';
  networkTier: string;
}

export interface CreditSignal {
  name: string;
  score: number; // 0 - 100
  weight: number;
  status: 'positive' | 'neutral' | 'negative';
  evidence: string;
  publicSource: string;
}

// Day-Zero Underwriting (12 public signals from Slide 4)
export interface DayZeroSignal {
  number: string; // '01' - '12'
  name: string;
  category: 'identity' | 'stability' | 'code' | 'security' | 'governance' | 'reputation';
  subtitle: string;
  score: number; // 0 - 100
  status: 'passed' | 'warning' | 'failed' | 'neutral';
  evidence: string;
  weight: number;
}

// Behavioral Credit File (20 signals from Slide 6)
export interface BehavioralSignal {
  number: string; // '01' - '20'
  name: string;
  category: 'activity' | 'risk_containment' | 'anomalies' | 'track_record';
  currentValue: string;
  benchmark: string;
  status: 'optimal' | 'moderate' | 'high_risk' | 'insufficient_telemetry';
  description: string;
}

export interface AgentCreditProfile {
  creditScore: number; // 0 - 100
  creditTier: CreditTier;
  estimatedDailyCapacity: number; // e.g. 25000 ($25,000 / day)
  humanApprovalThreshold: number; // e.g. 5000 (> $5,000 / txn)
  receiveCapacityDaily: number; // e.g. 100000 ($100,000 / day)
  maxSingleAutonomousTxn: number; // e.g. 5000
  isFinanciallyActive: boolean;
  isFileThin: boolean; // true = Day-Zero Thin File, false = Mature Behavioral File
  confidencePercentage: number; // e.g. 43% for Day-0, 92% for mature
  avudProcessed?: number; // Agentic Volume Under Decision processed
  connectedRails: PaymentRailConnection[];
  signals: CreditSignal[];
  dayZeroSignals: DayZeroSignal[];
  behavioralSignals?: BehavioralSignal[];
  underwritingSummary: string;
}

export interface AgentWithScore extends AgentRecord {
  evaluation: TrustEvaluationResult;
  creditProfile: AgentCreditProfile;
}

// Economic Decision Engine Types (Slide 1 & Slide 5 of PDFs)
export interface EconomicActionRequest {
  agentId: string;
  principal: string; // e.g. 'Acme Corp'
  action: 'Purchase' | 'Transfer' | 'Credit_Disbursement' | 'Contract_Sign' | 'API_Key_Exchange';
  amount: number; // in USD
  merchant: string; // e.g. 'Dell', 'AWS', 'Unknown Merchant'
  category: string; // e.g. 'IT equipment', 'Cloud Infrastructure', 'Travel'
  requestedLimit?: number;
  humanApprovalDeclared?: boolean;
}

export interface PolicyCheckResult {
  rule: string;
  passed: boolean;
  severity: 'blocker' | 'warning' | 'info';
  detail: string;
}

export interface EconomicDecisionResult {
  decision: 'APPROVED' | 'DECLINED' | 'HUMAN_REVIEW';
  statusBadge: string;
  reason: string;
  agentName: string;
  principal: string;
  action: string;
  amount: number;
  merchant: string;
  category: string;
  clearingRail: string;
  avudAllocated: number;
  riskTier: RiskTier;
  policyChecks: PolicyCheckResult[];
  recommendedSpendingCapacity: number;
  humanApprovalThreshold: number;
  timestamp: string;
  telemetryIngested: boolean;
}

export type ActiveProductTab = 
  | 'bureau' 
  | 'economics' 
  | 'decision_api' 
  | 'underwriting' 
  | 'pricing' 
  | 'moat';

export interface DiscoveryStats {
  totalAgents: number;
  avgTrustScore: number;
  avgCreditScore?: number;
  totalDailyCapacity?: number;
  totalAVUD?: number; // Total Agentic Volume Under Decision
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  criticalRiskCount: number;
  ecosystemCounts: {
    github: number;
    mcp_registry: number;
    agent_marketplace: number;
    manual_scan: number;
  };
}

