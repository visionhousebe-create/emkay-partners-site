import EmkaySite from '@/components/EmkaySite';
import { getSiteProjects } from '@/lib/projectStore';

// Page statique, régénérée à chaque publication depuis /admin (et au plus tard toutes les heures).
export const revalidate = 3600;

export default async function Page() {
  const projects = (await getSiteProjects()).filter((p) => p.published);
  return <EmkaySite projects={projects} />;
}
