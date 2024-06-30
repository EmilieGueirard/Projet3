"use strict";

const url_works = "http://localhost:5678/api/works";
const url_categories = "http://localhost:5678/api/categories";

const gallery = document.querySelector('.gallery');
const filters = document.querySelector('.filters');

let works = [];
let categories = [];


/**
 * Clears the gallery
 */
function resetGallery()
{
    gallery.innerHTML = "";
}

/**
 * Displays works in the gallery
 * @param {Array} works - List of works to display
 * @returns void
 */
function createWorks(works) 
{
    resetGallery();
    works.forEach(work => createWork(work));
}

/**
 * Creates and adds a work element to the gallery
 * @param {Object} work - Work object to create element for
 */
function createWork(work)
{
    let figcaption = document.createElement('figcaption');
        figcaption.innerText = work.title;

    let img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

    let figure = document.createElement('figure');
        figure.setAttribute('data-work-id', work.id); 
        figure.appendChild(img);
        figure.appendChild(figcaption);

    gallery.appendChild(figure);
}

/**
 * Creates category buttons and adds them to filters
 * @param {Array} categories - List of category objects
 * @returns void
 */
function createCategories(categories)
{
    createCategory({name: "Tous", id: 0}, true);
    categories.forEach(category => createCategory(category));
}

/**
 * Creates and adds a category button to filters
 * @param {Object} category - Category object to create button for
 * @param {boolean} isDefault - Button selected by default
 * @returns void
 */
function createCategory(category, isDefault = false)
{
    let button = document.createElement('button');
        button.innerText = category.name; 
        isDefault && button.setAttribute('data-selected', 'true');

        button.addEventListener('click', () => {
            filterWorks(category.id);
            document.querySelectorAll('.filters button').forEach(btn => btn.removeAttribute('data-selected'));
            button.setAttribute('data-selected', 'true');
        });

    filters.appendChild(button); 
}
/**
 * Filters works by category and updates gallery
 * @param {number} categoryId - ID of the category to filter works by
 * @returns void
 */
function filterWorks(categoryId) 
{
    const filteredWorks = categoryId === 0 ? works : works.filter(work => work.category?.id === categoryId);
    createWorks(filteredWorks);
}

/**
 * Fetches and displays works and categories when script loads
 */
(async function() {

    categories = await httpGet(url_categories);
    createCategories(categories);
    
    works = await httpGet(url_works);
    createWorks(works);
    
})();