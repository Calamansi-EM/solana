import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { Props, SplTokenBalance, WalletAdapter, WalletProvider } from "../utils/types";
import createSolletWallet from "../utils/wallet-adapters/SolletAdapter";
import createSolflareWallet from "../utils/wallet-adapters/SolflareAdapter";
import createPhantomWallet from "../utils/wallet-adapters/PhantomAdapter";
import createLedgerWallet from "../utils/wallet-adapters/LedgerAdapter";
import createSolongWallet from "../utils/wallet-adapters/SolongAdapter";
import { useSolanaContext } from "./SolanaContext";
import { Connection, PublicKey } from "@solana/web3.js";

const WALLET_PROVIDERS: Array<WalletProvider> = [
  {
    name: "sollet.io",
    url: "https://www.sollet.io",
    icon: "/images/sollet.svg",
    create: createSolletWallet,
  },
  {
    name: "Solflare",
    url: "https://solflare.com/access-wallet",
    icon: "/images/solflare.svg",
    create: createSolflareWallet,
  },
  {
    name: "Ledger",
    url: "https://www.ledger.com",
    icon: "/images/ledger.png",
    create: createLedgerWallet,
  },
  {
    name: "Solong",
    url: "https://www.solong.com",
    icon: "/images/solong.png",
    create: createSolongWallet,
  },
  {
    name: "Phantom",
    url: "https://www.phantom.app",
    icon: "/images/phantom.png",
    create: createPhantomWallet,
  },
];

export type WalletContextState = {
  wallet: WalletAdapter | undefined;
  rpcConnection: Connection;
  publicKey: PublicKey | undefined;
  providers: Array<WalletProvider>;
  solBalance: number;
  setSolBalance: (balance: number) => void;
  tokenBalances: Array<SplTokenBalance>;
  setTokenBalances: (balances: Array<SplTokenBalance>) => void;
  select: (provider: WalletProvider | undefined) => void;
  disconnect: () => Promise<void>;
};

export const WalletContext = React.createContext<WalletContextState | null>(null);

export const useWalletContext = (): WalletContextState => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("wallet context not set");
  }

  return context;
};

const WalletContextProvider = (props: Props) => {
  const solanaContext = useSolanaContext();
  const [walletProvider, setWalletProvider] = useState<WalletProvider | undefined>();
  const [wallet, setWallet] = useState<WalletAdapter | undefined>();
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenBalances, setTokenBalances] = useState<Array<SplTokenBalance>>([]);
  const rpcConnection = useMemo(() => new Connection(solanaContext.node), [solanaContext.node]);

  const connectWallet = useCallback(async (): Promise<void> => {
    try {
      const w = walletProvider?.create(solanaContext.environment, rpcConnection);
      await w?.connect();
      setWallet(w);
    } catch (error) {
      console.log(error);
      return;
    }
  }, [walletProvider, solanaContext.environment, rpcConnection]);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  const disconnectWallet = async (): Promise<void> => {
    await wallet?.disconnect();
    setWallet(undefined);
  };

  const state: WalletContextState = {
    wallet: wallet,
    rpcConnection: rpcConnection,
    publicKey: wallet?.getPublicKey(),
    providers: WALLET_PROVIDERS,
    solBalance: solBalance,
    setSolBalance: setSolBalance,
    tokenBalances: tokenBalances,
    setTokenBalances: setTokenBalances,
    select: setWalletProvider,
    disconnect: disconnectWallet,
  };

  return <WalletContext.Provider value={state}>{props.children}</WalletContext.Provider>;
};

export default WalletContextProvider;
