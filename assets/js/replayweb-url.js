import normalizeCid from "./normalize-cid";

const forms = document.querySelectorAll(".replayweb-url-form form");

for (const form of forms) {
  const cidInputGroup = form.querySelector(".cid-input");
  const cidInputElement = cidInputGroup.querySelector("input");

  const filenameInputGroup = form.querySelector(".filename-input");
  const filenameInputElement = filenameInputGroup.querySelector("input");

  const urlInputGroup = form.querySelector(".url-input");
  const urlInputElement = urlInputGroup.querySelector("input");

  const submitButton = form.querySelector(".submit-button");
  const cancelButton = form.querySelector(".cancel-button");
  const urlOutput = form.querySelector(".url-output");

  const getUrl = () =>
    new URL(
      `https://replayweb.page/?source=ipfs://${cidInputElement.value}?filename=${encodeURIComponent(
        filenameInputElement.value
      )}#view=resources&urlSearchType=prefix&url=${encodeURIComponent(urlInputElement.value)}`
    );

  for (const inputGroup of form.querySelectorAll(".needs-validated")) {
    const inputElement = inputGroup.querySelector("input");
    inputElement.addEventListener("input", () => {
      inputGroup.classList.remove("was-validated");
    });
  }

  cidInputElement.addEventListener("invalid", () => {
    const feedbackElement = cidInputGroup.querySelector(".invalid-feedback");
    feedbackElement.innerText = cidInputElement.validationMessage;
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

  const setFormStateLoading = (loading) => {
    for (const inputElement of form.querySelectorAll("input")) {
      inputElement.disabled = loading;
    }

    submitButton.disabled = loading;
    cancelButton.hidden = !loading;

    if (loading) {
      submitButton.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Validating...
    `;
    } else {
      submitButton.innerText = "Submit";
    }
  };

  const checkValidity = async () => {
    if (cidInputElement.value.length > 0) {
      const abortController = new AbortController();

      cancelButton.onclick = () => {
        abortController.abort();
        setFormStateLoading(false);
      };

      setFormStateLoading(true);

      const { result, message } = await normalizeCid(cidInputElement.value, {
        signal: abortController.signal,
      });

      setFormStateLoading(false);

      if (result === undefined) {
        cidInputElement.setCustomValidity(message);
      } else {
        cidInputElement.setCustomValidity("");
        cidInputElement.value = result;
      }
    } else {
      cidInputElement.setCustomValidity("");
    }

    return form.checkValidity();
  };

  submitButton.addEventListener("click", () => {
    urlOutput.classList.remove("d-flex");
    urlOutput.classList.add("d-none");

    checkValidity().then((isValid) => {
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
  });
}
