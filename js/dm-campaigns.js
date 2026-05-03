// Barre de recherche dynamique
let searchBar = document.getElementById("searchBar");

searchBar.addEventListener("input", function (event) {
    let searchInput = searchBar.value.trim().toLowerCase();

    let campaignCards = document.querySelectorAll(".campaign-card");

    campaignCards.forEach(function (card) {
        let campaignName = card.querySelector(".campaign-title").textContent.toLowerCase();

        if (campaignName.includes(searchInput)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
});

// Tri par nom de campagne (A-Z ou Z-A)
let sortingMenu = document.getElementById("filterSelect");
let grids = document.querySelectorAll(".cards-container");

sortingMenu.addEventListener("change", function (event) {
    let filter = event.target.value;

    grids.forEach(function (grid) {
        let cards = Array.from(grid.querySelectorAll(".campaign-card"));

        cards.sort(function (a, b) {
            let nameA = a.querySelector(".campaign-title").textContent.toLowerCase();
            let nameB = b.querySelector(".campaign-title").textContent.toLowerCase();

            if (filter === "AZ") {
                return nameA.localeCompare(nameB, "fr", { sensitivity: 'base' });
            } else if (filter === "ZA") {
                return nameB.localeCompare(nameA, "fr", { sensitivity: 'base' });
            }
        });
        cards.forEach(function (card) {
            grid.appendChild(card);
        })
    });
});

// Bouton Supprimer
let deleteBtns = document.querySelectorAll(".delete-btn");

deleteBtns.forEach(function (btn) {
    btn.addEventListener("click", async function (event) {
        // On demande une confirmation à l'utilisateur vu que c'est une action irréversible
        let confirmAlert = confirm("Êtes-vous sûr de vouloir supprimer cette campagne ?");

        if (confirmAlert) {
            // On prend la carte de campagne la plus proche du bouton cliqué (la carte parente du bouton en question)
            let card = event.target.closest(".campaign-card");

            // Petite vérification s'il y a bien une carte
            if (card) {
                let campaignCode = card.dataset.code;

                // On appelle l'API
                try {
                    const response = await fetch(`/dm-campaigns/${campaignCode}/delete`, {
                        method: "POST",
                        });

                    if (response.ok) {
                        card.remove();
                        console.log("La campagne " + campaignCode + " a été supprimée de la bdd");
                    } else {
                        // Si l'API renvoie une erreur
                        throw new Error(`Statut de réponse : ${response.status}`);
                    }

                } catch (error) {
                        console.error("Erreur lors du fetch() : ", error.message);
                        alert("Impossible de supprimer la campagne pour le moment, veuillez réessayer");
                }
            }
        }
    });
});