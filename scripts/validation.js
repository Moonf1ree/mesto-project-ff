import {
  MIN_CARD_NAME_LENGTH,
  MAX_CARD_NAME_LENGTH,
} from "./constants.js";

const MSG_SKIP_FIELD = "Вы пропустили это поле";
const MSG_URL = "Введите адрес сайта";
const MSG_CARD_NAME_LENGTH = "Поле заполнено некорректно";

const patternInputClasses = [
  "popup__input_type_name",
  "popup__input_type_description",
  "popup__input_type_card-name",
];

const nameLikePattern = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;

function isPatternInput(inputElement) {
  return patternInputClasses.some((cls) =>
    inputElement.classList.contains(cls),
  );
}

function validateInputField(inputElement) {
  inputElement.setCustomValidity("");
  const value = inputElement.value;

  if (inputElement.required && value.trim() === "") {
    inputElement.setCustomValidity(MSG_SKIP_FIELD);
    return;
  }

  if (isPatternInput(inputElement) && value.length > 0) {
    if (!nameLikePattern.test(value)) {
      inputElement.setCustomValidity(
        inputElement.dataset.patternMessage || "",
      );
      return;
    }
  }

  if (inputElement.classList.contains("popup__input_type_card-name")) {
    const len = value.length;
    if (
      len > 0 &&
      (len < MIN_CARD_NAME_LENGTH || len > MAX_CARD_NAME_LENGTH)
    ) {
      inputElement.setCustomValidity(MSG_CARD_NAME_LENGTH);
      return;
    }
  }

  if (inputElement.type === "url" && value.length > 0) {
    if (inputElement.validity.typeMismatch) {
      inputElement.setCustomValidity(MSG_URL);
    }
  }
}

function showInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) {
    return;
  }

  errorElement.textContent = inputElement.validationMessage;
  errorElement.classList.add(settings.errorClass);
  inputElement.classList.add(settings.inputErrorClass);
}

function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) {
    return;
  }

  errorElement.textContent = "";
  errorElement.classList.remove(settings.errorClass);
  inputElement.classList.remove(settings.inputErrorClass);
}

function checkInputValidity(formElement, inputElement, settings) {
  validateInputField(inputElement);

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}

function toggleButtonState(formElement, settings) {
  const submitButton = formElement.querySelector(
    settings.submitButtonSelector,
  );
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector),
  );

  const isValid = !inputList.some((inputElement) => {
    validateInputField(inputElement);
    return !inputElement.validity.valid;
  });

  submitButton.disabled = !isValid;
  submitButton.classList.toggle(settings.inactiveButtonClass, !isValid);
}

function setEventListeners(formElement, settings) {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector),
  );

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(formElement, settings);
    });
  });
}

export function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));

  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
    toggleButtonState(formElement, settings);
  });
}

export function clearValidation(formElement, settings) {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector),
  );

  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity("");
    hideInputError(formElement, inputElement, settings);
  });

  toggleButtonState(formElement, settings);
}
