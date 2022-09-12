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

  setToken(token) {
    this._headers.Authorization = `Bearer ${token}`
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._headers,
    }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      this._serverResponse(res);
    }
  });
}

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._headers,
    }).then((res) => this._serverResponse(res));
  }

  patchUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me/`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then((res) => this._serverResponse(res));
  }

  postCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then((res) => this._serverResponse(res));
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._serverResponse(res));
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
        return this.setLike(cardId);
    } else {
        return this.deleteLike(cardId);
    }
  }

  putLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then((res) => this._serverResponse(res));
  }

  deleteLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._serverResponse(res));
  }

  patchAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then((res) => this._serverResponse(res));
  }
}
 const api = new Api({
  // baseUrl: "https://mesto.nomoreparties.co/v1/cohort-40",
  baseUrl: "https://api.sdv.nomoredomains.sbs",
  // headers: {
  //   authorization: "e3187960-22db-46b1-a8e9-14c8569f58ff",
  //   "Content-Type": "application/json",
  // },
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
  }
});

export default api;
