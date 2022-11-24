import { useState, useCallback } from "react";
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
] => {
  return useLocalStorageState<ArtifactFormData>("new_artifact_form.initial_values");
};

export const useSavedSubmissionData = (): [
  ArtifactSubmission | undefined,
  (submission: ArtifactSubmission | undefined) => void
] => useLocalStorageState<ArtifactSubmission>("new_artifact_form.current_submission");

export const useSavedArtifactSlug = (): [string | undefined, (slug: string | undefined) => void] =>
  useLocalStorageState<string>("new_artifact_form.edit_slug");
