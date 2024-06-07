"use strict";

// Écouteur d'événement pour DOMContentLoaded afin de s'assurer que le script s'exécute après le chargement complet du DOM
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector(".modal");
    const modifyLink = document.querySelector(".modify-link");

    // Ajout des écouteurs d'événements initiaux
    addInitialEventListeners(modal, modifyLink);
});

// Crée la modale1 : Galerie Photo
function createGalleryModal(modal) {
    modal.innerHTML = ""; 

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const closeButton = document.createElement("i");
    closeButton.classList.add("fa-solid", "fa-xmark");
    closeButton.classList.add("close");

    const modal1Title = document.createElement("h3");
    modal1Title.classList.add("modalTitle");
    modal1Title.textContent = "Galerie photo";

    const worksModal1 = document.createElement("div");
    worksModal1.classList.add("worksModal1");

    const addPhotoButton = document.createElement("a");
    addPhotoButton.href = "#";
    addPhotoButton.classList.add("addPhotoButton");
    addPhotoButton.textContent = "Ajouter une photo";

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modal1Title);
    modalContent.appendChild(worksModal1);
    modalContent.appendChild(addPhotoButton);
    modal.appendChild(modalContent);

    // Ajout des écouteurs d'événements après la création de la structure de la modale
    addCloseModalListener(closeButton, modal);
    addOpenAddPhotoModalListener(addPhotoButton, modal);
    addOutsideClickListener(modal);

    // Recharger les travaux à chaque fois que la galerie est recréée
    modalWorks();
}

// Crée la modale2 : Ajoute une photo
function createAddPhotoModal(modal) {
    modal.innerHTML = ""; 

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const closeButton = document.createElement("i");
    closeButton.classList.add("fa-solid", "fa-xmark");
    closeButton.classList.add("close");

    const modal2Title = document.createElement("h3");
    modal2Title.classList.add("modalTitle");
    modal2Title.textContent = "Ajouter une photo";

    const backButton = document.createElement("i");
    backButton.classList.add("fa-solid", "fa-arrow-left");
    backButton.classList.add("backButton");

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modal2Title);
    modalContent.appendChild(backButton);
    modal.appendChild(modalContent);

    // Ajout des écouteurs d'événements pour la modale d'ajout de photo
    addCloseModalListener(closeButton, modal);
    addOpenGalleryModalListener(backButton, modal);
    addOutsideClickListener(modal);
}

// Crée la modale de confirmation de suppression
function createDeleteConfirmationModal(modal, workId) {
    const confirmationModal = document.createElement("div");
    confirmationModal.classList.add("confirmation-modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content3");

    const modalTitle = document.createElement("h3");
    modalTitle.classList.add("modalTitle");
    modalTitle.textContent = "Confirmer la suppression";

    const message = document.createElement("p");
    message.textContent = "Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible.";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonContainer");

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Annuler";
    cancelButton.classList.add("cancelButton");

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirmer";
    confirmButton.classList.add("confirmButton");

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(message);
    modalContent.appendChild(buttonContainer);
    confirmationModal.appendChild(modalContent);
    modal.appendChild(confirmationModal);

    // Ajout des écouteurs d'événements
    cancelButton.addEventListener("click", () => {
        confirmationModal.remove(); 
    });

    confirmButton.addEventListener("click", async () => {
        await deleteWorkById(workId);
        confirmationModal.remove(); 
        createGalleryModal(modal); 
        openModal(modal); 
    });

    // Empêche la fermeture de la modale de galerie en cliquant à l'extérieur de la modale de confirmation
    confirmationModal.addEventListener("click", (event) => {
        event.stopPropagation();
    });
}

// Ouvre la modale
function openModal(modal) {
    modal.style.display = "flex";
}

// Ferme la modale
function closeModal(modal) {
    modal.style.display = "none";
}

// Ajoute un écouteur d'événement pour ouvrir la modale de galerie photo
function addOpenModalListener(link, modal) {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        createGalleryModal(modal); 
        openModal(modal);
    });
}

// Ajoute un écouteur d'événement pour fermer la modale
function addCloseModalListener(button, modal) {
    button.addEventListener("click", () => closeModal(modal));
}

// Ajoute un écouteur d'événement pour fermer la modale en cliquant à l'extérieur de celle-ci
function addOutsideClickListener(modal) {
    window.addEventListener("click", (event) => {
        const confirmationModal = document.querySelector(".confirmation-modal");
        if (event.target === modal && !confirmationModal) {
            closeModal(modal);
        }
    });
}

// Ajoute un écouteur d'événement pour ouvrir la modale d'ajout de photo
function addOpenAddPhotoModalListener(button, modal) {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        createAddPhotoModal(modal);
    });
}

// Ajoute un écouteur d'événement pour retourner à la galerie photo
function addOpenGalleryModalListener(button, modal) {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        createGalleryModal(modal);
    });
}

// Charge et affiche les travaux dans la modale de galerie photo
async function modalWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        resetModalGallery();
        works.forEach(work => createModalGallery(work));
    } catch (error) {
        console.error("Erreur lors du chargement des travaux :", error);
    }
}

// Réinitialise le contenu de la galerie photo dans la modale
function resetModalGallery() {
    const modalGallery = document.querySelector(".worksModal1");
    if (modalGallery) {
        modalGallery.innerHTML = "";
    } else {
        console.error("L'élément .worksModal1 n'a pas été trouvé");
    }
}

// Crée et ajoute un élément de travail (article) dans la galerie photo
function createModalGallery(work) {
    const modalGallery = document.querySelector(".worksModal1");
    if (!modalGallery) return; 
    const article = document.createElement("article");
    article.setAttribute("data-work-id", work.id);

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    article.appendChild(img);

    const trashIcon = createTrashIcon(work.id);
    article.appendChild(trashIcon);

    modalGallery.appendChild(article);
}

// Crée une icône de poubelle (trash icon) pour chaque élément de travail
function createTrashIcon(workId) {
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    trashIcon.addEventListener("click", (event) => {
        event.preventDefault();
        const modal = document.querySelector(".modal");
        createDeleteConfirmationModal(modal, workId);
        openModal(modal);
    });
    return trashIcon;
}

// Supprime un travail par son ID
async function deleteWorkById(workId) {
    try {
        await deleteWork(workId);
        deleteWorkFromDOM(workId);
    } catch (error) {
        console.error("Erreur lors de la suppression du projet :", error);
    }
}

// Supprime l'élément de travail du DOM
function deleteWorkFromDOM(workId) {
    const workElement = document.querySelector(`article[data-work-id="${workId}"]`);
    if (workElement) {
        workElement.remove();
    }
}

// Récupère le token d'authentification depuis le localStorage
function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Le token d'authentification est manquant.");
    }
    return token;
}

// Effectue une requête pour supprimer un travail via l'API
async function deleteWork(workId) {
    try {
        const token = getToken();
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la suppression du projet : ${response.statusText}`);
        }

        console.log("Projet supprimé avec succès.");
    } catch (error) {
        console.error("Erreur lors de la suppression du projet :", error.message);
    }
}

// Ajoute les écouteurs d'événements initiaux à la page
function addInitialEventListeners(modal, modifyLink) {
    addOpenModalListener(modifyLink, modal);
    addOutsideClickListener(modal);
}