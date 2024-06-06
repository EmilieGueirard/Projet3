const modifProjectsButton = document.querySelector(".modif-projects");
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");
const closeModalButtons = document.querySelectorAll(".fa-xmark");
const openAddPhotoButton = document.querySelector(".modal1-button-add-photo");
const modalGallery = document.querySelector(".works-modal1");
const backButton = document.querySelector(".fa-arrow-left");
const addPhotoForm = document.getElementById("add-work-form");
const categorySelect = document.getElementById("categories");

// Ajouter un écouteur d'événements pour ouvrir la modale
modifProjectsButton.addEventListener("click", () => {
    openModal(modal1);
});

// Ajouter un écouteur d'événements pour fermer les modales
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

// Ouvre la modale spécifiée
function openModal(modal) {
    modal.style.display = null;
    modal.setAttribute("aria-hidden", "false");
}

// Ferme toutes les modales
function closeModal() {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    });
}

// Charge les projets de l'API dans la modale 1
async function modalWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();       
    resetModalGallery();
    works.forEach(work => createModalGallery(work));       
}

// Charge les catégories de l'API et les ajoute au formulaire
async function loadCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
    }
}

// Réinitialise la galerie de la modale
function resetModalGallery() {
    modalGallery.innerHTML = ""; 
}

// Crée la galerie de la modale avec les travaux fournis
function createModalGallery(work) {
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

// Crée une icône de poubelle pour supprimer un travail
function createTrashIcon(workId) {
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    trashIcon.addEventListener("click", handleTrashIconClick.bind(null, workId));
    return trashIcon;
}

// Gère le clic sur l'icône de poubelle
function handleTrashIconClick(workId, e) {
    e.preventDefault();
    if (confirmDeletion()) {
         setTimeout(() => {
            deleteWorkById(workId);
        }, 0);
    }
}

// Affiche une boîte de dialogue de confirmation pour la suppression
function confirmDeletion() {
    return confirm("Voulez-vous vraiment supprimer ce projet ?\nAttention ! Cette action est irréversible.");
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

// Supprime un élément du DOM par son ID de travail
function deleteWorkFromDOM(workId) {
    const workElement = document.querySelector(`article[data-work-id="${workId}"]`);
    if (workElement) {
        workElement.remove();
    }
}

// Récupère et valide le token d'authentification
function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Le token d'authentification est manquant.");
    }
    return token;
}

// Supprime un travail quand le token est récupéré
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

// Vérifie si la taille du fichier est max 4Mo
document.getElementById('input-file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const maxSize = 4 * 1024 * 1024; 
    if (file.size > maxSize) {
        alert("La taille du fichier dépasse 4 Mo. Veuillez choisir un fichier plus petit.");
        event.target.value = ""; 
    }
});

// Charge les travaux dans la modale 1 au démarrage
modalWorks();

// Charge les catégories dans la modale 2 au démarrage
loadCategories();