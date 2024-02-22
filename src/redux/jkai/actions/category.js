//api
import { fetchCategory, updateCategoryById, fetchCategoriesByParams } from '../../../services/api/category';

//types
import * as types from '../types';

export const getCategories = (payload) => (dispatch) => {
  return fetchCategoriesByParams(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.CATEGORY_LIST_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.CATEGORY_LIST_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};

export const getCategory = (payload) => (dispatch) => {
  // console.log("DITO YON")
  return fetchCategory(payload).then((res) => {
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
export const updateCategory = (payload) => async (dispatch) => {
  try {
    const res = await updateCategoryById(payload);
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
