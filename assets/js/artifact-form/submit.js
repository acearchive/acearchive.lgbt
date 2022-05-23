import yaml from "js-yaml";
import { schema } from "@params";
import { readFormData } from "./data";
import { fieldNameForInputElement, getQueryParams } from "./util";
import { runValidator } from "./validate";

const groupedFieldKeys = (() => {
  const keysOfField = (field) => {
    if (!field.fields || field.fields.length === 0) return [];

    return [
      field.fields,
      ...field.fields.flatMap((fieldKey) => keysOfField(field.definitions[fieldKey])),
    ].filter((group) => group.length > 0);
  };

  let fieldKeyGroups;

  return () => {
    if (fieldKeyGroups) return fieldKeyGroups;

    fieldKeyGroups = keysOfField(schema);

    return fieldKeyGroups;
  };
})();

const sortKeysBySchema = (a, b) => {
  for (const fieldKeys of groupedFieldKeys()) {
    const indexOfA = fieldKeys.indexOf(a);
    const indexOfB = fieldKeys.indexOf(b);

    if (indexOfA === -1 || indexOfB === -1) continue;

    return indexOfA > indexOfB ? 1 : indexOfA < indexOfB ? -1 : 0;
  }

  return 0;
};

const serializeFormDataToYaml = (data) =>
  yaml.dump(data, {
    sortKeys: sortKeysBySchema,
    quotingType: '"',
    forceQuotes: true,
  });

const serializeFormDataToMarkdownFrontMatter = (data) => `---\n${serializeFormDataToYaml(data)}---`;

const githubPrSubmitUrl = (slug, content) =>
  `https://github.com/acearchive/acearchive.lgbt/new/main/?filename=content/archive/${slug}/index.md&value=${encodeURIComponent(
    content
  )}`;

const artifactFormSubmitUrl = (form) => {
  const data = readFormData(form);
  const urlSlug = data.slug;
  delete data.slug;

  return githubPrSubmitUrl(urlSlug, serializeFormDataToMarkdownFrontMatter(data));
};

const buttonValidateText = "Validate";
const buttonLoadingText = "Validating...";
const buttonSubmitText = "Submit";
const labelValidateText = "Check that everything looks correct.";
const labelLoadingText = "Checking that everything looks correct.";
const labelSubmitText = "Open a pull request on GitHub.";

const setButtonLoading = (submitButton) => {
  const buttonElement = submitButton.querySelector("button");
  const labelElement = submitButton.querySelector("label");
  const submitButtonChild = submitButton.querySelector(":scope > *");

  buttonElement.disabled = true;
  buttonElement.innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    ${buttonLoadingText}
  `;
  labelElement.innerText = labelLoadingText;
  submitButtonChild.classList.remove("is-invalid", "is-valid");
};

const setButtonSubmit = (submitButton) => {
  const buttonElement = submitButton.querySelector("button");
  const labelElement = submitButton.querySelector("label");
  const submitButtonChild = submitButton.querySelector(":scope > *");

  buttonElement.disabled = false;
  buttonElement.innerText = buttonSubmitText;
  labelElement.innerText = labelSubmitText;
  submitButtonChild.classList.remove("is-invalid");
  submitButtonChild.classList.add("is-valid");
};

const setButtonNeedsValidation = (submitButton) => {
  const buttonElement = submitButton.querySelector("button");
  const labelElement = submitButton.querySelector("label");
  const submitButtonChild = submitButton.querySelector(":scope > *");

  buttonElement.disabled = false;
  buttonElement.innerText = buttonValidateText;
  labelElement.innerText = labelValidateText;
  submitButtonChild.classList.remove("is-valid", "is-invalid");
};

const setButtonInvalid = (submitButton) => {
  const buttonElement = submitButton.querySelector("button");
  const labelElement = submitButton.querySelector("label");
  const submitButtonChild = submitButton.querySelector(":scope > *");

  buttonElement.disabled = false;
  buttonElement.innerText = buttonValidateText;
  labelElement.innerText = labelValidateText;
  submitButtonChild.classList.remove("is-valid");
  submitButtonChild.classList.add("is-invalid");
};

const setFormInputsDisabled = (form, disabled) => {
  for (const buttonElement of form.querySelectorAll(".form-button")) {
    buttonElement.disabled = disabled;
  }

  for (const inputElement of form.querySelectorAll(".form-field input")) {
    if (
      fieldNameForInputElement(inputElement) === schema.definitions.slug.fieldName &&
      getQueryParams().modify !== undefined
    ) {
      continue;
    }

    inputElement.disabled = disabled;
  }
};

const showValidityMessages = (form) => {
  for (const validationElement of form.querySelectorAll(".needs-validation")) {
    const inputElement = validationElement.querySelector("input");

    if (!inputElement.validity.valid || inputElement.value.length > 0) {
      // Don't show the validity of the input if it is empty and not required.
      validationElement.classList.add("was-validated");
    }
  }
};

const registerSubmitHandler = (form, submitButton) => {
  let formIsValidated = false;

  const submitEventHandler = () => {
    window.open(artifactFormSubmitUrl(form), "_blank");
  };

  const validateEventHandler = () => {
    setButtonLoading(submitButton);
    setFormInputsDisabled(form, true);

    runValidator(form).then(() => {
      setFormInputsDisabled(form, false);
      showValidityMessages(form);
      formIsValidated = true;

      if (form.checkValidity()) {
        setButtonSubmit(submitButton);
        buttonHandler = submitEventHandler;
      } else {
        setButtonInvalid(submitButton);
        buttonHandler = validateEventHandler;
      }
    });
  };

  let buttonHandler = validateEventHandler;

  for (const inputElement of form.querySelectorAll(".form-field input")) {
    inputElement.addEventListener("input", () => {
      if (formIsValidated) {
        setButtonNeedsValidation(submitButton);
        buttonHandler = validateEventHandler;
        formIsValidated = false;
      }
    });
  }

  submitButton.querySelector("button").addEventListener("click", () => buttonHandler());
};

export const createSubmitButton = (form) => {
  const submitButton = document.createElement("div");
  submitButton.classList.add("submit-control");
  submitButton.innerHTML = `
    <div>
      <button id="artifact-form-submit-button" class="btn btn-primary me-1 d-block d-sm-inline" type="button" aria-describedby="artifact-form-submit-help">${buttonValidateText}</button>
      <label class="form-text d-block d-sm-inline mt-2 mt-sm-0" for="artifact-form-submit-button">${labelValidateText}</label>
    </div>
    <div id="artifact-form-submit-help" class="invalid-feedback mt-1">Looks like there were some problems.</div>
  `;

  registerSubmitHandler(form, submitButton);

  return submitButton;
};
