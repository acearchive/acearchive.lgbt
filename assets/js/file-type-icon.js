import { iconSpritePath } from "@params";
import mime from "mime";

const getIcon = (name) => `
  <svg width="20" height="20" fill="currentColor">
    <use xlink:href="${iconSpritePath}#${name}" />
  </svg>
`;

const richTextIcon = getIcon("file-earmark-richtext");
const textIcon = getIcon("file-earmark-text");
const imageIcon = getIcon("file-earmark-image");
const videoIcon = getIcon("file-earmark-play");
const audioIcon = getIcon("file-earmark-music");
const pdfIcon = getIcon("file-earmark-pdf");
const referenceIcon = getIcon("bookmark");
const archiveIcon = getIcon("file-earmark-zip");
const fileIcon = getIcon("file-earmark");

mime.define({
  "application/x-bibtex": ["bib"],
});

class FileTypeIcon extends HTMLElement {
  connectedCallback() {
    const filename = this.getAttribute("filename") || "";
    const mediaTypeFromFileName = mime.getType(filename) ?? undefined;
    const mediaTypeFromMetadata = this.getAttribute("media-type") ?? undefined;

    // Some plain-text formats may be served as `Content-Type: text/plain`,
    // when their file extension provides more specific information. This is
    // typically the case with BibTex files given the lack of standardized IANA
    // media type.
    const preferFileExtToMediaType =
      mediaTypeFromMetadata === "text/plain" &&
      mediaTypeFromFileName !== undefined &&
      mediaTypeFromFileName !== "text/plain";

    const mediaType = preferFileExtToMediaType
      ? mediaTypeFromFileName
      : mediaTypeFromMetadata ?? mediaTypeFromFileName ?? "application/octet-stream";

    const extensionFromFileName = filename.split(".").pop();
    const extensionFromMediaType = mime.getExtension(mediaType);

    const extension =
      mediaType === "application/octet-stream"
        ? extensionFromFileName
        : extensionFromMediaType ?? extensionFromFileName;

    let icon;
    let title;

    if (mediaType === "application/pdf") {
      icon = pdfIcon;
      title = "PDF document";
    } else if (
      mediaType === "application/x-bibtex" ||
      mediaType === "application/x-research-info-systems" ||
      mediaType === "application/rdf+xml"
    ) {
      icon = referenceIcon;
      title = "Citation file";
    } else if (mediaType === "application/zip" || mediaType === "application/x-tar") {
      icon = archiveIcon;
      title = "Archive file";
    } else if (mediaType === "text/html") {
      icon = richTextIcon;
      title = "Web page";
    } else if (mediaType.startsWith("text/")) {
      icon = textIcon;
      title = "Text file";
    } else if (mediaType.startsWith("image/")) {
      icon = imageIcon;
      title = "Image file";
    } else if (mediaType.startsWith("video/")) {
      icon = videoIcon;
      title = "Video file";
    } else if (mediaType.startsWith("audio/")) {
      icon = audioIcon;
      title = "Audio file";
    } else {
      icon = fileIcon;
      title = "File";
    }

    const iconElement = document.createElement("span");
    iconElement.setAttribute("aria-hidden", true);
    iconElement.innerHTML = icon;
    iconElement.classList.add("type-icon");

    const extensionElement = document.createElement("span");
    extensionElement.setAttribute("aria-hidden", true);
    extensionElement.innerHTML = `.${extension}`;
    extensionElement.classList.add("extension-pill");

    const labelElement = document.createElement("span");
    labelElement.classList.add("visually-hidden");
    if (mediaType === "application/octet-stream") {
      labelElement.innerHTML = title;
    } else {
      labelElement.innerHTML = `${title} (.${extension})`;
    }

    this.appendChild(iconElement);
    this.appendChild(extensionElement);
    this.appendChild(labelElement);
  }
}

customElements.define("file-type-icon", FileTypeIcon);
