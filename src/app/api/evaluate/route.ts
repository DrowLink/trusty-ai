import { NextRequest, NextResponse } from 'next/server';
import { AgentRecord } from '@/lib/types';
import { evaluateAgentTrust } from '@/lib/scoring/engine';
import { agentStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, publisherName, domain, category, permissions, repositoryUrl, isSandboxed, requiresHumanApproval, framework } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Agent name is required.' },
        { status: 400 }
      );
    }

    const id = `custom-${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Parse requested permissions
    const rawPermissions = Array.isArray(permissions) ? permissions : (typeof permissions === 'string' ? permissions.split(',').map((s: string) => s.trim()) : []);
    const parsedPermissions = rawPermissions.map((scopeStr: string) => {
      const isCritical = scopeStr.includes('root') || scopeStr.includes('private_key') || scopeStr.includes('financial');
      const isHigh = scopeStr.includes('all_emails') || scopeStr.includes('exec') || scopeStr.includes('write_all');
      return {
        scope: scopeStr,
        sensitivity: isCritical ? 'critical' : isHigh ? 'high' : 'medium',
        justification: `User submitted capability request for ${scopeStr}`,
      };
    });

    const isMaliciousScope = rawPermissions.some((p: string) => 
      p.toLowerCase().includes('steal') || p.toLowerCase().includes('private_key') || p.toLowerCase().includes('malware')
    );

    const isVerifiedOrg = domain ? (domain.includes('anthropic.com') || domain.includes('openai.com') || domain.includes('microsoft.com') || domain.includes('google.com')) : false;

    const agentRecord: AgentRecord = {
      id,
      name,
      slug,
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
