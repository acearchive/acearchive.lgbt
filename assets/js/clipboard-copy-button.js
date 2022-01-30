import { Tooltip } from "bootstrap";

const copyButtons = document.querySelectorAll("clipboard-copy.clipboard-copy-button") ?? [];

for (const copyButton of copyButtons) {
    const tooltip = new Tooltip(copyButton);

    copyButton.addEventListener("clipboard-copy", function() {
        const copyIcon = copyButton.querySelector(".clipboard-copy-icon");
        const confirmedIcon = copyButton.querySelector(".copy-confirmed-icon");

        copyIcon.setAttribute("hidden", true);
        confirmedIcon.removeAttribute("hidden");
        copyButton.setAttribute("data-bs-original-title", "Copied!");
        tooltip.show();

        setTimeout(function() {
            copyIcon.removeAttribute("hidden");
            confirmedIcon.setAttribute("hidden", true);
            copyButton.setAttribute("data-bs-original-title", "Copy");
            tooltip.hide();
        }, 1000);
    });
}
