import showdown from "showdown";
import { schema } from "@params";

const form = document.querySelector(".artifact-form main form");
let mdConverter = new showdown.Converter();

const nameToId = (fieldName, fieldItemIndex) => `${fieldName.replace(".", "-")}-${fieldItemIndex}`;

const createFieldItem = (field, fieldItemIndex) => {
  const fieldItem = document.createElement("div");
  fieldItem.classList.add("field-item");

  fieldItem.innerHTML = `
    <span class="field-item-gutter">
      <span class="field-item-index">#${fieldItemIndex + 1}</span>
      <button type="button" class="field-item-action field-item-delete btn" aria-label="Delete">
        <span aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </span>
      </button>
    </span>
    <div class="field-item-body card card-body"></div>
  `;

  const fieldItemBody = fieldItem.querySelector(".field-item-body");

  for (const fieldName of field.fields) {
    const nestedField = field.definitions[fieldName];
    if (!nestedField.form) continue;
    fieldItemBody.appendChild(createFormGroup(nestedField, fieldItemIndex));
  }

  fieldItem.querySelector("button.field-item-delete").addEventListener("click", (e) => {
    const itemContainer = e.target.closest(".field-item-container");

    e.target.closest(".field-item").remove();

    for (const [index, fieldItem] of itemContainer.querySelectorAll(".field-item").entries()) {
      fieldItem.querySelector(".field-item-index").innerHTML = `#${index + 1}`;
    }
  })

  return fieldItem;
}

const createFormGroup = (field, fieldItemIndex = 0) => {
  const fieldId = nameToId(field.name, fieldItemIndex);
  const showHelp = fieldItemIndex === 0;

  const formGroup = document.createElement("div");
  formGroup.id = `form-group-${fieldId}`;
  formGroup.classList.add("form-group");

  if (field.fields && field.fields.length > 0) {
    formGroup.innerHTML = `
      <label for="field-item-container-${fieldId}" class="form-label">${field.label}</label>
      <div class="field-help form-text">${mdConverter.makeHtml(field.description)}</div>
      <div id="field-item-container-${fieldId}" class="field-item-container"></div>
      <button class="btn add-field-item form-button" type="button">
        <span class="me-1" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
        </span>
        <span>Add ${field.singular}</span>
      </button>
    `;

    if (!showHelp) {
      formGroup.querySelector(".field-help").remove();
    }

    formGroup.querySelector("button.add-field-item").addEventListener("click", () => {
      const itemContainer = formGroup.querySelector(".field-item-container");
      itemContainer.appendChild(createFieldItem(field, itemContainer.childElementCount));
    })
  } else {
    if (showHelp) {
      formGroup.innerHTML = `
        <label for="field-input-${fieldId}" class="form-label">${field.label}</label>
        <input type="${field.inputType}" class="form-control" id="field-input-${fieldId}" aria-describedby="field-help-${fieldId}" placeholder="${field.placeholder}">
        <div class="invalid-feedback"></div>
        <div id="field-help-${fieldId}" class="field-help form-text">${mdConverter.makeHtml(field.description)}</div>
      `
    } else {
      formGroup.innerHTML = `
        <div class="row">
          <label for="field-input-${fieldId}" class="col-sm-3 col-form-label">${field.label}</label>
          <div class="col">
            <input type="${field.inputType}" class="form-control" id="field-input-${fieldId}" aria-describedby="field-help-${fieldId}" placeholder="${field.placeholder}">
          </div>
        </div>
        <div class="invalid-feedback"></div>
      `;
    }

    if (field.required) {
      formGroup.querySelector("input").setAttribute("required", "true");
    }
  }

  return formGroup;
}

if (form) {
  for (const fieldName of schema.fields) {
    const field = schema.definitions[fieldName];
    if (!field.form) continue;
    form.appendChild(createFormGroup(field))
  }
}
