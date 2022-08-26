const BASE_URL = 'https://api.sdv.nomoredomains.sbs';

const serverResponse = (res) => {
    if (res.ok) {
        return res.json();
    }
    return res.json()
    .then((err) => {
      throw err;
    })
};

export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            "email": email,
            "password": password
         }),
        
    }).then(serverResponse);
};

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            "email": email,
            "password": password
         }),
    }).then(serverResponse);
};

export const checkToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
    })
        .then(serverResponse);
};
