import { useState, useCallback } from "react";

// Adapted from this tutorial:
// https://frankmeszaros.medium.com/use-localstorage-and-formik-to-supercharge-your-form-experience-a175d68e5ecb

export const useLocalStorageState = (key: string, value: any): [any, (value: any) => void] => {
  let currentLocalStorage: any;

  try {
    currentLocalStorage = JSON.parse(localStorage.getItem(key) ?? "{}");
  } catch (e) {
    currentLocalStorage = {};
  }

  const initialValue = Object.keys(currentLocalStorage).length > 0 ? currentLocalStorage : value;

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

export const initialValues = {
  slug: "",
  title: "",
  summary: "",
  description: "",
};

export const useSavedFormValues = () =>
  useLocalStorageState("new-artifact-form.initial-values", initialValues);
