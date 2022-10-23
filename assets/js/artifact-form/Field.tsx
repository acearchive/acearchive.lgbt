import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { HTMLInputTypeAttribute } from "react";
import { FormikProps, ErrorMessage } from "formik";
import { Artifact, isRequired } from "./schema";

type Props = {
  name: string;
  label: string;
  inputType: HTMLInputTypeAttribute;
  placeholder?: string;
  props: FormikProps<Artifact>;
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

const ArtifactFormField: React.FC<Props> = ({
  name,
  label,
  inputType,
  placeholder,
  props: { touched, errors, values, handleChange, handleBlur },
  children,
}) => {
  return (
    <>
      <Form.Label htmlFor={`field-input-${name}`}>
        <FormLabel name={name} label={label} />
      </Form.Label>
      <Form.Control
        type={inputType}
        name={name}
        value={values[name]}
        id={`field-input-${name}`}
        aria-describedby={`field-help-${name} field-feedback-${name}`}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        isValid={touched[name] && !errors[name]}
        isInvalid={touched[name] && !!errors[name]}
      />
      <ErrorMessage name={name}>
        {(msg) => (
          <Form.Control.Feedback id={`field-feedback-${name}`} type="invalid">
            {msg}
          </Form.Control.Feedback>
        )}
      </ErrorMessage>
      <Form.Text id={`field-help-${name}`}>{children}</Form.Text>
    </>
  );
};

export default ArtifactFormField;
