import { schema } from "@params";
import { createFormFieldOrFieldList } from "./field-list";
import { getQueryParams } from "./util";
import { fillInputsFromArtifact } from "./modify-artifact";
import { createSubmitButton } from "./submit";

const artifactForm = document.querySelector(".new-artifact main form");

if (artifactForm) {
  for (const fieldName of schema.fields) {
    const field = schema.definitions[fieldName];
    if (!field.includeInForm) continue;
    artifactForm.appendChild(createFormFieldOrFieldList(field));
  }

  artifactForm.appendChild(createSubmitButton(artifactForm));

  const baseArtifactSlug = getQueryParams().modify;
  if (baseArtifactSlug) {
    fillInputsFromArtifact(artifactForm, baseArtifactSlug);
  }
}
