/* FONCTIONNEMENT DES ONGLETS
Il faut pouvoir permettre de changer d'étape et de savoir à quel étape nous sommes*/
let tabs = document.getElementsByClassName("tab");
let steps = document.getElementsByClassName("step");

let currentTab = 0;

// Fonction qui permet l'affichage de l'onglet en cours ainsi que l'indication visuelle dans la barre de progression en haut de l'écran
function showTab(n) {

    // On fait d'abord en sorte que tous les onglets soient tous nettoyés des styles pour les uniformiser
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
        steps[i].className = "step";
    }

    // n est le paramètre reçu depuis l'event onclick dans la page html
    tabs[n].style.display = "block";
    steps[n].className = "step active";

    // le paramètre permet de savoir sur quel onglet nous sommes
    currentTab = n;

    // On fait en sorte que le bouton Précédent n'apparaisse pas à la première étape
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }

    // On fait en sorte que le bouton Suivant devienne Terminer à la dernière étape
    if (n == (tabs.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Terminer";
    } else {
        document.getElementById("nextBtn").innerHTML = "Suivant";
    }
}

// Fonction qui permet au clic des boutons d'avancer ou de reculer de 1 onglet
function nextPrev(move) {
    let nextIndex = currentTab + move;

    if (nextIndex >= 0 && nextIndex < tabs.length) {
        showTab(nextIndex);
    }
}

// On met par défaut le premier onglet
showTab(0);