# Rapport de mission — « Cap sur l'Espace » (Activité 2)

Date : 21/11/2026

## 1. Ce qui a été fait

**État de départ.** Les 5 parties du site étaient déjà programmées (accueil, carte, Drag & Drop, quiz, pendu). Il ne manquait aucune fonctionnalité. En revanche, `script.js` utilisait des notions **absentes des supports du cours** « WEB AVANCE ».

**Choix retenu** (validé par l'étudiant) : une **mise en conformité stricte**. Le code a été réécrit dans le style des exemples de l'enseignante, **avec les mêmes fonctionnalités, les mêmes noms de fonctions et le même découpage en sections (0 à 8)**.

| Notion remplacée | Remplacée par (vu en cours) | Support |
|---|---|---|
| Synthé Web Audio (`AudioContext`, oscillateurs) | balise `<audio>` + `play()`, `pause()`, `currentTime = 0`, `volume`, `muted` | API AUDIO-VIDEO.pdf, HTML5-audiovideo.pdf |
| `async` / `await` | appels directs à `play()` / `pause()` + événements `play` / `pause` du média | HTML5-audiovideo.pdf (« media events ») |
| Module IIFE avec *getters* (`Music`) | variables globales + fonctions (`lectureMusique`, `stopMusique`…) | API AUDIO-VIDEO.pdf (`var lecteur; function lecture()…`) |
| `try / catch` autour du stockage | `if (typeof(Storage) !== "undefined")` | webstorage.pdf p. 7 |
| `JSON.parse` / `JSON.stringify` | chaînes simples (`"lat,lng"`, `"gagné (2 erreur(s)) — LUNE"`) | webstorage.pdf ; geolocalisation.pdf p. 21 (`lat + "," + lon`) |
| `<dialog>` / `showModal()` | `<div class="modal" hidden>` + `setAttribute` / `removeAttribute("hidden")` | API AUDIO-VIDEO.pdf (`controlesBox.removeAttribute("hidden")`) |
| `history.replaceState`, `closest()` | `addEventListener` sur chaque bouton + `this.getAttribute(...)` | Exercice3.html (`this.className`), CSS3AVANCE_part1 |
| `Set`, opérateur `...`, déstructuration, `Array.from`, `.find/.every/.includes/.map` | chaînes, `indexOf`, boucles `for` | Exercice3.html (boucles `for (var i…)`) |
| `dataset`, helpers `$` / `$$`, fonctions fléchées, gabarits `` ` ` `` | `getElementById`, `querySelector(All)`, `getAttribute`, `function () {}`, concaténation | tous les exemples du cours |
| Thème via `data-theme` sur `<html>` | classe `light-theme` sur `<body>` + `classList.toggle/contains` + variables CSS | CSS3AVANCE_part1 p. 75-81 |
| Erreurs de géolocalisation (un seul message) | `showError(error)` avec `switch (error.code)` | geolocalisation.pdf p. 14-16 |
| Marqueurs Leaflet personnalisés (`divIcon`, `flyTo`) | `L.marker`, `bindPopup`, `setView` | tp6.pdf (Leaflet demandé) |
| Images du Drag & Drop dessinées en JS | 6 fichiers SVG + balises `<img>` dans des éléments `draggable="true"` | draganddrop2025VF.pdf, exempledd.html |
| CSS : `aspect-ratio`, `inset`, `min()`, `accent-color`, `prefers-reduced-motion`, `::backdrop` | largeur/hauteur, `top/left/right/bottom`, `max-width`, `max-height` | css3_avancé.pdf, flex&grid.pptx |

## 2. Fichiers créés, modifiés ou supprimés

| Fichier | Action |
|---|---|
| `script.js` | réécrit (mêmes fonctionnalités, notions du cours uniquement) |
| `index.html` | modifié : `<dialog>` → `div.modal` ; ajout de `<audio id="musique">` ; 6 images du Drag & Drop écrites dans le HTML ; suppression de `data-theme` |
| `style.css` | modifié : thème clair via `body.light-theme` ; fenêtre `.modal` ; images `.obj img` ; remplacement des propriétés hors cours |
| `assets/images/*.svg` (6 fichiers) | créés (dessins repris du code d'origine) |
| `README.md` | mis à jour (arborescence, format des données) |
| `RAPPORT_CONFORMITE.md` | créé (ce document) |
| aucun | supprimé |

## 3. Correspondance avec « ACTIVITE2 2026.pdf »

| Exigence | Réalisation | Où |
|---|---|---|
| 1er chargement : nom, prénom, pseudo, âge (entier) | fenêtre obligatoire ; âge entier entre 1 et 120 | `index.html` #profileDialog, `script.js` §1 |
| localStorage : pseudo, nom, prénom, âge | ✔ | §1 |
| localStorage : volume audio | ✔ clé `volume` | §3 |
| localStorage : position (si autorisée) | ✔ clé `position` = `"lat,lng"` | §1 `showPosition` |
| localStorage : dernier score du pendu | ✔ clé `scorePendu` | §7 `endHangman` |
| localStorage : mode sombre / clair | ✔ clé `theme` | §1 `applyTheme` |
| localStorage : luminosité | ✔ clé `luminosite` | §1 `applyBrightness` |
| Accueil : carte CSS3 (coins arrondis, ombre, 3D) | `.card3d` : `border-radius`, `box-shadow`, `perspective` + `rotateX/Y` | `style.css` §4 |
| Animations : orbites, étoiles scintillantes, néon | `@keyframes spin / twinkle / neon` | `style.css` §2, §5 |
| Courte vidéo | `<video controls>` (fichier `assets/mission.mp4` **à fournir**) | `index.html` |
| Musique Vangelis + boutons personnalisés | lecture/pause, stop, muet, volume (fichier `assets/vangelis.mp3` **à fournir**) | §3 |
| Affichage nom, prénom, pseudo, âge | fiche d'astronaute | §1 `renderProfile` |
| Bouton « Commencer le voyage » | ✔ (va à la carte) | `index.html` |
| Drag & Drop : 6 images, 3 planètes + 3 objets lointains | Mars, Jupiter, Saturne / Sirius, Bételgeuse, Andromède | §5 |
| Conteneurs « Système solaire » et « Au-delà » | ✔ | `index.html` |
| « Bravo ! » / message d'erreur explicatif | ✔ ex. « Non, Sirius est une étoile lointaine, pas une planète ! » | §5 `placeObj` |
| Mission Astronaute : quiz | 8 questions (planètes, gravité, missions) | §6 |
| Score dans le sessionStorage | ✔ clé `missionScore` | §6 `endQuiz` |
| « Bravo [pseudo], tu as réussi [X]% de ta mission ! » | ✔ texte exact | §6 |
| Pendu : mot au hasard parmi les 10 mots | ✔ liste du sujet | §7 |
| Mot en tirets, clavier de 26 boutons, erreurs restantes | ✔ | §7 |
| Dessin qui évolue (fusée qui disparaît) | 6 parties de fusée en SVG | `index.html` #rocket |
| Bouton cliqué désactivé ; 6 erreurs max | ✔ | §7 `guess` |
| Victoire « Bravo [pseudo] ! » / défaite « Perdu ! Le mot était : XXXX » | ✔ | §7 `endHangman` |
| Bouton « Rejouer » | ✔ | §7 |
| 5ᵉ partie (non détaillée) : carte interactive | Leaflet + 11 sites + « Me localiser » | §4 |

## 4. Vérifications effectuées

**Vérification technique.**
- `node --check script.js` : syntaxe correcte.
- Recherche automatique des notions hors cours dans `script.js` : aucune trouvée. Les 2 seuls résultats sont des faux positifs (`L.map` de Leaflet, « ... » dans un texte).
- Contrôle croisé : chaque `getElementById` du script correspond à un `id` présent dans `index.html`.
- Les 6 SVG ont été vérifiés comme XML valide.

**Tests fonctionnels automatisés.** Script jsdom : **68 tests, 68 réussis, aucune erreur JavaScript**. Ils couvrent :
- le 1er chargement ;
- le refus des âges `12.5`, `abc` et `0` ;
- l'enregistrement du profil et de la position ;
- le thème et la luminosité ;
- le volume et le bouton muet ;
- les messages quand la vidéo ou la musique sont absentes ;
- la navigation ;
- le Drag & Drop : erreur explicative, placement, sélection au toucher, « Bravo ! », bouton Recommencer ;
- le quiz : 75 % enregistré dans le sessionStorage et absent du localStorage ;
- le pendu : victoire, défaite, fusée, touches désactivées, Rejouer, clavier physique ;
- le rechargement de la page, où toutes les préférences sont retrouvées ;
- le refus de la géolocalisation.

**Contrôle visuel** dans le navigateur intégré, avec une copie autonome de la page qui a ensuite été supprimée :
- la fenêtre d'identification ;
- l'accueil ;
- le Drag & Drop avec message d'erreur ;
- le pendu en thème clair ;
- la largeur téléphone (375 px), sans défilement horizontal.

**Non vérifié** :
- la carte Leaflet réelle et les tuiles OpenStreetMap (pas de réseau dans l'aperçu) ;
- la lecture réelle de l'audio et de la vidéo (fichiers absents) ;
- le glisser-déposer à la souris réelle : il a été testé par événements simulés.

À tester avec Live Server.

## 5. Conformité avec les supports Google Classroom (cours « WEB AVANCE »)

**Lus en entier** :
- draganddrop2025VF.pdf, exempledd.html, Exercice3.html, tp6.pdf (DnD) ;
- webstorage.pdf, « Méthodes et événement du webstorage.pdf », tp5_webstorage.pdf ;
- geolocalisation.pdf, tp6.pdf (géolocalisation, Leaflet) ;
- API AUDIO-VIDEO.pdf, HTML5-audiovideo.pdf, tp3_audiovideo.pdf ;
- CSS3AVANCE_part1.pdf, CSS3AVANCE_part2.pdf, css3_avancé.pdf, TP1_CSS3.pdf, TP2_CSS3.pdf ;
- flex&grid.pptx (texte seulement) ;
- ACTIVITE2 2026.pdf.

**Lu en partie** : GRILLE.pdf (8 pages sur 12).

**Non lus** (le téléchargement est bloqué dans le navigateur intégré et Drive ne montre pas le contenu) :
- EXAMEN1.zip, dont seuls les noms de fichiers sont visibles : dsi21_G2.html, kanban.html, examen1.docx, examen2.docx ;
- correction TP1.rar, corTP2.rar ;
- EXEMPLES GEOLOCALISATION.rar, Exemplewebstorage.rar ;
- correctionTP3.rar, correctionTP3.zip ;
- ressources.zip, exemples.zip ;
- exemple2 (fichier sans extension).

## 6. Limitations et points à valider avec l'enseignante

1. **Médias à fournir** : `assets/mission.mp4` et `assets/vangelis.mp3`. La musique de Vangelis est protégée par le droit d'auteur : seul l'étudiant peut ajouter un fichier pour un usage scolaire.
2. **Soleil et comète** : le sujet les cite comme exemples d'« étoiles / autres objets ». Ils appartiennent pourtant au Système solaire, ce qui les rendrait faux dans la zone « Au-delà ». Le projet utilise donc Sirius, Bételgeuse et Andromède.
3. **Leaflet** : c'est une bibliothèque externe, mais elle est explicitement demandée dans tp6.pdf (exercice 2). Seules ses fonctions de base sont utilisées.
4. **Notions de JavaScript de base** non montrées dans les supports lus mais indispensables : `trim()`, `split()`, `indexOf()`, `charAt()`, `slice()`, `push()`, `toFixed()`, `Math.random/floor/round`, `isNaN()`. Elles relèvent des bases du langage, pas des API HTML5 du cours.
5. **`backdrop-filter`** (flou derrière la fenêtre et les cartes) est conservé. Le cours CSS3AVANCE_part2 (p. 25-27) présente l'effet « le fond derrière le texte devient flou », mais l'exemple `effetsvisuals.html` n'a pas pu être lu.
6. **Anciennes données** : une position enregistrée au format JSON par l'ancienne version est ignorée sans erreur (« non partagée »). Il suffit de cliquer sur « Me localiser » pour la réenregistrer.
7. **Les archives non lues** (§5) peuvent contenir d'autres conventions de l'enseignante. Pour les intégrer, il faut les télécharger dans le dossier du projet afin que je les analyse.
