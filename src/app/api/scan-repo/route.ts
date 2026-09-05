import { NextRequest, NextResponse } from 'next/server';
import { scanRepositoryPermissions } from '@/lib/scanner/permissionScanner';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repositoryUrl } = body;

    if (!repositoryUrl || !repositoryUrl.includes('github.com')) {
      return NextResponse.json(
        { success: false, error: 'Proporciona una URL válida de GitHub (ej. https://github.com/crewAIInc/crewAI)' },
        { status: 400 }
      );
    }

    const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Formato de repositorio inválido. Usa: https://github.com/owner/repo' },
        { status: 400 }
      );
    }

    const owner = match[1];
    const repo = match[2];

    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'User-Agent': 'TRUSTY-ai-Repo-Scanner/1.0',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!ghRes.ok) {
      return NextResponse.json(
        { success: false, error: `No se pudo encontrar el repositorio en GitHub (${ghRes.statusText})` },
        { status: 404 }
      );
    }

    const ghData = await ghRes.json();
    const name = ghData.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    const publisherName = ghData.owner.login;
    const domain = ghData.homepage
      ? (ghData.homepage.startsWith('http') ? new URL(ghData.homepage).hostname : ghData.homepage)
      : `${ghData.owner.login}.github.io`;

    // Run Automated Code & Manifest Permission Scanner
    const scan = await scanRepositoryPermissions(
      owner,
      repo,
      ghData.default_branch || 'main',
      ghData.topics || [],
      ghData.description || ''
    );

    const permissionsString = scan.permissions.map(p => p.scope).join(', ');

    return NextResponse.json({
      success: true,
      name,
      publisherName,
      domain,
      category: scan.category,
      framework: scan.framework,
      isSandboxed: scan.isSandboxed,
      requiresHumanApproval: scan.requiresHumanApproval,
      permissionsString,
      permissions: scan.permissions,
      detectedFeatures: scan.detectedFeatures,
      stars: ghData.stargazers_count || 0,
      description: ghData.description || '',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al escanear repositorio' },
      { status: 500 }
    );
  }
}
