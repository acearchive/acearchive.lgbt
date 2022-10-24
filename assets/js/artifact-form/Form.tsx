import React, { useEffect, useCallback } from "react";
import { Formik } from "formik";
import { Form, Container, Row, Col } from "react-bootstrap";
import Field from "./Field";

import { schema } from "./schema";
import FormButton from "./FormButton";
import { useSavedFormValues } from "./storage";
import { FieldList } from "./FieldList";

export const htmlFormId = "artifact-form";

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
        const { handleSubmit, isSubmitting, resetForm } = props;

        useEffect(() => {
          setSavedValues(props.values);
        }, [props.values, setSavedValues]);

        const handleReset = useCallback(() => {
          setSavedValues({});
          resetForm({ values: {} });
        }, [setSavedValues]);

        return (
          <Form id={htmlFormId} onSubmit={handleSubmit}>
            <Field
              name="slug"
              label="URL Slug"
              inputType="text"
              required={true}
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
                When you add a new artifact, you need to choose a URL slug for it, which is the part
                after the last <code>/</code>.
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
              required={true}
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
              required={true}
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

            <Field
              name="description"
              label="Description"
              inputType="text"
              required={false}
              placeholder="A paper by the Asexual Caucus of the New York Radical Feminists in which Lisa Orlando argues…"
              props={props}
            >
              If you want to provide more context than you can fit in the summary, you can
              optionally provide a longer description that will appear in the page for the artifact.
            </Field>

            <FieldList
              name="files"
              label="Files"
              singularLabel="file"
              props={props}
              initialValues={{
                name: "",
                fileName: "",
                sourceUrl: "",
                hidden: false,
              }}
              fields={[
                {
                  name: "name",
                  label: "Label",
                  inputType: "text",
                  required: true,
                  placeholder: "Digital Scan",
                  helpText: (
                    <>
                      <p>A label for the file.</p>
                      <p>
                        If the artifact consists of multiple creative works, this should generally
                        include the title of the work so people can disambiguate them. If the
                        artifact consists of a single work, it can be something short like "Paper",
                        "Transcript", "Citation", etc.
                      </p>
                    </>
                  ),
                },
                {
                  name: "fileName",
                  label: "File Name",
                  inputType: "text",
                  required: true,
                  placeholder: "the-asexual-manifesto.pdf",
                  helpText: (
                    <>
                      <p>A file name to be used when downloading the file.</p>
                      <p>
                        This should be all lowercase and use hyphens instead of spaces, and it
                        should always include an appropriate file extension. For complex use-cases,
                        such as adding an HTML page which links to static assets like images, file
                        names can contain forward slashes.
                      </p>
                      <p>
                        If you're updating an existing file, you should keep the existing file name
                        the same.
                      </p>
                    </>
                  ),
                },
                {
                  name: "sourceUrl",
                  label: "File URL",
                  inputType: "url",
                  required: true,
                  placeholder:
                    "https://archive.org/download/asexualmanifestolisaorlando/Asexual-Manifesto-Lisa-Orlando.pdf",
                  helpText: (
                    <>
                      <p>
                        The URL where this file can be downloaded from. This must be a direct
                        download link.
                      </p>
                      <p>
                        If you want to upload a file which isn't already available on the web
                        somewhere (i.e. you wrote a transcript or translation), you'll need to
                        upload it somewhere where it has a public URL until this submission is
                        approved.
                      </p>
                      <p>
                        ⚠️ This file will be temporarily downloaded to your device when you click
                        "Submit". Keep this in mind if the file is large and you're on a metered or
                        particularly slow connection.
                      </p>
                    </>
                  ),
                },
                {
                  name: "hidden",
                  label: "Hidden",
                  inputType: "checkbox",
                  required: false,
                  helpText: (
                    <>
                      <p>
                        If this is checked, this file won't appear in the list of files on the
                        artifact page. You'll usually want to leave this unchecked.
                      </p>
                      <p>
                        If you want to add an HTML page which links to static assets like images,
                        you may want to show a link to the HTML file on the site but not the static
                        assets it links to. This is a case where checking this box might be useful.
                      </p>
                      <p>
                        ⚠️ All this option does is hide the link to the file on the website; the
                        file is still publicly accessible to anyone on the internet.
                      </p>
                    </>
                  ),
                },
              ]}
            >
              <p>The list files to include in the artifact.</p>
            </FieldList>

            <FieldList
              name="links"
              label="Links"
              singularLabel="link"
              props={props}
              initialValues={{
                name: "",
                url: "",
              }}
              fields={[
                {
                  name: "name",
                  label: "Label",
                  inputType: "text",
                  required: true,
                  placeholder: "Internet Archive",
                  helpText: (
                    <>
                      <p>A label for the link.</p>
                      <p>
                        If the artifact consists of multiple creative works, this should generally
                        include the title of the work so people can disambiguate them. If the
                        artifact consists of a single work, it can be something short like “Paper”,
                        “Transcript”, or “Citation”, or it can refer to where the link points, such
                        as "Internet Archive" or "JSTOR".
                      </p>
                    </>
                  ),
                },
                {
                  name: "url",
                  label: "URL",
                  inputType: "url",
                  required: true,
                  placeholder: "https://archive.org/details/asexualmanifestolisaorlando",
                  helpText: (
                    <p>
                      The <code>https://</code> URL that the link points to.
                    </p>
                  ),
                },
              ]}
            >
              <p>A list of links to web sites to include in the artifact.</p>
            </FieldList>

            <Field
              name="people"
              label="People"
              inputType="text"
              required={false}
              placeholder="Lisa Orlando, Barbara Getz"
              props={props}
            >
              <>
                <p>
                  A list of (usually 1-5) people closely associated with the artifact as a
                  comma-separated list.
                </p>
                <p>
                  The kinds of people you could list here could include the author of a book, the
                  subject of a photo, the original poster of a forum thread, the person who coined a
                  new term, etc. This is helpful for linking together different artifacts which are
                  associated with the same people. This can be omitted if the people associated with
                  the artifact aren't clear or there were many different people involved.
                </p>
              </>
            </Field>

            <Field
              name="identities"
              label="Identities"
              inputType="text"
              required={false}
              placeholder="asexual, lesbian, non-binary"
              props={props}
            >
              <>
                <p>
                  A list of queer identities associated with the artifact as a comma-separated list.
                </p>
                <p>
                  For example, if this is a blog post about aromanticism, then "aromantic" should be
                  included in the list of identities. The identity should be in adjective form,
                  meaning it can complete the sentence, "Artifacts about _ people". This can be
                  omitted if the identities associated with the work aren't clear (e.g. it's about
                  queer identities as a whole).
                </p>
              </>
            </Field>

            <Field
              name="fromYear"
              label="Start Year"
              inputType="number"
              required={true}
              placeholder="1972"
              props={props}
            >
              <>
                <p>
                  The year the creative work associated with the artifact was published (or written,
                  posted, etc.).
                </p>
                <p>
                  If the artifact encompasses multiple works that were published in different years,
                  this should be the year the first work was published.
                </p>
              </>
            </Field>

            <Field
              name="toYear"
              label="End Year"
              inputType="number"
              required={false}
              placeholder="1989"
              props={props}
            >
              <>
                <p>
                  If the artifact encompasses multiple creative works that were published in
                  different years, this should be the year the last work was published.
                </p>
                <p>
                  If the works associated with the artifact were only published in one year, this
                  should be omitted.
                </p>
              </>
            </Field>

            <Field
              name="decades"
              label="Decades"
              inputType="text"
              required={true}
              placeholder="1970, 1980"
              props={props}
            >
              <>
                <p>
                  The list of decades in which a creative work associated with the artifact was
                  published as a comma-separated list.
                </p>
                <p>
                  If a work was published in 1980 and another work was published in 2009, this
                  should include 1980 and 2000.
                </p>
              </>
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
