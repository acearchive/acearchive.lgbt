import React from "react";
import { getIn, FieldArray, FormikProps } from "formik";
import className from "classnames";
import { PlusSquare, TrashIcon } from "./icons";
import { Card } from "react-bootstrap";
import { htmlFormId } from "./Form";
import Field, { InputType } from "./Field";
import { ArtifactFormData } from "./storage";

type FieldListItemProps = {
  index: number;
  handleDelete: () => void;
  children: React.ReactNode;
};

const FieldListItem = ({ index, handleDelete, children }: FieldListItemProps) => {
  return (
    <fieldset form={htmlFormId} className={className("field-list-item")}>
      <legend className={className("visually-hidden")}>#{index + 1}</legend>
      <span className={className("d-none", "d-sm-flex", "list-item-gutter", "flex-column")}>
        <span className={className("list-item-index")} aria-hidden="true">
          #{index + 1}
        </span>
        <button
          type="button"
          className={className("form-button", "delete-button", "btn")}
          aria-label="Delete"
          onClick={handleDelete}
        >
          <span aria-hidden="true">
            <TrashIcon />
          </span>
        </button>
      </span>
      <Card className={className("w-100")}>
        <Card.Body>
          <span
            className={className(
              "d-flex",
              "d-sm-none",
              "list-item-gutter",
              "justify-content-between"
            )}
          >
            <span className={className("list-item-index")} aria-hidden="true">
              #{index + 1}
            </span>
            <button
              type="button"
              className={className("form-button", "delete-button", "btn")}
              aria-label="Delete"
              onClick={handleDelete}
            >
              <span aria-hidden="true">
                <TrashIcon />
              </span>
            </button>
          </span>
          <div className={className("list-item-body")}>{children}</div>
        </Card.Body>
      </Card>
    </fieldset>
  );
};

export interface FieldListItemSpec<T extends InputType> {
  name: string;
  label: string;
  inputType: InputType;
  required: boolean;
  placeholder?: string;
  options: T extends "select" ? ReadonlyArray<SelectOption> : undefined;
  helpText: React.ReactNode;
}

export type FieldListProps = {
  name: string;
  label: string;
  singularLabel: string;
  handleChange: (e: React.ChangeEvent) => void;
  props: FormikProps<ArtifactFormData>;
  initialValues: Record<string, any>;
  fields: ReadonlyArray<FieldListItemSpec<InputType>>;
  children: React.ReactNode;
};

export const FieldList = ({
  name,
  label,
  singularLabel,
  handleChange,
  props,
  initialValues,
  fields,
  children,
}: FieldListProps) => {
  return (
    <FieldArray name={name}>
      {({ remove, push, form: { values } }) => (
        <fieldset form={htmlFormId} className={className("field-list")}>
          <legend className={className("form-label")}>{label}</legend>
          <div className={className("field-help", "form-text")}>{children}</div>
          <div id={`field-list-body-${name}`} className={className("field-list-body")}>
            {(getIn(values, name)?.length ?? 0) > 0 &&
              getIn(values, name).map((_: any, index: number) => (
                <FieldListItem index={index} handleDelete={() => remove(index)} key={index}>
                  {fields.map((fieldSpec) => (
                    <Field
                      name={`${name}.${index}.${fieldSpec.name}`}
                      label={fieldSpec.label}
                      inputType={fieldSpec.inputType}
                      required={fieldSpec.required}
                      placeholder={fieldSpec.placeholder}
                      options={fieldSpec.options}
                      handleChange={handleChange}
                      props={props}
                      key={fieldSpec.name}
                    >
                      {index === 0 && fieldSpec.helpText}
                    </Field>
                  ))}
                </FieldListItem>
              ))}
          </div>
          <button
            className={className(
              "btn",
              "add-button",
              "icon-button",
              "form-button",
              "d-flex",
              "align-items-center"
            )}
            type="button"
            onClick={() => push(initialValues)}
          >
            <span className={className("me-2", "d-flex")} aria-hidden="true">
              <PlusSquare />
            </span>
            <span>Add {singularLabel}</span>
          </button>
        </fieldset>
      )}
    </FieldArray>
  );
};
