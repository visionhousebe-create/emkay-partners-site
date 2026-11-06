import EmkaySite from '@/components/EmkaySite';
import { readProjectsFromFiles } from '@/lib/projectFiles';
import { homeMetadata } from '@/lib/meta';

export const metadata = homeMetadata('nl');

export default function Page() {
  return <EmkaySite locale="nl" projects={readProjectsFromFiles('nl')} />;
}
