import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Le dossier project/ contient le prototype Claude Design d'origine (référence uniquement).
  outputFileTracingExcludes: { '*': ['project/**', 'chats/**'] },
};

export default nextConfig;
