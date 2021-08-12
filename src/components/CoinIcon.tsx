import React from "react";
import { useTokenMap } from "../utils/TokenInfo";

export type CoinIconProps = {
  token: string;
};
const CoinIcon: React.FC<CoinIconProps> = ({ token }) => {
  const tokenMap = useTokenMap();

  const resource = tokenMap.get(token);
  if (!resource || !resource.logoURI || !resource.name) return null;

  console.log("name", resource.name, resource);
  return (
    <>
      <span>{resource.name}</span>
      <img src={resource.logoURI} />
    </>
  );
};

export default CoinIcon;
