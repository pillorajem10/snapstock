import * as types from '../types';

const initialState = {
  error: null,
  categories: null,
  category: {},
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    /*case types.CATEGORY_LIST_SUCCESS:
      return { ...state, loading: false, categories: action.payload };

    case types.CATEGORY_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };*/

    case types.CATEGORY_GET_SUCCESS:
      return { ...state, loading: false, category: action.payload };

    case types.CATEGORY_GET_FAIL:
      return { ...state, loading: false, error: action.payload };

    /*case types.CATEGORY_UPDATE_SUCCESS:
      return { ...state, loading: false, category: action.payload };

    case types.CATEGORY_UPDATE_FAIL:
      return { ...state, loading: false, error: action.payload };

    case types.CATEGORY_ADD_STOCKS_SUCCESS:
      return { ...state, loading: false, category: action.payload };

    case types.CATEGORY_ADD_STOCKS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case types.CATEGORY_ADD_SUCCESS:
      return { ...state, loading: false, category: action.payload };

    case types.CATEGORY_ADD_FAIL:
      return { ...state, loading: false, error: action.payload };*/

    default:
      return state;
  }
}


export default reducer;
