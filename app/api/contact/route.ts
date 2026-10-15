import { NextResponse } from 'next/server';

// Formulaires de contact (projet / collaboration / échange / écrire).
//
// CONTACT_WEBHOOK_URL (variable Vercel) : URL qui reçoit chaque message en POST JSON.
// Compatible Make, n8n, Zapier (« Catch Hook ») et Slack (« Incoming Webhook », qui lit le champ `text`).
// Sans cette variable, le visiteur voit quand même une confirmation et le message est écrit dans les logs Vercel.

export const runtime = 'nodejs';

const KINDS = { project: 'Projet', collab: 'Collaboration', talk: 'Échange', write: 'Message' } as const;
type Kind = keyof typeof KINDS;

const FIELDS = ['nom', 'email', 'message', 'entreprise', 'organisation', 'telephone', 'type', 'budget'] as const;
const MAX_LEN = { nom: 120, email: 200, message: 5000, default: 200 };
const MIN_FILL_MS = 2500; // en dessous : envoi automatisé probable
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ok = () => NextResponse.json({ ok: true });
const fail = (status: number, error: string, fields?: string[]) => NextResponse.json({ ok: false, error, fields }, { status });

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, 'invalid');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return fail(400, 'invalid');

  // Anti-spam : champ piège invisible rempli, ou formulaire envoyé trop vite → on fait semblant d'accepter.
  const elapsed = Number(body._t);
  if ((typeof body.site_web === 'string' && body.site_web.trim()) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    console.warn('[contact] envoi ignoré (anti-spam)', { honeypot: !!body.site_web, elapsed });
    return ok();
  }

  const kind = String(body.kind || '') as Kind;
  if (!(kind in KINDS)) return fail(400, 'invalid', ['kind']);

  const f: Record<string, string> = {};
  for (const k of FIELDS) {
    const v = body[k];
    if (typeof v === 'string' && v.trim()) f[k] = v.trim().slice(0, (MAX_LEN as Record<string, number>)[k] ?? MAX_LEN.default);
  }

  const missing: string[] = [];
  if (!f.nom || f.nom.length < 2) missing.push('nom');
  if (!f.email || !EMAIL_RE.test(f.email)) missing.push('email');
  if (!f.message || f.message.length < 5) missing.push('message');
  if (kind === 'collab' && !f.organisation) missing.push('organisation');
  if (missing.length) return fail(422, 'invalid', missing);

  const label = KINDS[kind];
  const payload = {
    source: 'emkaypartners-site',
    kind,
    type_demande: label,
    ...f,
    receivedAt: new Date().toISOString(),
    // Lisible tel quel dans Slack / e-mail.
    text: [
      `Nouveau message (${label}) — ${f.nom} <${f.email}>`,
      f.organisation || f.entreprise ? `Structure : ${f.organisation || f.entreprise}` : '',
      f.telephone ? `Tél. : ${f.telephone}` : '',
      f.type ? `Type : ${f.type}` : '',
      f.budget ? `Budget : ${f.budget}` : '',
    ].filter(Boolean).join('\n') + '\n\n' + f.message,
  };

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (!hook) {
    console.warn('[contact] CONTACT_WEBHOOK_URL n’est pas configurée — message NON transmis, uniquement journalisé :', JSON.stringify(payload));
    return ok();
  }

  try {
    const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (e) {
    console.error('[contact] échec de transmission au webhook :', (e as Error).message, JSON.stringify(payload));
    return fail(502, 'delivery');
  }
  return ok();
}
