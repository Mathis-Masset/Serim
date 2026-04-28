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

// Soumission du form de création de campagne
let form = document.getElementById("campaignForm");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    let title = document.getElementById("campaignTitle").value;
    let banner = document.getElementById("campaignBanner");
    let description = document.getElementById("campaignDescription").value;

    // On vérifie que le titre et la description ne sont pas vides
    if (title.trim() === "" || description.trim() === "") {
        alert("Veuillez remplir le titre et la description de la campagne.");
        return;
    }

    // On vérifie que la bannière est un fichier image et qu'elle ne dépasse pas 2 Mo
    if (banner.files.length > 0) {
        let bannerFile = banner.files[0];

        if (bannerFile.size > 2 * 1024 * 1024) {
            alert("La taille de la bannière ne doit pas dépasser 2 Mo.");
            return;
        }

        if (bannerFile.type !== "image/jpeg" && bannerFile.type !== "image/png") {
            alert("Le format de la bannière n'est pas supporté. Veuillez utiliser un fichier JPEG, PNG ou JPG.");
            return;
        }
    }

    let campaignData = new FormData(form);

    // On appelle l'API
    /*try {
        const response = await fetch("mettre l'url de l'API ici/campaign", {
            method: "POST",
            body: campaignData
                });

        if (!response.ok) {
        // Si l'API renvoie une erreur
            throw new Error(`Statut de réponse : ${response.status}`);
        }

            console.log("Formulaire de campagne soumis avec succès dans la bdd");


        const result = await response.json();
let newCampaignCode = result.CampaignCode;

        console.log("Campagne créée avec le code :", newCampaignCode);

        // On redirige automatiquement vers la page de connexion
        alert("Votre campagne a bien été créée avec succès!");
        window.location.href = "dm-dashboard.html?campaignCode=" + newCampaignCode;

    } catch (error) {
            console.error("Erreur lors du fetch() : ", error.message);
            alert("Nous rencontrons un petit problème de serveur, veuillez nous excuser et réessayer plus tard :(");
    }*/

});