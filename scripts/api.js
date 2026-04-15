const config = {
  baseUrl: "https://nomoreparties.co/v1/cohort-magistr-2",
  headers: {
    authorization: "12e1f55d-d73a-4ac8-81ee-1b8bcd093830",
    "Content-Type": "application/json",
  },
};

const authHeaders = () => ({
  authorization: config.headers.authorization,
});

const jsonHeaders = () => config.headers;

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(new Error(`Ошибка: ${res.status}`));
}

export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: authHeaders(),
  }).then(checkResponse);
};

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: authHeaders(),
  }).then(checkResponse);
};

export const setUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: jsonHeaders(),
    body: JSON.stringify({ name, about }),
  }).then(checkResponse);
};

export const addCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ name, link }),
  }).then(checkResponse);
};

export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then((res) => {
    if (res.ok) {
      return Promise.resolve();
    }

    return Promise.reject(new Error(`Ошибка: ${res.status}`));
  });
};

export const changeLikeCardStatus = (cardId, isLiked) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: isLiked ? "DELETE" : "PUT",
    headers: authHeaders(),
  }).then(checkResponse);
};

export const updateAvatar = (avatar) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: jsonHeaders(),
    body: JSON.stringify({ avatar }),
  }).then(checkResponse);
};
