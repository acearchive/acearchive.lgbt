const forms = document.querySelectorAll(".replayweb-url-form form");

for (const form of forms) {
  const slugInputGroup = form.querySelector(".slug-input");
  const slugInputElement = slugInputGroup.querySelector("input");

  const filenameInputGroup = form.querySelector(".filename-input");
  const filenameInputElement = filenameInputGroup.querySelector("input");

  const urlInputGroup = form.querySelector(".url-input");
  const urlInputElement = urlInputGroup.querySelector("input");

  const submitButton = form.querySelector(".submit-button");
  const urlOutput = form.querySelector(".url-output");

  const getUrl = () =>
    new URL(
      `https://replayweb.page/?source=https://files.acearchive.lgbt/${slugInputElement.value}/${
        filenameInputElement.value
      }#view=resources&urlSearchType=prefix&url=${encodeURIComponent(urlInputElement.value)}`
    );

  for (const inputGroup of form.querySelectorAll(".needs-validated")) {
    const inputElement = inputGroup.querySelector("input");
    inputElement.addEventListener("input", () => {
      inputGroup.classList.remove("was-validated");
    });
  }

  slugInputElement.addEventListener("invalid", () => {
    const feedbackElement = slugInputGroup.querySelector(".invalid-feedback");
    if (slugInputElement.validity.patternMismatch) {
      feedbackElement.innerText =
        "URL slugs can only contain lowercase letters, numbers, and hyphens.";
    } else {
      feedbackElement.innerText = slugInputElement.validationMessage;
    }
  });

  filenameInputElement.addEventListener("invalid", () => {
    const feedbackElement = filenameInputGroup.querySelector(".invalid-feedback");
    if (filenameInputElement.validity.patternMismatch) {
      feedbackElement.innerText =
        "File names must use hyphens between words and have a .warc extension.";
    } else {
      feedbackElement.innerText = filenameInputElement.validationMessage;
    }
  });

  urlInputElement.addEventListener("invalid", () => {
    const feedbackElement = urlInputGroup.querySelector(".invalid-feedback");
    if (urlInputElement.validity.typeMismatch) {
      feedbackElement.innerText = "This must be a valid URL.";
    } else if (urlInputElement.validity.patternMismatch) {
      feedbackElement.innerText = "This must be an http:// or https:// URL.";
    } else {
      feedbackElement.innerText = urlInputElement.validationMessage;
    }
  });

  submitButton.addEventListener("click", () => {
    urlOutput.classList.remove("d-flex");
    urlOutput.classList.add("d-none");

    const isValid = form.checkValidity();

    for (const validationElement of form.querySelectorAll(".needs-validated")) {
      validationElement.classList.add("was-validated");
    }

    if (isValid) {
      urlOutput.classList.remove("d-none");
      urlOutput.classList.add("d-flex");

      const generatedUrl = getUrl();
      urlOutput.querySelector("a").innerText = generatedUrl.toString();
      urlOutput.querySelector("a").setAttribute("href", generatedUrl.toString());
      urlOutput.querySelector("clipboard-copy").value = generatedUrl.toString();
    }
  });
}
