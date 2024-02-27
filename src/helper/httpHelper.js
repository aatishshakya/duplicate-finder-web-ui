export const postData = async (url = '', data = {}) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            // If the server response is not ok, throw an error
            throw new Error('Network response was not ok');
        }
        const result = await response.json(); // Parse JSON response into native JavaScript objects
        return result;
    } catch (error) {
        throw error; // Rethrow the error so it can be caught where the function is called
    }
};


