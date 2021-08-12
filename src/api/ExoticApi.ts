import { PublicKey } from "@solana/web3.js";
import fetch from "node-fetch";
import { MintAmount } from "./types";
import { HoldingData, ApiResult } from "../utils/types";

// TODO use method overloading to clean up methods
// TODO give correct input and return types

const createResult = <T extends {}>(response: any, mapResult: (r: any) => T): ApiResult<T> => {
  if ("Ok" in response) {
    return {
      success: true,
      // result: response["Ok"],
      result: mapResult(response["Ok"]),
    };
  } else {
    return {
      success: false,
    };
  }
};

export class ExoticApi {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAllHoldingsByPubkey(pubkey: PublicKey): Promise<any> {
    throw new Error("not implemented");
  }

  async getLatestHoldingsByPubkeys(data: any): Promise<any> {
    throw new Error("not implemented");
  }

  async getAllHoldingData(data: Array<MintAmount>): Promise<ApiResult<Array<HoldingData>>> {
    const body = [{ MintAmounts: data }];
    const url = `${this.baseUrl}/api/GetAllHoldingDataInLiveAuction`;

    const reqParams = {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, reqParams);
    const resp = await response.json();

    const mapResult = (r: any): Array<HoldingData> =>
      Object.values(r)
        .map((v: any) => ({
          holding: v.Holding,
          positions: v.Positions,
          product: v.Product,
        }))
        .filter((h: HoldingData) => h.positions.length >= 0);

    return createResult(resp, mapResult);
  }

  async getHoldingDataByPubkey(data: any): Promise<any> {
    throw new Error("not implemented");
  }

  async getAllHoldingDataInLiveAuction(data: any): Promise<any> {
    throw new Error("not implemented");
  }

  async getAllHoldingDataToBeStarted(data: any): Promise<any> {
    throw new Error("not implemented");
  }
}

const createExoticApiConnection = (baseUrl: string): ExoticApi => {
  return new ExoticApi(baseUrl);
};

export default createExoticApiConnection;
