# Projets Vision House — mode d'emploi

Chaque **dossier** = un projet affiché dans la section Vision House du site.
Toute modification enregistrée sur GitHub met le site à jour automatiquement (environ 1 minute).

## Modifier les textes d'un projet

1. Ouvrez le dossier du projet (ex. `02-n-de-natacha`), puis le fichier **`projet.txt`**.
2. Cliquez sur le **crayon** ✏️ (« Edit this file »).
3. Modifiez ce qui se trouve **après les deux-points** :

```
client: N de Natacha
secteur: Salon de coiffure
lieu: Belgique
annee: 2025
realisation: Aftermovie · campagne ads promotionnelle
services: Vidéo, Aftermovie, Publicité
format: paysage
visible: oui
video: https://www.youtube.com/watch?v=XXXXXXXXXXX
---
Ici, la description du projet (plusieurs lignes possibles).
Elle s'affiche dans la fiche du projet.
```

4. Cliquez sur **Commit changes** (en haut à droite), puis à nouveau **Commit changes**.

| Ligne | Rôle |
| --- | --- |
| `client` | Nom du client ou de la marque (obligatoire) |
| `secteur` | Type d'activité — ex. Salon de coiffure |
| `lieu` | Ville ou pays |
| `annee` | Année (facultatif) |
| `realisation` | Ce qui a été fait / le résultat |
| `services` | Séparés par des virgules |
| `format` | Forme de la carte : `paysage`, `portrait`, `carre` ou `vertical` |
| `visible` | `non` pour masquer le projet sans le supprimer |
| `video` | Lien YouTube ou Vimeo (une ligne par vidéo) — pour les vidéos lourdes |
| `lien` | Lien vers une galerie photo ou une page externe (https://…), affiché en bouton « VOIR LA GALERIE COMPLÈTE » dans la fiche du projet |
| après `---` | Description libre |

## Ajouter des photos ou des vidéos

1. Ouvrez le dossier du projet.
2. **Add file → Upload files**, glissez vos fichiers, puis **Commit changes**.

- Photos : `.jpg`, `.png`, `.webp` — idéalement 2500 px de large maximum.
- Vidéos : `.mp4` (recommandé) ou `.webm`. **Limite GitHub : 25 Mo par fichier envoyé depuis le site.**
  Au-delà, publiez la vidéo sur YouTube (en « non répertoriée » si besoin) ou Vimeo et ajoutez une ligne `video: <lien>` dans `projet.txt`.
- Ordre : les fichiers s'affichent par ordre alphabétique. Préfixez-les : `01-salle.jpg`, `02-invites.jpg`…
- Couverture (image de la carte) : le premier fichier, ou un fichier nommé **`couverture.jpg`**.
- Image d'aperçu d'une vidéo : une image portant **le même nom** que la vidéo (ex. `aftermovie.mp4` + `aftermovie.jpg`).
- Supprimer un média : ouvrez le fichier, menu **⋯ → Delete file**, puis **Commit changes**.

## Ajouter, réordonner ou supprimer un projet

- **Ajouter** : *Add file → Create new file*, tapez `05-nom-du-client/projet.txt` (le `/` crée le dossier), collez le modèle ci-dessus, puis *Commit changes*. Ajoutez ensuite les médias dans ce dossier.
- **Ordre** : le numéro au début du nom de dossier (`01-`, `02-`…).
- **Masquer** : `visible: non` dans `projet.txt`.
- **Supprimer** : supprimez tous les fichiers du dossier.
