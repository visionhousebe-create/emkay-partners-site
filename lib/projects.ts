// Projets Vision House — modèle partagé (site + lecture des dossiers).
// Le contenu se gère dans GitHub : un dossier par projet dans public/vision-house/ (voir public/vision-house/LISEZ-MOI.md).

export type ProjectFormat = '16/9' | '4/5' | '1/1' | '9/16';

/** image / video : fichier du dossier (ou URL directe .mp4) ; embed : lecteur YouTube ou Vimeo. */
export type ProjectMedia = { url: string; type: 'image' | 'video' | 'embed'; poster?: string; alt?: string };

export type Project = {
  id: string;
  /** Nom du client ou de la marque — ex. « N de Natacha ». */
  client: string;
  /** Secteur / type de client — ex. « Salon de coiffure ». */
  sector: string;
  /** Ville ou pays — ex. « Bruxelles ». */
  location: string;
  /** Ce qui a été fait / le résultat — ex. « Aftermovie · campagne ads promotionnelle ». */
  title: string;
  /** Texte libre affiché dans la fiche du projet. */
  description: string;
  year: string;
  services: string[];
  /** Proportion de la carte et du média principal. */
  format: ProjectFormat;
  /** Ordre d'affichage dans la fiche ; la couverture est en premier. */
  media: ProjectMedia[];
  /** Lien externe facultatif (galerie photo, article…) — ex. une galerie Pixieset. */
  link?: string;
  published: boolean;
};

/** Média affiché sur la carte : première photo ou vidéo du dossier (les lecteurs YouTube / Vimeo n'y sont pas utilisés). */
export const coverOf = (p: Project) => p.media.find((m) => m.type !== 'embed');
