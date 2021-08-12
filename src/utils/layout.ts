// @ts-ignore
import { struct, u8 } from "buffer-layout";
import { bool, Layout, option, publicKey, rustEnum, u64, u16, u128, vec, u32 } from "@project-serum/borsh";
import { PublicKey, Connection } from "@solana/web3.js";
import BN from "bn.js";

function getDateTimeFromUnix(bn: BN) {
  return new Date(1000 * bn.toNumber()).toUTCString();
}

/// DIRECTION Type

export type Direction = { buy: any } | { sell: any };

// function printDirection(dir: Direction) {
//   switch (dir) {
//     case directionBuy: return "Buy"
//     case directionSell: return "Sell"
//   }
// }

export const DirectionEnum = rustEnum([struct([], "buy"), struct([], "sell")]);

export const Direction: Layout<Direction> = rustEnum([struct([], "buy"), struct([], "sell")]);

export const DIRECTION_SPAN = Math.max(...Object.values(DirectionEnum.registry).map((r) => r.span));

export function encodeDirection(d: Direction) {
  let buf = Buffer.alloc(DIRECTION_SPAN);
  let lim = Direction.encode(d, buf);
  buf.slice(0, lim);
  return buf;
}

/// DIRECTION Type

export type FeeTier = { standard: any };

export const FeeTierEnum = rustEnum([struct([], "standard")]);

export const FeeTierLayout: Layout<FeeTier> = rustEnum([struct([], "standard")]);

export const FEE_TIER_SPAN = Math.max(...Object.values(FeeTierEnum.registry).map((r) => r.span));

/// ORDERTYPE Type

export type OrderType = { auctionOrder: any } | { auctionLimitOrder: { limit: BN } };

export const OrderTypeEnum = rustEnum([struct([], "auctionOrder"), struct([u64("limit")], "auctionLimitOrder")]);

export const OrderType: Layout<OrderType> = rustEnum([
  struct([], "auctionOrder"),
  struct([u64("limit")], "auctionLimitOrder"),
]);

export const ORDER_TYPE_SPAN = Math.max(...Object.values(OrderTypeEnum.registry).map((r) => r.span));

export function encodeOT(d: OrderType) {
  let buf = Buffer.alloc(ORDER_TYPE_SPAN);
  let lim = OrderType.encode(d, buf);
  buf.slice(0, lim);
  return buf;
}

///////

export type HoldingDataInit = {
  product_specification_account: PublicKey;
  start_time: BN;
  limit_cancel: BN;
  end_time: BN;
  min_amount_buy: BN;
  min_amount_sell: BN;
  min_price: BN;
  max_price: BN;
  alo_possible: boolean;
  nb_limit_price_one_side: BN;
};

export const HoldingDataInit: Layout<HoldingDataInit> = struct([
  publicKey("product_specification_account"),
  u64("start_time"),
  u64("limit_cancel"),
  u64("end_time"),
  u64("min_amount_buy"),
  u64("min_amount_sell"),
  u16("min_price"),
  u16("max_price"),
  bool("alo_possible"),
  u8("nb_limit_price_one_side"),
]);

export function printHoldingDataInit(h: HoldingDataInit) {
  console.log("HoldingDataInit");
  console.log("Contract specs", h.product_specification_account.toBase58());
  console.log("start_time", h.start_time.toNumber());
  console.log("limit_cancel", h.limit_cancel.toNumber());
  console.log("end_time", h.end_time.toNumber());
  console.log("min_amount_buy", h.min_amount_buy.toNumber());
  console.log("min_amount_sell", h.min_amount_sell.toNumber());
  console.log("min_amount_sell", h.nb_limit_price_one_side.toNumber());
}

export type LimitPriceMint = {
  limit_price: BN;
  mint_buy: PublicKey | null;
  mint_sell: PublicKey | null;
  percentage_buy: BN | null;
  percentage_sell: BN | null;
};

export const LimitPriceMint: Layout<LimitPriceMint> = struct([
  u128("limit_price"),
  option(publicKey("mint_buy"), "mint_buy"),
  option(publicKey("mint_sell"), "mint_sell"),
  option(u32("percentage_buy"), "percentage_buy"),
  option(u32("percentage_sell"), "percentage_sell"),
]);

export function printLimitPriceMint(h: LimitPriceMint) {
  console.log("LimitPriceMint");
  console.log("limit_price", h.limit_price.toNumber());
  console.log("mint_buy", h.mint_buy?.toBase58());
  console.log("mint_sell", h.mint_sell?.toBase58());
  console.log("percentage_buy", h.percentage_buy?.toNumber());
  console.log("percentage_sell", h.percentage_sell?.toNumber());
}

export type LimitPrice = {
  limit_price: BN | null;
};

export const LimitPrice: Layout<LimitPrice> = struct([option(u128("limit_price"), "limit_price")]);

/// HOLDINGDATA Type

export type HoldingData = {
  is_initialized: boolean;
  initializer_pubkey: PublicKey;
  product_specification_account: PublicKey;
  start_time: BN; //unixtime in sec
  limit_cancel: BN; // sec
  end_time: BN; // sec,
  deposit_mint_buy: PublicKey;
  deposit_mint_sell: PublicKey;
  deposit_mint_buy_digits: BN;
  deposit_mint_sell_digits: BN;
  deposit_token_account_buy: PublicKey;
  deposit_token_account_sell: PublicKey;
  min_amount_buy: BN;
  min_amount_sell: BN;
  init_ratio: BN;
  nb_limit_price: BN;
  size_buy_auction_mo: BN;
  size_sell_auction_mo: BN;
  min_price: BN;
  max_price: BN;
  equilibrium_price: BN;
  lp_position_mint_mo_buy: PublicKey;
  lp_position_mint_mo_sell: PublicKey;
  position_mint_mo_buy: PublicKey | null;
  position_mint_mo_sell: PublicKey | null;
  alo_possible: boolean;
  limit_order_positions_buy: BN[];
  limit_order_positions_sell: BN[];
  limit_prices_and_mint: LimitPriceMint[];
};

export const HoldingData: Layout<HoldingData> = struct([
  bool("is_initialized"),
  publicKey("initializer_pubkey"),
  publicKey("product_specification_account"),
  u64("start_time"),
  u64("limit_cancel"),
  u64("end_time"),
  publicKey("deposit_mint_buy"),
  publicKey("deposit_mint_sell"),
  u8("deposit_mint_buy_digits"),
  u8("deposit_mint_sell_digits"),
  publicKey("deposit_token_account_buy"),
  publicKey("deposit_token_account_sell"),
  u64("min_amount_buy"),
  u64("min_amount_sell"),
  u128("init_ratio"),
  u32("nb_limit_price"),
  u64("size_buy_auction_mo"),
  u64("size_sell_auction_mo"),
  u128("min_price"),
  u128("max_price"),
  u128("equilibrium_price"),
  publicKey("lp_position_mint_mo_buy"),
  publicKey("lp_position_mint_mo_sell"),
  option(publicKey("position_mint_mo_buy"), "position_mint_mo_buy"),
  option(publicKey("position_mint_mo_sell"), "position_mint_mo_sell"),
  bool("alo_possible"),
  vec<BN>(u64("limit_order_positions_buy"), "limit_order_positions_buy"),
  vec<BN>(u64("limit_order_positions_sell"), "limit_order_positions_sell"),
  vec<LimitPriceMint>(LimitPriceMint.replicate("limit_prices_and_mint"), "limit_prices_and_mint"),
]);

export function holdingDataSpan(nb_limit_price: number) {
  return (
    1 +
    32 * 2 +
    8 * 3 +
    32 * 2 +
    1 * 2 +
    32 * 2 +
    8 * 2 +
    16 +
    4 +
    8 * 2 +
    16 * 2 +
    16 +
    32 * 4 +
    1 +
    (4 + 8 * (nb_limit_price + 1)) * 2 +
    (4 + (16 + 33 + 9) * nb_limit_price * 2)
  );
}

export async function printHolding(h: HoldingData, connection: Connection) {
  console.log("---- PRINT HOLDING DATA");

  console.log("is_initialized", h.is_initialized);
  console.log("initializer_pubkey", h.initializer_pubkey.toBase58());
  console.log("product_specification_account", h.product_specification_account.toBase58());
  console.log("start_time", h.start_time.toNumber());
  console.log("start_time", getDateTimeFromUnix(h.start_time));
  console.log("limit_cancel", getDateTimeFromUnix(h.start_time.add(h.limit_cancel)));
  console.log("end_time", getDateTimeFromUnix(h.start_time.add(h.end_time)));
  console.log("buy_token_pubkey", h.deposit_mint_buy.toBase58());
  console.log("sell_token_pubkey", h.deposit_mint_sell.toBase58());
  console.log("deposit_token_account_buy", h.deposit_token_account_buy.toBase58());
  console.log("deposit_token_account_sell", h.deposit_token_account_sell.toBase58());
  console.log("min_amount_buy", h.min_amount_buy.toNumber());
  console.log("min_amount_sell", h.min_amount_sell.toNumber());
  console.log("init_ratio", h.init_ratio.toString());
  console.log("nb_limit_price", h.nb_limit_price);
  console.log("size_buy_auction_mo", h.size_buy_auction_mo.toNumber());
  console.log("min_price", h.min_price.toNumber());
  console.log("max_price", h.max_price.toNumber());
  console.log("size_sell_auction_mo", h.size_sell_auction_mo.toNumber());
  console.log("equilibrium_price", h.equilibrium_price.toNumber());
  console.log("lp_position_mint_mo_buy", h.lp_position_mint_mo_buy.toBase58());
  console.log("lp_position_mint_mo_sell", h.lp_position_mint_mo_sell.toBase58());

  console.log("position_mint_mo_buy", h.position_mint_mo_buy?.toBase58());
  console.log("position_mint_mo_sell", h.position_mint_mo_sell?.toBase58());
  console.log("alo_possible", h.alo_possible);

  console.log("Size buy ALO");
  h.limit_order_positions_buy.map((x) => console.log(x.toNumber()));
  console.log("Size sell ALO");
  h.limit_order_positions_sell.map((x) => console.log(x.toNumber()));

  h.limit_prices_and_mint.map((x) => printLimitPriceMint(x));
}

// Data to send to place order

export type PlaceOrderPayload = {
  direction: Direction;
  amount: BN;
  limit_price: LimitPrice;
};

export const PlaceOrderPayload: Layout<PlaceOrderPayload> = struct([
  Direction.replicate("direction"),
  u64("amount"),
  LimitPrice.replicate("limit_price"),
]);
