import { getQueryParams, isArrayOfObjects } from "./util";
import { artifacts, schema } from "@params";

const defaultValueForField = (field) => {
  if (field.type === "array") {
    return [];
  }

  return undefined;
};

const getInputValueForField = (field, parentElement) => {
  const valueTypeConverter = {
    integer: (value) => parseInt(value),
    string: (value) => value,
    array: (value) =>
      value.split(",").map((item) => valueTypeConverter[field.itemType](item.trim())),
  };

  const inputElement = parentElement.querySelector(
    `.form-field[data-field-name="${field.fieldName}"] input`
  );

  if (inputElement.value.length === 0) {
    return defaultValueForField(field);
  }

  return valueTypeConverter[field.type](inputElement.value);
};

const getDataForField = (field, form) => {
  if (isArrayOfObjects(field)) {
    const fieldListItems = form.querySelectorAll(
      `.field-list-item[data-field-name="${field.fieldName}"]`
    );

    if (fieldListItems.length === 0) {
      return defaultValueForField(field);
    }

    return Array.from(fieldListItems).map((listItem) =>
      Object.entries(field.definitions)
        .filter(([, nestedField]) => nestedField.showInFormDocs)
        .reduce(
          (listItemData, [fieldKey, nestedField]) => ({
            [fieldKey]: isArrayOfObjects(nestedField)
              ? getDataForField(nestedField, form)
              : getInputValueForField(nestedField, listItem),
            ...listItemData,
          }),
          {}
        )
    );
  }
  return getInputValueForField(field, form);
};

export const readFormData = (form) => {
  const baseArtifactSlug = getQueryParams().modify;
  const baseArtifactValues = artifacts[baseArtifactSlug];

  const data = {
    version: schema.version,
  }

  for (const [fieldKey, field] of Object.entries(schema.definitions)) {
    if (field.showInFormDocs) {
      data[fieldKey] = getDataForField(field, form);
    } else if (baseArtifactValues && baseArtifactValues.hasOwnProperty(fieldKey)) {
      data[fieldKey] = baseArtifactValues[fieldKey]
    }
  }

  return data;
};
