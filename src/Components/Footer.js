import "../CSS/Footer.css";
import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <ul>
        <li>
          Global COVID-19 data taken from{" "}
          <a href="https://disease.sh">disease.sh</a>
        </li>
        <li>
          Global Geographical data taken from{" "}
          <a href="https://restcountries.eu">REST Countries</a>
        </li>
      </ul>

      <ul className="copyright">
        <li>
          &copy; All credit goes to Pluda Michael (aka{" "}
          <a href="https://www.fiverr.com/mechamic_38?up_rollout=true">
            MechaMic_38
          </a>
          ) - Copyright 2020 Pluda Michael
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
