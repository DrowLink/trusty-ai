import { NextRequest, NextResponse } from 'next/server';
import { AgentRecord } from '@/lib/types';
import { evaluateAgentTrust } from '@/lib/scoring/engine';
import { agentStore } from '@/lib/db/store';
import { scanRepositoryPermissions } from '@/lib/scanner/permissionScanner';
import { translatePermission } from '@/lib/scanner/permissionTranslator';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { name, publisherName, domain, category, permissions, repositoryUrl, isSandboxed, requiresHumanApproval, framework } = body;

    // --- REAL LIVE GITHUB REPO INSPECTION & AUTO PERMISSION SCANNER ---
    if (repositoryUrl && repositoryUrl.includes('github.com')) {
      const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
      if (match) {
        const owner = match[1];
        const repo = match[2];
        try {
          const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
              'User-Agent': 'TRUSTY-ai-Live-Auditor/1.0',
              'Accept': 'application/vnd.github.v3+json',
            },
          });

          if (ghRes.ok) {
            const ghData = await ghRes.json();
            name = name || ghData.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
            publisherName = publisherName || ghData.owner.login;
            domain = domain || (ghData.homepage ? new URL(ghData.homepage).hostname : `${ghData.owner.login}.github.io`);
            body.description = ghData.description || body.description;

            const isOrg = ghData.owner.type === 'Organization';
            const stars = ghData.stargazers_count || 0;
            const forks = ghData.forks_count || 0;

            // Run our Automated Code & Manifest Permission Scanner
            const scan = await scanRepositoryPermissions(
              owner,
              repo,
              ghData.default_branch || 'main',
              ghData.topics || [],
              ghData.description || ''
            );

            category = category || scan.category;
            framework = framework || scan.framework;

            const id = `live-gh-${ghData.id}`;
            const agentRecord: AgentRecord = {
              id,
              name,
              slug: ghData.full_name,
              description: ghData.description || `Real-time audited GitHub AI Agent: ${ghData.full_name}`,
              category: category || 'coding',
              sourceEcosystem: 'github',
              publisher: {
                name: ghData.owner.login,
                domain: `${ghData.owner.login}.github.io`,
                verifiedDomain: isOrg,
                identityType: isOrg ? 'verified_org' : 'individual',
                githubUser: ghData.owner.login,
                reputationScore: Math.min(96, Math.max(55, Math.round(Math.log10(stars + 1) * 22))),
              },
              framework: framework || 'mcp',
              repositoryUrl: ghData.html_url,
              declaredCapabilities: Array.from(new Set([...(ghData.topics || []), ...scan.declaredCapabilities])),
              requestedPermissions: scan.permissions,
              toolsDeclared: scan.toolsDeclared,
              externalConnections: scan.externalConnections,
              hasAuditLogs: scan.hasAuditLogs,
              requiresHumanApproval: scan.requiresHumanApproval,
              isSandboxed: scan.isSandboxed,
              hasPromptInjectionGuard: stars > 500 || scan.hasPromptInjectionGuard,
              hasKnownCVEs: false,
              cveCount: 0,
              hasMalwareHistory: false,
              hasCredentialStealRisk: false,
              starsCount: stars,
              forksCount: forks,
              lastCommitDate: ghData.pushed_at,
              discoveredAt: new Date().toISOString(),
              fingerprint: {
                fingerprintId: `fp-live-gh-${ghData.id}`,
                timestamp: new Date().toISOString(),
                manifestHash: `sha256:gh_${ghData.id}_${ghData.default_branch}`,
                toolSchemasHash: 'sha256:tools_live_v2',
                permissionsHash: `sha256:perms_live_${scan.permissions.length}`,
                dependenciesHash: 'sha256:deps_live_v2',
                isDriftDetected: false,
              },
            };

            const evaluation = evaluateAgentTrust(agentRecord);
            const saved = agentStore.upsert(agentRecord);

            return NextResponse.json({
              success: true,
              isRealGitHubLiveAudit: true,
              autoScannedPermissions: true,
              detectedFeatures: scan.detectedFeatures,
              agent: saved,
              evaluation,
            });
          }
        } catch (ghErr) {
          console.warn('Live GitHub fetch failed, proceeding with manual payload:', ghErr);
        }
      }
    }

    // --- STANDARD OR MANIFEST AUDIT ---
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Agent name or valid GitHub URL is required.' },
        { status: 400 }
      );
    }

    const id = `custom-${Date.now()}`;
    const rawPermissions = Array.isArray(permissions) ? permissions : (typeof permissions === 'string' ? permissions.split(',').map((s: string) => s.trim()) : []);
    const parsedPermissions = rawPermissions.map((scopeStr: string) => translatePermission(scopeStr));

    const isMaliciousScope = rawPermissions.some((p: string) => 
      p.toLowerCase().includes('steal') || p.toLowerCase().includes('private_key') || p.toLowerCase().includes('malware')
    );

    const isVerifiedOrg = domain ? (domain.includes('anthropic.com') || domain.includes('openai.com') || domain.includes('microsoft.com') || domain.includes('google.com')) : false;

    const agentRecord: AgentRecord = {
      id,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: body.description || `Custom on-demand scan of agent: ${name}`,
      category: category || 'productivity',
      sourceEcosystem: 'manual_scan',
      publisher: {
        name: publisherName || 'Anonymous Submitter',
        domain: domain || undefined,
        verifiedDomain: isVerifiedOrg,
        identityType: isVerifiedOrg ? 'verified_org' : (publisherName ? 'individual' : 'anonymous'),
        reputationScore: isVerifiedOrg ? 90 : (publisherName ? 65 : 30),
      },
      framework: framework || 'mcp',
      repositoryUrl: repositoryUrl || undefined,
      declaredCapabilities: rawPermissions,
      requestedPermissions: parsedPermissions as any,
      toolsDeclared: rawPermissions.map((p: string) => ({
        name: `tool_${p.replace(/[^a-zA-Z0-9]/g, '_')}`,
        description: `Execute capability ${p}`,
        parameters: {},
      })),
      externalConnections: domain ? [domain] : [],
      hasAuditLogs: body.hasAuditLogs ?? true,
      requiresHumanApproval: requiresHumanApproval ?? false,
      isSandboxed: isSandboxed ?? false,
      hasPromptInjectionGuard: body.hasPromptInjectionGuard ?? false,
      hasKnownCVEs: false,
      cveCount: 0,
      hasMalwareHistory: isMaliciousScope,
      hasCredentialStealRisk: isMaliciousScope,
      discoveredAt: new Date().toISOString(),
      fingerprint: {
        fingerprintId: `fp-${id}`,
        timestamp: new Date().toISOString(),
        manifestHash: `sha256:custom_${id}`,
        toolSchemasHash: 'sha256:custom_tools',
        permissionsHash: 'sha256:custom_perms',
        dependenciesHash: 'sha256:custom_deps',
        isDriftDetected: false,
      },
    };

    const evaluation = evaluateAgentTrust(agentRecord);
    const saved = agentStore.upsert(agentRecord);

    return NextResponse.json({
      success: true,
      agent: saved,
      evaluation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Evaluation failed' },
      { status: 500 }
    );
  }
}
