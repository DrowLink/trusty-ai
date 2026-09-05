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

export interface AgentWithScore extends AgentRecord {
  evaluation: TrustEvaluationResult;
}

export interface DiscoveryStats {
  totalAgents: number;
  avgTrustScore: number;
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
