const cidInput = document.getElementById("gateway-url-cid-input");
const filenameInput = document.getElementById("gateway-url-filename-input");
const copyButton = document.getElementById("gateway-url-copy-button");
const copyConfirmedMessage = document.getElementById("gateway-url-confirmed-message");

function updateUrlCopyValue() {
    if (copyButton) {
        if (filenameInput.value) {
            copyButton.setAttribute("value", `https://dweb.link/ipfs/${cidInput.value}/?filename=${encodeURIComponent(filenameInput.value)}`);
        } else {
            copyButton.setAttribute("value", `https://dweb.link/ipfs/${cidInput.value}`);
        }
    }
}

if (cidInput && filenameInput) {
    cidInput.onchange = updateUrlCopyValue;
    filenameInput.onchange = updateUrlCopyValue;
}

document.addEventListener('clipboard-copy', function(event) {
    const button = event.target;
    if (button.id === copyButton.id) {
        copyConfirmedMessage.removeAttribute("hidden");
        setTimeout(function() {
            copyConfirmedMessage.setAttribute("hidden", true);
        }, 1000)
    }
})
