import {
  Signer,
  Connection,
  sendAndConfirmRawTransaction,
  Transaction,
  TransactionSignature,
  PublicKey,
  SystemProgram,
  Keypair,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { DirectionType, PlaceOrderPayload, PlaceOrderPayloadType } from "./layout";
import { sendAndConfirmTransaction as realSendAndConfirmTransaction } from "@solana/web3.js";
import { WalletAdapter } from "../utils/types";
import BN from "bn.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const sendAndConfirmTransactionSignedByWallet = async (
  wallet: WalletAdapter,
  connection: Connection,
  transaction: Transaction
): Promise<TransactionSignature> => {
  const signedTransaction = await wallet.signTransaction(transaction);
  return sendAndConfirmRawTransaction(connection, signedTransaction.serialize(), {
    skipPreflight: false,
  });
};

export const sendAndConfirmTransaction = async (
  connection: Connection,
  transaction: Transaction,
  ...signers: Array<Signer>
): Promise<TransactionSignature> => {
  return realSendAndConfirmTransaction(connection, transaction, signers, {
    skipPreflight: false,
  });
};

export const signAndSendTransaction = async (
  wallet: WalletAdapter,
  connection: Connection,
  transaction: Transaction,
  signers: Signer[],
  skipPreflight = false
): Promise<TransactionSignature> => {
  transaction.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;
  transaction.feePayer = wallet.getPublicKey();
  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }

  transaction = await wallet.signTransaction(transaction);
  const rawTransaction = transaction.serialize();
  return await connection.sendRawTransaction(rawTransaction, {
    skipPreflight,
    preflightCommitment: "single",
  });
};

export const nativeTransfer = async (
  wallet: WalletAdapter,
  connection: Connection,
  destination: PublicKey,
  amount: number
): Promise<TransactionSignature | undefined> => {
  const publicKey = wallet.getPublicKey();
  if (!publicKey) {
    return undefined;
  }

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: destination,
      lamports: amount,
    })
  );

  return await signAndSendTransaction(wallet, connection, tx, []);
};

export type PlaceOrderHoldingData = {
  initializer: PublicKey;
  holding_pubkey: PublicKey;
  deposit_account: PublicKey;
  initializer_deposit_token_account: PublicKey;
  position_mint: PublicKey | null;
  deposit_mint: PublicKey;
  amount: BN;
  limit_price: BN | null;
  direction: DirectionType;
};

export const placeOrder = async (
  params: PlaceOrderHoldingData,
  wallet: WalletAdapter,
  connection: Connection
): Promise<TransactionSignature> => {
  const new_mint = new Keypair();
  let position_mint_signer_writable = false;
  if (params.position_mint === null) {
    params.position_mint = new_mint.publicKey;
    position_mint_signer_writable = true;
  }

  const signers: Signer[] = [];
  if (position_mint_signer_writable) {
    signers.push(new_mint);
  }

  const position_account = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    params.position_mint,
    params.initializer
  );

  const PROGRAM_ID: PublicKey = new PublicKey("ttr88go5541Sa5BjcMG1xGcquTJKemNNuxFJHAViW7B");
  // Get PDA
  const PDA = await PublicKey.findProgramAddress([Buffer.from("holding")], PROGRAM_ID);

  const payload: PlaceOrderPayloadType = {
    direction: params.direction,
    amount: params.amount,
    limit_price: { limit_price: params.limit_price },
  };

  const buf = Buffer.alloc(100);
  const size_enc = PlaceOrderPayload.encode(payload, buf);
  const tx_instr = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      /// 0. `[signer]` Initializer
      { pubkey: params.initializer, isSigner: true, isWritable: true },
      /// 1. `[writable]` Holding Data
      { pubkey: params.holding_pubkey, isSigner: false, isWritable: true },
      /// 2. `[writable]` Deposit Token Account (buy or sell)
      { pubkey: params.deposit_account, isSigner: false, isWritable: true },
      /// 3. `[writable]` Token Account from Placer
      { pubkey: params.initializer_deposit_token_account, isSigner: false, isWritable: true },
      /// 4. `[writable]` Position (token) Account (MO or LO)
      { pubkey: position_account, isSigner: false, isWritable: true },
      /// 5. `[writable]` Mint for position (MO or LO - could be new)
      {
        pubkey: params.position_mint!,
        isSigner: position_mint_signer_writable,
        isWritable: position_mint_signer_writable,
      },
      /// 6. `[]` Deposit (token) Mint (buy or sell)
      { pubkey: params.deposit_mint, isSigner: false, isWritable: true },
      /// 7. `[]` Token Program
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      /// 8. `[]` Sysvar Program
      { pubkey: PublicKey.default, isSigner: false, isWritable: false },
      /// 9. `[]` Rent Program
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      /// 10. `[]` PDA
      { pubkey: PDA[0], isSigner: false, isWritable: false },

      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: buf.slice(size_enc),
  });

  const tx = new Transaction();
  tx.add(tx_instr);

  const res = await signAndSendTransaction(wallet, connection, tx, signers);
  return res;
};
