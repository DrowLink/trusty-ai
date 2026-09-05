import { AccessType, PermissionScope, SensitivityLevel } from '../types';

export interface HumanPermissionTranslation {
  humanLabel: string;
  humanImpact: string;
  accessType: AccessType;
  categoryGroup: 'system' | 'network' | 'filesystem' | 'database' | 'personal_data' | 'financial' | 'browser' | 'code';
  sensitivity: SensitivityLevel;
  isHighRisk: boolean;
}

const KNOWN_PERMISSIONS: Record<string, HumanPermissionTranslation> = {
  // Terminal & OS
  'terminal:exec': {
    humanLabel: 'Terminal Command Execution',
    humanImpact: 'Can execute scripts, shell commands, and system binaries on the host OS.',
    accessType: 'execute_admin',
    categoryGroup: 'system',
    sensitivity: 'high',
    isHighRisk: true,
  },
  'terminal:root_exec': {
    humanLabel: 'Root / Admin Shell Control',
    humanImpact: 'Has superuser administrative privileges to alter any file, system process, or host configuration.',
    accessType: 'execute_admin',
    categoryGroup: 'system',
    sensitivity: 'critical',
    isHighRisk: true,
  },
  'system:admin': {
    humanLabel: 'System Administrative Privileges',
    humanImpact: 'Unrestricted operating system level control without execution boundaries.',
    accessType: 'execute_admin',
    categoryGroup: 'system',
    sensitivity: 'critical',
    isHighRisk: true,
  },

  // Filesystem
  'fs:workspace_write': {
    humanLabel: 'Workspace File Creation & Modification',
    humanImpact: 'Can create, edit, and write workspace files within the active project directory.',
    accessType: 'read_write',
    categoryGroup: 'filesystem',
    sensitivity: 'medium',
    isHighRisk: false,
  },
  'fs:root_write': {
    humanLabel: 'Unrestricted Disk Write Access',
    humanImpact: 'Can overwrite, mutate, or delete arbitrary files on the system hard drive.',
    accessType: 'execute_admin',
    categoryGroup: 'filesystem',
    sensitivity: 'critical',
    isHighRisk: true,
  },
  'fs:workspace_read': {
    humanLabel: 'Project Workspace File Inspection',
    humanImpact: 'Read-only access to inspect and analyze files within the current workspace.',
    accessType: 'read_only',
    categoryGroup: 'filesystem',
    sensitivity: 'low',
    isHighRisk: false,
  },

  // Network & Web
  'network:outbound_https': {
    humanLabel: 'Internet & External API Connections',
    humanImpact: 'Issues outbound HTTP/HTTPS requests to external services, LLM providers, or public APIs.',
    accessType: 'read_only',
    categoryGroup: 'network',
    sensitivity: 'low',
    isHighRisk: false,
  },
  'network:unrestricted_socket': {
    humanLabel: 'Raw Unrestricted Network Sockets',
    humanImpact: 'Can open arbitrary TCP/UDP ports and network sockets, potentially enabling reverse tunneling.',
    accessType: 'read_write',
    categoryGroup: 'network',
    sensitivity: 'high',
    isHighRisk: true,
  },

  // Databases
  'db:read_only': {
    humanLabel: 'Database Querying (Read Only)',
    humanImpact: 'Inspects schemas and executes SELECT queries without altering database state.',
    accessType: 'read_only',
    categoryGroup: 'database',
    sensitivity: 'low',
    isHighRisk: false,
  },
  'db:read_write': {
    humanLabel: 'Database Read & Mutation',
    humanImpact: 'Queries, inserts, updates, or deletes records in connected data stores.',
    accessType: 'read_write',
    categoryGroup: 'database',
    sensitivity: 'medium',
    isHighRisk: false,
  },

  // Personal Data / Email / Calendar
  'gmail:read_all': {
    humanLabel: 'Email Inbox Inspection (Full Access)',
    humanImpact: 'Reads incoming emails, recipient lists, message contents, attachments, and password resets.',
    accessType: 'read_only',
    categoryGroup: 'personal_data',
    sensitivity: 'high',
    isHighRisk: true,
  },
  'calendar:read': {
    humanLabel: 'Calendar & Meeting Inspection',
    humanImpact: 'Reads scheduled appointments, event details, attendees, and calendar availability.',
    accessType: 'read_only',
    categoryGroup: 'personal_data',
    sensitivity: 'low',
    isHighRisk: false,
  },
  'calendar:read_write': {
    humanLabel: 'Full Calendar & Event Management',
    humanImpact: 'Reads, creates, reschedules, or cancels calendar meetings and invites.',
    accessType: 'read_write',
    categoryGroup: 'personal_data',
    sensitivity: 'medium',
    isHighRisk: false,
  },
  'contacts:export': {
    humanLabel: 'Address Book & Contacts Export',
    humanImpact: 'Extracts and exports contact lists including full names, phone numbers, and emails.',
    accessType: 'read_only',
    categoryGroup: 'personal_data',
    sensitivity: 'high',
    isHighRisk: true,
  },

  // Code & Repositories
  'git:repo_read': {
    humanLabel: 'Code Repository Inspection',
    humanImpact: 'Read-only access to source code, branch trees, commit histories, and Git diffs.',
    accessType: 'read_only',
    categoryGroup: 'code',
    sensitivity: 'low',
    isHighRisk: false,
  },
  'git:read': {
    humanLabel: 'Code Repository Inspection',
    humanImpact: 'Read-only access to source code, branch trees, commit histories, and Git diffs.',
    accessType: 'read_only',
    categoryGroup: 'code',
    sensitivity: 'low',
    isHighRisk: false,
  },
  'git:commit': {
    humanLabel: 'Git Commit & Branch Mutation',
    humanImpact: 'Creates, stages, and commits source code changes to repository branches.',
    accessType: 'read_write',
    categoryGroup: 'code',
    sensitivity: 'medium',
    isHighRisk: false,
  },

  // Browser & Scraping
  'browser:automation': {
    humanLabel: 'Web Navigation & Browser Automation',
    humanImpact: 'Controls headless browser instances (Playwright/Puppeteer) to navigate, fill forms, or scrape web content.',
    accessType: 'read_write',
    categoryGroup: 'browser',
    sensitivity: 'medium',
    isHighRisk: false,
  },

  // Financial & Crypto
  'wallet:crypto_operations': {
    humanLabel: 'Cryptographic Wallet Transactions',
    humanImpact: 'Executes transactions, signs messages, and invokes smart contract routers.',
    accessType: 'read_write',
    categoryGroup: 'financial',
    sensitivity: 'critical',
    isHighRisk: true,
  },
  'wallet:private_key_export': {
    humanLabel: 'Private Key / Seed Extraction',
    humanImpact: 'CRITICAL RISK: Accesses, stores, or transmits unencrypted private keys or seed phrases.',
    accessType: 'execute_admin',
    categoryGroup: 'financial',
    sensitivity: 'critical',
    isHighRisk: true,
  },
  'credentials:env_read': {
    humanLabel: 'Environment Secrets & Credentials Access',
    humanImpact: 'Reads environment variables (.env files) containing API keys, private tokens, and passwords.',
    accessType: 'read_only',
    categoryGroup: 'system',
    sensitivity: 'high',
    isHighRisk: true,
  },
};

export function translatePermission(scope: string, justification?: string, detectedVia?: string): PermissionScope {
  const normalized = scope.trim().toLowerCase();

  // Exact match
  if (KNOWN_PERMISSIONS[normalized]) {
    const meta = KNOWN_PERMISSIONS[normalized];
    return {
      scope,
      sensitivity: meta.sensitivity,
      isHighRisk: meta.isHighRisk,
      humanLabel: meta.humanLabel,
      humanImpact: meta.humanImpact,
      accessType: meta.accessType,
      categoryGroup: meta.categoryGroup,
      justification: justification || meta.humanImpact,
      detectedVia,
    };
  }

  // Heuristic match
  let humanLabel = `Capability: ${scope}`;
  let humanImpact = justification || 'Technical capability declared by the agent.';
  let accessType: AccessType = 'read_only';
  let categoryGroup: PermissionScope['categoryGroup'] = 'system';
  let sensitivity: SensitivityLevel = 'medium';
  let isHighRisk = false;

  if (normalized.includes('root') || normalized.includes('admin') || normalized.includes('steal') || normalized.includes('private_key')) {
    humanLabel = 'Critical System Control Privileges';
    humanImpact = 'High-severity operation requiring strict organizational security oversight.';
    accessType = 'execute_admin';
    sensitivity = 'critical';
    isHighRisk = true;
  } else if (normalized.includes('exec') || normalized.includes('shell') || normalized.includes('terminal')) {
    humanLabel = 'Terminal & Shell Command Execution';
    humanImpact = 'Invokes shell commands and operating system binaries.';
    accessType = 'execute_admin';
    categoryGroup = 'system';
    sensitivity = 'high';
    isHighRisk = true;
  } else if (normalized.includes('write') || normalized.includes('modify') || normalized.includes('update')) {
    humanLabel = 'Data Mutation & File Modification';
    humanImpact = 'Creates or modifies information in the designated target.';
    accessType = 'read_write';
    sensitivity = 'medium';
  } else if (normalized.includes('read') || normalized.includes('get') || normalized.includes('list')) {
    humanLabel = 'Data Inspection (Read Only)';
    humanImpact = 'Inspects records or files without mutating state.';
    accessType = 'read_only';
    sensitivity = 'low';
  } else if (normalized.includes('net') || normalized.includes('http') || normalized.includes('api')) {
    humanLabel = 'Outbound Network Communication';
    humanImpact = 'Establishes outbound connections to external web servers and APIs.';
    accessType = 'read_only';
    categoryGroup = 'network';
    sensitivity = 'low';
  }

  return {
    scope,
    sensitivity,
    isHighRisk,
    humanLabel,
    humanImpact,
    accessType,
    categoryGroup,
    justification: justification || humanImpact,
    detectedVia,
  };
}
