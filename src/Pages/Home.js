import React, { useEffect, useState } from "react";
import "./Home.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "../Components/InfoBox";
import Map from "../Components/Map";
import Table from "../Components/Table";
import { capitalize, prettyPrintStat } from "../util";
import LineGraph from "../Components/LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function Home() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(4);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  //Import initial worldwide data
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
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

          setTableData(data);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  //Changes selected country when selecting from dropdown, and retrieve the specific data for that country
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(4);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };

  return (
    <div>
      <Header />
      <div className="home">
        <div className="home__main">
          <div className="home__left">
            <div className="home__header">
              <h1>COVID-19 WORLDWIDE</h1>

              <FormControl className="home__dropdown">
                <Select
                  variant="outlined"
                  onChange={onCountryChange}
                  value={country}
                >
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="home__stats">
              <InfoBox
                isRed
                active={casesType === "cases"}
                onClick={(e) => setCasesType("cases")}
                title="Cases"
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

            <Map
              displaysData
              countries={mapCountries}
              center={mapCenter}
              zoom={mapZoom}
              casesType={casesType}
            />
          </div>

          <Card className="home__right">
            <CardContent>
              <h3>Live {capitalize(casesType)} by Country</h3>
              <Table countries={tableData} casesType={casesType} />
              <h3 className="home__graphTitle">
                Worldwide new {capitalize(casesType)}
              </h3>
              <LineGraph className="home__graph" casesType={casesType} />
            </CardContent>
          </Card>
        </div>

        <div className="home__interactive">
          <Card className="home__graphWrapper">
            <CardContent>
              <div className="home__graphContainer">
                <h3 className="home__graphTitle">
                  Overall {capitalize(casesType)} in the World in the last 120
                  Days
                </h3>
                <LineGraph
                  className="home__graph"
                  isTotal
                  casesType={casesType}
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

export default Home;
