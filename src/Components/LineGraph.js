import "../CSS/LineGraph.css";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import { casesTypeColors } from "../util";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({
  casesType = "cases",
  isSpecific,
  isTotal = false,
  country,
  ...props
}) {
  const [data, setData] = useState({});

  //Prepare data for chart.js LineGraph (Daily Total Model)
  const buildChartDataTot = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data[casesType]) {
      if (lastDataPoint) {
        const newDataPoiny = {
          x: date,
          y: data[casesType][date],
        };
        chartData.push(newDataPoiny);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  //Prepare data for chart.js LineGraph (Daily Variations Model)
  const buildChartDataVar = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data[casesType]) {
      if (lastDataPoint) {
        const newDataPoiny = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoiny);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  //Recover data for https://disease.sh/v3/covid-19/historical/all?lastdays=120
  useEffect(() => {
    const fetchData = async () => {
      if (!isSpecific)
        await fetch(
          "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
        )
          .then((response) => response.json())
          .then((data) => {
            const chartData = isTotal
              ? buildChartDataTot(data, casesType)
              : buildChartDataVar(data, casesType);
            setData(chartData);
          })
          .catch((error) =>
            alert(
              "Global data seems to be not available at the moment, sorry for the inconvenient..."
            )
          );
      else if (isSpecific)
        await fetch(
          `https://disease.sh/v3/covid-19/historical/${country}?lastdays=120`
        )
          .then((response) => response.json())
          .then((data) => {
            const chartData = isTotal
              ? buildChartDataTot(data.timeline, casesType)
              : buildChartDataVar(data.timeline, casesType);
            setData(chartData);
          })
          .catch((error) =>
            alert(
              "Some data for this country seems to be not available at the moment, sorry for the inconvenient..."
            )
          );
    };

    fetchData();
  }, [casesType, country]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: `${casesTypeColors[casesType].half_op}`,
                borderColor: `${casesTypeColors[casesType].rgb}`,
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
