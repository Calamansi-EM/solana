import {
  Token,
  // AccountInfo,
  // AuthorityType,
  // MintInfo,
  // MintLayout,
  // AccountLayout,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  // HoldingData,
  // holdingDataSpan,
  // DIRECTION_SPAN,
  // FEE_TIER_SPAN,
  // ORDER_TYPE_SPAN,
  // printHolding,
  // LimitPriceMint,
  // printLimitPriceMint,
  Direction,
  // OrderType,
  // LimitPrice,
  PlaceOrderPayload,
} from "./layout";
// import { WalletAdapter } from "@solana/wallet-base";
import { sendAndConfirmTransactionSignedByWallet, signAndSendTransaction } from "./walletSign";

import {
  // Keypair,
  Account,
  Connection,
  // BpfLoader,
  // BPF_LOADER_PROGRAM_ID,
  PublicKey,
  // LAMPORTS_PER_SOL,
  // SystemProgram,
  TransactionInstruction,
  Transaction,
  // sendAndConfirmTransaction,
  // SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  // TokenAccountsFilter,
  Signer,
} from "@solana/web3.js";

//import * as Layout from '../layout';
import BN from "bn.js";
import { WalletAdapter } from "./types";

const PROGRAM_ID: PublicKey = new PublicKey("FCWw2jYxrJ87ju5Dc61sDNuLPPxzzFekMWUduoP1BRYf");

export type PlaceOrderHoldingData = {
  initializer: PublicKey;
  holding_pubkey: PublicKey;
  deposit_account: PublicKey;
  initializer_deposit_token_account: PublicKey;
  position_mint: PublicKey | null;
  deposit_mint: PublicKey;
  amount: BN;
  limit_price: BN | null;
  direction: Direction;
};

export async function placeOrder(
  params: PlaceOrderHoldingData,
  wallet: WalletAdapter,
  connection: Connection,
  updateData: () => void
) {
  // create position mint if null
  let new_mint = new Account();
  let position_mint_signer_writable = false;
  console.log("position Mint direct from params, ", params.position_mint);
  if (params.position_mint === null) {
    params.position_mint = new_mint.publicKey;
    position_mint_signer_writable = true;
  }

  let signers: Signer[] = [];
  if (position_mint_signer_writable) {
    console.log("mint " + params.position_mint.toBase58() + " signer");
    signers.push(new_mint);
  }

  // Get associated account
  let position_account = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    params.position_mint,
    params.initializer
  );

  // Get PDA
  const PDA = await PublicKey.findProgramAddress([Buffer.from("holding")], PROGRAM_ID);

  let payload: PlaceOrderPayload = {
    direction: params.direction,
    amount: params.amount,
    limit_price: { limit_price: params.limit_price },
  };

  let buf = Buffer.alloc(1000);
  let size_enc = PlaceOrderPayload.encode(payload, buf);
  let slicedBuf = buf.slice(0, size_enc);

  console.log("holding: ", params.holding_pubkey.toBase58());
  console.log("direction: ", params.direction);
  console.log("amount: ", params.amount);
  console.log("depositAcc: ", params.deposit_account.toBase58());
  console.log("walletAcc: ", params.initializer_deposit_token_account.toBase58());
  console.log("positionAcc: ", position_account.toBase58());
  console.log("positionMint: ", params.position_mint.toBase58());
  console.log("deposit mint: ", params.deposit_mint.toBase58());

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
      { pubkey: params.position_mint!, isSigner: position_mint_signer_writable, isWritable: true },
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
      /// 11. '[]' Associated Token Program
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      /// 12. '[]' Holding Program Id
      { pubkey: PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.concat([Buffer.alloc(1, 1), slicedBuf]),
  });

  let tx = new Transaction();
  tx.add(tx_instr);

  let res = await wallet.signAndSendTransaction(tx, signers, false);
  //let res = await signAndSendTransaction(connection, tx, wallet, signers);

  setTimeout(function () {
    updateData();
  }, 10000);

  console.log("here is res from transaction", res);
}
