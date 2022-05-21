import { isArrayOfObjects } from "./util";
import { schema } from "@params";

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

export const readFormData = (form) => ({
  version: schema.version,
  ...Object.entries(schema.definitions)
    .filter(([, field]) => field.showInFormDocs)
    .reduce(
      (data, [fieldKey, field]) => ({
        [fieldKey]: getDataForField(field, form),
        ...data,
      }),
      {}
    ),
});
