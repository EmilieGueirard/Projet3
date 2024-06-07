"use strict";
const topBar = document.querySelector(".topBar");
const loginLogoutLink = document.getElementById("loginLink");

// Appeler displayEditionMode lors du chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    displayEditionMode();
});

// Afficher mode édition complet quand token présent
function displayEditionMode() {
    if (isTokenPresent()) {
        styleModif();
        deleteFilters();
        remplaceLogin();
        addModifyLink();
    }
}

// Vérifier la présence du token
function isTokenPresent() {
    return localStorage.getItem("token") !== null;
}

// Changement du style de la page 
function styleModif() {
    const editionMode = document.createElement("div");
    editionMode.classList.add("editionMode");

    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-pen-to-square");

    const editionText = document.createElement("p");
    editionText.textContent = "Mode édition";

    topBar.style.margin = "38px 0 0 0";

    editionMode.appendChild(icon);
    editionMode.appendChild(editionText);
    topBar.appendChild(editionMode);
}

// Supprimer les filtres
function deleteFilters() {
    const deletedFilters = document.querySelector(".filters");
    if (deletedFilters) {
        deletedFilters.remove();
    }
}

// Créer lien Logout 
function createLogout() {
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.classList.add("nav-link");
    logoutLink.textContent = "logout";

    logoutLink.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "./index.html";
    });

    return logoutLink;
}

// Remplacer login par logout
function remplaceLogin() {
    const logoutLink = createLogout();
    loginLogoutLink.replaceWith(logoutLink);
}

// Créer le lien : icône + Modifier
function addModifyLink() {
    const projectsSection = document.querySelector("#portfolio .projects");

    const modifyLink = document.createElement("a");
    modifyLink.href = "#modal";
    modifyLink.classList.add("modify-link");

    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-pen-to-square");

    const linkText = document.createTextNode(" modifier");

    modifyLink.appendChild(icon);
    modifyLink.appendChild(linkText);

    projectsSection.appendChild(modifyLink);
}