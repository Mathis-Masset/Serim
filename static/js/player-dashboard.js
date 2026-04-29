// Bouton déconnexion
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

/* ONGLET COMPETENCES

Ce bloc permet de faire fonctionner la barre de recherche comme un filtre dynamique en temps réel */
let searchSkill = document.getElementById("skillSearch");
let skillCards = document.querySelectorAll(".group-card");

if (searchSkill) {
    searchSkill.addEventListener("input", function () {
        let inputSkill = searchSkill.value.toLowerCase();

        skillCards.forEach(function (skill) {
            let skillName = skill.querySelector(".skill-title").textContent.toLowerCase();

            if (skillName.includes(inputSkill)) {
                skill.style.display = "flex";
            } else {
                skill.style.display = "none";
            }
        });
    });
}

// ONGLET COMBAT & SORTS

// Ce bloc permet de faire fonctionner la barre de recherche comme un filtre dynamique en temps réel
let searchSpell = document.getElementById("spellSearch");
let spellCards = document.querySelectorAll(".spell-card");

if (searchSpell) {
    searchSpell.addEventListener("input", function () {
        // On fait en sorte de supprimer toute majuscule pour uniformiser le texte de la saisie et des cartes
        let inputSpell = searchSpell.value.toLowerCase();

        spellCards.forEach(function (spell) {
            let spellName = spell.querySelector(".spell-name").textContent.toLowerCase();

            // On affiche seulement les cartes qui contiennent la saisie de la barre de recherche
            if (spellName.includes(inputSpell)) {
                spell.style.display = "flex";
            } else {
                spell.style.display = "none";
            }
        });
    });
}


// ONGLET INVENTAIRE

// Barre de recherche des objets (même fonctionnement que celle des sorts)
let searchItem = document.getElementById("itemSearch");
let itemCards = document.querySelectorAll(".item-card");

if (searchItem) {
    searchItem.addEventListener("input", function () {
        let inputItem = searchItem.value.toLowerCase();

        itemCards.forEach(function (item) {
            let itemName = item.querySelector(".item-name").textContent.toLowerCase();

            if (itemName.includes(inputItem)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    });
}