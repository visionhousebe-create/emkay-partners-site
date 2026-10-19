import type { Metadata } from 'next';
import AdminApp from '@/components/admin/AdminApp';
import AdminLogin from '@/components/admin/AdminLogin';
import { adminConfigured, isAdmin } from '@/lib/adminAuth';
import { blobConfigured, readProjects } from '@/lib/projectStore';
import { DEFAULT_PROJECTS } from '@/lib/projects';

export const metadata: Metadata = { title: 'Administration', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <main className="adm-gate">
        <h1 className="serif">Administration</h1>
        <p>L’accès n’est pas encore configuré. Dans Vercel → Settings → Environment Variables, ajoutez <code>ADMIN_PASSWORD</code> (12 caractères minimum), puis redéployez.</p>
      </main>
    );
  }
  if (!(await isAdmin())) return <AdminLogin />;
  let initial = { projects: DEFAULT_PROJECTS, source: 'default' as 'blob' | 'default', error: '' };
  try {
    const r = await readProjects();
    initial = { ...r, error: '' };
  } catch (e) {
    initial.error = (e as Error).message;
  }
  return <AdminApp initialProjects={initial.projects} source={initial.source} storage={blobConfigured()} loadError={initial.error} />;
}
