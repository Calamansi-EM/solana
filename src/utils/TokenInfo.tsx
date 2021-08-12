import React, { useContext, useEffect, useState } from "react";
import { TokenListProvider, TokenInfo } from "@solana/spl-token-registry";
//'devnet'
const initialState = new Map();
const TokenMapContext = React.createContext<Map<string, TokenInfo>>(initialState);

export const TokenMapProvider: React.FC<{ slug: string }> = ({ slug, children }) => {
  const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(initialState);

  useEffect(() => {
    new TokenListProvider().resolve().then((tokens) => {
      const tokenList = tokens.filterByClusterSlug(slug).getList();
      console.log("tokenlist", tokenList);
      setTokenMap(
        tokenList.reduce((map, item) => {
          map.set(item.address, item);
          return map;
        }, new Map())
      );
    });
  }, [slug]);

  return <TokenMapContext.Provider value={tokenMap}>{children}</TokenMapContext.Provider>;
};

export const useTokenMap = () => {
  return useContext(TokenMapContext);
};
