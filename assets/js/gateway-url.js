const gatewayUrlForms = document.querySelectorAll(".gateway-url-form")

for (const form of gatewayUrlForms) {
    const cidInput = form.querySelector(".cid-input");
    const filenameInput = form.querySelector(".filename-input");
    const copyButton = form.querySelector(".copy-button");
    const copyConfirmedMessage = form.querySelector(".copy-confirmed-message");

    const updateUrlCopyValue = () => {
        if (filenameInput.value) {
            copyButton.setAttribute("value", `https://dweb.link/ipfs/${cidInput.value}/?filename=${encodeURIComponent(filenameInput.value)}`);
        } else {
            copyButton.setAttribute("value", `https://dweb.link/ipfs/${cidInput.value}`);
        }
    }

    cidInput.addEventListener("change", updateUrlCopyValue);
    filenameInput.addEventListener("change", updateUrlCopyValue);

    copyButton.addEventListener("clipboard-copy", function() {
        copyConfirmedMessage.removeAttribute("hidden");
        setTimeout(function() {
            copyConfirmedMessage.setAttribute("hidden", true);
        }, 1000);
    });
}
