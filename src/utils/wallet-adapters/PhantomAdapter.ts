import { WalletAdapter } from "../types";
import { Connection, PublicKey, Signer, Transaction, TransactionSignature } from "@solana/web3.js";
import EventEmitter from "eventemitter3";
import { notify } from "../notifications";
import { Environment } from "../../context/SolanaContext";
import {
  nativeTransfer,
  sendAndConfirmTransaction,
  sendAndConfirmTransactionSignedByWallet,
  signAndSendTransaction,
} from "../../api/exoticlib";

type PhantomEvent = "disconnect" | "connect";
type PhantomRequestMethod = "connect" | "disconnect" | "signTransaction" | "signAllTransactions";

interface PhantomProvider {
  publicKey?: PublicKey;
  isConnected?: boolean;
  autoApprove?: boolean;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<any>;
}

export class PhantomAdapter extends EventEmitter implements WalletAdapter {
  _provider: PhantomProvider | undefined;
  connection: Connection;

  constructor(connection: Connection) {
    super();
    this.connect = this.connect.bind(this);
    this.connection = connection;
  }

  isConnected(): boolean {
    return this._provider?.isConnected || false;
  }

  isAutoApprove(): boolean {
    return this._provider?.autoApprove || false;
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    if (!this._provider) {
      return transactions;
    }

    return this._provider.signAllTransactions(transactions);
  }

  getPublicKey(): PublicKey | undefined {
    return this._provider?.publicKey;
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    if (!this._provider) {
      return transaction;
    }

    return this._provider.signTransaction(transaction);
  }

  connect = async (): Promise<void> => {
    if (this._provider) {
      return;
    }

    let provider: PhantomProvider;
    if ((window as any)?.solana?.isPhantom) {
      provider = (window as any).solana;
    } else {
      window.open("https://phantom.app/", "_blank");
      notify({
        message: "Phantom Error",
        description: "Please install Phantom wallet from Chrome ",
      });
      return;
    }

    if (!provider.isConnected) {
      await provider.connect();
    }

    this._provider = provider;
    this.emit("connect");
    return new Promise<void>((resolve: any) => {
      if (this.getPublicKey()) {
        resolve();
      } else {
        provider.on("connect", () => {
          this._provider = provider;
          this.emit("connect");
          resolve();
        });
      }
    });
  };

  disconnect = async (): Promise<void> => {
    if (this._provider) {
      await this._provider.disconnect();
      this._provider = undefined;
      this.emit("disconnect");
    }
  };

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

const createPhantomWallet = (env: Environment, connection: Connection): PhantomAdapter => {
  const wallet = new PhantomAdapter(connection);
  return wallet;
};

export default createPhantomWallet;
