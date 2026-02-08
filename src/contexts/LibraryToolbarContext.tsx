import React from "react";

export type LibraryToolbarContextValue = {
  toolbar: React.ReactNode;
  codeStack: "" | "react" | "vue" | "bootstrap";
};

export const LibraryToolbarContext = React.createContext<LibraryToolbarContextValue | null>(null);
