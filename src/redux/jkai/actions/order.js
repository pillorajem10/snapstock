//api
import { fetchOrderByParams, fetchOrder, updateOrder, addOrderItem, fetchOrderItemByParams, createOrder } from '../../../services/api/order';
import axios from 'axios';

//types
import * as types from '../types';

//GET LIST
export const getOrdersByParams = (payload) => (dispatch) => {
  return fetchOrderByParams(payload).then((res) => {
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



//ADD ORDER
export const addOrder = (payload) => (dispatch) => {
  return createOrder(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.ORDER_ADD_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.ORDER_ADD_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};



//GET DETAILS BY
export const getOrderDetails = (payload) => (dispatch) => {
  return fetchOrder(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.ORDER_DETAILS_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: types.ORDER_DETAILS_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};



//GET LIST OF ORDER ITEM
export const getOrdersItemsByParams = (payload) => (dispatch) => {
  return fetchOrderItemByParams(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.ORDER_ITEM_LIST_SUCCESS,
        payload: res.data.docs,
      });

    } else {
      dispatch({
        type: types.ORDER_ITEM_LIST_FAIL,
        payload: res.msg,
      });
    }

    // console.log("RESSSSSSSSSSS ITEM LIST", res)

    return res;
  });
};



export const addItem = (payload) => () => {
  return addOrderItem(payload).then((res) => {
    return res;
  });
};


/*
//ADD ORDER ITEMS
export const addItem = (payload) => (dispatch) => {
  return addOrderItem(payload).then((res) => {
    console.log("RESSSSSSSSSSS ADD ITEM", res)

    if (res.success) {
      dispatch({
        type: types.ORDER_ADD_ITEM_SUCCESS,
        payload: res.data,
      });
    } else {
      console.log("RESSSSSSS MSG", res.msg);
      dispatch({
        type: types.ORDER_ADD_ITEM_FAIL,
        payload: res.msg,
      });
    }


    return res;
  });
};
*/




//UPDATE DETAILS BY
export const updateOrderDetails = (payload) => (dispatch) => {
  return updateOrder(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.ORDER_UPDATE_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: types.ORDER_UPDATE_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};
