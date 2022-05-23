import { schema } from "@params";
import normalizeCid from "../normalize-cid";

const validationMinDelay = 500;

const validateFieldWithCustomValidator = (form, field, { signal }) => {
  const validatorsByName = {
    cid: (rawInput) => normalizeCid(rawInput, { signal: signal }),
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
          inputElement.setCustomValidity("");
          inputElement.value = result;
        }
      })
    );
  }

  if (field.definitions) {
    validators.push(
      ...Object.values(field.definitions).flatMap((nestedField) =>
        validateFieldWithCustomValidator(form, nestedField, { signal })
      )
    );
  }

  return validators;
};

export const runValidator = (form, { signal }) => {
  const validators = Object.values(schema.definitions).flatMap((field) =>
    validateFieldWithCustomValidator(form, field, { signal })
  );

  // Add a minimum delay to prevent UI flicker and to make it more obvious that
  // the button state changes from "validate" to "submit."
  validators.push(new Promise((r) => setTimeout(r, validationMinDelay)));

  return Promise.all(validators);
};
