class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _serverResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("Произошла ошибка");
  }

  getUserInfo(token) {
    return fetch(`${this.baseURL}/users/me`, {
      credentials: 'include',
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`
      }
    })
      .then(this._serverResponse);
  }

  getInitialCards(token) {
    return fetch(`${this.baseURL}/cards`, {
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`
      },
    })
      .then(this._serverResponse);
  }

  patchUserInfo({ name, about }, token) {
    return fetch(`${this.baseURL}/users/me`, {
      credentials: 'include',
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        about,
      }),
    })
      .then(this._serverResponse);
  }

  postCard({ name, link }, token) {
    return fetch(`${this.baseURL}/cards`, {
      credentials: 'include',
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._serverResponse);
  }

  deleteCard(id, token) {
    return fetch(`${this.baseURL}/cards/${id}`, {
      method: "DELETE",
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }).then(this._serverResponse);
  }

  putLike(id, token) {
    return fetch(`${this.baseURL}/cards/${id}/likes`, {
      method: "PUT",
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }).then(this._serverResponse);
  }

  deleteLike(id, token) {
    return fetch(`${this.baseURL}/cards/${id}/likes`, {
      method: "DELETE",
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }).then(this._serverResponse);
  }

  patchAvatar(avatar, token) {
    return fetch(`${this.baseURL}/users/me/avatar`, {
      method: "PATCH",
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then(this._serverResponse);
  }
}

export const api = new Api({
   baseURL: 'https://api.sdv.nomoredomains.sbs',
});
