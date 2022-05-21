import yaml from "js-yaml";
import { schema } from "@params";
import { checkValidity } from "./validate";
import { readFormData } from "./data";

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

export const createSubmitButton = (form) => {
  const submitButton = document.createElement("div");
  submitButton.classList.add("submit-control");
  submitButton.innerHTML = `
    <button id="artifact-form-submit-button" class="btn btn-primary me-1" type="button">Submit</button>
    <label class="form-text" for="artifact-form-submit-button">Open a pull request on GitHub</label>
  `;

  submitButton.querySelector("button").addEventListener("click", () => {
    checkValidity(form).then((isValid) => {
      if (isValid) window.open(artifactFormSubmitUrl(form), "_blank");
    });
  });

  return submitButton;
};
