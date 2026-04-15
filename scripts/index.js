import {
  getUserInfo,
  getInitialCards,
  setUserInfo,
  addCard,
  deleteCard as deleteCardRequest,
  updateAvatar,
} from "./api.js";
import { createCard } from "./card.js";
import {
  closeModal,
  initModalOverlayClose,
  openModal,
  setModalBeforeCloseHook,
} from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";

const cardTemplate = document.querySelector("#card-template").content;

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

const placesList = document.querySelector(".places__list");
const profileImage = document.querySelector(".profile__image");
const editProfilePopup = document.querySelector(".popup_type_edit");
const profileForm = editProfilePopup.querySelector(".popup__form");
const profileNameInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description",
);
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const editProfileButton = document.querySelector(".profile__edit-button");
const avatarEditButton = document.querySelector(".profile__avatar-edit-button");

const newCardPopup = document.querySelector(".popup_type_new-card");
const newCardForm = newCardPopup.querySelector(".popup__form");
const newPlaceNameInput = newCardForm.querySelector(
  ".popup__input_type_card-name",
);
const newPlaceLinkInput = newCardForm.querySelector(".popup__input_type_url");

const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarForm = avatarPopup.querySelector(".popup__form");
const avatarUrlInput = avatarForm.querySelector(".popup__input_type_url");

const deletePopup = document.querySelector(".popup_type_delete");
const deleteConfirmButton = deletePopup.querySelector(
  ".popup__button_type_confirm",
);
const deleteCancelButton = deletePopup.querySelector(
  ".popup__button_type_cancel",
);

const imagePopup = document.querySelector(".popup_type_image");
const imagePopupPicture = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

const addCardButton = document.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");

let currentUserId = null;
let pendingDeleteCard = null;

setModalBeforeCloseHook((popupElement) => {
  if (popupElement === deletePopup) {
    pendingDeleteCard = null;
  }
});

initModalOverlayClose(".popup");

function renderUser(user) {
  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
  profileImage.style.backgroundImage = `url('${user.avatar}')`;
}

function openImagePopup(name, link) {
  imagePopupPicture.src = link;
  imagePopupPicture.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
}

function handleDeleteButtonClick(cardElement, cardData) {
  pendingDeleteCard = { element: cardElement, id: cardData._id };
  openModal(deletePopup);
}

function setSubmitLoading(formElement, isLoading, loadingText) {
  const submitButton = formElement.querySelector(
    validationConfig.submitButtonSelector,
  );
  if (isLoading) {
    submitButton.dataset.originalText = submitButton.textContent;
    submitButton.textContent = loadingText;
    submitButton.disabled = true;
  } else {
    submitButton.textContent =
      submitButton.dataset.originalText || submitButton.textContent;
    delete submitButton.dataset.originalText;
    submitButton.disabled = false;
  }
}

function handleProfileEditSubmit(evt) {
  evt.preventDefault();
  setSubmitLoading(profileForm, true, "Сохранение...");

  setUserInfo(profileNameInput.value, profileDescriptionInput.value)
    .then((user) => {
      renderUser(user);
      closeModal(editProfilePopup);
    })
    .catch(() => {})
    .finally(() => {
      setSubmitLoading(profileForm, false);
      clearValidation(profileForm, validationConfig);
    });
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  setSubmitLoading(newCardForm, true, "Сохранение...");

  addCard(newPlaceNameInput.value, newPlaceLinkInput.value)
    .then((card) => {
      placesList.prepend(
        createCard(cardTemplate, card, currentUserId, {
          onDeleteButtonClick: handleDeleteButtonClick,
          onCardImageClick: openImagePopup,
        }),
      );
      newCardForm.reset();
      closeModal(newCardPopup);
    })
    .catch(() => {})
    .finally(() => {
      setSubmitLoading(newCardForm, false);
      clearValidation(newCardForm, validationConfig);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  setSubmitLoading(avatarForm, true, "Сохранение...");

  updateAvatar(avatarUrlInput.value)
    .then((user) => {
      renderUser(user);
      avatarForm.reset();
      closeModal(avatarPopup);
    })
    .catch(() => {})
    .finally(() => {
      setSubmitLoading(avatarForm, false);
      clearValidation(avatarForm, validationConfig);
    });
}

function handleConfirmDelete() {
  if (!pendingDeleteCard) {
    return;
  }

  deleteCardRequest(pendingDeleteCard.id)
    .then(() => {
      pendingDeleteCard.element.remove();
      pendingDeleteCard = null;
      closeModal(deletePopup);
    })
    .catch(() => {});
}

Promise.all([getUserInfo(), getInitialCards()])
  .then(([user, cards]) => {
    currentUserId = user._id;
    renderUser(user);
    cards.forEach((card) => {
      placesList.append(
        createCard(cardTemplate, card, currentUserId, {
          onDeleteButtonClick: handleDeleteButtonClick,
          onCardImageClick: openImagePopup,
        }),
      );
    });
  })
  .catch(() => {});

editProfileButton.addEventListener("click", () => {
  profileNameInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(editProfilePopup);
});

profileForm.addEventListener("submit", handleProfileEditSubmit);

avatarEditButton.addEventListener("click", () => {
  avatarUrlInput.value = "";
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

addCardButton.addEventListener("click", () => {
  clearValidation(newCardForm, validationConfig);
  openModal(newCardPopup);
});

newCardForm.addEventListener("submit", handleNewCardSubmit);

deleteConfirmButton.addEventListener("click", handleConfirmDelete);

deleteCancelButton.addEventListener("click", () => {
  closeModal(deletePopup);
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.closest(".popup"));
  });
});
