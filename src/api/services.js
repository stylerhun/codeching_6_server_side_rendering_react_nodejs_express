import createService from "./provider";

const serviceConfig = {
  getCars: {
    url: "/cars",
    method: "GET",
    authRequired: false
  },
  getEmployee: {
    url: "/employee",
    method: "GET",
    authRequired: false
  },
  getCar: {
    url: "/cars/{id}",
    method: "GET",
    authRequired: false
  },
};

const services = createService(serviceConfig);

export default services;
