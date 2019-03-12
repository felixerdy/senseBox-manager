import React, { useState, useEffect } from "react";
import { AppContext } from "./AppContext";
import ContentLoader from "react-content-loader";

const SidebarBox = props => {
  const [data, setData] = useState({});
  const [hover, setHover] = useState(false);
  let { state, dispatch } = React.useContext(AppContext);

  useEffect(() => {
    fetch(`https://api.opensensemap.org/boxes/${props.id}?format=geojson`)
      .then(res => res.json())
      .then(response => {
        setData(response);
        dispatch({ type: "set-detailBoxes", payload: response });
      })
      .catch(error => console.error("Error:", error));
  }, []);

  if (data.properties) {
    return (
      <div
        style={{
          width: "calc(300px - 20px)",
          height: "calc(60px - 1rem)",
          marginBottom: "10px",
          padding: "10px",
          display: "flex",
          backgroundColor: state.theme === "dark" ? "#6d6d6d" : "#fff",
          boxShadow: `0 0 ${hover ? "12px" : "6px"} 0 ${
            state.theme === "dark"
              ? `rgba(197, 197, 197, ${
                  hover || props.selected ? "0.3" : "0.1"
                })`
              : `rgba(42, 42, 42, ${hover || props.selected ? "0.3" : "0.1"})`
          }`,
          border: "1px solid transparent",
          borderRadius: 4,
          transition: "box-shadow .1s ease-out",
          overflow: "hidden",
          whiteSpace: "nowrap",
          alignItems: "center",
          cursor: "pointer",
          borderRight: props.selected
            ? "3px solid #38ed03"
            : hover
            ? "3px solid #38ed03"
            : "none"
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          dispatch({ type: "select-box", payload: data });
          dispatch({ type: "selected-box-from-map", payload: false });
          dispatch({
            type: "set-viewport",
            payload: {
              ...state.viewport,
              latitude: data.geometry.coordinates[1],
              longitude: data.geometry.coordinates[0],
              zoom: 16,
              pitch: 50,
              transitionDuration: 1000
            }
          });
        }}
      >
        {data.properties.name}
      </div>
    );
  } else {
    return (
      <ContentLoader
        height={40}
        width={400}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
      >
        <rect x="0" y="0" rx="3" ry="3" width="350" height="6.4" />
        <rect x="0" y="20" rx="3" ry="3" width="200" height="6.4" />
      </ContentLoader>
    );
  }
};

export default SidebarBox;
