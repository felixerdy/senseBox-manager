import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AppContext } from "./AppContext";
import MarkerSVG from "./MarkerSVG";

const Map = () => {
  let { state, dispatch } = React.useContext(AppContext);
  let [map, setMap] = React.useState();

  const theme =
    state.theme === "dark"
      ? "mapbox://styles/mapbox/dark-v9"
      : "mapbox://styles/mapbox/light-v9";

  useEffect(() => {
    if (map != undefined) {
      map.getMap().on("load", () => {
        var layers = map.getMap().getStyle().layers;
        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
            labelLayerId = layers[i].id;
            break;
          }
        }

        map.getMap().addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": "#aaa",

              // use an 'interpolate' expression to add a smooth transition effect to the
              // buildings as the user zooms in
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "height"]
              ],
              "fill-extrusion-base": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "min_height"]
              ],
              "fill-extrusion-opacity": 0.6
            }
          },
          labelLayerId
        );
      });
    }
  });

  return (
    <ReactMapGL
      ref={el => setMap(el)}
      {...state.viewport}
      mapStyle={theme}
      onViewportChange={viewport =>
        dispatch({
          type: "set-viewport",
          payload: viewport
        })
      }
    >
      {state.detailBoxes.map((e, i) => {
        return (
          <Marker
            key={i}
            latitude={e.geometry.coordinates[1]}
            longitude={e.geometry.coordinates[0]}
          >
            <MarkerSVG
              size={20}
              onClick={() => {
                dispatch({ type: "select-box", payload: e });
                dispatch({ type: "selected-box-from-map", payload: true });
                dispatch({
                  type: "set-viewport",
                  payload: {
                    ...state.viewport,
                    latitude: e.geometry.coordinates[1],
                    longitude: e.geometry.coordinates[0],
                    zoom: 16,
                    pitch: 50,
                    transitionDuration: 1000
                  }
                });
              }}
            />
          </Marker>
        );
      })}
    </ReactMapGL>
  );
};

export default Map;
