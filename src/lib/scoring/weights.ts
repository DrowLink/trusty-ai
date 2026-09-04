export const DIMENSION_WEIGHTS = {
  permissions: 0.30, // 30% - Authorization and least-privilege are the highest risk vector
  identity: 0.25,    // 25% - Provenance, author accountability, signing
  security: 0.25,    // 25% - Sandboxing, secret storage, injection resistance
  governance: 0.10,  // 10% - Audit trails, human-in-the-loop gates
  reputation: 0.10,  // 10% - Public incident history and community adoption
} as const;

export const CONFIDENCE_WEIGHTS = {
  verifiedSignalValue: 1.0,
  inferredSignalValue: 0.5,
  unknownSignalValue: 0.0,
};

export const MIN_CONFIDENCE_THRESHOLD = 60; // Below this %, we bound maximum allowable trust score
