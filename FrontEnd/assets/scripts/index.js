"use strict";

const url_works = "http://localhost:5678/api/works";
const url_categories = "http://localhost:5678/api/categories";

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

let works = [];
let categories = [];


/**
 * Fetches data from the provided URL and returns it
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<Array>} - A promise that resolves to the fetched data array
 */
async function httpGet(url) 
{
    try {
        const response = await fetch(url);
        const data     = await response.json();
        return data;
    } 
    catch (error) 
    {
        console.error(error);
        return [];
    }
}

/**
 * Resets the gallery by clearing its inner HTML
 */
function resetGallery()
{
    gallery.innerHTML = "";
}

/**
 * Creates the works list in .gallery
 * @param {Array} works - Array of works to be displayed
 */
function createWorks(works) 
{
    resetGallery();
    works.forEach(work => createWork(work));
}

/**
 * Creates an HTML Node for a single work and appends it to the gallery
 * @param {Object} work - The work object to create an HTML node for
 * @param {string} work.imageUrl - The URL of the work's image
 * @param {string} work.title - The title of the work
 */
function createWork(work)
{
    let figure = document.createElement("figure");

    let img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    let figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title;
    
    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
}

/**
 * Creates category buttons and appends them to the filters element.
 * @param {Array} categories - Array of category objects.
 */
function createCategories(categories)
{
    createCategory({name: "Tous", id: 0})
    categories.forEach(category => createCategory(category))
}

/**
 * Creates a button for a single category and appends it to the filters element
 * @param {Object} category - The category object to create a button
 * @param {string} category.name - The name of the category
 * @param {number} category.id - The ID of the category
 */
function createCategory(category)
{
    let button = document.createElement("button");
    button.innerText = category.name; 
    button.addEventListener("click", () => filterWorks(category.id)); 
    filters.appendChild(button); 
}

/**
 * Filters the works by category ID and updates the gallery display
 * @param {number} categoryId - The ID of the category to filter works
 */
function filterWorks(categoryId) {
    if (categoryId === 0) {
        createWorks(works); 
    } else {
        const filteredWorks = works.filter(work => work.category && work.category.id === categoryId);
        createWorks(filteredWorks);
    }
}

/**
 * IIFE to fetch and display works and categories once the script is loaded
 * This function will run immediately after it is defined
 */
(async function() {

    categories = await httpGet(url_categories);
    createCategories(categories);
    
    works = await httpGet(url_works);
    createWorks(works);
    
})();