import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import CarList from "./CarList";
import Car from "./Car";

const CarMain = () => {
  return (
    <Fragment>
      <Route exact path={`/`} component={CarList} />
      <Route exact path={`/cars`} component={CarList} />
      <Route exact path={`/cars/:id`} component={Car} />
    </Fragment>
  );
};

export default CarMain;
