let form = document.getElementById("campaignForm");

form.addEventListener("submit", function (event) {
    let title = document.getElementById("campaignTitle").value;
    let banner = document.getElementById("campaignBanner");
    let description = document.getElementById("campaignDescription").value;

    // On vérifie que le titre et la description ne sont pas vides
    if (title.trim() === "" || description.trim() === "") {
        alert("Veuillez remplir le titre et la description de la campagne.");
        event.preventDefault();
        return;
    }

    // On vérifie que la bannière est un fichier image et qu'elle ne dépasse pas 2 Mo
    if (banner.files.length > 0) {
        let bannerFile = banner.files[0];

        if (bannerFile.size > 2 * 1024 * 1024) {
            alert("La taille de la bannière ne doit pas dépasser 2 Mo.");
            event.preventDefault();
            return;
        }

        if (bannerFile.type !== "image/jpeg" && bannerFile.type !== "image/png") {
            alert("Le format de la bannière n'est pas supporté. Veuillez utiliser un fichier JPEG, PNG ou JPG.");
            event.preventDefault();
            return;
        }
    }

    console.log("Formulaire de campagne soumis avec succès !");
});