//api
import { fetchNotificationByParams } from '../../../services/api/notification';

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
