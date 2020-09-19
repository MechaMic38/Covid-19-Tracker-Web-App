import "../CSS/Table.css";
import React from "react";
import numeral from "numeral";
import { sortData } from "../util";

function Table({ countries, casesType = "cases" }) {
  const sortedData = sortData(countries, casesType);

  return (
    <div className="table">
      {sortedData.map((country) => (
        <tr>
          <td>{country.country}</td>
          <td>
            <strong>{numeral(country[casesType]).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
