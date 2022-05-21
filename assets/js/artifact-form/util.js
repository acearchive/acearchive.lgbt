import showdown from "showdown";

export const fieldNameToId = (fieldName, listItemIndex) =>
  `${fieldName.replace(".", "-")}-${listItemIndex}`;

export const createRequiredLabel = () => {
  const requiredLabel = document.createElement("span");
  requiredLabel.classList.add("required-label");
  requiredLabel.innerText = "*";
  return requiredLabel;
};

export const mdConverter = new showdown.Converter();

export const isArrayOfObjects = (field) => field.type === "array" && field.itemType === "object";

export const getQueryParams = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(urlSearchParams.entries());
};

export const fieldNameForInputElement = (inputElement) => {
  return inputElement.closest(".form-field").getAttribute("data-field-name");
};
