import React, { Fragment } from "react";
import { useCarState, useCarDispatch } from "../state/context";
import { getCars, deleteCar, getEmployee } from "../state/actions";
import useAsyncDataFetch from "./Hooks/useAsyncDataFetch";
import { withTranslation } from 'react-i18next';

const CarList = ({ t }) => {
  const { cars, ssr, employee } = useCarState();
  const dispatch = useCarDispatch();

  const { isLoading } = useAsyncDataFetch(
    { promiseFn: getCars, dispatch },
    ssr
  );
  const { isLoading: isLoadingEmp } = useAsyncDataFetch(
    { promiseFn: getEmployee, dispatch },
    ssr
  );

  const removeCar = id => {
    deleteCar({ dispatch, id });
  };

  const refresh = () => {
    getCars({ dispatch });
  };

  if (isLoading || isLoadingEmp) return <Fragment>Loading...</Fragment>;

  return (
    <div className="App">
      <div className="title">{t('labelEmployee')}</div>

      <div className="employee-list" data-testid="employee-list">
        {employee.map(u => {
          return (
            <span className="employee" key={u.id}>
              {u.name}
            </span>
          );
        })}
      </div>

      <div className="title">{t('labelCars')}</div>

      <button className="btn" onClick={refresh}>
        {t('labelRefresh')}
      </button>

      <div className="car-list" data-testid="car-list">
        {cars.map(car => {
          return (
            <div className="list-content" key={car.name} data-testid="car">
              <div className="cell">
                <a className="btn-select" href={`/cars/${car.id}`}>
                  {t('labelSelect')}
                </a>
              </div>
              <div className="cell">
                <b>{car.name}</b>
              </div>
              <div className="cell car-color" style={{ background: car.color }}>
                {car.color}
              </div>
              <div className="cell">
                <button
                  data-testid="btn-delete"
                  onClick={() => removeCar(car.id)}
                >
                  {t('labelDelete')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default withTranslation()(CarList);
