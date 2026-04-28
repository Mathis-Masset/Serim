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

// Rejoindre/voir une campagne précise via sa carte
let enterCampaignBtns = document.querySelectorAll(".enter-campaign-btn");

enterCampaignBtns.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
        event.preventDefault();

        let card = event.target.closest(".campaign-card");

        if (card) {
            let campaignCode = card.dataset.code;

            // On envoie le code de la campagne en paramètre d'URL pour que l'API sache de quelle campagne il s'agit dans le dashboard
            if (campaignCode) {
                let urlLocation = "player-dashboard.html?campaignCode=" + campaignCode;

                window.location.href = urlLocation;
            } else {
                console.error("Code de campagne manquant");
            }
        } else {
            console.error("Bouton cliqué en dehors d'une carte de campagne");
        }
    });
});

// Quitter une campagne précise via sa carte
let quitBtns = document.querySelectorAll(".quit-btn");

quitBtns.forEach(function (btn) {
    btn.addEventListener("click", async function (event) {
        // On demande une confirmation à l'utilisateur vu que c'est une action irréversible
        let confirmAlert = confirm("Êtes-vous sûr de vouloir quitter cette campagne ?");

        if (confirmAlert) {
            // On prend la carte de campagne la plus proche du bouton cliqué (la carte parente du bouton en question)
            let card = event.target.closest(".campaign-card");

            // Petite vérification s'il y a bien une carte
            if (card) {
                let campaignCode = card.dataset.code;

                // On appelle l'API
                /*try {
                    const response = await fetch("mettre l'url de l'API ici/campaign", {
                        method: "DELETE",
                        });

                    if (response.ok) {
                        card.remove();
                        console.log("La liaison du personnage avec la campagne " + campaignCode + " a été supprimée de la bdd");
                    } else {
                        // Si l'API renvoie une erreur
                        throw new Error(`Statut de réponse : ${response.status}`);
                    }

                } catch (error) {
                        console.error("Erreur lors du fetch() : ", error.message);
                        alert("Impossible de supprimer la campagne pour le moment, veuillez réessayer");
                }*/
            }
        }
    });
});

// Ce bloc de code permet de rejoindre une campagne via le code partagé par le MJ
let joinCampaignForm = document.getElementById("joinCampaignForm");
let characterSelectionForm = document.getElementById("characterSelectionForm");
let characterModal = document.getElementById("characterSelectionModal");
let closeModalBtn = document.getElementById("closeModalBtn");

let validCode = "";

joinCampaignForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let codeInput = document.getElementById("code").value.trim().toUpperCase();

    if (codeInput.length !== 5) {
        alert("Le code de la campagne doit contenir exactement 5 caractères");
        return;
    } else {
        let requestData = {
            campaignCode: codeInput
        }

        /*try {
        // On fait appel à l'API
            const response = await fetch("mettre l'url de l'API ici/join-campaign", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(requestData)
                    });
         
            if (!response.ok) {
            // Si l'API renvoie une erreur
                alert("Ce code de campagne n'existe pas. Veuillez vérifier avec votre MJ :(");
                throw new Error(`Statut de réponse : ${response.status}`);
            } else {
                const result = await response.json();
                console.log("Campagne trouvée : ", result.campaignName);
                
                validCode = codeInput;
                console.log("Ouverture de la modale pour le code :", validCode);

                characterModal.style.display = "flex";
                joinCampaignForm.reset();
            }

        } catch (error) {
            console.error("Erreur lors du fetch() : ", error.message);
            alert("Nous rencontrons un petit problème de serveur, veuillez nous excuser et réessayer plus tard :(");
        }*/

    }
});