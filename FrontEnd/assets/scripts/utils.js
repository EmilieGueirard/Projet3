'use strict';

/**
 * Fetch data from the given URL
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<Object>} - The fetched data
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

/**
 * Send a POST request with JSON data
 * @param {string} url - The URL to send the request to
 * @param {Object} data - The data to send
 * @param {Object} [headers={}] - Optional headers
 * @returns {Promise<Array>} - The response data
 */
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

/**
 * Send a DELETE request
 * @param {string} url - The URL to send the request to
 * @param {Object} [headers={}] - Optional headers
 * @returns {Promise<boolean>} - Success status
 */
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

/**
 * Send a POST request with FormData
 * @param {string} url - The URL to send the request to
 * @param {FormData} formData - The FormData object to send
 * @param {Object} [headers={}] - Optional headers
 * @returns {Promise<Object|null>} - The response data
 */
async function httpPostFormData(url, formData, headers={})
{
    headers = Object.assign(headers, {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: headers
        });
        return await response.json();
    }
    catch (error) 
    {
        console.error(error);
        return null;
    }
}

/**
 * Redirect to the specified URL
 * @param {string} url - The URL to redirect to
 */
function redirectTo(url) 
{
    window.location.href = url;
}
