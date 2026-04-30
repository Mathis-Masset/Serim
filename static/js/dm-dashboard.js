// BOUTON DECONNEXION
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    /* try {
    const response = await fetch("mettre l'url de l'API ici/logout", {
    method: "POST"
    });

    if (!response.ok) {
        alert("Erreur de serveur");
        throw new Error(`Statut de réponse : ${response.status}`);
    } else {
        alert("Vous avez été déconnecté");
        window.location.href = "index.html";
    }
    

    } catch (error) {
    console.error("Erreur lors de la déconnexion : ", error.message);
    window.location.href = "index.html"; 
    }
    */
});

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
    console.log("L'événement " + message + " a été ajouté dans l'historique");

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