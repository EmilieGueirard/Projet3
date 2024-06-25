'use strict';

const works_url = 'http://localhost:5678/api/works';

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
    success && (works = await fetchWorks(), createAndDisplayWorks(works), createWorks(works), showSuccessModal());
}

// Récupérer les travaux depuis l'API
async function fetchWorks() {
    return await httpGet(works_url);
}

// Réinitialiser le contenu de gallery-body
function resetWorksModalGallery() {
    const galleryBody = document.querySelector('.gallery-body');
    galleryBody.innerHTML = ''; 
}

// Création modal succes projet supprimé
function showSuccessModal() {
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
    iconClose.addEventListener('click', () => closeSuccessModal(successModal));
    
    openModal(successModal);
}

// Fermer modal succes projet supprimé
function closeSuccessModal() {
    closeModal('.success-modal');
}

// Création Modal Add Photo
function modalAddPhoto() {
    let header = document.createElement('div');
    header.textContent = "Ajout photo";
    header.classList.add('modal-title-header');

    let body = document.createElement('div');
    body.textContent = "formulaire";

    createModal({
        header: header,
        body: body,
    }, '.gallery-modal');

    iconBack();
}

// Création iconBack modal addPhoto
function iconBack() {
    let modalContent = document.querySelector('.modal-content');
    let iconBack = document.createElement('i');
    iconBack.classList.add('icon-back', 'fa-solid', 'fa-arrow-left');
    iconBack.addEventListener('click', modalGallery);
    modalContent.prepend(iconBack);
}

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
