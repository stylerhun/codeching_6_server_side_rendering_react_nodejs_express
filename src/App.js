import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./App.css";
import { CarProvider } from "./state/context";
import CarMain from "./view/index";
import i18n from "i18next";

const App = props => {
  useEffect(() => {
    // Remove SSR data after ComponentDidMount and i18n loaded
    if (i18n.isInitialized && window.ssrData) {
      window.ssrData = undefined;
    }
  });
  const { data } = props;

  return (
    <CarProvider ssrData={data}>
      <CarMain />
    </CarProvider>
  );
};

App.contextTypes = {
  data: PropTypes.array
};

export default App;
