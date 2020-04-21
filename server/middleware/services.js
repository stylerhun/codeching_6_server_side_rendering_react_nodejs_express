import fetch from "node-fetch";
import serviceConfig from "../service-config.json";

const backendBaseUrl = "http://localhost:9000/api";

/**
 * Get all initial data from server
 */
export const getAllInitialData = async route => {
  let serviceData = JSON.parse(JSON.stringify(serviceConfig));
  let services = [];
  let serviceIndexes = [];

  serviceData.forEach((provider, providerIndex) => {
    provider.services.forEach((service, serviceIndex) => {
      let url = service.url;

      let foundRoute = false;
      service.reactRoutes.forEach(reactRoute => {
        const match = route.match(new RegExp(reactRoute));
        if (match && match.length > 0) {
          foundRoute = true;

          // from index 1 , we get the parameters
          if (match.length > 1) {
            for (let j = 1; j < match.length; j++) {
              url = url.replace(`[${j}]`, match[j]);
            }
          }

          serviceIndexes.push({ providerIndex, serviceIndex });
        }
      });

      if (foundRoute) {
        url = url.replace("{backendBaseUrl}", backendBaseUrl);
        console.log("STORE URL TO FETCH ", url);
        services.push(url);
      }
    });
  });

  // console.log('Services ', services.length );

  if (services.length > 0) {
    await Promise.all(services.map(url => fetch(url)))
      .then(responses => Promise.all(responses.map(res => res.text())))
      .then(data => {
        let idx = 0;
        serviceData.forEach((provider, providerIndex) => {
          provider.services.forEach((service, serviceIndex) => {
            if (
              serviceIndexes.filter(
                p =>
                  p.providerIndex === providerIndex &&
                  p.serviceIndex === serviceIndex
              ).length > 0
            ) {
              //console.log('DATA', data, idx);
              const jsonData = data[idx].trim();
              idx++;
              service.payload = JSON.parse(jsonData);
            }
          });
        });
      })
      .catch(data => {
        console.log("ERROR", data);
      });
  }
  // const util = require('util');
  // console.log('DATA',util.inspect(serviceData, {showHidden: false, depth: 10}));
  return serviceData;
};
