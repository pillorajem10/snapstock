import * as types from '../types';

const initialState = {
  loading: false,
  error: null,
  products: null,
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case types.PRODUCT_LIST_REQUEST:
      return { ...state, loading: true};

    case types.PRODUCT_LIST_SUCCESS:
      return { ...state, loading: false, products: action.payload };

    case types.PRODUCT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}


export default reducer;
