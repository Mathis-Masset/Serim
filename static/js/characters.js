// Bouton déconnexion
let logoutBtn = document.getElementById("logoutBtn");

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

// Barre de recherche dynamique
let searchBar = document.getElementById("searchBar");

searchBar.addEventListener("input", function (event) {
    let searchInput = searchBar.value.trim().toLowerCase();

    let characterCards = document.querySelectorAll(".character-card");

    characterCards.forEach(function (card) {
        let characterName = card.querySelector(".character-name").textContent.toLowerCase();

        if (characterName.includes(searchInput)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
});

// Tri par nom de personnage (A-Z ou Z-A) ou par ordre croissant ou décroissant du niveau
let sortingMenu = document.getElementById("filterSelect");
let grid = document.getElementById("charactersGrid");

sortingMenu.addEventListener("change", function (event) {
    let filter = event.target.value;

    let cards = Array.from(grid.querySelectorAll(".character-card"));

    cards.sort(function (a, b) {
        let nameA = a.querySelector(".character-name").textContent.toLowerCase();
        let nameB = b.querySelector(".character-name").textContent.toLowerCase();
        // On convertit en entiers les niveaux
        let levelA = parseInt(a.querySelector(".character-level").textContent);
        let levelB = parseInt(b.querySelector(".character-level").textContent);

        if (filter === "AZ") {
            return nameA.localeCompare(nameB, "fr", { sensitivity: 'base' });
        } else if (filter === "ZA") {
            return nameB.localeCompare(nameA, "fr", { sensitivity: 'base' });
        } else if (filter === "level-increase") {
            return levelA - levelB;
        } else if (filter === "level-decrease") {
            return levelB - levelA;
        }
    });
    cards.forEach(function (card) {
        grid.appendChild(card);
    });
});

// Bouton Supprimer
let deleteBtns = document.querySelectorAll(".delete-btn");

deleteBtns.forEach(function (btn) {
    btn.addEventListener("click", async function (event) {
        // On demande une confirmation à l'utilisateur vu que c'est une action irréversible
        let confirmAlert = confirm("Êtes-vous sûr de vouloir supprimer ce personnage ?");

        if (confirmAlert) {
            // On prend la carte du perso la plus proche du bouton cliqué (la carte parente du bouton en question)
            let card = event.target.closest(".character-card");

            // Petite vérification s'il y a bien une carte
            if (card) {
                let characterId = card.dataset.character;

                // On appelle l'API
                /*try {
                    const response = await fetch("mettre l'url de l'API ici/characters", {
                        method: "DELETE",
                        });

                    if (response.ok) {
                        const result = await response.json();
                        card.remove();
                        console.log("Le personnage " + characterId + " a été supprimée de la bdd");
                    } else {
                        // Si l'API renvoie une erreur
                        throw new Error(`Statut de réponse : ${response.status}`);
                    }

                } catch (error) {
                        console.error("Erreur lors du fetch() : ", error.message);
                        alert("Impossible de supprimer ce personnage pour le moment, veuillez réessayer");
                }*/
            }
        }
    });
});