import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Environment, useSolanaContext } from "../context/SolanaContext";
import { useWalletContext } from "../context/WalletContext";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { SplTokenBalance } from "../utils/types";
import { PublicKey } from "@solana/web3.js";
import { Token } from "@orca-so/spl-token";
import { TokenInfo, TokenListProvider } from "@solana/spl-token-registry";
import { Avatar } from "@material-ui/core";

const LAMPORTS: number = 0.000000001;

const TOKEN_PROGRAM_ENV_MAP: Record<Environment, PublicKey> = {
  [Environment.DEVNET]: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
  [Environment.TESTNET]: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
  [Environment.MAINNET]: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
};

const WRAPPED_SOL_ADDRESS = new PublicKey("So11111111111111111111111111111111111111112");

const WalletBalances = () => {
  const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
  const solanaContext = useSolanaContext();
  const { publicKey, solBalance, setSolBalance, tokenBalances, setTokenBalances, rpcConnection } = useWalletContext();

  useEffect(() => {
    const getTokenList = async (): Promise<void> => {
      const tokenListProvider = new TokenListProvider();
      const tokens = tokenListProvider.resolve();
      const tokenList = (await tokens).filterByClusterSlug("mainnet-beta").getList();
      const tokenMap = new Map(tokenList.map((t: TokenInfo) => [t.address, t]));
      setTokenMap(tokenMap);
    };

    getTokenList();
  }, []);

  const getSolBalance = useCallback(async (): Promise<void> => {
    if (publicKey) {
      const result = await rpcConnection.getBalance(publicKey);
      if (result) {
        setSolBalance(result);
      }
    } else {
      setSolBalance(0);
    }
  }, [setSolBalance, publicKey, rpcConnection]);

  const getTokenBalances = useCallback(async (): Promise<void> => {
    if (publicKey) {
      const programId = TOKEN_PROGRAM_ENV_MAP[solanaContext.environment];
      if (!programId) {
        return;
      }

      const req = { programId: programId };
      const result = await rpcConnection.getTokenAccountsByOwner(publicKey, req);
      if (!result) {
        return;
      }

      const balances: Array<SplTokenBalance> = result.value
        .map(({ pubkey, account }) => ({
          pubkey,
          account: Token.decodeAccountInfo(account),
        }))
        .map((r) => {
          const pubkey = r.pubkey;
          const account = r.account;
          const token = ((): TokenInfo => {
            const t = tokenMap.get(account.mint.toBase58());
            if (!t) {
              const tokenInfo: TokenInfo = {
                chainId: -1,
                address: "",
                name: account.mint.toBase58(),
                decimals: 0,
                symbol: "",
              };

              return tokenInfo;
            } else {
              return t;
            }
          })();

          const balance: SplTokenBalance = {
            token: token,
            pubkey: pubkey,
            account: account,
            amount: account.amount,
          };

          return balance;
        });

      setTokenBalances(balances);
    } else {
      setTokenBalances([]);
    }
  }, [tokenMap, publicKey, rpcConnection, solanaContext.environment, setTokenBalances]);

  useEffect(() => {
    getSolBalance();
  }, [getSolBalance]);

  useEffect(() => {
    getTokenBalances();
  }, [getTokenBalances]);

  return (
    <React.Fragment>
      <h3>Balances</h3>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell>Public Key</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={"SOL"}>
              <TableCell>
                <Avatar src={tokenMap.get(WRAPPED_SOL_ADDRESS.toBase58())?.logoURI} />
                Solana (SOL)
              </TableCell>
              <TableCell>{publicKey?.toBase58()}</TableCell>
              <TableCell>{solBalance * LAMPORTS}</TableCell>
            </TableRow>
            {tokenBalances.map((t) => (
              <TableRow key={t.pubkey.toBase58()}>
                <TableCell>
                  <Avatar src={t.token.logoURI} />
                  {t.token.name} ({t.token.symbol})
                </TableCell>
                <TableCell>{t.pubkey.toBase58()}</TableCell>
                <TableCell>{t.amount.toNumber() / Math.pow(10, t.token.decimals)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default WalletBalances;
