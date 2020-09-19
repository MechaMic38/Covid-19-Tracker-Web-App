import "../CSS/Map.css";
import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from "../util";

function Map({ countries, center, zoom, casesType, displaysData }) {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {displaysData && showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
