import React, { useState, useEffect } from "react";
import { ArgumentAxis, ValueAxis, Chart, AreaSeries } from "@devexpress/dx-react-chart-material-ui";
import { ArgumentScale } from "@devexpress/dx-react-chart";

// const useStyles = makeStyles(() => ({
//   chart: {
//     height: 100,
//   }
// }));

const sampleData = [
  { price: "75", buy: 30, sell: 13 },
  { price: "150", buy: 40, sell: 15 },
  { price: "225", buy: 50, sell: 20 },
  { price: "290", buy: 40, sell: 17 },
  { price: "365", buy: 55, sell: 21 },
];

/*
 params : price, limitOrderPositionBuy, limitOrderPositionSell
*/
const ChartContainer = (params: any) => {
  const [chartData, setChartData] = useState<any | undefined>();

  useEffect(() => {
    let data: any[] | undefined = [];
    for (var i = 0; i < params.price.length; i++) {
      data.push({
        price: `${params.price[i]}%`,
        buy: parseInt(params.limitOrderPositionBuy[i]),
        sell: parseInt(params.limitOrderPositionSell[i]),
      });
    }
    setChartData(data);
  }, [params]);

  return chartData !== undefined ? (
    <Chart data={chartData} height={350}>
      <ArgumentScale />
      <ArgumentAxis />
      <ValueAxis />
      <ValueAxis position="right" />
      <AreaSeries name="Limit Order Position Buy" valueField="buy" argumentField="price" />
      <AreaSeries name="Limit Order Position Sell" valueField="sell" argumentField="price" />
    </Chart>
  ) : (
    <></>
  );
};

export default ChartContainer;
