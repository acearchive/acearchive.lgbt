import showdown from "showdown";
import yaml from "js-yaml";
import { schema } from "@params";

const artifactForm = document.querySelector(".new-artifact main form");
const mdConverter = new showdown.Converter();

const nameToId = (fieldName, fieldItemIndex) => `${fieldName.replace(".", "-")}-${fieldItemIndex}`;

const isArrayOfObjects = (field) => field.type === "array" && field.itemType === "object";

const copyFormGroupInputValues = (oldFieldItem, newFieldItem) => {
  const newFieldInputs = newFieldItem.querySelectorAll(".form-group input");
  for (const [index, oldFieldInput] of oldFieldItem.querySelectorAll(".form-group input").entries()) {
    newFieldInputs[index].value = oldFieldInput.value;
  }
}

const createFieldItem = (field, fieldItemIndex) => {
  const fieldItem = document.createElement("fieldset");
  fieldItem.classList.add("field-item");
  fieldItem.setAttribute("form", "artifact-form");
  fieldItem.setAttribute("data-field-name", field.fieldName);

  fieldItem.innerHTML = `
    <legend class="visually-hidden">#${fieldItemIndex + 1}</legend>
    <span class="d-none d-sm-flex field-item-gutter flex-column">
      <span class="field-item-index" aria-hidden="true">#${fieldItemIndex + 1}</span>
      <button type="button" class="field-item-action field-item-delete btn" aria-label="Delete">
        <span aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </span>
      </button>
    </span>
    <div class="card card-body">
      <span class="d-flex d-sm-none field-item-gutter justify-content-between">
        <span class="field-item-index" aria-hidden="true">#${fieldItemIndex + 1}</span>
        <button type="button" class="field-item-action field-item-delete btn" aria-label="Delete">
          <span aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </span>
        </button>
       </span>
      <div class="field-item-body"></div>
    </div>
  `;

  const fieldItemBody = fieldItem.querySelector(".field-item-body");

  for (const fieldName of field.fields) {
    const nestedField = field.definitions[fieldName];
    if (!nestedField.showInFormDocs) continue;
    fieldItemBody.appendChild(createFormGroup(nestedField, fieldItemIndex));
  }

  const deleteButtons = fieldItem.querySelectorAll("button.field-item-delete");

  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (e) => {
      const itemContainer = e.target.closest(".field-item-container");

      e.target.closest(".field-item").remove();

      for (const [index, fieldItem] of itemContainer.querySelectorAll(".field-item").entries()) {
        const newFieldItem = createFieldItem(field, index);
        copyFormGroupInputValues(fieldItem, newFieldItem);
        itemContainer.replaceChild(newFieldItem, fieldItem);
      }
    })
  }

  return fieldItem;
}

const createRequiredLabel = () => {
  const requiredLabel = document.createElement("span");
  requiredLabel.classList.add("required-label");
  requiredLabel.innerText = "*";
  return requiredLabel;
}

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
}

const htmlInputTypeForField = (field) => {
  const inputTypeBySchemaType = {
    "integer": "number",
    "string": "text",
    "array": "text",
  };

  return inputTypeBySchemaType[field.type];
}

const createInputFormGroup = (field, fieldItemIndex = 0) => {
  const fieldId = nameToId(field.fieldName, fieldItemIndex);
  const showHelp = fieldItemIndex === 0;

  const formGroup = document.createElement("div");
  formGroup.id = `form-group-${fieldId}`;
  formGroup.classList.add("form-group", "needs-validation");

  formGroup.setAttribute("data-field-name", field.fieldName);

  if (showHelp) {
    formGroup.innerHTML = `
        <label for="field-input-${fieldId}" class="form-label">${field.label}</label>
        <input type="${htmlInputTypeForField(field)}" class="form-control" id="field-input-${fieldId}" aria-describedby="field-help-${fieldId} invalid-feedback-${fieldId}" placeholder="${field.placeholder}">
        <div id="invalid-feedback-${fieldId}" class="invalid-feedback"></div>
        <div id="field-help-${fieldId}" class="field-help form-text">${mdConverter.makeHtml(field.description)}</div>
      `
  } else {
    formGroup.innerHTML = `
        <div class="row">
          <label for="field-input-${fieldId}" class="col-sm-3 col-form-label">${field.label}</label>
          <div class="col">
            <input type="${htmlInputTypeForField(field)}" class="form-control" id="field-input-${fieldId}" aria-describedby="field-help-${fieldId} invalid-feedback-${fieldId}" placeholder="${field.placeholder}">
            <div id="invalid-feedback-${fieldId}" class="invalid-feedback"></div>
          </div>
        </div>
      `;
  }

  const inputElement = formGroup.querySelector("input");

  if (field.required) {
    formGroup.querySelector("label").appendChild(createRequiredLabel());
    inputElement.setAttribute("required", "true");
  }

  if (field.htmlFormValidation) {
    for (const validationRule of field.htmlFormValidation) {
      inputElement.setAttribute(validationRule.attribute, validationRule.value);
    }
  }

  inputElement.addEventListener("input", (e) => {
    formGroup.classList.remove("was-validated");
  });

  inputElement.addEventListener("invalid", (e) => {
    setValidationMessageBySchema(field, e.target);
    formGroup.querySelector(".invalid-feedback").innerText = e.target.validationMessage;
  });

  return formGroup;
}

const createFieldItemFormGroup = (field, fieldItemIndex = 0) => {
  const fieldId = nameToId(field.fieldName, fieldItemIndex);
  const showHelp = fieldItemIndex === 0;

  const fieldItemGroup = document.createElement("fieldset");
  fieldItemGroup.setAttribute("form", "artifact-form");
  fieldItemGroup.classList.add("form-group");

  fieldItemGroup.innerHTML = `
      <legend class="form-label">${field.label}</legend>
      <div class="field-help form-text">${mdConverter.makeHtml(field.description)}</div>
      <div id="field-item-container-${fieldId}" class="field-item-container"></div>
      <button class="btn add-field-item form-button" type="button">
        <span class="me-1" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
        </span>
        <span>Add ${field.singularLabel}</span>
      </button>
    `;

  if (!showHelp) {
    fieldItemGroup.querySelector(".field-help").remove();
  }

  if (field.required) {
    fieldItemGroup.querySelector("legend").appendChild(createRequiredLabel());
  }

  fieldItemGroup.querySelector("button.add-field-item").addEventListener("click", () => {
    const itemContainer = fieldItemGroup.querySelector(".field-item-container");
    itemContainer.appendChild(createFieldItem(field, itemContainer.childElementCount));
  })

  return fieldItemGroup;
}

const createFormGroup = (field, fieldItemIndex = 0) => {
  if (isArrayOfObjects(field)) {
    return createFieldItemFormGroup(field, fieldItemIndex);
  } else {
    return createInputFormGroup(field, fieldItemIndex);
  }
}

const defaultValueForField = (field) => {
  if (field.type === "array") {
    return [];
  }

  return undefined;
}

const getInputValueForField = (field, parentElement) => {
  const valueTypeConverter = {
    "integer": (value) => parseInt(value),
    "string": (value) => value,
    "array": (value) => value
      .split(",")
      .map(item => valueTypeConverter[field.itemType](item.trim())),
  };

  const inputElement = parentElement.querySelector(`.form-group[data-field-name="${field.fieldName}"] input`);

  if (inputElement.value.length === 0) {
    return defaultValueForField(field);
  }

  return valueTypeConverter[field.type](inputElement.value);
}

const getDataForField = (field, form) => {
  if (isArrayOfObjects(field)) {
    const fieldItems = form.querySelectorAll(`.field-item[data-field-name="${field.fieldName}"]`);

    if (fieldItems.length === 0) {
      return defaultValueForField(field)
    }

    return Array.from(fieldItems)
      .map(
        fieldItem => Object.entries(field.definitions)
          .filter(([_, nestedField]) => nestedField.showInFormDocs)
          .reduce(
            (fieldItemData, [fieldKey, nestedField]) => ({
              [fieldKey]: isArrayOfObjects(nestedField)
                ? getDataForField(nestedField, form)
                : getInputValueForField(nestedField, fieldItem),
              ...fieldItemData,
            }),
            {},
          )
      );
  } else {
    return getInputValueForField(field, form)
  }
}

const getDataForSchema = (form) => ({
  "version": schema.version,
  ...Object.entries(schema.definitions)
    .filter(([_, field]) => field.showInFormDocs)
    .reduce(
      (data, [fieldKey, field]) => ({
        [fieldKey]: getDataForField(field, form),
        ...data,
      }),
      {},
    )
});

const groupedFieldKeys = (() => {
  const keysOfField = (field) => {
    if (!field.fields || field.fields.length === 0) return [];

    return [
      field.fields,
      ...field.fields.map(fieldKey => keysOfField(field.definitions[fieldKey]))
    ].filter(group => group.length > 0);
  }

  let fieldKeyGroups;

  return () => {
    if (fieldKeyGroups) return fieldKeyGroups;

    fieldKeyGroups = keysOfField(schema);

    return fieldKeyGroups;
  }
})();

const sortKeysBySchema = (a, b) => {
  for (const fieldGroup of groupedFieldKeys()) {
    const indexOfA = fieldGroup.indexOf(a);
    const indexOfB = fieldGroup.indexOf(b);

    if (indexOfA === -1 || indexOfB === -1) continue;

    return indexOfA > indexOfB ? 1 : indexOfA < indexOfB ? -1 : 0;
  }

  return 0;
}

const serializeFormDataToYaml = (data) => yaml.dump(data, {
  sortKeys: sortKeysBySchema,
  quotingType: "\"",
  forceQuotes: true,
})

const githubPrSubmitUrl = (slug, content) => `https://github.com/acearchive/acearchive.lgbt/new/main/?filename=content/archive/${slug}/index.md&value=${encodeURIComponent(content)}`

const artifactFormSubmitUrl = (form) => {
  const data = getDataForSchema(form);
  const urlSlug = data.slug;
  delete data.slug;

  return githubPrSubmitUrl(urlSlug, serializeFormDataToYaml(data));
}

const createSubmitButton = (form) => {
  const submitButton = document.createElement("div");
  submitButton.classList.add("submit-control");
  submitButton.innerHTML = `
    <button id="artifact-form-submit-button" class="btn btn-primary me-1" type="button">Submit</button>
    <label class="form-text" for="artifact-form-submit-button">Open a pull request on GitHub</label>
  `;

  submitButton.querySelector("button").addEventListener("click", () => {
    for (const needsValidationElement of form.querySelectorAll(".needs-validation")) {
      needsValidationElement.querySelector("input").setCustomValidity("");
      needsValidationElement.classList.add("was-validated");
    }

    if (form.checkValidity()) {
      window.open(artifactFormSubmitUrl(form), "_blank");
    }
  });

  return submitButton;
}

if (artifactForm) {
  for (const fieldName of schema.fields) {
    const field = schema.definitions[fieldName];
    if (!field.showInFormDocs) continue;
    artifactForm.appendChild(createFormGroup(field));
  }

  artifactForm.appendChild(createSubmitButton(artifactForm));
}
