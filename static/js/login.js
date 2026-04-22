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

        // Call the backend login API
        fetch("/login/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Login failed: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Login successful:", data);
            // Store user ID in localStorage
            localStorage.setItem("userId", data.id);
            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);
            // Redirect to dashboard
            window.location.href = "/dashboard";
        })
        .catch(error => {
            console.error("Login error:", error);
            alert("Erreur de connexion: " + error.message);
        });
    }
});