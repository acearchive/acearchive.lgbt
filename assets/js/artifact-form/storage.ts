import { useState, useCallback } from "react";
import { ArtifactSubmission } from "./api";
import { ArtifactFormInput } from "./schema";

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

export const emptyFormInput: ArtifactFormInput = {
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

export const useSavedFormValues = (): [ArtifactFormInput, (values: ArtifactFormInput) => void] => {
  const [savedValues, setSavedValues] = useLocalStorageState<ArtifactFormInput>(
    "new_artifact_form.initial_values"
  );

  return [savedValues ?? emptyFormInput, setSavedValues];
};

export const useSavedSubmissionData = (): [
  ArtifactSubmission | undefined,
  (submission: ArtifactSubmission | undefined) => void
] => useLocalStorageState<ArtifactSubmission>("new_artifact_form.current_submission");
