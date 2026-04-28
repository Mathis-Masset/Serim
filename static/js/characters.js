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