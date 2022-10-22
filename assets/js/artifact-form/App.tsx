import React from "react";
import { createRoot } from "react-dom/client";
import ArtifactSubmitForm from "./Form";

const root = createRoot(document.getElementById("artifact-form"));
root.render(React.createElement(ArtifactSubmitForm));
