import React from "react";
import WalletSelector from "../../components/WalletSelector";
import WalletBalances from "../../components/WalletBalances";
import Positions from "../../components/Positions";
import EnvironmentSelector from "../../components/EnvironmentSelector";
import ExoticContextProvider from "../../context/ExoticContext";
import SolanaContextProvider from "../../context/SolanaContext";
import WalletContextProvider from "../../context/WalletContext";
import "./style.css";

const MainPage = () => {
  return (
    <div>
      <ExoticContextProvider>
        <SolanaContextProvider>
          <WalletContextProvider>
            <WalletSelector />
            <EnvironmentSelector />
            <WalletBalances />
            <Positions />
          </WalletContextProvider>
        </SolanaContextProvider>
      </ExoticContextProvider>
    </div>
  );
};

export default MainPage;
