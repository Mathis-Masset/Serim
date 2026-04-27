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
