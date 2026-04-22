let form = document.getElementById("campaignForm");

// Get user ID from localStorage (should be set during login)
let userId = localStorage.getItem("userId");
if (userId) {
    document.getElementById("creatorId").value = userId;
}

form.addEventListener("submit", function (event) {
    let title = document.getElementById("campaignTitle").value;
    let code = document.getElementById("campaignCode").value;
    let banner = document.getElementById("campaignBanner");
    let description = document.getElementById("campaignDescription").value;
    let creatorId = document.getElementById("creatorId").value;

    // Verify title, code, and description are not empty
    if (title.trim() === "" || code.trim() === "" || description.trim() === "") {
        alert("Veuillez remplir le titre, le code et la description de la campagne.");
        event.preventDefault();
        return;
    }

    // Verify user is logged in
    if (!creatorId) {
        alert("Vous devez être connecté pour créer une campagne.");
        event.preventDefault();
        return;
    }

    // Verify banner file size and type if provided
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