import React from "react";
import { Button } from "react-bootstrap";
import className from "classnames";

export type FormButtonType = "submit" | "reset";

export default ({
  kind,
  label,
  isDisabled,
  onClick,
}: {
  kind: FormButtonType;
  label: string;
  isDisabled: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const htmlId = kind === "submit" ? "artifact-form-submit-button" : "artifact-form-reset-button";

  return (
    <div className={className("submit-control", "d-flex", "flex-column", "align-items-center")}>
      <Button
        id={htmlId}
        variant={kind === "submit" ? "primary" : "secondary"}
        type={kind}
        disabled={isDisabled}
        onClick={onClick}
      >
        {kind === "submit" ? "Submit" : "Reset"}
      </Button>
      <label className={className("form-text", "text-center", "d-block")} htmlFor={htmlId}>
        {label}
      </label>
    </div>
  );
};
