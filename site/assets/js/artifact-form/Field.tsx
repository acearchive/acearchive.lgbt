import React from "react";
import Form from "react-bootstrap/Form";
import { HTMLInputTypeAttribute } from "react";
import { FormikProps, ErrorMessage, getIn } from "formik";
import className from "classnames";
import { ArtifactFormData } from "./storage";

export type InputType = HTMLInputTypeAttribute | "select";

export type SelectOption = Readonly<{
  key: string;
  label: string;
}>;

export type FieldProps<T extends InputType> = {
  name: string;
  label: string;
  inputType: T;
  required: boolean;
  placeholder?: string;
  options: T extends "select" ? ReadonlyArray<SelectOption> : undefined;
  handleChange: (e: React.ChangeEvent) => void;
  props: FormikProps<ArtifactFormData>;
  disabled?: boolean;
  children: React.ReactNode;
};

const FormLabel = ({ label, required }: { label: string; required: boolean }) => {
  if (required) {
    return (
      <>
        {label}
        <span className="required-label">*</span>
      </>
    );
  } else {
    return <>{label}</>;
  }
};

const Field = <T extends InputType>({
  name,
  label,
  inputType,
  required,
  placeholder,
  options,
  handleChange,
  props: { touched, errors, values, handleBlur },
  disabled,
  children,
}: FieldProps<T>) => {
  return (
    <div className={className("form-field")}>
      <Form.Label htmlFor={`field-input-${name}`}>
        <FormLabel label={label} required={required} />
      </Form.Label>
      {inputType === "checkbox" ? (
        <Form.Check
          name={name}
          disabled={disabled}
          checked={getIn(values, name) ?? false}
          id={`field-input-${name}`}
          aria-describedby={`field-help-${name} field-feedback-${name}`}
          onChange={handleChange}
          onBlur={handleBlur}
          isValid={getIn(touched, name) && !getIn(errors, name)}
          isInvalid={getIn(touched, name) && !!getIn(errors, name)}
        />
      ) : inputType === "select" ? (
        <Form.Control
          as="select"
          name={name}
          disabled={disabled}
          id={`field-input-${name}`}
          aria-describedby={`field-help-${name} field-feedback-${name}`}
          value={getIn(values, name) ?? ""}
          onChange={handleChange}
          onBlur={handleBlur}
          isValid={getIn(touched, name) && !getIn(errors, name)}
          isInvalid={getIn(touched, name) && !!getIn(errors, name)}
        >
          {!required && <option value=""></option>}
          {(options ?? []).map(({ key, label }) => (
            <option value={key} key={key}>
              {label}
            </option>
          ))}
        </Form.Control>
      ) : (
        <Form.Control
          type={inputType}
          name={name}
          disabled={disabled}
          value={getIn(values, name) ?? ""}
          id={`field-input-${name}`}
          aria-describedby={`field-help-${name} field-feedback-${name}`}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          isValid={getIn(touched, name) && !getIn(errors, name)}
          isInvalid={getIn(touched, name) && !!getIn(errors, name)}
        />
      )}
      <ErrorMessage name={name}>
        {(msg) => (
          <Form.Control.Feedback id={`field-feedback-${name}`} type="invalid">
            {msg}
          </Form.Control.Feedback>
        )}
      </ErrorMessage>
      {children && (
        <Form.Text id={`field-help-${name}`} className={className("field-help")}>
          {children}
        </Form.Text>
      )}
    </div>
  );
};

export default Field;
