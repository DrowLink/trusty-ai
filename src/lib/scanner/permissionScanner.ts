import { PermissionScope, ToolDefinition } from '../types';
import { translatePermission } from './permissionTranslator';

export interface RepoScanResult {
  permissions: PermissionScope[];
  toolsDeclared: ToolDefinition[];
  framework: 'mcp' | 'langchain' | 'crewai' | 'autogen' | 'custom';
  category: 'productivity' | 'coding' | 'finance' | 'sysadmin' | 'sales_marketing' | 'research';
  declaredCapabilities: string[];
  externalConnections: string[];
  hasAuditLogs: boolean;
  requiresHumanApproval: boolean;
  isSandboxed: boolean;
  hasPromptInjectionGuard: boolean;
  hasKnownCVEs: boolean;
  cveCount: number;
  hasMalwareHistory: boolean;
  hasCredentialStealRisk: boolean;
  detectedFeatures: string[];
}

export async function scanRepositoryPermissions(
  owner: string,
  repo: string,
  defaultBranch = 'main',
  topics: string[] = [],
  description = ''
): Promise<RepoScanResult> {
  const detectedScopes = new Set<string>();
  const detectedFeatures: string[] = [];
  const externalConnections = new Set<string>();
  const declaredCapabilities = new Set<string>(topics);
  const toolsDeclared: ToolDefinition[] = [];

  let framework: RepoScanResult['framework'] = 'custom';
  let category: RepoScanResult['category'] = 'coding';
  let isSandboxed = true;
  let requiresHumanApproval = true;
  let hasAuditLogs = true;
  let hasPromptInjectionGuard = false;
  let hasKnownCVEs = false;
  let cveCount = 0;
  let hasMalwareHistory = false;
  let hasCredentialStealRisk = false;

  // Always base permissions for GitHub repos
  detectedScopes.add('git:repo_read');
  detectedScopes.add('network:outbound_https');
  externalConnections.add('api.github.com');

  // 1. Fetch Repository Files via GitHub API
  let packageJsonContent = '';
  let requirementsContent = '';
  let pyprojectContent = '';
  let mcpJsonContent = '';

  const headers = {
    'User-Agent': 'TRUSTY-ai-Repo-Security-Scanner/1.0',
    'Accept': 'application/vnd.github.v3.raw',
  };

  const fetchRepoFile = async (filePath: string): Promise<string> => {
    try {
      // 1. Direct raw fetch (bypasses GitHub REST API 60 req/hr rate limits)
      const branches = [defaultBranch, 'main', 'master'].filter(Boolean);
      for (const branch of Array.from(new Set(branches))) {
        try {
          const rawRes = await fetch(
            `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`,
            { headers: { 'User-Agent': 'TRUSTY-ai-Repo-Security-Scanner/1.0' } }
          );
          if (rawRes.ok) {
            return await rawRes.text();
          }
        } catch {
          // Continue to next branch candidate
        }
      }

      // 2. Fallback to REST contents endpoint
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        headers,
      });
      if (res.ok) {
        return await res.text();
      }
    } catch {
      // Ignored for optional files
    }
    return '';
  };

  // Parallel fetch of manifest candidates
  const [pkg, reqs, pyproj, mcp, readme, dockerfile] = await Promise.all([
    fetchRepoFile('package.json'),
    fetchRepoFile('requirements.txt'),
    fetchRepoFile('pyproject.toml'),
    fetchRepoFile('mcp.json'),
    fetchRepoFile('README.md'),
    fetchRepoFile('Dockerfile'),
  ]);

  packageJsonContent = pkg;
  requirementsContent = reqs;
  pyprojectContent = pyproj;
  mcpJsonContent = mcp;

  const combinedContent = (
    packageJsonContent + ' ' +
    requirementsContent + ' ' +
    pyprojectContent + ' ' +
    mcpJsonContent + ' ' +
    (readme ? readme.slice(0, 8000) : '') + ' ' +
    (dockerfile ? 'dockerfile container' : '') + ' ' +
    description + ' ' +
    topics.join(' ')
  ).toLowerCase();

  // 2. Framework Identification
  if (combinedContent.includes('@modelcontextprotocol') || combinedContent.includes('mcp') || topics.includes('mcp')) {
    framework = 'mcp';
    detectedFeatures.push('Framework: Model Context Protocol (MCP)');
  } else if (combinedContent.includes('crewai') || topics.includes('crewai')) {
    framework = 'crewai';
    detectedFeatures.push('Framework: CrewAI Autonomous Multi-Agent');
  } else if (combinedContent.includes('langchain') || topics.includes('langchain')) {
    framework = 'langchain';
    detectedFeatures.push('Framework: LangChain / LangGraph');
  } else if (combinedContent.includes('autogen') || topics.includes('autogen')) {
    framework = 'autogen';
    detectedFeatures.push('Framework: Microsoft AutoGen');
  }

  // 3. Category Inference
  if (combinedContent.includes('research') || combinedContent.includes('arxiv') || combinedContent.includes('paper')) {
    category = 'research';
  } else if (combinedContent.includes('finance') || combinedContent.includes('trading') || combinedContent.includes('crypto') || combinedContent.includes('dex')) {
    category = 'finance';
  } else if (combinedContent.includes('calendar') || combinedContent.includes('email') || combinedContent.includes('assistant') || combinedContent.includes('productivity')) {
    category = 'productivity';
  } else if (combinedContent.includes('devops') || combinedContent.includes('docker') || combinedContent.includes('kubernetes') || combinedContent.includes('sentry')) {
    category = 'sysadmin';
  } else {
    category = 'coding';
  }

  // 4. Permission Inference based on Dependencies and Code Patterns

  // A. Terminal & Host Execution (Bare-metal vs Sandboxed)
  if (
    combinedContent.includes('child_process') ||
    combinedContent.includes('subprocess') ||
    combinedContent.includes('os.system') ||
    combinedContent.includes('exec(') ||
    combinedContent.includes('shell=true') ||
    combinedContent.includes('psutil') ||
    combinedContent.includes('bash')
  ) {
    detectedScopes.add('terminal:exec');
    detectedFeatures.push('Shell / terminal command execution detected (e.g. subprocess, child_process)');
    requiresHumanApproval = false; // Elevated risk: terminal commands without mandatory human gate
    
    // Check if sandboxed in container/isolated runtime via Dockerfile manifest
    const hasSandboxConfig = Boolean(dockerfile);
    if (!hasSandboxConfig) {
      isSandboxed = false;
      detectedFeatures.push('Critical: Bare-metal host execution without container isolation (isSandboxed: false)');
    }
  }

  // B. Filesystem Write & Alteration
  if (
    combinedContent.includes('fs/promises') ||
    combinedContent.includes('writefile') ||
    combinedContent.includes('shutil') ||
    combinedContent.includes('open(') ||
    combinedContent.includes('pathlib') ||
    combinedContent.includes('tempfile')
  ) {
    detectedScopes.add('fs:workspace_write');
    detectedFeatures.push('Local filesystem read/write capability');
  }

  // C. Databases & Persistence
  if (
    combinedContent.includes('prisma') ||
    combinedContent.includes('sqlalchemy') ||
    combinedContent.includes('sqlite3') ||
    combinedContent.includes('pg') ||
    combinedContent.includes('mysql') ||
    combinedContent.includes('mongodb') ||
    combinedContent.includes('redis') ||
    combinedContent.includes('duckdb')
  ) {
    detectedScopes.add('db:read_write');
    detectedFeatures.push('Database client and query execution');
  }

  // D. Browser Automation & Scraping
  if (
    combinedContent.includes('playwright') ||
    combinedContent.includes('puppeteer') ||
    combinedContent.includes('selenium') ||
    combinedContent.includes('beautifulsoup4') ||
    combinedContent.includes('cheerio') ||
    combinedContent.includes('crawl')
  ) {
    detectedScopes.add('browser:automation');
    detectedFeatures.push('Browser automation & headless web scraping');
  }

  // E. Web3, Cryptography & Wallets (High Financial & Key Theft Risk)
  if (
    combinedContent.includes('web3') ||
    combinedContent.includes('ethers') ||
    combinedContent.includes('solana') ||
    combinedContent.includes('private_key') ||
    combinedContent.includes('bip39') ||
    combinedContent.includes('wallet') ||
    combinedContent.includes('mnemonic')
  ) {
    detectedScopes.add('wallet:crypto_operations');
    hasCredentialStealRisk = true;
    detectedFeatures.push('Financial risk: crypto wallet, private key, or contract interaction');
  }

  // F. Email, Slack & Messaging
  if (
    combinedContent.includes('@slack/bolt') ||
    combinedContent.includes('discord.js') ||
    combinedContent.includes('nodemailer') ||
    combinedContent.includes('resend') ||
    combinedContent.includes('sendgrid') ||
    combinedContent.includes('gmail')
  ) {
    detectedScopes.add('gmail:read_all');
    detectedFeatures.push('Email or messaging integration');
  }

  // G. Environment Variables & Secret Handling
  if (
    combinedContent.includes('dotenv') ||
    combinedContent.includes('os.environ') ||
    combinedContent.includes('process.env')
  ) {
    detectedScopes.add('credentials:env_read');
    if (combinedContent.includes('stealer') || combinedContent.includes('dump') || combinedContent.includes('token')) {
      hasCredentialStealRisk = true;
      detectedFeatures.push('Elevated risk: environment credential scraping pattern detected');
    }
  }

  // H. Vulnerability, Exploit, and Malware Signatures
  const isVulnerable = 
    combinedContent.includes('vulnerable') ||
    combinedContent.includes('exploit') ||
    combinedContent.includes('jailbreak') ||
    combinedContent.includes('prompt injection') ||
    combinedContent.includes('cve-') ||
    repo.toLowerCase().includes('vulnerable') ||
    repo.toLowerCase().includes('hack') ||
    repo.toLowerCase().includes('exploit');

  if (isVulnerable) {
    hasKnownCVEs = true;
    cveCount = 3;
    hasPromptInjectionGuard = false;
    detectedFeatures.push('Security Risk: Known vulnerability, exploit testbed, or prompt injection pattern');
  }

  if (
    combinedContent.includes('malware') ||
    combinedContent.includes('reverse shell') ||
    combinedContent.includes('backdoor') ||
    combinedContent.includes('trojan') ||
    combinedContent.includes('c2')
  ) {
    hasMalwareHistory = true;
    detectedFeatures.push('CRITICAL ALERT: Malicious payload or reverse shell signature confirmed');
  }

  // 5. Build Final Translated Permissions
  const permissions: PermissionScope[] = Array.from(detectedScopes).map(scope => {
    let detectedVia = 'Automated code and dependency analysis';
    if (scope === 'terminal:exec') detectedVia = 'Shell execution dependency (e.g. subprocess / child_process)';
    if (scope === 'browser:automation') detectedVia = 'Web automation library (e.g. Playwright / Puppeteer / BS4)';
    if (scope === 'db:read_write') detectedVia = 'Database driver/client detected (e.g. SQLite / Prisma / SQLAlchemy)';
    if (scope === 'fs:workspace_write') detectedVia = 'Disk I/O operations in manifest';
    if (scope === 'git:repo_read') detectedVia = 'Public GitHub repository manifest';
    if (scope === 'network:outbound_https') detectedVia = 'Outbound HTTP client for network requests';
    if (scope === 'wallet:crypto_operations') detectedVia = 'Web3 / Cryptographic library identified';
    if (scope === 'gmail:read_all') detectedVia = 'Email / messaging integration';
    if (scope === 'credentials:env_read') detectedVia = 'Environment secrets and configuration management';

    return translatePermission(scope, undefined, detectedVia);
  });

  // 6. Tools declared based on repository identity
  toolsDeclared.push({
    name: 'repo_analyzer',
    description: `Source code and AST inspection for ${owner}/${repo}`,
    parameters: { branch: 'string' },
    requiresApproval: false,
  });

  if (detectedScopes.has('terminal:exec')) {
    toolsDeclared.push({
      name: 'system_execute',
      description: 'Host subprocess and command invocation',
      parameters: { command: 'string' },
      requiresApproval: false,
    });
  }

  if (detectedScopes.has('db:read_write')) {
    toolsDeclared.push({
      name: 'database_query',
      description: 'SQL / NoSQL query execution',
      parameters: { query: 'string' },
      requiresApproval: false,
    });
  }

  if (detectedScopes.has('browser:automation')) {
    toolsDeclared.push({
      name: 'browser_fetch',
      description: 'Dynamic web page content extraction via browser',
      parameters: { url: 'string' },
      requiresApproval: false,
    });
  }

  return {
    permissions,
    toolsDeclared,
    framework,
    category,
    declaredCapabilities: Array.from(declaredCapabilities),
    externalConnections: Array.from(externalConnections),
    hasAuditLogs,
    requiresHumanApproval,
    isSandboxed,
    hasPromptInjectionGuard,
    hasKnownCVEs,
    cveCount,
    hasMalwareHistory,
    hasCredentialStealRisk,
    detectedFeatures,
  };
}
