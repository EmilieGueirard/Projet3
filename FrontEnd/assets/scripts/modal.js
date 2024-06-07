"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector(".modal");
    const modifyLink = document.querySelector(".modify-link");

    // Ajout des écouteurs d'événements initiaux
    addInitialEventListeners(modal, modifyLink);
});

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

    addCloseModalListener(closeButton, modal);
    addOpenGalleryModalListener(backButton, modal);
    addOutsideClickListener(modal);
}

function openModal(modal) {
    modal.style.display = "flex";
}

function closeModal(modal) {
    modal.style.display = "none";
}

function addOpenModalListener(link, modal) {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        createGalleryModal(modal); 
        openModal(modal);
    });
}

function addCloseModalListener(button, modal) {
    button.addEventListener("click", () => closeModal(modal));
}

function addOutsideClickListener(modal) {
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
}

function addOpenAddPhotoModalListener(button, modal) {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        createAddPhotoModal(modal);
    });
}

function addOpenGalleryModalListener(button, modal) {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        createGalleryModal(modal);
    });
}

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

function resetModalGallery() {
    const modalGallery = document.querySelector(".worksModal1");
    if (modalGallery) {
        modalGallery.innerHTML = "";
    } else {
        console.error("L'élément .worksModal1 n'a pas été trouvé");
    }
}

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

function createTrashIcon(workId) {
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    trashIcon.addEventListener("click", handleTrashIconClick.bind(null, workId));
    return trashIcon;
}

function handleTrashIconClick(workId, e) {
    e.preventDefault();
    if (confirmDeletion()) {
         setTimeout(() => {
            deleteWorkById(workId);
        }, 0);
    }
}

function confirmDeletion() {
    return confirm("Voulez-vous vraiment supprimer ce projet ?\nAttention ! Cette action est irréversible.");
}

async function deleteWorkById(workId) {
    try {
        await deleteWork(workId);
        deleteWorkFromDOM(workId);
    } catch (error) {
        console.error("Erreur lors de la suppression du projet :", error);
    }
}

function deleteWorkFromDOM(workId) {
    const workElement = document.querySelector(`article[data-work-id="${workId}"]`);
    if (workElement) {
        workElement.remove();
    }
}

function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Le token d'authentification est manquant.");
    }
    return token;
}

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

function addInitialEventListeners(modal, modifyLink) {
    addOpenModalListener(modifyLink, modal);
    addOutsideClickListener(modal);
}
