import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Pages/Home";
import CountryData from "./Pages/CountryData";

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/countryData">
            <CountryData />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
