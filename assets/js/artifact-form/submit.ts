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
  buildUrl(`https://github.com/${githubUser}/${githubRepo}/new/main`, {
    filename: fileName,
    value: content,
  });

export const artifactFormSubmitUrl = (submission: ArtifactSubmission) =>
  githubPrSubmitUrl({
    fileName: `submissions/${submission.slug}.json`,
    githubUser: "acearchive",
    githubRepo: "artifact-submissions",
    content: JSON.stringify(submission, null, 2),
  });
