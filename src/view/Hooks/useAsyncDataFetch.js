import { useState } from "react";
import { useEffectSSR } from './useEffectSSR';
import PropTypes from 'prop-types';

/**
 * SSR Custom hook which returns isLoading false in case of server-side rendering
 * otherwise it load data fro mserver and set isLoading to false
 * @param {*} param0 
 * @param {*} ssr 
 */
const useAsyncDataFetch =  ({ promiseFn, dispatch }, ssr = false, params = {}  ) => {
    const [isLoading, setIsLoading] = useState(false);
    
    useEffectSSR(() => {
        if (ssr || (typeof window !== 'undefined' && window !== null && window.ssrData)){
            setIsLoading(false);
        } else {
            setIsLoading(true);
            promiseFn({ dispatch, ...params }).then(()=> {}).finally(()=>{
                 setIsLoading(false);
             });
        }
    }, [], promiseFn);

    return  { isLoading };
}

useAsyncDataFetch.propTypes = {
    ssr: PropTypes.bool,
    params: PropTypes.object
}

useAsyncDataFetch.defaultProps = {
    ssr: false,
    params: {}
}

export default useAsyncDataFetch; 