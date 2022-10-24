import * as Yup from "yup";

const noWhitespacePattern = /^[^\s]*$/;

// This schema should be kept in sync with the Joi schema in the
// `acearchive/artifact-submit-action` repo.
//
// In the future, we may want to consider using the same schema in both places.
// One important consideration is that this schema contains redundant rules
// which serve to provide more friendly error messages than the one in
// `artifact-submit-action`.
export const schema = Yup.object({
  slug: Yup.string()
    .label("URL Slug")
    .required()
    .trim()
    .matches(noWhitespacePattern, ({ label }) => `${label} must not contain spaces`)
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
  title: Yup.string().label("Title").required().trim().max(100),
  summary: Yup.string().label("Summary").required().trim().max(150),
  description: Yup.string().label("Description").trim().max(1000),
  files: Yup.array().of(
    Yup.object({
      name: Yup.string().label("Label").required().trim().max(256),
      fileName: Yup.string()
        .label("File Name")
        .required()
        .trim()
        .matches(noWhitespacePattern, ({ label }) => `${label} must not contain spaces`)
        .matches(
          /^[a-z0-9.\/-]*$/,
          ({ label }) =>
            `${label} can only contain lowercase letters, numbers, hyphens, and slashes`
        )
        .matches(/^[^\/]/, ({ label }) => `${label} can not start with a slash`)
        .matches(/[^\/]$/, ({ label }) => `${label} can not end with a slash`)
        .matches(
          /^[a-z0-9][a-z0-9-]*[a-z0-9](\/[a-z0-9][a-z0-9-]*[a-z0-9])*(\.[a-z0-9]+)*$/,
          "This is not a valid file name"
        ),
      sourceUrl: Yup.string().label("File URL").required().trim().url(),
      hidden: Yup.bool().label("Hidden"),
    })
  ),
});

export type Artifact = Yup.InferType<typeof schema>;
