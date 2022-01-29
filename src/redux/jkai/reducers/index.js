import { combineReducers } from 'redux';

import product from './product';
import order from './order';
import delivery from './delivery';

const reducer = combineReducers({
  product,
  order,
  delivery
});

export default reducer;
