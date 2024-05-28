"use strict";

const url = "http://localhost:5678/api/works";
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

// Récupération des travaux de l'API
async function httpGet(uri) 
{
    try {
        const response = await fetch(uri);
        const data =  await response.json();
        return data;
    } 
    catch (error) 
    {
        console.error(error);
        return null;
    }
}

// Affichage des travaux dans la galerie
function showWorks(works) 
{
    // Vider la galerie pour éviter les doublons
    gallery.innerHTML = "";

    // Pour chaque travaux, création et ajout des éléments HTML à la galerie
    works.forEach(work => {
        
        let figure = document.createElement("figure");

        let img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        let figcaption = document.createElement("figcaption");
        figcaption.innerText = work.title;
        
        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    });
}

// Affichage du menu des catégories 
function showCategories(works) {
    const categoriesMap = new Map();
    works.forEach(work => {
        if (work.category && work.category.id && work.category.name) {
            categoriesMap.set(work.category.id, work.category.name);
        }
    });
   
    const categoriesArray = Array.from(categoriesMap.entries()).sort((a, b) => a[0] - b[0]);

    const categories = [["All", "Tous"], ...categoriesArray];

    filters.innerHTML = "";
    categories.forEach(([id, name]) => {
        let button = document.createElement("button");
        button.innerText = name; 
        button.addEventListener("click", () => filterWorks(id, works)); 
        filters.appendChild(button); 
    });
}


// Filtrer les travaux par catégories
function filterWorks(categoryId, works) {
    if (categoryId === "All") {
        showWorks(works); 
    } else {
        const filteredWorks = works.filter(work => work.category && work.category.id === categoryId);
        showWorks(filteredWorks);
    }
}


// Récupération et affichage des travaux et des catégories
(async function() {
    let works = await httpGet(url);
    
    if (works) {
        showWorks(works);
        showCategories(works)
    } 
})();