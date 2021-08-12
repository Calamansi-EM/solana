import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useWalletContext } from "../context/WalletContext";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { HoldingData, SplTokenBalance, Position } from "../utils/types";
import { useExoticContext } from "../context/ExoticContext";
import { MintAmount } from "../api/types";

const Positions = () => {
  const [holdings, setHoldings] = useState<Array<HoldingData>>([]);
  const { api } = useExoticContext();
  const { tokenBalances } = useWalletContext();

  console.log("api", api, "token", tokenBalances);

  const getHoldings = useCallback(async (): Promise<void> => {
    if (!api) {
      return;
    }

    const mintAmounts = tokenBalances.map(
      (t: SplTokenBalance): MintAmount => ({
        Mint: t.account.mint.toBase58(),
        Amount: t.amount.toNumber() * Math.pow(10, t.token.decimals),
      })
    );

    if (mintAmounts.length === 0) {
      return;
    }

    const res = await api.getAllHoldingData(mintAmounts);
    if (res.success && res.result) {
      setHoldings(res.result);
    }
  }, [api, tokenBalances]);

  useEffect(() => {
    getHoldings();
  }, [getHoldings]);

  return (
    <React.Fragment>
      <h3>Positions</h3>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Holding Public Key</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Order Type</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holdings?.flatMap((h: HoldingData) =>
              h.positions.map((p: Position) => (
                <TableRow key={p.HoldingPubkey}>
                  <TableCell>{p.HoldingPubkey}</TableCell>
                  <TableCell>{p.Direction}</TableCell>
                  <TableCell>
                    {(() => {
                      if (typeof p.OrderType == "object" && "LimitOrder" in p.OrderType) {
                        return `LimitOrder: ${p.OrderType["LimitOrder"]}`;
                      } else if (typeof p.OrderType == "string") {
                        return p.OrderType;
                      } else {
                        return "";
                      }
                    })()}
                  </TableCell>
                  <TableCell>{p.Amount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default Positions;
