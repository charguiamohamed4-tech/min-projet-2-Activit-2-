# Cap sur l'Espace — Activité 2 (Web avancé)

Site sur le thème de l'espace en 5 parties : accueil, carte, Drag & Drop, quiz et jeu du pendu.

## Fichiers

- `index.html` : la page avec les 5 parties (une seule est affichée à la fois)
- `style.css` : la mise en forme, le thème clair/sombre et les animations
- `script.js` : le JavaScript
- `assets/images/` : les 6 images du Drag & Drop
- `assets/mission.mp4` : la vidéo (à ajouter)
- `assets/vangelis.mp3` : la musique (à ajouter)

## Ce qui est enregistré

| Où | Clé | Contenu |
|----|-----|---------|
| localStorage | `nom`, `prenom`, `pseudo`, `age` | le profil saisi au premier chargement |
| localStorage | `volume` | volume de la musique (0 à 1) |
| localStorage | `latitude`, `longitude` | la position, si elle est autorisée |
| localStorage | `scorePendu` | le dernier score du pendu |
| localStorage | `theme` | `sombre` ou `clair` |
| localStorage | `luminosite` | de 40 à 100 |
| sessionStorage | `scoreMission` | le pourcentage du quiz |

## Lancer le site

Ouvrir `index.html` avec Live Server dans VS Code. La carte a besoin d'internet.
