import { combineReducers } from 'redux';

import product from './product';
import order from './order';

const reducer = combineReducers({
  product,
  order
});

export default reducer;
