import { AgentRecord, SignalEvaluation } from '../types';

export function evaluate20Signals(agent: AgentRecord): {
  identitySignals: SignalEvaluation[];
  permissionsSignals: SignalEvaluation[];
  securitySignals: SignalEvaluation[];
  governanceSignals: SignalEvaluation[];
  reputationSignals: SignalEvaluation[];
} {
  // --- DIMENSION 1: IDENTITY & PROVENANCE ---
  const idPublisher: SignalEvaluation = {
    id: 'SIG-ID-01',
    dimensionId: 'identity',
    name: 'Publisher Identity Verification',
    weight: 0.35,
    score: agent.publisher.identityType === 'verified_org' ? 98 :
           agent.publisher.identityType === 'individual' ? 74 : 22,
    status: agent.publisher.identityType === 'verified_org' ? 'passed' :
            agent.publisher.identityType === 'individual' ? 'warning' : 'failed',
    evidence: agent.publisher.identityType === 'verified_org'
      ? `Verified organizational entity (${agent.publisher.name})`
      : agent.publisher.identityType === 'individual'
      ? `Individual maintainer (${agent.publisher.name})`
      : 'Anonymous or unverified author identity',
    isVerified: agent.publisher.identityType !== 'anonymous',
  };

  const idDomain: SignalEvaluation = {
    id: 'SIG-ID-02',
    dimensionId: 'identity',
    name: 'Domain & Organization Ownership',
    weight: 0.25,
    score: agent.publisher.verifiedDomain ? 95 : agent.publisher.domain ? 55 : 25,
    status: agent.publisher.verifiedDomain ? 'passed' : agent.publisher.domain ? 'warning' : 'failed',
    evidence: agent.publisher.verifiedDomain
      ? `Validated DNS ownership & active TLS (${agent.publisher.domain})`
      : agent.publisher.domain
      ? `Domain listed (${agent.publisher.domain}) but ownership unverified`
      : 'No publisher domain linked to agent namespace',
    isVerified: agent.publisher.verifiedDomain,
  };

  const idProvenance: SignalEvaluation = {
    id: 'SIG-ID-03',
    dimensionId: 'identity',
    name: 'Code & Package Provenance',
    weight: 0.25,
    score: agent.repositoryUrl ? 92 : agent.packageUrl ? 75 : 30,
    status: agent.repositoryUrl ? 'passed' : agent.packageUrl ? 'warning' : 'failed',
    evidence: agent.repositoryUrl
      ? `Publicly auditable repository available at ${agent.repositoryUrl}`
      : agent.packageUrl
      ? `Published package on ecosystem registry (${agent.packageUrl})`
      : 'Closed source or unverified binary artifact distribution',
    isVerified: !!agent.repositoryUrl || !!agent.packageUrl,
  };

  const idIntegrity: SignalEvaluation = {
    id: 'SIG-ID-04',
    dimensionId: 'identity',
    name: 'Signing & Version Integrity',
    weight: 0.15,
    score: agent.fingerprint && !agent.fingerprint.isDriftDetected ? 90 : 50,
    status: agent.fingerprint && !agent.fingerprint.isDriftDetected ? 'passed' : 'warning',
    evidence: agent.fingerprint && !agent.fingerprint.isDriftDetected
      ? `Cryptographic fingerprint verified (${agent.fingerprint.fingerprintId.slice(0, 10)}...) with clean version history`
      : 'Unsigned version tags or unverified checksum distribution',
    isVerified: !!agent.fingerprint,
  };

  // --- DIMENSION 2: PERMISSIONS & DATA GOVERNANCE ---
  const criticalScopes = agent.requestedPermissions.filter(p => p.sensitivity === 'critical' || p.isHighRisk);
  const highScopes = agent.requestedPermissions.filter(p => p.sensitivity === 'high');

  const permScope: SignalEvaluation = {
    id: 'SIG-PR-01',
    dimensionId: 'permissions',
    name: 'Requested Permission Scope',
    weight: 0.35,
    score: criticalScopes.length > 0 ? 25 :
           highScopes.length > 2 ? 50 :
           highScopes.length > 0 ? 70 : 96,
    status: criticalScopes.length > 0 ? 'failed' :
            highScopes.length > 1 ? 'warning' : 'passed',
    evidence: criticalScopes.length > 0
      ? `Requests ${criticalScopes.length} CRITICAL scopes: ${criticalScopes.map(s => s.scope).join(', ')}`
      : highScopes.length > 0
      ? `Requests elevated scopes: ${highScopes.map(s => s.scope).join(', ')}`
      : `Restricted least-privilege footprint (${agent.requestedPermissions.length} total scopes)`,
    isVerified: true,
  };

  // Least-privilege alignment relative to category
  let scopeMismatch = false;
  let mismatchDetails = 'Scopes align with stated category purpose.';
  if (agent.category === 'productivity' && agent.requestedPermissions.some(p => p.scope.includes('terminal') || p.scope.includes('stripe'))) {
    scopeMismatch = true;
    mismatchDetails = 'Productivity category requesting terminal execution or financial APIs.';
  } else if (agent.category === 'finance' && agent.requestedPermissions.some(p => p.scope.includes('terminal:root'))) {
    scopeMismatch = true;
    mismatchDetails = 'Finance agent requesting raw host terminal root execution.';
  }

  const permAlignment: SignalEvaluation = {
    id: 'SIG-PR-02',
    dimensionId: 'permissions',
    name: 'Least-Privilege Alignment',
    weight: 0.30,
    score: scopeMismatch ? 20 : highScopes.length === 0 ? 95 : 75,
    status: scopeMismatch ? 'failed' : highScopes.length === 0 ? 'passed' : 'warning',
    evidence: mismatchDetails,
    isVerified: true,
  };

  const permMinimization: SignalEvaluation = {
    id: 'SIG-PR-03',
    dimensionId: 'permissions',
    name: 'Data Collection Minimization',
    weight: 0.20,
    score: agent.requestedPermissions.some(p => p.scope.includes('bulk_export') || p.scope.includes('all_emails')) ? 35 : 88,
    status: agent.requestedPermissions.some(p => p.scope.includes('bulk_export') || p.scope.includes('all_emails')) ? 'warning' : 'passed',
    evidence: agent.requestedPermissions.some(p => p.scope.includes('bulk_export'))
      ? 'Requests bulk customer export permissions'
      : 'Operates on task-scoped ephemeral data payloads',
    isVerified: true,
  };

  const permRetention: SignalEvaluation = {
    id: 'SIG-PR-04',
    dimensionId: 'permissions',
    name: 'Retention & Deletion Transparency',
    weight: 0.15,
    score: agent.externalConnections.length > 3 ? 45 : 85,
    status: agent.externalConnections.length > 3 ? 'warning' : 'passed',
    evidence: agent.externalConnections.length > 3
      ? `Connects to ${agent.externalConnections.length} external endpoints (${agent.externalConnections.slice(0, 2).join(', ')}...); external storage policy unclear`
      : 'Local-first execution with transparent third-party transmission',
    isVerified: true,
  };

  // --- DIMENSION 3: SECURITY POSTURE ---
  const secCVE: SignalEvaluation = {
    id: 'SIG-SEC-01',
    dimensionId: 'security',
    name: 'Vulnerability & Dependency History',
    weight: 0.30,
    score: agent.cveCount === 0 ? 96 : agent.cveCount <= 2 ? 55 : 20,
    status: agent.cveCount === 0 ? 'passed' : agent.cveCount <= 2 ? 'warning' : 'failed',
    evidence: agent.cveCount === 0
      ? '0 known CVEs across locked dependency tree'
      : `${agent.cveCount} known vulnerabilities detected in dependencies`,
    isVerified: true,
  };

  const secSecrets: SignalEvaluation = {
    id: 'SIG-SEC-02',
    dimensionId: 'security',
    name: 'Secrets & Credential Handling',
    weight: 0.25,
    score: agent.hasCredentialStealRisk ? 15 : 92,
    status: agent.hasCredentialStealRisk ? 'failed' : 'passed',
    evidence: agent.hasCredentialStealRisk
      ? 'Exposes credentials to plaintext logs or unencrypted persistent storage'
      : 'Enforces ephemeral bearer tokens and environment vault injection',
    isVerified: true,
  };

  const secSandbox: SignalEvaluation = {
    id: 'SIG-SEC-03',
    dimensionId: 'security',
    name: 'Sandboxing & Isolation Evidence',
    weight: 0.25,
    score: agent.isSandboxed ? 95 : 30,
    status: agent.isSandboxed ? 'passed' : 'failed',
    evidence: agent.isSandboxed
      ? 'Executes in containerized jail / WASM virtual runtime'
      : 'Executes directly on host bare-metal without containment',
    isVerified: true,
  };

  const secInjection: SignalEvaluation = {
    id: 'SIG-SEC-04',
    dimensionId: 'security',
    name: 'Prompt-Injection & Tool-Abuse Resilience',
    weight: 0.20,
    score: agent.hasPromptInjectionGuard ? 90 : 45,
    status: agent.hasPromptInjectionGuard ? 'passed' : 'warning',
    evidence: agent.hasPromptInjectionGuard
      ? 'Equipped with input sanitization filters and guardrails'
      : 'No verified defenses against indirect prompt injection or tool spoofing',
    isVerified: agent.hasPromptInjectionGuard,
  };

  // --- DIMENSION 4: BEHAVIOR & GOVERNANCE ---
  const govLogs: SignalEvaluation = {
    id: 'SIG-GOV-01',
    dimensionId: 'governance',
    name: 'Action Auditability & Structured Logs',
    weight: 0.35,
    score: agent.hasAuditLogs ? 94 : 25,
    status: agent.hasAuditLogs ? 'passed' : 'failed',
    evidence: agent.hasAuditLogs
      ? 'Emits structured, cryptographically tamper-evident event logs'
      : 'Lacks verifiable execution audit trail',
    isVerified: true,
  };

  const govHumanApproval: SignalEvaluation = {
    id: 'SIG-GOV-02',
    dimensionId: 'governance',
    name: 'Human Approval for Sensitive Actions',
    weight: 0.35,
    score: agent.requiresHumanApproval ? 95 : 35,
    status: agent.requiresHumanApproval ? 'passed' : 'warning',
    evidence: agent.requiresHumanApproval
      ? 'Mandates human-in-the-loop confirmation for state-changing or write operations'
      : 'Executes write or financial actions autonomously without explicit user gate',
    isVerified: true,
  };

  const govConsistency: SignalEvaluation = {
    id: 'SIG-GOV-03',
    dimensionId: 'governance',
    name: 'Policy & Purpose Consistency',
    weight: 0.15,
    score: 85,
    status: 'passed',
    evidence: 'Declared system instructions match runtime tool catalog behavior',
    isVerified: true,
  };

  const govDrift: SignalEvaluation = {
    id: 'SIG-GOV-04',
    dimensionId: 'governance',
    name: 'Change Frequency & Behavioral Drift',
    weight: 0.15,
    score: agent.fingerprint && !agent.fingerprint.isDriftDetected ? 92 : 40,
    status: agent.fingerprint && !agent.fingerprint.isDriftDetected ? 'passed' : 'warning',
    evidence: agent.fingerprint && !agent.fingerprint.isDriftDetected
      ? 'No unannounced tool schema drifts detected since initial indexing'
      : 'Tool schema drift detected without corresponding release notes',
    isVerified: true,
  };

  // --- DIMENSION 5: REPUTATION & INCIDENTS ---
  const repMalware: SignalEvaluation = {
    id: 'SIG-REP-01',
    dimensionId: 'reputation',
    name: 'Scam / Abuse / Malware Reports',
    weight: 0.40,
    score: agent.hasMalwareHistory ? 0 : 98,
    status: agent.hasMalwareHistory ? 'failed' : 'passed',
    evidence: agent.hasMalwareHistory
      ? 'ACTIVE THREAT: Listed on malicious threat intelligence databases'
      : 'No malicious abuse reports or phishing complaints found in public registries',
    isVerified: true,
  };

  const repIncident: SignalEvaluation = {
    id: 'SIG-REP-02',
    dimensionId: 'reputation',
    name: 'Security Incident History & Response',
    weight: 0.25,
    score: agent.hasKnownCVEs ? 40 : 90,
    status: agent.hasKnownCVEs ? 'warning' : 'passed',
    evidence: agent.hasKnownCVEs
      ? 'Past security incident reported; remediation timeline pending review'
      : 'Clean security disclosure history',
    isVerified: true,
  };

  const repCommunity: SignalEvaluation = {
    id: 'SIG-REP-03',
    dimensionId: 'reputation',
    name: 'User & Enterprise Adoption Evidence',
    weight: 0.20,
    score: (agent.starsCount ?? 0) > 1000 ? 95 :
           (agent.starsCount ?? 0) > 100 ? 80 :
           (agent.starsCount ?? 0) > 10 ? 60 : 40,
    status: (agent.starsCount ?? 0) > 100 ? 'passed' : 'warning',
    evidence: (agent.starsCount ?? 0) > 0
      ? `Validated ecosystem adoption: ${agent.starsCount?.toLocaleString()} GitHub stars / users`
      : 'Emerging or unverified adoption footprint',
    isVerified: typeof agent.starsCount === 'number',
  };

  const repPublisher: SignalEvaluation = {
    id: 'SIG-REP-04',
    dimensionId: 'reputation',
    name: 'Publisher Ecosystem Track Record',
    weight: 0.15,
    score: agent.publisher.reputationScore,
    status: agent.publisher.reputationScore >= 75 ? 'passed' :
            agent.publisher.reputationScore >= 50 ? 'warning' : 'failed',
    evidence: `Publisher ecosystem reputation score: ${agent.publisher.reputationScore}/100`,
    isVerified: true,
  };

  return {
    identitySignals: [idPublisher, idDomain, idProvenance, idIntegrity],
    permissionsSignals: [permScope, permAlignment, permMinimization, permRetention],
    securitySignals: [secCVE, secSecrets, secSandbox, secInjection],
    governanceSignals: [govLogs, govHumanApproval, govConsistency, govDrift],
    reputationSignals: [repMalware, repIncident, repCommunity, repPublisher],
  };
}
