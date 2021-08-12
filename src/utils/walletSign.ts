import {
  Connection,
  PublicKey,
  sendAndConfirmRawTransaction,
  Signer,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import { sendAndConfirmTransaction as realSendAndConfirmTransaction } from "@solana/web3.js";
import { WalletAdapter } from "@solana/wallet-base";

export async function sendAndConfirmTransactionSignedByWallet(
  connection: Connection,
  wallet: WalletAdapter,
  transaction: Transaction
): Promise<TransactionSignature> {
  let signedTransaction = await wallet.signTransaction(transaction);

  return sendAndConfirmRawTransaction(connection, signedTransaction.serialize(), {
    skipPreflight: false,
  });
}

export function sendAndConfirmTransaction(
  title: string,
  connection: Connection,
  transaction: Transaction,
  ...signers: Array<Signer>
): Promise<TransactionSignature> {
  return realSendAndConfirmTransaction(connection, transaction, signers, {
    skipPreflight: false,
  });
}

export async function signAndSendTransaction(
  connection: Connection,
  transaction: Transaction,
  wallet: WalletAdapter,
  signers: Signer[],
  skipPreflight = false
) {
  if (wallet.publicKey == null) return;

  transaction.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;
  transaction.setSigners(
    // fee payed by the wallet owner
    wallet.publicKey,
    ...signers.map((s) => s.publicKey)
  );

  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }

  transaction = await wallet.signTransaction(transaction);
  const rawTransaction = transaction.serialize();
  return await connection.sendRawTransaction(rawTransaction, {
    skipPreflight,
    preflightCommitment: "single",
  });
}

export async function nativeTransfer(
  connection: Connection,
  wallet: WalletAdapter,
  destination: PublicKey,
  amount: number
) {
  if (wallet.publicKey == null) return;
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: destination,
      lamports: amount,
    })
  );
  return await signAndSendTransaction(connection, tx, wallet, []);
}
