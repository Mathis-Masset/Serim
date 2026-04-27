// Ce bloc de code permet à l'utilisateur de se connecter (envoi des données vers l'API qui vérifie si les identifiants existent dans la bdd)
let form = document.getElementById("loginForm");
form.addEventListener("submit", async function (event) {
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

        let loginData = {
            email: email,
            password: password
        };

        // On appelle l'API
        /*try {
            const response = await fetch("mettre l'url de l'API ici/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(loginData)
                    });

            if (!response.ok) {
            // Si l'API renvoie une erreur
                throw new Error(`Statut de réponse : ${response.status}`);
            }

            const result = await response.json();
            console.log("Connexion réussie :", result);

            // On redirige automatiquement vers la page de connexion
            alert("Connexion réussie !");
            window.location.href = "dashboard-menu.html";

        } catch (error) {
                console.error("Erreur lors du fetch() : ", error.message);
                alert("Identifiants incorrects ou problème de serveur, veuillez réessayer");
        }*/
    }
});

/* Ce bloc de code permet d'afficher la fenêtre modale lorsque l'on clique sur "Mot de passe oublié ?"
On envoie à l'API l'email rentrée pour vérifier s'il s'agit bien d'une adresse mail déjà existante dans la bdd.
*/
let forgotPasswordLink = document.getElementById("forgotPassword");
let forgotPasswordModal = document.getElementById("forgotPasswordModal");
let resetForm = document.getElementById("forgotPasswordForm");
let cancelBtn = document.getElementById("cancelBtn");

forgotPasswordLink.addEventListener("click", function (event) {
    event.preventDefault();
    forgotPasswordModal.style.display = "flex";
});

cancelBtn.addEventListener("click", function (event) {
    forgotPasswordModal.style.display = "none";
});

resetForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let resetEmail = document.getElementById("resetEmail").value.trim();
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (resetEmail === "") {
        alert("Veuillez saisir votre adresse email !");
    } else if (!emailRegex.test(resetEmail)) {
        // On vérifie s'il s'agit bien d'une adresse mail valide
        alert("Adresse e-mail invalide !");
    } else {
        let requestData = {
            email: resetEmail
        };

        /*try {
            const response = await fetch("mettre l'url de l'API ici/forgot-password", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(requestData)
                });
        
            if (!response.ok) {
            // Si l'API renvoie une erreur
                throw new Error(`Statut de réponse : ${response.status}`);
            }

            alert("Si cet email existe, un mail a été envoyé");
            forgotPasswordModal.style.display = "none";

            // On nettoie les champs pour la prochaine fois
            resetForm.reset();
            
        } catch (error) {
            console.error("Erreur lors du fetch() : ", error.message);
            alert("Nous rencontrons un petit problème de serveur, veuillez nous excuser et réessayer plus tard :(");
        }*/

    }
});