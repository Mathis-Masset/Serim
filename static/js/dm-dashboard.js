/* NAVIGATION ENTRE ONGLETS
Ce bloc permet de gérer la navigation entre les différents onglets dans la section gauche */
let tabBtn = document.querySelectorAll(".tab-btn");
let tabContent = document.querySelectorAll(".main-content .tab");

tabBtn.forEach(function (button) {
    button.addEventListener("click", function () {

        // On nettoie les classes actives de tous les boutons
        tabBtn.forEach(function (btn) {
            btn.classList.remove("active");
        });

        // Pareil pour les contenus d'onglet
        tabContent.forEach(function (content) {
            content.classList.remove("active");
        });

        // On active seulement le bouton cliqué et son contenu associé
        this.classList.add("active");

        let targetTab = this.getAttribute("data-tab");
        console.log("Navigation vers l'onglet : " + targetTab);
        let contentTarget = document.getElementById(targetTab);

        if (contentTarget !== null) {
            contentTarget.classList.add("active");
        } else {
            console.log("Aucun contenu trouvé pour l'onglet : " + targetTab);
        }
    });
});

/* HISTORIQUE
Objectif : L'utilisateur doit pouvoir garder une trace de ses actions très récentes
 
Cette fonction permet d'ajouter un li dans l'historique à chaque action effectuée par le joueur
A chaque fois qu'on fera appel à la fonction, on mettra entre parenthèses le message que l'on voudra afficher dans l'historique */
function addToRecord(message) {
    const recordList = document.getElementById("recordList");
    const recordLine = document.createElement("li");
    // On récupère la date et l'heure
    const now = new Date();
    // On prend seulement les heures et les minutes
    const time = now.getHours() + ":" + now.getMinutes();

    recordLine.textContent = "[" + time + "] : " + message;

    // Pour le confort, l'action venant d'être réalisée se place tout en haut de la liste
    recordList.insertBefore(recordLine, recordList.firstChild);
    console.log("Ajout dans l'historique : " + message);

    // Si l'historique fait plus de 5 lignes, on supprime la plus ancienne
    if (recordList.children.length > 5) {
        recordList.removeChild(recordList.lastChild);
    }
}

// LANCER DE DES
/* Fonction pour le lancer de dés
On prend le nombre de faces du dé en paramètre (selon si c'est un d20, d4, d6, etc)
On génère un chiffre entre 0 et 1 avec Math.random qu'on multiplie par le nombre de faces et on ajoute 1 pour avoir un résultat de 1 au max de sides */
function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

const rollDiceBtn = document.getElementById("diceThrow");
const diceModal = document.getElementById("diceModal");
const diceBtns = document.querySelectorAll(".dice-btn");
const closeDiceModalBtn = document.getElementById("closeDiceModalBtn");

/* Bouton Lancer de dés dans la colonne de gauche
Ce bouton fait apparaître la modale contenant tous les dés que l'utilisateur peut lancer */
rollDiceBtn.addEventListener("click", function (event) {
    event.preventDefault();

    diceModal.style.display = "flex";
});

// On utilise la fonction rollDice(sides) en prenant en compte le data-dice pour le nombre de faces
diceBtns.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
        event.preventDefault();

        let diceSides = parseInt(btn.getAttribute("data-dice"));
        let result = rollDice(diceSides);

        alert("Lancer de d" + diceSides + " : vous avez fait un " + result + " !");
        addToRecord("Lancer de d" + diceSides + " = " + result);
        console.log("Jet de d" + diceSides + " = " + result);

    });
});

// Fermer la modale
closeDiceModalBtn.addEventListener("click", function (event) {
    event.preventDefault();

    diceModal.style.display = "none";
});


// ONGLET GESTION DE CAMPAGNE

// Bouton +1 niveau
// Bouton donner de l'or
// Bouton appliquer un état

// BOUTON COPIER
const copyBtn = document.getElementById("copyBtn");

copyBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const targetElement = document.querySelector(copyBtn.dataset.copy);
    const textToCopy = targetElement.textContent.trim();
    navigator.clipboard.writeText(textToCopy).then(function () {
        const label = copyBtn.querySelector(".copy-label");
        const originalText = "Copier";

        copyBtn.disabled = true;
        label.textContent = "Copié !";

        setTimeout(function () {
            copyBtn.disabled = false;
            label.textContent = originalText;
        }, 1000);
    });
});

// Bouton bannir
// Clic carte joueur pour ouvrir modale dashboard joueur

// ONGLET NOTES & SCENARIO

// Liste de notes
const notes = document.getElementById("dmNotes");
const addNotesBtn = document.getElementById("addNotesBtn");
const notesList = document.getElementById("notesList");

addNotesBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const noteText = notes.value.trim();

    if (noteText === "") {
        alert("Veuillez écrire quelque chose avant d'ajouter !");
        return;
    }

    const noteLine = document.createElement("li");
    noteLine.textContent = noteText;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.className = "red-btn delete-btn";

    deleteBtn.addEventListener("click", function (event) {
        event.preventDefault();
        noteLine.remove();
        addToRecord("Note supprimée : " + noteText);
    });

    noteLine.appendChild(deleteBtn);
    notesList.appendChild(noteLine);

    notes.value = "";

    addToRecord("Note ajoutée : " + noteText);
});

// Sauvegarde scénario dans le bookmark
// Affichage onglet bookmark


// Bouton supprimer li notes
// Bouton supprimer li scénario
// Gestion de quêtes

// ONGLET BESTIAIRE

/* BARRE DE RECHERCHE DES ENNEMIS
Ce bloc permet de faire fonctionner la barre de recherche comme un filtre dynamique en temps réel */
const searchEnemy = document.getElementById("enemySearch");
const enemyCards = document.querySelectorAll(".enemy-card");

if (searchEnemy) {
    searchEnemy.addEventListener("input", function () {
        // On fait en sorte de supprimer toute majuscule pour uniformiser le texte de la saisie et des cartes
        let inputEnemy = searchEnemy.value.toLowerCase();

        enemyCards.forEach(function (enemy) {
            let enemyName = enemy.querySelector(".enemy-name").textContent.toLowerCase();

            // On affiche seulement les cartes qui contiennent la saisie de la barre de recherche
            if (enemyName.includes(inputEnemy)) {
                enemy.style.display = "grid";
            } else {
                enemy.style.display = "none";
            }
        });
    });
}

/* BOUTON AJOUTER AU COMBAT
Objectif : Lorsque l'utilisateur appuie sur le bouton "Ajouter au combat" d'une carte ennemi, cette dernière est notée dans l'historique */

const addToCombatBtns = document.querySelectorAll(".add-to-combat-btn");

// Petite sécurité si jamais on n'est pas dans le bon onglet
if (addToCombatBtns.length > 0) {
    addToCombatBtns.forEach(function (btn) {

        btn.addEventListener("click", function (event) {
            event.preventDefault();
            // On récupère le nom de l'ennemi de la carte parente du bouton appuyé
            const enemyName = btn.closest(".enemy-card").querySelector(".enemy-name").textContent;
            // On l'utilise dans le paramètre de la fonction pour l'historique
            addToRecord("Vous avez ajouté " + enemyName + " au combat");
            console.log("Ajout d'un ennemi au combat : " + enemyName);
        });
    });
}