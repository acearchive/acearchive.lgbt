import { artifacts as rawCurrentArtifacts } from "@params";
import { LanguageCode } from "iso-639-1";
import { ArtifactFormData } from "./storage";

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
  multihash: string;
  storageKey: string;
  url: string;
  lang?: LanguageCode;
  hidden: boolean;
  aliases: ReadonlyArray<string>;
}>;

export type ArtifactLink = Readonly<{
  name: string;
  url: string;
}>;

type Artifact = Readonly<{
  id: string;
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
  mediaType?: string;
  multihash?: string;
  sourceUrl: URL;
  lang?: LanguageCode;
  hidden: boolean;
  aliases: ReadonlyArray<string>;
}>;

export type ArtifactLinkSubmission = Readonly<{
  name: string;
  url: URL;
}>;

export type ArtifactSubmission = Readonly<{
  // The submission will only include the ID when editing an existing artifact.
  id?: string;
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
  formData: ArtifactFormData,
  baseArtifact?: HugoArtifact
): Promise<ArtifactSubmission> => ({
  id: baseArtifact?.id,
  version: version,
  slug: formData.slug,
  title: formData.title,
  summary: formData.summary,
  description: formData.description === "" ? undefined : formData.description,
  files: await Promise.all(
    formData.files?.map(async (fileData) => {
      const baseArtifactFile =
        baseArtifact === undefined
          ? undefined
          : baseArtifact?.files?.find((baseFile) => baseFile.fileName === fileData.fileName);

      return {
        name: fileData.name,
        fileName: fileData.fileName,
        sourceUrl: new URL(fileData.sourceUrl),
        lang: fileData.lang === "" ? undefined : (fileData.lang as LanguageCode),
        hidden: fileData.hidden,
        aliases: baseArtifactFile?.aliases ?? [],
        multihash: baseArtifactFile?.multihash,
        mediaType: baseArtifactFile?.mediaType,
      };
    }) ?? []
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
  fromYear: parseInt(formData.fromYear, 10),
  toYear: formData.toYear === "" ? undefined : parseInt(formData.toYear, 10),
  decades: formData.decades?.split(",").map((segment) => parseInt(segment.trim(), 10)) ?? [],
  aliases: baseArtifact?.aliases ?? [],
});

// This converts an existing artifact to the necessary shape to import it into
// the HTML form to support editing existing artifacts.
export const toFormInput = (artifact: HugoArtifact): ArtifactFormData => ({
  slug: artifact.slug,
  title: artifact.title,
  summary: artifact.summary,
  description: artifact.description === undefined ? "" : artifact.description,
  files: artifact.files.map((file) => ({
    name: file.name,
    fileName: file.fileName,
    sourceUrl: file.url,
    lang: file.lang === undefined ? "" : file.lang,
    hidden: file.hidden,
  })),
  links: artifact.links.map((link) => ({
    name: link.name,
    url: link.url,
  })),
  people: artifact.people.join(", "),
  identities: artifact.identities.join(", "),
  fromYear: artifact.fromyear.toString(10),
  toYear: artifact.toyear?.toString(10) ?? "",
  decades: artifact.decades.map((decade) => decade.toString(10)).join(", "),
});

export const currentArtifacts: Record<string, HugoArtifact> = rawCurrentArtifacts;
