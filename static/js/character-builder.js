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

    /*On fait d'abord en sorte que tous les onglets soient tous nettoyés des styles pour les uniformiser et on les cache avant d'afficher le bon onglet
    Pour cela, on fait une boucle for qui parcourt chaque tab afin d'appliquer le display none et la classe "step" */
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
        steps[i].className = "step";
    }

    // On affiche l'onglet actif avec le paramètre n reçu depuis l'event onclick de la page html et on applique un style et une classe
    tabs[n].style.display = "flex";
    tabs[n].style.flexDirection = "column";
    steps[n].className = "step active";

    // le paramètre permet de savoir sur quel onglet nous sommes
    currentTab = n;

    // On fait en sorte que le bouton Précédent n'apparaisse pas à la première étape
    if (n === 0) {
        prevBtn.style.display = "none";
    } else {
        prevBtn.style.display = "inline";
    }

    // On fait en sorte que le bouton Suivant devienne Terminer à la dernière étape
    if (n === (tabs.length - 1)) {
        nextBtn.textContent = "Terminer";
    } else {
        nextBtn.textContent = "Suivant";
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
    // J'ai utilisé Math.floor() pour arrondir les chiffres à virgule
    let modifier = Math.floor((stat - 10) / 2);
    // Si c'est un chiffre positif (incluant 0), à l'affichage, on met un + devant
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

    // Fenêtre modale du bouton "Je veux décrire mon personnage"
    const modalBtn = document.getElementById("describeBtn");
    const modal = document.getElementById("descriptionModal");
    const saveBtn = document.getElementById("saveDescription");
    const closeBtn = document.getElementById("closeModal");

    if (modalBtn && modal && closeBtn) {
        // Au clic du bouton "Je veux décrire mon personnage", on empêche le rechargement de la page et on fait apparaître la modale grâce au display flex
        modalBtn.addEventListener("click", function (event) {
            event.preventDefault();
            modal.style.display = "flex";
        });

        // Inversement, lorsque l'on clique sur le bouton "Fermer la description", on fait disparaître la modale avec un display none
        closeBtn.addEventListener("click", function (event) {
            event.preventDefault();
            modal.style.display = "none";
        });

        /* Ce bouton ne fait rien mais c'est surtout UX d'avoir un bouton qui ferme la modale tout en ayant la description toujours dans le textarea
        (le bouton rouge "Fermer la description" n'est pas très rassurant pour l'utilisateur s'il écrit une description)*/
        if (saveBtn) {
            saveBtn.addEventListener("click", function (event) {
                event.preventDefault();
                console.log("Description sauvegardée");
                modal.style.display = "none";
            });
        }
    }

    // Ce bloc permet d'ajouter un écouteur aux cartes et d'inscrire le choix de la carte sélectionnée dans le récapitulatif à droite
    const cards = document.querySelectorAll(".hidden-radio");

    cards.forEach(function (radio) {
        radio.addEventListener("change", function (event) {
            // On récupère le nom de la carte sélectionnée en remontant jusqu'à la div parente qui contient le nom de la carte
            const cardName = radio.closest(".card").querySelector(".card-name").textContent;

            // On va inscrire en temps réel le choix dans le récap dans le bon container en fonction de l'étape de la carte sélectionnée (si c'est une classe, une race, etc)
            if (radio.name === "class-choice") {
                const classChoice = document.getElementById("recapClass");
                classChoice.textContent = cardName;
                updateHP();
                console.log("Classe sélectionnée : " + cardName);

            } else if (radio.name === "species-choice") {
                const speciesChoice = document.getElementById("recapSpecies");
                speciesChoice.textContent = cardName;
                console.log("Race sélectionnée : " + cardName);

            } else if (radio.name === "background-choice") {
                const backgroundChoice = document.getElementById("recapBg");
                backgroundChoice.textContent = cardName;
                console.log("Background sélectionné : " + cardName);

            } else if (radio.name === "starter-kit") {
                const kitChoice = document.getElementById("recapEquipment");
                kitChoice.textContent = cardName;
                console.log("Kit sélectionné : " + cardName);

            } else if (radio.name === "weapon-choice") {
                const weaponChoice = document.getElementById("recapWeapon");
                weaponChoice.textContent = cardName;
                console.log("Arme sélectionnée : " + cardName);
            }
        });
    });

    // Gestion des skills hérités des classes/races et du seul skill que l'utilisateur doit choisir lui-même
    const skills = document.querySelectorAll("input[name='skills']");

    skills.forEach(function (skill) {
        skill.addEventListener("change", function () {

            // On compte combien de compétences ont été cochées manuellement
            let manualCount = 0;

            skills.forEach(function (input) {
                // Bien évidemment, on ignore les compétences déjà héritées automatiquement
                if (input.checked && !input.classList.contains("inherited")) {
                    manualCount++;
                }
            });

            // On ne touche pas aux compétences héritées
            skills.forEach(function (input) {
                if (input.classList.contains("inherited")) {
                    return;
                }

                // Si l'utilisateur a coché une compétence, on bloque toutes les cases non cochées
                if (manualCount >= 1) {
                    if (!input.checked) {
                        input.disabled = true;
                    }
                    // Sinon on fait en sorte que toutes les cases soient disponibles au choix
                } else {
                    input.disabled = false;
                }
            });
        });
    });

    /* Ce bloc permet à l'utilisateur d'ajouter ou diminuer les points de caractéristiques en tenant compte des points restants à répartir */
    let pointsLeft = 8;
    const pointsDisplay = document.getElementById("pointsLeft");

    // FORCE

    //Déclaration des variables
    const increaseStr = document.getElementById("increaseStr");
    const decreaseStr = document.getElementById("decreaseStr");
    const strValue = document.getElementById("strValue");
    const strInput = document.getElementById("strInput");

    // L'action +
    increaseStr.addEventListener("click", function () {
        const value = parseInt(strValue.textContent);
        // On vérifie d'abord si la valeur actuelle de la caractéristique n'a pas déjà atteint le max et s'il reste encore des points à répartir
        if (value < 20 && pointsLeft > 0) {
            const newValue = value + 1;
            // On met à jour la valeur de l'input caché
            strInput.value = newValue;
            // On met à jour la valeur affichée sur l'interface
            strValue.textContent = newValue;
            pointsLeft = pointsLeft - 1;
            // Pareil pour les points restants affichés
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            // On met à jour le modificateur dans le récapitulatif à droite
            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapStrModif");
            modifierDisplay.textContent = modifierValue;

            // On met à jour la statistique de base dans le récapitulatif à droite
            const strDisplay = document.getElementById("recapStr");
            strDisplay.textContent = newValue;

            console.log("Force augmentée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // L'action -
    decreaseStr.addEventListener("click", function () {
        const value = parseInt(strValue.textContent);
        // On vérifie si la valeur est bien supérieure à la valeur minimale (8)
        if (value > 8) {
            const newValue = value - 1;

            strInput.value = newValue;

            strValue.textContent = newValue;
            pointsLeft = pointsLeft + 1;

            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapStrModif");
            modifierDisplay.textContent = modifierValue;

            const strDisplay = document.getElementById("recapStr");
            strDisplay.textContent = newValue;

            console.log("Force diminuée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // J'ai fait le même bloc de code pour les 5 autres caractéristiques

    // DEXTERITE

    //Déclaration des variables
    const increaseDex = document.getElementById("increaseDex");
    const decreaseDex = document.getElementById("decreaseDex");
    const dexValue = document.getElementById("dexValue");
    const dexInput = document.getElementById("dexInput");

    increaseDex.addEventListener("click", function () {
        const value = parseInt(dexValue.textContent);

        if (value < 20 && pointsLeft > 0) {
            const newValue = value + 1;
            dexInput.value = newValue;
            dexValue.textContent = newValue;

            pointsLeft = pointsLeft - 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapDexModif");
            modifierDisplay.textContent = modifierValue;

            const dexDisplay = document.getElementById("recapDex");
            dexDisplay.textContent = newValue;

            console.log("Dextérité augmentée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    decreaseDex.addEventListener("click", function () {
        const value = parseInt(dexValue.textContent);

        if (value > 8) {
            const newValue = value - 1;
            dexInput.value = newValue;
            dexValue.textContent = newValue;

            pointsLeft = pointsLeft + 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapDexModif");
            modifierDisplay.textContent = modifierValue;

            const dexDisplay = document.getElementById("recapDex");
            dexDisplay.textContent = newValue;

            console.log("Dextérité diminuée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // CONSTITUTION

    //Déclaration des variables
    const increaseCon = document.getElementById("increaseCon");
    const decreaseCon = document.getElementById("decreaseCon");
    const conValue = document.getElementById("conValue");
    const conInput = document.getElementById("conInput");

    increaseCon.addEventListener("click", function () {
        const value = parseInt(conValue.textContent);

        if (value < 20 && pointsLeft > 0) {
            const newValue = value + 1;
            conInput.value = newValue;
            conValue.textContent = newValue;

            pointsLeft = pointsLeft - 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapConModif");
            modifierDisplay.textContent = modifierValue;

            const conDisplay = document.getElementById("recapCon");
            conDisplay.textContent = newValue;
            console.log("Constitution augmentée : " + newValue + " | Points restants : " + pointsLeft);
            updateHP();
        }
    });

    decreaseCon.addEventListener("click", function () {
        const value = parseInt(conValue.textContent);

        if (value > 8) {
            const newValue = value - 1;
            conInput.value = newValue;
            conValue.textContent = newValue;

            pointsLeft = pointsLeft + 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapConModif");
            modifierDisplay.textContent = modifierValue;

            const conDisplay = document.getElementById("recapCon");
            conDisplay.textContent = newValue;
            console.log("Constitution diminuée : " + newValue + " | Points restants : " + pointsLeft);
            updateHP();
        }
    });

    // INTELLIGENCE

    //Déclaration des variables
    const increaseInt = document.getElementById("increaseInt");
    const decreaseInt = document.getElementById("decreaseInt");
    const intValue = document.getElementById("intValue");
    const intInput = document.getElementById("intInput");

    increaseInt.addEventListener("click", function () {
        const value = parseInt(intValue.textContent);

        if (value < 20 && pointsLeft > 0) {
            const newValue = value + 1;
            intInput.value = newValue;
            intValue.textContent = newValue;

            pointsLeft = pointsLeft - 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapIntModif");
            modifierDisplay.textContent = modifierValue;

            const intDisplay = document.getElementById("recapInt");
            intDisplay.textContent = newValue;

            console.log("Intelligence augmentée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    decreaseInt.addEventListener("click", function () {
        const value = parseInt(intValue.textContent);

        if (value > 8) {
            const newValue = value - 1;
            intInput.value = newValue;
            intValue.textContent = newValue;

            pointsLeft = pointsLeft + 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapIntModif");
            modifierDisplay.textContent = modifierValue;

            const intDisplay = document.getElementById("recapInt");
            intDisplay.textContent = newValue;

            console.log("Intelligence diminuée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // SAGESSE

    //Déclaration des variables
    const increaseWis = document.getElementById("increaseWis");
    const decreaseWis = document.getElementById("decreaseWis");
    const wisValue = document.getElementById("wisValue");
    const wisInput = document.getElementById("wisInput");

    increaseWis.addEventListener("click", function () {
        const value = parseInt(wisValue.textContent);

        if (value < 20 && pointsLeft > 0) {
            const newValue = value + 1;
            wisInput.value = newValue;
            wisValue.textContent = newValue;

            pointsLeft = pointsLeft - 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapWisModif");
            modifierDisplay.textContent = modifierValue;

            const wisDisplay = document.getElementById("recapWis");
            wisDisplay.textContent = newValue;

            console.log("Sagesse augmentée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    decreaseWis.addEventListener("click", function () {
        const value = parseInt(wisValue.textContent);

        if (value > 8) {
            const newValue = value - 1;
            wisInput.value = newValue;
            wisValue.textContent = newValue;

            pointsLeft = pointsLeft + 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapWisModif");
            modifierDisplay.textContent = modifierValue;

            const wisDisplay = document.getElementById("recapWis");
            wisDisplay.textContent = newValue;

            console.log("Sagesse diminuée : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // CHARISME

    //Déclaration des variables
    const increaseCha = document.getElementById("increaseCha");
    const decreaseCha = document.getElementById("decreaseCha");
    const chaValue = document.getElementById("chaValue");
    const chaInput = document.getElementById("chaInput");

    increaseCha.addEventListener("click", function () {
        const value = parseInt(chaValue.textContent);

        if (value < 20 && pointsLeft > 0) {
            const newValue = value + 1;
            chaInput.value = newValue;
            chaValue.textContent = newValue;

            pointsLeft = pointsLeft - 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapChaModif");
            modifierDisplay.textContent = modifierValue;

            const chaDisplay = document.getElementById("recapCha");
            chaDisplay.textContent = newValue;

            console.log("Charisme augmenté : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    decreaseCha.addEventListener("click", function () {
        const value = parseInt(chaValue.textContent);

        if (value > 8) {
            const newValue = value - 1;
            chaInput.value = newValue;
            chaValue.textContent = newValue;

            pointsLeft = pointsLeft + 1;
            pointsDisplay.textContent = "Points restants à répartir : " + pointsLeft;

            const modifierValue = modifierCalculator(newValue);
            const modifierDisplay = document.getElementById("recapChaModif");
            modifierDisplay.textContent = modifierValue;

            const chaDisplay = document.getElementById("recapCha");
            chaDisplay.textContent = newValue;

            console.log("Charisme diminué : " + newValue + " | Points restants : " + pointsLeft);
        }
    });

    // Soumission du formulaire
    const form = document.getElementById("characterForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        console.log("Soumission déclenchée, préparation de l'envoi des données");

        const characterName = document.getElementById("characterName").value;
        const avatar = document.getElementById("avatar");
        const selectedClass = document.querySelector("input[name='class-choice']:checked");
        const selectedSpecies = document.querySelector("input[name='species-choice']:checked");
        const selectedBackground = document.querySelector("input[name='background-choice']:checked");
        const selectedKit = document.querySelector("input[name='starter-kit']:checked");
        const selectedWeapon = document.querySelector("input[name='weapon-choice']:checked");
        const descriptionValue = document.getElementById("characterDescription").value;


        // Empêche la validation du formulaire sans le nom du personnage
        if (characterName.trim() === "") {
            alert("Le nom du personnage est obligatoire.");
            return;
        }

        // Vérification de la taille du fichier et de son format
        if (avatar.files.length > 0) {
            const avatarFile = avatar.files[0];

            if (avatarFile.size > 2 * 1024 * 1024) {
                alert("La taille de la bannière ne doit pas dépasser 2 Mo.");
                return;
            }

            if (avatarFile.type !== "image/jpeg" && avatarFile.type !== "image/png") {
                alert("Le format de la bannière n'est pas supporté. Veuillez utiliser un fichier JPEG, PNG ou JPG.");
                return;
            }
        }

        // Vérification des points restants à répartir entre les caractéristiques
        if (pointsLeft > 0) {
            alert("Il vous reste " + pointsLeft + " points de caractéristiques à répartir");
            return;
        }

        // On vérifie si l'utilisateur a fait un choix dans toutes les étapes
        if (!selectedClass || !selectedSpecies || !selectedBackground || !selectedKit || !selectedWeapon) {
            alert("Veuillez sélectionner une option pour chaque étape");
            return;
        }

        // On crée un tableau vide pour stocker les skills sélectionnés par l'utilisateur
        const manualSkills = [];

        skills.forEach(function (skill) {
            // On vérifie si la case est cochée et qu'elle n'est pas désactivée
            if (skill.checked && !skill.disabled) {
                // Si c'est le cas, on ajoute le skills dans le tableau
                manualSkills.push(skill.value);
            }
        });

        // Après avoir parcouru la boucle, si le tableau est toujours vide, on prévient l'utilisateur pour qu'il en choisisse une
        if (manualSkills.length === 0) {
            alert("Veuillez choisir une compétence supplémentaire");
            return;
        }

        let formData = new FormData(form);

        // Je dois rajouter manuellement la description du personnage car étant une modale, je l'ai mise à la toute fin du body donc elle n'est pas inclut dans le form de base
        formData.append("description", descriptionValue);

        // On fait un appel à l'API
        /*try {
            const response = await fetch("mettre l'url de l'API ici/character-builder", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
            // Si l'API renvoie une erreur
                throw new Error(`Statut de réponse : ${response.status}`);
            }

            const result = await response.json();
            console.log("Succès de la création du personnage :", result);
            alert("Votre personnage a bien été crée !");

            // On redirige automatiquement vers la page de connexion
            window.location.href = "player-dashboard.html";

        } catch (error) {
                console.error("Erreur lors du fetch() : ", error.message);
                alert("Nous rencontrons un petit problème de serveur, veuillez nous excuser et réessayer plus tard :(");
        }*/

        console.log("Formulaire prêt à être envoyé");
    });

    // Ce bloc de code permet d'avoir des infobulles lorsque l'on survole le bouton "?"
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    document.body.appendChild(tooltip);
    document.querySelectorAll("[data-tooltip]").forEach(elem => {

        // On fait apparaître l'infobulle au survol de la souris sur le bouton
        elem.addEventListener("mouseenter", function () {
            tooltip.textContent = this.dataset.tooltip;

            // On récupère les coordonnées de l'élément survolé
            const rect = this.getBoundingClientRect();

            // On positionne l'infobulle en tenant compte du scroll de la page
            tooltip.style.left = rect.left + window.scrollX + "px";
            tooltip.style.top = rect.bottom + window.scrollY + "px";
            tooltip.style.display = "block";
            console.log(rect);
        });
        // On fait disparaître l'infobulle quand la souris sort du bouton
        elem.addEventListener("mouseleave", function () {
            tooltip.style.display = "none";
        });
    });

    /* Mise à jour de la barre de vie max selon la classe choisie et les points de constitution
    Je fais d'abord un dictionnaire avec les points de vie de base selon les classes
    */
    const classHPBase = {
        "Barbare": 12,
        "Barde": 8,
        "Clerc": 8,
        "Druide": 8,
        "Ensorceleur": 6,
        "Guerrier": 10,
        "Magicien": 6,
        "Moine": 8,
        "Occultiste": 8,
        "Paladin": 10,
        "Rôdeur": 10,
        "Roublard": 8
    }

    function updateHP() {
        const currentHP = document.getElementById("currentHP");
        const maxHP = document.getElementById("maxHP");

        const selectedClass = document.querySelector("input[name='class-choice']:checked");

        // On vérifie d'abord si une classe a été sélectionnée
        if (selectedClass) {
            // Si oui, on remonte jusqu'à la carte parente pour lire le nom de la classe en question
            const className = selectedClass.closest(".card").querySelector(".card-name").textContent;
            // On utilise ce nom pour piocher dans le dictionnaire que l'on a crée juste en haut
            let baseHP = classHPBase[className];

            // On ajoute le modificateur de constitution dans le calcul
            const conValue = parseInt(document.getElementById("conValue").textContent);
            const conModif = Math.floor((conValue - 10) / 2);
            baseHP = baseHP + conModif;

            // Comme il s'agit de la barre de vie au max, les deux valeurs représentent la même chose
            maxHP.textContent = baseHP;
            currentHP.textContent = baseHP;
            console.log("Les HP max de cette classe est de : " + baseHP + " PV");
        }
    }

    const equipmentBtns = document.querySelectorAll(".see-everything-btn");
    const kitModal = document.getElementById("kitModal");
    const kitTitle = document.getElementById("kitTitle");
    const kitDetails = document.getElementById("kitDetails");
    const closeKitModalBtn = document.getElementById("closeKitModalBtn");

    const kitContent = {
        "Kit de l'érudit": "Un sac à dos, un livre de connaissance, une bouteille d'encre, une plume d'écriture, 10 feuilles de parchemin, un petit sac de sable et un petit couteau",
        "Kit de l'explorateur": "Un sac à dos, un sac de couchage, une gamelle, une boîte d'allume-feu, 10 torches, 10 jours de rations, une gourde d'eau, 15m de corde de chanvre",
        "Kit du diplomate": "Un coffre, 2 étuis à cartes ou parchemins, des vêtements fins, une bouteille d'encre, une plume d'écriture, une lampe, 2 flasques d'huile, 5 feuilles de papier, un flacon de parfum, de la cire à cacheter et du savon"
    }

    equipmentBtns.forEach(function (btn) {
        btn.addEventListener("click", function (event) {
            event.preventDefault();

            const kitName = btn.closest(".card").querySelector(".card-name").textContent;

            const fullContent = kitContent[kitName] || "Le contenu détaillé de ce kit n'est pas disponible";

            kitTitle.textContent = kitName;
            kitDetails.textContent = fullContent;

            kitModal.style.display = "flex";

            console.log("Voici le contenu de : " + kitName + " : " + fullContent);
        });
        closeKitModalBtn.addEventListener("click", function (event) {
            event.preventDefault();

            kitModal.style.display = "none";
        });
    });

});