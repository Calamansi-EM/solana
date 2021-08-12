import EventEmitter from "eventemitter3";
import { Environment } from "../../context/SolanaContext";
import { Connection, PublicKey, Signer, Transaction, TransactionSignature } from "@solana/web3.js";
import { notify } from "../../utils/notifications";
import { WalletAdapter } from "../types";
import {
  nativeTransfer,
  sendAndConfirmTransaction,
  sendAndConfirmTransactionSignedByWallet,
  signAndSendTransaction,
} from "../../api/exoticlib";

export class SolongAdapter extends EventEmitter implements WalletAdapter {
  _publicKey?: PublicKey;
  _onProcess: boolean;
  _connected: boolean;
  connection: Connection;

  constructor(connection: Connection) {
    super();
    this._onProcess = false;
    this._connected = false;
    this.connect = this.connect.bind(this);
    this.connection = connection;
  }

  isConnected(): boolean {
    return this._connected;
  }

  isAutoApprove(): boolean {
    return false;
  }

  public async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    const solong = (window as any).solong;
    if (solong.signAllTransactions) {
      return solong.signAllTransactions(transactions);
    } else {
      const result: Transaction[] = [];
      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        const signed = await solong.signTransaction(transaction);
        result.push(signed);
      }

      return result;
    }
  }

  getPublicKey(): PublicKey | undefined {
    return this._publicKey;
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    return (window as any).solong.signTransaction(transaction);
  }

  async connect(): Promise<void> {
    if (this._onProcess) {
      return;
    }

    if ((window as any).solong === undefined) {
      notify({
        message: "Solong Error",
        description: "Please install solong wallet from Chrome ",
      });
      return;
    }

    this._onProcess = true;
    const promise = (window as any).solong
      .selectAccount()
      .then((account: any) => {
        this._publicKey = new PublicKey(account);
        this._connected = true;
        this.emit("connect", this._publicKey);
      })
      .catch(() => {
        this.disconnect();
      })
      .finally(() => {
        this._onProcess = false;
      });

    await promise;
  }

  async disconnect(): Promise<void> {
    if (this._publicKey) {
      this._publicKey = undefined;
      this._connected = false;
      this.emit("disconnect");
    }
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

const createSolongWallet = (env: Environment, connection: Connection): SolongAdapter => {
  const wallet = new SolongAdapter(connection);
  return wallet;
};

export default createSolongWallet;
