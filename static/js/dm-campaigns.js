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