'use client';

import { useState } from 'react';
import { Logo } from '../media';

export default function AdminLogin() {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd }) }).catch(() => null);
    setBusy(false);
    if (res?.ok) location.reload();
    else setErr(res?.status === 401 ? 'Mot de passe incorrect.' : 'Connexion impossible. Réessayez.');
  };
  return (
    <main className="adm-gate">
      <Logo src="/logos/emkay.png" alt="EMKAY Partners" style={{ display: 'block', height: 34, width: 'auto' }} />
      <h1 className="serif">Administration</h1>
      <form onSubmit={submit} className="adm-login">
        <label>
          <span>MOT DE PASSE</span>
          <input type="password" autoComplete="current-password" value={pwd} onChange={(e) => setPwd(e.target.value)} required autoFocus />
        </label>
        <button type="submit" className="btn-reset btn-light" disabled={busy}>{busy ? 'CONNEXION…' : 'SE CONNECTER'}</button>
        <p role="status" aria-live="polite" className="adm-err">{err}</p>
      </form>
    </main>
  );
}
