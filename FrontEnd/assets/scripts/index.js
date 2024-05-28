"use strict";

const url = "http://localhost:5678/api/works";
const gallery = document.querySelector(".gallery");

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

(async function() {
    let works = await httpGet(url);
    
    if (works) {
        showWorks(works);
    } 
})();