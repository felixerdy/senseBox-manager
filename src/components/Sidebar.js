import React, { useState, useEffect } from "react";
import { XCircle, Command } from "react-feather";
import { AppContext } from "./AppContext";
import SidebarBox from "./SidebarBox";
import ContentLoader from "react-content-loader";

const Sidebar = () => {
  const [selected, setSelected] = useState();
  const [visible, setVisible] = useState(true);

  let { state, dispatch } = React.useContext(AppContext);

  return (
    <div
      style={{
        position: "absolute",
        width: "300px",
        height: "calc(100% - 2rem)",
        padding: "1rem",
        background: state.theme === "dark" ? "#4a4a4a" : "#ffffff",
        color: state.theme === "dark" ? "#fff" : "#000",
        zIndex: 1,
        left: visible ? "0" : "calc(-300px - 2rem)",
        transition: "all 0.3s",
        overflowY: "scroll"
      }}
    >
      <Command
        style={{
          float: "left",
          cursor: "pointer"
        }}
        onClick={() => dispatch({ type: "toggle" })}
      />
      <XCircle
        style={{
          float: "right",
          cursor: "pointer"
        }}
        onClick={() => setVisible(false)}
      />
      <br />
      {state.auth == null ? <Login /> : <p>Boxes of {state.auth.user.name}</p>}
      <div style={{ marginTop: 20 }}>
        {state.boxes.length == 0 && <SkeletonLoader />}
        {state.boxes.map((e, i) => (
          <SidebarBox
            key={i}
            id={e}
            selected={e == state.selectedBox.properties._id}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

const Login = () => {
  let { state, dispatch } = React.useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    fetch("https://api.opensensemap.org/users/sign-in", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        dispatch({ type: "set-auth", payload: response.data });
        dispatch({ type: "set-boxes", payload: response.data.user.boxes });
      })
      .catch(error => console.error("Error:", error));
  };
  return (
    <div>
      <h3>Login</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 5fr",
          gridTemplateRows: "auto auto",
          alignItems: "center"
        }}
      >
        <p>E-Mail</p>
        <input
          type="text"
          style={{
            height: "32px",
            lineHeight: "32px",
            borderRadius: "4px",
            border: "1px solid #dcdfe6",
            boxSizing: "border-box",
            color: "#606266",
            display: "inline-block",
            outline: 0,
            padding: "0 15px",
            transition: "border-color .2s cubic-bezier(.645,.045,.355,1)",
            width: "100%"
          }}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <p>Passwort</p>
        <input
          type="password"
          style={{
            height: "32px",
            lineHeight: "32px",
            borderRadius: "4px",
            border: "1px solid #dcdfe6",
            boxSizing: "border-box",
            color: "#606266",
            display: "inline-block",
            outline: 0,
            padding: "0 15px",
            transition: "border-color .2s cubic-bezier(.645,.045,.355,1)",
            width: "100%"
          }}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="password"
        />
      </div>
      <button
        style={{
          float: "right",
          height: "32px",
          borderRadius: "4px",
          border: "1px solid #dcdfe6",
          boxSizing: "border-box",
          color: "#606266",
          display: "inline-block",
          outline: 0
        }}
        onClick={login}
      >
        Login
      </button>
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <ContentLoader
      height={230}
      width={400}
      speed={2}
      primaryColor="#d5d5d5"
      secondaryColor="#969696"
    >
      <rect x="25" y="15" rx="5" ry="5" width="360" height="10" />
      <rect x="25" y="75" rx="5" ry="5" width="320" height="10" />
      <rect x="25" y="145" rx="5" ry="5" width="360" height="10" />
      <rect x="25" y="215" rx="5" ry="5" width="320" height="10" />
    </ContentLoader>
  );
};
