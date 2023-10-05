import { artifacts as rawCurrentArtifacts } from "@params";
import { LanguageCode } from "iso-639-1";
import { ArtifactFormData } from "./storage";

const version = 1;

//
// This schema represents the shape of artifact data as it is stored in the Hugo
// page params and passed into this React app.
//

export type HugoArtifactFile = Readonly<{
  name: string;
  filename: string;
  media_type?: string;
  hash: string;
  hash_algorithm: string;
  multihash: string;
  storage_key: string;
  url: string;
  lang?: LanguageCode;
  hidden: boolean;
  aliases: ReadonlyArray<string>;
}>;

export type HugoArtifactLink = Readonly<{
  name: string;
  url: string;
}>;

type HugoArtifact = Readonly<{
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  files: ReadonlyArray<HugoArtifactFile>;
  links: ReadonlyArray<HugoArtifactLink>;
  people: ReadonlyArray<string>;
  identities: ReadonlyArray<string>;
  from_year: number;
  to_year?: number;
  decades: ReadonlyArray<number>;
  aliases: ReadonlyArray<string>;
}>;

//
// This schema represents the shape of artifact submissions that are committed
// to the GitHub repo.
//

export type ArtifactFileSubmission = Readonly<{
  name: string;
  filename: string;
  media_type?: string;
  multihash?: string;
  source_url: URL;
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
  from_year: number;
  to_year?: number;
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
          : baseArtifact?.files?.find((baseFile) => baseFile.filename === fileData.fileName);

      return {
        name: fileData.name,
        filename: fileData.fileName,
        source_url: new URL(fileData.sourceUrl),
        lang: fileData.lang === "" ? undefined : (fileData.lang as LanguageCode),
        hidden: fileData.hidden,
        aliases: baseArtifactFile?.aliases ?? [],
        multihash: baseArtifactFile?.multihash,
        media_type: baseArtifactFile?.media_type,
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
  from_year: parseInt(formData.fromYear, 10),
  to_year: formData.toYear === "" ? undefined : parseInt(formData.toYear, 10),
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
    fileName: file.filename,
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
  fromYear: artifact.from_year.toString(10),
  toYear: artifact.to_year?.toString(10) ?? "",
  decades: artifact.decades.map((decade) => decade.toString(10)).join(", "),
});

export const currentArtifacts: Record<string, HugoArtifact> = rawCurrentArtifacts;
