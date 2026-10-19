import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminAuth';

// Délivre un jeton d'envoi direct navigateur → Vercel Blob (pas de limite de taille de requête Vercel).
export const runtime = 'nodejs';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm', 'video/quicktime'];
const MAX_BYTES = 1024 * 1024 * 1024; // 1 Go par fichier

export async function POST(req: Request) {
  const admin = await isAdmin();
  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!admin) throw new Error('unauthorized');
        if (!/^vision-house\/[a-z0-9-]+\/[^/]{1,200}$/.test(pathname)) throw new Error('invalid pathname');
        return { allowedContentTypes: ALLOWED, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true, cacheControlMaxAge: 31536000 };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json({ error: msg }, { status: msg === 'unauthorized' ? 401 : 400 });
  }
}
