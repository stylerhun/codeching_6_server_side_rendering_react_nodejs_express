import services from "../api/services";
import constants from "./constants";

export const setCars = payload => {
  return {
    payload,
    type: constants.GET_CARS
  };
};

const getCars = ({ dispatch }) => {
  //here you can show the progress bar later....

  //Get cars
  return services
    .getCars()
    .then(result => {
      dispatch(setCars(result.data));
    })
    .catch(() => {
      dispatch(setCars([]));
    })
    .finally(() => {
      //probably create a global progress bar and here you can hide it
    });
};

const removeCar = id => {
  return {
    payload: id,
    type: constants.REMOVE_CAR
  };
};

const deleteCar = ({ dispatch, id }) => {
  dispatch(removeCar(id));
};

export const setEmployee = payload => {
  return {
    payload,
    type: constants.GET_EMPLOYEE
  };
};

const getEmployee = ({ dispatch }) => {
  //here you can show the progress bar later....

  //Get cars
  return services
    .getEmployee()
    .then(result => {
      dispatch(setEmployee(result.data));
    })
    .catch(() => {
      dispatch(setEmployee([]));
    })
    .finally(() => {
      //probably create a global progress bar and here you can hide it
    });
};


export const setCar = payload => {
  return {
    payload,
    type: constants.GET_CAR
  };
};

const getCar = ({ id, dispatch }) => {
  //here you can show the progress bar later....

  //Get cars
  return services
    .getCar({ id })
    .then(result => {
      dispatch(setCar(result.data));
    })
    .catch(() => {
      dispatch(setCar(null));
    })
    .finally(() => {
      //probably create a global progress bar and here you can hide it
    });
};

export { getCars, getCar, deleteCar, getEmployee };
