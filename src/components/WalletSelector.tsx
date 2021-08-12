import React, { useState } from "react";
import {
  Button,
  Dialog,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogTitle,
  Avatar,
  Menu,
  MenuItem,
} from "@material-ui/core";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { useWalletContext } from "../context/WalletContext";
import { openInNewTab } from "../utils/utils";
import { WalletProvider } from "../utils/types";

const SOLANA_EXPLORER_URL = "https://explorer.solana.com";

const WalletSelector = () => {
  const [isWalletSelectorVisible, setIsWalletSelectorVisible] = useState<boolean>(false);
  const [walletMenuAnchor, setWalletMenuAnchor] = useState(null);
  const walletContext = useWalletContext();

  const openWalletSelector = (): void => setIsWalletSelectorVisible(true);
  const closeWalletSelector = (): void => setIsWalletSelectorVisible(false);

  const handleWalletSelect = (provider: WalletProvider): void => {
    walletContext.select(provider);
    closeWalletSelector();
  };

  const openWalletMenu = (event: any): void => {
    setWalletMenuAnchor(event.currentTarget);
  };

  const closeWalletMenu = (): void => setWalletMenuAnchor(null);

  const disconnectWallet = async (): Promise<void> => {
    await walletContext.disconnect();
    walletContext.select(undefined);
    closeWalletMenu();
  };

  const openSolanaExplorer = (): void => {
    const publicKey = walletContext.wallet?.getPublicKey()?.toString();
    const url = `${SOLANA_EXPLORER_URL}/account/${publicKey}`;
    openInNewTab(url);
  };

  return (
    <React.Fragment>
      {!walletContext.wallet?.isConnected() ? (
        <Button color="primary" className="connect-btn" onClick={openWalletSelector}>
          Connect Wallet
          <AccountBalanceWalletIcon fontSize="default" />
        </Button>
      ) : (
        <Button className="connect-btn" color="secondary" onClick={openWalletMenu}>
          Connected
        </Button>
      )}
      <Dialog open={isWalletSelectorVisible} onClose={closeWalletSelector}>
        <DialogTitle>Select Wallet</DialogTitle>
        <List>
          {walletContext.providers.map((provider: WalletProvider) => (
            <ListItem button onClick={() => handleWalletSelect(provider)} key={provider.name}>
              <ListItemAvatar>
                <Avatar alt={provider.name} src={provider.icon} />
              </ListItemAvatar>
              <ListItemText primary={provider.name} />
            </ListItem>
          ))}
        </List>
        <Button variant="outlined" color="secondary" onClick={closeWalletSelector}>
          Close
        </Button>
      </Dialog>
      <Menu anchorEl={walletMenuAnchor} keepMounted open={Boolean(walletMenuAnchor)} onClose={closeWalletMenu}>
        <MenuItem onClick={disconnectWallet}>Disconnect</MenuItem>
        <MenuItem onClick={openSolanaExplorer}>View on Solana Explorer</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default WalletSelector;
