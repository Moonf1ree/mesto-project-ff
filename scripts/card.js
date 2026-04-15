import { changeLikeCardStatus } from "./api.js";

/**
 * Создаёт DOM-элемент карточки и навешивает обработчики.
 * Не вставляет узел в разметку.
 *
 * @param {DocumentFragment} cardTemplate — content шаблона #card-template
 * @param {object} cardData — данные карточки с сервера
 * @param {string} currentUserId — _id текущего пользователя
 * @param {object} handlers
 * @param {function} handlers.onDeleteButtonClick — клик по корзине (своя карточка)
 * @param {function} handlers.onCardImageClick — клик по превью (имя и ссылка)
 */
export function createCard(
  cardTemplate,
  cardData,
  currentUserId,
  { onDeleteButtonClick, onCardImageClick },
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  const likes = cardData.likes || [];
  likeCount.textContent = String(likes.length);

  const isOwner = cardData.owner._id === currentUserId;
  const isLiked = likes.some((like) => like._id === currentUserId);

  if (!isOwner) {
    deleteButton.classList.add("card__delete-button_hidden");
  } else {
    deleteButton.addEventListener("click", () => {
      onDeleteButtonClick(cardElement, cardData);
    });
  }

  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeButton.addEventListener("click", () => {
    const wasLiked = likeButton.classList.contains("card__like-button_is-active");

    changeLikeCardStatus(cardData._id, wasLiked)
      .then((updatedCard) => {
        likeCount.textContent = String(updatedCard.likes.length);
        const liked = updatedCard.likes.some((like) => like._id === currentUserId);
        likeButton.classList.toggle("card__like-button_is-active", liked);
        cardData.likes = updatedCard.likes;
      })
      .catch(() => {});
  });

  cardImage.addEventListener("click", () => {
    onCardImageClick(cardData.name, cardData.link);
  });

  return cardElement;
}
