import RootDocument from '@/components/RootDocument';
import { layoutMetadata } from '@/lib/meta';

export { viewport } from '@/lib/meta';
export const metadata = layoutMetadata('en');

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
