import express from "express";
import bodyParser from "body-parser";
import serverRenderer from "./middleware/renderer";
import cors from "cors";
import i18next from "i18next";
import middleware from "i18next-express-middleware";
import nodeFsBackend from "i18next-node-fs-backend";
import path from "path";
import serviceConfig from "./service-config.json";

console.log("Backend server is starting....");

// Init Express app
var app = express();

//Init i18n
i18next
  .use(middleware.LanguageDetector)
  .use(nodeFsBackend)
  .init({
    lng: "en",
    fallbackLng: "en",
    lowerCaseLng: true,
    preload: ["en"],
    backend: {
      loadPath: path.join(`${__dirname}/../build/locales/en/translation.json`)
    },
    useCookie: false
  });

//setup i18n for app
app.use(
  middleware.handle(i18next, {
    removeLngFromUrl: false
  })
);

// Set the initial port of backend app
app.set("port", 9000);

// body-parser init, it will parse the incoming parameters into req body
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());

// Routes
const router = express.Router();

const actionIndex = (req, res, next) => {
  serverRenderer()(req, res, next);
};

// Register all react route from service-config.json
const routesToReg = [];
const serviceData = JSON.parse(JSON.stringify(serviceConfig));
serviceData.forEach(provider => {
  provider.services.forEach(service => {
    service.reactRoutes.forEach(reactRoute => {
      let pref = "";
      if (reactRoute !== "^$") {
        pref = "^";
      }
      if (
        reactRoute !== ".*$" &&
        routesToReg.indexOf(`${pref}${reactRoute}`) === -1
      ) {
        routesToReg.push(`${pref}${reactRoute}`);
      }
    });
  });
});
routesToReg.forEach(route => {
  router.use(route, actionIndex);
});
router.use("/$", actionIndex);

// other static resources should just be served as they are
router.use(
  express.static(path.resolve(__dirname, "..", "build"), { maxAge: "30d" })
);

// any other route should be handled by react-router, so serve the index page
//router.use('*', actionIndex);

app.use(router);

//Api route
app.route("/api").get((req, res) => {
  res.sendFile(__dirname + "/public/api.html");
});

// Cars list
app.route("/api/cars").get((req, res) => {
  res.sendFile(__dirname + "/public/cars.json");
});

// Individual cars
app.route("/api/cars/1").get((req, res) => {
  res.sendFile(__dirname + "/public/car_1.json");
});

app.route("/api/cars/2").get((req, res) => {
  res.sendFile(__dirname + "/public/car_2.json");
});

app.route("/api/cars/3").get((req, res) => {
  res.sendFile(__dirname + "/public/car_3.json");
});

// Employee list
app.route("/api/employee").get((req, res) => {
  res.sendFile(__dirname + "/public/employee.json");
});

// Route for handling 404 requests(unavailable routes)
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

//500 error handler
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
}

app.use(clientErrorHandler);

// start the express server

app.listen(app.get("port"), () =>
  console.log(`App started on port ${app.get("port")}`)
);
