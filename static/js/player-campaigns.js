// Ce bloc permet à l'utilisateur de se déconnecter en appuyant sur le bouton "Se déconnecter"
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
let campaignCards = document.querySelectorAll(".campaign-card");

searchBar.addEventListener("input", function (event) {
    let searchInput = searchBar.value.trim().toLowerCase();

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
sortingMenu.addEventListener("change", function (event) {
    let filter = event.target.value;
    let grids = document.querySelectorAll(".cards-container");

    grids.forEach(function (grid) {
        let cards = Array.from(grid.querySelectorAll(".campaign-card"));

        cards.sort(function (a, b) {
            let nameA = a.querySelector(".campaign-title").textContent.toLowerCase();
            let nameB = b.querySelector(".campaign-title").textContent.toLowerCase();

            if (filter === "AZ") {
                return nameA.localeCompare(nameB);
            } else if (filter === "ZA") {
                return nameB.localeCompare(nameA);
            }
        });
        cards.forEach(function (card) {
            grid.appendChild(card);
        })
    });
});
