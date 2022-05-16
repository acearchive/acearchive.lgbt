import showdown from "showdown";
import { schema } from "@params";

const form = document.querySelector(".artifact-form main form");

const nameToId = (fieldName) => fieldName.replace(".", "-")

let mdConverter = new showdown.Converter();

const createFieldItem = (field, showHelp) => {
  const fieldItem = document.createElement("div");
  fieldItem.classList.add("field-item", "card", "card-body");

  for (const fieldName of field.fields) {
    const nestedField = field.definitions[fieldName];
    if (!nestedField.form) continue;
    fieldItem.appendChild(createFormGroup(nestedField, showHelp));
  }

  return fieldItem;
}

const createFormGroup = (field, showHelp = true) => {
  const fieldId = nameToId(field.name);

  const formGroup = document.createElement("div");
  formGroup.id = `form-group-${fieldId}`;
  formGroup.classList.add("form-group");

  if (field.fields && field.fields.length > 0) {
    if (showHelp) {
      formGroup.innerHTML = `
        <div id="form-group-${fieldId}" class="mb-3">
          <label for="field-item-container-${fieldId}" class="form-label">${field.label}</label>
          <div class="field-help form-text">${mdConverter.makeHtml(field.description)}</div>
          <div id="field-item-container-${fieldId}" class="field-item-container"></div>
          <button class="btn btn-primary btn-sm mt-2 add-field-item" type="button">Add ${field.singular}</button>
        </div>
      `;
    } else {
      formGroup.innerHTML = `
        <div id="form-group-${fieldId}" class="mb-3">
          <label for="field-item-container-${fieldId}" class="form-label">${field.label}</label>
          <div id="field-item-container-${fieldId}" class="field-item-container"></div>
          <button class="btn btn-primary btn-sm mt-2 add-field-item" type="button">Add ${field.singular}</button>
        </div>
      `;
    }

    formGroup.querySelector("button.add-field-item").addEventListener("click", () => {
      const itemContainer = formGroup.querySelector(".field-item-container")
      const isFirstItemInContainer = itemContainer.childElementCount === 0;
      itemContainer.appendChild(createFieldItem(field, isFirstItemInContainer));
    })
  } else {
    if (showHelp) {
      formGroup.innerHTML = `
        <div id="form-group-${fieldId}" class="mb-3">
          <label for="field-input-${fieldId}" class="form-label">${field.label}</label>
          <input type="${field.inputType}" class="form-control" id="field-input-${fieldId}" aria-describedby="field-help-${fieldId}" placeholder="${field.placeholder}">
          <div class="invalid-feedback"></div>
          <div id="field-help-${fieldId}" class="field-help form-text">${mdConverter.makeHtml(field.description)}</div>
        </div>
      `
    } else {
      formGroup.innerHTML = `
        <div id="form-group-${fieldId}">
          <div class="row">
            <label for="field-input-${fieldId}" class="col-sm-3 col-form-label">${field.label}</label>
            <div class="col">
              <input type="${field.inputType}" class="form-control" id="field-input-${fieldId}" aria-describedby="field-help-${fieldId}" placeholder="${field.placeholder}">
            </div>
          </div>
          <div class="invalid-feedback"></div>
        </div>
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
