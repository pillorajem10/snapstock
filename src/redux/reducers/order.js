import * as types from '../types';

const initialState = {
  loading: false,
  error: null,
  orders: null,
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case types.ORDER_LIST_REQUEST:
      return { ...state, loading: true};

    case types.ORDER_LIST_SUCCESS:
      return { ...state, loading: false, orders: action.payload };

    case types.ORDER_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}


export default reducer;
