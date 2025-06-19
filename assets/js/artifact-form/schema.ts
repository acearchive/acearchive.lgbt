import * as Yup from "yup";
import ISO6391 from "iso-639-1";

const noWhitespacePattern = /^[^\s]*$/;
const doesNotStartWithCommaPattern = /^(?!,)/;
const doesNotEndWithCommaPattern = /(?<!,)$/;

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
  description: Yup.string()
    .label("Description")
    .trim()
    .max(1000)
    .when("summary", {
      is: undefined,
      then: (schema) => schema,
      otherwise: (schema) =>
        schema.notOneOf(
          [Yup.ref("summary")],
          "This is exactly the same as the Summary. You can leave this blank instead and the Summary will be used in both places automatically."
        ),
    }),
  files: Yup.array().of(
    Yup.object({
      name: Yup.string().label("Label").required().trim().max(250),
      fileName: Yup.string()
        .label("File Name")
        .required()
        .trim()
        .matches(noWhitespacePattern, ({ label }) => `${label} must not contain spaces`)
        .matches(
          /^[a-z0-9./-]*$/,
          ({ label }) =>
            `${label} can only contain lowercase letters, numbers, hyphens, and slashes`
        )
        .matches(/^[a-z0-9./-]*\.[a-z0-9]+$/, ({ label }) => `${label} must have a file extension`)
        .matches(/^(?!\/)/, ({ label }) => `${label} can not start with a slash`)
        .matches(/(?<!\/)$/, ({ label }) => `${label} can not end with a slash`)
        .matches(
          /^[a-z0-9][a-z0-9-]*[a-z0-9](\/[a-z0-9][a-z0-9-]*[a-z0-9])*(\.[a-z0-9]+)*$/,
          "This is not a valid file name"
        ),
      sourceUrl: Yup.string().label("File URL").required().trim().url(),
      lang: Yup.string().label("Language").trim().oneOf(ISO6391.getAllCodes()),
      hidden: Yup.bool().label("Hidden").default(false),
    })
  ),
  links: Yup.array().of(
    Yup.object({
      name: Yup.string().label("Label").required().trim().max(250),
      url: Yup.string().label("URL").required().trim().url(),
    })
  ),
  people: Yup.string()
    .label("People")
    .trim()
    .matches(doesNotStartWithCommaPattern, ({ label }) => `${label} can not start with a comma`)
    .matches(doesNotEndWithCommaPattern, ({ label }) => `${label} can not end with a comma`),
  identities: Yup.string()
    .label("Identities")
    .trim()
    .matches(doesNotStartWithCommaPattern, ({ label }) => `${label} can not start with a comma`)
    .matches(doesNotEndWithCommaPattern, ({ label }) => `${label} can not end with a comma`),
  fromYear: Yup.number().label("Start Year").required().integer().max(new Date().getUTCFullYear()),
  toYear: Yup.number()
    .label("End Year")
    .integer()
    .test("is-fromYear-defined", "You must enter the Start Year first", async function () {
      return this.parent["fromYear"] !== undefined;
    })
    .moreThan(Yup.ref("fromYear"))
    .max(new Date().getUTCFullYear()),
  decades: Yup.string()
    .label("Decades")
    .required()
    .trim()
    .matches(doesNotStartWithCommaPattern, ({ label }) => `${label} can not start with a comma`)
    .matches(doesNotEndWithCommaPattern, ({ label }) => `${label} can not end with a comma`)
    .matches(
      /^\s*[0-9]{1,3}0\s*(,\s*[0-9]{1,3}0\s*)*$/,
      ({ label }) => `${label} must be a comma-separated list of decades`
    )
    .test(
      "list-of-numbers-is-sorted",
      ({ label }) =>
        `${label} can not contain duplicates and must be sorted in chronological order`,
      async (commaSeparated) =>
        commaSeparated !== undefined &&
        commaSeparated
          .split(",")
          .map((listItem) => parseInt(listItem.trim(), 10))
          .every((decade, index, list) => index === 0 || list[index - 1] < decade)
    ),
});

export type ArtifactSchema = Yup.InferType<typeof schema>;
