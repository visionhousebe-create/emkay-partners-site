import EmkaySite from '@/components/EmkaySite';
import { readProjectsFromFiles } from '@/lib/projectFiles';
import { homeMetadata } from '@/lib/meta';

export const metadata = homeMetadata('en');

export default function Page() {
  return <EmkaySite locale="en" projects={readProjectsFromFiles('en')} />;
}
