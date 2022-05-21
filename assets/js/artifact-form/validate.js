import { fieldNameForInputElement, getQueryParams } from "./util";
import { schema } from "@params";
import normalizeCid from "../normalize-cid";

const validationMinDelay = 500;

const setButtonLoading = (buttonElement, text) => {
  buttonElement.disabled = true;
  buttonElement.innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    ${text}
  `;
};

const unsetButtonLoading = (buttonElement, text) => {
  buttonElement.disabled = false;
  buttonElement.innerText = text;
};

const setFormInputsDisabled = (form, disabled) => {
  for (const buttonElement of form.querySelectorAll(".form-button")) {
    buttonElement.disabled = disabled;
  }

  for (const inputElement of form.querySelectorAll(".form-field input")) {
    if (
      fieldNameForInputElement(inputElement) === schema.definitions.slug.fieldName &&
      getQueryParams().modify !== undefined
    ) {
      continue;
    }

    inputElement.disabled = disabled;
  }
};

const validateFieldWithCustomValidator = (form, field) => {
  const validatorsByName = {
    cid: normalizeCid,
  };

  const validators = [];

  if (field.customValidator) {
    const inputElements = Array.from(
      form.querySelectorAll(`.form-field[data-field-name="${field.fieldName}"] input`)
    );

    validators.push(
      ...inputElements.map(async (inputElement) => {
        const validator = validatorsByName[field.customValidator];
        const { result, message } = await validator(inputElement.value);

        if (result === undefined) {
          inputElement.setCustomValidity(message);
        } else {
          inputElement.value = result;
        }
      })
    );
  }

  if (field.definitions) {
    validators.push(
      ...Object.values(field.definitions).flatMap((nestedField) =>
        validateFieldWithCustomValidator(form, nestedField)
      )
    );
  }

  return validators;
};

const runCustomValidators = (form) => {
  const validators = Object.values(schema.definitions).flatMap((field) =>
    validateFieldWithCustomValidator(form, field)
  );

  // If any custom validators are running that could cause form validation to
  // take a noticeable amount of time, add a minimum delay to prevent UI flicker.
  if (validators.length > 0) {
    validators.push(new Promise((r) => setTimeout(r, validationMinDelay)));
  }

  return Promise.all(validators);
};

const showValidityMessages = (form) => {
  for (const validationElement of form.querySelectorAll(".needs-validation")) {
    const inputElement = validationElement.querySelector("input");

    if (!inputElement.validity.valid || inputElement.value.length > 0) {
      // Don't show the validity of the input if it is empty and not required.
      validationElement.classList.add("was-validated");
    }
  }
};

export const checkValidity = async (form) => {
  const submitButtonElement = form.querySelector(".submit-control button");

  setButtonLoading(submitButtonElement, "Validating...");
  setFormInputsDisabled(form, true);

  await runCustomValidators(form);

  unsetButtonLoading(submitButtonElement, "Submit");
  setFormInputsDisabled(form, false);
  showValidityMessages(form);

  return form.checkValidity();
};
