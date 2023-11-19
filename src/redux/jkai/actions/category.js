//api
import { fetchCategory } from '../../../services/api/category';

//types
import * as types from '../types';

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
