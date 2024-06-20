
'use strict';

const works_url = 'http://localhost:5678/api/works';


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
    let header = document.createElement('div');
        header.textContent = "Galerie photo";
        header.classList.add('modal-title-header');

    let body = document.createElement('div');
        body.classList.add('gallery-body');

    let btn = document.createElement('button');
    btn.textContent = "Ajouter une photo";
    btn.dataset.modal = 'addPhoto';
    btn.classList.add('gallery-btn')
    btn.addEventListener('click', modalAddPhoto);

    let footer = document.createElement('div');
    footer.append(btn);

    createModal({
        header: header,
        body: body,
        footer: footer
    });

    fetchAndDisplayWorks();
}

// Fonction pour récupérer et afficher les travaux dans la modale gallery
async function fetchAndDisplayWorks() {
    const works = await fetchWorks();
    createAndDisplayWorks(works);
}

// Récupérer les travaux depuis l'API
async function fetchWorks() {
    return await httpGet(works_url);
}

// Créer et ajouter les travaux à la modale Gallery
function createAndDisplayWorks(works) {
    resetWorksModalGallery();
    const galleryBody = document.querySelector('.gallery-body');
    works.forEach(work => {
        const article = document.createElement('article');
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
    let header = document.createElement('div');
        header.textContent = "Confirmation";
        header.classList.add('modal-title-header');

    let body = document.createElement('div');
        body.textContent = "Êtes-vous sûr de vouloir supprimer ce projet ?";
        body.classList.add('modal-body');

    let footer = document.createElement('div');
        footer.classList.add('modal-footer');

    let cancelButton = document.createElement('button');
        cancelButton.textContent = "Annuler";
        cancelButton.classList.add('modal-btn', 'cancel-btn');
        cancelButton.addEventListener('click', closeModal);

    let confirmButton = document.createElement('button');
        confirmButton.textContent = "Confirmer";
        confirmButton.classList.add('modal-btn', 'confirm-btn');
        confirmButton.addEventListener('click', () => {
        // Ajouter la logique de suppression ici
        console.log('Projet supprimé:', article);
        closeModal();
    });

    footer.append(cancelButton, confirmButton);

    createModal({
        header: header,
        body: body,
        footer: footer
    });
}


// Réinitialiser le contenu de gallery-body
function resetWorksModalGallery() {
    const galleryBody = document.querySelector('.gallery-body');
    galleryBody.innerHTML = ''; 
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
    });

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
function closeModal() {
    const modal = document.querySelector('.modal');
    modal && (modal.style.display = 'none', modal.innerHTML = '');
}

// Fermer modale en cliquant sur window
function closeClickWindow(modal) {
    window.addEventListener('click', function(event) {
        event.target === modal && closeModal();
    });
}

// Création structure de base modale 
function createModal(data) {
    let modal = document.querySelector('.modal');
    
    modal.innerHTML = '';

    let modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modal.append(modalContent);

    let iconClose = document.createElement('i');
        iconClose.classList.add('icon-close', 'fa-solid', 'fa-xmark');
        iconClose.addEventListener('click', closeModal);
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
    closeClickWindow(modal);
}

