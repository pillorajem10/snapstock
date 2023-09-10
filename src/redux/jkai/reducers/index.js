import { combineReducers } from 'redux';

import product from './product';
import order from './order';
import delivery from './delivery';
import user from './user';

const reducer = combineReducers({
  product,
  order,
  delivery,
  user
});

export default reducer;
