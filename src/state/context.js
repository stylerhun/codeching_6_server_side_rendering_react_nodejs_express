import React, { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";
import reducer from "./reducer";
import withSSR from "../HOC/withSSR";

const CarStateContext = createContext();
const CarDispatchContext = createContext();

const useCarState = () => {
  const context = useContext(CarStateContext);
  if (!context) {
    throw Error("useCarState must be used inside CarProvider!");
  }
  return context;
};

const useCarDispatch = () => {
  const context = useContext(CarDispatchContext);
  if (!context) {
    throw Error("useCarDispatch must be used inside CarProvider!");
  }
  return context;
};

const initialState = {
  cars: [],
  employee: [],
  car: {}
};

const CarProvider = ({ initState, children }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <CarStateContext.Provider value={state}>
      <CarDispatchContext.Provider value={dispatch}>
        {children}
      </CarDispatchContext.Provider>
    </CarStateContext.Provider>
  );
};

CarProvider.propTypes = {
  initState: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

const CarProviderSSR = withSSR(CarProvider, initialState, "CarProvider");
export { useCarState, useCarDispatch, CarProviderSSR as CarProvider };
