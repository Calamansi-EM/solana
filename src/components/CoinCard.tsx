import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import { Grid } from "@material-ui/core";

import NoOrderIcon from "../assets/images/no-order-icon.png";

import { useTokenMap } from "../utils/TokenInfo";
import { convertMintToRealOnes } from "../utils/MappingFakeMint";
import { useState } from "react";

const useStyles = makeStyles(() => ({
  card: {
    // maxWidth: 345,
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 30,
    paddingBottom: 20,
    borderRadius: "20px",
    backgroundColor: "white",
  },
  cardPosition: {
    maxWidth: 345,
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 30,
    paddingBottom: 20,
    borderRadius: "20px",
    backgroundColor: "#30444E",
  },
  cardContent: {
    backgroundColor: "#EDF1FA",
    borderRadius: "20px",
    marginTop: "30px",
  },
  cardBtn: {
    marginTop: "30px",
    borderRadius: "10px",
    width: "100%",
    backgroundColor: "#40DF9F",
  },
  coinIcon: {
    width: "25px",
    height: "25px",
    paddingLeft: "2px",
    paddingRight: "2px",
  },
  cancelBtn: {
    marginTop: "30px",
    borderRadius: "10px",
    width: "100%",
    text: "#FF575F",
    backgroundColor: "#623A42",
  },
}));

function ConvertUnixTime(secs: any) {
  let unix_timestamp = secs / 1000;

  const day = Math.floor(unix_timestamp / 24 / 60 / 60);
  const hour = Math.floor((unix_timestamp % (24 * 60 * 60)) / 60 / 60);
  const minute = Math.floor((unix_timestamp % (60 * 60)) / 60);

  var formattedTime = day + "d " + hour + "h " + minute + "m";

  if (day === 0) {
    let second = Math.floor(unix_timestamp % 60);
    formattedTime = hour + "h " + minute + "m " + second + "s";
  }

  return formattedTime;
}

function ConvertMaturity(seconds: any) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d === 1 ? "d " : "d ") : "";
  var hDisplay = h > 0 ? h + (h === 1 ? "h " : "h ") : "";
  var mDisplay = m > 0 ? m + (m === 1 ? "m " : "m ") : "";
  var sDisplay = s > 0 ? s + (s === 1 ? "s" : "s") : "";

  return dDisplay + hDisplay + mDisplay + sDisplay;
}

const CoinCard: React.FC<{ data: any; showDetail?: (data: any) => void; detail: boolean; closeDetail?: () => void }> =
  ({ data, detail, showDetail, closeDetail }) => {
    const classes = useStyles();

    const [positions, setPositions] = useState<any | undefined>([]);

    type cardInterface = {
      productType: string | string[];
      baseTokenInfo: any;
      quoteTokenInfo: any;
      equilibriumPrice: Number;
      auctionCountDown: string | string[];
      maturity: Number;
      apr: Number;
      apy: Number;
      minSizeBuy: Number;
      minSizeSell: Number;
      lowerBarrier: Number;
      upperBarrier: Number;
      strikeLevel: Number;
    };
    const [cardData, setCardData] = useState<cardInterface>({
      productType: "",
      baseTokenInfo: {},
      quoteTokenInfo: {},
      equilibriumPrice: 0,
      auctionCountDown: "",
      maturity: 0,
      apr: 0,
      apy: 0,
      minSizeBuy: 0,
      minSizeSell: 0,
      lowerBarrier: 0,
      upperBarrier: 0,
      strikeLevel: 0,
    });

    const [countDown, setCountDown] = useState<any | undefined>(undefined);

    const tokenMap = useTokenMap();

    useEffect(() => {
      setPositions(data["positions"]);

      const whichProduct: string | string[] = Object.keys(data["product"]);

      let temp: cardInterface = {
        productType: "",
        baseTokenInfo: {},
        quoteTokenInfo: {},
        equilibriumPrice: 0,
        auctionCountDown: "0d 0h 0m",
        maturity: 0,
        apr: 0,
        apy: 0,
        minSizeBuy: 0,
        minSizeSell: 0,
        lowerBarrier: 0,
        upperBarrier: 0,
        strikeLevel: 0,
      };

      temp.productType = whichProduct[0];
      temp.baseTokenInfo = tokenMap.get(
        convertMintToRealOnes(data["product"][whichProduct[0]]["ProductCommon"]["BaseToken"])
      );
      temp.quoteTokenInfo = tokenMap.get(
        convertMintToRealOnes(data["product"][whichProduct[0]]["ProductCommon"]["QuoteToken"])
      );
      temp.equilibriumPrice = data["holding"]["EquilibriumPrice"] / 10000000;

      const endTime = data["holding"]["EndTime"];
      let currentUnixTime: any = Date.now().valueOf();
      let auctionTime = ConvertUnixTime(endTime - currentUnixTime);
      temp.auctionCountDown = auctionTime;

      if (countDown !== undefined) {
        clearInterval(countDown);
      }
      let timerId = setInterval(() => {
        let currentUnixTime: any = Date.now().valueOf();
        auctionTime = ConvertUnixTime(endTime - currentUnixTime);
        setCardData((cardData) => {
          return {
            ...cardData,
            auctionCountDown: auctionTime,
          };
        });
      }, 5000);
      setCountDown(timerId);

      temp.maturity = data["product"][whichProduct[0]]["ProductCommon"]["Maturity"];

      const depositMintBuyDecimals = data["holding"]["DepositMintBuyDecimals"];
      const depositMintSellDecimals = data["holding"]["DepositMintSellDecimals"];
      temp.minSizeBuy = data["holding"]["MinAmountBuy"] / Math.pow(10, depositMintBuyDecimals);
      temp.minSizeSell = data["holding"]["MinAmountSell"] / Math.pow(10, depositMintSellDecimals);

      if (whichProduct[0] === "DoubleDigital") {
        temp.lowerBarrier = data["product"][whichProduct[0]]["LowerBarrier"] / 10000000;
        temp.upperBarrier = data["product"][whichProduct[0]]["UpperBarrier"] / 10000000;
      }

      if (whichProduct[0] === "CallOverride") {
        temp.strikeLevel = data["product"][whichProduct[0]]["StrikeLevel"] / 10000000;
      }

      setCardData(temp);
    }, [data]);

    const handleTrade = () => {
      if (showDetail) showDetail(data);
    };

    const handleCloseDetail: any = () => {
      if (closeDetail) closeDetail();
    };
    // if (!sourceInfo || !destInfo) return null;

    return positions.length === 0 ? (
      <Card className={classes.card}>
        <CardActionArea>
          <span
            className={`which-product ${cardData.productType === "CallOverride" ? "call-product" : "digital-product"}`}
          >
            {cardData.productType}
          </span>
          <Box m={4}>
            <Typography variant="h4" component="h3" style={{ color: "blue", whiteSpace: "nowrap" }}>
              <img className={classes.coinIcon} src={cardData.baseTokenInfo.logoURI} alt=""></img>
              <span>
                <b>
                  <Tooltip title={cardData.baseTokenInfo.address}>
                    <span>{cardData.baseTokenInfo.symbol}</span>
                  </Tooltip>
                  /
                  <Tooltip title={cardData.quoteTokenInfo.address}>
                    <span>{cardData.quoteTokenInfo.symbol}</span>
                  </Tooltip>
                </b>
              </span>
              <img className={classes.coinIcon} src={cardData.quoteTokenInfo.logoURI} alt=""></img>
            </Typography>
          </Box>
          <Grid container>
            <Grid xs={6} item={true}>
              <Typography variant="h5" component="h2">
                <b>{cardData.equilibriumPrice}%</b>
              </Typography>
              <Typography variant="body2" component="p">
                Equilibrium Price
              </Typography>
            </Grid>
            <Grid xs={6} item={true}>
              <Typography variant="h5" component="h2">
                <b>{cardData.auctionCountDown}</b>
              </Typography>
              <Typography variant="body2" component="p">
                auction countdown
              </Typography>
            </Grid>
          </Grid>
        </CardActionArea>
        <CardContent className={classes.cardContent}>
          <Typography variant="h5" color="primary" component="h2" style={{ color: "blue" }}>
            Global
          </Typography>
          <Grid container>
            <Grid xs={6} item={true} style={{ marginTop: "10px" }}>
              <Typography variant="h5" component="h2">
                {ConvertMaturity(cardData.maturity)}
              </Typography>
              <Typography variant="body2" component="p">
                Maturity
              </Typography>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                <Typography variant="h5" component="h2">
                  {cardData.minSizeBuy}
                </Typography>
                <img
                  className={classes.coinIcon}
                  src={cardData.baseTokenInfo.logoURI}
                  alt=""
                  style={{ marginTop: "-3px", marginLeft: "3px" }}
                ></img>
              </div>
              <Typography variant="body2" component="p" style={{ color: "#286053" }}>
                BUY Min. size
              </Typography>
            </Grid>
            <Grid xs={6} item={true} style={{ marginTop: "10px" }}>
              <Typography variant="h5" component="h2">
                {cardData.apr}% - {cardData.apy}%
              </Typography>
              <Typography variant="body2" component="p">
                APR - APY
              </Typography>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                <Typography variant="h5" component="h2">
                  {cardData.minSizeSell}
                </Typography>
                <img className={classes.coinIcon} src={cardData.quoteTokenInfo.logoURI} alt=""></img>
              </div>
              <Typography variant="body2" component="p" style={{ color: "#623A42" }}>
                SELL Min. size
              </Typography>
            </Grid>
          </Grid>
          <Box m={2}>
            <Typography variant="h5" color="primary" component="h2" style={{ color: "blue" }}>
              Specific
            </Typography>
          </Box>
          {cardData.productType === "CallOverride" ? (
            <Grid container>
              <Grid xs={12} item={true}>
                <Typography variant="h5" component="h2">
                  {cardData.strikeLevel}%
                </Typography>
                <Typography variant="body2" component="p">
                  Strike Level
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container>
              <Grid xs={6} item={true}>
                <Typography variant="h5" component="h2">
                  {cardData.lowerBarrier}%
                </Typography>
                <Typography variant="body2" component="p">
                  Lower Barrier
                </Typography>
              </Grid>
              <Grid xs={6} item={true}>
                <Typography variant="h5" component="h2">
                  {cardData.upperBarrier}%
                </Typography>
                <Typography variant="body2" component="p">
                  Upper Barrier
                </Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>
        {!detail ? (
          <Button size="large" variant="contained" color="primary" className={classes.cardBtn} onClick={handleTrade}>
            Trade
            <ArrowForwardIcon fontSize="default" />
          </Button>
        ) : (
          <>
            <CardContent className={classes.cardContent}>
              <Typography variant="h5" color="primary" component="h2" style={{ color: "blue" }}>
                My Positions
              </Typography>
              <Grid container>
                <Grid xs={6} item={true}>
                  <Typography variant="h6" component="h4">
                    BUY
                  </Typography>
                  <Grid container>
                    <Grid xs={6} item={true}>
                      <div style={{ width: "50%" }}>
                        <p>Amount</p>
                      </div>
                    </Grid>
                    <Grid xs={6} item={true}>
                      <div style={{ width: "50%" }}>
                        <p>Price</p>
                      </div>
                    </Grid>
                  </Grid>

                  <hr />
                </Grid>
                <Grid xs={6} item={true}>
                  <Typography variant="h6" component="h4">
                    SELL
                  </Typography>
                  <Grid container>
                    <Grid xs={6} item={true}>
                      <div style={{ width: "50%" }}>
                        <p>Amount</p>
                      </div>
                    </Grid>
                    <Grid xs={6} item={true}>
                      <div style={{ width: "50%" }}>
                        <p>Price</p>
                      </div>
                    </Grid>
                  </Grid>
                  <hr />
                </Grid>
              </Grid>
              <div>
                <img src={NoOrderIcon} alt="icon" style={{ width: "25px", height: "25px" }}></img>
                <p>You don't have orders yet....</p>
                <p>Create one now.</p>
              </div>
            </CardContent>

            <Button
              size="large"
              variant="contained"
              color="primary"
              className={classes.cancelBtn}
              onClick={handleCloseDetail}
            >
              Cancel New Order
              <ArrowForwardIcon fontSize="default" />
            </Button>
          </>
        )}
      </Card>
    ) : (
      <Card className={classes.cardPosition}>
        <CardActionArea>
          <span
            className={`which-product ${cardData.productType === "CallOverride" ? "call-product" : "digital-product"}`}
          >
            {cardData.productType}
          </span>
          <Box m={4}>
            <Typography variant="h4" component="h3" style={{ color: "white", whiteSpace: "nowrap" }}>
              <img className={classes.coinIcon} src={cardData.baseTokenInfo.logoURI} alt=""></img>
              <span>
                <b>
                  <Tooltip title={cardData.baseTokenInfo.address}>
                    <span>{cardData.baseTokenInfo.symbol}</span>
                  </Tooltip>
                  /
                  <Tooltip title={cardData.quoteTokenInfo.address}>
                    <span>{cardData.quoteTokenInfo.symbol}</span>
                  </Tooltip>
                </b>
              </span>
              <img className={classes.coinIcon} src={cardData.quoteTokenInfo.logoURI} alt=""></img>
            </Typography>
          </Box>
          <Grid container>
            <Grid xs={6} item={true}>
              <Typography variant="h5" component="h2" style={{ color: "white" }}>
                <b>{cardData.equilibriumPrice}%</b>
              </Typography>
              <Typography variant="body2" component="p" style={{ color: "white" }}>
                Equilibrium Price
              </Typography>
            </Grid>
            <Grid xs={6} item={true}>
              <Typography variant="h5" component="h2" style={{ color: "white" }}>
                <b>{cardData.auctionCountDown}</b>
              </Typography>
              <Typography variant="body2" component="p" style={{ color: "white" }}>
                auction countdown
              </Typography>
            </Grid>
          </Grid>
        </CardActionArea>
        <CardContent className={classes.cardContent}>
          <Typography variant="h5" color="primary" component="h2" style={{ color: "blue" }}>
            Global
          </Typography>
          <Grid container>
            <Grid xs={6} item={true} style={{ marginTop: "10px" }}>
              <Typography variant="h5" component="h2">
                {ConvertMaturity(cardData.maturity)}
              </Typography>
              <Typography variant="body2" component="p">
                Maturity
              </Typography>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                <Typography variant="h5" component="h2">
                  {cardData.minSizeBuy}
                </Typography>
                <img
                  className={classes.coinIcon}
                  src={cardData.baseTokenInfo.logoURI}
                  alt=""
                  style={{ marginTop: "-3px", marginLeft: "3px" }}
                ></img>
              </div>
              <Typography variant="body2" component="p" style={{ color: "#286053" }}>
                BUY Min. size
              </Typography>
            </Grid>
            <Grid xs={6} item={true} style={{ marginTop: "10px" }}>
              <Typography variant="h5" component="h2">
                {cardData.apr}% - {cardData.apy}%
              </Typography>
              <Typography variant="body2" component="p">
                APR - APY
              </Typography>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                <Typography variant="h5" component="h2">
                  {cardData.minSizeSell}
                </Typography>
                <img className={classes.coinIcon} src={cardData.quoteTokenInfo.logoURI} alt=""></img>
              </div>
              <Typography variant="body2" component="p" style={{ color: "#623A42" }}>
                SELL Min. size
              </Typography>
            </Grid>
          </Grid>
          <Box m={2}>
            <Typography variant="h5" color="primary" component="h2" style={{ color: "blue" }}>
              Specific
            </Typography>
          </Box>
          {cardData.productType === "CallOverride" ? (
            <Grid container>
              <Grid xs={12} item={true}>
                <Typography variant="h5" component="h2">
                  {cardData.strikeLevel}%
                </Typography>
                <Typography variant="body2" component="p">
                  Strike Level
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container>
              <Grid xs={6} item={true}>
                <Typography variant="h5" component="h2">
                  {cardData.lowerBarrier}%
                </Typography>
                <Typography variant="body2" component="p">
                  Lower Barrier
                </Typography>
              </Grid>
              <Grid xs={6} item={true}>
                <Typography variant="h5" component="h2">
                  {cardData.upperBarrier}%
                </Typography>
                <Typography variant="body2" component="p">
                  Upper Barrier
                </Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>

        <CardContent className={classes.cardContent}>
          <Typography variant="h5" color="primary" component="h2" style={{ color: "blue" }}>
            My Positions
          </Typography>
          <Grid container>
            <Grid xs={6} item={true}>
              <Typography variant="h6" component="h4">
                BUY
              </Typography>
              <Grid container>
                <Grid xs={6} item={true}>
                  <div style={{ width: "50%" }}>
                    <p>Amount</p>
                  </div>
                </Grid>
                <Grid xs={6} item={true}>
                  <div style={{ width: "50%" }}>
                    <p>Price</p>
                  </div>
                </Grid>
              </Grid>
              <hr />
              {positions.map((element: any, index: number) => {
                return element.Direction == "Buy" ? (
                  <Grid container key={index}>
                    <Grid xs={6} item={true}>
                      <div style={{ width: "50%" }}>
                        <p>{element.Amount}</p>
                      </div>
                    </Grid>
                    <Grid xs={6} item={true}>
                      <div style={{ width: "50%" }}>
                        {element.OrderType.includes("Market") ? <p>Market</p> : <p>Limit</p>}
                      </div>
                    </Grid>
                  </Grid>
                ) : (
                  <></>
                );
              })}
            </Grid>
            <Grid xs={6} item={true}>
              <Typography variant="h6" component="h4">
                SELL
              </Typography>
              <Grid container>
                <Grid xs={6} item={true}>
                  <div style={{ width: "50%" }}>
                    <p>Amount</p>
                  </div>
                </Grid>
                <Grid xs={6} item={true}>
                  <div style={{ width: "50%" }}>
                    <p>Price</p>
                  </div>
                </Grid>
              </Grid>
              <hr />
              {positions.map((element: any, index: number) => {
                return element.Direction === "Sell" ? (
                  <Grid container>
                    <Grid xs={6} item={true}>
                      <div style={{ width: "50%" }}>
                        <p>{element.Amount}</p>
                      </div>
                    </Grid>
                    <Grid xs={6} item={true}>
                      <div style={{ width: "50%" }}>
                        {element.OrderType.includes("Market") ? <p>Market</p> : <p>Limit</p>}
                      </div>
                    </Grid>
                  </Grid>
                ) : (
                  <></>
                );
              })}
            </Grid>
          </Grid>
        </CardContent>
        {!detail ? (
          <Button size="large" variant="contained" color="primary" className={classes.cardBtn} onClick={handleTrade}>
            Trade
            <ArrowForwardIcon fontSize="default" />
          </Button>
        ) : (
          <Button size="large" variant="contained" className={classes.cancelBtn} onClick={handleCloseDetail}>
            Cancel New Order
            <ArrowForwardIcon fontSize="default" />
          </Button>
        )}
      </Card>
    );
  };

export default CoinCard;
