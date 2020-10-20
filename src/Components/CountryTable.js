import "../CSS/CountryTable.css";
import React from "react";

function CountryTable({ countryData }) {
  let data = [...countryData];
  const flag = data.shift();
  const countryName = data.shift();

  return (
    <div className="countryTable">
      <h3 className="countryData__countryName">
        {countryName && countryName.column}
      </h3>
      <div className="countryTable__flagContainer">
        <img className="countryTable__flag" src={flag && flag.column} alt="" />
      </div>
      <div className="countryTable__table">
        {data.map((item, i) => (
          <tr key={i}>
            <td>{item.row}</td>
            <td>{item.column}</td>
          </tr>
        ))}
      </div>
    </div>
  );
}

export default CountryTable;
