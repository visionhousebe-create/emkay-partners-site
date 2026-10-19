import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminAuth';
import { sanitizeProjects } from '@/lib/projects';
import { blobConfigured, PROJECTS_TAG, readProjects, saveProjects } from '@/lib/projectStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const deny = () => NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return deny();
  try {
    const { projects, source } = await readProjects();
    return NextResponse.json({ ok: true, projects, source, storage: blobConfigured() });
  } catch (e) {
    console.error('[admin] lecture des projets :', (e as Error).message);
    return NextResponse.json({ ok: false, error: 'read_failed' }, { status: 502 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return deny();
  if (!blobConfigured()) return NextResponse.json({ ok: false, error: 'no_storage' }, { status: 503 });
  let projects;
  try {
    projects = sanitizeProjects((await req.json())?.projects);
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'invalid', detail: (e as Error).message }, { status: 422 });
  }
  try {
    const r = await saveProjects(projects);
    revalidateTag(PROJECTS_TAG, { expire: 0 });
    revalidatePath('/');
    console.info('[admin] projets publiés :', r.pathname, `(${projects.length} projets, ${r.removedMedia} médias supprimés)`);
    return NextResponse.json({ ok: true, projects });
  } catch (e) {
    console.error('[admin] publication :', (e as Error).message);
    return NextResponse.json({ ok: false, error: 'save_failed' }, { status: 502 });
  }
}
