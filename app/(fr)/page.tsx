import EmkaySite from '@/components/EmkaySite';
import { readProjectsFromFiles } from '@/lib/projectFiles';
import { homeMetadata } from '@/lib/meta';

export const metadata = homeMetadata('fr');

// Les projets Vision House sont lus dans public/vision-house/ au moment du build :
// chaque modification poussée sur GitHub redéploie le site automatiquement (Vercel).
export default function Page() {
  return <EmkaySite locale="fr" projects={readProjectsFromFiles('fr')} />;
}
