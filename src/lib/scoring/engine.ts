import { AgentRecord, DimensionScore, RiskTier, SignalEvaluation, TrustEvaluationResult } from '../types';
import { DIMENSION_WEIGHTS, MIN_CONFIDENCE_THRESHOLD } from './weights';
import { evaluate20Signals } from './signals';
import { checkCriticalOverrides } from './overrides';

function computeDimensionScore(name: string, signals: SignalEvaluation[], weight: number): DimensionScore {
  const totalWeight = signals.reduce((acc, s) => acc + s.weight, 0);
  const weightedSum = signals.reduce((acc, s) => acc + s.score * s.weight, 0);
  const score = Math.round(weightedSum / totalWeight);

  return {
    name,
    score,
    weight,
    signals,
  };
}

export function evaluateAgentTrust(agent: AgentRecord): TrustEvaluationResult {
  const {
    identitySignals,
    permissionsSignals,
    securitySignals,
    governanceSignals,
    reputationSignals,
  } = evaluate20Signals(agent);

  const dimIdentity = computeDimensionScore('Identity & Provenance', identitySignals, DIMENSION_WEIGHTS.identity);
  const dimPermissions = computeDimensionScore('Permissions & Data', permissionsSignals, DIMENSION_WEIGHTS.permissions);
  const dimSecurity = computeDimensionScore('Security Posture', securitySignals, DIMENSION_WEIGHTS.security);
  const dimGovernance = computeDimensionScore('Behavior & Governance', governanceSignals, DIMENSION_WEIGHTS.governance);
  const dimReputation = computeDimensionScore('Reputation & Incidents', reputationSignals, DIMENSION_WEIGHTS.reputation);

  // 1. Raw Weighted Score
  const rawWeightedScore = Math.round(
    dimIdentity.score * DIMENSION_WEIGHTS.identity +
    dimPermissions.score * DIMENSION_WEIGHTS.permissions +
    dimSecurity.score * DIMENSION_WEIGHTS.security +
    dimGovernance.score * DIMENSION_WEIGHTS.governance +
    dimReputation.score * DIMENSION_WEIGHTS.reputation
  );

  // 2. Confidence Calculation
  const allSignals = [
    ...identitySignals,
    ...permissionsSignals,
    ...securitySignals,
    ...governanceSignals,
    ...reputationSignals,
  ];

  const verifiedCount = allSignals.filter(s => s.isVerified && s.status !== 'unknown').length;
  const confidence = Math.round((verifiedCount / allSignals.length) * 100);

  // 3. Confidence penalty bound (Missing info shouldn't mean safe)
  let boundedScore = rawWeightedScore;
  if (confidence < MIN_CONFIDENCE_THRESHOLD) {
    const maxAllowed = Math.round(50 + (confidence * 0.5));
    if (boundedScore > maxAllowed) {
      boundedScore = maxAllowed;
    }
  }

  // 4. Critical Severity Overrides
  const override = checkCriticalOverrides(agent);
  let finalScore = boundedScore;
  if (override && override.triggered) {
    if (finalScore > override.cappedScore) {
      finalScore = override.cappedScore;
    }
  }

  // 5. Risk Tier Determination
  let riskTier: RiskTier = 'LOW_RISK';
  if (override && override.severity === 'CRITICAL_RISK') {
    riskTier = 'CRITICAL_RISK';
  } else if (finalScore >= 80) {
    riskTier = 'LOW_RISK';
  } else if (finalScore >= 60) {
    riskTier = 'MEDIUM_RISK';
  } else if (finalScore >= 40) {
    riskTier = 'HIGH_RISK';
  } else {
    riskTier = 'CRITICAL_RISK';
  }

  // 6. Signal Aggregations for Explainability
  const positiveSignals: string[] = [];
  const riskSignals: string[] = [];
  const unknownSignals: string[] = [];

  allSignals.forEach(sig => {
    if (sig.status === 'passed') {
      positiveSignals.push(`${sig.name}: ${sig.evidence}`);
    } else if (sig.status === 'failed') {
      riskSignals.push(`${sig.name} (High Risk): ${sig.evidence}`);
    } else if (sig.status === 'warning') {
      riskSignals.push(`${sig.name}: ${sig.evidence}`);
    } else {
      unknownSignals.push(`${sig.name}: Unverified telemetry`);
    }
  });

  // 7. Plain-English Summary Generation
  let summaryReasoning = `TRUSTY Score: ${finalScore} because we found ${positiveSignals.length} positive signals, ${unknownSignals.length} unverified signals, and ${riskSignals.length} risk indicators.`;
  if (override && override.triggered) {
    summaryReasoning += ` CRITICAL OVERRIDE ENFORCED: ${override.reason}`;
  } else if (confidence < MIN_CONFIDENCE_THRESHOLD) {
    summaryReasoning += ` Confidence is restricted to ${confidence}% due to missing verification data.`;
  } else if (finalScore >= 80) {
    summaryReasoning += ` The agent demonstrates robust least-privilege alignment, verified publisher credentials, and tamper-resistant logging.`;
  } else if (finalScore >= 60) {
    summaryReasoning += ` The agent is generally functional but presents elevated permission requirements or minor telemetry opacity.`;
  } else {
    summaryReasoning += ` High risk exposure detected due to excessive permission scope and unverified execution boundaries.`;
  }

  return {
    agentId: agent.id,
    agentName: agent.name,
    trustyScore: finalScore,
    rawWeightedScore,
    riskTier,
    confidence,
    lastEvaluated: new Date().toISOString(),
    dimensions: {
      identity: dimIdentity,
      permissions: dimPermissions,
      security: dimSecurity,
      governance: dimGovernance,
      reputation: dimReputation,
    },
    overrideApplied: override || undefined,
    positiveSignals,
    riskSignals,
    unknownSignals,
    summaryReasoning,
  };
}
