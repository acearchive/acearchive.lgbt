import { isArrayOfObjects } from "./util";
import { createFieldListItem } from "./field-list";
import { artifacts, schema } from "@params";

const getInputValueFromArtifactValue = (field, value) => {
  if (field.type === "array") return value.join(", ");
  return value;
};

const getArtifactValue = (artifactObj, key) =>
  artifactObj[
    Object.keys(artifactObj).find((objKey) => objKey.toLowerCase() === key.toLowerCase())
  ];

const setInputValueFromArtifact = (form, field, fieldKey, value) => {
  if (!field.includeInForm) return;

  if (isArrayOfObjects(field)) {
    for (const [index, listItem] of value.entries()) {
      const fieldListBody = form.querySelector(
        `.field-list[data-field-name="${field.fieldName}"] .field-list-body`
      );

      const fieldListItem = createFieldListItem(field, index);
      fieldListBody.appendChild(fieldListItem);

      for (const [nestedFieldKey, nestedField] of Object.entries(field.definitions)) {
        if (!nestedField.includeInForm) continue;

        const nestedFieldValue = getArtifactValue(listItem, nestedFieldKey);
        if (nestedFieldValue === undefined) continue;

        const inputElement = fieldListItem.querySelector(
          `.form-field[data-field-name="${nestedField.fieldName}"] input`
        );
        inputElement.value = getInputValueFromArtifactValue(nestedField, nestedFieldValue);
      }
    }
  } else {
    const inputElement = form.querySelector(
      `.form-field[data-field-name="${field.fieldName}"] input`
    );
    inputElement.value = getInputValueFromArtifactValue(field, value);
  }
};

export const fillInputsFromArtifact = (form, slug) => {
  const artifactValues = artifacts[slug];
  if (artifactValues === undefined) return {};

  const slugInputElement = form.querySelector(
    `.form-field[data-field-name="${schema.definitions.slug.fieldName}"] input`
  );
  slugInputElement.value = slug;
  slugInputElement.disabled = true;

  for (const [fieldKey, field] of Object.entries(schema.definitions)) {
    const artifactValue = getArtifactValue(artifactValues, fieldKey);
    if (artifactValue === undefined) continue;

    setInputValueFromArtifact(form, field, fieldKey, artifactValue);
  }
};
