import { schema } from "@params";
import normalizeCid from "../normalize-cid";

const validationMinDelay = 500;

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

export const runValidator = (form) => {
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
