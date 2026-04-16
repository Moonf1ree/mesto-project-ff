/**
 * Открытие и закрытие модальных окон: оверлей, Esc.
 * Состояние создаётся внутри фабрики — без переменных уровня модуля.
 */

export function createModalController() {
  let openedPopup = null;
  let beforeCloseHook = () => {};

  function setModalBeforeCloseHook(callback) {
    beforeCloseHook = callback;
  }

  function handleEscKeydown(evt) {
    if (evt.key !== "Escape" || !openedPopup) {
      return;
    }
    closeModal(openedPopup);
  }

  function openModal(popupElement) {
    if (openedPopup && openedPopup !== popupElement) {
      closeModal(openedPopup);
    }
    openedPopup = popupElement;
    popupElement.classList.add("popup_is-opened");
    document.addEventListener("keydown", handleEscKeydown);
  }

  function closeModal(popupElement) {
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
  function initModalOverlayClose(popupSelector) {
    document.querySelectorAll(popupSelector).forEach((popupElement) => {
      popupElement.addEventListener("mousedown", (evt) => {
        if (evt.target === popupElement) {
          closeModal(popupElement);
        }
      });
    });
  }

  return {
    openModal,
    closeModal,
    setModalBeforeCloseHook,
    initModalOverlayClose,
  };
}
