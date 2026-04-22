
// Ce bloc permet de gérer la navigation entre les différents onglets dans la section gauche
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

// ONGLET COMBAT & SORTS

// Ce bloc permet de faire fonctionner la barre de recherche comme un filtre dynamique en temps réel
let searchSpell = document.getElementById("spellSearch");
let spellCards = document.querySelectorAll(".spell-card");

searchSpell.addEventListener("input", function () {
    // On fait en sorte de supprimer toute majuscule pour uniformiser le texte de la saisie et des cartes
    let inputUser = searchSpell.value.toLowerCase();

    spellCards.forEach(function (card) {
        let spellName = card.querySelector(".spell-name").textContent.toLowerCase();

        // On affiche seulement les cartes qui contiennent la saisie de la barre de recherche
        if (spellName.includes(inputUser)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
});