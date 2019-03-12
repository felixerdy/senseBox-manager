import React from "react";
import { FlyToInterpolator } from "react-map-gl";

let AppContext = React.createContext();

let initialState = {
  auth: null,
  theme: "light",
  boxes: [],
  detailBoxes: [],
  selectedBox: {
    properties: {
      _id: ""
    }
  },
  selectedFromMap: false,
  viewport: {
    width: "100%",
    height: "100%",
    latitude: 50,
    longitude: 7,
    zoom: 4,
    transitionInterpolator: new FlyToInterpolator(),
    transitionDuration: 1000
  }
};

let reducer = (state, action) => {
  switch (action.type) {
    case "toggle":
      return { ...state, theme: state.theme === "dark" ? "light" : "dark" };
    case "set-boxes":
      return { ...state, boxes: action.payload };
    case "set-detailBoxes":
      return { ...state, detailBoxes: [...state.detailBoxes, action.payload] };
    case "select-box":
      return { ...state, selectedBox: action.payload };
    case "selected-box-from-map":
      return { ...state, selectedFromMap: action.payload };
    case "set-viewport":
      return {
        ...state,
        viewport: action.payload
      };
    case "set-auth":
      return {
        ...state,
        auth: action.payload
      };
  }
};

const AppContextProvider = props => {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
