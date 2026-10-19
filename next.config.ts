import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Le dossier project/ contient le prototype Claude Design d'origine (référence uniquement).
  outputFileTracingExcludes: { '*': ['project/**', 'chats/**'] },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Photos des projets Vision House envoyées depuis /admin (Vercel Blob, accès public).
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Photos et vidéos : cache d'un jour + revalidation en arrière-plan (un fichier remplacé sous le même nom se met à jour).
      { source: '/media/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
    ];
  },
};

export default nextConfig;
