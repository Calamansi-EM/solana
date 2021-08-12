import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import { Container } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { Grid } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import CircleChecked from "@material-ui/icons/CheckCircleOutline";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";

import { useTokenMap } from "../utils/TokenInfo";

import "../style/style.css";
import { convertMintToRealOnes } from "../utils/MappingFakeMint";

const useStyles = makeStyles({
  formControl: {
    // minWidth: 170,
    // borderRadius: "20px",
    // overflow: "hidden",
    // border: "1px solid black",
    margin: "7px 0",
    width: "100%",
  },
  sendBtn: {
    backgroundColor: "#286053",
    width: "150px",
    color: "white",
  },
});

export interface SearchParam {
  // tradingPair: String,
  // productType: String,
  endingFirst: boolean;
  endingLast: boolean;
  ascending: boolean;
  positionOnly: boolean;
}

export type SearchProps = {
  apiResponse: any[];
  onSearch: (params: SearchParam) => void;
};

const Search: React.FC<SearchProps> = ({ apiResponse, onSearch }) => {
  const classes = useStyles();
  const [trading, setTrading] = useState<any[] | undefined>([]);
  const [product, setProduct] = useState<any[] | undefined>([]);
  const [tradingVal, setTradingVal] = React.useState<String>("");
  const [productVal, setProductVal] = React.useState<String>("");
  const [ascending, setAscending] = React.useState(false);
  const [descending, setDescending] = React.useState(false);
  const [endingFirst, setEndingFirst] = React.useState(false);
  const [endingLast, setEndingLast] = React.useState(false);
  const [positionOnly, setPositionOnly] = React.useState(false);

  const tokenMap = useTokenMap();
  console.log(descending);

  //get product type
  useEffect(() => {
    var arrAllProduct: Array<any> = [];
    var arrTrading: Array<any> = [];
    apiResponse.forEach((item, index) => {
      if (!arrAllProduct.includes(Object.keys(item["product"])[0]))
        arrAllProduct = [...arrAllProduct, Object.keys(item["product"])[0]];

      const baseToken = item["product"][Object.keys(item["product"])[0]]["ProductCommon"]["BaseToken"];
      const quoteToken = item["product"][Object.keys(item["product"])[0]]["ProductCommon"]["QuoteToken"];

      console.log("baseToken", convertMintToRealOnes(baseToken), convertMintToRealOnes(quoteToken));
      const sourceInfo = tokenMap.get(convertMintToRealOnes(baseToken));
      const destInfo = tokenMap.get(convertMintToRealOnes(quoteToken));
      var tradingPair = sourceInfo?.symbol + "/" + destInfo?.symbol;

      console.log("trading pair", sourceInfo);
      if (!arrTrading.includes(tradingPair)) arrTrading = [...arrTrading, tradingPair];
    });
    setProduct(arrAllProduct);
    setTrading(arrTrading);
  }, [apiResponse, tokenMap]);

  // const tokenMap = useTokenMap();

  console.log(trading, product);

  const handleTradingChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTradingVal(event.target.value as String);
  };

  const handleProductChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setProductVal(event.target.value as String);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "ascending") {
      setAscending(true);
      setDescending(false);
    }
    if (event.target.name === "descending") {
      setAscending(false);
      setDescending(true);
    }
    if (event.target.name === "endingFirst") {
      setEndingFirst(true);
      setEndingLast(false);
    }
    if (event.target.name === "endingLast") {
      setEndingFirst(false);
      setEndingLast(true);
    }
    if (event.target.name === "positionOnly") setPositionOnly(event.target.checked);
  };

  function handleSend() {
    const params = {
      tradingVal: tradingVal,
      productVal: productVal,
      ascending: ascending,
      endingFirst: endingFirst,
      endingLast: endingLast,
      positionOnly: positionOnly,
    };
    onSearch(params);
  }

  return (
    <div id="search-div">
      <Container>
        <div>
          <p style={{ color: "#0062FF", fontSize: "32px", textAlign: "left" }}>
            <b>Search Exotic Products</b>
          </p>
        </div>
        <Grid container>
          <Grid md={3} sm={12} xs={12} item={true} className="dropdown-grid">
            <div className="dropdown-form">
              <FormControl size="small" variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Trading Pair</InputLabel>
                <Select native onChange={handleTradingChange} label="Trading Pair">
                  <option aria-label="None" value="" />
                  {trading?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="dropdown-form">
              <FormControl size="small" variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Product Type</InputLabel>
                <Select native onChange={handleProductChange} label="Trading Pair">
                  <option aria-label="None" value="" />
                  {product?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Grid>
          {/* <Grid xs={6} md={2} sm={2} item={true} className="checkbox-grid">
            <div className="checkbox-group">
              <p>
                <b>Order by Price</b>
              </p>
              <div>
                <Checkbox
                  checked={ascending}
                  onChange={handleCheckboxChange}
                  inputProps={{ "aria-label": "primary checkbox" }}
                  icon={<CircleUnchecked />}
                  checkedIcon={<CircleChecked />}
                  name="ascending"
                />
                Ascending
              </div>
              <div>
                <Checkbox
                  checked={descending}
                  onChange={handleCheckboxChange}
                  inputProps={{ "aria-label": "primary checkbox" }}
                  icon={<CircleUnchecked />}
                  checkedIcon={<CircleChecked />}
                  name="descending"
                />
                Descending
              </div>
            </div>
          </Grid> */}
          <Grid md={3} sm={5} xs={12} item={true} className="checkbox-grid">
            <div className="checkbox-group">
              <p style={{ marginLeft: "10px" }}>
                <b>Order by Auction</b>
              </p>
              <div>
                <Checkbox
                  checked={endingFirst}
                  onChange={handleCheckboxChange}
                  inputProps={{ "aria-label": "primary checkbox" }}
                  icon={<CircleUnchecked />}
                  checkedIcon={<CircleChecked />}
                  name="endingFirst"
                />
                Ending First
              </div>
              <div>
                <Checkbox
                  checked={endingLast}
                  onChange={handleCheckboxChange}
                  inputProps={{ "aria-label": "primary checkbox" }}
                  icon={<CircleUnchecked />}
                  checkedIcon={<CircleChecked />}
                  name="endingLast"
                />
                Ending Last
              </div>
            </div>
          </Grid>
          <Grid md={3} sm={3} xs={12} item={true} className="checkbox-grid">
            <div className="checkbox-group">
              <p style={{ marginLeft: "10px" }}>
                <b>Fliter</b>
              </p>
              <Checkbox
                checked={positionOnly}
                onChange={handleCheckboxChange}
                inputProps={{ "aria-label": "primary checkbox" }}
                name="positionOnly"
              />
              My Positions Only
            </div>
          </Grid>
          <Grid md={3} sm={12} xs={12} item={true}>
            <Button
              variant="contained"
              onClick={handleSend}
              className={classes.sendBtn}
              endIcon={<SearchIcon>Search</SearchIcon>}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Search;
