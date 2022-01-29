import * as types from '../types';

const initialState = {
  error: null,
  deliveries: null,
  delivery: {},
};

const reducer = (state = initialState, action) => {
  switch(action.type){

    case types.DELIVERY_LIST_SUCCESS:
      return { ...state, deliveries: action.payload };

    case types.DELIVERY_LIST_FAIL:
      return { ...state, error: action.payload };

    case types.DELIVERY_ADD_SUCCESS:
      return { ...state, delivery: action.payload };

    case types.DELIVERY_ADD_FAIL:
      return { ...state, error: action.payload };

    case types.DELIVERY_DETAILS_SUCCESS:
      return { ...state, delivery: action.payload };

    case types.DELIVERY_DETAILS_FAIL:
      return { ...state, error: action.payload };

    default:
      return state;
  }
}


export default reducer;
