import * as Yup from "yup";

export const isRequired = (name: string): boolean =>
  schema.fields[name]?.exclusiveTests?.required ?? false;

export const schema = Yup.object({
  slug: Yup.string()
    .label("The URL slug")
    .required()
    .trim()
    .matches(/^[^\s]*$/, ({ label }) => `${label} must not contain spaces`)
    .matches(
      /^[a-z0-9-]*$/,
      ({ label }) => `${label} can only contain lowercase letters, numbers, and hyphens`
    )
    .min(12)
    .max(64)
    .matches(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      ({ label }) => `${label} can only use hyphens between words`
    ),
  title: Yup.string().label("The title").required().trim().max(100),
  summary: Yup.string().label("The summary").required().trim().max(150),
  description: Yup.string().label("The description").trim().max(1000),
});

export type Artifact = Yup.InferType<typeof schema>;
