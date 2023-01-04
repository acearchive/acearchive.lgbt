import { ArtifactSubmission } from "./api";

const buildUrlQuery = (queryParams: Record<string, string>) =>
  Object.entries(queryParams)
    .map((pair) => pair.map(encodeURIComponent).join("="))
    .join("&");

const buildUrl = (path: string, queryParams: Record<string, string>) => {
  const strippedPath = path.endsWith("/") ? path.slice(0, -1) : path;
  const paramString = buildUrlQuery(queryParams);
  return new URL(`${strippedPath}/?${paramString}`);
};

const githubOpenIssueUrl = ({
  githubUser,
  githubRepo,
  title,
  labels,
  template,
  fields,
}: {
  githubUser: string;
  githubRepo: string;
  title: string;
  labels: ReadonlyArray<string>;
  template: string;
  fields?: Record<string, string>;
}): URL =>
  buildUrl(`https://github.com/${githubUser}/${githubRepo}/issues/new`, {
    ...fields,
    title: title,
    labels: labels.join(","),
    template: template,
  });

export const artifactFormSubmitUrl = (submission: ArtifactSubmission, isEditing: boolean): URL =>
  githubOpenIssueUrl({
    githubUser: "acearchive",
    githubRepo: "artifact-submissions",
    title: isEditing ? `[Edit] ${submission.title}` : `[Submission] ${submission.title}`,
    labels: isEditing ? ["edit"] : ["submission"],
    template: isEditing ? "edit.yaml" : "submission.yaml",
    fields: {
      artifact: JSON.stringify(submission, null, 2),
    },
  });
