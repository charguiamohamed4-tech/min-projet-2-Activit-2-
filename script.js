/* ===== Cap sur l'Espace — script ===== */

/* ---------- PROFIL (localStorage) ---------- */

// Enregistre le profil saisi dans la fenêtre du premier chargement
function enregistrerProfil(event) {
  event.preventDefault();
  var nom = document.getElementById("nom").value;
  var prenom = document.getElementById("prenom").value;
  var pseudo = document.getElementById("pseudo").value;
  var age = document.getElementById("age").value;
  var erreur = document.getElementById("erreurProfil");

  if (nom == "" || prenom == "" || pseudo == "" || age == "") {
    erreur.textContent = "Merci de remplir tous les champs.";
    return;
  }
  // L'âge doit être un nombre entier positif (le reste de la division par 1 doit être 0)
  if (age % 1 != 0 || age <= 0) {
    erreur.textContent = "L'âge doit être un nombre entier.";
    return;
  }

  localStorage.setItem("nom", nom);
  localStorage.setItem("prenom", prenom);
  localStorage.setItem("pseudo", pseudo);
  localStorage.setItem("age", age);

  document.getElementById("fenetreProfil").classList.add("cache");
  afficherProfil();
  localiser();   // on demande la position (si l'utilisateur l'autorise)
}

// Affiche le profil sur la page d'accueil
function afficherProfil() {
  document.getElementById("infoNom").textContent = localStorage.getItem("nom");
  document.getElementById("infoPrenom").textContent = localStorage.getItem("prenom");
  document.getElementById("infoPseudo").textContent = localStorage.getItem("pseudo");
  document.getElementById("infoAge").textContent = localStorage.getItem("age");
}

/* ---------- NAVIGATION ENTRE LES 5 PARTIES ---------- */

var parties = ["accueil", "carte", "classe", "mission", "pendu"];

function afficherPartie(nomPartie) {
  // On cache toutes les parties puis on affiche celle demandée
  for (var i = 0; i < parties.length; i++) {
    document.getElementById(parties[i]).classList.add("cache");
  }
  document.getElementById(nomPartie).classList.remove("cache");

  if (nomPartie == "carte") {
    creerCarte();
  }
}

/* ---------- THÈME ET LUMINOSITÉ ---------- */

function changerTheme() {
  document.body.classList.toggle("clair");
  if (document.body.classList.contains("clair")) {
    localStorage.setItem("theme", "clair");
  } else {
    localStorage.setItem("theme", "sombre");
  }
}

function changerLuminosite() {
  var valeur = document.getElementById("luminosite").value;
  document.getElementById("site").style.filter = "brightness(" + valeur + "%)";
  localStorage.setItem("luminosite", valeur);
}

/* ---------- MUSIQUE ---------- */

var musique = document.getElementById("musique");

function lectureMusique() {
  musique.play();
}

function pauseMusique() {
  musique.pause();
}

function stopMusique() {
  musique.pause();
  musique.currentTime = 0;
}

function changerVolume() {
  musique.volume = document.getElementById("volume").value;
  localStorage.setItem("volume", musique.volume);
}

/* ---------- CARTE ET GÉOLOCALISATION ---------- */

var lieux = [
  { nom: "Centre spatial Kennedy (États-Unis)", lat: 28.57, lng: -80.65, description: "Base de lancement des missions Apollo." },
  { nom: "Centre spatial guyanais (Kourou)", lat: 5.23, lng: -52.77, description: "Les fusées européennes Ariane décollent d'ici." },
  { nom: "Cosmodrome de Baïkonour (Kazakhstan)", lat: 45.96, lng: 63.30, description: "Youri Gagarine y a décollé en 1961." },
  { nom: "Cité de l'espace (Toulouse)", lat: 43.59, lng: 1.49, description: "Un parc pour découvrir l'espace." },
  { nom: "Observatoire du Paranal (Chili)", lat: -24.63, lng: -70.40, description: "Un des plus grands télescopes du monde." }
];

var carte = null;

function creerCarte() {
  if (carte != null) {
    return;   // la carte est déjà créée
  }
  carte = L.map("map").setView([30, 10], 2);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(carte);

  for (var i = 0; i < lieux.length; i++) {
    var marqueur = L.marker([lieux[i].lat, lieux[i].lng]).addTo(carte);
    marqueur.bindPopup("<b>" + lieux[i].nom + "</b><br>" + lieux[i].description);
  }
  afficherMaPosition();
}

function localiser() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(positionTrouvee, erreurPosition);
  } else {
    document.getElementById("messagePosition").textContent = "La géolocalisation n'est pas disponible.";
  }
}

function positionTrouvee(position) {
  localStorage.setItem("latitude", position.coords.latitude);
  localStorage.setItem("longitude", position.coords.longitude);
  document.getElementById("messagePosition").textContent = "Position enregistrée !";
  afficherMaPosition();
}

function erreurPosition(error) {
  if (error.code == error.PERMISSION_DENIED) {
    document.getElementById("messagePosition").textContent = "Tu n'as pas autorisé la géolocalisation.";
  } else {
    document.getElementById("messagePosition").textContent = "Impossible de trouver ta position.";
  }
}

// Ajoute un marqueur sur la carte à la position enregistrée
function afficherMaPosition() {
  var lat = localStorage.getItem("latitude");
  var lng = localStorage.getItem("longitude");
  if (carte != null && lat != null) {
    var marqueur = L.marker([Number(lat), Number(lng)]).addTo(carte);
    marqueur.bindPopup("Tu es ici, " + localStorage.getItem("pseudo") + " !").openPopup();
  }
}

/* ---------- DRAG & DROP « Classe le ciel » ---------- */

// Bonne zone de chaque image
var bonnesZones = {
  mars: "solaire", jupiter: "solaire", saturne: "solaire",
  sirius: "audela", betelgeuse: "audela", andromede: "audela"
};

// Message affiché quand l'image est mise dans la mauvaise zone
var messagesErreur = {
  mars: "Non, Mars est une planète du Système solaire !",
  jupiter: "Non, Jupiter est une planète du Système solaire !",
  saturne: "Non, Saturne est une planète du Système solaire !",
  sirius: "Non, Sirius est une étoile lointaine, pas une planète !",
  betelgeuse: "Non, Bételgeuse est une étoile très loin du Système solaire !",
  andromede: "Non, Andromède est une autre galaxie, très loin de nous !"
};

var nbBienPlaces = 0;

function drag(ev) {
  ev.dataTransfer.setData("Text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  var id = ev.dataTransfer.getData("Text");
  var zone = ev.currentTarget;   // la zone qui a reçu l'image
  var message = document.getElementById("messageDnd");

  if (bonnesZones[id] == zone.id) {
    var image = document.getElementById(id);
    zone.appendChild(image);
    image.setAttribute("draggable", "false");   // l'image est bien placée, on ne la déplace plus
    nbBienPlaces++;
    if (nbBienPlaces == 6) {
      message.textContent = "Bravo ! Tu as bien classé les 6 objets.";
    } else {
      message.textContent = "Bonne réponse !";
    }
    message.className = "bon";
  } else {
    message.textContent = messagesErreur[id];
    message.className = "faux";
  }
}

/* ---------- MISSION ASTRONAUTE (quiz, sessionStorage) ---------- */

function validerMission() {
  var score = 0;
  var reponses = document.querySelectorAll("#mission input:checked");
  for (var i = 0; i < reponses.length; i++) {
    if (reponses[i].value == "vrai") {
      score++;
    }
  }
  var pourcentage = score * 100 / 5;   // 5 questions
  sessionStorage.setItem("scoreMission", pourcentage);
  document.getElementById("resultatMission").textContent =
    "Bravo " + localStorage.getItem("pseudo") + ", tu as réussi " + pourcentage + "% de ta mission !";
}

/* ---------- JEU DU PENDU ---------- */

var mots = ["PLANETE", "FUSEE", "ETOILE", "GALAXIE", "COMETE", "LUNE", "SOLEIL", "ASTRONAUTE", "SATELLITE", "ORBITE"];
var mot = "";
var lettresTrouvees = "";
var erreurs = 0;
var partieFinie = false;

// Crée les 26 boutons du clavier
function creerClavier() {
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var clavier = document.getElementById("clavier");
  for (var i = 0; i < alphabet.length; i++) {
    var bouton = document.createElement("button");
    bouton.textContent = alphabet[i];
    bouton.className = "lettre";
    bouton.addEventListener("click", function () {
      jouerLettre(this);
    });
    clavier.appendChild(bouton);
  }
}

function nouvellePartie() {
  mot = mots[Math.floor(Math.random() * mots.length)];   // mot choisi au hasard
  lettresTrouvees = "";
  erreurs = 0;
  partieFinie = false;

  var boutons = document.querySelectorAll(".lettre");
  for (var i = 0; i < boutons.length; i++) {
    boutons[i].disabled = false;
  }
  for (var j = 1; j <= 6; j++) {
    document.getElementById("partie" + j).style.display = "inline";   // fusée complète
  }
  document.getElementById("erreursRestantes").textContent = 6;
  document.getElementById("messagePendu").textContent = "";
  afficherMot();
}

// Affiche le mot avec des tirets pour les lettres pas encore trouvées
function afficherMot() {
  var texte = "";
  for (var i = 0; i < mot.length; i++) {
    if (lettresTrouvees.indexOf(mot[i]) != -1) {
      texte = texte + mot[i] + " ";
    } else {
      texte = texte + "_ ";
    }
  }
  document.getElementById("motCache").textContent = texte;
  return texte;
}

function jouerLettre(bouton) {
  if (partieFinie) {
    return;
  }
  var lettre = bouton.textContent;
  bouton.disabled = true;   // le bouton cliqué est désactivé

  if (mot.indexOf(lettre) != -1) {
    lettresTrouvees = lettresTrouvees + lettre;
  } else {
    erreurs++;
    document.getElementById("partie" + erreurs).style.display = "none";   // une partie de la fusée disparaît
    document.getElementById("erreursRestantes").textContent = 6 - erreurs;
  }

  var texte = afficherMot();
  if (texte.indexOf("_") == -1) {
    finPartie("gagné");
  } else if (erreurs == 6) {
    finPartie("perdu");
  }
}

function finPartie(resultat) {
  partieFinie = true;
  var message = document.getElementById("messagePendu");
  if (resultat == "gagné") {
    message.textContent = "Bravo " + localStorage.getItem("pseudo") + " !";
    message.className = "bon";
  } else {
    message.textContent = "Perdu ! Le mot était : " + mot;
    message.className = "faux";
  }
  // Dernier score enregistré dans le localStorage
  localStorage.setItem("scorePendu", resultat + " avec " + erreurs + " erreur(s)");
  afficherDernierScore();
}

function afficherDernierScore() {
  var score = localStorage.getItem("scorePendu");
  if (score != null) {
    document.getElementById("dernierScore").textContent = "Dernier score : " + score;
  }
}

/* ---------- AU CHARGEMENT DE LA PAGE ---------- */

function demarrage() {
  // Thème enregistré
  if (localStorage.getItem("theme") == "clair") {
    document.body.classList.add("clair");
  }

  // Luminosité enregistrée (100 par défaut)
  var luminosite = localStorage.getItem("luminosite");
  if (luminosite == null) {
    luminosite = 100;
  }
  document.getElementById("luminosite").value = luminosite;
  changerLuminosite();

  // Volume enregistré (0.5 par défaut)
  var volume = localStorage.getItem("volume");
  if (volume == null) {
    volume = 0.5;
  }
  document.getElementById("volume").value = volume;
  musique.volume = volume;

  // Premier chargement : on demande le profil
  if (localStorage.getItem("pseudo") == null) {
    document.getElementById("fenetreProfil").classList.remove("cache");
  } else {
    afficherProfil();
  }

  creerClavier();
  nouvellePartie();
  afficherDernierScore();
}

demarrage();
