import * as params from "@params";

const openPrForms = document.querySelectorAll(".open-pr-form");

for (form of openPrForms) {
    const openPrInput = form.querySelector(".open-pr-input");
    const openPrButton = form.querySelector(".open-pr-button");

    openPrInput.onchange = function() {
        openPrButton.href = `https://github.com/acearchive/acearchive.lgbt/new/main/?filename=content/archive/${openPrInput.value}/index.md&value=${encodeURIComponent(params.artifact_template)}`
    };
}
