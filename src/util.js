import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const casesTypeColors = {
  cases: {
    hex: "#ab0d34",
    rgb: "rgb(171, 13, 52)",
    half_op: "rgba(171, 13, 52, 0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#8ae331",
    rgb: "rgb(138, 227, 49)",
    half_op: "rgba(138, 227, 49, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#865a5a",
    rgb: "rgb(134, 90, 90)",
    half_op: "rgba(134, 90, 90, 0.5)",
    multiplier: 2000,
  },
};

export const sortData = (data, casesType = "cases") => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => (a[casesType] > b[casesType] ? -1 : 1));
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const getCountryZoom = (area) => {
  if (area <= 50000) return 8;
  else if (area <= 250000) return 7;
  else if (area <= 500000) return 6;
  else if (area <= 800000) return 5;
  else if (area > 800000) return 4;
  else return 3;
};

export const createCountryData = (disData, restData) => {
  const countryData = [
    {
      row: "Flag",
      column: disData.countryInfo.flag,
    },
    {
      row: "Country",
      column: disData.country,
    },
    {
      row: "Continent",
      column: disData.continent,
    },
    {
      row: "Subregion",
      column: restData.subregion,
    },
    {
      row: "Latitude",
      column: disData.countryInfo.lat,
    },
    {
      row: "Longitude",
      column: disData.countryInfo.long,
    },
    {
      row: "Area",
      column: `${numeral(restData.area).format("0,0")} km²`,
    },
    {
      row: "ISO2",
      column: disData.countryInfo.iso2,
    },
    {
      row: "ISO3",
      column: disData.countryInfo.iso3,
    },
    {
      row: "Capital",
      column: restData.capital,
    },
    {
      row: "Currency",
      column: `${restData.currencies[0].name} [${restData.currencies[0].symbol}]`,
    },
    {
      row: "Population",
      column: numeral(restData.population).format("0,0"),
    },
    {
      row: "Demonym",
      column: restData.demonym,
    },
  ];

  return countryData;
};

//Draw circles on the map with interactive tooltip
export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country, i) => (
    <Circle
      key={i}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info__container">
          <div
            className="info__flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info__name">{country.country}</div>
          <div className="info__confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info__recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info__deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
