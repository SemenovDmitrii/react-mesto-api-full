export class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json()
    }
    else {
      return Promise.reject(`Ошибка ${res.status}: ${res.statusText}`)
    }
  }

  get _headers() {
    return {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
    }
}

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
    headers: this._headers
    }).then(this._checkResponse);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    }).then(this._checkResponse);
  }

  patchUserInfo(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._checkResponse);
  }

  postCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._checkResponse);
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  putLike(id) {
    return fetch(`${this.baseURL}/cards/${id}/likes`, {
      method: "PUT",
      eaders: this._headers,
    }).then(this._checkResponse);
  }

  deleteLike(id) {
    return fetch(`${this.baseURL}/cards/${id}/likes`, {
      method: "DELETE",
      eaders: this._headers,
    }).then(this._checkResponse);
  }

  patchAvatar(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._checkResponse);
  }
}

export const api = new Api({
   baseURL: 'https://api.sdv.nomoredomains.sbs',
});
