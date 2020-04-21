import React from "react";

/**
 * It's a higher order component which check that is there any data in the window.ssrData or in ssrData for the given providerName
 * if yes, then the initial state will be the found data
 * @param {*} WrappedComponent
 * @param {*} providerName
 */
const withSSR = (WrappedComponent, initialState, providerName) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    setInitialStateSSR(data) {
      const providerData = data.find(p => p.provider === providerName);
      let state = {};
      if (providerData) {
        state = {};
        providerData.services.forEach(serviceData => {
          state[serviceData.stateName] = serviceData.payload;
        });
      }
      return state;
    }

    render() {
      // SSR
      let initState = { ...initialState };

      if (this.props.ssrData && this.props.ssrData) {
        initState = { ...this.setInitialStateSSR(this.props.ssrData), ssr: true };
      } else if (
        typeof window !== "undefined" &&
        window !== null &&
        window.ssrData
      ) {
        initState = this.setInitialStateSSR(window.ssrData);
      }
      
      //console.log(`${providerName}'s initial state is `, initState);

      return <WrappedComponent {...this.props} initState={initState} />;
    }
  };
};

export default withSSR;
