class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
    // this._headers = headers;
  }

  get _headers() {
    return {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
    }
}

  _serverResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("Произошла ошибка");
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._headers
  }).then(res => this._checkResponse(res));

}

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: this._headers,
    }).then((res) => this._serverResponse(res));
  }

  getAllData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
}

  patchUserInfo({name, about}) {
    return fetch(`${this._baseUrl}/users/me/`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about
      }),
    }).then((res) => this._serverResponse(res));
  }

  postCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link
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

  patchAvatar(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar
      }),
    }).then((res) => this._serverResponse(res));
  }
}

//  const BASE_URL = "https://api.sdv.nomoredomains.sbs";
//  const api = new Api({
//   // baseUrl: "https://mesto.nomoreparties.co/v1/cohort-40",
//   baseUrl: BASE_URL,
//   // headers: {
//   //   authorization: "e3187960-22db-46b1-a8e9-14c8569f58ff",
//   //   "Content-Type": "application/json",
//   // },
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${localStorage.getItem('jwt')}`,
//   }
// });
const api = new Api({
  baseUrl: 'https://api.sdv.nomoredomains.sbs',
  //baseUrl: 'http://localhost:3000',
});

export default api;
