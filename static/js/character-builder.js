/* FONCTIONNEMENT DES ONGLETS

Il faut pouvoir permettre de changer d'étape et de savoir à quel étape nous sommes*/
const tabs = document.getElementsByClassName("tab");
const steps = document.getElementsByClassName("step");

let currentTab = 0;

// Fonction qui permet l'affichage de l'onglet en cours ainsi que l'indication visuelle dans la barre de progression en haut de l'écran
function showTab(n) {
    console.log("Appel de showTab pour l'index :", n);

    // On fait d'abord en sorte que tous les onglets soient tous nettoyés des styles pour les uniformiser
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
        steps[i].className = "step";
    }

    // n est le paramètre reçu depuis l'event onclick dans la page html
    tabs[n].style.display = "flex";
    tabs[n].style.flexDirection = "column";
    steps[n].className = "step active";

    // le paramètre permet de savoir sur quel onglet nous sommes
    currentTab = n;

    // On fait en sorte que le bouton Précédent n'apparaisse pas à la première étape
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }

    // On fait en sorte que le bouton Suivant devienne Terminer à la dernière étape
    if (n == (tabs.length - 1)) {
        document.getElementById("nextBtn").textContent = "Terminer";
        document.getElementById("nextBtn").style.fontFamily = "Galdeano";
        document.getElementById("nextBtn").style.fontSize = "1rem";
    } else {
        document.getElementById("nextBtn").textContent = "Suivant";
        document.getElementById("nextBtn").style.fontFamily = "Galdeano";
        document.getElementById("nextBtn").style.fontSize = "1rem";
    }
}

// Fonction qui permet au clic des boutons d'avancer ou de reculer de 1 onglet
function nextPrev(move) {
    let nextIndex = currentTab + move;

    if (nextIndex >= 0 && nextIndex < tabs.length) {
        showTab(nextIndex);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // On met par défaut le premier onglet
    showTab(0);

    // Ce bloc permet d'ajouter un écouteur aux cartes et d'inscrire le choix de la carte sélectionnée dans le récapitulatif à droite
    let cards = document.querySelectorAll(".card");

    cards.forEach(function (card) {
        card.addEventListener("click", function () {
            let choice = this.getAttribute("data-value");
            let recapDiv = this.getAttribute("data-recap");
            let recapSection = document.getElementById(recapDiv);

            if (recapSection) {
                recapSection.textContent = choice;
            }

            console.log("Carte sélectionnée : ", choice);
        });
    });

    // Ce bloc empêche la validation du formulaire sans le nom du personnage
    let form = document.getElementById("characterForm");

    if (form) {
        form.addEventListener("submit", function (event) {
            let characterName = document.getElementById("characterName").value;

            if (characterName.trim() === "") {
                alert("Le nom du personnage est obligatoire.");
                event.preventDefault();
            }
        })
    }

    // Fenêtre modale du bouton "Je veux décrire mon personnage"
    let modalBtn = document.getElementById("describeBtn");
    let modal = document.getElementById("descriptionModal");
    let saveBtn = document.getElementById("saveDescription");
    let closeBtn = document.getElementById("closeModal");

    if (modalBtn && modal && closeBtn) {
        modalBtn.addEventListener("click", function (event) {
            event.preventDefault();
            modal.style.display = "flex";
        });

        closeBtn.addEventListener("click", function (event) {
            event.preventDefault();
            modal.style.display = "none";
        });

        if (saveBtn) {
            saveBtn.addEventListener("click", function (event) {
                event.preventDefault();
                console.log("Description sauvegardée");
                modal.style.display = "none";
            });
        }
    }
})

