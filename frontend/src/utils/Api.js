class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

//   get _headers() {
//     return {
//         authorization: `Bearer ${localStorage.getItem('jwt')}`,
//         'Content-Type': 'application/json'
//     }
// }

_checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  patchUserInfo(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => this._checkResponse(res));
  }

  postCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        link
      })
    }).then((res) => this._checkResponse(res));
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  // changeLikeCardStatus(cardId, isLiked) {
  //   return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
  //     method: `${isLiked ? 'PUT' : 'DELETE'}`,
  //     headers: {
  //       authorization: `Bearer ${localStorage.getItem("jwt")}`,
  //       "Content-Type": "application/json",
  //     },
  //   }).then((res) => this._checkResponse(res));
  // }

  changeLikeCardStatus(cardId, isLiked) {
    if (!isLiked) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'PUT',
            headers: {
                    authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    "Content-Type": "application/json",
                  },
        }).then((res) => this._checkResponse(res));
    } else {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'DELETE',
            headers: {
              authorization: `Bearer ${localStorage.getItem("jwt")}`,
              "Content-Type": "application/json",
            },
        }).then((res) => this._checkResponse(res));
    }
}

  // changeLikeCardStatus(cardId, isLiked) {
  //   if (isLiked) {
  //       return this.putLike(cardId);
  //   } else {
  //       return this.deleteLike(cardId);
  //   }
  // }

  // putLike(cardId) {
  //   return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
  //     method: "PUT",
  //     headers: {
  //       authorization: `Bearer ${localStorage.getItem("jwt")}`,
  //       "Content-Type": "application/json",
  //     },
  //   }).then((res) => this._checkResponse(res));
  // }

  // deleteLike(cardId) {
  //   return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
  //     method: "DELETE",
  //     headers: {
  //       authorization: `Bearer ${localStorage.getItem("jwt")}`,
  //       "Content-Type": "application/json",
  //     },
  //   }).then((res) => this._checkResponse(res));
  // }

  patchAvatar(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify
        ({ avatar }),
    }).then((res) => this._checkResponse(res));
  }
}

const api = new Api({
  baseUrl: 'https://api.sdv.nomoredomains.sbs',
  headers: {
    "content-type": "application/json"
  }
});

export default api;
