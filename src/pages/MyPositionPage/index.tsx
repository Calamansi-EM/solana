import React, { useState, useEffect, useCallback } from "react";
import { Container } from "@material-ui/core";

import Masonry from "react-masonry-css";

import CoinCard from "../../components/CoinCard";
import Detail from "../../components/Detail";
import Search from "../../components/Search";
import Assistant from "../../components/Assistant";
import "./style.css";

import CircularProgress from "@material-ui/core/CircularProgress";

import { useWalletContext } from "../../context/WalletContext";
import { SplTokenBalance } from "../../utils/types";
import { useExoticContext } from "../../context/ExoticContext";
import { MintAmount } from "../../api/types";

const breakpointColumnsObj: Record<string, number> = {
  default: 3,
  1100: 3,
  880: 2,
  500: 1,
};

function MyPositionPage() {
  // const [holdings, setHoldings] = useState<Array<HoldingData> | undefined>();
  const { api } = useExoticContext();
  const { tokenBalances } = useWalletContext();

  const [apiResponse, setApiResponse] = useState<any[] | undefined>([]);
  const [cardData, setCardData] = useState<any[] | undefined>([]);

  const [filterParams, setFilterParams] = useState<Record<string, string | boolean>>();
  const [showAssistant, setShowAssistant] = useState(true);
  const [showDetailIndex, setShowDetailIndex] = useState<number | null>(null);
  const [columns, setColumns] = useState<number>(breakpointColumnsObj.default);

  function handleShowDetail(index: number) {
    setShowDetailIndex(index);
    var element = document.getElementById("detail-section");
    element?.scrollIntoView();
  }

  function handleCloseDetail() {
    setShowDetailIndex(null);
  }

  const handleSearch = (params: any): void => {
    setFilterParams(params);
    getHoldings();
  };

  function updateData() {
    getHoldings();
  }

  const getHoldings = useCallback(async (): Promise<void> => {
    if (!api) {
      return;
    }

    const mintAmounts = tokenBalances.map(
      (t: SplTokenBalance): MintAmount => ({
        Mint: t.account.mint.toBase58(),
        Amount: t.amount.toNumber() * Math.pow(10, t.token.decimals),
      })
    );

    // if (mintAmounts.length === 0) {
    //   // return;
    // }

    const res = await api.getAllHoldingData(mintAmounts);
    console.log("minnnn", mintAmounts);
    console.log("resssss", res);

    if (res.success) {
      //check search filter
      if (filterParams !== undefined) {
        setApiResponse(res.result);

        let result = res.result;

        if (filterParams.endingFirst === true) {
          result = result?.sort((a: any, b: any) => {
            if (a.holding.EndTime > b.holding.EndTime) {
              return 1;
            } else if (a.holding.EndTime < b.holding.EndTime) {
              return -1;
            }
            return 0;
          });
        }

        if (filterParams.endingLast === true) {
          result = result?.sort((a: any, b: any) => {
            if (a.holding.EndTime > b.holding.EndTime) {
              return -1;
            } else if (a.holding.EndTime < b.holding.EndTime) {
              return 1;
            }
            return 0;
          });
        }

        if (filterParams.productVal !== "") {
          result = res.result?.filter((d: any) => Object.keys(d["product"])[0] === filterParams.productVal);
        }

        if (filterParams.positionOnly === true) {
          result = res.result?.filter((d: any) => d.positions.length > 0);
        }

        setCardData(result);
      } else {
        setApiResponse(res.result);
        setCardData(res.result);
        setShowDetailIndex(null);
      }
      // setHoldings(res.result);
    }
  }, [api, tokenBalances, filterParams]);

  useEffect(() => {
    getHoldings();
  }, [getHoldings]);

  useEffect(() => {
    const resizeHandler = () => {
      let columnsCount: number = breakpointColumnsObj.default;
      Object.keys(breakpointColumnsObj).forEach((key) => {
        if (key === "default") return;
        const width = parseInt(key, 10);
        if (window.innerWidth > width) {
          columnsCount = breakpointColumnsObj[key];
        }
      });
      setColumns(columnsCount);
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const renderCardColumns = (data: any[], start: number) => {
    if (!data || !data.length) return null;

    return (
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data.map((item, index) => (
          <div key={index}>
            {showDetailIndex !== index + start && (
              <CoinCard data={item} showDetail={() => handleShowDetail(index + start)} detail={false} />
            )}
          </div>
        ))}
      </Masonry>
    );
  };

  const renderContent = (data: any[]) => {
    const upContentIndex: number =
      showDetailIndex !== null ? Math.floor(showDetailIndex / columns) * columns : data.length;
    console.log("showDetailIndex", showDetailIndex, upContentIndex, columns);

    return (
      <>
        {renderCardColumns(data.slice(0, upContentIndex), 0)}
        {showDetailIndex !== null && (
          <Detail data={data[showDetailIndex]} onClose={handleCloseDetail} updateData={updateData} />
        )}
        {renderCardColumns(data.slice(upContentIndex), upContentIndex)}
      </>
    );
  };

  return (
    <div className="page" style={{ height: "100vh" }}>
      {!cardData || !apiResponse ? (
        <div style={{ marginTop: "50px" }}>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ backgroundColor: "#e4ecfc" }}>
          <Search apiResponse={apiResponse} onSearch={handleSearch} />
          <Container>{showAssistant ? <Assistant data={"test"} showAssistant={setShowAssistant} /> : <> </>}</Container>

          <Container>{renderContent(cardData)}</Container>
        </div>
      )}
    </div>
  );
}

export default MyPositionPage;
