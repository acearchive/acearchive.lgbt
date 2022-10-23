import React, { useEffect, useCallback } from "react";
import { Formik } from "formik";
import { Form, Container, Row, Col } from "react-bootstrap";
import Field from "./Field";

import { schema } from "./schema";
import FormButton from "./FormButton";
import { initialValues, useSavedFormValues } from "./storage";

const ArtifactSubmitForm = () => {
  const [savedValues, setSavedValues] = useSavedFormValues();

  return (
    <Formik
      initialValues={savedValues}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
      validateOnChange={true}
    >
      {(props) => {
        const { handleSubmit, isSubmitting, handleReset: handleResetWithoutPersistence } = props;

        useEffect(() => {
          setSavedValues(props.values);
        }, [props.values, setSavedValues]);

        const handleReset = useCallback(() => {
          setSavedValues(initialValues);
          handleResetWithoutPersistence();
        }, [setSavedValues]);

        return (
          <Form onSubmit={handleSubmit}>
            <Field
              name="slug"
              label="URL Slug"
              inputType="text"
              placeholder="orlando-the-asexual-manifesto"
              props={props}
            >
              <p>Every artifact in the repository has a URL like:</p>
              <p>
                <a href="https://acearchive.lgbt/artifact/orlando-the-asexual-manifesto">
                  https://acearchive.lgbt/artifact/orlando-the-asexual-manifesto
                </a>
              </p>
              <p>
                When you add a new artifact, you need to choose a URL slug for it, which is that
                last part of the path.
              </p>
              <p>
                A URL slug should always be lowercase and use hyphens to separate words, and it will
                generally follow the format <code>author-title</code>. If the author has a first and
                last name (i.e. isn't a handle or username), you can just use the last name. If the
                title of the work is long, you can use a shortened version of it. If there is no
                obvious author associated with the work, you can just use the title.
              </p>
              <p>
                If the combination of the author and the title of the work is ambiguous, (such as a
                forum thread where the title of the thread might just be "asexuality"), then you can
                provide additional context like <code>context-author-title</code>. For an AVEN forum
                thread by "coolasexualperson" called "romance", the URL slug might be
                <code>aven-forums-coolasexualperson-romance</code>.
              </p>
            </Field>

            <Field
              name="title"
              label="Title"
              inputType="text"
              placeholder="*The Asexual Manifesto*"
              props={props}
            >
              <p>The title of the artifact.</p>
              <p>
                If the artifact represents a creative work (a book, essay, blog post, etc.), this
                should be the title of that work. If the artifact encompasses multiple works or
                doesn’t have an obvious title, it can be a short description instead. You should
                always quote or italicize the titles of works; you can add italics in an artifact
                title by surrounding it in asterisks like <code>*Title of Work*</code>.
              </p>
            </Field>

            <Field
              name="summary"
              label="Summary"
              inputType="text"
              placeholder="A paper by the Asexual Caucus of the New York Radical Feminists"
              props={props}
            >
              <p>
                A short, one sentence description of the artifact that should provide context and
                explain its significance to the queer community (i.e. why it’s in the archive).
              </p>
              <p>
                This description should complete the sentence “This artifact is…” You should always
                quote or italicize the titles of works; you can add italics in an artifact title by
                surrounding it in asterisks like <code>*Title of Work*</code>.
              </p>
            </Field>

            <Container fluid="md">
              <Row>
                <Col>
                  <FormButton
                    kind="submit"
                    label="Submit your proposal on GitHub"
                    isDisabled={isSubmitting}
                  />
                </Col>
                <Col>
                  <FormButton
                    kind="reset"
                    label="Start over"
                    isDisabled={isSubmitting}
                    onClick={handleReset}
                  />
                </Col>
              </Row>
            </Container>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ArtifactSubmitForm;
