//api
import { fetchProductByParams, fetchProduct, updateProductById,
addStocksById, addNewProduct, deleteProductById } from '../../../services/api/product';

//types
import * as types from '../types';

//GET LIST
export const getProductsByParams = (payload) => (dispatch) => {
  return fetchProductByParams(payload).then((res) => {
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


//ADD PRODUCT
export const addProduct = (payload) => (dispatch) => {
  return addNewProduct(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.PRODUCT_ADD_STOCKS_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.PRODUCT_ADD_STOCKS_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};



export const getProduct = (payload) => (dispatch) => {
  console.log("DITO YON")
  return fetchProduct(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.PRODUCT_GET_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      console.log("ERRORRRRRRRR BRAD")
      dispatch({
        type: types.PRODUCT_GET_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};


//UPDATE DETAILS BY
export const updateProduct = (payload) => (dispatch) => {
  return updateProductById(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.PRODUCT_UPDATE_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: types.PRODUCT_UPDATE_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};

export const removeProduct = (payload) => (dispatch) => {
  return deleteProductById(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.PRODUCT_DELETE_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: types.PRODUCT_DELETE_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};

export const addStocks = (payload) => (dispatch) => {
  return addStocksById(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.PRODUCT_ADD_STOCKS_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.PRODUCT_ADD_STOCKS_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};
