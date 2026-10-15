import { NextResponse } from 'next/server';

// Reçoit les formulaires de contact (projet / collaboration / échange / écrire).
// Si CONTACT_WEBHOOK_URL est défini (Slack, Make, Zapier, n8n…), le message y est transmis en JSON.
// Sinon il est seulement journalisé côté serveur : brancher un service d'envoi avant la mise en ligne.

const KINDS = new Set(['project', 'collab', 'talk', 'write']);
const MAX = 5000;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 }); }

  const kind = String(body.kind || '');
  if (!KINDS.has(kind)) return NextResponse.json({ ok: false, error: 'invalid_kind' }, { status: 400 });

  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) {
    if (k === 'kind' || typeof v !== 'string') continue;
    fields[k.slice(0, 40)] = v.slice(0, MAX);
  }
  if (!fields.nom?.trim()) return NextResponse.json({ ok: false, error: 'missing_name' }, { status: 400 });
  if (!(fields.email || fields.coordonnees)?.trim()) return NextResponse.json({ ok: false, error: 'missing_contact' }, { status: 400 });

  const payload = { kind, fields, receivedAt: new Date().toISOString() };
  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (hook) {
    const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => null);
    if (!res || !res.ok) return NextResponse.json({ ok: false, error: 'delivery_failed' }, { status: 502 });
  } else {
    console.info('[contact]', JSON.stringify(payload));
  }
  return NextResponse.json({ ok: true });
}
