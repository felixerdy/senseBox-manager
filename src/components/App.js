import React from "react";
import Map from "./Map";
import Sidebar from "./Sidebar";
import { AppContextProvider } from "./AppContext";

const App = () => {
  return (
    <AppContextProvider>
      <Sidebar />
      <Map />
    </AppContextProvider>
  );
};

export default App;
