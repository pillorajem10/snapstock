//api
import { fetchProductByParams } from '../../services/api/product';

//types
import * as types from '../types';

//GET LIST
export const getProductsByParams = (payload) => (dispatch) => {
  return fetchProductByParams(payload).then((res) => {
    dispatch({ type: types.PRODUCT_LIST_REQUEST });
    if (res.success) {
      dispatch({
        type: types.PRODUCT_LIST_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.PRODUCT_LIST_FAIL,
        payload: res.msg,
      });
    }
    
    return res;
  });
};
