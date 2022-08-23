class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _serverResponse(res) {
    if (res.ok) {
      return res.json();
    }
      return Promise.reject(`Ошибка ${res.status}`);
  }

  setToken(token) {
    this._headers.Authorization = `Bearer ${token}`
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      credentials: 'include',
      headers: this._headers,
    }).then(this._serverResponse);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      credentials: 'include',
      headers: this._headers,
    }).then(this._serverResponse);
  }

  patchUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me/`, {
      method: "PATCH",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this._serverResponse);
  }

  postCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then(this._serverResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      credentials: 'include',
      headers: this._headers,
    }).then(this._serverResponse);
  }

  putLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      credentials: 'include',
      headers: this._headers,
    }).then(this._serverResponse);
  }

  deleteLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      credentials: 'include',
      headers: this._headers,
    }).then(this._serverResponse);
  }

  patchAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this._serverResponse);
  }
}
export const api = new Api({
  baseUrl: 'https://api.sdv.nomoredomains.sbs', 
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
  },
});
