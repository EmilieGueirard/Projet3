'use strict';

const works_url = 'http://localhost:5678/api/works';
const categories_url = "http://localhost:5678/api/categories";

const token = sessionStorage.getItem('token');


// Créer les conteneurs de modales
const galleryModal = document.createElement('div');
galleryModal.classList.add('modal', 'gallery-modal');
document.body.appendChild(galleryModal);

const confirmationModal = document.createElement('div');
confirmationModal.classList.add('modal', 'confirmation-modal');
document.body.appendChild(confirmationModal);

// Ajouter les déclencheurs pour ouvrir les modales
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-modal]')?.forEach(trigger => {
        trigger.addEventListener('click', event => {
            event.preventDefault();
            event.stopImmediatePropagation();

            switch (trigger.dataset.modal) {
                case 'gallery':
                    modalGallery();
                    break;
                case 'addPhoto':
                    modalAddPhoto();
                    break;
            }
        });
    });
});

/*********************************************************************************/
//****************             MODAL : GALLERY PHOTO            ******************/
/*********************************************************************************/

// Création modal Gallery Photo
function modalGallery() {
    let body = document.createElement('div');
    body.classList.add('gallery-body');

    let btn = document.createElement('button');
    btn.textContent = "Ajouter une photo";
    btn.dataset.modal = 'addPhoto';
    btn.classList.add('gallery-btn');
    btn.addEventListener('click', modalAddPhoto);

    createModal({
        header: "Galerie photo",
        body: body,
        footer: btn
    }, '.gallery-modal');

    createAndDisplayWorks(works);
}

// Créer et ajouter les travaux à la modale Gallery
function createAndDisplayWorks(works) {
    resetWorksModalGallery();
    const galleryBody = document.querySelector('.gallery-body');
    works.forEach(work => {
        const article = document.createElement('article');
        article.setAttribute('data-work-id', work.id);
        const img = document.createElement('img');

        img.src = work.imageUrl;

        article.appendChild(img);
        addTrashIcon(article);
        galleryBody.appendChild(article);
    });
}

// Récupérer les travaux depuis l'API
async function fetchWorks() {
    return await httpGet(works_url);
}

// Ajouter icône poubelle à un article
function addTrashIcon(article) {
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon');

    article.appendChild(trashIcon);
    trashIconClick(trashIcon, article);
}

// Evenement au click icone poubelle
function trashIconClick(trashIcon, article) {
    trashIcon.addEventListener('click', () => {
        showConfirmationModal(article);
    });
}

// Réinitialiser le contenu de gallery-body
function resetWorksModalGallery() {
    const galleryBody = document.querySelector('.gallery-body');
    galleryBody.innerHTML = ''; 
}

/*********************************************************************************/
//****************             MODAL : CONFIRM DELETE           ******************/
/*********************************************************************************/

// Fonction pour créer et afficher la modale de confirmation
function showConfirmationModal(article) {
    let footer = document.createElement('div'); 
    footer.classList.add('modal-footer');

    let cancelButton = document.createElement('button');
    cancelButton.textContent = "Annuler";
    cancelButton.classList.add('modal-btn', 'cancel-btn');
    cancelButton.addEventListener('click', () => closeModal('.confirmation-modal'));

    let confirmButton = document.createElement('button');
    confirmButton.textContent = "Confirmer";
    confirmButton.classList.add('modal-btn', 'confirm-btn');
    confirmButton.addEventListener('click', () => handleConfirmClick(article));
 
    footer.append(cancelButton, confirmButton);

    createModal({
        header: "Confirmation",
        body: "Êtes-vous sûr de vouloir supprimer ce projet ?",
        footer: footer
    }, 'small-modal', '.confirmation-modal'); 
}

// Suppression projet et mise à jour des projets
async function handleConfirmClick(article) {
    closeModal('.confirmation-modal');
    const workId = article.getAttribute('data-work-id');
    const success = await httpDelete(`${works_url}/${workId}`);
    success && (works = await fetchWorks(), createAndDisplayWorks(works), createWorks(works), showSuccessModalDelete());
}

/*********************************************************************************/
//****************             MODAL : SUCCES DELETE            ******************/
/*********************************************************************************/

// Création modal succes projet supprimé
function showSuccessModalDelete() {
    let successModal = document.querySelector('.success-modal');
    if (!successModal) {
        successModal = document.createElement('div');
        successModal.classList.add('modal', 'success-modal');
        document.body.appendChild(successModal);
    }
    
    createModal({
        header: "",
        body: "Projet supprimé avec succès",
        footer: ""
    }, 'small-modal', '.success-modal');

    const iconClose = document.querySelector('.success-modal .icon-close');
    iconClose.addEventListener('click', () => closeSuccessModalDelete(successModal));
    
    openModal(successModal);
}

// Fermer modal succes projet supprimé
function closeSuccessModalDelete() {
    closeModal('.success-modal');
}

/*********************************************************************************/
//****************                MODAL : ADD PHOTO             ******************/
/*********************************************************************************/

// Utilisation des fonctions dans modalAddPhoto
function modalAddPhoto() {
    let header = document.createElement('div');
    header.textContent = "Ajout photo";
    header.classList.add('modal-title-header');

    let body = document.createElement('form');
    body.classList.add("form-add-work");

    const formContent = document.createElement("div");
    formContent.classList.add("form-content");

    formContent.appendChild(createFormPhotoSection());
    formContent.appendChild(createFormTitleSection());
    formContent.appendChild(createFormCategorySection());

    body.appendChild(formContent);

    const submitButton = createFormSubmitButton();
    submitButton.addEventListener('click', handleSubmit);
    

    createModal({
        header: header,
        body: body,
        footer: submitButton
    });

    iconBack();
    loadCategories();
}

// Crée la section pour ajouter une photo dans le formulaire
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

    const fileErrorContainer = document.createElement("p");
    fileErrorContainer.classList.add("file-error-message");

    const errorContainer = document.createElement("p");
    errorContainer.classList.add("error-message");

    inputFile.addEventListener('change', (event) => {
        handleFileChange(event, imgPreview, icon, label, fileInfo, fileErrorContainer);
        checkFormValidity();
    });

    label.appendChild(inputFile);
    photoDiv.appendChild(icon);
    photoDiv.appendChild(label);
    photoDiv.appendChild(fileInfo);
    photoDiv.appendChild(imgPreview);
    photoDiv.appendChild(fileErrorContainer);
    photoDiv.appendChild(errorContainer);

    return photoDiv;
}

// Crée la section pour ajouter un titre dans le formulaire
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
    input.setAttribute("autocomplete", "off");
    input.addEventListener('input', checkFormValidity);

    const errorContainer = document.createElement("p");
    errorContainer.classList.add("error-message");

    titleDiv.appendChild(label);
    titleDiv.appendChild(input);
    titleDiv.appendChild(errorContainer);

    return titleDiv;
}

// Crée la section pour sélectionner une catégorie dans le formulaire
function createFormCategorySection() {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("form-categories");

    const label = document.createElement("label");
    label.setAttribute("for", "categories");
    label.textContent = "Catégorie";

    const select = document.createElement("select");
    select.id = "categories";
    select.addEventListener('change', checkFormValidity);
    
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

// Crée le bouton de soumission du formulaire
function createFormSubmitButton() {
    const submitButton = document.createElement("input");
    submitButton.type = "button";
    submitButton.value = "Valider";
    submitButton.id = "form-button-submit";
    submitButton.disabled = true;
    submitButton.classList.add('submit-button');
    submitButton.addEventListener('click', handleSubmit);

    return submitButton;
}

// Création iconBack modal addPhoto
function iconBack() {
    let modalContent = document.querySelector('.modal-content');
    let iconBack = document.createElement('i');
    iconBack.classList.add('icon-back', 'fa-solid', 'fa-arrow-left');
    iconBack.addEventListener('click', modalGallery);
    modalContent.prepend(iconBack);
}

// Modale 2 : Charge les catégories
async function loadCategories() {
    const categories = await httpGet(categories_url);
    const categorySelect = document.getElementById("categories");

    categorySelect.appendChild(new Option("", ""));

    categories.forEach(({ id, name }) => 
        categorySelect.appendChild(new Option(name, id))
    );
}

// Afficher l'image sélectionnée
function handleFileChange(event, imgPreview, icon, label, fileInfo, fileErrorContainer) {
    const file = event.target.files[0];
    
    fileErrorContainer.textContent = "";

    const isValidFile = checkFileSize(file, fileErrorContainer);
    if (isValidFile) {
        const reader = new FileReader();
        reader.onload = (event) => displayImagePreview(event, imgPreview, icon, label, fileInfo, fileErrorContainer);
        reader.readAsDataURL(file);
    }
    
    checkFormValidity(!isValidFile);
}

// Vérifier la taille du fichier
function checkFileSize(file, fileErrorContainer) {
    const maxSize = 4 * 1024 * 1024;
    file.size > maxSize && (fileErrorContainer.textContent = "La taille du fichier ne doit pas dépasser 4 Mo.");
    return file.size <= maxSize;
}

// Afficher la prévisualisation de l'image
function displayImagePreview(event, imgPreview, icon, label, fileInfo, fileErrorContainer) {
    imgPreview.src = event.target.result;
    imgPreview.style.display = "block";
    icon.style.display = "none";
    label.style.display = "none";
    fileInfo.style.display = "none";
    addTrashIconImg(imgPreview, icon, label, fileInfo, fileErrorContainer);
}

// Ajouter l'icône poubelle à côté de l'image
function addTrashIconImg(imgPreview, icon, label, fileInfo, fileErrorContainer) {
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon', 'trash-icon-preview');
    trashIcon.addEventListener('click', () => removeImagePreview(imgPreview, icon, label, fileInfo, trashIcon, fileErrorContainer));
    imgPreview.parentElement.appendChild(trashIcon);
}

// Réinitialiser la prévisualisation de l'image
function removeImagePreview(imgPreview, icon, label, fileInfo, trashIcon, fileErrorContainer) {
    imgPreview.style.display = "none";
    imgPreview.src = "";
    icon.style.display = "block";
    label.style.display = "block";
    fileInfo.style.display = "block";
    fileErrorContainer.textContent = "";
    trashIcon.remove();
    document.getElementById('input-file').value = ""; 
    checkFormValidity(); 
}

// Gérer la soumission du formulaire
async function handleSubmit() {
    const title = document.getElementById('input-title').value.trim();
    const category = document.getElementById('categories').value;
    const fileInput = document.getElementById('input-file');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', file);

    const newWork = await httpPostFormData(works_url, formData);
        
    if (newWork) {
        works.push(newWork);
        refreshGalleries();
        resetForm();
        showSuccessModalAdd();
    } 
}

// Réinitialiser le formulaire après l'ajout du projet
function resetForm() {
    const formContent = document.querySelector('.form-content');
    formContent.innerHTML = "";

    formContent.appendChild(createFormPhotoSection());
    formContent.appendChild(createFormTitleSection());
    formContent.appendChild(createFormCategorySection());

    document.getElementById('form-button-submit').disabled = true;
    document.getElementById('form-button-submit').classList.remove('active');
    loadCategories();
}

// Rafraîchir les galeries après l'ajout d'un projet
async function refreshGalleries() {
    works = await fetchWorks();
    createWorks(works);
}

// Vérifier la validité du formulaire
function checkFormValidity() {
    const photoInput = document.getElementById('input-file');
    const titleInput = document.getElementById('input-title');
    const selectCategories = document.getElementById('categories');
    const fileErrorContainer = document.querySelector(".file-error-message");

    let isValid = true;

    if (!validatePhotoInput(photoInput) || fileErrorContainer.textContent !== "") isValid = false;
    if (!validateTitleInput(titleInput)) isValid = false;
    if (!validateSelectCategories(selectCategories)) isValid = false;

    const submitButton = document.getElementById('form-button-submit');
    submitButton.disabled = !isValid;
    submitButton.classList.toggle('active', isValid);
}

// Valider entrée Fichier
function validatePhotoInput(input) {
    if (input.files.length === 0) {
        showFieldError(input, "Veuillez sélectionner un fichier");
        return false;
    } else {
        hideFieldError(input);
        return true;
    }
}

// Valider entrée Titre
function validateTitleInput(input) {
    if (input.value.trim() === "") {
        showFieldError(input, "Veuillez entrer un titre");
        return false;
    } else {
        hideFieldError(input);
        return true;
    }
}

// Valider entrée Catégories
function validateSelectCategories(select) {
    if (select.value === "") {
        showFieldError(select, "Veuillez sélectionner une catégorie");
        return false;
    } else {
        hideFieldError(select);
        return true;
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
//****************             MODAL : SUCCES DELETE            ******************/
/*********************************************************************************/

// Création modal succes projet supprimé
function showSuccessModalAdd() {
    let successModal = document.querySelector('.success-modal');
    if (!successModal) {
        successModal = document.createElement('div');
        successModal.classList.add('modal', 'success-modal');
        document.body.appendChild(successModal);
    }
    
    createModal({
        header: "",
        body: "Projet ajouté avec succès",
        footer: ""
    }, 'small-modal', '.success-modal');

    const iconClose = document.querySelector('.success-modal .icon-close');
    iconClose.addEventListener('click', () => closeSuccessModalAdd(successModal));
    
    openModal(successModal);
}

// Fermer modal succes projet supprimé
function closeSuccessModalAdd() {
    closeModal('.success-modal');
}


/*********************************************************************************/
//****************                 MODAL : GENERAL              ******************/
/*********************************************************************************/

// Ouvre la modale
function openModal(modal) {
    modal.style.display = "flex";
}

// Fermer modale
function closeModal(modalSelector = '.modal') {
    const modal = document.querySelector(modalSelector);
    modal && (modal.style.display = 'none', modal.innerHTML = '');
}

// Fermer modale en cliquant sur window
function closeClickWindow(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal && window.addEventListener('click', (event) => event.target === modal && closeModal(modalSelector));
}

// Création structure de base modale 
function createModal(data, className, modalSelector = '.modal') {
    let modal = document.querySelector(modalSelector);
    
    modal.innerHTML = '';

    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    if (className) {
        modalContent.classList.add(className);
    }
    modal.append(modalContent);

    let iconClose = document.createElement('i');
    iconClose.classList.add('icon-close', 'fa-solid', 'fa-xmark');
    iconClose.addEventListener('click', () => closeModal(modalSelector));
    modalContent.append(iconClose);

    if (data.header) {
        let header = document.createElement('div');
        header.classList.add('modal-header');
        header.append(data.header);
        modalContent.append(header);
    }

    if (data.body) {
        let body = document.createElement('div');
        body.classList.add('modal-body');
        body.append(data.body);
        modalContent.append(body);
    }

    if (data.footer) {
        let footer = document.createElement('div');
        footer.classList.add('modal-footer');
        footer.append(data.footer);
        modalContent.append(footer);
    }

    openModal(modal);
    closeClickWindow(modalSelector); 
}
