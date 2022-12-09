const copyButtons = document.querySelectorAll("clipboard-copy.clipboard-copy-button");

for (const copyButton of copyButtons) {
  const tooltip = new bootstrap.Tooltip(copyButton);

  copyButton.addEventListener("clipboard-copy", () => {
    const copyIcon = copyButton.querySelector(".clipboard-copy-icon");
    const confirmedIcon = copyButton.querySelector(".copy-confirmed-icon");

    if (copyIcon === null || confirmedIcon === null) return;

    copyIcon.setAttribute("hidden", "true");
    confirmedIcon.removeAttribute("hidden");
    copyButton.setAttribute("data-bs-original-title", "Copied!");
    tooltip.show();

    setTimeout(() => {
      copyIcon.removeAttribute("hidden");
      confirmedIcon.setAttribute("hidden", "true");
      copyButton.setAttribute("data-bs-original-title", "Copy");
      tooltip.hide();
    }, 1000);
  });
}
