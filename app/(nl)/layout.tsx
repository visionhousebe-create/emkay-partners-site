import RootDocument from '@/components/RootDocument';
import { layoutMetadata } from '@/lib/meta';

export { viewport } from '@/lib/meta';
export const metadata = layoutMetadata('nl');

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="nl">{children}</RootDocument>;
}
