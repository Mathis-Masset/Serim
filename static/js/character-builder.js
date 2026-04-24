/* FONCTIONNEMENT DES ETAPES (ONGLETS)
Il faut pouvoir permettre de changer d'étape et de savoir à quel étape nous sommes*/

// Déclaration des variables
const tabs = document.getElementsByClassName("tab");
const steps = document.getElementsByClassName("step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentTab = 0;

// Fonction qui permet l'affichage de l'onglet en cours ainsi que l'indication visuelle dans la barre de progression en haut de l'écran
function showTab(n) {
    console.log("Appel de showTab pour l'index :", n);

    // On fait d'abord en sorte que tous les onglets soient tous nettoyés des styles pour les uniformiser et on les cache avant d'afficher le bon onglet
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
        steps[i].className = "step";
    }

    // On affiche l'onglet actif avec le paramètre n reçu depuis l'event onclick de la page html
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
    } else {
        document.getElementById("nextBtn").textContent = "Suivant";
    }
}

// Fonction qui permet au clic des boutons d'avancer ou de reculer d'un onglet
function nextPrev(move) {
    let nextIndex = currentTab + move;

    if (nextIndex >= 0 && nextIndex < tabs.length) {
        showTab(nextIndex);
    }
}

/* Fonction qui permet de calculer le modificateur d'une caractéristique à partir de sa valeur et d'afficher le résultat dans le récapitulatif à droite
8 et 9 valent -1 ; 10 et 11 valent +0 ; 12 et 13 valent +1 ; 14 et 15 valent +2 et ainsi de suite
*/
function modifierCalculator(stat) {
    let modifier = Math.floor((stat - 10) / 2);
    if (modifier >= 0) {
        return "+" + modifier;
    } else {
        return modifier;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("Page chargée");
    // On met par défaut le premier onglet
    showTab(0);

    // Ce bloc permet d'ajouter un écouteur aux cartes et d'inscrire le choix de la carte sélectionnée dans le récapitulatif à droite
    let cards = document.querySelectorAll(".hidden-radio");

    cards.forEach(function (radio) {
        radio.addEventListener("change", function (event) {
            // On récupère le nom de la carte sélectionnée en remontant jusqu'à la div parente qui contient le nom de la carte
            let cardName = radio.closest(".card").querySelector(".card-name").textContent;

            if (radio.name === "class-choice") {
                let classChoice = document.getElementById("recapClass");
                classChoice.textContent = cardName;
                console.log("Classe sélectionnée : " + cardName);
            } else if (radio.name === "species-choice") {
                let speciesChoice = document.getElementById("recapSpecies");
                speciesChoice.textContent = cardName;
                console.log("Race sélectionnée : " + cardName);
            } else if (radio.name === "background-choice") {
                let backgroundChoice = document.getElementById("recapBg");
                backgroundChoice.textContent = cardName;
                console.log("Background sélectionné : " + cardName);
            } else if (radio.name === "starter-kit") {
                let kitChoice = document.getElementById("recapEquipment");
                kitChoice.textContent = cardName;
                console.log("Kit sélectionné : " + cardName);
            } else if (radio.name === "weapon-choice") {
                let weaponChoice = document.getElementById("recapWeapon");
                weaponChoice.textContent = cardName;
                console.log("Arme sélectionnée : " + cardName);
            }
        })
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

    /* Ce bloc permet à l'utilisateur d'ajouter ou diminuer les points de caractéristiques en tenant compte des points restants à répartir */
    let pointsLeft = 8;
    let pointsDisplay = document.getElementById("pointsLeft");

    // FORCE

    //Déclaration des variables
    let increaseStr = document.getElementById("increaseStr");
    let decreaseStr = document.getElementById("decreaseStr");
    let strValue = document.getElementById("strValue");
    let strInput = document.getElementById("strInput");

    // L'action +
    increaseStr.addEventListener("click", function () {
        let value = parseInt(strValue.textContent);
        // On vérifie d'abord si la valeur actuelle de la caractéristique n'a pas déjà atteint le max et s'il reste encore des points à répartir
        if (value < 20 && pointsLeft > 0) {
            let newValue = value + 1;
            // On met à jour la valeur de l'input caché
            strInput.value = newValue;
            // On met à jour la valeur affichée sur l'interface
            strValue.textContent = newValue;
            pointsLeft = pointsLeft - 1;
            // Pareil pour les points restants affichés
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            // On met à jour le modificateur dans le récapitulatif à droite
            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapStrModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Force augmentée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // L'action -
    decreaseStr.addEventListener("click", function () {
        let value = parseInt(strValue.textContent);
        // On vérifie si la valeur est bien supérieure à la valeur minimale (8)
        if (value > 8) {
            let newValue = value - 1;
            strInput.value = newValue;
            strValue.textContent = newValue;
            pointsLeft = pointsLeft + 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;
            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapStrModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Force diminuée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // J'ai fait le même bloc de code pour les 5 autres caractéristiques

    // DEXTERITE

    //Déclaration des variables
    let increaseDex = document.getElementById("increaseDex");
    let decreaseDex = document.getElementById("decreaseDex");
    let dexValue = document.getElementById("dexValue");
    let dexInput = document.getElementById("dexInput");

    increaseDex.addEventListener("click", function () {
        let value = parseInt(dexValue.textContent);
        if (value < 20 && pointsLeft > 0) {
            let newValue = value + 1;
            dexInput.value = newValue;
            dexValue.textContent = newValue;
            pointsLeft = pointsLeft - 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;
            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapDexModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Dextérité augmentée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    decreaseDex.addEventListener("click", function () {
        let value = parseInt(dexValue.textContent);
        if (value > 8) {
            let newValue = value - 1;
            dexInput.value = newValue;
            dexValue.textContent = newValue;
            pointsLeft = pointsLeft + 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;
            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapDexModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Dextérité diminuée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // CONSTITUTION

    //Déclaration des variables
    let increaseCon = document.getElementById("increaseCon");
    let decreaseCon = document.getElementById("decreaseCon");
    let conValue = document.getElementById("conValue");
    let conInput = document.getElementById("conInput");

    increaseCon.addEventListener("click", function () {
        let value = parseInt(conValue.textContent);
        if (value < 20 && pointsLeft > 0) {
            let newValue = value + 1;
            conInput.value = newValue;
            conValue.textContent = newValue;
            pointsLeft = pointsLeft - 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapConModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Constitution augmentée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    decreaseCon.addEventListener("click", function () {
        let value = parseInt(conValue.textContent);
        if (value > 8) {
            let newValue = value - 1;
            conInput.value = newValue;
            conValue.textContent = newValue;
            pointsLeft = pointsLeft + 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;
            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapConModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Constitution diminuée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // INTELLIGENCE

    //Déclaration des variables
    let increaseInt = document.getElementById("increaseInt");
    let decreaseInt = document.getElementById("decreaseInt");
    let intValue = document.getElementById("intValue");
    let intInput = document.getElementById("intInput");

    increaseInt.addEventListener("click", function () {
        let value = parseInt(intValue.textContent);
        if (value < 20 && pointsLeft > 0) {
            let newValue = value + 1;
            intInput.value = newValue;
            intValue.textContent = newValue;
            pointsLeft = pointsLeft - 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;
            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapIntModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Intelligence augmentée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    decreaseInt.addEventListener("click", function () {
        let value = parseInt(intValue.textContent);
        if (value > 8) {
            let newValue = value - 1;
            intInput.value = newValue;
            intValue.textContent = newValue;
            pointsLeft = pointsLeft + 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;
            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapIntModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Intelligence diminuée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // SAGESSE

    //Déclaration des variables
    let increaseWis = document.getElementById("increaseWis");
    let decreaseWis = document.getElementById("decreaseWis");
    let wisValue = document.getElementById("wisValue");
    let wisInput = document.getElementById("wisInput");

    increaseWis.addEventListener("click", function () {
        let value = parseInt(wisValue.textContent);
        if (value < 20 && pointsLeft > 0) {
            let newValue = value + 1;
            wisInput.value = newValue;
            wisValue.textContent = newValue;
            pointsLeft = pointsLeft - 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;
            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapWisModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Sagesse augmentée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    decreaseWis.addEventListener("click", function () {
        let value = parseInt(wisValue.textContent);
        if (value > 8) {
            let newValue = value - 1;
            wisInput.value = newValue;
            wisValue.textContent = newValue;
            pointsLeft = pointsLeft + 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;
            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapWisModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Sagesse diminuée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // CHARISME

    //Déclaration des variables
    let increaseCha = document.getElementById("increaseCha");
    let decreaseCha = document.getElementById("decreaseCha");
    let chaValue = document.getElementById("chaValue");
    let chaInput = document.getElementById("chaInput");

    increaseCha.addEventListener("click", function () {
        let value = parseInt(chaValue.textContent);
        if (value < 20 && pointsLeft > 0) {
            let newValue = value + 1;
            chaInput.value = newValue;
            chaValue.textContent = newValue;
            pointsLeft = pointsLeft - 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;
            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapChaModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Charisme augmenté : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    decreaseCha.addEventListener("click", function () {
        let value = parseInt(chaValue.textContent);
        if (value > 8) {
            let newValue = value - 1;
            chaInput.value = newValue;
            chaValue.textContent = newValue;
            pointsLeft = pointsLeft + 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;
            let modifierValue = modifierCalculator(newValue);
            let modifierDisplay = document.getElementById("recapChaModif");
            modifierDisplay.textContent = modifierValue;
            console.log("Charisme diminué : " + newValue + " | Points restants : " + pointsLeft);
        }
    });
})