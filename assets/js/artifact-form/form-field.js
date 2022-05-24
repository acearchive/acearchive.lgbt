import { createRequiredLabel, fieldNameToId, mdConverter } from "./util";
import { dispatchFormNeedsValidationEvent } from "./submit";

const htmlInputTypeForField = (field) => {
  const inputTypeBySchemaType = {
    integer: "number",
    string: "text",
    array: "text",
  };

  return inputTypeBySchemaType[field.type];
};

const customErrorMessageForFieldByAttribute = (() => {
  const errorMessages = new Map();

  return (field, attributeName) => {
    if (!errorMessages.has[field.fieldName]) {
      const errorMessagesByAttribute = new Map();

      for (const validationRule of field.htmlFormValidation) {
        errorMessagesByAttribute[validationRule.attribute] = validationRule.message;
      }

      errorMessages[field.fieldName] = errorMessagesByAttribute;
    }

    return errorMessages[field.fieldName][attributeName] ?? "";
  };
})();

const setValidationMessageBySchema = (field, inputElement) => {
  if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity("Please fill out this field.");
  } else if (inputElement.validity.typeMismatch) {
    inputElement.setCustomValidity(customErrorMessageForFieldByAttribute(field, "type"));
  } else if (inputElement.validity.rangeUnderflow) {
    inputElement.setCustomValidity(customErrorMessageForFieldByAttribute(field, "min"));
  } else if (inputElement.validity.rangeOverflow) {
    inputElement.setCustomValidity(customErrorMessageForFieldByAttribute(field, "max"));
  } else if (inputElement.validity.stepMismatch) {
    inputElement.setCustomValidity(customErrorMessageForFieldByAttribute(field, "step"));
  } else if (inputElement.validity.tooShort) {
    inputElement.setCustomValidity(customErrorMessageForFieldByAttribute(field, "minlength"));
  } else if (inputElement.validity.tooLong) {
    inputElement.setCustomValidity(customErrorMessageForFieldByAttribute(field, "maxlength"));
  } else if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(customErrorMessageForFieldByAttribute(field, "pattern"));
  }
};

export const createFormField = (field, listItemIndex = 0) => {
  const fieldId = fieldNameToId(field.fieldName, listItemIndex);
  const showHelp = listItemIndex === 0;

  const formField = document.createElement("div");
  formField.id = `form-field-${fieldId}`;
  formField.classList.add("form-field", "needs-validation");

  formField.setAttribute("data-field-name", field.fieldName);

  if (showHelp) {
    formField.innerHTML = `
      <label for="field-input-${fieldId}" class="form-label">${field.label}</label>
      <input type="${htmlInputTypeForField(
        field
      )}" class="form-control" id="field-input-${fieldId}" aria-describedby="field-help-${fieldId} invalid-feedback-${fieldId}" placeholder="${
      field.placeholder
    }">
      <div id="invalid-feedback-${fieldId}" class="invalid-feedback"></div>
      <div id="field-help-${fieldId}" class="field-help form-text">${mdConverter.makeHtml(
      field.description
    )}</div>
    `;
  } else {
    formField.innerHTML = `
      <div class="row">
        <label for="field-input-${fieldId}" class="col-sm-3 col-form-label">${field.label}</label>
        <div class="col">
          <input type="${htmlInputTypeForField(
            field
          )}" class="form-control" id="field-input-${fieldId}" aria-describedby="invalid-feedback-${fieldId}" placeholder="${
      field.placeholder
    }">
          <div id="invalid-feedback-${fieldId}" class="invalid-feedback"></div>
        </div>
      </div>
    `;
  }

  const inputElement = formField.querySelector("input");

  if (field.required) {
    formField.querySelector("label").appendChild(createRequiredLabel());
    inputElement.setAttribute("required", "true");
  }

  if (field.htmlFormValidation) {
    for (const validationRule of field.htmlFormValidation) {
      inputElement.setAttribute(validationRule.attribute, validationRule.value);
    }
  }

  inputElement.addEventListener("input", (event) => {
    formField.classList.remove("was-validated");
    inputElement.setCustomValidity("");
    dispatchFormNeedsValidationEvent(event.target.closest("form"));
  });

  inputElement.addEventListener("invalid", (e) => {
    setValidationMessageBySchema(field, e.target);
    formField.querySelector(".invalid-feedback").innerText = e.target.validationMessage;
  });

  return formField;
};
