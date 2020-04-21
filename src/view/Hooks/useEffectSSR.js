import { useEffect } from "react";

//Just for SSR, store by id, that is fn already executed, or not
let runHistory = [];

const myEffect = (fn, arr, id) => {
  const idHash = id.toString();
  if (runHistory.indexOf(idHash) === -1) {
    runHistory.push(idHash);
    fn();
  }
};

/**
 * Custom useEffect, which will only call the content of useEffect hook once on server side
 * On client side it will work on it's original way
 */
export const useEffectSSR =
  typeof window === "undefined" ? myEffect : useEffect;
