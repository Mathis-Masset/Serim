// Récupération des données du formulaire en déclarant des variables JS
let form = document.getElementById("loginForm");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // On vérifie si les champs sont vides
    if (email === "" || password === "") {
        alert("Tous les champs doivent être remplis !");
    } else if (!emailRegex.test(email)) {
        // On vérifie s'il s'agit bien d'une adresse mail valide
        alert("Adresse e-mail invalide !");
    } else {
        console.log("Validation de la connexion côté front");

        // On submit direct après ces vérifications puisque l'API prend le relais dans l'HTML
        form.submit();
    }
});