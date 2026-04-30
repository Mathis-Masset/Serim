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


//ONGLET COMBAT & SORTS

/* BARRE DE RECHERCHE
Ce bloc permet de faire fonctionner la barre de recherche comme un filtre dynamique en temps réel */
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

// LANCER DE DES
/* Fonction pour le lancer de dés
On prend le nombre de faces du dé en paramètre (selon si c'est un d20, d4, d6, etc)
On génère un chiffre entre 0 et 1 avec Math.random qu'on multiplie par le nombre de faces et on ajoute 1 pour avoir un résultat de 1 au max de sides */
function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

const diceBtns = document.querySelectorAll(".dice-btn");
const rollDiceBtn = document.getElementById("diceThrow");
const attackBtns = document.querySelectorAll(".attack-btn");
const damageBtns = document.querySelectorAll(".damage-btn");
const diceModal = document.getElementById("diceModal");
const closeDiceModalBtn = document.getElementById("closeDiceModalBtn");

/* Bouton Lancer de dés dans la colonne de gauche
Ce bouton fait apparaître la modale contenant tous les dés que l'utilisateur peut lancer */
rollDiceBtn.addEventListener("click", function (event) {
    event.preventDefault();

    diceModal.style.display = "flex";

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
});

// Fermer la modale
closeDiceModalBtn.addEventListener("click", function (event) {
    event.preventDefault();

    diceModal.style.display = "none";
});

// On commence par le jet d'attaque
let attackSuccess = false;

attackBtns.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
        event.preventDefault();

        let damageBtn = btn.closest(".dices").querySelector(".damage-btn");

        let attackRoll = rollDice(20);

        if (attackRoll === 1) {
            damageBtn.disabled = true;
            alert("Vous avez fait un " + attackRoll + " : échec critique !");
            addToRecord("Jet d'attaque = " + attackRoll);
            console.log("Jet de d20 = " + attackRoll);

        } else if (attackRoll === 20) {
            damageBtn.disabled = false;
            alert("Vous avez fait un " + attackRoll + " : coup critique !");
            addToRecord("Jet d'attaque = " + attackRoll);
            console.log("Jet de d20 = " + attackRoll);

        } else {
            damageBtn.disabled = false;
            alert("Vous avez fait un " + attackRoll + " : touché !");
            addToRecord("Jet d'attaque = " + attackRoll);
            console.log("Jet de d20 = " + attackRoll);

        }
    });
});

// et si l'on touche l'ennemi, on débloque le jet de dégât
damageBtns.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
        event.preventDefault();

        let damageSides = parseInt(btn.getAttribute("data-dice"));
        let damageRoll = rollDice(damageSides);

        if (damageRoll === 1) {
            alert("Oups...vous infligez seulement" + damageRoll + " point de dégât à votre ennemi");
            addToRecord("Jet de dégâts = " + damageRoll);
            console.log("Jet de d" + damageSides + " = " + damageRoll);

        } else if (damageRoll === damageSides) {
            alert("Vous infligez " + damageRoll + " dégâts à votre ennemi ! BOUM DEGÂTS MAXIMUM");
            addToRecord("Jet de dégâts = " + damageRoll);
            console.log("Jet de d" + damageSides + " = " + damageRoll);

        } else {
            alert("Vous infligez " + damageRoll + " dégâts à votre ennemi !");
            addToRecord("Jet de dégâts = " + damageRoll);
            console.log("Jet de d" + damageSides + " = " + damageRoll);
        }
        // A la fin, on désactive de nouveau le dé
        btn.disabled = true;
    });
});

/* BOUTONS ACTIONS
Objectif : Lorsque l'utilisateur appuie sur l'un des boutons pour effectuer une action, cette dernière est notée dans l'historique
Reprise de projet (après soutenance) : Ajouter la fonctionnalité de comptage de point d'action à effectuer / point d'action restant + changement dynamique */

const actionBtns = document.querySelectorAll(".action-btn");

// Petite sécurité si jamais on n'est pas dans le bon onglet
if (actionBtns.length > 0) {
    actionBtns.forEach(function (btn) {

        btn.addEventListener("click", function (event) {
            event.preventDefault();
            // On récupère le nom de l'action de la carte parente du bouton appuyé
            const actionName = btn.closest(".action-card").querySelector(".action-title").textContent;
            // On l'utilise dans le paramètre de la fonction pour l'historique
            addToRecord("Vous avez effectué l'action : " + actionName);
            console.log("Action effectuée : " + actionName);
        });
    });
}

// ONGLET COMPETENCES

/* BARRE DE RECHERCHE
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


// ONGLET INVENTAIRE

// BARRE DE RECHERCHE
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

/* BOUTONS AJOUTER UNE ARME // AJOUTER UNE ARMURE // AJOUTER UN CONSOMMABLE // AJOUTER UN OBJET
Objectif : Permettre à l'utilisateur d'ajouter un objet dans son inventaire via une modale */

// Déclaration des variables (boutons)
const addWeaponBtn = document.getElementById("addWeaponBtn");
const addArmorBtn = document.getElementById("addArmorBtn");
const addConsumableBtn = document.getElementById("addConsumableBtn");
const addItemBtn = document.getElementById("addItemBtn");
// Déclaration des variables (modale)
const addItemModal = document.getElementById("addItemModal");
const closeAddItemModalBtn = document.getElementById("closeAddItemModalBtn");
const modalSearch = document.getElementById("modalSearch");
const modalItemGrid = document.getElementById("modalItemGrid");

// Mes fausses données pour le test en local
const fakeData = {
    "weapon": ["Dague", "Bâton"],
    "armor": ["Robe"],
    "consumable": ["Parchemin", "Encre"],
    "item": ["Livre", "Lampe"]
};

// Cette variable va nous permettre de nous souvenir du type d'objet qu'on essaie d'ajouter
let currentTypeItem = "";

// Fonction pour faire apparaître la modale avec le bon contenu selon le type d'objet
async function openAddModal(type, title) {
    // On retient le type d'objet écrit en paramètre
    currentTypeItem = type;
    // On change le titre selon ce qu'il y a écrit en paramètre
    addItemModalTitle.textContent = title;
    // On affiche la modale
    addItemModal.style.display = "flex";
    // On appelle ensuite la fonction showItems afin d'afficher le catalogue

    // VERSION LOCALE A SUPPRIMER QUAND API SERA LIEE
    showItems(fakeData[type]);

    /* VERSION API ICI
    try {
        const response = await fetch("mettre l'url de l'API ici/items");

        if (!response.ok) {
            // Si l'API renvoie une erreur
            throw new Error(`Statut de réponse : ${response.status}`);
        }

        const items = await response.json();
        showItems(items);

    } catch (error) {
        console.error("Erreur lors du fetch() : ", error.message);
        modalItemGrid.innerHTML = "<p>Erreur de chargement du catalogue...</p>";        }
    */
}

// Fonction qui permet de créer des cartes d'objet dans le catalogue de la modale
function showItems(items) {
    // On vide tout d'abord la grille
    modalItemGrid.innerHTML = "";

    if (!items || items.length === 0) {
        modalItemGrid.innerHTML = "<p>Aucun objet disponible dans cette catégorie :(</p>";
        return;
    }

    // Et pour chaque objet du catalogue, on vient crée une carte comme celles dans le html
    items.forEach(function (item) {
        const card = document.createElement("div");
        card.className = "modal-item-card";

        const itemName = document.createElement("h4");
        itemName.className = "item-name";
        itemName.textContent = item;
        // On marque la hiérarchie des éléments dans le DOM
        card.appendChild(itemName);

        // On ajoute en plus un bouton "Ajouter" pour pouvoir ajouter l'objet en question dans l'inventaire
        const addBtn = document.createElement("button");
        addBtn.className = "green-btn add-item-btn";
        addBtn.textContent = "Ajouter";
        card.appendChild(addBtn);

        addBtn.addEventListener("click", function (event) {
            event.preventDefault();
            addItemToInventory(item);
        });

        modalItemGrid.appendChild(card);
    });
}

// Fonction qui permet d'ajouter les objets sous forme de cartes dans l'inventaire
function addItemToInventory(item) {
    let container;
    let cardClass;

    // On définit le conteneur et la classe de la carte seulement en fonction du type d'objet (si c'est une arme ou une armure -> équipement, si c'est un consommable ou si c'est un objet)
    if (currentTypeItem === "weapon" || currentTypeItem === "armor") {
        container = document.querySelector(".equipment .items-container");
        cardClass = "equipment-card";
    } else if (currentTypeItem === "consumable") {
        container = document.querySelector(".consumables .items-container");
        cardClass = "consumable-card";
    } else if (currentTypeItem === "item") {
        container = document.querySelector(".backpack .items-container");
        cardClass = "item-card";
    }

    // On crée la carte qui apparaîtra dans l'inventaire (à l'identique de celles dans le html)
    const card = document.createElement("div");
    card.className = cardClass;

    const itemInfos = document.createElement("div");
    itemInfos.className = "item-infos";

    const itemName = document.createElement("h4");
    itemName.className = "item-name";
    itemName.textContent = item;

    // On assemble les éléments du plus petit au plus grand dans le DOM
    itemInfos.appendChild(itemName);
    card.appendChild(itemInfos);
    container.appendChild(card);

    // On indique l'ajout dans l'historique
    addToRecord(item + " ajouté dans l'inventaire");
    // On fait disparaître la modale
    addItemModal.style.display = "none";
    console.log("Objet ajouté : " + item);
}

// Ecouteurs d'événement sur les boutons et définition de chaque paramètre type et title
addWeaponBtn.addEventListener("click", function (event) {
    event.preventDefault();
    openAddModal("weapon", "Ajouter une arme");
});

addArmorBtn.addEventListener("click", function (event) {
    event.preventDefault();
    openAddModal("armor", "Ajouter une armure");
});

addConsumableBtn.addEventListener("click", function (event) {
    event.preventDefault();
    openAddModal("consumable", "Ajouter un consommable");
});

addItemBtn.addEventListener("click", function (event) {
    event.preventDefault();
    openAddModal("item", "Ajouter un objet");
});

closeAddItemModalBtn.addEventListener("click", function (event) {
    event.preventDefault();
    addItemModal.style.display = "none";
});