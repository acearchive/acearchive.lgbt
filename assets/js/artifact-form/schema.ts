import { schema } from "@params";

export type FieldType = "string" | "integer" | "array";

export type ItemType = "string" | "integer" | "object";

export type CustomValidator = string;

export type HtmlValidationAttribute =
  | "pattern"
  | "min"
  | "max"
  | "required"
  | "step"
  | "minlength"
  | "maxlength"
  | "type";

export interface HtmlFormValidation {
  attribute: HtmlValidationAttribute;
  value: string;
  message: string;
  toAttribute(): string;
}

interface FieldContainer {
  fields: string[];
  definitions: Record<string, FieldDefinition>;
}

export interface LeafFieldDefinition<T extends FieldType = FieldType> {
  fieldName: FieldName;
  label: string;
  type: T;
  itemType: T extends "array" ? ItemType : undefined;
  required: boolean;
  includeInForm: boolean;
  includeInDocs: boolean;
  placeholder: string;
  htmlFormValidation?: HtmlFormValidation[];
  customValidator?: CustomValidator;
  description: string;
}

export type ParentFieldDefinition<T extends FieldType = FieldType> = LeafFieldDefinition<T> &
  FieldContainer;

export type FieldDefinition<T extends FieldType = FieldType> =
  | ParentFieldDefinition<T>
  | LeafFieldDefinition<T>;

export interface Schema extends FieldContainer {
  version: number;
}

export const isParentDefinition = (
  definition: FieldDefinition
): definition is ParentFieldDefinition => "fields" in definition && "definitions" in definition;

export type FieldName = string;

export const definitionFromPath = (path: FieldName): FieldDefinition => {
  let currentContainer: FieldContainer = schema;

  for (const fieldName of path.split(".")) {
    const currentDefinition = currentContainer.definitions[fieldName];
    if (!isParentDefinition(currentDefinition)) return currentDefinition;
    currentContainer = currentDefinition;
  }

  throw new Error(`could not find definition in schema with path: '${path}'`);
};
