const shortUrlButton = document.getElementById("copy-short-url-button");

if (shortUrlButton) {
  const shortUrl = shortUrlButton.dataset.shortUrl;

  shortUrlButton.addEventListener("click", () => {
    navigator.clipboard.writeText(shortUrl)
  });
}
