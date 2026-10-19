# Médias Vision House

Déposer ici les vidéos et images des projets Vision House, puis les référencer dans `lib/data.ts` → `VH_PROJECTS`.

- Noms de fichiers : minuscules, sans espaces ni accents (ex. `client-01.mp4`, `client-01-poster.jpg`).
- Vidéos : MP4 (H.264) et, idéalement, une version WebM. Viser 1920 px de large maximum, 4 à 8 Mbit/s, sans piste audio, quelques secondes en boucle.
- Toujours fournir un `poster` (image JPG/WebP) : il s'affiche avant la lecture et pour les visiteurs en mouvement réduit.
- Taille : Vercel sert les fichiers de `public/` via son CDN. Au-delà de quelques dizaines de Mo par vidéo, préférer un hébergement vidéo dédié (Vercel Blob, Cloudflare Stream, Mux…) et mettre l'URL complète dans `mediaSrc`.
