import axios from "axios";
import { isArray, isObject } from "util";

axios.defaults.baseURL = "http://localhost:9000/api";

const getLanguageHeaders = () => {
  const language = "en";

  //Here we can read the language settings from local storage for e.g....
  return {
    "Accept-Language": language
  };
};

/**
 * Transforms a map of parameters to a ? and & separated URI encoded query string
 * @param {*} queryParams Map of parameters and values which needs to be transformed
 */
export const encodeQueryParams = queryParams => {
  if (!queryParams) {
    return "";
  }

  const paramList = Object.keys(queryParams).reduce((acc, name) => {
    const value = queryParams[name];
    const encodedName = encodeURIComponent(name);

    if (isArray(value)) {
      return [
        ...acc,
        ...value.map(item => `${encodedName}=${encodeURIComponent(item)}`)
      ];
    }

    return [...acc, `${encodedName}=${encodeURIComponent(value)}`];
  }, []);

  return paramList.length ? `?${paramList.join("&")}` : "";
};

/**
 * Replaces parameters with values in an URL with URI encoding
 * @param {*} url The URL which containes variables in curly brace
 * @param {*} params Map of parameters and values which needs to be replaced
 */
export const replaceUrlParams = (url, params) =>
  Object.keys(params || {}).reduce((acc, key) => {
    const regexp = new RegExp(`\\{${key}\\}`, "g");
    return acc.replace(regexp, encodeURIComponent(params[key]));
  }, url);

export const processParam = (result, paramTypes, paramName, param) => {
  const {
    headerParams = {},
    urlParams = {},
    queryParams = {},
    data = {}
  } = result;
  const paramType = paramTypes[paramName] || "url";

  let newData = data;

  if (paramType === "data") {
    //inject the content of param into data
    newData = { ...data, ...param };
  } else if (paramType === "body") {
    newData = { ...data, [paramName]: param };
  } else if (
    paramType === "url" ||
    paramType === "query" ||
    paramType === "header"
  ) {
    newData = isObject(param) ? param : { [paramName]: param };
  }
  return {
    headerParams:
      paramType === "header" ? { ...headerParams, ...newData } : headerParams,
    urlParams: paramType === "url" ? { ...urlParams, ...newData } : urlParams,
    queryParams:
      paramType === "query" ? { ...queryParams, ...newData } : queryParams,
    data:
      paramType !== "url" && paramType !== "query" && paramType !== "header"
        ? newData
        : data
  };
};

/**
 * Here you can build the authorization token if you want...
 */
const fakeAuth = () => {
  return {
    Authorization: "Bearer faketoken"
  };
};

const createService = config => async params => {
  const method = (config.method || "get").toLowerCase();
  const { authRequired } = config;
  const { headerParams, queryParams, data } = Object.keys(params || {}).reduce(
    (result, paramName) => ({
      ...processParam(
        result,
        config.paramTypes || {},
        paramName,
        params[paramName]
      )
    }),
    {}
  );

  return axios({
    ...{
      ...config,
      ...{
        headers: {
          Accept: "application/json",
          ...getLanguageHeaders(),
          ...(!authRequired ? "" : fakeAuth()),
          ...headerParams
        }
      }
    },
    method,
    url:
      (config.baseURL || "") +
      replaceUrlParams(config.url, params) +
      encodeQueryParams(queryParams),
    data
  });
};

export default (servicesCfg, baseCfg) => {
  const services = Object.keys(servicesCfg).reduce(
    (result, name) => ({
      ...result,
      [name]: createService({ ...(baseCfg || {}), ...servicesCfg[name] })
    }),
    {}
  );
  return services;
};
