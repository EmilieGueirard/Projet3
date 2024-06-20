
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

    let article = document.createElement('article');
        
    let img = document.createElement('img');
       
    body.appendChild(article);
    body.appendChild(img);

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
    if (modal) {
        modal.style.display = 'none';
        modal.innerHTML = '';
    }
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

