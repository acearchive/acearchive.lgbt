import { createRequiredLabel, fieldNameToId, isArrayOfObjects, mdConverter } from "./util";
import { createFormField } from "./form-field";

const copyListItemInputValues = (oldFieldListItem, newFieldListItem) => {
  const newInputElements = newFieldListItem.querySelectorAll(".form-field input");
  const oldInputElements = oldFieldListItem.querySelectorAll(".form-field input");
  for (const [index, oldInputElement] of oldInputElements.entries()) {
    newInputElements[index].value = oldInputElement.value;
  }
};

const createFieldList = (field, listItemIndex = 0) => {
  const fieldId = fieldNameToId(field.fieldName, listItemIndex);
  const showHelp = listItemIndex === 0;

  const fieldList = document.createElement("fieldset");
  fieldList.setAttribute("form", "artifact-form");
  fieldList.setAttribute("data-field-name", field.fieldName);
  fieldList.classList.add("field-list");

  fieldList.innerHTML = `
    <legend class="form-label">${field.label}</legend>
    <div class="field-help form-text">${mdConverter.makeHtml(field.description)}</div>
    <div id="field-list-body-${fieldId}" class="field-list-body"></div>
    <button class="btn add-button icon-button form-button" type="button">
      <span class="me-1" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </span>
      Add ${field.singularLabel}
    </button>
  `;

  if (!showHelp) {
    fieldList.querySelector(".field-help").remove();
  }

  if (field.required) {
    fieldList.querySelector("legend").appendChild(createRequiredLabel());
  }

  fieldList.querySelector(":scope > .add-button").addEventListener("click", () => {
    const fieldListBody = fieldList.querySelector(".field-list-body");
    fieldListBody.appendChild(createFieldListItem(field, fieldListBody.childElementCount));
  });

  return fieldList;
};

export const createFieldListItem = (field, listItemIndex) => {
  const listItem = document.createElement("fieldset");
  listItem.classList.add("field-list-item");
  listItem.setAttribute("form", "artifact-form");
  listItem.setAttribute("data-field-name", field.fieldName);

  listItem.innerHTML = `
    <legend class="visually-hidden">#${listItemIndex + 1}</legend>
    <span class="d-none d-sm-flex list-item-gutter flex-column">
      <span class="list-item-index" aria-hidden="true">#${listItemIndex + 1}</span>
      <button type="button" class="form-button delete-button btn" aria-label="Delete">
        <span aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </span>
      </button>
    </span>
    <div class="card card-body">
      <span class="d-flex d-sm-none list-item-gutter justify-content-between">
        <span class="list-item-index" aria-hidden="true">#${listItemIndex + 1}</span>
        <button type="button" class="form-button delete-button btn" aria-label="Delete">
          <span aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </span>
        </button>
       </span>
      <div class="list-item-body"></div>
    </div>
  `;

  const listItemBody = listItem.querySelector(".list-item-body");

  for (const fieldName of field.fields) {
    const nestedField = field.definitions[fieldName];
    if (!nestedField.showInFormDocs) continue;
    listItemBody.appendChild(createFormFieldOrFieldList(nestedField, listItemIndex));
  }

  const deleteButtons = listItem.querySelectorAll(".list-item-gutter > button.delete-button");

  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (e) => {
      const parentListItemBody = e.target.closest(".field-list-body");

      e.target.closest(".field-list-item").remove();

      const childListItems = parentListItemBody.querySelectorAll(".field-list-item");

      for (const [index, oldListItem] of childListItems.entries()) {
        const newListItem = createFieldListItem(field, index);
        copyListItemInputValues(oldListItem, newListItem);
        parentListItemBody.replaceChild(newListItem, oldListItem);
      }
    });
  }

  return listItem;
};

export const createFormFieldOrFieldList = (field, listItemIndex = 0) => {
  if (isArrayOfObjects(field)) {
    return createFieldList(field, listItemIndex);
  }
  return createFormField(field, listItemIndex);
};
