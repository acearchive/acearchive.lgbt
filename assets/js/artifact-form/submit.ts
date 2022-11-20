import { ArtifactSubmission } from "./api";

const githubPrSubmitUrl = ({
  fileName,
  content,
  githubUser,
  githubRepo,
}: {
  fileName: string;
  content: string;
  githubUser: string;
  githubRepo: string;
}): URL =>
  new URL(
    `https://github.com/${githubUser}/${githubRepo}/new/main/?filename=${fileName}&value=${encodeURIComponent(
      content
    )}`
  );

export const artifactFormSubmitUrl = (submission: ArtifactSubmission) =>
  githubPrSubmitUrl({
    fileName: `submissions/${submission.slug}.json`,
    githubUser: "acearchive",
    githubRepo: "artifact-submissions",
    content: JSON.stringify(submission, null, 2),
  });
