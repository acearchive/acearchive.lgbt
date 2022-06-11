import { attrMap, fieldNameToId, mdConverter } from "./util";
import { definitionFromPath, FieldDefinition, FieldName, HtmlValidationAttribute } from "./schema";
import { html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

const htmlInputTypeForField = (field: FieldDefinition): HTMLInputElement["type"] => {
  const inputTypeBySchemaType = {
    integer: "number",
    string: "text",
    array: "text",
  };

  return inputTypeBySchemaType[field.type];
};

const customErrorMessageForFieldByAttribute = (() => {
  const errorMessages = new Map<
    FieldDefinition["fieldName"],
    Map<HtmlValidationAttribute, string>
  >();

  return (field: FieldDefinition, attributeName: HtmlValidationAttribute): string => {
    if (!errorMessages.has[field.fieldName]) {
      const errorMessagesByAttribute = new Map<HtmlValidationAttribute, string>();

      for (const validationRule of field.htmlFormValidation) {
        errorMessagesByAttribute[validationRule.attribute] = validationRule.message;
      }

      errorMessages[field.fieldName] = errorMessagesByAttribute;
    }

    return errorMessages[field.fieldName][attributeName] ?? "";
  };
})();

const validationMessageBySchema = (
  field: FieldDefinition,
  inputElement: HTMLInputElement
): string => {
  if (inputElement.validity.valueMissing) {
    return "Please fill out this field.";
  } else if (inputElement.validity.typeMismatch) {
    return customErrorMessageForFieldByAttribute(field, "type");
  } else if (inputElement.validity.rangeUnderflow) {
    return customErrorMessageForFieldByAttribute(field, "min");
  } else if (inputElement.validity.rangeOverflow) {
    return customErrorMessageForFieldByAttribute(field, "max");
  } else if (inputElement.validity.stepMismatch) {
    return customErrorMessageForFieldByAttribute(field, "step");
  } else if (inputElement.validity.tooShort) {
    return customErrorMessageForFieldByAttribute(field, "minlength");
  } else if (inputElement.validity.tooLong) {
    return customErrorMessageForFieldByAttribute(field, "maxlength");
  } else if (inputElement.validity.patternMismatch) {
    return customErrorMessageForFieldByAttribute(field, "pattern");
  }
};

@customElement("form-field")
export class FormField extends LitElement {
  @property({ type: String, attribute: "field-name" })
  fieldName: FieldName;

  @property({ type: Number, attribute: "list-item-index" })
  listItemIndex: number = 0;

  @property({ type: Boolean, reflect: true, attribute: "was-validated" })
  wasValidated: boolean = false;

  @property({ type: String, reflect: true, attribute: "value" })
  value: string = "";

  @property({ type: Boolean, attribute: "disabled" })
  disabled: boolean = false;

  @state()
  private validationMessage: string = "";

  @query("input")
  private inputElement: HTMLInputElement;

  private field: FieldDefinition;
  private fieldId: string;
  private showHelp: boolean;
  private showValidityMessage: boolean;

  createRenderRoot() {
    return this;
  }

  willUpdate(changedProperties) {
    this.field = definitionFromPath(this.fieldName);
    this.fieldId = fieldNameToId(this.fieldName, this.listItemIndex);
    this.showHelp = this.listItemIndex === 0;
    this.inputElement?.setCustomValidity(this.validationMessage);
    // Don't show the validity of the input if it is empty and not required.
    this.showValidityMessage =
      this.wasValidated &&
      (!this.inputElement.validity.valid || this.inputElement.value.length > 0);
  }

  render() {
    console.log(this.inputElement);
    return html`
      <div
        id="field-input-${this.fieldId}"
        class=${classMap({ "was-validated": this.showValidityMessage })}
      >
        <label for="field-input-${this.fieldId}" class="form-label">
          ${this.field.label} ${this.requiredLabelElement()}
        </label>
        <input
          type=${htmlInputTypeForField(this.field)}
          class="form-control"
          id="field-input-${this.fieldId}"
          aria-describedby="field-help-${this.fieldId} invalid-feedback-${this.fieldId}"
          placeholder=${this.field.placeholder}
          ?required=${this.field.required}
          ?disabled=${this.disabled}
          .value=${this.value}
          ${attrMap(this.field?.htmlFormValidation?.map((rule) => [rule.attribute, rule.value]))}
          @input=${this.onInput}
          @invalid=${this.onInvalid}
        />
        <div id="invalid-feedback-${this.fieldId}" class="invalid-feedback">
          ${this.validationMessage}
        </div>
        ${this.showHelp ? this.fieldHelpElement() : null}
      </div>
    `;
  }

  private fieldHelpElement() {
    return html`
      <div id="field-help-${this.fieldId}" class="field-help form-text">
        ${unsafeHTML(mdConverter.makeHtml(this.field.description))}
      </div>
    `;
  }

  private requiredLabelElement() {
    return this.field.required ? html`<required-label />` : null;
  }

  private onInput() {
    this.wasValidated = false;
    this.validationMessage = "";
    this.dispatchEvent(new Event("needs-validation"));
    this.value = this.inputElement.value;
  }

  private onInvalid() {
    this.validationMessage = validationMessageBySchema(this.field, this.inputElement);
  }
}
