"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector(".modal");
    const modifyLink = document.querySelector(".modify-link");
    
    openModalListener(modifyLink, modal);
    outsideClickListener(modal);
});

// Ouvre la modale
function openModal(modal) {
    modal.style.display = "flex";
}

// Ferme la modale
function closeModal(modal) {
    modal.style.display = "none";
}

// Écouteur d'événement pour ouvrir la modale de galerie photo
function openModalListener(link, modal) {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        createGalleryModal(modal); 
        openModal(modal);
    });
}

// Écouteur d'événement pour fermer la modale
function closeModalListener(button, modal) {
    button.addEventListener("click", () => closeModal(modal));
}

// Écouteur d'événement pour fermer la modale en cliquant à l'extérieur de celle-ci
function outsideClickListener(modal) {
    window.addEventListener("click", (event) => {
        const confirmationModal = document.querySelector(".confirmation-modal");
        if (event.target === modal && !confirmationModal) {
            closeModal(modal);
        }
    });
}

// Écouteur d'événement pour ouvrir la modale d'ajout de photo
function openAddPhotoModalListener(button, modal) {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        createAddPhotoModal(modal);
    });
}

/*********************************************************************************/
//****************                  MODALE 1                    ******************/
/*********************************************************************************/

// Modale 1 Structure : Galerie Photo
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
    closeModalListener(closeButton, modal);
    openAddPhotoModalListener(addPhotoButton, modal);
    outsideClickListener(modal);

    // Recharger les travaux à chaque fois que la galerie est recréée
    displayModalWorks();
}

// Modale 1 : Charge et affiche les travaux dans la modale de galerie photo
async function displayModalWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        resetModalGallery();
        works.forEach(work => createModalGallery(work));
    } catch (error) {
        console.error("Erreur lors du chargement des travaux :", error);
    }
}

// Modale 1 : Réinitialise le contenu de la galerie photo dans la modale
function resetModalGallery() {
    const modalGallery = document.querySelector(".worksModal1");
    if (modalGallery) {
        modalGallery.innerHTML = "";
    } else {
        console.error("L'élément .worksModal1 n'a pas été trouvé");
    }
}

// Modale 1 Structure : Crée et ajoute un élément de travail (article) dans la galerie photo
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

// Modale 1 Structure : Crée une icône de poubelle (trash icon) pour chaque élément de travail
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

// Modale 1 : Supprime un travail par son ID
async function deleteWorkById(workId) {
    try {
        await deleteWork(workId);
        deleteWorkFromDOM(workId);
    } catch (error) {
        console.error("Erreur lors de la suppression du projet :", error);
    }
}

// Modale 1 : Supprime l'élément de travail du DOM
function deleteWorkFromDOM(workId) {
    const workElement = document.querySelector(`article[data-work-id="${workId}"]`);
    if (workElement) {
        workElement.remove();
    }
}

// Modale 1 : Récupère le token d'authentification depuis le localStorage
function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Le token d'authentification est manquant.");
    }
    return token;
}

// Modale 1 : Effectue une requête pour supprimer un travail via l'API
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

/*********************************************************************************/
//****************                  MODALE 2                    ******************/
/*********************************************************************************/

// Modale 2 Structure Globale : Ajoute une photo
function createAddPhotoModal(modal) {
    modal.innerHTML = ""; 

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const backButton = document.createElement("i");
    backButton.classList.add("fa-solid", "fa-arrow-left");
    backButton.classList.add("backButton");

    const closeButton = document.createElement("i");
    closeButton.classList.add("fa-solid", "fa-xmark");
    closeButton.classList.add("close");

    const modal2Title = document.createElement("h3");
    modal2Title.classList.add("modalTitle");
    modal2Title.textContent = "Ajouter une photo";

    const form = document.createElement("form");
    form.classList.add("form-add-work");

    const formDiv = document.createElement("div");
    formDiv.classList.add("formDiv");

    modalContent.appendChild(backButton);
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modal2Title);
    modalContent.appendChild(form);
    form.appendChild(formDiv);
    modal.appendChild(modalContent);
    
    const photoDiv = createFormPhotoSection();
    const titleDiv = createFormTitleSection();
    const categoryDiv = createFormCategorySection();
    const submitButton = createFormSubmitButton();

    formDiv.appendChild(photoDiv);
    formDiv.appendChild(titleDiv);
    formDiv.appendChild(categoryDiv);
    form.appendChild(submitButton);

    // Charger les catégories dans le formulaire
    loadCategories();

    // Ajout des écouteurs d'événements pour la soumission du formulaire
    formSubmitEvent();

    // Ajout des écouteurs d'événements pour la modale d'ajout de photo
    closeModalListener(closeButton, modal);
    returnGalleryModalEvent(backButton, modal);
    outsideClickListener(modal);
    displayImagePreviewEvent();
    updateSubmitButtonEvent()

    // Ajout des écouteurs d'événements pour cacher les messages d'erreur lorsque les champs sont remplis
    document.getElementById("input-title").addEventListener("input", (event) => hideFieldError(event.target));
    document.getElementById("categories").addEventListener("change", (event) => hideFieldError(event.target));
}

// Modale 2 Structure : Crée la section pour ajouter une photo dans le formulaire
function createFormPhotoSection() {
    const photoDiv = document.createElement("div");
    photoDiv.classList.add("form-add-photo");

    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-image");

    const label = document.createElement("label");
    label.classList.add("form-button-add-photo");
    label.setAttribute("for", "input-file");
    label.textContent = "+ Ajouter photo";

    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.id = "input-file";
    inputFile.classList.add("form-work-photo");
    inputFile.accept = "image/jpeg, image/png";

    const fileInfo = document.createElement("p");
    fileInfo.classList.add("p-photo");
    fileInfo.textContent = "jpg, png : 4mo max";

    const imgPreview = document.createElement("img");
    imgPreview.id = "img-preview";
    imgPreview.style.display = "none";
    imgPreview.style.maxWidth = "100%";
    imgPreview.style.maxHeight = "169px";

    const errorContainer = document.createElement("p");
    errorContainer.classList.add("error-message");

    label.appendChild(inputFile);
    photoDiv.appendChild(icon);
    photoDiv.appendChild(label);
    photoDiv.appendChild(fileInfo);
    photoDiv.appendChild(imgPreview);
    photoDiv.appendChild(errorContainer);

    return photoDiv;
}

// Modale 2 Structure : Crée la section pour ajouter un titre dans le formulaire
function createFormTitleSection() {
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("form-title");

    const label = document.createElement("label");
    label.setAttribute("for", "input-title");
    label.textContent = "Titre";

    const input = document.createElement("input");
    input.type = "text";
    input.name = "titre";
    input.id = "input-title";
    input.classList.add("form-title-work");

    const errorContainer = document.createElement("p");
    errorContainer.classList.add("error-message");

    titleDiv.appendChild(label);
    titleDiv.appendChild(input);
    titleDiv.appendChild(errorContainer);

    return titleDiv;
}

// Modale 2 Structure : Crée la section pour sélectionner une catégorie dans le formulaire
function createFormCategorySection() {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("form-categories");

    const label = document.createElement("label");
    label.setAttribute("for", "categories");
    label.textContent = "Catégorie";

    const select = document.createElement("select");
    select.id = "categories";

    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-chevron-down", "select-icon");

    const errorContainer = document.createElement("p");
    errorContainer.classList.add("error-message");
   
    categoryDiv.appendChild(label);
    categoryDiv.appendChild(select);
    categoryDiv.appendChild(icon);
    categoryDiv.appendChild(errorContainer);

    return categoryDiv;
}

// Modale 2 Structure : Crée le bouton de soumission du formulaire
function createFormSubmitButton() {
    const submitButton = document.createElement("input");
    submitButton.type = "button";
    submitButton.value = "Valider";
    submitButton.id = "form-button-submit";

    return submitButton;
}

// Modale 2 : Charge les catégories
async function loadCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        const categorySelect = document.getElementById("categories");

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        categorySelect.appendChild(defaultOption);

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

// Modale 2 : Ajoute un écouteur d'événement pour retourner à la galerie photo
function returnGalleryModalEvent(button, modal) {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        createGalleryModal(modal);
    });
}

// Modale 2 : Afficher l'image sélectionnée
function displayImagePreview(file) {
    const imageUrl = URL.createObjectURL(file);
    const photoPreview = document.getElementById("img-preview");
    photoPreview.src = imageUrl;
    photoPreview.style.display = "block";
    hideContentFormAddPhoto();
    addTrashIcon ();
}

// Modale 2 : Ajout de l'icône poubelle 
function addTrashIcon() {
    const trashIcon = createTrashIconForPreview();
    const formPhotoDiv = document.querySelector(".form-add-photo");
    formPhotoDiv.appendChild(trashIcon);
}

// Modale 2 : Masquer les éléments buttonAddPhoto et p-photo
function hideContentFormAddPhoto() {
    const buttonAddPhoto = document.querySelector(".form-button-add-photo");
    const pPhoto = document.querySelector(".p-photo");
    const icon = document.querySelector(".fa-regular.fa-image");
    buttonAddPhoto.style.display = "none";
    pPhoto.style.display = "none";
    icon.style.display = "none";
}

// Modale 2 : Ajout de l'écouteur d'événement pour afficher l'image lors de la sélection du fichier
function displayImagePreviewEvent() {
    const inputFile = document.getElementById("input-file");
    if (inputFile) {
        inputFile.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file.size > 4 * 1024 * 1024) { // 4 Mo en octets
                showFieldError(inputFile, "La taille du fichier ne doit pas dépasser 4 Mo");
                resetSelectedFileForm();
                updateSubmitButton();
            } else {
                hideFieldError(inputFile);
                displayImagePreview(file);
                updateSubmitButton();
            }
        });
    }
}

// Modale 2 : Fonction pour créer une icône de poubelle pour l'aperçu de l'image
function createTrashIconForPreview() {
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon-preview");
    trashIcon.addEventListener("click", (event) => {
        event.preventDefault();
        removePreviewImage();
    });
    return trashIcon;
}

// Modalie 2 : Fonction pour supprimer l'aperçu de l'image dans le formulaire 
function removePreviewImage() {
    const photoPreview = document.getElementById("img-preview");
    if (photoPreview) {
        photoPreview.src = "";
        photoPreview.style.display = "none";
        const buttonAddPhoto = document.querySelector(".form-button-add-photo");
        const pPhoto = document.querySelector(".p-photo");
        const icon = document.querySelector(".fa-regular.fa-image");
        buttonAddPhoto.style.display = "block";
        pPhoto.style.display = "block";
        icon.style.display = "block";
        
        removeTrashIcon();
        resetSelectedFileForm();
        updateSubmitButton();
    }
}

// Modale 2 : Retirer l'icône poubelle
function removeTrashIcon() {
    const trashIcon = document.querySelector(".trash-icon-preview");
    if (trashIcon) {
        trashIcon.remove();
    }
}

// Modale 2 : Réinitialiser fichier déposé dans formulaire
function resetSelectedFileForm() {
    const inputFile = document.getElementById("input-file");
    inputFile.value = "";
}

// Modale 2 : Réinitialiser champ Titre du formulaire
function resetTitleForm() {
    const inputTitle = document.getElementById("input-title");
    inputTitle.value = "";
}

// Modale 2 : Réinitialiser champ Catégories du formulaire
function resetCategoryForm() {
    const selectCategories = document.getElementById("categories");
    selectCategories.selectedIndex = 0;
}

// Modale 2 : Réinitialiser Bouton Submit du formulaire
function resetSubmitButtonForm() {
    const submitButton = document.getElementById("form-button-submit");
    submitButton.style.backgroundColor = "";
    submitButton.setAttribute("disabled", true); 
}

// Modale 2 : Réinitialiser tous les champs du formulaire
function resetFormModal2() {
    removePreviewImage();
    resetSelectedFileForm();
    resetTitleForm();
    resetCategoryForm();
    resetSubmitButtonForm();
}

// Modale 2 : Ajout des écouteurs d'événements pour mettre à jour le bouton "Valider"
function updateSubmitButtonEvent() {
    const photoInput = document.getElementById("input-file");
    const titleInput = document.getElementById("input-title");
    const selectCategories = document.getElementById("categories");

    photoInput.addEventListener("input", updateSubmitButton);
    titleInput.addEventListener("input", updateSubmitButton);
    selectCategories.addEventListener("change", updateSubmitButton);
}

// Modale 2 : Ajout de l'écouteur d'événement pour réinitialiser le formulaire lors du clic sur "Valider"
function formSubmitEvent() {
    const form = document.querySelector(".form-add-work");
    const submitButton = document.getElementById("form-button-submit");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (validateForm()) {
            resetFormModal2();
        }
    });

    submitButton.addEventListener("click", (event) => {
        if (validateForm()) {
            resetFormModal2();
        }
    });
}

// Modale 2 : Valider le formulaire et afficher les messages d'erreur si nécessaire
function validateForm() {
    const photoInput = document.getElementById("input-file");
    const titleInput = document.getElementById("input-title");
    const selectCategories = document.getElementById("categories");

    let isValid = true;

    if (!validatePhotoInput(photoInput)) isValid = false;
    if (!validateTitleInput(titleInput)) isValid = false;
    if (!validateSelectCategories(selectCategories)) isValid = false;

    return isValid;
}

// Modale 2 : Valider entrée Fichier
function validatePhotoInput(input) {
    if (input.files.length === 0) {
        showFieldError(input, "Veuillez sélectionner un fichier");
        return false;
    } else {
        hideFieldError(input);
        return true;
    }
}

// Modale 2 : Valider entrée Titre
function validateTitleInput(input) {
    if (input.value.trim() === "") {
        showFieldError(input, "Veuillez entrer un titre");
        return false;
    } else {
        hideFieldError(input);
        return true;
    }
}

// Modale 2 : Valider entrée Catégories
function validateSelectCategories(select) {
    if (select.value === "") {
        showFieldError(select, "Veuillez sélectionner une catégorie");
        return false;
    } else {
        hideFieldError(select);
        return true;
    }
}


// Modale 2 : Activer ou désactiver Submit Button du formulaire
function updateSubmitButton() {
    const photoInput = document.getElementById("input-file");
    const titleInput = document.getElementById("input-title");
    const selectCategories = document.getElementById("categories");
    const submitButton = document.getElementById("form-button-submit");

    if (titleInput.value && selectCategories.value && photoInput.files.length > 0) {
        submitButton.style.backgroundColor = "#1D6154";
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.style.backgroundColor = "";
        submitButton.setAttribute("disabled", true);
    }
}

// Modale 2 : Afficher le message d'erreur pour un champ spécifique
function showFieldError(field, message) {
    const parentDiv = field.closest(".form-add-photo, .form-title, .form-categories");
    const errorContainer = parentDiv.querySelector(".error-message");
    errorContainer.textContent = message;
}

// Modale 2 : Masquer les messages d'erreur spécifiques à chaque champ
function hideFieldError(field) {
    const parentDiv = field.closest(".form-add-photo, .form-title, .form-categories");
    const errorContainer = parentDiv.querySelector(".error-message");
    errorContainer.textContent = "";
}

/*********************************************************************************/
//****************                  MODALE 3                    ******************/
/*********************************************************************************/

// Modale 3 : Fonction principale pour créer la modale de confirmation de suppression
function createDeleteConfirmationModal(modal, workId) {
    const confirmationModal = createConfirmationModal();
    modal.appendChild(confirmationModal);

    addCancelButtonEvent(confirmationModal);
    addConfirmButtonEvent(confirmationModal, workId, modal);
    preventModalClose(confirmationModal);
}

// Modale 3 : Fonction pour créer la structure HTML de la modale de confirmation
function createConfirmationModal() {
    const confirmationModal = document.createElement("div");
    confirmationModal.classList.add("confirmation-modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content3");

    const modalTitle = document.createElement("h3");
    modalTitle.classList.add("modalTitle");
    modalTitle.textContent = "Confirmer la suppression";

    const message1 = document.createElement("p");
    message1.classList.add("message1");
    message1.textContent = "Voulez-vous vraiment supprimer ce projet ?";

    const message2 = document.createElement("p");
    message2.classList.add("message2");
    message2.textContent = "Cette action est irréversible.";

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
    modalContent.appendChild(message1);
    modalContent.appendChild(message2);
    modalContent.appendChild(buttonContainer);
    confirmationModal.appendChild(modalContent);

    return confirmationModal;
}

// Modale 3 : Fonction pour ajouter l'événement "click" au bouton "Annuler"
function addCancelButtonEvent(confirmationModal) {
    const cancelButton = confirmationModal.querySelector(".cancelButton");
    cancelButton.addEventListener("click", () => {
        confirmationModal.remove();
    });
}

// Modale 3 : Fonction pour ajouter l'événement "click" au bouton "Confirmer"
function addConfirmButtonEvent(confirmationModal, workId, modal) {
    const confirmButton = confirmationModal.querySelector(".confirmButton");
    confirmButton.addEventListener("click", async () => {
        await deleteWorkById(workId);
        confirmationModal.remove();
        createGalleryModal(modal);
        openModal(modal);
    });
}

// Modale 3 : Fonction pour empêcher la fermeture de la modale en cliquant à l'extérieur de celle-ci
function preventModalClose(confirmationModal) {
    confirmationModal.addEventListener("click", (event) => {
        event.stopPropagation();
    });
}


