
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