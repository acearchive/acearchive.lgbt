import React from "react";
import Form from "react-bootstrap/Form";
import { HTMLInputTypeAttribute } from "react";
import { FormikProps, ErrorMessage, getIn } from "formik";
import className from "classnames";
import { ArtifactFormData } from "./storage";

export type FieldProps = {
  name: string;
  label: string;
  inputType: HTMLInputTypeAttribute;
  required: boolean;
  placeholder?: string;
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

const Field = ({
  name,
  label,
  inputType,
  required,
  placeholder,
  handleChange,
  props: { touched, errors, values, handleBlur },
  disabled,
  children,
}: FieldProps) => {
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
      <Form.Text id={`field-help-${name}`} className={className("field-help")}>
        {children}
      </Form.Text>
    </div>
  );
};

export default Field;
