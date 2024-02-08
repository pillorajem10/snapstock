//api
import { fetchNotificationByParams, updateNotification } from '../../../services/api/notification';

//types
import * as types from '../types';

//GET LIST
export const getNotificationsByParams = (payload) => (dispatch) => {
  return fetchNotificationByParams(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.NOTIFICATION_LIST_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.NOTIFICATION_LIST_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};

export const updateNotif  = (payload) => async (dispatch) => {
  try {
    const res = await updateNotification(payload);
    const { success, data, msg } = res;

    console.log('RESPONSEEEE', res);

    if (success) {
      dispatch({
        type: types.NOTIFICATION_UPDATE_SUCCESS,
        payload: res.data,
      });
    }

    return res; // Return the response object in both success and error cases

  } catch (err) {
    return dispatch({
      type: types.NOTIFICATION_UPDATE_FAIL,
      payload: err.response.data.msg,
    });
  }
};
