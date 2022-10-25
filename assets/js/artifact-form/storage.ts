import { useState, useCallback } from "react";
import { ArtifactSubmission } from "./api";
import { Artifact } from "./schema";

// Adapted from this tutorial:
// https://frankmeszaros.medium.com/use-localstorage-and-formik-to-supercharge-your-form-experience-a175d68e5ecb

export const useLocalStorageState = (key: string, value: any): [any, (value: any) => void] => {
  let currentLocalStorage: any;

  try {
    currentLocalStorage = JSON.parse(localStorage.getItem(key) ?? "null");
  } catch (e) {
    currentLocalStorage = null;
  }

  const initialValue = currentLocalStorage === null ? value : currentLocalStorage;

  const [localStorageState, setLocalStorageState] = useState(initialValue);

  const handleUpdateLocalStorageState = useCallback(
    (value: any) => {
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
  toYear: 0,
  decades: "",
};

export const useSavedFormValues = (): [Artifact, (values: Artifact) => void] =>
  useLocalStorageState("new-artifact-form.initial-values", initialValues);

export const useSavedSubmissionData = (): [
  ArtifactSubmission | undefined,
  (submission: ArtifactSubmission | undefined) => void
] => {
  const [submissionData, setSubmissionData] = useLocalStorageState(
    "new-artifact-form.current-submission",
    null
  );

  return [submissionData ?? undefined, (submission) => setSubmissionData(submission ?? null)];
};
