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

// Permet de fermer la modale en cliquant sur le bouton "Annuler"
closeModalBtn.addEventListener("click", function (event) {
    event.preventDefault();
    characterModal.style.display = "none";
});

/* Ce bloc de code représente la sélection du personnage à lier depuis la modale
Le but est d'envoyer des paramètres dans l'URL pour permettre à l'API de remplir le dashboard via Jinja2
*/
characterSelectionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let selectedCharacter = document.querySelector("input[name='characterChoice']:checked");

    if (!selectedCharacter) {
        alert("Veuillez d'abord sélectionner un personnage");
        return;
    } else {
        let characterId = selectedCharacter.value;
        console.log("Liaison du personnage " + characterId + " au code " + validCode);

        // Voir avec Mathis la route exacte pour le dashboard
        window.location.href = "player-dashboard.html?id=" + characterId + "&code=" + validCode;
    }
});