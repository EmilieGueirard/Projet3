"use strict";

const editionMode = document.querySelector(".edition-mode");
const topBar = document.querySelector(".topBar");
const portfolioModif = document.querySelector(".modif-projects");
const loginLogoutLink = document.getElementById("loginLink");

// Appeler displayEditionMode lors du chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    displayEditionMode();
});

// Afficher mode édition complet quand token présent
function displayEditionMode() 
{
    if (isTokenPresent()) {
        styleModif();
        deleteFilters();
        remplaceLogin();
        logout();
    }
}

// Vérifier la présence du token
function isTokenPresent() 
{
    return localStorage.getItem("token") !== null;
}

//Changement du style de la page 
function styleModif() 
{
    editionMode.style.display = "block";
    topBar.style.margin = "50px";
    portfolioModif.style.display = "block";
}

// Supprimer les filtres
function deleteFilters() 
{
    const deletedFilters = document.querySelector(".filters");
    if (deletedFilters) {
        deletedFilters.remove();
    }
}

// Remplacer login par logout
function remplaceLogin() 
{
    loginLogoutLink.textContent = "logout";
};

// Gérer la déconnexion
function logout() 
{
    loginLogoutLink.addEventListener("click", () => {       
    localStorage.removeItem("token");
    window.location.href = "./index.html";
    })
}



