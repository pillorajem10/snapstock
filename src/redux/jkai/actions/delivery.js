//api
import {
  fetchDeliveriesByParams,
  createDelivery,
  fetchDeliveryById,
  updateDeliveryById,
} from '../../../services/api/delivery';

//types
import * as types from '../types';

//GET LIST
export const getDeliveriesByParams = (payload) => (dispatch) => {
  return fetchDeliveriesByParams(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.DELIVERY_LIST_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.DELIVERY_LIST_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};



//ADD DELIVERY
export const addDelivery = (payload) => (dispatch) => {
  return createDelivery(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.DELIVERY_ADD_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.DELIVERY_ADD_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};



//GET DETAILS BY
export const getDeliveryDetails = (payload) => (dispatch) => {
  return fetchDeliveryById(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.DELIVERY_DETAILS_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: types.DELIVERY_DETAILS_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};



//UPDATE DETAILS BY
export const updateDeliveryDetails = (payload) => (dispatch) => {
  return updateDeliveryById(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.DELIVERY_UPDATE_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: types.DELIVERY_UPDATE_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};
