const tooltipTriggerList: Array<Element> = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);

for (const element of tooltipTriggerList) {
  new bootstrap.Tooltip(element);
}
