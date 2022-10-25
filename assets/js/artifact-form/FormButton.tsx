import React from "react";
import { Button } from "react-bootstrap";
import className from "classnames";

export type FormButtonType = "submit" | "button" | "reset";
export type FormButtonVariant = "primary" | "secondary";

export default ({
  kind,
  id,
  label,
  description,
  variant,
  isDisabled,
  errorMessage,
  onClick,
}: {
  kind: FormButtonType;
  id: string;
  label: string;
  description: string;
  variant: FormButtonVariant;
  isDisabled: boolean;
  errorMessage?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className={className("submit-control", "d-flex", "flex-column", "align-items-center")}>
      <Button
        id={id}
        variant={variant}
        type={kind}
        disabled={isDisabled}
        onClick={onClick}
        aria-describedby={`${id}-help`}
      >
        {label}
      </Button>
      <label className={className("form-text", "text-center", "d-block")} htmlFor={id}>
        {description}
      </label>
      <div
        id={`${id}-help`}
        className={className("text-danger", "form-text", "text-center", "mt-1")}
      >
        {errorMessage}
      </div>
    </div>
  );
};
