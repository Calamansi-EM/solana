import Wallet from "@project-serum/sol-wallet-adapter";
import { WalletAdapter } from "../types";
import { PublicKey, Transaction, clusterApiUrl, Connection, Signer, TransactionSignature } from "@solana/web3.js";
import { Environment } from "../../context/SolanaContext";
import {
  nativeTransfer,
  sendAndConfirmTransaction,
  sendAndConfirmTransactionSignedByWallet,
  signAndSendTransaction,
} from "../../api/exoticlib";

const BASE_URL = "https://solflare.com/access-wallet";

export class SolflareAdapter extends Wallet implements WalletAdapter {
  connection: Connection;

  constructor(base_url: string, network: string, connection: Connection) {
    super(base_url, network);
    this.connection = connection;
  }

  getPublicKey(): PublicKey | undefined {
    if (!this.publicKey) {
      return undefined;
    }

    return this.publicKey;
  }

  isConnected(): boolean {
    return this.connected;
  }

  isAutoApprove(): boolean {
    return this.autoApprove;
  }

  async connect(): Promise<void> {
    return super.connect();
  }

  async disconnect(): Promise<void> {
    return super.disconnect();
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    return super.signTransaction(transaction);
  }

  async sendAndConfirmTransactionSignedByWallet(transaction: Transaction): Promise<TransactionSignature> {
    return sendAndConfirmTransactionSignedByWallet(this, this.connection, transaction);
  }

  async sendAndConfirmTransaction(transaction: Transaction, ...signers: Array<Signer>): Promise<TransactionSignature> {
    return sendAndConfirmTransaction(this.connection, transaction, ...signers);
  }

  async signAndSendTransaction(
    transaction: Transaction,
    signers: Signer[],
    skipPreflight = false
  ): Promise<TransactionSignature> {
    return signAndSendTransaction(this, this.connection, transaction, signers, skipPreflight);
  }

  async nativeTransfer(destination: PublicKey, amount: number): Promise<TransactionSignature | undefined> {
    return nativeTransfer(this, this.connection, destination, amount);
  }
}

const createSolflareWallet = (env: Environment, connection: Connection): SolflareAdapter => {
  const network = clusterApiUrl(env);
  const wallet = new SolflareAdapter(BASE_URL, network, connection);
  return wallet;
};

export default createSolflareWallet;
