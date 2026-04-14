// Récupération des données du formulaire en déclarant des variables JS
let form = document.getElementById("registerForm");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    // Validation des champs utilisateur
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // On vérifie si les champs sont vides
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
        alert("Tous les champs doivent être remplis !");

        // On vérifie l'email avec une expression régulière
    } else if (!emailRegex.test(email)) {
        alert("Adresse e-mail invalide !");

        // On vérifie la longueur et la complexité du mot de passe
    } else if (!passwordRegex.test(password)) {
        alert("Le mot de passe doit contenir au moins 8 caractères, incluant des lettres et des chiffres");

        // On vérifie la concordance des mots de passe
    } else if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");

    } else {
        console.log("Validation côté front réussie");

        let userData = {
            username: username,
            email: email,
            password: password
        };

        console.log("Données prêtes pour l'API");

        // Mettre le fetch() vers l'API ici
    }
});