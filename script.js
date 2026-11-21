/* =========================================================
   Cap sur l'Espace — script principal
   0. Outils            1. Profil & préférences (localStorage)
   2. Navigation        3. Musique d'ambiance et vidéo
   4. Carte interactive (géolocalisation + Leaflet)
   5. Drag & Drop       6. Quiz (sessionStorage)
   7. Pendu             8. Démarrage
   ========================================================= */

/* ---------- 0. OUTILS ---------- */

// Mélange un tableau (on travaille sur une copie pour ne pas modifier l'original)
function shuffle(tab) {
  var copie = tab.slice();
  for (var i = copie.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = copie[i];
    copie[i] = copie[j];
    copie[j] = temp;
  }
  return copie;
}

// Pseudo enregistré dans le localStorage (ou « astronaute » par défaut)
function getPseudo() {
  var pseudo = localStorage.getItem("pseudo");
  if (pseudo) return pseudo;
  return "astronaute";
}

// Affiche un message dans un élément ; type = "ok" (vert) ou "bad" (rouge)
function setMsg(el, text, type) {
  el.textContent = text;
  el.className = "msg";
  if (type) el.classList.add(type);
}

/* ---------- 1. PROFIL & PRÉFÉRENCES ---------- */
/* Clés localStorage : nom, prenom, pseudo, age, volume, position,
   scorePendu, theme, luminosite */
var profil = document.getElementById("profileDialog");
var profilPremier = false;   // vrai au 1er chargement : la fenêtre ne peut pas être annulée

function hasProfile() {
  return localStorage.getItem("nom") && localStorage.getItem("prenom") &&
         localStorage.getItem("pseudo") && localStorage.getItem("age");
}

function renderProfile() {
  document.getElementById("pPrenom").textContent = localStorage.getItem("prenom") || "—";
  document.getElementById("pNom").textContent = localStorage.getItem("nom") || "—";
  document.getElementById("pPseudo").textContent = localStorage.getItem("pseudo") || "—";
  if (localStorage.getItem("age")) {
    document.getElementById("pAge").textContent = localStorage.getItem("age") + " ans";
  } else {
    document.getElementById("pAge").textContent = "—";
  }
  document.getElementById("helloPseudo").textContent = getPseudo();

  // La position est enregistrée sous la forme "latitude,longitude"
  var pos = localStorage.getItem("position");
  var coords = pos ? pos.split(",") : [];
  if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
    document.getElementById("pPos").textContent =
      Number(coords[0]).toFixed(2) + "°, " + Number(coords[1]).toFixed(2) + "°";
  } else {
    document.getElementById("pPos").textContent = "non partagée";
  }
}

function openProfile(first) {
  document.getElementById("f-prenom").value = localStorage.getItem("prenom") || "";
  document.getElementById("f-nom").value = localStorage.getItem("nom") || "";
  document.getElementById("f-pseudo").value = localStorage.getItem("pseudo") || "";
  document.getElementById("f-age").value = localStorage.getItem("age") || "";
  document.getElementById("profileErr").textContent = "";
  profilPremier = first;
  if (first) document.getElementById("profileCancel").setAttribute("hidden", "");
  else document.getElementById("profileCancel").removeAttribute("hidden");
  profil.removeAttribute("hidden");
}

function closeProfile() {
  profil.setAttribute("hidden", "");
}

document.getElementById("profileCancel").addEventListener("click", closeProfile);
document.getElementById("profileBtn").addEventListener("click", function () {
  openProfile(false);
});

document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var prenom = document.getElementById("f-prenom").value.trim();
  var nom = document.getElementById("f-nom").value.trim();
  var pseudo = document.getElementById("f-pseudo").value.trim();
  var age = document.getElementById("f-age").value.trim();
  var err = document.getElementById("profileErr");

  if (prenom === "" || nom === "" || pseudo === "") {
    err.textContent = "Merci de remplir tous les champs.";
    return;
  }
  // L'âge doit être un entier : Number(age) et parseInt(age) doivent donner la même valeur
  if (age === "" || isNaN(age) || Number(age) !== parseInt(age) || Number(age) < 1 || Number(age) > 120) {
    err.textContent = "L'âge doit être un nombre entier entre 1 et 120.";
    return;
  }
  var first = profilPremier;
  localStorage.setItem("prenom", prenom);
  localStorage.setItem("nom", nom);
  localStorage.setItem("pseudo", pseudo);
  localStorage.setItem("age", parseInt(age));
  profilPremier = false;
  closeProfile();
  renderProfile();
  if (first) askGeolocation();
});

/* Thème sombre / clair : la classe light-theme redéfinit les variables CSS */
function applyTheme(t) {
  if (t === "light") document.body.classList.add("light-theme");
  else document.body.classList.remove("light-theme");
  document.getElementById("themeBtn").textContent = (t === "light") ? "☀️" : "🌙";
  localStorage.setItem("theme", t);
}
document.getElementById("themeBtn").addEventListener("click", function () {
  document.body.classList.toggle("light-theme");
  var clair = document.body.classList.contains("light-theme");
  applyTheme(clair ? "light" : "dark");
});

/* Luminosité : un calque noir plus ou moins opaque (opacity) */
function applyBrightness(v) {
  v = Number(v);
  if (isNaN(v) || v < 40 || v > 100) v = 100;
  document.getElementById("dim").style.opacity = (100 - v) / 100;
  document.getElementById("brightness").value = v;
  localStorage.setItem("luminosite", v);
}
document.getElementById("brightness").addEventListener("input", function () {
  applyBrightness(this.value);
});

/* Géolocalisation (si autorisée) */
function askGeolocation() {
  var status = document.getElementById("geoStatus");
  if ("geolocation" in navigator) {
    status.textContent = "Localisation en cours…";
    navigator.geolocation.getCurrentPosition(showPosition, showError, { timeout: 10000 });
  } else {
    status.textContent = "La géolocalisation n'est pas prise en charge par ce navigateur.";
  }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  localStorage.setItem("position", lat + "," + lng);
  document.getElementById("geoStatus").textContent = "Position enregistrée ✔";
  renderProfile();
  showUserMarker(true);
}

function showError(error) {
  var status = document.getElementById("geoStatus");
  switch (error.code) {
    case error.PERMISSION_DENIED:
      status.textContent = "Position non autorisée (ce n'est pas grave !).";
      break;
    case error.POSITION_UNAVAILABLE:
      status.textContent = "Position indisponible.";
      break;
    case error.TIMEOUT:
      status.textContent = "La demande de position a expiré.";
      break;
    default:
      status.textContent = "Erreur inconnue de géolocalisation.";
      break;
  }
}

/* ---------- 2. NAVIGATION ---------- */
var VIEWS = ["accueil", "carte", "classe", "mission", "pendu"];

function showView(name) {
  if (VIEWS.indexOf(name) === -1) name = "accueil";
  for (var i = 0; i < VIEWS.length; i++) {
    var section = document.getElementById("view-" + VIEWS[i]);
    if (VIEWS[i] === name) section.removeAttribute("hidden");
    else section.setAttribute("hidden", "");
  }
  var boutons = document.querySelectorAll("#nav button");
  for (var j = 0; j < boutons.length; j++) {
    if (boutons[j].getAttribute("data-view") === name) boutons[j].classList.add("active");
    else boutons[j].classList.remove("active");
  }
  if (name === "carte") initMap();
}

// Boutons du menu
var navBoutons = document.querySelectorAll("#nav button");
for (var n = 0; n < navBoutons.length; n++) {
  navBoutons[n].addEventListener("click", function () {
    showView(this.getAttribute("data-view"));
  });
}
// Liens « aller à » (logo, « Commencer le voyage », « Jeu du pendu »)
var liensGoto = document.querySelectorAll("[data-goto]");
for (var g = 0; g < liensGoto.length; g++) {
  liensGoto[g].addEventListener("click", function (e) {
    e.preventDefault();
    showView(this.getAttribute("data-goto"));
  });
}

/* ---------- 3. MUSIQUE D'AMBIANCE ET VIDÉO ---------- */
/* Lecteur sans contrôles natifs : boutons personnalisés (lecture/pause, stop, muet, volume) */
var musique = document.getElementById("musique");
var musiqueOk = true;   // passe à false si assets/vangelis.mp3 est introuvable

function renderMusic() {
  document.getElementById("musicToggle").textContent = musique.paused ? "▶" : "⏸";
  document.getElementById("musicMute").textContent = (musique.muted || musique.volume === 0) ? "🔇" : "🔊";
  var txt = "En pause";
  if (!musiqueOk) txt = "Fichier assets/vangelis.mp3 introuvable : ajoute ta musique dans le dossier assets.";
  else if (!musique.paused) txt = "Lecture : assets/vangelis.mp3";
  document.getElementById("musicStatus").textContent = txt;
}

function lectureMusique() {
  if (!musiqueOk) { renderMusic(); return; }
  if (musique.paused) musique.play();
  else musique.pause();
}

function stopMusique() {
  musique.pause();
  musique.currentTime = 0;
  renderMusic();
}

function initMusic() {
  var volume = localStorage.getItem("volume");
  if (volume === null || isNaN(volume)) volume = 0.5;
  musique.volume = Number(volume);
  document.getElementById("volume").value = musique.volume;
  renderMusic();
}

document.getElementById("musicToggle").addEventListener("click", lectureMusique);
document.getElementById("musicStop").addEventListener("click", stopMusique);
document.getElementById("musicMute").addEventListener("click", function () {
  musique.muted = !musique.muted;
  renderMusic();
});
document.getElementById("volume").addEventListener("input", function () {
  musique.volume = Number(this.value);
  musique.muted = false;
  localStorage.setItem("volume", this.value);
  renderMusic();
});
// Événements du média : on met à jour l'affichage à chaque lecture / pause
musique.addEventListener("play", renderMusic);
musique.addEventListener("pause", renderMusic);
// Fichier audio introuvable
document.querySelector("#musique source").addEventListener("error", function () {
  musiqueOk = false;
  renderMusic();
});
// Fichier vidéo introuvable : on affiche une indication
document.querySelector("#missionVideo source").addEventListener("error", function () {
  document.getElementById("videoHint").removeAttribute("hidden");
});

/* ---------- 4. CARTE INTERACTIVE ---------- */
var SITES = [
  { name: "Centre spatial Kennedy", country: "États-Unis (Floride)", lat: 28.5729, lng: -80.6490, desc: "Base de lancement des missions Apollo et des navettes spatiales." },
  { name: "Johnson Space Center", country: "États-Unis (Houston)", lat: 29.5518, lng: -95.0970, desc: "Centre de contrôle des vols habités de la NASA." },
  { name: "Centre spatial guyanais", country: "France (Kourou)", lat: 5.2322, lng: -52.7693, desc: "Port spatial de l'Europe : décollage d'Ariane et de Vega." },
  { name: "Cité de l'espace", country: "France (Toulouse)", lat: 43.5864, lng: 1.4934, desc: "Parc de découverte consacré à l'exploration spatiale." },
  { name: "ESTEC (ESA)", country: "Pays-Bas (Noordwijk)", lat: 52.2182, lng: 4.4203, desc: "Principal centre technique de l'Agence spatiale européenne." },
  { name: "Cosmodrome de Baïkonour", country: "Kazakhstan", lat: 45.9650, lng: 63.3050, desc: "Premier cosmodrome du monde : Spoutnik et Gagarine y ont décollé." },
  { name: "Satish Dhawan", country: "Inde (Sriharikota)", lat: 13.7199, lng: 80.2304, desc: "Site de lancement de l'agence spatiale indienne (ISRO)." },
  { name: "Jiuquan", country: "Chine", lat: 40.9606, lng: 100.2984, desc: "Cosmodrome des vols habités chinois." },
  { name: "Tanegashima", country: "Japon", lat: 30.4000, lng: 130.9700, desc: "Centre spatial japonais, sur une île du sud du pays." },
  { name: "Observatoire du Paranal", country: "Chili", lat: -24.6272, lng: -70.4045, desc: "Abrite le Very Large Telescope, au cœur du désert d'Atacama." },
  { name: "Mauna Kea", country: "États-Unis (Hawaï)", lat: 19.8206, lng: -155.4681, desc: "Sommet à plus de 4 000 m couvert d'observatoires astronomiques." }
];

var map = null;
var userMarker = null;

function initMap() {
  // La carte existe déjà : on recalcule seulement sa taille (elle était dans une section cachée)
  if (map !== null) {
    setTimeout(function () { map.invalidateSize(); }, 60);
    return;
  }
  if (typeof L === "undefined") {
    document.getElementById("map").innerHTML =
      "<p class='hint' style='padding:1rem'>La carte (Leaflet) n'a pas pu être chargée : vérifie ta connexion internet.</p>";
    return;
  }
  map = L.map("map").setView([25, 10], 2);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(map);

  for (var i = 0; i < SITES.length; i++) {
    var s = SITES[i];
    s.marker = L.marker([s.lat, s.lng]).addTo(map);
    s.marker.bindPopup("<b>" + s.name + "</b><br><i>" + s.country + "</i><br>" + s.desc);
  }
  showUserMarker(false);
  setTimeout(function () { map.invalidateSize(); }, 60);
}

function showUserMarker(centrer) {
  var pos = localStorage.getItem("position");
  if (map === null || !pos) return;
  var coords = pos.split(",");
  var lat = Number(coords[0]);
  var lng = Number(coords[1]);
  if (isNaN(lat) || isNaN(lng)) return;
  if (userMarker !== null) map.removeLayer(userMarker);
  userMarker = L.marker([lat, lng]).addTo(map);
  userMarker.bindPopup("Tu es ici, " + getPseudo() + " !");
  if (centrer) {
    map.setView([lat, lng], 5);
    userMarker.openPopup();
  }
}

function buildSiteChips() {
  var list = document.getElementById("siteList");
  for (var i = 0; i < SITES.length; i++) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = SITES[i].name;
    b.setAttribute("data-index", i);
    b.addEventListener("click", function () {
      var s = SITES[Number(this.getAttribute("data-index"))];
      initMap();
      if (map !== null) {
        map.setView([s.lat, s.lng], 6);
        s.marker.openPopup();
      }
    });
    list.appendChild(b);
  }
}
document.getElementById("geoBtn").addEventListener("click", askGeolocation);

/* ---------- 5. DRAG & DROP « Classe le ciel » ---------- */
// id = id de l'image dans index.html ; zone = conteneur attendu
var ITEMS = [
  { id: "mars", name: "Mars", zone: "solaire",
    ok: "Mars est la « planète rouge », 4e planète du Système solaire.",
    wrong: "Non, Mars est une planète de notre Système solaire, pas un objet lointain !" },
  { id: "jupiter", name: "Jupiter", zone: "solaire",
    ok: "Jupiter est la plus grosse planète du Système solaire.",
    wrong: "Non, Jupiter est une planète géante qui orbite autour de notre Soleil !" },
  { id: "saturne", name: "Saturne", zone: "solaire",
    ok: "Saturne est célèbre pour ses magnifiques anneaux.",
    wrong: "Non, Saturne est une planète du Système solaire, pas un astre lointain !" },
  { id: "sirius", name: "Sirius", zone: "audela",
    ok: "Sirius est l'étoile la plus brillante du ciel nocturne, à environ 8,6 années-lumière.",
    wrong: "Non, Sirius est une étoile lointaine, pas une planète !" },
  { id: "betelgeuse", name: "Bételgeuse", zone: "audela",
    ok: "Bételgeuse est une supergéante rouge de la constellation d'Orion, à des centaines d'années-lumière.",
    wrong: "Non, Bételgeuse est une étoile géante située très loin du Système solaire !" },
  { id: "andromede", name: "Andromède", zone: "audela",
    ok: "La galaxie d'Andromède se trouve à environ 2,5 millions d'années-lumière.",
    wrong: "Non, Andromède est une galaxie entière, à des millions d'années-lumière !" }
];

var dnd = { placed: 0, errors: 0, selected: null };

function findItem(id) {
  for (var i = 0; i < ITEMS.length; i++) {
    if (ITEMS[i].id === id) return ITEMS[i];
  }
  return null;
}

function updateDndCounters() {
  document.getElementById("dndErr").textContent = dnd.errors;
  document.getElementById("dndOk").textContent = dnd.placed;
}

// (Re)place les 6 images dans la réserve, dans un ordre aléatoire
function buildDnd() {
  var pool = document.getElementById("pool");
  var ordre = shuffle(ITEMS);
  for (var i = 0; i < ordre.length; i++) {
    var el = document.getElementById(ordre[i].id);
    el.classList.remove("placed");
    el.classList.remove("selected");
    el.setAttribute("draggable", "true");
    pool.appendChild(el);
  }
  dnd.placed = 0;
  dnd.errors = 0;
  dnd.selected = null;
  updateDndCounters();
  setMsg(document.getElementById("dndMsg"), "");
}

// Alternative au glisser (écran tactile) : on touche l'objet puis la zone
function selectObj(id) {
  var el = document.getElementById(id);
  if (el.classList.contains("placed")) return;
  var selection = document.querySelectorAll(".obj.selected");
  for (var i = 0; i < selection.length; i++) selection[i].classList.remove("selected");
  if (dnd.selected === id) {
    dnd.selected = null;
    return;
  }
  dnd.selected = id;
  el.classList.add("selected");
}

function placeObj(id, zoneKey) {
  var it = findItem(id);
  if (it === null) return;
  var el = document.getElementById(id);
  if (el.classList.contains("placed")) return;
  el.classList.remove("selected");
  dnd.selected = null;

  if (it.zone === zoneKey) {
    // Bonne zone : l'image devient enfant du conteneur (appendChild)
    el.classList.add("placed");
    el.setAttribute("draggable", "false");
    document.querySelector(".zone[data-zone='" + zoneKey + "'] .drops").appendChild(el);
    dnd.placed++;
    updateDndCounters();
    if (dnd.placed === ITEMS.length) {
      var bilan = "sans aucune erreur";
      if (dnd.errors === 1) bilan = "avec 1 erreur";
      if (dnd.errors > 1) bilan = "avec " + dnd.errors + " erreurs";
      setMsg(document.getElementById("dndMsg"), "🎉 Bravo ! " + getPseudo() + ", tu as classé les 6 objets " + bilan + ".", "ok");
    } else {
      setMsg(document.getElementById("dndMsg"), "✅ Correct ! " + it.ok, "ok");
    }
  } else {
    // Mauvaise zone : l'image reste à sa place, message d'erreur explicatif
    dnd.errors++;
    updateDndCounters();
    el.classList.add("shake");
    setTimeout(function () { el.classList.remove("shake"); }, 500);
    setMsg(document.getElementById("dndMsg"), "❌ " + it.wrong, "bad");
  }
}

function initDnd() {
  // Étape 1 et 2 : éléments draggables, on stocke leur id dans dataTransfer
  var objets = document.querySelectorAll(".obj");
  for (var i = 0; i < objets.length; i++) {
    objets[i].addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", this.id);
      e.dataTransfer.effectAllowed = "move";
      this.classList.add("dragging");
    });
    objets[i].addEventListener("dragend", function () {
      this.classList.remove("dragging");
    });
    objets[i].addEventListener("click", function () {
      selectObj(this.id);
    });
  }
  // Étapes 3 et 4 : zones de dépôt (dragover autorise le drop, drop récupère l'id)
  var zones = document.querySelectorAll(".zone");
  for (var j = 0; j < zones.length; j++) {
    zones[j].addEventListener("dragover", function (e) {
      e.preventDefault();
      this.classList.add("over");
    });
    zones[j].addEventListener("dragleave", function () {
      this.classList.remove("over");
    });
    zones[j].addEventListener("drop", function (e) {
      e.preventDefault();
      this.classList.remove("over");
      var id = e.dataTransfer.getData("text/plain");
      placeObj(id, this.getAttribute("data-zone"));
    });
    zones[j].addEventListener("click", function () {
      if (dnd.selected !== null) placeObj(dnd.selected, this.getAttribute("data-zone"));
    });
  }
  document.getElementById("dndReset").addEventListener("click", buildDnd);
}

/* ---------- 6. QUIZ « Mission Astronaute » ---------- */
var QUESTIONS = [
  { q: "Quelle est la planète la plus proche du Soleil ?", good: "Mercure", bad: ["Vénus", "Mars", "La Terre"],
    why: "Mercure orbite à environ 58 millions de km du Soleil." },
  { q: "Sur la Lune, ton poids serait environ…", good: "six fois plus faible que sur Terre", bad: ["identique à celui sur Terre", "deux fois plus grand", "nul"],
    why: "La gravité lunaire vaut environ 1/6 de la gravité terrestre : on y fait de grands bonds !" },
  { q: "Pourquoi les astronautes flottent-ils dans l'ISS ?", good: "Ils sont en chute libre permanente autour de la Terre", bad: ["Il n'y a plus de gravité là-haut", "L'air de la station les soulève", "Des aimants les attirent vers le plafond"],
    why: "À 400 km d'altitude, la gravité reste forte (près de 90 %) : la station et ses occupants tombent ensemble en orbite." },
  { q: "Qui fut le premier humain dans l'espace (1961) ?", good: "Youri Gagarine", bad: ["Neil Armstrong", "Buzz Aldrin", "Thomas Pesquet"],
    why: "Youri Gagarine a fait le tour de la Terre à bord de Vostok 1, le 12 avril 1961." },
  { q: "En quelle année Apollo 11 a-t-elle posé des hommes sur la Lune ?", good: "1969", bad: ["1961", "1972", "1981"],
    why: "Neil Armstrong et Buzz Aldrin ont marché sur la Lune le 20 juillet 1969." },
  { q: "Quelle est la plus grosse planète du Système solaire ?", good: "Jupiter", bad: ["Saturne", "Neptune", "La Terre"],
    why: "Jupiter est si grosse qu'elle pourrait contenir plus de 1 000 Terres." },
  { q: "À quelle altitude orbite environ la Station spatiale internationale ?", good: "400 km", bad: ["40 km", "4 000 km", "40 000 km"],
    why: "L'ISS fait le tour de la Terre en environ 90 minutes, à environ 400 km d'altitude." },
  { q: "D'où décolle la fusée européenne Ariane ?", good: "De Kourou, en Guyane", bad: ["De Cap Canaveral", "De Baïkonour", "De Toulouse"],
    why: "Kourou est proche de l'équateur : la rotation de la Terre y donne un coup de pouce aux lancements (retrouve-le sur la carte !)." }
];

var quiz = { order: [], i: 0, score: 0, locked: false };

function startQuiz() {
  quiz.order = shuffle(QUESTIONS);
  quiz.i = 0;
  quiz.score = 0;
  quiz.locked = false;
  document.getElementById("qBody").removeAttribute("hidden");
  document.getElementById("qEnd").setAttribute("hidden", "");
  var last = sessionStorage.getItem("missionScore");
  if (last !== null) document.getElementById("qLast").textContent = "Dernier score de la session : " + last + "%";
  else document.getElementById("qLast").textContent = "";
  showQuestion();
}

function showQuestion() {
  var total = quiz.order.length;
  var item = quiz.order[quiz.i];
  quiz.locked = false;
  document.getElementById("qCount").textContent = "Question " + (quiz.i + 1) + " / " + total;
  document.getElementById("qBar").style.width = (quiz.i / total * 100) + "%";
  document.getElementById("qText").textContent = item.q;
  setMsg(document.getElementById("qFeedback"), "");
  document.getElementById("qNext").setAttribute("hidden", "");

  var box = document.getElementById("qOptions");
  box.innerHTML = "";
  var choix = item.bad.slice();
  choix.push(item.good);
  choix = shuffle(choix);
  for (var k = 0; k < choix.length; k++) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "opt";
    b.textContent = choix[k];
    b.addEventListener("click", function () {
      answer(this);
    });
    box.appendChild(b);
  }
}

function answer(btn) {
  if (quiz.locked) return;
  quiz.locked = true;
  var item = quiz.order[quiz.i];
  var options = document.querySelectorAll(".opt");
  for (var k = 0; k < options.length; k++) {
    options[k].disabled = true;
    if (options[k].textContent === item.good) options[k].classList.add("good");
  }
  if (btn.textContent === item.good) {
    quiz.score++;
    setMsg(document.getElementById("qFeedback"), "✅ Bonne réponse ! " + item.why, "ok");
  } else {
    btn.classList.add("wrong");
    setMsg(document.getElementById("qFeedback"), "❌ Pas tout à fait. " + item.why, "bad");
  }
  var next = document.getElementById("qNext");
  if (quiz.i === quiz.order.length - 1) next.textContent = "Voir mon résultat 🚀";
  else next.textContent = "Question suivante →";
  next.removeAttribute("hidden");
}

function endQuiz() {
  var total = quiz.order.length;
  var pct = Math.round(quiz.score / total * 100);
  sessionStorage.setItem("missionScore", pct);                     // score stocké dans le sessionStorage
  sessionStorage.setItem("missionDetail", quiz.score + "/" + total);
  document.getElementById("qBar").style.width = "100%";
  document.getElementById("qBody").setAttribute("hidden", "");
  document.getElementById("qEnd").removeAttribute("hidden");
  document.getElementById("qCount").textContent = "Mission terminée";
  document.getElementById("qEndMsg").textContent = "Bravo " + getPseudo() + ", tu as réussi " + pct + "% de ta mission !";

  var sub = quiz.score + " bonne(s) réponse(s) sur " + total + ". ";
  if (pct >= 80) sub += "Tout est prêt pour le décollage ! 🚀";
  else if (pct >= 50) sub += "Encore un peu d'entraînement avant le décollage.";
  else sub += "Retourne à l'entraînement, astronaute : tu peux refaire la mission !";
  document.getElementById("qEndSub").textContent = sub;
}

document.getElementById("qNext").addEventListener("click", function () {
  if (quiz.i === quiz.order.length - 1) {
    endQuiz();
  } else {
    quiz.i++;
    showQuestion();
  }
});
document.getElementById("qRestart").addEventListener("click", startQuiz);

/* ---------- 7. PENDU ---------- */
var WORDS = ["PLANETE", "FUSEE", "ETOILE", "GALAXIE", "COMETE", "LUNE", "SOLEIL", "ASTRONAUTE", "SATELLITE", "ORBITE"];
var MAX_ERRORS = 6;
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var hang = { word: "", found: "", errors: 0, over: false, lastWord: "" };   // found = lettres trouvées

function buildKeyboard() {
  var kb = document.getElementById("hKeys");
  kb.innerHTML = "";
  for (var i = 0; i < ALPHABET.length; i++) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "key";
    b.textContent = ALPHABET.charAt(i);
    b.setAttribute("data-letter", ALPHABET.charAt(i));
    b.addEventListener("click", function () {
      guess(this.getAttribute("data-letter"));
    });
    kb.appendChild(b);
  }
}

// Affiche le mot sous forme de tirets ; en cas de défaite, le mot complet est révélé
function renderWord() {
  var box = document.getElementById("hWord");
  box.innerHTML = "";
  for (var i = 0; i < hang.word.length; i++) {
    var ch = hang.word.charAt(i);
    var s = document.createElement("span");
    if (hang.found.indexOf(ch) !== -1 || (hang.over && hang.errors >= MAX_ERRORS)) s.textContent = ch;
    else s.textContent = "_";
    box.appendChild(s);
  }
}

function startHangman() {
  // Mot choisi au hasard (différent du précédent)
  var mot;
  do {
    mot = WORDS[Math.floor(Math.random() * WORDS.length)];
  } while (mot === hang.lastWord);
  hang.word = mot;
  hang.lastWord = mot;
  hang.found = "";
  hang.errors = 0;
  hang.over = false;

  var parties = document.querySelectorAll("#rocket .gone");
  for (var i = 0; i < parties.length; i++) parties[i].classList.remove("gone");
  var touches = document.querySelectorAll(".key");
  for (var k = 0; k < touches.length; k++) {
    touches[k].disabled = false;
    touches[k].classList.remove("hit");
    touches[k].classList.remove("miss");
  }
  document.getElementById("hLeft").textContent = MAX_ERRORS;
  setMsg(document.getElementById("hMsg"), "");
  renderWord();
}

function guess(letter) {
  if (hang.over) return;
  var key = document.querySelector(".key[data-letter='" + letter + "']");
  if (key === null || key.disabled) return;
  key.disabled = true;                                   // le bouton cliqué est désactivé

  if (hang.word.indexOf(letter) !== -1) {
    hang.found += letter;
    key.classList.add("hit");
  } else {
    hang.errors++;
    key.classList.add("miss");
    var part = document.getElementById("rk-" + hang.errors);   // une partie de la fusée disparaît
    if (part !== null) part.classList.add("gone");
    document.getElementById("hLeft").textContent = MAX_ERRORS - hang.errors;
  }

  var won = true;
  for (var i = 0; i < hang.word.length; i++) {
    if (hang.found.indexOf(hang.word.charAt(i)) === -1) won = false;
  }
  var lost = hang.errors >= MAX_ERRORS;
  if (won || lost) endHangman(won);
  else renderWord();
}

function endHangman(won) {
  hang.over = true;
  var touches = document.querySelectorAll(".key");
  for (var k = 0; k < touches.length; k++) touches[k].disabled = true;
  renderWord();
  if (won) setMsg(document.getElementById("hMsg"), "🎉 Bravo " + getPseudo() + " !", "ok");
  else setMsg(document.getElementById("hMsg"), "💥 Perdu ! Le mot était : " + hang.word, "bad");

  // Dernier score enregistré dans le localStorage : gagné/perdu + nombre d'erreurs
  var resultat = won ? "gagné" : "perdu";
  localStorage.setItem("scorePendu", resultat + " (" + hang.errors + " erreur(s)) — " + hang.word);
  renderLastHangman();
}

function renderLastHangman() {
  var s = localStorage.getItem("scorePendu");
  if (s) document.getElementById("hLast").textContent = "Dernier score : " + s;
  else document.getElementById("hLast").textContent = "Pas encore de partie jouée";
}

document.getElementById("hReplay").addEventListener("click", startHangman);
// Clavier physique (uniquement quand la vue Pendu est visible et la fenêtre de profil fermée)
document.addEventListener("keydown", function (e) {
  if (document.getElementById("view-pendu").hasAttribute("hidden")) return;
  if (!profil.hasAttribute("hidden") || e.ctrlKey || e.altKey || e.metaKey) return;
  var lettre = e.key.toUpperCase();
  if (lettre.length === 1 && ALPHABET.indexOf(lettre) !== -1) guess(lettre);
});

/* ---------- 8. DÉMARRAGE ---------- */
// Fond étoilé : 90 étoiles placées au hasard, animées par @keyframes twinkle
function buildStars() {
  var box = document.getElementById("starfield");
  for (var i = 0; i < 90; i++) {
    var s = document.createElement("span");
    s.className = "star";
    var size = Math.random() * 2.2 + 0.8;
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.animationDelay = Math.random() * 4 + "s";
    s.style.animationDuration = 2 + Math.random() * 3 + "s";
    box.appendChild(s);
  }
}

function init() {
  if (typeof(Storage) === "undefined") {
    alert("Désolé, votre navigateur ne supporte pas le web storage...");
    return;
  }
  buildStars();
  applyTheme(localStorage.getItem("theme") === "light" ? "light" : "dark");
  applyBrightness(localStorage.getItem("luminosite") || 100);
  initMusic();
  buildSiteChips();
  initDnd();
  buildDnd();
  startQuiz();
  buildKeyboard();
  startHangman();
  renderLastHangman();
  renderProfile();
  showView("accueil");
  if (!hasProfile()) openProfile(true);   // 1er chargement : on demande l'identité
}
document.addEventListener("DOMContentLoaded", init);
