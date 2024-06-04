"use strict";

const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(e) {
    e.preventDefault();
    clearErrorsMessages();

    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
        displayErrorsMessages(errors);
        return;
    }

    const { emailValue, passwordValue } = getFormValues();
    try {
        const response = await authenticateUser(emailValue, passwordValue);
        handleAuthenticationResponse(response);
    } catch (error) {
        console.error("Erreur lors de l'authentification :", error);
        displayGlobalErrorMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
}

// Valider les entrées du formulaire
function validateInputs() {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    const errors = {};
    errorEmail(emailValue, errors);
    errorPassword(passwordValue, errors);

    return errors;
}

// Récupérer les valeurs du formulaire
function getFormValues() {
    return {
        emailValue: email.value.trim(),
        passwordValue: password.value.trim()
    };
}

// error email
function errorEmail(emailValue, errors) {
    if (!emailValue) {
        errors.email = "Veuillez entrer votre e-mail";
    } else if (!validEmail(emailValue)) {
        errors.email = "Veuillez entrer une adresse e-mail valide";
    }
}

// error password
function errorPassword(passwordValue, errors) {
    if (!passwordValue) {
        errors.password = "Veuillez entrer votre mot de passe";
    }
}

// Vérifier si l'e-mail est validé
function validEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Afficher les messages d'erreur pour les champs invalides
function displayErrorsMessages(errors) {
    Object.entries(errors).forEach(([field, message]) => {
        displayErrorMessage(document.getElementById(field), message);
    });
}

// Afficher un message d'erreur pour un champ spécifique
function displayErrorMessage(field, message) {
    let errorDisplay = field.nextElementSibling;
    if (!errorDisplay || !errorDisplay.classList.contains("error-message")) {
        errorDisplay = document.createElement("p");
        errorDisplay.classList.add("error-message");
        form.insertBefore(errorDisplay, field.nextSibling);
    }
    errorDisplay.innerText = message;
   
}

// Afficher un message d'erreur global
function displayGlobalErrorMessage(message) {
    let globalErrorDisplay = document.querySelector(".global-error-message");
    if (!globalErrorDisplay) {
        globalErrorDisplay = document.createElement("p");
        globalErrorDisplay.classList.add("global-error-message");
        form.insertBefore(globalErrorDisplay, form.firstChild);
    }
    globalErrorDisplay.innerText = message;
}

// Effacer tous les messages d'erreur
function clearErrorsMessages() {
    clearErrorMessage()
    clearGlobalErrorMessage();
}

// Effacer les messages d'erreur : email et password
function clearErrorMessage() {
    document.querySelectorAll(".error-message").forEach(errorElement => {
        errorElement.remove();
    });
}

// Effacer le message d'erreur global quand les champs email et password sont vides
function clearGlobalErrorMessage() {
    if (email.value.trim() === "" || password.value.trim() === "") {
        const globalErrorDisplay = document.querySelector(".global-error-message");
        if (globalErrorDisplay) {
            globalErrorDisplay.remove();
        }
    }
}

// Authentifier l'utilisateur
async function authenticateUser(email, password) {
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return response;
}

// Gérer la réponse de l'authentification
async function handleAuthenticationResponse(response) {
    if (response.ok) {
        const token = await extractToken(response);
        handleSuccessfulLogin(token);
    } else {
        handleAuthenticationError(response);
    }
}

// Extraire le token
async function extractToken(response) {
    const tokenData = await response.json();
    return tokenData.token;
}

// Enregistrer le token
function saveToken(token) {
    localStorage.setItem("token", token);
    console.log("Token enregistré dans le localStorage:", token);
}

// Redirection vers la page d'accueil
function redirectToIndexPage() {
    window.location.href = "./index.html";
}

// Gérer la connexion réussie
function handleSuccessfulLogin(token) {
    saveToken(token);
    redirectToIndexPage();
}

// Gérer les erreurs d'authentification
function handleAuthenticationError(response) {
    if (response.status === 404 || response.status === 401) {
        displayGlobalErrorMessage("Erreur dans l’identifiant ou le mot de passe");
    } else {
        displayGlobalErrorMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
}