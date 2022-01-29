import * as types from '../types';

const initialState = {
  error: null,
  products: null,
  product: {},
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case types.PRODUCT_LIST_SUCCESS:
      return { ...state, loading: false, products: action.payload };

    case types.PRODUCT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    case types.PRODUCT_GET_SUCCESS:
      return { ...state, loading: false, product: action.payload };

    case types.PRODUCT_GET_FAIL:
      return { ...state, loading: false, error: action.payload };

    case types.PRODUCT_UPDATE_SUCCESS:
      return { ...state, loading: false, product: action.payload };

    case types.PRODUCT_UPDATE_FAIL:
      return { ...state, loading: false, error: action.payload };

    case types.PRODUCT_ADD_STOCKS_SUCCESS:
      return { ...state, loading: false, product: action.payload };

    case types.PRODUCT_ADD_STOCKS_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}


export default reducer;
