import React from "react";
import { mount } from "enzyme";
import CarList from "../view/CarList";
import { CarProvider } from "../state/context";
import { setCars } from "../state/actions";
import { useAsync } from "react-async";
jest.mock("react-async");

const CarListWithProvider = () => {
  return (
    <CarProvider>
      <CarList />
    </CarProvider>
  );
};

describe("Test the car list", () => {
  let wrapper = null;
  let dataIsLoaded = false;

  beforeEach(() => {
    dataIsLoaded = false;

    useAsync.mockImplementation(({ dispatch }) => {
      if (!dataIsLoaded) {
        dispatch(
          setCars([
            { id: 1, name: "Audi", color: "white" },
            { id: 2, name: "Ferrari", color: "red" },
            { id: 3, name: "Lada", color: "brown" },
            { id: 4, name: "Trabant", color: "blue" },
            { id: 5, name: "Mercedes", color: "white" },
            { id: 6, name: "Bmw", color: "gray" },
            { id: 7, name: "Citroen", color: "yellow" },
            { id: 8, name: "Ford", color: "green" }
          ])
        );
        dataIsLoaded = true;
      }

      return {
        isLoading: false
      };
    });

    wrapper = mount(<CarListWithProvider />);
  });

  // Create our first test case
  it("display the 8 cars properly", () => {
    if (wrapper) {
      const carList = wrapper.find('[data-testid="car-list"]');
      expect(carList.exists()).toEqual(true);
      expect(carList.find('[data-testid="car"]').length).toEqual(8);
    }
  });

  it("delete a car with delete button", () => {
    if (wrapper) {
      const carList = wrapper.find('[data-testid="car-list"]');
      const firstCar = carList.find('[data-testid="car"]').first();
      const deleteBtn = firstCar.find('[data-testid="btn-delete"]').first();

      deleteBtn.simulate("click");

      expect(
        wrapper.find('[data-testid="car-list"]').find('[data-testid="car"]')
          .length
      ).toEqual(7);
    }
  });

  afterEach(() => {
    console.log("TEST FINISHED, UNMOUNT...");
    if (wrapper) {
      wrapper.unmount();
      useAsync.mockReset();
    }
  });
});
