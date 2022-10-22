import React from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Field from "./Field";

import { schema } from "./schema";

const initialValues = {
  slug: "",
  title: "",
  summary: "",
  description: "",
};

const ArtifactSubmitForm = () => (
  <Formik
    initialValues={initialValues}
    validationSchema={schema}
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400);
    }}
  >
    {({ isSubmitting }) => (
      <Form>
        <Field
          name="slug"
          label="URL Slug"
          inputType="text"
          placeholder="orlando-the-asexual-manifesto"
        >
          <p>Every artifact in the repository has a URL like:</p>
          <p>
            <a href="https://acearchive.lgbt/artifact/orlando-the-asexual-manifesto">
              https://acearchive.lgbt/artifact/orlando-the-asexual-manifesto
            </a>
          </p>
          <p>
            When you add a new artifact, you need to choose a URL slug for it, which is that last
            part of the path.
          </p>
          <p>
            A URL slug should always be lowercase and use hyphens to separate words, and it will
            generally follow the format <code>author-title</code>. If the author has a first and
            last name (i.e. isn't a handle or username), you can just use the last name. If the
            title of the work is long, you can use a shortened version of it. If there is no obvious
            author associated with the work, you can just use the title.
          </p>
          <p>
            If the combination of the author and the title of the work is ambiguous, (such as a
            forum thread where the title of the thread might just be "asexuality"), then you can
            provide additional context like <code>context-author-title</code>. For an AVEN forum
            thread by "coolasexualperson" called "romance", the URL slug might be{" "}
            <code>aven-forums-coolasexualperson-romance</code>.
          </p>
        </Field>

        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </Form>
    )}
  </Formik>
);

export default ArtifactSubmitForm;
