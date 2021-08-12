import React from "react";
import { Route } from "react-router-dom";

import MyPositionPage from "../pages/MyPositionPage";
import { NavLink } from "react-router-dom";
import InvestPage from "../pages/InvestPage";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import WalletSelector from "./WalletSelector";
import EnvironmentSelector from "./EnvironmentSelector";
import WalletBalances from "./WalletBalances";
import Logo from "./../assets/images/logo.svg";

import "../style/style.css";

function DefaultContainer() {
  return (
    <div>
      <ul
        id="menu-bar"
        style={{
          listStyleType: "none",
          margin: 0,
          padding: 0,
          overflow: "hidden",
          backgroundColor: "#30444E",
        }}
      >
        <li style={{ float: "left", padding: "10px" }}>
          <img src={Logo} alt="Logo" style={{ width: "94px", height: "25px", color: "white" }}></img>
        </li>
        <li style={{ float: "left" }}>
          <NavLink
            to="/page/position"
            style={{
              display: "block",
              color: "white",
              textAlign: "center",
              padding: "16px",
              textDecoration: "none",
            }}
          >
            My Positions
          </NavLink>
        </li>
        <li className="dropdown" style={{ float: "right", marginTop: "14px", marginRight: "10px" }}>
          <MoreHorizIcon color="secondary" className="dropdown-btn" />
          <div className="dropdown-content">
            <WalletBalances />
          </div>
        </li>
        <li style={{ float: "right", marginTop: "7px", marginRight: "30px" }}>
          <WalletSelector />
        </li>
        <li style={{ float: "right", marginTop: "7px", marginRight: "30px" }}>
          <EnvironmentSelector />
        </li>
      </ul>
      <div>
        <Route path="/page/position" component={MyPositionPage}></Route>
        <Route path="/page/invest" component={InvestPage}></Route>
        {/* <Route path="/main" component={MainPage}/> */}
      </div>
    </div>
  );
}

export default DefaultContainer;
