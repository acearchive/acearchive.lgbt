const forms = document.querySelectorAll(".replayweb-url-form form");

for (const form of forms) {
  const cidInputGroup = form.querySelector(".cid-input");
  const cidInputElement = cidInputGroup.querySelector("input");

  const filenameInputGroup = form.querySelector(".filename-input");
  const filenameInputElement = filenameInputGroup.querySelector("input");

  const urlInputGroup = form.querySelector(".url-input");
  const urlInputElement = urlInputGroup.querySelector("input");

  const copyButton = form.querySelector(".copy-button");
  const copyConfirmedMessage = form.querySelector(".copy-confirmed-message");

  const updateUrlCopyValue = () => {
    copyButton.setAttribute(
      "value",
      `https://replayweb.page/?source=ipfs://${cidInputElement.value}?filename=${encodeURIComponent(
        filenameInputElement.value
      )}#view=resources&urlSearchType=prefix&url=${encodeURIComponent(urlInputElement.value)}`
    );
  };

  for (const inputGroup of form.querySelectorAll(".needs-validated")) {
    const inputElement = inputGroup.querySelector("input");
    inputElement.addEventListener("change", updateUrlCopyValue);
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
        "File names must use hyphens between words and have a file extension.";
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

  copyButton.addEventListener("click", () => {
    form.checkValidity();
    for (const validationElement of form.querySelectorAll(".needs-validated")) {
      validationElement.classList.add("was-validated");
    }
  });

  copyButton.addEventListener("clipboard-copy", () => {
    if (!form.checkValidity()) return;

    copyConfirmedMessage.removeAttribute("hidden");
    setTimeout(function () {
      copyConfirmedMessage.setAttribute("hidden", "true");
    }, 1000);
  });
}
