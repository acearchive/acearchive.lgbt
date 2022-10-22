import React from "react";
import Form from "react-bootstrap/Form";
import { HTMLInputTypeAttribute } from "react";
import { ErrorMessage, Field as FormikField } from "formik";
import { isRequired } from "./schema";

type Props = {
  name: string;
  label: string;
  inputType: HTMLInputTypeAttribute;
  placeholder?: string;
};

const FormLabel = ({ name, label }: { name: string; label: string }) => {
  if (isRequired(name)) {
    return (
      <>
        {label}
        <span className="required-label">*</span>
      </>
    );
  } else {
    return label;
  }
};

const ArtifactFormField: React.FC<Props> = ({ name, label, inputType, placeholder, children }) => (
  <>
    <Form.Label htmlFor={`field-input-${name}`}>
      <FormLabel name={name} label={label} />
    </Form.Label>
    <FormikField
      type={inputType}
      name={name}
      id={`field-input-${name}`}
      aria-describedby={`field-help-${name} field-feedback-${name}`}
      placeholder={placeholder}
      className="form-control"
    />
    <ErrorMessage name="title">
      {(msg) => (
        <Form.Control.Feedback id={`field-feedback-${name}`} type="invalid">
          {msg}
        </Form.Control.Feedback>
      )}
    </ErrorMessage>
    <Form.Text id={`field-help-${name}`}>{children}</Form.Text>
  </>
);

export default ArtifactFormField;
