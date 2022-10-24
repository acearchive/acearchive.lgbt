import React from "react";
import Form from "react-bootstrap/Form";
import { HTMLInputTypeAttribute } from "react";
import { FormikProps, ErrorMessage, getIn } from "formik";
import { Artifact } from "./schema";
import className from "classnames";

export type FieldProps = {
  name: string;
  label: string;
  inputType: HTMLInputTypeAttribute;
  required: boolean;
  placeholder?: string;
  props: FormikProps<Artifact>;
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
    return label;
  }
};

const Field: React.FC<FieldProps> = ({
  name,
  label,
  inputType,
  required,
  placeholder,
  props: { touched, errors, values, handleChange, handleBlur },
  children,
}) => {
  return (
    <div className={className("form-field")}>
      <Form.Label htmlFor={`field-input-${name}`}>
        <FormLabel label={label} required={required} />
      </Form.Label>
      {inputType === "checkbox" ? (
        <Form.Check
          name={name}
          value={getIn(values, name)}
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
          value={getIn(values, name)}
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
