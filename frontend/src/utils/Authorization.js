export const BASE_URL = 'https://api.sdv.nomoredomains.sbs';

function checkResponse(res) {
  if (res.ok) {
      return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`);
}

export const registration = (email, password) => {
  return fetch(`${BASE_URL}/sign-up`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "password": password,
          "email": email
      })
  })
      .then(checkResponse);
}

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/sign-in`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "password": password,
          "email": email
      })
  })
      .then(checkResponse)
      .then(res => {
          localStorage.setItem('jwt', res.token)
          return res
      })
}

export const getToken = (token) => {
  console.log(token);
  return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      }
  })
      .then(res => res.json())
}


// export const registration = (password, email) => {
//   return fetch(`${BASE_URL}/sign-up`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ 
//       password: password,
//       email: email,
//      }),
//   }).then(checkResponse);
// };

// export const authorize = (password, email) => {
//   return fetch(`${BASE_URL}/sign-in`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ password, email }),
//   }).then(checkResponse);
// };

// export const checkToken = (token) => {
//   return fetch(`${BASE_URL}/users/me`, {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((res) => {
//       if (res.status === 200) {
//         return res.json();
//       }
//     })
//     .then((res) => res);
// };
