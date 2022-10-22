import * as Yup from "yup";

const urlSlugPattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

export const isRequired = (name: string): boolean =>
  schema.fields[name]?.exclusiveTests?.required ?? false;

export const schema = Yup.object({
  slug: Yup.string().required().trim().matches(urlSlugPattern).min(12).max(64),
  title: Yup.string().required().trim().max(100),
  summary: Yup.string().required().trim().max(150),
  description: Yup.string().trim().max(1000),
});
