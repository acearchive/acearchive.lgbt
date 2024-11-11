import { useState, useCallback, useMemo, useEffect } from "react";
import { ArtifactSubmission } from "./api";
import { ArtifactSchema } from "./schema";

// Adapted from this tutorial:
// https://frankmeszaros.medium.com/use-localstorage-and-formik-to-supercharge-your-form-experience-a175d68e5ecb

export const useLocalStorageState = <T>(
  key: string
): [T | undefined, (value: T | undefined) => void] => {
  let currentLocalStorage: T | undefined;

  try {
    const localStorageItem = localStorage.getItem(key);
    currentLocalStorage = localStorageItem === null ? undefined : JSON.parse(localStorageItem);
  } catch (e) {
    currentLocalStorage = undefined;
  }

  const [localStorageState, setLocalStorageState] = useState(currentLocalStorage);

  const handleUpdateLocalStorageState = useCallback(
    (value: T | undefined) => {
      setLocalStorageState(value);
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  return [localStorageState, handleUpdateLocalStorageState];
};

type FormData<T> = {
  [P in keyof T]: NonNullable<T[P]> extends Array<any>
    ? Array<FormData<NonNullable<T[P]>[number]>>
    : T[P] extends boolean
    ? boolean
    : string;
};

export type ArtifactFormData = FormData<ArtifactSchema>;

export const emptyFormInput: ArtifactFormData = {
  slug: "",
  title: "",
  summary: "",
  description: "",
  files: [],
  links: [],
  people: "",
  identities: "",
  fromYear: "",
  toYear: "",
  decades: "",
};

export const useSavedFormValues = (): [
  ArtifactFormData | undefined,
  (values: ArtifactFormData) => void
] => useLocalStorageState<ArtifactFormData>("new_artifact_form.initial_values");

export const useSavedSubmissionData = (): [
  ArtifactSubmission | undefined,
  (submission: ArtifactSubmission | undefined) => void
] => useLocalStorageState<ArtifactSubmission>("new_artifact_form.current_submission");

const artifactEditSlugQueryParam = "artifact";
const githubIssuePrefix = "https://github.com/acearchive/artifact-submissions/issues/";

export const useArtifactSlug = (): {
  artifactSlugOrIssueUrl: string | undefined;
  artifactSource: "github-issue" | "ace-archive" | undefined;
  artifactSlugHasChanged: boolean;
  clearArtifactSlug: () => void;
} => {
  const [savedArtifactSlug, setSavedArtifactSlug] = useLocalStorageState<string>(
    "new_artifact_form.edit_slug"
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const prevArtifactSlug = useMemo(() => savedArtifactSlug, []);

  useEffect(() => {
    setSavedArtifactSlug(queryParams.get(artifactEditSlugQueryParam) ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryParams = useMemo(() => new URLSearchParams(window.location.search), []);

  const clearArtifactSlug = useCallback(() => {
    setSavedArtifactSlug(undefined);

    queryParams.delete(artifactEditSlugQueryParam);

    const newUrl = new URL(window.location.href);
    newUrl.search = `?${queryParams.toString()}`;
    console.log(newUrl.toString());
    window.history.replaceState({}, "", newUrl);
  }, [queryParams, setSavedArtifactSlug]);

  let artifactSource: "github-issue" | "ace-archive" | undefined;

  if (savedArtifactSlug === undefined) {
    artifactSource = undefined;
  } else if (savedArtifactSlug?.startsWith(githubIssuePrefix)) {
    artifactSource = "github-issue";
  } else {
    artifactSource = "ace-archive";
  }

  return {
    artifactSlugOrIssueUrl: savedArtifactSlug,
    artifactSource,
    artifactSlugHasChanged: savedArtifactSlug !== prevArtifactSlug,
    clearArtifactSlug,
  };
};
