const gatewayUrlForms = document.querySelectorAll(".gateway-url-form")

for (const form of gatewayUrlForms) {
    const cidInput = form.querySelector(".gateway-url-cid-input");
    const filenameInput = form.querySelector(".gateway-url-filename-input");
    const copyButton = form.querySelector(".gateway-url-copy-button");
    const copyConfirmedMessage = form.querySelector(".gateway-url-confirmed-message");

    function updateUrlCopyValue() {
        if (filenameInput.value) {
            copyButton.setAttribute("value", `https://dweb.link/ipfs/${cidInput.value}/?filename=${encodeURIComponent(filenameInput.value)}`);
        } else {
            copyButton.setAttribute("value", `https://dweb.link/ipfs/${cidInput.value}`);
        }
    }

    cidInput.onchange = updateUrlCopyValue;
    filenameInput.onchange = updateUrlCopyValue;

    copyButton.addEventListener("clipboard-copy", function() {
        copyConfirmedMessage.removeAttribute("hidden");
        setTimeout(function() {
            copyConfirmedMessage.setAttribute("hidden", true);
        }, 1000);
    });
}
