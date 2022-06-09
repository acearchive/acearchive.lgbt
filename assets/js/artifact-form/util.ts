import showdown from "showdown";
import { customElement } from "lit/decorators.js";
import { html, LitElement } from "lit";
import { FieldDefinition, FieldName } from "./schema";
import { Directive, directive, DirectiveParameters, ElementPart } from "lit/directive.js";

export const fieldNameToId = (fieldName: string, listItemIndex: number): string =>
  `${fieldName.replace(".", "-")}-${listItemIndex}`;

@customElement("required-label")
export class RequiredLabel extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<span class="required-label">*</span>`;
  }
}

export const mdConverter = new showdown.Converter();

export const isArrayOfObjects = (field: FieldDefinition): boolean =>
  field.type === "array" && field.itemType === "object";

export const getQueryParams = () => {
  return new URLSearchParams(window.location.search);
};

export const fieldNameForInputElement = (inputElement: HTMLInputElement): FieldName => {
  return inputElement.closest(".form-field").getAttribute("data-field-name");
};

class AttrMap extends Directive {
  render(attrs: Array<[string, string]>) {}
  update(part: ElementPart, [attrs]: DirectiveParameters<this>) {
    if (attrs === undefined) return;

    for (const attr of attrs) {
      part.element.setAttribute(attr[0], attr[1]);
    }
  }
}

export const attrMap = directive(AttrMap);
