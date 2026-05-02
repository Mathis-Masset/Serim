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
        let joinCampaignData = new FormData(joinCampaignForm);

        /*try {
        // On fait appel à l'API
            const response = await fetch("mettre l'url de l'API ici/join-campaign", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(joinCampaignData)
                    });
         
            if (!response.ok) {
                if (response.status === 404) {
            // Si l'API renvoie une erreur
                alert("Ce code de campagne n'existe pas. Veuillez vérifier avec votre MJ :(");
                } else if (response.status === 400) {
                alert("Vous avez déjà rejoint cette campagne !");
                throw new Error(`Statut de réponse : ${response.status}`);
                } else {
                alert("Erreur interne. Veuillez-nous excuser");    
                }

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

        let linkCharacterData = new FormData(form);

        /*try {
        // On fait appel à l'API
            const response = await fetch("mettre l'url de l'API ici/link-character", {
                method: "POST",
                body: JSON.stringify(linkCharacterData)
                    });
         
            if (!response.ok) {
            // Si l'API renvoie une erreur
                alert("Vous ne pouvez pas assigner ce personnage :(");
                throw new Error(`Statut de réponse : ${response.status}`);
            
            } else {
                const result = await response.json();
                console.log("Personnage lié : ", characterId);
            }

        } catch (error) {
            console.error("Erreur lors du fetch() : ", error.message);
            alert("Nous rencontrons un petit problème de serveur, veuillez nous excuser et réessayer plus tard :(");
        }*/

    }
});