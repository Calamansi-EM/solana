import { ReactNode } from "react";
import { Signer, Connection, PublicKey, Transaction, TransactionSignature } from "@solana/web3.js";
import { Environment } from "../context/SolanaContext";
import BN from "bn.js";
import { TokenInfo } from "@solana/spl-token-registry";
import { AccountInfo } from "@orca-so/spl-token";

export type Props = {
  children: ReactNode;
};

export type WalletAdapter = {
  getPublicKey: () => PublicKey | undefined;
  isConnected: () => boolean;
  isAutoApprove: () => boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  sendAndConfirmTransactionSignedByWallet: (transaction: Transaction) => Promise<TransactionSignature>;
  sendAndConfirmTransaction: (transaction: Transaction, ...signers: Array<Signer>) => Promise<TransactionSignature>;
  signAndSendTransaction: (
    transaction: Transaction,
    signers: Signer[],
    skipPreflight: boolean
  ) => Promise<TransactionSignature>;
  nativeTransfer: (destination: PublicKey, amount: number) => Promise<TransactionSignature | undefined>;
};

export type WalletProvider = {
  name: string;
  url: string;
  icon: string;
  create: (env: Environment, connection: Connection) => WalletAdapter;
};

export type SplTokenBalance = {
  token: TokenInfo;
  pubkey: PublicKey;
  account: AccountInfo;
  amount: BN;
};

export type ApiResult<T> = {
  success: boolean;
  result?: T;
};

// TODO finish these types
export type Holding = any;

export type Position = any;

export type Product = any;

export type HoldingData = {
  holding: Holding;
  positions: Array<Position>;
  product: Product;
};
