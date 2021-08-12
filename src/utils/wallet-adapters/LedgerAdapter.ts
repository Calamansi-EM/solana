import type Transport from "@ledgerhq/hw-transport";
import { Connection, Signer, Transaction, TransactionSignature } from "@solana/web3.js";
import EventEmitter from "eventemitter3";
import { PublicKey } from "@solana/web3.js";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { notify } from "../../utils/notifications";
import { WalletAdapter } from "../types";
import { Environment } from "../../context/SolanaContext";
import {
  nativeTransfer,
  sendAndConfirmTransaction,
  sendAndConfirmTransactionSignedByWallet,
  signAndSendTransaction,
} from "../../api/exoticlib";

const INS_GET_PUBKEY = 0x05;
const INS_SIGN_MESSAGE = 0x06;

const P1_NON_CONFIRM = 0x00;
const P1_CONFIRM = 0x01;

const P2_EXTEND = 0x01;
const P2_MORE = 0x02;

const MAX_PAYLOAD = 255;

const LEDGER_CLA = 0xe0;

/*
 * Helper for chunked send of large payloads
 */
async function ledgerSend(transport: Transport, instruction: number, p1: number, payload: Buffer) {
  let p2 = 0;
  let payloadOffset = 0;

  if (payload.length > MAX_PAYLOAD) {
    while (payload.length - payloadOffset > MAX_PAYLOAD) {
      const chunk = payload.slice(payloadOffset, payloadOffset + MAX_PAYLOAD);
      payloadOffset += MAX_PAYLOAD;
      console.log("send", (p2 | P2_MORE).toString(16), chunk.length.toString(16), chunk);
      const reply = await transport.send(LEDGER_CLA, instruction, p1, p2 | P2_MORE, chunk);
      if (reply.length !== 2) {
        throw new Error("Received unexpected reply payload");
      }
      p2 |= P2_EXTEND;
    }
  }

  const chunk = payload.slice(payloadOffset);
  console.log("send", p2.toString(16), chunk.length.toString(16), chunk);
  const reply = await transport.send(LEDGER_CLA, instruction, p1, p2, chunk);

  return reply.slice(0, reply.length - 2);
}

export function getSolanaDerivationPath(account?: number, change?: number) {
  var length;
  if (account !== undefined) {
    if (change !== undefined) {
      length = 4;
    } else {
      length = 3;
    }
  } else {
    length = 2;
  }

  var derivationPath = Buffer.alloc(1 + length * 4);
  return derivationPath;
}

export async function signTransaction(
  transport: Transport,
  transaction: Transaction,
  derivationPath: Buffer = getSolanaDerivationPath()
) {
  const messageBytes = transaction.serializeMessage();
  return signBytes(transport, messageBytes, derivationPath);
}

export async function signBytes(
  transport: Transport,
  bytes: Buffer,
  derivationPath: Buffer = getSolanaDerivationPath()
) {
  const numPaths = Buffer.alloc(1);
  numPaths.writeUInt8(1, 0);

  const payload = Buffer.concat([numPaths, derivationPath, bytes]);

  // @FIXME: must enable blind signing in Solana Ledger App per https://github.com/project-serum/spl-token-wallet/issues/71
  // See also https://github.com/project-serum/spl-token-wallet/pull/23#issuecomment-712317053
  return ledgerSend(transport, INS_SIGN_MESSAGE, P1_CONFIRM, payload);
}

export async function getPublicKey(transport: Transport, derivationPath: Buffer = getSolanaDerivationPath()) {
  const publicKeyBytes = await ledgerSend(transport, INS_GET_PUBKEY, P1_NON_CONFIRM, derivationPath);

  return new PublicKey(publicKeyBytes);
}

export class LedgerAdapter extends EventEmitter implements WalletAdapter {
  _connecting: boolean;
  _publicKey: PublicKey | undefined;
  _transport: Transport | undefined;
  connection: Connection;

  constructor(connection: Connection) {
    super();
    this._connecting = false;
    this._publicKey = undefined;
    this._transport = undefined;
    this.connection = connection;
  }

  getPublicKey(): PublicKey | undefined {
    return this._publicKey;
  }

  isConnected(): boolean {
    return Boolean(this._publicKey);
  }

  isAutoApprove() {
    return false;
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    const result: Transaction[] = [];
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      const signed = await this.signTransaction(transaction);
      result.push(signed);
    }

    return result;
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    if (!this._transport || !this._publicKey) {
      throw new Error("Not connected to Ledger");
    }

    // @TODO: account selection (derivation path changes with account)
    const signature = await signTransaction(this._transport, transaction);

    transaction.addSignature(this._publicKey, signature);

    return transaction;
  }

  async connect(): Promise<void> {
    if (this._connecting) {
      return;
    }

    this._connecting = true;

    try {
      // @TODO: transport selection (WebUSB, WebHID, bluetooth, ...)
      this._transport = await TransportWebUSB.create();
      // @TODO: account selection
      this._publicKey = await getPublicKey(this._transport);
      this.emit("connect", this._publicKey);
    } catch (error) {
      notify({
        message: "Ledger Error",
        description: error.message,
      });
      await this.disconnect();
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    let emit = false;
    if (this._transport) {
      await this._transport.close();
      this._transport = undefined;
      emit = true;
    }

    this._connecting = false;
    this._publicKey = undefined;

    if (emit) {
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

const createLedgerWallet = (env: Environment, connection: Connection): LedgerAdapter => {
  const wallet = new LedgerAdapter(connection);
  return wallet;
};

export default createLedgerWallet;
