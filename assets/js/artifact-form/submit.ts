import contentType from "content-type";
import { createSHA256 } from "hash-wasm";
import { create as newMultihash } from "multiformats/hashes/digest";
import { base16 } from "multiformats/bases/base16";
import { ArtifactSubmission } from "./api";

const multihashCodes = {
  sha2_256: 0x12,
} as const;

export type FileMetadata = Readonly<{
  mediaType?: string;
  multihash: string;
}>;

type FileDownloadResult =
  | { isValid: true; metadata: FileMetadata }
  | { isValid: false; statusCode: number };

export const downloadAndVerify = async (url: URL): Promise<FileDownloadResult> => {
  const result = await fetch(url, { method: "GET" });

  if (!result.ok) {
    return { isValid: false, statusCode: result.status };
  }

  const hasher = await createSHA256();

  for await (const chunk of result.body) {
    hasher.update(chunk);
  }

  const rawDigest = hasher.digest("binary");
  const multihashDigest = newMultihash(multihashCodes.sha2_256, rawDigest);

  const contentTypeHeader = result.headers.get("Content-Type");

  return {
    isValid: true,
    metadata: {
      multihash: base16.baseEncode(multihashDigest.bytes),
      mediaType: contentTypeHeader === null ? undefined : contentType.parse(contentTypeHeader).type,
    },
  };
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
