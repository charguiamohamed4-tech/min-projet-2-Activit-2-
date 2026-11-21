# Rapport — « Cap sur l'Espace » (Activité 2)

Date : 21/11/2026 — version simplifiée

## 1. Ce qui a été fait

Le projet a été **simplifié** pour rester au niveau du cours « WEB AVANCE » :

- le code utilise uniquement des notions vues dans les supports ;
- aucune fonctionnalité n'a été ajoutée en plus de ce que demande le sujet ;
- chaque fonction est courte et commentée.

**Style de programmation utilisé** (le même que dans les exemples du cours) :
- des fonctions simples (`function nom() { … }`) et des variables `var` ;
- des boucles `for` et des tests `if` / `else` ;
- `document.getElementById`, `querySelectorAll`, `textContent`, `classList.add/remove/toggle/contains`, `createElement`, `appendChild` ;
- les événements écrits dans le HTML (`onclick`, `oninput`, `onsubmit`, `ondragstart`, `ondragover`, `ondrop`), et `addEventListener("click", …)` pour les boutons du clavier du pendu, qui sont créés en JavaScript ;
- `localStorage` / `sessionStorage` avec `setItem` et `getItem` et des valeurs simples (textes et nombres).

## 2. Fichiers

| Fichier | Rôle | Taille |
|---|---|---|
| `index.html` | les 5 parties et la fenêtre du profil | 206 lignes |
| `style.css` | thème clair/sombre (variables CSS), animations, carte 3D | 282 lignes |
| `script.js` | tout le JavaScript, en 8 blocs commentés | 361 lignes |
| `assets/images/*.svg` | les 6 images du Drag & Drop (avec leur nom) | 6 fichiers |
| `README.md` | présentation et données enregistrées | — |
| `assets/mission.mp4`, `assets/vangelis.mp3` | vidéo et musique | **à ajouter** |

## 3. Correspondance avec « ACTIVITE2 2026.pdf »

| Exigence du sujet | Réalisation | Où |
|---|---|---|
| 1er chargement : nom, prénom, pseudo, âge (entier) | fenêtre affichée si aucun pseudo n'est enregistré ; l'âge doit être un entier positif (`age % 1 != 0`) | `enregistrerProfil()` |
| localStorage : pseudo, nom, prénom, âge | ✔ | `enregistrerProfil()` |
| localStorage : volume audio | ✔ clé `volume` | `changerVolume()` |
| localStorage : position (si autorisée) | ✔ clés `latitude` et `longitude` | `positionTrouvee()` |
| localStorage : dernier score du pendu | ✔ clé `scorePendu` | `finPartie()` |
| localStorage : mode sombre / clair | ✔ clé `theme` | `changerTheme()` |
| localStorage : luminosité | ✔ clé `luminosite` (`filter: brightness`) | `changerLuminosite()` |
| Accueil « Explorons l'Univers » | titre | `index.html` |
| Carte CSS3 (coins arrondis, ombre, 3D) | `.carte3d` : `border-radius`, `box-shadow`, `perspective` + `rotateY` | `style.css` |
| Animation : planètes en orbite, étoiles, néon | `@keyframes tourner`, `scintiller`, `neon` | `style.css` |
| Courte vidéo | `<video controls>` (fichier à ajouter) | `index.html` |
| Musique avec boutons personnalisés | Lecture, Pause, Stop et volume | `lectureMusique()`, `pauseMusique()`, `stopMusique()` |
| Affichage du profil depuis le localStorage | carte « Mon profil » | `afficherProfil()` |
| Bouton « Commencer le voyage » | ouvre la carte | `index.html` |
| Drag & Drop : 6 images, 3 planètes et 3 autres objets | Mars, Jupiter, Saturne / Sirius, Bételgeuse, Andromède | `index.html` |
| Conteneurs « Système solaire » et « Au-delà » | ✔ | `index.html` |
| « Bravo ! » et message d'erreur explicatif | ex. « Non, Sirius est une étoile lointaine, pas une planète ! » | `drop()` |
| Mission Astronaute : mini quiz | 5 questions (planètes, gravité, missions) | `index.html` |
| Score dans le sessionStorage | ✔ clé `scoreMission` | `validerMission()` |
| « Bravo [pseudo], tu as réussi [X]% de ta mission ! » | ✔ | `validerMission()` |
| Pendu : mot au hasard parmi les 10 mots du sujet | ✔ | `nouvellePartie()` |
| Mot en tirets, clavier de 26 boutons, erreurs restantes | ✔ | `afficherMot()`, `creerClavier()` |
| Une partie de la fusée disparaît à chaque erreur | 6 parties en SVG | `jouerLettre()` |
| Bouton cliqué désactivé, 6 erreurs au maximum | ✔ | `jouerLettre()` |
| Victoire « Bravo [pseudo] ! » / défaite « Perdu ! Le mot était : XXXX » | ✔ | `finPartie()` |
| Bouton « Rejouer » | ✔ | `nouvellePartie()` |
| 5ᵉ partie : carte interactive | Leaflet, 5 lieux et « Me localiser » | `creerCarte()`, `localiser()` |

## 4. Notions du cours utilisées

| Notion | Support du cours |
|---|---|
| Drag & Drop : `draggable`, `ondragstart`, `dataTransfer.setData/getData`, `preventDefault`, `appendChild` | draganddrop2025VF.pdf, exempledd.html, tp6.pdf |
| `localStorage` / `sessionStorage` (`setItem`, `getItem`) | webstorage.pdf, tp5_webstorage.pdf |
| Géolocalisation : `"geolocation" in navigator`, `getCurrentPosition`, `error.PERMISSION_DENIED` | geolocalisation.pdf |
| Carte avec Leaflet | tp6.pdf (exercice 2) |
| `<audio>` et `<video>`, `play()`, `pause()`, `currentTime`, `volume` | API AUDIO-VIDEO.pdf, tp3_audiovideo.pdf |
| Variables CSS, thème sombre/clair avec `classList.toggle` | CSS3AVANCE_part1.pdf |
| `transform`, `transition`, `@keyframes`, `box-shadow`, `text-shadow`, dégradés, `filter` | CSS3AVANCE_part1.pdf, css3_avancé.pdf |
| Flexbox, `@media` | flex&grid.pptx, CSS3AVANCE_part2.pdf |
| Sélecteur `:checked`, `:hover`, `:disabled` | css3_avancé.pdf, CSS3AVANCE_part2.pdf |

Le reste est du JavaScript de base : `if`, `for`, `indexOf`, `Math.random`, `Math.floor`, `Number` et l'opérateur `%`.

## 5. Vérifications effectuées

- **Syntaxe :** `script.js` est sans erreur.
- **Tests automatiques :** 40 tests, 40 réussis, aucune erreur JavaScript. Ils couvrent :
  - le profil, avec le refus d'un champ vide et des âges `12.5` et `-3` ;
  - le thème, la luminosité, le volume et la musique ;
  - la navigation et la carte ;
  - le Drag & Drop (bonne zone, mauvaise zone, « Bravo ! ») ;
  - le quiz (80 % enregistrés dans le sessionStorage) ;
  - le pendu (victoire, défaite, Rejouer) ;
  - le rechargement de la page, où les préférences sont retrouvées ;
  - le refus de la géolocalisation.
- **Contrôle visuel :** fenêtre du profil, accueil, Drag & Drop et pendu en thème clair.
- **Non vérifié :**
  - la vraie carte OpenStreetMap (pas d'internet dans l'aperçu) ;
  - la lecture réelle de la vidéo et de la musique (fichiers absents) ;
  - le glisser-déposer avec une vraie souris (testé par événements simulés).

  Ces trois points sont à tester avec Live Server.

## 6. Limites et points à valider

1. **Médias à ajouter :** `assets/mission.mp4` et `assets/vangelis.mp3`. La musique de Vangelis est protégée par le droit d'auteur ; utiliser un fichier personnel, pour un usage scolaire.
2. **Soleil et comète :** le sujet les cite comme « autres objets », mais ils font partie du Système solaire. Le projet utilise donc Sirius, Bételgeuse et Andromède pour la zone « Au-delà ».
3. **Quiz :** les bonnes réponses sont repérées par `value="vrai"` dans le HTML. C'est simple, mais visible si on lit le code de la page.
4. **Supports non lus :** les archives du cours (EXAMEN1.zip, corrections des TP, exemples de géolocalisation et de webstorage) n'ont pas pu être ouvertes dans le navigateur.
