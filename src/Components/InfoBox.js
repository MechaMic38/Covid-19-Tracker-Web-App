import "../CSS/InfoBox.css";
import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, active, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        props.isRed && "infoBox--red"
      } ${props.isGreen && "infoBox--green"} ${
        props.isBlack && "infoBox--black"
      }
      }`}
    >
      <CardContent>
        <Typography className="infoBox__title">{title}</Typography>

        <h2 className="infoBox__cases">{cases}</h2>

        <Typography className="infoBox__total">{total} Total</Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
