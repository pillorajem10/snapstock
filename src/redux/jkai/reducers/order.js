import * as types from '../types';

const initialState = {
  item: {},
  orderItems: null,
  error: null,
  orders: null,
  order: {},
};

const reducer = (state = initialState, action) => {
  switch(action.type){

    case types.ORDER_LIST_SUCCESS:
      return { ...state, orders: action.payload };

    case types.ORDER_LIST_FAIL:
      return { ...state, error: action.payload };

    case types.ORDER_DETAILS_SUCCESS:
      return { ...state, order: action.payload };

    case types.ORDER_DETAILS_FAIL:
      return { ...state, error: action.payload };

    case types.ORDER_UPDATE_SUCCESS:
      return { ...state, order: action.payload };

    case types.ORDER_UPDATE_FAIL:
      return { ...state, error: action.payload };

    case types.ORDER_ADD_ITEM_SUCCESS:
      return { ...state, item: action.payload };

    case types.ORDER_ADD_ITEM_FAIL:
      return { ...state, error: action.payload };

    case types.ORDER_ITEM_LIST_SUCCESS:
      return { ...state, orderItems: action.payload };

    case types.ORDER_ITEM_LIST_FAIL:
      return { ...state, error: action.payload };

    default:
      return state;
  }
}


export default reducer;
