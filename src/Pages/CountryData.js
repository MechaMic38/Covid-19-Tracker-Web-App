import "./CountryData.css";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import InfoBox from "../Components/InfoBox";
import {
  capitalize,
  createCountryData,
  getCountryZoom,
  prettyPrintStat,
} from "../util";
import numeral from "numeral";
import Map from "../Components/Map";
import CountryTable from "../Components/CountryTable";
import LineGraph from "../Components/LineGraph";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function CountryData() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("IT");
  const [countryInfo, setCountryInfo] = useState({});
  const [casesType, setCasesType] = useState("cases");
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([42.8333, 12.8333]);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapCountries, setMapCountries] = useState([]);

  //Import initial country data
  useEffect(() => {
    const getCountryData = async () => {
      let disData;
      let restData;

      await fetch(`https://disease.sh/v3/covid-19/countries/${country}`)
        .then((response) => response.json())
        .then((data) => {
          setCountryInfo(data);
          disData = data;
        });

      await fetch(`https://restcountries.eu/rest/v2/alpha/${country}`)
        .then((response) => response.json())
        .then((data) => {
          restData = data;
        });

      setTableData(createCountryData(disData, restData));
    };

    getCountryData();
  }, []);

  //Import data from https://disease.sh/v3/covid-19/countries
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  //Changes selected country when selecting from dropdown, and retrieve the specific data for that country
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const getCountryData = async () => {
      let disData;
      let restData;

      await fetch(`https://disease.sh/v3/covid-19/countries/${countryCode}`)
        .then((response) => response.json())
        .then((data) => {
          setCountry(countryCode);
          setCountryInfo(data);
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          //setMapZoom(5);
          disData = data;
        });

      await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`)
        .then((response) => response.json())
        .then((data) => {
          setMapZoom(getCountryZoom(data.area));
          restData = data;
        });

      setTableData(createCountryData(disData, restData));
    };

    getCountryData();
  };

  return (
    <div>
      <Header />
      <div className="countryData">
        <div className="countryData__main">
          <div className="countryData__left">
            <div className="countryData__header">
              <h1>COVID-19 COUNTRIES</h1>

              <FormControl className="countryData__dropdown">
                <Select
                  variant="outlined"
                  onChange={onCountryChange}
                  value={country}
                >
                  {countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="countryData__stats">
              <InfoBox
                isRed
                active={casesType === "cases"}
                onClick={(e) => setCasesType("cases")}
                title="Coronavirus Cases"
                cases={prettyPrintStat(countryInfo.todayCases)}
                total={numeral(countryInfo.cases).format("0,0")}
              />
              <InfoBox
                isGreen
                active={casesType === "recovered"}
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                total={numeral(countryInfo.recovered).format("0,0")}
              />
              <InfoBox
                isBlack
                active={casesType === "deaths"}
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                total={numeral(countryInfo.deaths).format("0,0")}
              />
            </div>

            <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} />
          </div>

          <Card className="countryData__right">
            <CardContent>
              <CountryTable countryData={tableData} />
            </CardContent>
          </Card>
        </div>

        <div className="countryData__interactive">
          <Card className="countryData__graphWrapper">
            <CardContent>
              <div className="countryData__graphContainer">
                <h3 className="countryData__graphTitle">
                  Overall {capitalize(casesType)} in{" "}
                  <strong>{countryInfo.country}</strong> in the last 120 Days
                </h3>
                <LineGraph
                  className="countryData__graph"
                  isSpecific
                  isTotal
                  casesType={casesType}
                  country={country}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="countryData__graphWrapper">
            <CardContent>
              <div className="countryData__graphContainer">
                <h3 className="countryData__graphTitle">
                  Daily Variation of {capitalize(casesType)} in{" "}
                  <strong>{countryInfo.country}</strong> in the last 120 Days
                </h3>
                <LineGraph
                  className="countryData__graph"
                  isSpecific
                  casesType={casesType}
                  country={country}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CountryData;
