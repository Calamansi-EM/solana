import React, { useState } from "react";
import { useSolanaContext, Environment } from "../context/SolanaContext";
import { Menu, MenuItem, Button } from "@material-ui/core";
import { useWalletContext } from "../context/WalletContext";

const EnvironmentSelector = () => {
  const [envSelectorAnchor, setEnvSelectorAnchor] = useState(null);
  const solanaContext = useSolanaContext();
  const walletContext = useWalletContext();

  const openEnvSelector = (event: any): void => {
    setEnvSelectorAnchor(event.currentTarget);
  };

  const closeEnvSelector = (): void => setEnvSelectorAnchor(null);

  const handleEnvSelect = async (env: Environment): Promise<void> => {
    await walletContext.disconnect();
    solanaContext.setEnvironment(env);
    closeEnvSelector();
  };

  return (
    <React.Fragment>
      <Button className="env-btn" color="secondary" onClick={openEnvSelector}>
        Env: {solanaContext.environment}
      </Button>
      <Menu anchorEl={envSelectorAnchor} keepMounted open={Boolean(envSelectorAnchor)} onClose={closeEnvSelector}>
        <MenuItem onClick={() => handleEnvSelect(Environment.DEVNET)}>devnet</MenuItem>
        <MenuItem onClick={() => handleEnvSelect(Environment.TESTNET)}>testnet</MenuItem>
        <MenuItem onClick={() => handleEnvSelect(Environment.MAINNET)}>mainnet</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default EnvironmentSelector;
