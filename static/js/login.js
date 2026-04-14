// Récupération des données du formulaire en déclarant des variables JS
let form = document.getElementById("loginForm");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    // On vérifie si les champs sont vides
    if (email === "" || password === "") {
        alert("Tous les champs doivent être remplis !");
    } else {
        console.log("Validation de la connexion côté front");

        let loginData = {
            email: email,
            password: password
        };

        console.log("Données prêtes pour l'API");

        // Mettre le fetch() vers l'API ici
    }
});