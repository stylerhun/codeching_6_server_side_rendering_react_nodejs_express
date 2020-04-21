import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./i18n";
import { useSSR } from "react-i18next";
import App from "./App";

const AppContainer = () => {
  useSSR(window.initialI18nStore, window.initialLanguage);
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  );
};

// Suspense is not supported in SSR currently, and on server side we will use Static router, so this 2 is used here
ReactDOM.hydrate(<AppContainer />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
