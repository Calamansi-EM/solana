import React, { useState, useContext, useMemo } from "react";
import { Props } from "../utils/types";
import createExoticApiConnection, { ExoticApi } from "../api/ExoticApi";

const BASE_URL: string = "http://test-be.exotic.markets:5000";

export type ExoticContextState = {
  baseUrl: string;
  api: ExoticApi;
  setBaseUrl: (url: string) => void;
};

export const ExoticContext = React.createContext<ExoticContextState | null>(null);

export const useExoticContext = (): ExoticContextState => {
  const context = useContext(ExoticContext);
  if (!context) {
    throw new Error("exotic context not set");
  }

  return context;
};

const ExoticContextProvider = (props: Props) => {
  const [baseUrl, setBaseUrl] = useState<string>(BASE_URL);
  const api = useMemo(() => createExoticApiConnection(baseUrl), [baseUrl]);
  const state: ExoticContextState = {
    baseUrl: baseUrl,
    api: api,
    setBaseUrl: setBaseUrl,
  };

  return <ExoticContext.Provider value={state}>{props.children}</ExoticContext.Provider>;
};

export default ExoticContextProvider;
