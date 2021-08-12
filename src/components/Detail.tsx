import React, { useState, useEffect } from "react";
import { createStyles, makeStyles, withStyles, Theme } from "@material-ui/core/styles";

import ChartContainer from "./ChartContainer";

import { useWalletContext } from "../context/WalletContext";
import { placeOrder, PlaceOrderHoldingData } from "../utils/placeOrder";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Direction } from "../utils/layout";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CloseIcon from "@material-ui/icons/Close";
import { Grid } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";

import CoinCard from "./CoinCard";
import CustomTabs from "./Customtabs";
import PopupAlert from "./PopupAlert";

import { useTokenMap } from "../utils/TokenInfo";
import { convertMintToRealOnes } from "../utils/MappingFakeMint";

import "../style/style.css";

const LAMPORTS: number = 0.000000001;

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      marginRight: 3,
      borderRadius: 4,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px 26px 10px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  })
)(InputBase);

const useStyles = makeStyles({
  root: {
    width: "100%",
    position: "relative",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 10,
    paddingBottom: 20,
    margin: "auto",
  },
  orderBtn: {
    marginTop: "30px",
    borderRadius: "10px",
    backgroundColor: "#40DF9F",
  },
  formControl1: {
    width: "100px",
  },
  formControl2: {
    width: "150px",
  },
});

const CustomSlider = withStyles({
  root: {
    color: "#0062FF",
    height: 10,
    marginTop: 30,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -6,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 12,
    borderRadius: 4,
  },
  rail: {
    height: 12,
    borderRadius: 4,
  },
})(Slider);

/*
  Market Size bar 
  Accept sellVal and buyVal parameters
*/
const ColoredLine = (val: any) => {
  const percentageVal = (parseInt(val.buyVal) / (parseInt(val.sellVal) + parseInt(val.buyVal))) * 100;
  console.log("val", val);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="market-size-text-buy">
          <p>BUY</p>
          <img
            src={val.baseTokenInfo.logoURI}
            alt=""
            style={{ width: "25px", height: "25px", marginTop: "20px", marginLeft: "5px" }}
          ></img>
        </div>
        <div className="market-size-text-sell">
          <p>SELL</p>
          <img
            src={val.quoteTokenInfo.logoURI}
            alt=""
            style={{ width: "25px", height: "25px", marginTop: "20px", marginLeft: "5px" }}
          ></img>
        </div>
      </div>
      <div
        id="myProgress"
        style={{
          width: "80%",
          backgroundColor: "red",
        }}
      >
        <div
          id="myBar"
          style={{
            width: percentageVal + "%",
            height: "20px",
            backgroundColor: "#04AA6D",
          }}
        ></div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="market-size-text-buy">
          <p>{val.buyVal}</p>
          <span style={{ marginTop: "20px", marginLeft: "5px" }}>{val.baseTokenInfo.symbol}</span>
        </div>
        <div className="market-size-text-sell">
          <p>{val.sellVal}</p>
          <span style={{ marginTop: "20px", marginLeft: "5px" }}>{val.quoteTokenInfo.symbol}</span>
        </div>
      </div>
    </>
  );
};

// let marks = [
//   {
//     value: 0,
//     label: "0%",
//   },
//   {
//     value: 25,
//     label: "25%",
//   },
// ];

export type DetailProps = {
  data: any;
  onClose: () => void;
  updateData: () => void;
};

const Detail: React.FC<DetailProps> = ({ data, onClose, updateData }) => {
  const classes = useStyles();
  const { publicKey, solBalance, setSolBalance, tokenBalances, rpcConnection, wallet } = useWalletContext();

  // const [details, setDetails] = useState<any>({
  //   marks: true,
  //   sizeBuy: 2,
  // });
  // setDetails({ ...details, marks: false });

  type detailInterface = {
    baseTokenInfo: any;
    quoteTokenInfo: any;

    marks: any;
    tab: string;
    aloPossible: boolean;
    pubkey: string;
    holdingPubkey: string;
    depositTokenAccountBuy: string;
    depositTokenAccountSell: string;
    positionMintMoBuy: string | null;
    positionMintMoSell: string | null;
    depositTokenMintBuy: string;
    depositTokenMintSell: string;
    depositMintBuy: string;
    depositMintSell: string;
    depositMintBuyDecimals: number;
    depositMintSellDecimals: number;

    limitOrderPositionBuy: [];
    limitOrderPositionSell: [];
    limitPriceMint: [];
    limitPriceData: number[];
    limitAtPrice: number;

    sizeBuyAMO: number;
    sizeSellAMO: number;

    marketBuySell: string;
    limitBuySell: string;

    marketAmount: number;
    limitAmount: number;
    minAmount: number;

    popupShow: Boolean;
    popupContent: string;
  };
  const [detailData, setDetailData] = useState<detailInterface>({
    baseTokenInfo: {},
    quoteTokenInfo: {},

    marks: [
      {
        value: 0,
        label: "0%",
      },
      {
        value: 25,
        label: "25%",
      },
    ],
    tab: "market",
    pubkey: "",
    holdingPubkey: "",
    depositTokenAccountBuy: "",
    depositTokenAccountSell: "",
    positionMintMoBuy: "",
    positionMintMoSell: "",
    depositTokenMintBuy: "",
    depositTokenMintSell: "",
    depositMintBuy: "",
    depositMintSell: "",
    depositMintBuyDecimals: 0,
    depositMintSellDecimals: 0,
    aloPossible: true,

    limitOrderPositionBuy: [], // chart data
    limitOrderPositionSell: [],
    limitPriceMint: [],
    limitPriceData: [],
    limitAtPrice: 0,

    sizeBuyAMO: 0, // color line data
    sizeSellAMO: 0,

    marketBuySell: "buy",
    limitBuySell: "buy",

    marketAmount: 0,
    limitAmount: 0,
    minAmount: 0,

    popupShow: false,
    popupContent: "No Content",
  });

  // popup alert
  const [popupShow, setPopupShow] = useState<boolean>(false);
  const [popupContent, setPopupContent] = useState<string>("No Content");

  const orderTabLimit = () => {
    return (
      <>
        <FormControl className={classes.formControl1}>
          <InputLabel htmlFor="demo-customized-select-native">I want to</InputLabel>
          <NativeSelect
            inputProps={{
              name: "buy-sell",
              id: "limit-buy-sell",
            }}
            // value={detailData.limitBuySell}
            onChange={handleBuySellChange}
            input={<BootstrapInput />}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </NativeSelect>
        </FormControl>
        <FormControl className={classes.formControl2}>
          <InputLabel shrink htmlFor="bootstrap-input">
            Amount
          </InputLabel>
          <BootstrapInput
            value={detailData.limitAmount}
            onChange={(event) =>
              setDetailData((detailData) => {
                return { ...detailData, limitAmount: parseInt(event.target.value) };
              })
            }
            className="bootstrap-input"
            type="number"
          />
        </FormControl>
        <FormControl className={classes.formControl1}>
          <InputLabel shrink htmlFor="bootstrap-input">
            Currency
          </InputLabel>
          <BootstrapInput
            // value={limitAmount === "buy" ? depositMintBuy : depositMintSell}
            value={detailData.baseTokenInfo.symbol}
            className="bootstrap-input"
          />
        </FormControl>
        <FormControl className={classes.formControl2}>
          <InputLabel shrink htmlFor="bootstrap-input">
            at Price
          </InputLabel>
          <BootstrapInput
            value={detailData.limitAtPrice}
            defaultValue={detailData.marks[0].value}
            className="bootstrap-input"
          />
        </FormControl>
        <div style={{ width: "75%", margin: "auto" }}>
          <CustomSlider
            onChange={handleSliderChange}
            defaultValue={detailData.marks[0].value}
            step={null}
            valueLabelDisplay="auto"
            marks={detailData.marks}
          />
        </div>
        <p>
          I want to set a {detailData.limitBuySell.toLocaleUpperCase()}, limit order for {detailData.limitAmount}{" "}
          {detailData.baseTokenInfo.symbol} at {detailData.limitAtPrice}.
        </p>
      </>
    );
  };

  const orderTabMarket = () => {
    return (
      <>
        <FormControl className={classes.formControl1}>
          <InputLabel htmlFor="demo-customized-select-native">I want to</InputLabel>
          <NativeSelect
            inputProps={{
              name: "buy-sell",
              id: "limit-buy-sell",
            }}
            // value={detailData.marketBuySell}
            onChange={handleBuySellChange}
            input={<BootstrapInput />}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </NativeSelect>
        </FormControl>
        <FormControl className={classes.formControl2}>
          <InputLabel shrink htmlFor="bootstrap-input">
            Amount
          </InputLabel>
          <BootstrapInput
            value={detailData.marketAmount}
            onChange={(event) =>
              setDetailData((detailData) => {
                return { ...detailData, marketAmount: parseInt(event.target.value) };
              })
            }
            className="bootstrap-input"
            type="number"
          />
        </FormControl>
        <FormControl className={classes.formControl1}>
          <InputLabel shrink htmlFor="bootstrap-input">
            Currency
          </InputLabel>
          <BootstrapInput value={detailData.baseTokenInfo.symbol} className="bootstrap-input" />
        </FormControl>
        {/* <FormControl className={classes.formControl2}>
          <InputLabel shrink htmlFor="bootstrap-input">
            at Price
          </InputLabel>
          <BootstrapInput defaultValue={0} className="bootstrap-input" />
        </FormControl> */}
      </>
    );
  };

  const orderTabs = [
    {
      label: "Market Order",
      content: orderTabMarket,
      disable: false,
    },
    {
      label: "Limit Order",
      content: orderTabLimit,
      disable: !detailData.aloPossible,
    },
  ];

  const tokenMap = useTokenMap();

  useEffect(() => {
    let temp: detailInterface = {
      baseTokenInfo: {},
      quoteTokenInfo: {},
      marks: [
        {
          value: 0,
          label: "0%",
        },
        {
          value: 25,
          label: "25%",
        },
      ],
      tab: "market",
      pubkey: "",
      holdingPubkey: "",
      depositTokenAccountBuy: "",
      depositTokenAccountSell: "",
      positionMintMoBuy: "",
      positionMintMoSell: "",
      depositTokenMintBuy: "",
      depositTokenMintSell: "",
      depositMintBuy: "",
      depositMintSell: "",
      depositMintBuyDecimals: 0,
      depositMintSellDecimals: 0,
      aloPossible: true,

      limitOrderPositionBuy: [], // chart data
      limitOrderPositionSell: [],
      limitPriceMint: [],
      limitPriceData: [],
      limitAtPrice: 0,

      sizeBuyAMO: 0, //color line data
      sizeSellAMO: 0,

      marketBuySell: "buy",
      limitBuySell: "buy",

      marketAmount: 0,
      limitAmount: 0,
      minAmount: 0,

      popupShow: false,
      popupContent: "No Content",
    };
    const whichProduct: string | string[] = Object.keys(data["product"]);
    temp.baseTokenInfo = tokenMap.get(
      convertMintToRealOnes(data["product"][whichProduct[0]]["ProductCommon"]["BaseToken"])
    );
    temp.quoteTokenInfo = tokenMap.get(
      convertMintToRealOnes(data["product"][whichProduct[0]]["ProductCommon"]["QuoteToken"])
    );

    temp.depositTokenMintBuy = data["holding"]["DepositTokenMintBuy"];
    temp.depositTokenMintSell = data["holding"]["DepositTokenMintSell"];

    temp.limitOrderPositionBuy = data["holding"]["LimitOrderPositionBuy"];
    temp.limitOrderPositionSell = data["holding"]["LimitOrderPositionSell"];
    temp.limitPriceMint = data["holding"]["LimitPriceMint"];
    const markData = data["holding"]["LimitPriceMint"].map((val: { Price: number }, index: string | number) => ({
      value: Math.floor(val.Price / 10000000),
      label: Math.floor(val.Price / 10000000) + "%",
    }));
    temp.marks = markData;

    const priceData = temp.limitPriceMint.map((val: { Price: number }, index: string | number) =>
      Math.floor(val.Price / 10000000)
    );
    temp.limitPriceData = priceData;

    temp.sizeBuyAMO = data["holding"]["SizeBuyAMO"];
    temp.sizeSellAMO = data["holding"]["SizeSellAMO"];
    temp.depositMintBuyDecimals = data["holding"]["DepositMintBuyDecimals"];
    temp.depositMintSellDecimals = data["holding"]["DepositMintSellDecimals"];

    if (detailData.marketBuySell === "buy") {
      temp.marketAmount = data["holding"]["MinAmountBuy"] / Math.pow(10, data["holding"]["DepositMintBuyDecimals"]);
      temp.minAmount = data["holding"]["MinAmountBuy"] / Math.pow(10, data["holding"]["DepositMintBuyDecimals"]);
    } else {
      temp.marketAmount = data["holding"]["MinAmountSell"] / Math.pow(10, data["holding"]["DepositMintSellDecimals"]);
      temp.minAmount = data["holding"]["MinAmountSell"] / Math.pow(10, data["holding"]["DepositMintSellDecimals"]);
    }
    if (detailData.limitBuySell === "buy") {
      temp.limitAmount = data["holding"]["MinAmountBuy"] / Math.pow(10, data["holding"]["DepositMintBuyDecimals"]);
      temp.minAmount = data["holding"]["MinAmountBuy"] / Math.pow(10, data["holding"]["DepositMintBuyDecimals"]);
    } else {
      temp.limitAmount = data["holding"]["MinAmountSell"] / Math.pow(10, data["holding"]["DepositMintSellDecimals"]);
      temp.minAmount = data["holding"]["MinAmountSell"] / Math.pow(10, data["holding"]["DepositMintSellDecimals"]);
    }

    if (publicKey?.toBase58() !== undefined) {
      setSolBalance(solBalance * LAMPORTS);
      temp.pubkey = publicKey?.toBase58();
    }

    temp.holdingPubkey = data["holding"]["Pubkey"];

    temp.depositTokenAccountBuy = data["holding"]["DepositTokenAccountBuy"];
    temp.depositTokenAccountSell = data["holding"]["DepositTokenAccountSell"];

    temp.positionMintMoBuy = data["holding"]["PositionMintMoBuy"];
    temp.positionMintMoSell = data["holding"]["PositionMintMoSell"];

    setDetailData(temp);
  }, [data, publicKey]);

  const handleBuySellChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    if (detailData.tab == "market") {
      console.log("marketii", event.target.value);
      setDetailData((detailData) => {
        return { ...detailData, marketBuySell: event.target.value };
      });
    } else {
      console.log("selll");
      setDetailData((detailData) => {
        return { ...detailData, limitBuySell: event.target.value };
      });
    }
  };

  // const handleLimitBuySellChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
  //   setLimitBuySell(event.target.value);
  // };

  const handleSliderChange = (event: any, newValue: any) => {
    setDetailData((detailData) => {
      return { ...detailData, limitAtPrice: newValue };
    });
  };

  /* Confirm Order function
      Check limit or market tab
      Validate wallet connection and initializer_deposit_account existence
      Check amount is >=  than minAmount

  */
  const handleConfirmOrder = () => {
    console.log("good", detailData.marketBuySell);
    if (wallet == null) {
      setPopupContent("Please connect the wallet!!!");
      setPopupShow(true);
      return;
    }

    if (detailData.marketAmount < detailData.minAmount) {
      setPopupContent("Amount can not be smaller than minimum amount!");
      setPopupShow(true);
      return;
    }

    let params: PlaceOrderHoldingData;

    if (detailData.tab == "market") {
      let depositTokenMint =
        detailData.marketBuySell === "buy" ? detailData.depositTokenMintBuy : detailData.depositTokenMintSell;
      let deposit_token_account: any | undefined = tokenBalances.find((x) => x.token.name == depositTokenMint);

      console.log("595", depositTokenMint, deposit_token_account);

      if (deposit_token_account === undefined) {
        setPopupContent("Can not place order because deposit account does not exist.");
        setPopupShow(true);
        return;
      }

      // if (solBalance < detailData.marketAmount * Math.pow(10, detailData.depositMintBuyDecimals)) {
      //   setPopupContent("Balance amount is not sufficient!");
      //   setPopupShow(true);
      //   return;
      // }

      let dir: Direction = detailData.marketBuySell === "buy" ? { buy: null } : { sell: null };

      params =
        detailData.marketBuySell === "buy"
          ? {
              initializer: new PublicKey(detailData.pubkey),
              holding_pubkey: new PublicKey(detailData.holdingPubkey),
              deposit_account: new PublicKey(detailData.depositTokenAccountBuy),
              initializer_deposit_token_account: new PublicKey(deposit_token_account.pubkey.toBase58()),
              position_mint: detailData.positionMintMoBuy == null ? null : new PublicKey(detailData.positionMintMoBuy!),
              deposit_mint: new PublicKey(detailData.depositTokenMintBuy),
              amount: new BN(detailData.marketAmount * Math.pow(10, detailData.depositMintBuyDecimals)),
              limit_price: null,
              direction: dir,
            }
          : {
              initializer: new PublicKey(detailData.pubkey),
              holding_pubkey: new PublicKey(detailData.holdingPubkey),
              deposit_account: new PublicKey(detailData.depositTokenAccountSell),
              initializer_deposit_token_account: new PublicKey(deposit_token_account.pubkey.toBase58()),
              position_mint:
                detailData.positionMintMoSell == null ? null : new PublicKey(detailData.positionMintMoSell!),
              deposit_mint: new PublicKey(detailData.depositTokenMintSell),
              amount: new BN(detailData.marketAmount * Math.pow(10, detailData.depositMintSellDecimals)),
              limit_price: null,
              direction: dir,
            };
      console.log("public key", detailData.pubkey);
      console.log(
        "initializer",
        deposit_token_account.pubkey.toBase58(),
        "position mint",
        detailData.positionMintMoBuy
      );
      console.log("deposit mint", detailData.depositTokenMintBuy);
    } else {
      let depositTokenMint =
        detailData.limitBuySell === "buy" ? detailData.depositTokenMintBuy : detailData.depositTokenMintSell;
      let deposit_token_account = tokenBalances.find((x) => x.token.name == depositTokenMint);

      if (deposit_token_account === undefined) {
        setPopupContent("Can not place order because deposit account does not exist.");
        setPopupShow(true);
        return;
      }

      if (solBalance < detailData.limitAmount * Math.pow(10, detailData.depositMintSellDecimals)) {
        setPopupContent("Balance amount is not sufficient!");
        setPopupShow(true);
        return;
      }

      let dir: Direction = detailData.limitBuySell === "buy" ? { buy: null } : { sell: null };

      params =
        detailData.limitBuySell === "buy"
          ? {
              initializer: new PublicKey(detailData.pubkey),
              holding_pubkey: new PublicKey(detailData.holdingPubkey),
              deposit_account: new PublicKey(detailData.depositTokenAccountBuy),
              initializer_deposit_token_account: new PublicKey(deposit_token_account.pubkey.toBase58()),
              position_mint: null,
              deposit_mint: new PublicKey(detailData.depositTokenMintBuy),
              amount: new BN(detailData.marketAmount),
              limit_price: new BN(detailData.limitAtPrice),
              direction: dir,
            }
          : {
              initializer: new PublicKey(detailData.pubkey),
              holding_pubkey: new PublicKey(detailData.holdingPubkey),
              deposit_account: new PublicKey(detailData.depositTokenAccountSell),
              initializer_deposit_token_account: new PublicKey(deposit_token_account.pubkey.toBase58()),
              position_mint: null,
              deposit_mint: new PublicKey(detailData.depositTokenMintSell),
              amount: new BN(detailData.marketAmount),
              limit_price: new BN(detailData.limitAtPrice),
              direction: dir,
            };
    }

    // let dir: Direction = { buy: null };

    // let params: PlaceOrderHoldingData = {
    //   initializer: new PublicKey("55z5LJU6CTBPz87uo85jPRqDMDqwmH6AUoABRPofJ7SX"),
    //   holding_pubkey: new PublicKey("9Mt59taLrYhNv38g8Ng8CMQAwetWeVfWMsf8q1D59hMd"),
    //   deposit_account: new PublicKey("FSjc2uPcfY4VQap5aFLwrUHZvL1w1wCoT2yQ3jpYBME1"),
    //   initializer_deposit_token_account: new PublicKey("9KCPxk3EuUHJsCdCbdrMkD4dacPeKBXZLw6GMLsDj95u"),
    //   position_mint: null,
    //   deposit_mint: new PublicKey("7Z4CcHpzRyTEFXPbf93PbDqmAjgaTEUDKSUyR1WvSN8z"),
    //   amount: new BN(250),
    //   limit_price: null,
    //   direction: dir,
    // };

    console.log("params", detailData.pubkey, "...", detailData.holdingPubkey, "...", detailData.depositTokenAccountBuy);

    if (wallet != null) {
      placeOrder(params, wallet, rpcConnection, updateData);
      // window.location.reload();
    }
  };

  console.log("detail data", detailData);

  const handleSetTab = (param: string) => {
    setDetailData((detailData) => {
      return { ...detailData, tab: param };
    });
  };

  return (
    <div className={classes.root} id="detail-section">
      <CloseIcon className="close-icon" onClick={onClose}></CloseIcon>
      <div>{popupShow ? <PopupAlert message={popupContent} b_show={true} close={setPopupShow} /> : <></>}</div>
      <Grid container>
        <Grid xs={12} sm={12} md={4} item={true}>
          <CoinCard key="1" data={data} detail={true} closeDetail={onClose} />
        </Grid>
        <Grid xs={12} sm={12} md={7} item={true}>
          <div style={{ textAlign: "left", paddingLeft: "10px" }}>
            <h2>Description</h2>
            <p style={{ fontSize: "16px" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mollis felis eleifend magna ultricies
              euismod. Suspendisse ut efficitur eros, dapibus hendrerit neque. Maecenas dapibus, enim at dignissim
              rutrum, elit nisi vestibulum odio, vel condimentum justo dui non lectus. Maecenas fringilla rutrum tortor
              sit amet vehicula. Nulla ac congue ante. Nunc volutpat laoreet suscipit. Donec posuere lectus arcu, sed
              sodales nisl venenatis et. Morbi euismod interdum dolor, nec suscipit dolor tincidunt sed.
            </p>
          </div>
          <Grid container>
            <Grid xs={12} sm={6} md={6} item={true}>
              <div>
                <ChartContainer
                  price={detailData.limitPriceData}
                  limitOrderPositionBuy={detailData.limitOrderPositionBuy}
                  limitOrderPositionSell={detailData.limitOrderPositionSell}
                />
              </div>
            </Grid>
            <Grid xs={12} sm={6} md={6} item={true}>
              <div style={{ paddingLeft: "10px", textAlign: "left" }}>
                <h1>Market Size</h1>
                <ColoredLine
                  buyVal={detailData.sizeBuyAMO / Math.pow(10, detailData.depositMintBuyDecimals)}
                  sellVal={detailData.sizeSellAMO / Math.pow(10, detailData.depositMintSellDecimals)}
                  baseTokenInfo={detailData.baseTokenInfo}
                  quoteTokenInfo={detailData.quoteTokenInfo}
                />
              </div>
            </Grid>
          </Grid>

          <div>
            <h1>Create Order</h1>
            <CustomTabs tabs={orderTabs} setTab={handleSetTab} />
          </div>
          <Button
            size="large"
            variant="contained"
            color="primary"
            className={classes.orderBtn}
            onClick={handleConfirmOrder}
          >
            Confirm Order
            <ArrowForwardIcon fontSize="default" />
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Detail;
