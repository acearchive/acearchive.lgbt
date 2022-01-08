import * as params from "@params";

const new_pr_button = document.getElementById("new-pr-button");
const new_pr_slug_input = document.getElementById("new-pr-slug-input");

new_pr_slug_input.onchange = function() {
    new_pr_button.href = "https://github.com/acearchive/acearchive.lgbt/new/main/?filename=content/archive/" + new_pr_slug_input.value + "/index.md&value=" + encodeURIComponent(params.artifact_template);
};
