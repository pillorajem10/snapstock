//api
import { fetchOrderByParams } from '../../services/api/order';

//types
import * as types from '../types';

//GET LIST
export const getOrdersByParams = (payload) => (dispatch) => {
  return fetchOrderByParams(payload).then((res) => {
    dispatch({ type: types.ORDER_LIST_REQUEST });
    if (res.success) {
      dispatch({
        type: types.ORDER_LIST_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.ORDER_LIST_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};
