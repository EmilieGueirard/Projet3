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
 * Send a POST request with JSON data or FormData
 * @param {string} url - The URL to send the request to
 * @param {Object|FormData} data - The data to send
 * @param {Object} headers - Optional headers
 * @returns {Promise<Object|null>} - The response data
 */
async function httpPost(url, data, headers = {}) {
    const isFormData = data instanceof FormData;
    const options = {
        method: 'POST',
        headers: Object.assign(
            {},
            headers,
            isFormData ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : { 'Content-Type': 'application/json' }
        ),
        body: isFormData ? data : JSON.stringify(data)
    };

    isFormData && delete options.headers['Content-Type'];

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}


/**
 * Send a DELETE request
 * @param {string} url - The URL to send the request to
 * @param {Object} headers - Optional headers
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
 * Redirect to the specified URL
 * @param {string} url - The URL to redirect to
 * @returns void
 */
function redirectTo(url) 
{
    window.location.href = url;
}
