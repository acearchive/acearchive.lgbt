import ISO6391 from "iso-639-1";

class LanguageName extends HTMLElement {
  connectedCallback() {
    const languageCode = this.getAttribute("code") ?? undefined;

    if (languageCode !== undefined) {
      const nativeLangName = ISO6391.getNativeName(languageCode);
      this.appendChild(document.createTextNode(nativeLangName));
    }
  }
}

customElements.define("lang-name", LanguageName);
