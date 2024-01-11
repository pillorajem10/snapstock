//api
import { fetchOrderByParams,
  fetchOrder,
  updateOrder,
  addOrderItem,
  fetchOrderItemByParams,
  createOrder,
  fetchOrderItemById,
  removeOrderItemById,
  updateOrderItemById,
  removeOrderById,
  generatePdfReport
 } from '../../../services/api/order';
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

//ADD ORDER
export const generatePdf = (payload) => (dispatch) => {
  return generatePdfReport(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.ORDDER_GENERATE_PDF_REPORT_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.ORDDER_GENERATE_PDF_REPORT_FAIL,
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

export const getOrderItemDetails = (payload) => (dispatch) => {
  return fetchOrderItemById(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.ORDER_ITEM_DETAILS_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: types.ORDER_ITEM_DETAILS_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};


export const removeOrderItemDetails = (payload) => (dispatch) => {
  return removeOrderItemById(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.ORDER_ITEM_REMOVE_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: types.ORDER_ITEM_REMOVE_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};

export const removeOrderDetails = (payload) => async (dispatch) => {
  try {
    const res = await removeOrderById(payload);
    const { success, data, msg } = res;

    console.log('RESPONSEEEE SA REDUX', res);

    if (success) {
      dispatch({
        type: types.ORDER_REMOVE_SUCCESS,
        payload: res.data.docs,
      });
    }

    return res; // Return the response object in both success and error cases

  } catch (err) {
    return dispatch({
      type: types.ORDER_REMOVE_FAIL,
      payload: err.response.data.msg,
    });
  }
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



/*export const addItem = (payload) => () => {
  return addOrderItem(payload).then((res) => {
    return res;
  });
};*/



//ADD ORDER ITEMS
export const addItem = (payload) => async (dispatch) => {
  try {
    const res = await addOrderItem(payload);
    const { success, data, msg } = res;

    console.log('RESPONSEEEE SA REDUX', res);

    if (success) {
      dispatch({
        type: types.ORDER_ADD_ITEM_SUCCESS,
        payload: res.data.docs,
      });
    }

    return res; // Return the response object in both success and error cases

  } catch (err) {
    return dispatch({
      type: types.ORDER_ADD_ITEM_FAIL,
      payload: err.response.data.msg,
    });
  }
};







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

export const updateOrderItemDetails = (payload) => async (dispatch) => {
  try {
    const res = await updateOrderItemById(payload);
    const { success, data, msg } = res;

    console.log('RESPONSEEEE SA REDUX', res);

    if (success) {
      dispatch({
        type: types.ORDER_ITEM_UPDATE_SUCCESS,
        payload: res.data.docs,
      });
    }

    return res; // Return the response object in both success and error cases

  } catch (err) {
    return dispatch({
      type: types.ORDER_ITEM_UPDATE_FAIL,
      payload: err.response.data.msg,
    });
  }
};
