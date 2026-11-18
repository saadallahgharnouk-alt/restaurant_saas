import { createContext, useContext } from "react";

export const ContentContext = createContext(null);

export function useContent() {
  const ctx = useContext(ContentContext);
  if (ctx === null) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return ctx;
}
