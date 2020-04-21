import constants from "./constants";

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case constants.GET_CARS: {
      return {
        ...state,
        cars: payload
      };
    }
    case constants.GET_CAR: {
      return {
        ...state,
        car: payload
      };
    }
    case constants.REMOVE_CAR: {
      return {
        ...state,
        cars: state.cars.filter(car => car.id !== payload)
      };
    }
    case constants.GET_EMPLOYEE: {
      return {
        ...state,
        employee: payload
      };
    }
    default:
      return { ...state };
  }
};

export default reducer;
