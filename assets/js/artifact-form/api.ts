import { Artifact } from "./schema";
import { downloadAndVerify } from "./submit";
import { create as newMultihash } from "multiformats/hashes/digest";

const version = 1;

const multihashCodes = {
  sha2_512: 0x1340,
} as const;

export type ArtifactFileSubmission = Readonly<{
  name: string;
  fileName: string;
  mediaType?: string;
  multihash: string;
  sourceUrl: URL;
  hidden: boolean;
  aliases: ReadonlyArray<string>;
}>;

export type ArtifactLinkSubmission = Readonly<{
  name: string;
  url: URL;
}>;

export type ArtifactSubmission = Readonly<{
  version: number;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  files: ReadonlyArray<ArtifactFileSubmission>;
  links: ReadonlyArray<ArtifactLinkSubmission>;
  people: ReadonlyArray<string>;
  identities: ReadonlyArray<string>;
  fromYear: number;
  toYear?: number;
  decades: ReadonlyArray<number>;
  aliases: ReadonlyArray<string>;
}>;

export const toSubmission = async (formData: Artifact): Promise<ArtifactSubmission> => ({
  version: version,
  slug: formData.slug,
  title: formData.title,
  summary: formData.summary,
  description: formData.description,
  files: await Promise.all(
    formData.files?.map(async (fileData) => {
      const metadataResult = await downloadAndVerify(new URL(fileData.sourceUrl));

      if (!metadataResult.isValid) {
        throw new Error(
          `downloading file returned ${metadataResult.statusCode}: ${fileData.sourceUrl}`
        );
      }

      return {
        name: fileData.name,
        fileName: fileData.fileName,
        mediaType: metadataResult.metadata.mediaType,
        multihash: metadataResult.metadata.multihash,
        sourceUrl: new URL(fileData.sourceUrl),
        hidden: fileData.hidden,
        aliases: [],
      };
    }) ?? []
  ),
  links:
    formData.links?.map((linkData) => ({
      name: linkData.name,
      url: new URL(linkData.url),
    })) ?? [],
  people: formData.people?.split(",").map((segment) => segment.trim()) ?? [],
  identities: formData.people?.split(",").map((segment) => segment.trim()) ?? [],
  fromYear: formData.fromYear,
  toYear: formData.toYear,
  decades: formData.decades?.split(",").map((segment) => parseInt(segment.trim(), 10)) ?? [],
  aliases: [],
});
