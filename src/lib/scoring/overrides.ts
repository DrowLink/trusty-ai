import { AgentRecord, CriticalOverride } from '../types';

export function checkCriticalOverrides(agent: AgentRecord): CriticalOverride | null {
  // 1. Confirmed malware or hidden exfiltration
  if (agent.hasMalwareHistory) {
    return {
      triggered: true,
      rule: 'OVERRIDE_MALWARE_CONFIRMED',
      severity: 'CRITICAL_RISK',
      cappedScore: 0,
      reason: 'Agent or associated binary flagged for confirmed malware, hidden payload, or reverse shell telemetry.',
    };
  }

  // 2. Credential dumping or plain-text private key exfiltration
  if (agent.hasCredentialStealRisk) {
    return {
      triggered: true,
      rule: 'OVERRIDE_CREDENTIAL_THEFT',
      severity: 'CRITICAL_RISK',
      cappedScore: 10,
      reason: 'Agent requests access to local secret stores, private keys, or credentials without KMS/vault encryption.',
    };
  }

  // 3. Unsandboxed arbitrary execution without human-in-the-loop gates
  const hasTerminalExec = agent.requestedPermissions.some(p => 
    p.scope.includes('terminal') || p.scope.includes('shell') || p.scope.includes('bash:execute')
  );
  if (hasTerminalExec && !agent.isSandboxed && !agent.requiresHumanApproval) {
    return {
      triggered: true,
      rule: 'OVERRIDE_UNSANDBOXED_EXEC',
      severity: 'CRITICAL_RISK',
      cappedScore: 25,
      reason: 'Agent possesses arbitrary bare-metal host shell execution without isolation sandbox and without human approval gating.',
    };
  }

  // 4. Critical Scope Mismatch: Calendar/Productivity requesting financial or cloud root credentials
  const hasFinancialScope = agent.requestedPermissions.some(p => 
    p.scope.includes('stripe') || p.scope.includes('bank') || p.scope.includes('aws:root') || p.scope.includes('finance')
  );
  if (agent.category === 'productivity' && hasFinancialScope) {
    return {
      triggered: true,
      rule: 'OVERRIDE_DISPROPORTIONATE_SCOPE',
      severity: 'HIGH_RISK',
      cappedScore: 35,
      reason: 'Severe purpose mismatch: Stated purpose is productivity assistant, but requests access to financial accounts or root cloud credentials.',
    };
  }

  // 5. Anonymous Publisher + Full Unrestricted Host Filesystem Write
  const hasUnrestrictedFs = agent.requestedPermissions.some(p => 
    p.scope.includes('fs:root_write') || p.scope === 'system:admin'
  );
  if (agent.publisher.identityType === 'anonymous' && hasUnrestrictedFs) {
    return {
      triggered: true,
      rule: 'OVERRIDE_ANON_ADMIN_PRIVILEGE',
      severity: 'HIGH_RISK',
      cappedScore: 40,
      reason: 'Unverified anonymous author requesting root filesystem write access or system administration privileges.',
    };
  }

  return null;
}
