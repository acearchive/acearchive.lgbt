import { ArtifactFormInput } from "./schema";
import { artifacts as rawCurrentArtifacts } from "@params";

const version = 1;

//
// This schema represents the shape of artifact data as it is stored in the Hugo
// page params and passed into this React app.
//

export type ArtifactFile = Readonly<{
  name: string;
  fileName: string;
  mediaType?: string;
  hash: string;
  hashAlgorithm: string;
  storageKey: string;
  url: string;
  hidden: boolean;
  aliases: ReadonlyArray<string>;
}>;

export type ArtifactLink = Readonly<{
  name: string;
  url: string;
}>;

type Artifact = Readonly<{
  slug: string;
  title: string;
  summary: string;
  description?: string;
  files: ReadonlyArray<ArtifactFile>;
  links: ReadonlyArray<ArtifactLink>;
  people: ReadonlyArray<string>;
  identities: ReadonlyArray<string>;
  fromYear: number;
  toYear?: number;
  decades: ReadonlyArray<number>;
  aliases: ReadonlyArray<string>;
}>;

// Hugo implicitly converts all top-level page params to lowercase.
export type HugoArtifact = {
  [P in keyof Artifact as Lowercase<P>]: Artifact[P];
};

//
// This schema represents the shape of artifact submissions that are committed
// to the GitHub repo.
//

export type ArtifactFileSubmission = Readonly<{
  name: string;
  fileName: string;
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

// This accepts an optional second parameter which should be used when modifying
// an existing artifact. File and artifact aliases are pulled from the base
// artifact and added to the submission, since they currently can't be set via
// the HTML form.
export const toSubmission = async (
  formData: ArtifactFormInput,
  baseArtifact?: HugoArtifact
): Promise<ArtifactSubmission> => ({
  version: version,
  slug: formData.slug,
  title: formData.title,
  summary: formData.summary,
  description: formData.description,
  files: await Promise.all(
    formData.files?.map(async (fileData) => ({
      name: fileData.name,
      fileName: fileData.fileName,
      sourceUrl: new URL(fileData.sourceUrl),
      hidden: fileData.hidden,
      aliases:
        baseArtifact?.files?.find((baseFile) => baseFile.fileName === fileData.fileName)?.aliases ??
        [],
    })) ?? []
  ),
  links:
    formData.links?.map((linkData) => ({
      name: linkData.name,
      url: new URL(linkData.url),
    })) ?? [],
  people:
    formData.people === "" || formData.people === undefined
      ? []
      : formData.people.split(",")?.map((segment) => segment.trim()),
  identities:
    formData.identities === "" || formData.identities === undefined
      ? []
      : formData.identities.split(",")?.map((segment) => segment.trim()),
  fromYear: formData.fromYear,
  toYear: formData.toYear,
  decades: formData.decades?.split(",").map((segment) => parseInt(segment.trim(), 10)) ?? [],
  aliases: baseArtifact?.aliases ?? [],
});

// This converts an existing artifact to the necessary shape to import it into
// the HTML form to support editing existing artifacts.
export const toFormInput = (artifact: HugoArtifact): ArtifactFormInput => ({
  slug: artifact.slug,
  title: artifact.title,
  summary: artifact.summary,
  description: artifact.description,
  files: artifact.files.map((file) => ({
    name: file.name,
    fileName: file.fileName,
    sourceUrl: file.url,
    hidden: file.hidden,
  })),
  links: artifact.links.map((link) => ({
    name: link.name,
    url: link.url,
  })),
  people: artifact.people.join(", "),
  identities: artifact.identities.join(", "),
  fromYear: artifact.fromyear,
  toYear: artifact.toyear,
  decades: artifact.decades.map((decade) => decade.toString(10)).join(", "),
});

export const currentArtifacts: Record<string, HugoArtifact> = rawCurrentArtifacts;
