// Quota & Session Management (VirusTotal style)

const QUOTA_STORAGE_KEY = 'trusty_free_queries_remaining';
const AUTH_USER_KEY = 'trusty_authenticated_user';
const MAX_FREE_QUERIES = 3;

export interface UserSession {
  email: string | null;
  isAuthenticated: boolean;
  queriesRemaining: number;
  maxQueries: number;
  tier: 'anonymous' | 'community' | 'enterprise';
}

export function getUserSession(): UserSession {
  if (typeof window === 'undefined') {
    return {
      email: null,
      isAuthenticated: false,
      queriesRemaining: MAX_FREE_QUERIES,
      maxQueries: MAX_FREE_QUERIES,
      tier: 'anonymous',
    };
  }

  const email = localStorage.getItem(AUTH_USER_KEY);
  const isAuthenticated = !!email;

  if (isAuthenticated) {
    return {
      email,
      isAuthenticated: true,
      queriesRemaining: 999,
      maxQueries: 999,
      tier: 'community',
    };
  }

  const storedQuota = localStorage.getItem(QUOTA_STORAGE_KEY);
  const parsed = storedQuota !== null ? parseInt(storedQuota, 10) : MAX_FREE_QUERIES;
  const queriesRemaining = isNaN(parsed) ? MAX_FREE_QUERIES : Math.min(parsed, MAX_FREE_QUERIES);

  return {
    email: null,
    isAuthenticated: false,
    queriesRemaining,
    maxQueries: MAX_FREE_QUERIES,
    tier: 'anonymous',
  };
}

export function decrementQueryQuota(): { allowed: boolean; remaining: number } {
  if (typeof window === 'undefined') {
    return { allowed: true, remaining: MAX_FREE_QUERIES };
  }

  const session = getUserSession();
  if (session.isAuthenticated) {
    return { allowed: true, remaining: 999 };
  }

  if (session.queriesRemaining <= 0) {
    return { allowed: false, remaining: 0 };
  }

  const newCount = session.queriesRemaining - 1;
  localStorage.setItem(QUOTA_STORAGE_KEY, newCount.toString());
  return { allowed: true, remaining: newCount };
}

export function authenticateWithEmail(email: string): UserSession {
  if (typeof window === 'undefined') {
    return {
      email,
      isAuthenticated: true,
      queriesRemaining: 999,
      maxQueries: 999,
      tier: 'community',
    };
  }

  localStorage.setItem(AUTH_USER_KEY, email);
  localStorage.removeItem(QUOTA_STORAGE_KEY);

  return {
    email,
    isAuthenticated: true,
    queriesRemaining: 999,
    maxQueries: 999,
    tier: 'community',
  };
}

export function signOutUserSession(): UserSession {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.setItem(QUOTA_STORAGE_KEY, MAX_FREE_QUERIES.toString());
  }
  return {
    email: null,
    isAuthenticated: false,
    queriesRemaining: MAX_FREE_QUERIES,
    maxQueries: MAX_FREE_QUERIES,
    tier: 'anonymous',
  };
}

export function resetQuotaForTesting(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.setItem(QUOTA_STORAGE_KEY, MAX_FREE_QUERIES.toString());
  }
}
