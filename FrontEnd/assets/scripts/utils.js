'use strict';

/**
 * Fetches data from the provided URL and returns it
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<Array>} - A promise that resolves to the fetched data array
 */
async function httpGet(url) 
{
    try {
        const response = await fetch(url);
        return await response.json();
    } 
    catch (error) 
    {
        console.error(error);
        return [];
    }
}

async function httpPost(url, data, headers={})
{
    headers = Object.assign(headers, { 
        'Content-Type': 'application/json'
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers
        });
        return await response.json();
    }
    catch (error) 
    {
        console.error(error);
        return [];
    }
}

async function httpDelete(url, headers={})
{
    headers = Object.assign(headers, { 
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers
        });
        return response.ok;
    }
    catch (error) 
    {
        console.error(error);
        return false;
    }
}

function redirectTo(url) {
    window.location.href = url;
}





