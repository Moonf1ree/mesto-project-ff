import {
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MIN_CARD_NAME_LENGTH,
  MAX_CARD_NAME_LENGTH,
  NAME_LIKE_PATTERN_MESSAGE,
} from "./constants.js";

const patternInputClasses = [
  "popup__input_type_name",
  "popup__input_type_description",
  "popup__input_type_card-name",
];

const nameLikePattern = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;

function applyInputConstraints(inputElement) {
  const id = inputElement.id;

  if (id === "name") {
    inputElement.required = true;
    inputElement.minLength = MIN_NAME_LENGTH;
    inputElement.maxLength = MAX_NAME_LENGTH;
    return;
  }

  if (id === "description") {
    inputElement.required = true;
    inputElement.minLength = MIN_DESCRIPTION_LENGTH;
    inputElement.maxLength = MAX_DESCRIPTION_LENGTH;
    return;
  }

  if (id === "place-name") {
    inputElement.required = true;
    inputElement.minLength = MIN_CARD_NAME_LENGTH;
    inputElement.maxLength = MAX_CARD_NAME_LENGTH;
    return;
  }

  if (id === "link" || id === "avatar-url") {
    inputElement.required = true;
  }
}

function isPatternInput(inputElement) {
  return patternInputClasses.some((cls) =>
    inputElement.classList.contains(cls),
  );
}

function validateInputField(inputElement) {
  inputElement.setCustomValidity("");
  const value = inputElement.value;

  if (inputElement.required && value.trim() === "") {
    return;
  }

  if (isPatternInput(inputElement) && value.length > 0) {
    if (!nameLikePattern.test(value)) {
      inputElement.setCustomValidity(NAME_LIKE_PATTERN_MESSAGE);
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
    applyInputConstraints(inputElement);
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
