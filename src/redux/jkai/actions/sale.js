//api
import { fetchSale, updateSaleById, fetchSalesByParams, deleteSaleById, addNewSale } from '../../../services/api/sale';

//types
import * as types from '../types';

export const getSales = (payload) => (dispatch) => {
  return fetchSalesByParams(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.SALE_LIST_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.SALE_LIST_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};

export const addSale = (payload) => (dispatch) => {
  return addNewSale(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.SALE_ADD_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.SALE_ADD_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};

export const removeSale = (payload) => (dispatch) => {
  return deleteSaleById(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.SALE_DELETE_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: types.SALE_DELETE_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};

/*
export const getSale = (payload) => (dispatch) => {
  // console.log("DITO YON")
  return fetchSale(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.CATEGORY_GET_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      // console.log("ERRORRRRRRRR BRAD")
      dispatch({
        type: types.CATEGORY_GET_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};

//UPDATE DETAILS BY
export const updateSale = (payload) => async (dispatch) => {
  try {
    const res = await updateSaleById(payload);
    const { success, data, msg } = res;

    console.log('RESPONSEEEE', res);

    if (success) {
      dispatch({
        type: types.CATEGORY_UPDATE_SUCCESS,
        payload: res.data,
      });
    }

    return res; // Return the response object in both success and error cases

  } catch (err) {
    return dispatch({
      type: types.CATEGORY_UPDATE_FAIL,
      payload: err.response.data.msg,
    });
  }
};

export const removeSale = (payload) => (dispatch) => {
  return deleteSaleById(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.CATEGORY_DELETE_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: types.CATEGORY_DELETE_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};
*/
