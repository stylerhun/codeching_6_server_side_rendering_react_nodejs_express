import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getAllInitialData } from "./services";
import { I18nextProvider } from "react-i18next";

// import our main App component
import App from "../../src/App";

// import the manifest generated with the create-react-app build
import manifest from "../../build/asset-manifest.json";

// function to extract js assets from the manifest
const extractAssets = (assets, chunks) =>
  Object.keys(assets)
    .filter(asset => chunks.indexOf(asset.replace(".js", "")) > -1)
    .map(k => assets[k]);

const path = require("path");
const fs = require("fs");

export default () => (req, res, next) => {
  // get the html file created with the create-react-app build
  const filePath = path.resolve(__dirname, "..", "..", "build", "index.html");

  fs.readFile(filePath, "utf8", async (err, htmlData) => {
    if (err) {
      console.error("err", err);
      return res.status(404).end();
    }

    const modules = [];

    // Get all initial data

    const data = await getAllInitialData(req.baseUrl);

    const context = {};

    // render the app as a string
    const html = ReactDOMServer.renderToString(
      <I18nextProvider i18n={req.i18n}>
        <StaticRouter location={req.baseUrl} context={context}>
          <App data={data} />
        </StaticRouter>
      </I18nextProvider>
    );

    // Setup i18n for React component on client side after DOM is ready on client side
    const initialI18nStore = {};
    req.i18n.languages.forEach(l => {
      initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
    });
    const initialLanguage = req.i18n.options.lng;

    // map required assets to script tags
    const extraChunks = extractAssets(manifest, modules).map(
      c => `<script type="text/javascript" src="/${c}"></script>`
    );

    // get HTML headers
    const helmet = Helmet.renderStatic();

    // now inject the rendered app into our html and send it to the client
    const resx = res.send(
      htmlData
        .replace(
          '<div id="root"></div>',
          `<b>Rendered on server side:</b><br/><br/> <div id="root">${html}</div>`
        )
        // append the extra js assets
        .replace("</body>", extraChunks.join("") + "</body>")
        // write the HTML header tags
        .replace(
          "<title></title>",
          helmet.title.toString() + helmet.meta.toString()
        )
        .replace(
          "<noscript>You need to enable JavaScript to run this app.</noscript>",
          ""
        )
        .replace(
          "</head>",
          "<script>" +
            " var ssrData = " +
            JSON.stringify(data) +
            ";" +
            " var initialI18nStore  = " +
            JSON.stringify(initialI18nStore) +
            ";" +
            " var initialLanguage  = " +
            JSON.stringify(initialLanguage) +
            ";" +
            "</script>" +
            "</head>"
        )
    );

    return resx;
  });
};
