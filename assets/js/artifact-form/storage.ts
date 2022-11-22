import { useState, useCallback } from "react";
import { ArtifactSubmission } from "./api";
import { Artifact } from "./schema";

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

export const initialValues: Artifact = {
  slug: "",
  title: "",
  summary: "",
  description: "",
  files: [],
  links: [],
  people: "",
  identities: "",
  fromYear: 0,
  toYear: undefined,
  decades: "",
};

export const useSavedFormValues = (): [Artifact, (values: Artifact) => void] => {
  const [savedValues, setSavedValues] = useLocalStorageState<Artifact>(
    "new_artifact_form.initial_values"
  );

  return [savedValues ?? initialValues, setSavedValues];
};

export const useSavedSubmissionData = (): [
  ArtifactSubmission | undefined,
  (submission: ArtifactSubmission | undefined) => void
] => useLocalStorageState<ArtifactSubmission>("new_artifact_form.current_submission");
