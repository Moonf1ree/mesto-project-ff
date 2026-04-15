/**
 * Открытие и закрытие модальных окон: оверлей, Esc.
 * Не содержит логики форм и данных страницы.
 */

let openedPopup = null;

let beforeCloseHook = () => {};

export function setModalBeforeCloseHook(callback) {
  beforeCloseHook = callback;
}

function handleEscKeydown(evt) {
  if (evt.key !== "Escape" || !openedPopup) {
    return;
  }
  closeModal(openedPopup);
}

export function openModal(popupElement) {
  if (openedPopup && openedPopup !== popupElement) {
    closeModal(openedPopup);
  }
  openedPopup = popupElement;
  popupElement.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscKeydown);
}

export function closeModal(popupElement) {
  beforeCloseHook(popupElement);
  popupElement.classList.remove("popup_is-opened");
  if (openedPopup === popupElement) {
    openedPopup = null;
    document.removeEventListener("keydown", handleEscKeydown);
  }
}

/**
 * Клик по тёмному фону (оверлею) закрывает окно; клик по содержимому — нет.
 */
export function initModalOverlayClose(popupSelector) {
  document.querySelectorAll(popupSelector).forEach((popupElement) => {
    popupElement.addEventListener("mousedown", (evt) => {
      if (evt.target === popupElement) {
        closeModal(popupElement);
      }
    });
  });
}
