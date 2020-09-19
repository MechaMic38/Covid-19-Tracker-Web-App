import "../CSS/Header.css";
import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="header__nav">
        <Link to="/">WORLDWIDE</Link>
        <Link to="/countryData">SEE BY COUNTRIES</Link>
      </div>
    </header>
  );
}

export default Header;
