const modifProjectsButton = document.querySelector(".modif-projects");
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");
const closeModalButtons = document.querySelectorAll(".fa-xmark");
const openAddPhotoButton = document.querySelector(".modal1-button-add-photo");
const modalGallery = document.querySelector(".works-modal1");
const backButton = document.querySelector(".fa-arrow-left");
const addPhotoForm = document.getElementById("add-work-form");

//Ajouter un écouteur d'événements pour ouvrir la modale
modifProjectsButton.addEventListener("click", () => {
    openModal(modal1);
});

//Ajouter un écouteur d'événements pour fermer les modales
closeModalButtons.forEach(button => {
    button.addEventListener("click", closeModal);
});

// Ajouter un écouteur d'événements pour ouvrir la modale d'ajout de photo
openAddPhotoButton.addEventListener("click", () => {
    openModal(modal2);
    modal1.style.display = "none";
});

// Ajouter un écouteur d'événements pour revenir à la galerie photo
backButton.addEventListener("click", () => {
    closeModal(modal2);
    openModal(modal1);
});

// Fermer la modale si on clique en dehors de la zone de contenu de la modale
window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
        closeModal();
    }
});

// Ouvrir modale
function openModal(modal) {
    modal.style.display = null;
    modal.setAttribute("aria-hidden", "false");
}

// Fermer modale
function closeModal(modal) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    });
}

// Charger les projets de l'API dans la modale 1
async function modalWorks() {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();       
        resetModalGallery();
        works.forEach(work => createModalGallery(work));       
}

// Reset de la gallerie de la modale
function resetModalGallery()
{
    modalGallery.innerHTML = ""; 
}

// Créer la gallerie de la modale
function createModalGallery(work)
{
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

// Fonction pour créer une icône de poubelle
function createTrashIcon(workId) {
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    trashIcon.addEventListener("click", async (e) => {
        e.preventDefault();
        const confirmDelete = confirm("Voulez-vous vraiment supprimer ce projet ?\nAttention ! Cette action est irréversible.");
        if (confirmDelete) {
            try {
                await deleteElement(workId);
                deleteWorkFromDOM(workId);
            } catch (error) {
                console.error("Erreur lors de la suppression du projet :", error);
            }
        }
    });
    return trashIcon;
}

// Supprime un élément du DOM
function deleteWorkFromDOM(workId) {
    const workElement = document.querySelector(`article[data-work-id="${workId}"]`);
    if (workElement) {
        workElement.remove();
    }
}

// Fonction pour supprimer un travail de l'API
async function deleteElement(workId) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Le token d'authentification est manquant.");
        return;
    }

    try {
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

// Charger les travaux dans la modale 1 au démarrage
modalWorks();

