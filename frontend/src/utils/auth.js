const BASE_URL = 'https://api.sdv.nomoredomains.sbs';

function serverResponse(res) {
    if (res.ok) {
      return res.json()
    }
    else {
      return Promise.reject(`Ошибка ${res.status}: ${res.statusText}`)
    }
  }

export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, email  })
    }).then(serverResponse);
};

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then((res) => serverResponse(res));
  };

export const checkToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(serverResponse);
};
