import * as Yup from "yup";
import { schema as artifactSlugSchema } from "./artifact-form/schema";

const forms = document.querySelectorAll(".replayweb-url-form form");

const slugSchema = Yup.reach(artifactSlugSchema, "slug").label("Artifact Slug");

const fileNameSchema = Yup.reach(artifactSlugSchema, "files[].fileName")
  .label("File Name")
  .matches(/.warc$/, ({ label }: { label: string }) => `${label} must have a .warc file extension`);

const urlSchema = Yup.string()
  .label("Archived URL")
  .required()
  .trim()
  .url()
  .matches(new RegExp(`^https?://`), ({ label }) => `${label} must be an http:// or https:// URL`);

type Schema = any;

const validate = async (schema: Schema, value: any): Promise<string | undefined> => {
  try {
    console.log(`value = ${value}`);
    await schema.validate(value, { abortEarly: true });
  } catch (err) {
    if (err instanceof Yup.ValidationError && err.errors.length > 0) {
      return err.errors[0];
    }

    throw err;
  }

  return undefined;
};

for (const form of forms) {
  const slugInputGroup = form.querySelector(".slug-input");
  const fileNameInputGroup = form.querySelector(".filename-input");
  const urlInputGroup = form.querySelector(".url-input");

  if (slugInputGroup === null || fileNameInputGroup === null || urlInputGroup === null) continue;

  const slugInputElement = slugInputGroup.querySelector("input");
  const fileNameInputElement = fileNameInputGroup.querySelector("input");
  const urlInputElement = urlInputGroup.querySelector("input");

  if (slugInputElement === null || fileNameInputElement === null || urlInputElement === null)
    continue;

  const submitButton = form.querySelector(".submit-button");
  const urlOutput = form.querySelector(".url-output");

  if (submitButton === null || urlOutput === null) continue;

  const getUrl = () =>
    new URL(
      `https://replayweb.page/?source=https://files.acearchive.lgbt/artifacts/${
        slugInputElement.value
      }/${fileNameInputElement.value}#view=resources&urlSearchType=prefix&url=${encodeURIComponent(
        urlInputElement.value
      )}`
    );

  for (const inputGroup of form.querySelectorAll(".needs-validated")) {
    const inputElement = inputGroup.querySelector("input");

    if (inputElement === null) continue;

    inputElement.addEventListener("input", () => {
      inputGroup.classList.remove("was-validated");
    });
  }

  const updateFieldValidity = async ({
    inputGroup,
    inputElement,
    schema,
  }: {
    inputGroup: Element;
    inputElement: HTMLInputElement;
    schema: Schema;
  }): Promise<boolean> => {
    const feedbackElement: HTMLElement | null = inputGroup.querySelector(".invalid-feedback");

    if (feedbackElement === null) return true;

    console.log(inputElement.value);
    const errMsg = await validate(schema, inputElement.value);

    if (errMsg === undefined) {
      feedbackElement.innerText = "";
      inputElement.classList.remove("is-invalid");
      inputElement.classList.add("is-valid");

      return true;
    } else {
      feedbackElement.innerText = errMsg;
      inputElement.classList.remove("is-valid");
      inputElement.classList.add("is-invalid");

      return false;
    }
  };

  const isFormValid = async (): Promise<boolean> => {
    return (
      await Promise.all([
        await updateFieldValidity({
          inputGroup: slugInputGroup,
          inputElement: slugInputElement,
          schema: slugSchema,
        }),
        await updateFieldValidity({
          inputGroup: fileNameInputGroup,
          inputElement: fileNameInputElement,
          schema: fileNameSchema,
        }),
        await updateFieldValidity({
          inputGroup: urlInputGroup,
          inputElement: urlInputElement,
          schema: urlSchema,
        }),
      ])
    ).every((isValid) => isValid);
  };

  submitButton.addEventListener("click", async () => {
    urlOutput.classList.remove("d-flex");
    urlOutput.classList.add("d-none");

    /*
    for (const validationElement of form.querySelectorAll(".needs-validated")) {
      validationElement.classList.add("was-validated");
    }
    */

    if (await isFormValid()) {
      urlOutput.classList.remove("d-none");
      urlOutput.classList.add("d-flex");

      const generatedUrl = getUrl();

      const urlOutputAnchor = urlOutput.querySelector("a");
      const urlOutputClipboardButton = urlOutput.querySelector("clipboard-copy");

      if (urlOutputAnchor === null || urlOutputClipboardButton === null) return;

      urlOutputAnchor.innerText = generatedUrl.toString();
      urlOutputAnchor.setAttribute("href", generatedUrl.toString());
      urlOutputClipboardButton.setAttribute("value", generatedUrl.toString());
    }
  });
}
