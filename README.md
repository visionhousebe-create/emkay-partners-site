# EMKAY Partners — site

Site Next.js 16 (App Router) issu du prototype Claude Design `project/EMKAY FINAL.dc.html`. Déployable tel quel sur Vercel.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # build de production (doit passer sans erreur)
npm run typecheck
```

Node ≥ 20.9 (Vercel : laisser la version par défaut).

## Structure

| Chemin | Rôle |
| --- | --- |
| `app/page.tsx`, `app/layout.tsx` | Page d'accueil, polices (Archivo + Instrument Serif via `next/font`), métadonnées SEO |
| `app/mentions-legales`, `app/politique-de-confidentialite` | Pages légales (champs `[À COMPLÉTER : …]` surlignés) |
| `app/api/contact/route.ts` | Réception des formulaires → `CONTACT_WEBHOOK_URL` |
| `app/robots.ts`, `app/sitemap.ts`, `app/icon.png`, `app/opengraph-image.png` | SEO, favicon, image de partage |
| `components/EmkaySite.tsx` | Header, accès rapide, navigation latérale, formulaire, curseur |
| `components/sections.tsx` | Les 18 sections, dans l'ordre de la page |
| `components/media.tsx` | Logos, photos et vidéos (chargement différé) |
| `lib/data.ts` | **Tout le contenu modifiable** : marques, projets, galerie, liens, formulaires |
| `lib/scrollEngine.ts` | Animations au défilement |
| `lib/site.ts` | URL du site, titre, description, indexation |
| `public/logos`, `public/media` | Logos officiels et photos |

`project/` et `chats/` = bundle Claude Design d'origine, conservé pour référence et exclu du build.

## Variables d'environnement (Vercel → Settings → Environment Variables)

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `CONTACT_WEBHOOK_URL` | Oui en production | URL qui reçoit chaque message (POST JSON) : Make, n8n, Zapier, Slack Incoming Webhook. Sans elle, le visiteur voit une confirmation mais le message n'est que **journalisé** (logs Vercel : « CONTACT_WEBHOOK_URL n’est pas configurée »). |
| `NEXT_PUBLIC_SITE_URL` | Oui en production | Domaine canonique, ex. `https://www.exemple.be` (sans `/` final). Utilisé pour canonical, Open Graph, robots.txt, sitemap. |

Voir `.env.example`. Les Previews Vercel sont automatiquement en `noindex`.

### Formulaire de contact
- Validation serveur : nom (≥ 2 caractères), e-mail valide, message (≥ 5 caractères), type de demande ; organisation pour « Je veux collaborer ».
- Anti-spam invisible : champ piège + délai minimum de 2,5 s. Les envois suspects sont acceptés en apparence mais jamais transmis.
- Données envoyées au webhook : `kind`, `type_demande`, `nom`, `email`, `message`, champs optionnels, `receivedAt`, et `text` (résumé lisible, utilisé par Slack).
- En cas d'échec du webhook, le visiteur voit « Votre message n’a pas pu partir. Merci de réessayer… » — jamais d'erreur technique.

## Médias Vision House et vidéos

Déposer les fichiers dans `public/media/vision-house/` (voir le README du dossier), puis renseigner `VH_PROJECTS` dans `lib/data.ts` :

```ts
{ name: 'CLIENT 01', …, mediaType: 'video', mediaSrc: ['/media/vision-house/client-01.webm', '/media/vision-house/client-01.mp4'], poster: '/media/vision-house/client-01.jpg' }
```

Les vidéos (`.mp4`, `.webm`) ne se chargent qu'à l'approche de l'écran, puis en `preload="metadata"`, muettes, en boucle, `playsInline` ; aucune lecture automatique avec `prefers-reduced-motion`. Pour des fichiers de plusieurs dizaines de Mo, préférer un hébergement vidéo (Vercel Blob, Mux, Cloudflare Stream) et mettre l'URL complète dans `mediaSrc`.

## Liens à compléter (`LINKS` dans `lib/data.ts`)

Tant qu'une URL vaut `''`, le lien s'affiche à l'identique mais n'est pas cliquable.

| Clé | Emplacement |
| --- | --- |
| `linkedin` | Footer — LinkedIn |
| `instagram` | Footer — Instagram |
| `nextBavare` | Section Bavare — « Voir le prochain Bavare » |
| `vmAddresses` | Section Viens Manger — « Découvrir les adresses » |
| `VH_PROJECTS[].url` | Cartes Vision House (études de cas, facultatif) |

## Informations légales à compléter

Rechercher `À COMPLÉTER` dans `app/mentions-legales/page.tsx` et `app/politique-de-confidentialite/page.tsx` : dénomination sociale, forme juridique, adresse, BCE, TVA, e-mail, téléphone, responsable de publication, hébergeur, outil de réception des messages, durée de conservation, juridiction, date de mise à jour. Les textes légaux parlent volontairement des « marques développées et exploitées par EMKAY Partners » : un changement de nom de marque ne les impacte pas.

## Mise en ligne

1. **GitHub** — branche `emkay-final-production` → Pull Request vers `main` (ne pas merger avant validation).
2. **Vercel → Add New… → Project → Import** `visionhousebe-create/emkay-partners-site`. Framework : Next.js · Root Directory : `./` · Install : `npm install` · Build : `npm run build` · Output : automatique.
3. Variables : ajouter `CONTACT_WEBHOOK_URL` (Preview + Production). `NEXT_PUBLIC_SITE_URL` : Production seulement, une fois le domaine choisi.
4. **Preview** : chaque push sur `emkay-final-production` crée un déploiement Preview ; le lien apparaît dans la Pull Request.
5. **Domaine** (après validation) : Vercel → Settings → Domains → ajouter le domaine principal et `www.` ; choisir lequel est principal, l'autre redirige (308). Un domaine secondaire (ex. autre extension) s'ajoute de la même façon avec « Redirect to » le domaine principal. Configurer les DNS indiqués par Vercel chez le registrar ; le certificat HTTPS est émis automatiquement. Mettre `NEXT_PUBLIC_SITE_URL` = domaine principal, puis redéployer.
6. **Production** : merger la Pull Request dans `main` → Vercel déploie en Production.

---

<details><summary>Original handoff README</summary>

# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 2 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/EMKAY FINAL.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `EMKAY Portal V2 prototype` project files (HTML prototypes, assets, components)

</details>
