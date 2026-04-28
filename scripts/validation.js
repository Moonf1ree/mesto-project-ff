import { DEFAULT_PATTERN_ERROR_MESSAGE } from "./constants.js";

function validateInputField(inputElement) {
  inputElement.setCustomValidity("");

  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(
      inputElement.dataset.patternMessage || DEFAULT_PATTERN_ERROR_MESSAGE,
    );
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
  const submitButton = formElement.querySelector(settings.submitButtonSelector);
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
