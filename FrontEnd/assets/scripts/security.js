'use strict';

const authentication_url = 'http://localhost:5678/api/users/login';
const store = sessionStorage;
const form = document.querySelector('#loginForm');
const topBar = document.querySelector('.topBar');
const loginLogoutLink = document.getElementById("loginLink");

// Ajouter le lien de connexion/déconnexion à la barre de navigation et afficher le mode édition si token présent
document.addEventListener('DOMContentLoaded', function() {
    addAuthLink();
    displayEditionMode();
});

form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideError();

    const response = await httpPost(authentication_url, {
        email: form.email.value,
        password: form.password.value
    });

    processAuthenticationResponse(response);
});

// Traiter la réponse de l'authentification
function processAuthenticationResponse(response) {
    !response?.userId && handleAuthenticationError("Erreur dans l’identifiant ou le mot de passe");

    response?.userId && (response?.token ? handleAuthenticationSuccess(response.token): handleAuthenticationError("Une erreur est survenue"));
}

// Gérer le succès de l'authentification
function handleAuthenticationSuccess(token) {
    saveToken(token);
    redirectTo('./index.html');
}

// Gérer l'erreur d'authentification
function handleAuthenticationError(message) {
    showError(message);
}

// Enregistrer le token
function saveToken(token) {
    store.setItem('token', token);
}

// Afficher un message d'erreur
function showError(msg) {
    const errNode = document.createElement('div');
    errNode.classList.add('error-message');
    errNode.textContent = msg;
    form.prepend(errNode);
}

// Cacher le message d'erreur
function hideError() {
    document.querySelector(".error-message")?.remove();
}

// Vérifier si l'utilisateur est authentifié
function isAuthenticated() {
    return !!store.getItem('token');
}

// Ajouter le lien de connexion ou de déconnexion
function addAuthLink() {
    const navList = document.querySelector('nav ul');
    const authLink = createAuthLink();
    navList && insertAuthLink(navList, authLink);
    isAuthenticated() && setLogoutLink(authLink);
}

// Créer la structure du lien de connexion
function createAuthLink() {
    const authLink = document.createElement('li');
    const authAnchor = document.createElement('a');
    authAnchor.classList.add('nav-link');
    authAnchor.textContent = "login";
    authAnchor.href = './login.html';
    authLink.appendChild(authAnchor);
    return authLink;
}

// Remplacer le lien login par logout
function setLogoutLink(authLink) {
    const authAnchor = authLink.querySelector('a');
    authAnchor.textContent = "logout";
    authAnchor.href = '#';
    authAnchor.addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    });
}

// Insérer le lien d'authentification dans la barre de navigation
function insertAuthLink(navList, authLink) {
    navList.insertBefore(authLink, navList.children[navList.children.length - 1]);
}

// Déconnexion
function logout() {
    store.removeItem('token');
    redirectTo('./index.html');
}

// Afficher mode édition complet quand token présent
function displayEditionMode() {
    isAuthenticated() && (styleModif(), deleteFilters(), addModifyLink());
}

// Changement du style de la page 
function styleModif() {
    const editionMode = document.createElement('div');
    editionMode.classList.add('editionMode');

    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-pen-to-square');

    const editionText = document.createElement("p");
    editionText.textContent = "Mode édition";

    topBar.style.margin = '38px 0 0 0';

    editionMode.appendChild(icon);
    editionMode.appendChild(editionText);
    topBar.appendChild(editionMode);
}

// Supprimer les filtres
function deleteFilters() {
    document.querySelector('.filters')?.remove();
}

// Créer le lien : icône + Modifier
function addModifyLink() {
    const projectsSection = document.querySelector('#portfolio .projects');

    const modifyLink = document.createElement('a');
    modifyLink.href = '#modal';
    modifyLink.dataset.modal = 'gallery';
    modifyLink.classList.add('modify-link');

    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-pen-to-square');

    const linkText = document.createTextNode("modifier");

    modifyLink.appendChild(icon);
    modifyLink.appendChild(linkText);

    projectsSection.appendChild(modifyLink);
}
