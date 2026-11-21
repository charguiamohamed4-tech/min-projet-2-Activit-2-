# 🚀 Cap sur l'Espace — plan d'organisation du projet

## 1. Arborescence

```
cap-sur-espace/
├── index.html        ← structure : 5 vues + fenêtre d'identification
├── style.css         ← thèmes sombre/clair, animations, cartes 3D
├── script.js         ← toute la logique (sections numérotées 0 à 8)
├── README.md         ← ce fichier
├── RAPPORT_CONFORMITE.md ← exigences / cours / vérifications
└── assets/
    ├── images/       ← 6 images SVG du Drag & Drop (mars, jupiter, saturne, sirius, betelgeuse, andromede)
    ├── mission.mp4   ← À AJOUTER : courte vidéo (fusée, ISS…)
    └── vangelis.mp3  ← À AJOUTER : musique d'ambiance
```

Le site est une **page unique** : les 5 parties sont des `<section class="view">` affichées/masquées par JavaScript. Avantage : la musique ne s'interrompt pas quand on change de partie.

## 2. Les 5 parties (interprétation du sujet)

Le sujet annonce « 5 parties » mais n'en détaille que 4. Le texte de l'objectif cite aussi une **carte interactive** : c'est la 5ᵉ partie.

| # | Vue | Contenu |
|---|-----|---------|
| 1 | Accueil | Cartes 3D, orbites, étoiles, texte néon, vidéo, musique, fiche profil, bouton « Commencer le voyage » |
| 2 | Carte | Leaflet + OpenStreetMap, 11 sites spatiaux, bouton « Me localiser » |
| 3 | Classe le ciel | Drag & Drop de 6 objets vers 2 zones |
| 4 | Mission | Quiz de 8 questions, score en `sessionStorage` |
| 5 | Pendu | Mot au hasard, clavier virtuel, fusée qui se désassemble |

## 3. Plan de travail (étapes dans l'ordre)

**Étape 0 — Préparation (30 min)**
- [ ] Créer l'arborescence et ouvrir le dossier dans VS Code (extension *Live Server*)
- [ ] Choisir la palette (ici : bleu nuit, violet, cyan néon) et la police
- [ ] Récupérer la vidéo (ex. NASA Image and Video Library, souvent libre de droits) et la musique

**Étape 1 — Socle (1 h)**
- [ ] HTML : en-tête, navigation, 5 sections, `<dialog>` d'identification
- [ ] JS : fonction `showView()`, helpers `localStorage`
- [ ] Fenêtre au 1ᵉʳ chargement : nom, prénom, pseudo, âge (**entier** vérifié)
- [ ] Thème sombre/clair + luminosité, mémorisés

**Étape 2 — Accueil (1 h 30)**
- [ ] Carte CSS3 : `border-radius`, `box-shadow`, `perspective` + `rotateX/Y`
- [ ] Animations : `@keyframes` pour orbites, scintillement, néon
- [ ] Vidéo `<video controls>` + lecteur audio personnalisé (lecture, stop, muet, volume)
- [ ] Affichage du profil depuis le localStorage

**Étape 3 — Carte (1 h)**
- [ ] Initialiser Leaflet, ajouter les marqueurs + popups
- [ ] `navigator.geolocation` → enregistrer la position, afficher un marqueur

**Étape 4 — Drag & Drop (1 h 30)**
- [ ] `draggable`, `dragstart`, `dragover` (avec `preventDefault`), `drop`
- [ ] Messages de réussite / d'erreur explicatifs, compteur, bouton « Recommencer »

**Étape 5 — Quiz (1 h)**
- [ ] Tableau de questions (objets JS), affichage une par une, correction immédiate
- [ ] `sessionStorage.setItem('missionScore', …)` + message final avec le pseudo

**Étape 6 — Pendu (1 h 30)**
- [ ] Mot au hasard, affichage `_ _ _`, clavier de 26 boutons (désactivés une fois cliqués)
- [ ] 6 erreurs max, dessin qui évolue, victoire/défaite, bouton « Rejouer »
- [ ] Dernier score dans le `localStorage`

**Étape 7 — Finitions et tests (1 h)**
- [ ] Tester sur mobile (F12 → mode appareil), au clavier, en thème clair
- [ ] Valider le HTML (validator.w3.org), supprimer les `console.log`
- [ ] Relire le cahier des charges ligne par ligne (checklist ci-dessous)

## 4. Données enregistrées

| Stockage | Clé | Contenu |
|----------|-----|---------|
| localStorage | `pseudo`, `nom`, `prenom`, `age` | identité saisie au 1ᵉʳ chargement |
| localStorage | `volume` | de 0 à 1 |
| localStorage | `position` | `"latitude,longitude"` si autorisée (ex. `36.8065,10.1815`) |
| localStorage | `scorePendu` | texte, ex. `gagné (2 erreur(s)) — LUNE` |
| localStorage | `theme` | `dark` ou `light` |
| localStorage | `luminosite` | de 40 à 100 |
| sessionStorage | `missionScore` | pourcentage du quiz |
| sessionStorage | `missionDetail` | bonnes réponses, ex. `6/8` |

Contrôle dans le navigateur : F12 → onglet *Application* → *Local storage / Session storage*.

## 5. Checklist du cahier des charges

- [x] Demande nom, prénom, pseudo, âge (entier) au 1ᵉʳ chargement
- [x] Préférences enregistrées (pseudo, nom, prénom, âge, volume, position, score du pendu, thème, luminosité)
- [x] Carte CSS3 (coins arrondis, ombre, 3D) · animations (orbites, étoiles, néon)
- [x] Vidéo · musique avec boutons personnalisés · profil affiché · bouton « Commencer le voyage »
- [x] Drag & Drop : 3 planètes + 3 objets lointains, 2 conteneurs, « Bravo ! », erreurs explicatives
- [x] Quiz : score dans le `sessionStorage`, message final « Bravo [pseudo], tu as réussi X% de ta mission ! »
- [x] Pendu : 10 mots, clavier de 26 touches, 6 erreurs, boutons désactivés, « Rejouer », message de victoire et de défaite

## 6. Choix et points d'attention

- **Soleil et comète** : le sujet les place parmi les « étoiles / autres objets », mais ils appartiennent au Système solaire — ils seraient faux dans la zone « Au-delà ». J'ai donc choisi **Sirius, Bételgeuse et la galaxie d'Andromède** pour « Au-delà ». À discuter avec ton enseignant si tu préfères suivre le texte à la lettre.
- **Images du Drag & Drop** : 6 fichiers SVG originaux dans `assets/images/`, insérés avec des balises `<img>` dans `index.html`. Tu peux les remplacer par de vraies photos (NASA) en gardant les mêmes noms.
- **Musique** : la musique de Vangelis est protégée par le droit d'auteur ; ajoute ton propre fichier `assets/vangelis.mp3` pour un usage scolaire. Sans fichier, le lecteur affiche « fichier introuvable ».
- **Vidéo** : sans `assets/mission.mp4`, un message t'indique où la placer.
- **Lancer le site** : utilise *Live Server* (ou `python -m http.server`) plutôt qu'un double-clic : la géolocalisation et certaines fonctions marchent mieux en `http://localhost`. La carte et la police ont besoin d'internet.

## 7. Pistes d'amélioration

- Ajouter un chronomètre au quiz, des niveaux de difficulté au pendu
