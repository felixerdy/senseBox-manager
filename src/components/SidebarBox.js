import React, { useState, useEffect } from "react";
import { AppContext } from "./AppContext";
import ContentLoader from "react-content-loader";
import styled from "styled-components";

const SidebarBox = props => {
  const [data, setData] = useState({});
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
      <SidebarBoxDiv
        theme={state.theme}
        selected={false}
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
      </SidebarBoxDiv>
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

const SidebarBoxDiv = styled.div`
  width: 100%;
  height: calc(60px - 1rem);
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  background-color: ${props => (props.theme === "dark" ? "#6d6d6d" : "#fff")};
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 0 6px 0 rgba(42, 42, 42, 0.1);
  box-sizing: border-box;
  transition: box-shadow 0.1s ease-out;
  overflow: hidden;
  white-space: nowrap;
  align-items: center;
  cursor: pointer;
  border-right: ${props => (props.selected ? "3px solid #38ed03" : "none")}
  
  &:hover {
    border-right: 3px solid #38ed03;
    box-shadow: 0 0 12px 0 rgba(42, 42, 42, 0.1);
  }

  @media (max-width: 500px) {
    width: 200px;
    display: block;
    margin-right: 10px;
    overflow: visible;
  }
`;

// box-shadow: 0 0 ${props => props.hover ? "12px" : "6px"} 0 ${props =>
//   props.theme === "dark"
//     ? `rgba(197, 197, 197, ${props =>
//         props.hover || props.selected ? "0.3" : "0.1"
//       })`
//     : `rgba(42, 42, 42, ${props => props.hover || props.selected ? "0.3" : "0.1"})`
// }`
