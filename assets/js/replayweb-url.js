const forms = document.querySelectorAll(".replayweb-url-form form");

for (const form of forms) {
  const cidInput = form.querySelector(".cid-input");
  const filenameInput = form.querySelector(".filename-input");
  const urlInput = form.querySelector(".url-input");
  const copyButton = form.querySelector(".copy-button");
  const copyConfirmedMessage = form.querySelector(".copy-confirmed-message");

  const updateUrlCopyValue = () => {
    copyButton.setAttribute(
      "value",
      `https://replayweb.page/?source=ipfs://${cidInput.value}?filename=${encodeURIComponent(
        filenameInput.value
      )}#view=resources&urlSearchType=prefix&url=${encodeURIComponent(urlInput.value)}`
    );
  };

  cidInput.addEventListener("change", updateUrlCopyValue);
  filenameInput.addEventListener("change", updateUrlCopyValue);
  urlInput.addEventListener("change", updateUrlCopyValue);

  copyButton.addEventListener("clipboard-copy", function () {
    copyConfirmedMessage.removeAttribute("hidden");
    setTimeout(function () {
      copyConfirmedMessage.setAttribute("hidden", true);
    }, 1000);
  });
}
