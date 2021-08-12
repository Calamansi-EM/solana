import React, { useState, useContext, useMemo } from "react";
import { Props } from "../utils/types";

export enum Environment {
  DEVNET = "devnet",
  TESTNET = "testnet",
  MAINNET = "mainnet-beta",
}

export const NODES: Record<Environment, string> = {
  [Environment.DEVNET]: "https://api.devnet.solana.com",
  [Environment.TESTNET]: "https://api.testnet.solana.com",
  [Environment.MAINNET]: "https://api.mainnet-beta.solana.com",
};

export type SolanaContextState = {
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  node: string;
};

export const SolanaContext = React.createContext<SolanaContextState | null>(null);

export const useSolanaContext = (): SolanaContextState => {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error("sollet context not set");
  }

  return context;
};

const SolanaContextProvider = (props: Props) => {
  const [environment, setEnvironment] = useState<Environment>(Environment.DEVNET);
  const node = useMemo(() => NODES[environment], [environment]);
  const state: SolanaContextState = {
    environment: environment,
    setEnvironment: setEnvironment,
    node: node,
  };

  return <SolanaContext.Provider value={state}>{props.children}</SolanaContext.Provider>;
};

export default SolanaContextProvider;
