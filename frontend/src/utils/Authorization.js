export const BASE_URL = "https://api.sdv.nomoredomains.sbs";

function serverResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Ошибка ${res.status}: ${res.statusText}`);
  }
}

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  })
  .then(serverResponse);
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, email }),
    })
    .then(serverResponse)
    .then((data) => {
      if (data.token){
        localStorage.setItem('jwt', data.token);
        return data.token;
      }
    })
  };

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        "Authorization" : `Bearer ${token}`
      },
    }).then(serverResponse);
  };